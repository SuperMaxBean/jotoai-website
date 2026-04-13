"""Multi-tenant session lifecycle manager.

Coordinates user sessions: allocates display slots, creates BrowserSession instances,
handles idle timeout and cleanup.
"""

from __future__ import annotations

import asyncio
import logging
from datetime import datetime, timezone
from typing import Optional

from api.websocket import ConnectionManager
from services.browser_session import BrowserSession
from services.display_manager import display_manager, DisplaySlot

_log = logging.getLogger("session_manager")

IDLE_BROWSER_TIMEOUT = 30 * 60  # 30 min: close browser but keep session
IDLE_SESSION_TIMEOUT = 2 * 60 * 60  # 2 hours: fully destroy session


class SessionManager:
    """Manages per-user browser sessions."""

    def __init__(self) -> None:
        self._sessions: dict[str, BrowserSession] = {}  # user_id -> session
        self._cleanup_task: asyncio.Task | None = None

    async def start(self) -> None:
        """Start the session manager (called on app startup)."""
        await display_manager.cleanup_orphans()
        self._cleanup_task = asyncio.create_task(self._idle_cleanup_loop())

    async def stop(self) -> None:
        """Stop all sessions and cleanup (called on app shutdown)."""
        if self._cleanup_task:
            self._cleanup_task.cancel()
        for uid in list(self._sessions.keys()):
            await self.destroy(uid)
        await display_manager.cleanup_all()

    def is_full(self) -> bool:
        """Check if we've hit the max concurrent session limit."""
        return display_manager.is_full()

    def get(self, user_id: str) -> Optional[BrowserSession]:
        """Get an existing session (does not create)."""
        session = self._sessions.get(user_id)
        if session:
            session.last_active = datetime.now(timezone.utc)
        return session

    async def get_or_create(self, user_id: str) -> BrowserSession:
        """Get existing session or create a new one with display allocation."""
        if user_id in self._sessions:
            session = self._sessions[user_id]
            session.last_active = datetime.now(timezone.utc)
            return session

        # Allocate display (raises if full)
        slot = await display_manager.allocate(user_id)

        # Create session with its own ConnectionManager
        ws = ConnectionManager()
        session = BrowserSession(
            ws_manager=ws,
            user_id=user_id,
            display=slot.display,
            vnc_port=slot.vnc_port,
        )
        self._sessions[user_id] = session
        _log.warning(f"Created session for {user_id} on display {slot.display}")
        return session

    async def destroy(self, user_id: str) -> None:
        """Fully destroy a user's session: close browser, release display."""
        session = self._sessions.pop(user_id, None)
        if not session:
            return
        try:
            await session.cleanup()
        except Exception as e:
            _log.error(f"Session cleanup error for {user_id}: {e}")
        await display_manager.release_by_user(user_id)
        _log.warning(f"Destroyed session for {user_id}")

    def list_active(self) -> list[dict]:
        """List all active sessions (for admin dashboard)."""
        result = []
        for uid, session in self._sessions.items():
            result.append({
                "user_id": uid,
                "display": session.display,
                "vnc_port": session.vnc_port,
                "browser_active": session.provider is not None,
                "controlling": session.controlling,
                "browser_locked": session.browser_locked,
                "created_at": session.created_at.isoformat(),
                "last_active": session.last_active.isoformat(),
            })
        return result

    async def _idle_cleanup_loop(self) -> None:
        """Background task: clean up idle sessions."""
        while True:
            try:
                await asyncio.sleep(60)  # Check every minute
                now = datetime.now(timezone.utc)

                for uid in list(self._sessions.keys()):
                    session = self._sessions.get(uid)
                    if not session:
                        continue
                    idle_seconds = (now - session.last_active).total_seconds()

                    # Close browser after 30 min idle
                    if idle_seconds > IDLE_BROWSER_TIMEOUT and session.provider and not session.browser_locked:
                        _log.info(f"Closing idle browser for {uid} ({idle_seconds:.0f}s idle)")
                        try:
                            await session.provider.close()
                            session.provider = None
                            session.executor = None
                        except Exception:
                            pass

                    # Fully destroy after 2 hours idle
                    if idle_seconds > IDLE_SESSION_TIMEOUT:
                        _log.info(f"Destroying idle session for {uid} ({idle_seconds:.0f}s idle)")
                        await self.destroy(uid)

            except asyncio.CancelledError:
                return
            except Exception as e:
                _log.error(f"Cleanup loop error: {e}")


# Singleton
session_manager = SessionManager()
