"""Per-user browser session state.

Encapsulates all state that was previously global in main.py:
provider, executor, controlling, browser_locked, skill_tasks, current_skill.

Phase 0: Single global instance (backward compatible).
Phase 2: One instance per authenticated user (multi-tenant).
"""

from __future__ import annotations

import asyncio
import logging
import subprocess
from typing import Any, Optional

from playwright.async_api import Page

from api.websocket import ConnectionManager
from browser.provider import CamoufoxProvider
from browser.snapshot import SnapshotEngine
from agent.planner import GLMPlanner
from agent.executor import ActionExecutor
from services.file_manager import FileManager
from utils.screenshot import capture_screenshot
import config

_log = logging.getLogger("browser_session")


class BrowserSession:
    """Encapsulates all per-user browser state."""

    def __init__(self, ws_manager: ConnectionManager, user_id: str = "default",
                 display: str = ":99", vnc_port: int = 6080) -> None:
        self.user_id = user_id
        self.ws = ws_manager
        self.display = display
        self.vnc_port = vnc_port

        # Browser state
        self.provider: CamoufoxProvider | None = None
        self.executor: ActionExecutor | None = None
        self.browser_locked: bool = False
        self.controlling: bool = False

        # Skill execution
        self.skill_tasks: dict[str, dict] = {}
        self.current_skill: Any = None

        # Timestamps
        from datetime import datetime, timezone
        self.created_at = datetime.now(timezone.utc)
        self.last_active = self.created_at

    # ------------------------------------------------------------------
    # Browser lifecycle
    # ------------------------------------------------------------------

    async def ensure_browser(self) -> None:
        """Launch browser if not already running. Auto-retry on failure."""
        if self.provider is not None:
            return

        import os
        env = {**os.environ, "DISPLAY": self.display}

        for attempt in range(3):
            try:
                if attempt > 0:
                    lock_path = config.BROWSER_PROFILE_DIR / self.user_id / "SingletonLock"
                    lock_path.unlink(missing_ok=True)
                    await asyncio.sleep(2)

                self.provider = CamoufoxProvider()
                page = await self.provider.launch(profile_id=self.user_id, display=self.display)

                try:
                    await page.goto("about:blank", timeout=5000)
                except Exception:
                    pass

                planner = GLMPlanner()
                snapshot_engine = SnapshotEngine()
                self.executor = ActionExecutor(page, planner, snapshot_engine, self.ws)
                FileManager(page, self.ws)
                return

            except Exception as e:
                _log.error(f"Browser launch attempt {attempt+1} failed: {str(e)[:100]}")
                self.provider = None
                self.executor = None
                if attempt == 2:
                    raise

    async def get_page(self) -> Page:
        """Get the current browser page, auto-reconnect if crashed."""
        await self.ensure_browser()
        try:
            return await self.provider.get_page()
        except RuntimeError:
            self.provider = None
            self.executor = None
            await self.ensure_browser()
            return await self.provider.get_page()

    async def get_visible_page(self) -> Page:
        """Return the current active page."""
        return await self.get_page()

    async def push_tabs_info(self) -> None:
        """Push tab list to frontend via WebSocket."""
        try:
            if not self.provider or not self.provider._context:
                return
            context = self.provider._context
            pages = context.pages
            if not pages:
                return
            tabs = []
            active_index = 0
            for i, p in enumerate(pages):
                try:
                    title = await p.title()
                except Exception:
                    title = "(loading...)"
                tabs.append({"title": title[:40], "url": p.url[:80]})
                if p == self.provider._page:
                    active_index = i
            await self.ws.send_tabs(tabs, active_index)
        except Exception:
            pass

    # ------------------------------------------------------------------
    # Cleanup
    # ------------------------------------------------------------------

    async def cleanup(self) -> None:
        """Close browser and release all resources."""
        if self.current_skill:
            try:
                self.current_skill.stop()
            except Exception:
                pass
            self.current_skill = None

        # Cancel running skill tasks
        for tid, info in self.skill_tasks.items():
            task = info.get("_task")
            if task and not task.done():
                task.cancel()

        if self.provider:
            try:
                await self.provider.close()
            except Exception:
                pass
            self.provider = None
            self.executor = None

        self.browser_locked = False
        self.controlling = False
