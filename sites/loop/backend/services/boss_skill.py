"""BOSS直聘 Skills: DOM-driven browser automation.

Skill 1 (boss_reply): 回复候选人 + 索取简历
Skill 2 (boss_download): 下载已获取的简历
Skill 3 (boss_interview): 向候选人提问并记录回答
"""

from __future__ import annotations

import asyncio
import logging
from pathlib import Path
from typing import Optional

import httpx
from playwright.async_api import Page

import config
from api.websocket import ConnectionManager
import random
from browser.humanize import (
    random_delay, short_delay,
    _wait_page_load, _wait_after_filter, _wait_before_action,
    _wait_after_click, _wait_after_send, _wait_between_candidates,
    _wait_batch_break,
)
from utils.screenshot import capture_screenshot
from utils.logger import log_action, log_error
from services.boss_file_manager import save_resume, is_downloaded
from services.boss_qa_manager import save_qa
from services.skill_registry import register_skill
from services.checkpoint import CheckpointManager

# BOSS直聘 CSS selectors (verified 2026-03-31)
SEL_CANDIDATE = ".geek-item"
SEL_NAME = ".geek-name"
SEL_BADGE = ".badge-count"
SEL_FILTER_NEW = '.chat-label-item[title*="新招呼"]'
SEL_FILTER_RESUME = '.chat-label-item[title="已获取简历"]'
SEL_CHAT_INPUT = ".boss-chat-editor-input"
SEL_SEND_BTN = ".submit"
SEL_RESUME_BTN_ONLINE = "a.resume-btn-online"
SEL_RESUME_BTN_FILE = ".resume-btn-file"
SEL_SOURCE_JOB = ".source-job"
SEL_REQUEST_RESUME = 'span.operate-btn'  # text="求简历"

BOSS_CHAT_URL = "https://www.zhipin.com/web/user/?intent=1&ka=header-boss"


# Wait helpers are now in browser/humanize.py (single source of truth).
# Imported above as _wait_page_load, _wait_before_action, etc.


@register_skill
class BossReplySkill:
    """Skill 1: 回复新招呼的候选人 + 索取简历。

    流程: 筛选"新招呼" → 逐个打开聊天 → 发"你好" → 点"求简历" → 确认
    """

    NAME = "boss_reply"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "回复新招呼的候选人并索取简历"
    PARAMS_SCHEMA = {
        "reply_text": {"type": "str", "description": "回复内容，默认: 你好，感谢关注我们的职位！", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._ckpt = CheckpointManager("boss_reply")

    def stop(self) -> None:
        self._running = False

    async def run(self, reply_text: Optional[str] = None) -> None:
        reply = reply_text or config.DEFAULT_REPLY
        self._running = True
        processed = 0
        requested = 0
        skipped = 0
        errors = 0

        try:
            await self._ws.send_status("正在打开 BOSS 直聘消息页...")
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            # Click "新招呼" filter
            await self._ws.send_status("筛选新招呼的候选人...")
            try:
                await self._page.locator(SEL_FILTER_NEW).first.click()
                await _wait_after_filter()
            except Exception:
                await self._ws.send_status("未找到新招呼筛选，使用全部列表")

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"找到 {total} 个候选人（已处理 {self._ckpt.count()} 个）")

            for i in range(total):
                if not self._running:
                    await self._ws.send_status("任务已停止。")
                    break

                # Re-query DOM (may change after interactions)
                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                candidate = candidates[i]

                name = await self._get_text(candidate, SEL_NAME)
                position = await self._get_text(candidate, SEL_SOURCE_JOB)
                data_id = await candidate.get_attribute("data-id") or ""
                if not data_id:
                    parent_handle = await candidate.evaluate_handle("el => el.closest('[data-id]')")
                    if parent_handle:
                        data_id = (await parent_handle.get_attribute("data-id")) or f"u_{i}"

                # Checkpoint: skip already processed
                if self._ckpt.is_processed(data_id):
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 已处理过，跳过")
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] {name} ({position})")

                try:
                    await _wait_before_action()
                    await candidate.click()
                    await _wait_after_click()

                    # Send reply
                    await self._send_message(reply, name)

                    # Request resume
                    resume_requested = await self._request_resume(name)
                    if resume_requested:
                        requested += 1

                    processed += 1
                    self._ckpt.mark_processed(data_id)
                    log_action("boss_reply", {"name": name, "position": position}, "ok")

                except Exception as e:
                    errors += 1
                    log_error(f"处理 {name} 失败: {str(e)[:100]}")
                    await self._ws.send_error(f"{name} 处理失败: {str(e)[:80]}")

                # Human-like variable wait between candidates
                wait = await _wait_between_candidates()
                await self._ws.send_status(f"等待 {wait:.0f} 秒...")
                await asyncio.sleep(wait)

                # Occasional longer break (varies in frequency and duration)
                pause = await _wait_batch_break(processed)
                if pause > 0:
                    await self._ws.send_status(f"已处理 {processed} 人，休息 {pause:.0f} 秒...")
                    await asyncio.sleep(pause)

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")

        await self._ws.send_complete(
            f"完成！回复 {processed} 人，索取 {requested} 份简历，跳过 {skipped} 人，{errors} 个错误"
        )
        self._running = False

    async def _send_message(self, text: str, name: str) -> None:
        editor = self._page.locator(SEL_CHAT_INPUT)
        if await editor.count() == 0:
            await self._ws.send_status(f"{name} 未找到输入框，跳过")
            return

        await editor.click()
        await short_delay()
        await self._page.keyboard.type(text, delay=random.randint(50, 150))
        await short_delay()

        send_btn = self._page.locator(SEL_SEND_BTN)
        if await send_btn.count() > 0:
            await send_btn.first.click()
            await _wait_after_send()
            await self._ws.send_status(f"{name} 已发送: {text[:15]}...")
        else:
            await self._page.keyboard.press("Enter")
            await _wait_after_send()

    async def _request_resume(self, name: str) -> bool:
        """Click '求简历' button and confirm."""
        btn = self._page.locator(SEL_REQUEST_RESUME, has_text="求简历")
        if await btn.count() == 0:
            await self._ws.send_status(f"{name} 未找到求简历按钮")
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

            # Fallback: try any visible 确定 that just appeared
            all_confirm = self._page.locator("text=确定")
            count = await all_confirm.count()
            if count > 0:
                await all_confirm.nth(count - 1).click(timeout=3000)
                await _wait_after_click()
                await self._ws.send_status(f"{name} 已索取简历")
                return True

            await self._ws.send_status(f"{name} 未找到确定按钮")
            return False

        except Exception as e:
            try:
                await self._page.keyboard.press("Escape")
            except Exception:
                pass
            await self._ws.send_status(f"{name} 索取简历失败: {str(e)[:60]}")
            return False

    async def _get_text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        if el:
            return ((await el.text_content()) or "").strip()
        return ""


@register_skill
class BossDownloadSkill:
    """Skill 2: 下载已获取的简历。

    流程: 筛选"已获取简历" → 逐个打开聊天 → 点"附件简历"下载
    """

    NAME = "boss_download"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "下载已获取简历的候选人的附件简历"
    PARAMS_SCHEMA = {}

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._ckpt = CheckpointManager("boss_download")

    def stop(self) -> None:
        self._running = False

    async def run(self) -> None:
        self._running = True
        downloaded = 0
        skipped = 0
        errors = 0

        try:
            await self._ws.send_status("正在打开 BOSS 直聘消息页...")
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            # Click "已获取简历" filter
            await self._ws.send_status("筛选已获取简历的候选人...")
            try:
                await self._page.locator(SEL_FILTER_RESUME).first.click()
                await _wait_after_filter()
            except Exception:
                await self._ws.send_error("未找到'已获取简历'筛选")
                return

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"找到 {total} 个已获取简历的候选人（已处理 {self._ckpt.count()} 个）")

            for i in range(total):
                if not self._running:
                    await self._ws.send_status("任务已停止。")
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                candidate = candidates[i]

                name = await self._get_text(candidate, SEL_NAME)
                position = await self._get_text(candidate, SEL_SOURCE_JOB)
                data_id = await candidate.get_attribute("data-id") or ""
                if not data_id:
                    parent = await candidate.evaluate_handle("el => el.closest('[data-id]')")
                    if parent:
                        data_id = (await parent.get_attribute("data-id")) or f"u_{i}"

                # Checkpoint: skip already processed
                if self._ckpt.is_processed(data_id):
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 已处理过，跳过")
                    continue

                if is_downloaded(data_id):
                    self._ckpt.mark_processed(data_id)
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 已下载过，跳过")
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] 下载: {name} ({position})")

                try:
                    await _wait_before_action()
                    await candidate.click()
                    await _wait_after_click()

                    ok = await self._download_resume(name, position, data_id)
                    if ok:
                        downloaded += 1
                    self._ckpt.mark_processed(data_id)

                except Exception as e:
                    errors += 1
                    log_error(f"下载 {name} 简历失败: {str(e)[:100]}")
                    await self._ws.send_error(f"{name} 下载失败: {str(e)[:80]}")

                # Human-like variable wait between candidates
                wait = await _wait_between_candidates()
                await self._ws.send_status(f"等待 {wait:.0f} 秒...")
                await asyncio.sleep(wait)

                # Occasional longer break
                pause = await _wait_batch_break(downloaded)
                if pause > 0:
                    await self._ws.send_status(f"已下载 {downloaded} 份，休息 {pause:.0f} 秒...")
                    await asyncio.sleep(pause)

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")

        await self._ws.send_complete(
            f"完成！下载 {downloaded} 份简历，跳过 {skipped} 人，{errors} 个错误"
        )
        self._running = False

    async def _download_resume(self, name: str, position: str, boss_id: str) -> bool:
        """Click 附件简历 → open viewer → click 下载 icon → save file."""
        # Step 1: Check 附件简历 button is enabled
        file_btn = self._page.locator(SEL_RESUME_BTN_FILE)
        if await file_btn.count() == 0:
            await self._ws.send_status(f"{name} 未找到附件简历按钮")
            return False

        is_disabled = await file_btn.first.evaluate(
            "el => el.classList.contains('disabled')"
        )
        if is_disabled:
            await self._ws.send_status(f"{name} 附件简历未就绪（对方还没发）")
            return False

        # Step 2: Click 附件简历 to open the attachment viewer
        await file_btn.first.click()
        await asyncio.sleep(random.uniform(3, 7))

        # Step 3: Click the 下载 icon in the viewer toolbar
        try:
            dl_icon = self._page.locator(".icon-content", has_text="下载")
            if await dl_icon.count() > 0:
                async with self._page.expect_download(timeout=15000) as dl_info:
                    await dl_icon.first.click()
                download = await dl_info.value
                return await self._save_download(download, name, position, boss_id)
            else:
                await self._ws.send_status(f"{name} 未找到下载按钮")
        except Exception as e:
            await self._ws.send_status(f"{name} 下载失败: {str(e)[:80]}")

        # Close viewer
        await self._close_popup()
        return False

    async def _save_download(self, download, name: str, position: str, boss_id: str) -> bool:
        """Save a downloaded file and register in index."""
        filename = download.suggested_filename or f"{name}.pdf"
        temp_path = config.DOWNLOAD_DIR / filename
        await download.save_as(str(temp_path))

        entry = save_resume(
            src_path=temp_path,
            candidate=name,
            position=position,
            boss_id=boss_id,
        )
        await self._ws.send_file(
            entry["filename"],
            f"/api/resumes/{entry['date']}/{entry['position']}/{entry['filename']}",
        )
        await self._ws.send_status(f"{name} 简历已下载: {entry['filename']}")
        await self._close_popup()
        return True

    async def _close_popup(self) -> None:
        try:
            close = self._page.locator(".boss-popup__close, .icon-close")
            if await close.count() > 0:
                await close.first.click()
                await asyncio.sleep(random.uniform(0.5, 2))
        except Exception:
            await self._page.keyboard.press("Escape")

    async def _get_text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        if el:
            return ((await el.text_content()) or "").strip()
        return ""


# ========== Skill 3: Interview ==========

SEL_MSG_FRIEND = ".item-friend .text"


@register_skill
class BossInterviewSkill:
    """Skill 3: 向候选人逐个提问(最多5个)，等待回答并记录 Q&A。"""

    NAME = "boss_interview"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "向候选人逐个提问并记录回答"
    PARAMS_SCHEMA = {
        "q1": {"type": "str", "description": "问题1", "required": True},
        "q2": {"type": "str", "description": "问题2", "required": False},
        "q3": {"type": "str", "description": "问题3", "required": False},
        "q4": {"type": "str", "description": "问题4", "required": False},
        "q5": {"type": "str", "description": "问题5", "required": False},
        "wait_seconds": {"type": "int", "description": "每个问题等待回答秒数，默认60", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._ckpt = CheckpointManager("boss_interview")

    def stop(self) -> None:
        self._running = False

    async def run(self, questions: list[str], wait_seconds: int = 60) -> None:
        self._running = True
        processed = 0
        answered = 0
        skipped = 0
        errors = 0

        if not questions:
            await self._ws.send_error("没有提供问题")
            return

        try:
            await self._ws.send_status("正在打开 BOSS 直聘消息页...")
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            try:
                await self._page.locator(SEL_FILTER_NEW).first.click()
                await _wait_after_filter()
            except Exception:
                pass

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"找到 {total} 个候选人，共 {len(questions)} 个问题（已处理 {self._ckpt.count()} 个）")

            for i in range(total):
                if not self._running:
                    await self._ws.send_status("任务已停止。")
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                candidate = candidates[i]

                name = await self._text(candidate, SEL_NAME)
                position = await self._text(candidate, SEL_SOURCE_JOB)
                data_id = await candidate.get_attribute("data-id") or f"u_{i}"

                # Checkpoint: skip already processed
                if self._ckpt.is_processed(data_id):
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 已提问过，跳过")
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] 提问: {name} ({position})")

                try:
                    await _wait_before_action()
                    await candidate.click()
                    await _wait_after_click()

                    all_answers: list[str] = []

                    for qi, question in enumerate(questions):
                        if not self._running:
                            break

                        await self._send_msg(question)
                        await self._ws.send_status(
                            f"{name} Q{qi+1}: {question[:30]}... 等待{wait_seconds}秒"
                        )

                        answer = await self._wait_reply(wait_seconds)
                        all_answers.append(answer)

                        if answer:
                            await self._ws.send_status(f"{name} A{qi+1}: {answer[:50]}")
                        else:
                            await self._ws.send_status(f"{name} Q{qi+1}: 未收到回答")

                        await asyncio.sleep(random.uniform(2, 6))

                    save_qa(
                        candidate=name, position=position, boss_id=data_id,
                        questions=questions, answers=all_answers,
                    )
                    if any(a for a in all_answers):
                        answered += 1
                    processed += 1
                    self._ckpt.mark_processed(data_id)

                except Exception as e:
                    errors += 1
                    await self._ws.send_error(f"{name} 提问失败: {str(e)[:80]}")

                # Human-like variable wait
                wait = await _wait_between_candidates()
                await asyncio.sleep(wait)

                # Occasional longer break
                pause = await _wait_batch_break(processed)
                if pause > 0:
                    await self._ws.send_status(f"休息 {pause:.0f} 秒...")
                    await asyncio.sleep(pause)

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")

        await self._ws.send_complete(
            f"完成！提问 {processed} 人，{answered} 人有回答，跳过 {skipped} 人，{errors} 个错误"
        )
        self._running = False

    async def _send_msg(self, text: str) -> None:
        editor = self._page.locator(SEL_CHAT_INPUT)
        if await editor.count() == 0:
            return
        await editor.click()
        await short_delay()
        await self._page.keyboard.type(text, delay=random.randint(50, 150))
        await short_delay()
        send = self._page.locator(SEL_SEND_BTN)
        if await send.count() > 0:
            await send.first.click()
        else:
            await self._page.keyboard.press("Enter")
        await _wait_after_send()

    async def _wait_reply(self, timeout: int) -> str:
        """Poll for new candidate message."""
        before = await self._page.locator(SEL_MSG_FRIEND).count()
        elapsed = 0
        while elapsed < timeout and self._running:
            poll_interval = random.uniform(3, 8)
            await asyncio.sleep(poll_interval)
            elapsed += poll_interval
            current = await self._page.locator(SEL_MSG_FRIEND).count()
            if current > before:
                last = self._page.locator(SEL_MSG_FRIEND).last
                return ((await last.text_content()) or "").strip()
        return ""

    async def _text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        if el:
            return ((await el.text_content()) or "").strip()
        return ""


# ========== Skill 4: Engage (提问 + 索简历 合并) ==========

_engage_logger = logging.getLogger("boss_engage")


@register_skill
class BossEngageSkill:
    """Skill 4: 提问 + 索取简历 (发完即走，不等回复)。

    流程: 筛选"新招呼" → 逐个: 发招呼 → 提问(最多3个) → 索简历 → 存候选人档案 → 下一个
    回复由 boss_collect 每天收集。
    """

    NAME = "boss_engage"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "向新候选人发招呼+提问+索简历（不等回复，回复由collect收集）"
    PARAMS_SCHEMA = {
        "reply_text": {"type": "str", "description": "打招呼话术", "required": False},
        "q1": {"type": "str", "description": "问题1", "required": False},
        "q2": {"type": "str", "description": "问题2", "required": False},
        "q3": {"type": "str", "description": "问题3", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._ckpt = CheckpointManager("boss_engage")

    def stop(self) -> None:
        self._running = False

    async def run(
        self,
        reply_text: Optional[str] = None,
        questions: Optional[list[str]] = None,
    ) -> None:
        from services import candidate_store
        from datetime import timezone

        reply = reply_text or config.DEFAULT_REPLY
        q_list = [q for q in (questions or []) if q.strip()]
        self._running = True
        processed = 0
        requested = 0
        skipped = 0
        errors = 0

        try:
            await self._ws.send_status("正在打开 BOSS 直聘...")
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            await self._ws.send_status("筛选新招呼的候选人...")
            try:
                await self._page.locator(SEL_FILTER_NEW).first.click()
                await _wait_after_filter()
            except Exception:
                await self._ws.send_status("未找到新招呼筛选，使用全部列表")

            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(
                f"找到 {total} 个候选人（已处理 {self._ckpt.count()} 个）"
                + (f"，{len(q_list)} 个问题" if q_list else "")
            )

            for i in range(total):
                if not self._running:
                    await self._ws.send_status("任务已停止。")
                    break

                candidates = await self._page.query_selector_all(SEL_CANDIDATE)
                if i >= len(candidates):
                    break
                candidate = candidates[i]

                name = await self._get_text(candidate, SEL_NAME)
                position = await self._get_text(candidate, SEL_SOURCE_JOB)
                data_id = await candidate.get_attribute("data-id") or ""
                if not data_id:
                    ph = await candidate.evaluate_handle("el => el.closest('[data-id]')")
                    if ph:
                        data_id = (await ph.get_attribute("data-id")) or f"u_{i}"

                if self._ckpt.is_processed(data_id):
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 已处理过，跳过")
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] {name} ({position})")

                try:
                    await _wait_before_action()
                    await candidate.click()
                    await _wait_after_click()

                    # Step 1: Send greeting
                    await self._send_message(reply, name)

                    # Step 2: Send all questions at once
                    if q_list:
                        for qi, question in enumerate(q_list):
                            await asyncio.sleep(random.uniform(1, 3))
                            await self._send_message(question, name)
                            await self._ws.send_status(f"{name} 已发送问题{qi+1}: {question[:30]}")

                    # Step 3: Request resume
                    resume_ok = await self._request_resume(name)
                    if resume_ok:
                        requested += 1

                    # Step 4: Save to candidate store (status=engaged)
                    candidate_store.upsert(
                        boss_id=data_id,
                        name=name,
                        position=position,
                        status="engaged",
                        engaged_at=datetime.now(timezone.utc).isoformat(),
                        questions=q_list,
                    )

                    processed += 1
                    self._ckpt.mark_processed(data_id)
                    log_action("boss_engage", {"name": name, "position": position}, "ok")

                except Exception as e:
                    errors += 1
                    log_error(f"处理 {name} 失败: {str(e)[:100]}")
                    await self._ws.send_error(f"{name} 处理失败: {str(e)[:80]}")

                wait = await _wait_between_candidates()
                await self._ws.send_status(f"等待 {wait:.0f} 秒...")
                await asyncio.sleep(wait)

                pause = await _wait_batch_break(processed)
                if pause > 0:
                    await self._ws.send_status(f"已处理 {processed} 人，休息 {pause:.0f} 秒...")
                    await asyncio.sleep(pause)

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")

        await self._ws.send_complete(
            f"完成！处理 {processed} 人，索取 {requested} 份简历，跳过 {skipped} 人，{errors} 个错误"
        )
        self._running = False

    async def _send_message(self, text: str, name: str) -> None:
        editor = self._page.locator(SEL_CHAT_INPUT)
        if await editor.count() == 0:
            await self._ws.send_status(f"{name} 未找到输入框，跳过")
            return
        await editor.click()
        await short_delay()
        await self._page.keyboard.type(text, delay=random.randint(50, 150))
        await short_delay()
        send_btn = self._page.locator(SEL_SEND_BTN)
        if await send_btn.count() > 0:
            await send_btn.first.click()
            await _wait_after_send()
        else:
            await self._page.keyboard.press("Enter")
            await _wait_after_send()

    async def _request_resume(self, name: str) -> bool:
        btn = self._page.locator(SEL_REQUEST_RESUME, has_text="求简历")
        if await btn.count() == 0:
            await self._ws.send_status(f"{name} 未找到求简历按钮")
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
                await self._ws.send_status(f"{name} 已索取简历")
                return True
            await self._ws.send_status(f"{name} 未找到确定按钮")
            return False
        except Exception as e:
            try:
                await self._page.keyboard.press("Escape")
            except Exception:
                pass
            await self._ws.send_status(f"{name} 索取简历失败: {str(e)[:60]}")
            return False

    async def _get_text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        if el:
            return ((await el.text_content()) or "").strip()
        return ""
