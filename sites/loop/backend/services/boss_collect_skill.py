"""BossCollectSkill: harvest replies from previously engaged candidates.

Runs daily (or on demand) to collect unread replies from candidates
we previously sent questions to via boss_engage.
"""

from __future__ import annotations

import asyncio
import logging
import random
from datetime import datetime, timezone
from typing import Optional

import httpx
from playwright.async_api import Page

import config
from api.websocket import ConnectionManager
from services.skill_registry import register_skill
from services.checkpoint import CheckpointManager
from services import candidate_store
from services.boss_skill import (
    BOSS_CHAT_URL,
    SEL_CANDIDATE,
    SEL_NAME,
    SEL_SOURCE_JOB,
    SEL_MSG_FRIEND,
)
from browser.humanize import (
    _wait_page_load,
    _wait_after_filter,
    _wait_before_action,
    _wait_after_click,
    _wait_between_candidates,
    _wait_batch_break,
)

_logger = logging.getLogger("boss_collect")

SEL_UNREAD_FILTER = '.chat-message-filter-left span:not(.active)'  # The "未读" span


@register_skill
class BossCollectSkill:
    """Skill 5: 收集已提问候选人的回复。

    流程: 点"未读"筛选 → 匹配已提问的候选人 → 打开聊天读回复 → 存储 → 转发webhook
    """

    NAME = "boss_collect"
    PLATFORM = "BOSS直聘"
    DESCRIPTION = "收集已提问候选人的回复"
    PARAMS_SCHEMA = {
        "webhook_url": {"type": "str", "description": "AI分析webhook URL，留空不转发", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True

    def stop(self) -> None:
        self._running = False

    async def run(self, webhook_url: str = "") -> None:
        self._running = True
        collected = 0
        skipped = 0
        errors = 0

        try:
            await self._ws.send_status("正在打开 BOSS 直聘...")
            await self._page.goto(BOSS_CHAT_URL, wait_until="domcontentloaded", timeout=15000)
            await _wait_page_load()

            # Click "未读" filter
            await self._ws.send_status("筛选未读消息...")
            try:
                unread_span = self._page.locator(
                    '.chat-message-filter-left span', has_text='未读'
                )
                if await unread_span.count() > 0:
                    await unread_span.first.click()
                    await _wait_after_filter()
                else:
                    await self._ws.send_status("未找到未读筛选按钮，使用全部列表")
            except Exception:
                await self._ws.send_status("未读筛选失败，使用全部列表")

            # Build set of engaged candidate boss_ids
            engaged = {
                c["boss_id"]: c
                for c in candidate_store.list_by_status("engaged")
            }
            await self._ws.send_status(f"已提问候选人: {len(engaged)} 人")

            if not engaged:
                await self._ws.send_complete("没有待收集回复的候选人")
                return

            # Get visible candidates
            candidates = await self._page.query_selector_all(SEL_CANDIDATE)
            total = len(candidates)
            await self._ws.send_status(f"未读列表: {total} 人")

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

                # Only process candidates we engaged
                if data_id not in engaged:
                    skipped += 1
                    await self._ws.send_status(f"[{i+1}/{total}] {name} 非已提问候选人，跳过")
                    continue

                await self._ws.send_status(f"[{i+1}/{total}] 收集回复: {name}")

                try:
                    await _wait_before_action()
                    await candidate.click()
                    await _wait_after_click()

                    # Read replies after my last message
                    replies = await self._read_replies_after_last_mine()

                    if replies:
                        candidate_data = engaged[data_id]
                        candidate_store.upsert(
                            boss_id=data_id,
                            replies=replies,
                            status="replied",
                            replied_at=datetime.now(timezone.utc).isoformat(),
                        )
                        await self._ws.send_status(
                            f"{name} 收集到 {len(replies)} 条回复: {replies[0][:30]}..."
                        )

                        # Forward to webhook
                        if webhook_url:
                            await self._forward_to_webhook(
                                webhook_url, name, position,
                                candidate_data.get("questions", []),
                                replies,
                            )

                        collected += 1
                    else:
                        await self._ws.send_status(f"{name} 未发现新回复")

                except Exception as e:
                    errors += 1
                    _logger.warning(f"收集 {name} 回复失败: {str(e)[:100]}")
                    await self._ws.send_error(f"{name} 收集失败: {str(e)[:80]}")

                wait = await _wait_between_candidates()
                await asyncio.sleep(wait)

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")

        await self._ws.send_complete(
            f"完成！收集 {collected} 人的回复，跳过 {skipped} 人，{errors} 个错误"
        )
        self._running = False

    async def _read_replies_after_last_mine(self) -> list[str]:
        """Read all candidate messages after my last sent message."""
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

        # Find the index of my last message
        last_mine_idx = -1
        for idx, msg in enumerate(messages):
            if msg["type"] == "mine":
                last_mine_idx = idx

        if last_mine_idx == -1:
            # I never sent anything to this person — all messages are from them
            return []

        # Collect all friend messages after my last message
        replies = []
        for msg in messages[last_mine_idx + 1:]:
            if msg["type"] == "friend":
                replies.append(msg["text"])

        return replies

    async def _forward_to_webhook(
        self, url: str, name: str, position: str,
        questions: list[str], replies: list[str],
    ) -> None:
        payload = {
            "candidate": name,
            "position": position,
            "questions": questions,
            "replies": replies,
            "source": "boss_collect",
            "collected_at": datetime.now(timezone.utc).isoformat(),
        }
        try:
            async with httpx.AsyncClient(timeout=15) as client:
                resp = await client.post(url, json=payload)
                if resp.status_code < 300:
                    await self._ws.send_status(f"{name} 回复已转发AI分析")
                else:
                    await self._ws.send_status(f"{name} AI转发失败: HTTP {resp.status_code}")
        except Exception as e:
            _logger.warning(f"Webhook failed for {name}: {str(e)[:80]}")
            await self._ws.send_status(f"{name} AI转发失败: {str(e)[:50]}")

    async def _get_text(self, parent, selector: str) -> str:
        el = await parent.query_selector(selector)
        if el:
            return ((await el.text_content()) or "").strip()
        return ""
