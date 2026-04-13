"""Run a Skill headlessly (no WebSocket) and return a result report."""

from __future__ import annotations

import asyncio
from typing import Any

from playwright.async_api import Page

from services.skill_registry import get_skill_class


class CollectorManager:
    """Fake ConnectionManager that collects messages instead of sending via WebSocket."""

    def __init__(self) -> None:
        self.messages: list[dict[str, Any]] = []
        self.is_connected = True

    async def send(self, msg_type: str, **kwargs: Any) -> None:
        self.messages.append({"type": msg_type, **kwargs})

    async def send_status(self, content: str) -> None:
        await self.send("status", content=content)

    async def send_screenshot(self, data_b64: str) -> None:
        pass  # Skip screenshots in headless mode

    async def send_action_log(self, action: str, target: str, status: str) -> None:
        await self.send("action_log", action=action, target=target, status=status)

    async def send_thinking(self, content: str) -> None:
        pass

    async def send_file(self, filename: str, url: str) -> None:
        await self.send("file", filename=filename, url=url)

    async def send_complete(self, summary: str) -> None:
        await self.send("complete", summary=summary)

    async def send_error(self, message: str) -> None:
        await self.send("error", message=message)

    async def send_login_required(self, message: str) -> None:
        await self.send("login_required", message=message)

    async def send_tabs(self, tabs: list[dict], active_index: int) -> None:
        pass

    async def receive_json(self) -> dict:
        # Skills that poll for stop messages — block forever (they check self._running)
        await asyncio.sleep(3600)
        return {}


class BroadcastManager:
    """Wraps a real WS manager + collector: sends to frontend AND collects for result report."""

    def __init__(self, ws_manager: Any, collector: CollectorManager) -> None:
        self._ws = ws_manager
        self._collector = collector

    async def _both(self, method: str, *args: Any, **kwargs: Any) -> None:
        await getattr(self._ws, method)(*args, **kwargs)
        await getattr(self._collector, method)(*args, **kwargs)

    async def send_status(self, content: str) -> None:
        await self._both("send_status", content)

    async def send_error(self, message: str) -> None:
        await self._both("send_error", message)

    async def send_complete(self, summary: str) -> None:
        await self._both("send_complete", summary)

    async def send_file(self, filename: str, url: str) -> None:
        await self._both("send_file", filename, url)

    async def send_login_required(self, message: str) -> None:
        await self._both("send_login_required", message)

    async def send_action_log(self, action: str, target: str, status: str) -> None:
        await self._both("send_action_log", action, target, status)

    async def send_screenshot(self, data_b64: str) -> None:
        pass

    async def send_thinking(self, content: str) -> None:
        pass

    async def send_tabs(self, tabs: list[dict], active_index: int) -> None:
        pass

    @property
    def is_connected(self) -> bool:
        return self._ws.is_connected

    async def receive_json(self) -> dict:
        await asyncio.sleep(3600)
        return {}


async def run_skill(page: Page, skill_name: str, params: dict[str, Any], ws_manager: Any = None,
                    skill_ref_callback: Any = None) -> dict[str, Any]:
    """Execute a skill and return a structured report."""
    cls = get_skill_class(skill_name)
    if cls is None:
        return {"skill": skill_name, "status": "error", "error": f"Unknown skill: {skill_name}"}

    collector = CollectorManager()
    ws = BroadcastManager(ws_manager, collector) if ws_manager else collector
    skill = cls(page, ws)

    # Expose skill instance for stop support
    if skill_ref_callback:
        skill_ref_callback(skill)

    try:
        if skill_name == "boss_reply":
            await skill.run(reply_text=params.get("reply_text"))
        elif skill_name == "boss_download":
            await skill.run()
        elif skill_name == "boss_interview":
            q_list = [v for k, v in sorted(params.items()) if k.startswith("q") and v.strip()]
            wait_s = int(params.get("wait_seconds", 60))
            await skill.run(q_list, wait_s)
        elif skill_name == "boss_engage":
            q_list = [v for k, v in sorted(params.items()) if k.startswith("q") and v.strip()]
            await skill.run(
                reply_text=params.get("reply_text"),
                questions=q_list if q_list else None,
            )
        elif skill_name == "boss_collect":
            await skill.run(webhook_url=params.get("webhook_url", ""))
        elif skill_name == "boss_workflow":
            import json as _json
            pq_raw = params.get("position_questions", "")
            pq = _json.loads(pq_raw) if pq_raw else {}
            max_n = int(params.get("max_per_run", "20"))
            await skill.run(
                reply_text=params.get("reply_text"),
                position_questions=pq if pq else None,
                max_per_run=max_n,
            )
        elif skill_name == "taobao_review":
            await skill.run(
                keyword=params.get("keyword", ""),
                top_n=int(params.get("top_n", params.get("max_products", 3))),
                sort_by=params.get("sort_by", "default"),
                max_reviews=int(params.get("max_reviews", 50)),
                feishu_url=params.get("feishu_url", ""),
                product_url=params.get("product_url", ""),
            )
        else:
            await skill.run(**params)
    except Exception as e:
        return {
            "skill": skill_name,
            "status": "error",
            "error": str(e)[:200],
            "messages": collector.messages,
        }

    # Extract summary from the "complete" message
    complete_msgs = [m for m in collector.messages if m.get("type") == "complete"]
    error_msgs = [m for m in collector.messages if m.get("type") == "error"]
    file_msgs = [m for m in collector.messages if m.get("type") == "file"]

    return {
        "skill": skill_name,
        "status": "completed" if complete_msgs else "unknown",
        "summary": complete_msgs[-1].get("summary", "") if complete_msgs else "",
        "files": [{"filename": m.get("filename"), "url": m.get("url")} for m in file_msgs],
        "errors": [m.get("message") for m in error_msgs],
        "message_count": len(collector.messages),
    }
