"""BOSS 招聘完整工作流: 提问+索简历 → 收集回复 → 下载简历。

一个 Skill 按顺序执行三个阶段，可配置定时自动运行。
"""

from __future__ import annotations

import asyncio
import logging
import random
from datetime import datetime, timezone
from typing import Optional

from playwright.async_api import Page

import config
from api.websocket import ConnectionManager
from services.skill_registry import register_skill
from services.checkpoint import CheckpointManager
from services import candidate_store
from services.boss_skill import (
    BOSS_CHAT_URL,
    SEL_CANDIDATE, SEL_NAME, SEL_SOURCE_JOB, SEL_BADGE,
    SEL_FILTER_NEW, SEL_FILTER_RESUME,
    SEL_CHAT_INPUT, SEL_SEND_BTN,
    SEL_RESUME_BTN_FILE, SEL_REQUEST_RESUME,
    SEL_MSG_FRIEND,
)
from services.boss_file_manager import save_resume, is_downloaded
from browser.humanize import (
    short_delay,
    _wait_page_load, _wait_after_filter, _wait_before_action,
    _wait_after_click, _wait_after_send, _wait_between_candidates,
    _wait_batch_break,
)
from utils.logger import log_action, log_error

_logger = logging.getLogger("boss_workflow")


@register_skill
class BossWorkflowSkill:
    """BOSS 招聘完整工作流。

    Phase 1: 提问+索简历 — 筛选新招呼，发招呼+问题+索简历
    Phase 2: 收集回复 — 筛选未读，收集已提问候选人的回复
    Phase 3: 下载简历 — 筛选已获取简历，下载附件
    """

    NAME = "boss_workflow"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "BOSS 招聘完整流程：提问+索简历 → 收集回复 → 下载简历"
    PARAMS_SCHEMA = {
        "reply_text": {"type": "str", "description": "打招呼话术", "required": False},
        "position_questions": {"type": "str", "description": "JSON: 岗位→问题映射, 如 {\"AI产品\":\"你有什么经验？\"}", "required": False},
        "max_per_run": {"type": "int", "description": "每次最多处理人数", "required": False},
        "feishu_url": {"type": "str", "description": "飞书多维表格URL（可选，填写后自动同步候选人数据）", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._paused = asyncio.Event()
        self._paused.set()

    def stop(self) -> None:
        self._running = False
        self._paused.set()

    def pause(self) -> None:
        self._paused.clear()

    def resume(self) -> None:
        self._paused.set()

    async def _wait_if_paused(self) -> None:
        if not self._paused.is_set():
            await self._ws.send_status("Skill 已暂停，等待释放控制权...")
            for _ in range(36):  # 36 * 5s = 3 minutes max
                try:
                    await asyncio.wait_for(self._paused.wait(), timeout=5)
                    return
                except asyncio.TimeoutError:
                    if not self._running:
                        return
            await self._ws.send_status("等待超时，自动恢复执行...")
            self._paused.set()

    async def run(
        self,
        reply_text: Optional[str] = None,
        position_questions: Optional[dict[str, str]] = None,
        max_per_run: int = 20,
    ) -> None:
        self._running = True
        self._max = max_per_run
        reply = reply_text or config.DEFAULT_REPLY
        pos_q = position_questions or {}

        results = {"engage": {}, "collect": {}, "download": {}}

        # Phase 1: 提问+索简历
        if self._running:
            await self._ws.send_status("═══ Phase 1: 提问+索简历 ═══")
            results["engage"] = await self._phase_engage(reply, pos_q, self._max)

        # Phase 2: 收集回复
        if self._running:
            await self._ws.send_status("═══ Phase 2: 收集回复 ═══")
            results["collect"] = await self._phase_collect()

        # Phase 3: 下载简历
        if self._running:
            await self._ws.send_status("═══ Phase 3: 下载简历 ═══")
            results["download"] = await self._phase_download()

        # Summary + download links
        e = results["engage"]
        c = results["collect"]
        d = results["download"]
        summary = (
            f"完成！提问 {e.get('processed', 0)} 人，"
            f"收集 {c.get('collected', 0)} 人回复，"
            f"下载 {d.get('downloaded', 0)} 份简历"
        )
        await self._ws.send_complete(summary)

        # Send CSV and ZIP download links
        await self._ws.send_file("候选人数据.csv", "/api/candidates/csv")
        await self._ws.send_file("全部简历.zip", "/api/resumes/zip")

        self._running = False

    # ========== Phase 1: 提问+索简历 ==========

    def _match_question(self, position: str, pos_q: dict[str, str]) -> str:
        """Fuzzy match position to configured questions."""
        if not pos_q:
            return ""
        # Exact match first
        if position in pos_q:
            return pos_q[position]
        # Substring match: if configured key is contained in position or vice versa
        for key, question in pos_q.items():
            if key in position or position in key:
                return question
        return ""

    async def _phase_engage(self, reply: str, pos_q: dict[str, str], max_count: int = 20) -> dict:
        ckpt = CheckpointManager("boss_engage")
        processed = 0
        requested = 0
        skipped = 0
        errors = 0

        try:
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            # Read real total from tab label before clicking
            real_total = 0
            try:
                tab = self._page.locator(SEL_FILTER_NEW).first
                tab_text = (await tab.text_content() or "").strip()
                # Extract number from "新招呼(53)" format
                import re
                m = re.search(r'\((\d+)\)', tab_text)
                if m:
                    real_total = int(m.group(1))
                await tab.click()
                await _wait_after_filter()
            except Exception:
                await self._ws.send_status("未找到新招呼筛选，使用全部列表")

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            loaded = len(candidates)
            display_total = real_total if real_total > 0 else loaded
            await self._ws.send_status(
                f"新招呼: {display_total} 人（页面加载 {loaded} 人，本次最多处理 {max_count} 人）"
                + (f"，{len(pos_q)} 个岗位已配置问题" if pos_q else "")
            )

            for i in range(loaded):
                if not self._running:
                    break
                if processed >= max_count:
                    await self._ws.send_status(f"已达到本次上限 {max_count} 人，停止提问阶段")
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                cand = candidates[i]

                name = await self._get_text(cand, SEL_NAME)
                position = await self._get_text(cand, SEL_SOURCE_JOB)
                data_id = await self._get_data_id(cand, i)

                if ckpt.is_processed(data_id):
                    skipped += 1
                    continue

                await self._ws.send_status(f"[{processed+1}/{max_count}] {name} ({position})")

                try:
                    await self._wait_if_paused()
                    # Captcha check before each candidate
                    if await self._check_captcha():
                        if not await self._handle_captcha():
                            break

                    await _wait_before_action()
                    await self._human_click(cand)
                    await _wait_after_click()

                    # Send greeting
                    await self._send_message(reply)

                    # Match question by position
                    question = self._match_question(position, pos_q)
                    if question:
                        await asyncio.sleep(random.uniform(2, 5))
                        await self._send_message(question)
                        await self._ws.send_status(f"{name} 已发送问题")

                    if await self._request_resume(name):
                        requested += 1

                    candidate_store.upsert(
                        boss_id=data_id, name=name, position=position,
                        status="engaged",
                        engaged_at=datetime.now(timezone.utc).isoformat(),
                        questions=[question] if question else [],
                    )
                    processed += 1
                    ckpt.mark_processed(data_id)

                except Exception as e:
                    errors += 1
                    await self._ws.send_error(f"{name}: {str(e)[:60]}")

                wait = await _wait_between_candidates()
                await self._ws.send_status(f"等待 {wait:.0f} 秒...")
                await asyncio.sleep(wait)
                pause = await _wait_batch_break(processed)
                if pause > 0:
                    await self._ws.send_status(f"休息 {pause:.0f} 秒...")
                    await asyncio.sleep(pause)

        except Exception as e:
            await self._ws.send_error(f"提问阶段错误: {str(e)[:100]}")

        # Reset checkpoint after phase completes — avoid infinite accumulation
        ckpt.reset()
        await self._ws.send_status(f"提问完成: {processed} 人，索取 {requested} 份简历，跳过 {skipped}")
        return {"processed": processed, "requested": requested, "skipped": skipped, "errors": errors}

    # ========== Phase 2: 收集回复 ==========

    async def _phase_collect(self) -> dict:
        collected = 0
        skipped = 0

        try:
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            # Click "未读" filter
            try:
                unread = self._page.locator('.chat-message-filter-left span', has_text='未读')
                if await unread.count() > 0:
                    await unread.first.click()
                    await _wait_after_filter()
                else:
                    await self._ws.send_status("未找到未读筛选")
            except Exception:
                pass

            engaged = {c["boss_id"]: c for c in candidate_store.list_by_status("engaged")}
            if not engaged:
                await self._ws.send_status("没有待收集回复的候选人")
                return {"collected": 0, "skipped": 0}

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"未读: {total} 人，待收集: {len(engaged)} 人")

            for i in range(total):
                if not self._running:
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                cand = candidates[i]

                data_id = await self._get_data_id(cand, i)
                name = await self._get_text(cand, SEL_NAME)

                if data_id not in engaged:
                    skipped += 1
                    continue

                try:
                    if await self._check_captcha():
                        if not await self._handle_captcha():
                            break
                    await _wait_before_action()
                    await self._human_click(cand)
                    await _wait_after_click()

                    replies = await self._read_replies()
                    if replies:
                        position = await self._get_text(cand, SEL_SOURCE_JOB)
                        candidate_store.upsert(
                            boss_id=data_id, replies=replies, status="replied",
                            replied_at=datetime.now(timezone.utc).isoformat(),
                        )
                        await self._ws.send_status(f"{name} 收到 {len(replies)} 条回复")
                        collected += 1

                except Exception as e:
                    await self._ws.send_error(f"{name} 收集失败: {str(e)[:60]}")

                await asyncio.sleep(random.uniform(3, 8))

        except Exception as e:
            await self._ws.send_error(f"收集阶段错误: {str(e)[:100]}")

        await self._ws.send_status(f"收集完成: {collected} 人有回复，跳过 {skipped}")
        return {"collected": collected, "skipped": skipped}

    # ========== Phase 3: 下载简历 ==========

    async def _phase_download(self) -> dict:
        ckpt = CheckpointManager("boss_download")
        downloaded = 0
        skipped = 0

        try:
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            try:
                await self._page.locator(SEL_FILTER_RESUME).first.click()
                await _wait_after_filter()
            except Exception:
                await self._ws.send_status("未找到已获取简历筛选")
                return {"downloaded": 0, "skipped": 0}

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"已获取简历: {total} 人")

            for i in range(total):
                if not self._running:
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                cand = candidates[i]

                name = await self._get_text(cand, SEL_NAME)
                position = await self._get_text(cand, SEL_SOURCE_JOB)
                data_id = await self._get_data_id(cand, i)

                if ckpt.is_processed(data_id) or is_downloaded(data_id):
                    skipped += 1
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] 下载: {name}")

                try:
                    if await self._check_captcha():
                        if not await self._handle_captcha():
                            break
                    await _wait_before_action()
                    await self._human_click(cand)
                    await _wait_after_click()

                    ok = await self._download_resume(name, position, data_id)
                    if ok:
                        downloaded += 1
                    ckpt.mark_processed(data_id)

                except Exception as e:
                    await self._ws.send_error(f"{name} 下载失败: {str(e)[:60]}")

                wait = await _wait_between_candidates()
                await asyncio.sleep(wait)

        except Exception as e:
            await self._ws.send_error(f"下载阶段错误: {str(e)[:100]}")

        await self._ws.send_status(f"下载完成: {downloaded} 份，跳过 {skipped}")
        return {"downloaded": downloaded, "skipped": skipped}

    # ========== Helpers ==========

    async def _send_message(self, text: str) -> None:
        editor = self._page.locator(SEL_CHAT_INPUT)
        if await editor.count() == 0:
            return
        await editor.click()
        await short_delay()
        await self._page.keyboard.type(text, delay=random.randint(50, 150))
        await short_delay()
        btn = self._page.locator(SEL_SEND_BTN)
        if await btn.count() > 0:
            await btn.first.click()
        else:
            await self._page.keyboard.press("Enter")
        await _wait_after_send()

    async def _request_resume(self, name: str) -> bool:
        btn = self._page.locator(SEL_REQUEST_RESUME, has_text="求简历")
        if await btn.count() == 0:
            return False
        try:
            await _wait_before_action()
            await btn.first.click()
            await _wait_after_click()
            parent = self._page.locator(".operate-icon-item", has_text="索取简历")
            confirm = parent.locator("text=确定").last
            if await confirm.count() > 0:
                await confirm.click(timeout=3000)
                await _wait_after_click()
                await self._ws.send_status(f"{name} 已索取简历")
                return True
            all_confirm = self._page.locator("text=确定")
            count = await all_confirm.count()
            if count > 0:
                await all_confirm.nth(count - 1).click(timeout=3000)
                await _wait_after_click()
                return True
            return False
        except Exception:
            try:
                await self._page.keyboard.press("Escape")
            except Exception:
                pass
            return False

    async def _read_replies(self) -> list[str]:
        messages = await self._page.evaluate("""() => {
            const results = [];
            const items = document.querySelectorAll('[class*=item-mine], [class*=item-friend]');
            for (const item of items) {
                const textEl = item.querySelector('.text');
                if (!textEl) continue;
                const text = textEl.textContent.trim();
                if (!text) continue;
                if (item.className.includes('item-mine')) {
                    results.push({type: 'mine', text: text.slice(0, 200)});
                } else if (item.className.includes('item-friend')) {
                    results.push({type: 'friend', text: text.slice(0, 200)});
                }
            }
            return results;
        }""")
        if not messages:
            return []
        last_mine = -1
        for idx, msg in enumerate(messages):
            if msg["type"] == "mine":
                last_mine = idx
        if last_mine == -1:
            return []
        return [m["text"] for m in messages[last_mine + 1:] if m["type"] == "friend"]

    async def _download_resume(self, name: str, position: str, boss_id: str) -> bool:
        file_btn = self._page.locator(SEL_RESUME_BTN_FILE)
        if await file_btn.count() == 0:
            return False
        is_disabled = await file_btn.first.evaluate("el => el.classList.contains('disabled')")
        if is_disabled:
            return False
        await file_btn.first.click()
        await asyncio.sleep(random.uniform(3, 7))
        try:
            dl_icon = self._page.locator(".icon-content", has_text="下载")
            if await dl_icon.count() > 0:
                async with self._page.expect_download(timeout=15000) as dl_info:
                    await dl_icon.first.click()
                download = await dl_info.value
                filename = download.suggested_filename or f"{name}.pdf"
                temp_path = config.DOWNLOAD_DIR / filename
                await download.save_as(str(temp_path))
                entry = save_resume(src_path=temp_path, candidate=name, position=position, boss_id=boss_id)
                await self._ws.send_file(
                    entry["filename"],
                    f"/api/resumes/{entry['date']}/{entry['position']}/{entry['filename']}",
                )
                await self._ws.send_status(f"{name} 简历已下载")
                try:
                    close = self._page.locator(".boss-popup__close, .icon-close")
                    if await close.count() > 0:
                        await close.first.click()
                except Exception:
                    pass
                return True
        except Exception as e:
            await self._ws.send_status(f"{name} 下载失败: {str(e)[:60]}")
        try:
            close = self._page.locator(".boss-popup__close, .icon-close")
            if await close.count() > 0:
                await close.first.click()
        except Exception:
            await self._page.keyboard.press("Escape")
        return False

    async def _human_click(self, element) -> None:
        """Move mouse to element with random offset, then click."""
        try:
            box = await element.bounding_box()
            if box:
                # Move to element with slight random offset
                target_x = box["x"] + box["width"] / 2 + random.uniform(-5, 5)
                target_y = box["y"] + box["height"] / 2 + random.uniform(-3, 3)
                # Move in 2-3 steps to simulate natural mouse movement
                cur_x = random.uniform(200, 600)
                cur_y = random.uniform(200, 400)
                steps = random.randint(2, 4)
                for step in range(steps):
                    frac = (step + 1) / steps
                    x = cur_x + (target_x - cur_x) * frac + random.uniform(-3, 3)
                    y = cur_y + (target_y - cur_y) * frac + random.uniform(-2, 2)
                    await self._page.mouse.move(x, y)
                    await asyncio.sleep(random.uniform(0.05, 0.15))
                await element.click()
            else:
                await element.click()
        except Exception:
            await element.click()

    async def _check_captcha(self) -> bool:
        """Check if BOSS has triggered a captcha/verification page.

        Returns True if captcha detected (should pause).
        """
        try:
            page_text = await self._page.evaluate("() => document.body?.innerText?.slice(0, 500) || ''")
            captcha_keywords = ["点击按钮进行验证", "异常访问", "异常行为", "验证码"]
            for kw in captcha_keywords:
                if kw in page_text:
                    return True
        except Exception:
            pass
        return False

    async def _handle_captcha(self) -> bool:
        """Handle captcha: wait and retry. Returns True if resolved."""
        for attempt in range(3):
            await self._ws.send_error(
                f"检测到风控验证页面，等待 5 分钟后重试（第 {attempt+1}/3 次）"
            )
            await asyncio.sleep(300)  # Wait 5 minutes
            # Try refreshing the page
            try:
                await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
                await _wait_page_load()
                if not await self._check_captcha():
                    await self._ws.send_status("风控已解除，继续执行")
                    return True
            except Exception:
                pass
        await self._ws.send_error("风控未解除，本次执行停止")
        self._running = False
        return False

    async def _get_text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        return ((await el.text_content()) or "").strip() if el else ""

    async def _get_data_id(self, cand, fallback_idx: int) -> str:
        data_id = await cand.get_attribute("data-id") or ""
        if not data_id:
            ph = await cand.evaluate_handle("el => el.closest('[data-id]')")
            if ph:
                data_id = (await ph.get_attribute("data-id")) or f"u_{fallback_idx}"
        return data_id
