"""Manages Xvfb + x11vnc + websockify processes for multi-tenant browser isolation.

Each user session gets:
- A dedicated Xvfb display (:100 to :104)
- A dedicated x11vnc process
- A dedicated websockify on a unique port (6081 to 6085)

Pool of 5 slots (configurable via MAX_SESSIONS).
"""

from __future__ import annotations

import asyncio
import logging
import os
import signal
import subprocess
from dataclasses import dataclass, field
from typing import Optional

_log = logging.getLogger("display_manager")

MAX_SESSIONS = int(os.environ.get("MAX_SESSIONS", "5"))
BASE_DISPLAY = 100  # :100, :101, ...
BASE_VNC_PORT = 6081  # 6081, 6082, ...
XVFB_RESOLUTION = "1920x1080x24"
NOVNC_WEB_DIR = "/usr/share/novnc"


@dataclass
class DisplaySlot:
    """One allocated display slot."""
    display_num: int  # e.g. 100 -> :100
    vnc_port: int  # e.g. 6081
    user_id: str
    xvfb_pid: int = 0
    vnc_pid: int = 0
    websockify_pid: int = 0

    @property
    def display(self) -> str:
        return f":{self.display_num}"

    @property
    def env(self) -> dict[str, str]:
        return {**os.environ, "DISPLAY": self.display}


class DisplayManager:
    """Manages a fixed pool of Xvfb display slots."""

    def __init__(self, max_slots: int = MAX_SESSIONS) -> None:
        self._max = max_slots
        self._slots: dict[int, DisplaySlot] = {}  # display_num -> slot
        self._lock = asyncio.Lock()

    def is_full(self) -> bool:
        return len(self._slots) >= self._max

    def get_by_user(self, user_id: str) -> Optional[DisplaySlot]:
        for slot in self._slots.values():
            if slot.user_id == user_id:
                return slot
        return None

    def list_active(self) -> list[dict]:
        return [
            {
                "user_id": s.user_id,
                "display": s.display,
                "vnc_port": s.vnc_port,
                "xvfb_pid": s.xvfb_pid,
                "vnc_pid": s.vnc_pid,
                "websockify_pid": s.websockify_pid,
            }
            for s in self._slots.values()
        ]

    async def allocate(self, user_id: str) -> DisplaySlot:
        """Allocate a display slot for a user. Starts Xvfb + x11vnc + websockify."""
        async with self._lock:
            # Check if user already has a slot
            existing = self.get_by_user(user_id)
            if existing:
                return existing

            if self.is_full():
                raise RuntimeError(f"服务器繁忙，最多支持 {self._max} 个并发用户，请稍后重试")

            # Find free slot
            for i in range(self._max):
                num = BASE_DISPLAY + i
                if num not in self._slots:
                    slot = DisplaySlot(
                        display_num=num,
                        vnc_port=BASE_VNC_PORT + i,
                        user_id=user_id,
                    )
                    await self._start_processes(slot)
                    self._slots[num] = slot
                    _log.warning(f"Allocated display {slot.display} (VNC port {slot.vnc_port}) for user {user_id}")
                    return slot

            raise RuntimeError("No free display slots")

    async def release(self, display_num: int) -> None:
        """Release a display slot, killing all processes."""
        async with self._lock:
            slot = self._slots.pop(display_num, None)
            if not slot:
                return
            await self._stop_processes(slot)
            _log.warning(f"Released display {slot.display} (was user {slot.user_id})")

    async def release_by_user(self, user_id: str) -> None:
        """Release the slot owned by a specific user."""
        slot = self.get_by_user(user_id)
        if slot:
            await self.release(slot.display_num)

    async def cleanup_all(self) -> None:
        """Release all slots (shutdown)."""
        for num in list(self._slots.keys()):
            await self.release(num)

    async def cleanup_orphans(self) -> None:
        """Kill any orphaned Xvfb/x11vnc/websockify from previous runs."""
        for i in range(self._max):
            display = f":{BASE_DISPLAY + i}"
            for proc_name in ["Xvfb", "x11vnc", "websockify"]:
                try:
                    subprocess.run(
                        ["pkill", "-f", f"{proc_name}.*{display}"],
                        capture_output=True, timeout=3,
                    )
                except Exception:
                    pass
        _log.info("Cleaned up orphaned display processes")

    # ------------------------------------------------------------------
    # Internal process management
    # ------------------------------------------------------------------

    async def _start_processes(self, slot: DisplaySlot) -> None:
        """Start Xvfb + x11vnc + websockify for a slot."""
        display = slot.display
        vnc_display_port = 5900 + slot.display_num  # x11vnc listens on 5900+N

        # 1. Start Xvfb
        xvfb = subprocess.Popen(
            ["Xvfb", display, "-screen", "0", XVFB_RESOLUTION, "-ac", "+extension", "GLX", "+render", "-noreset"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        slot.xvfb_pid = xvfb.pid
        await asyncio.sleep(1)  # Wait for Xvfb to start

        # Set background color
        try:
            subprocess.run(
                ["xsetroot", "-solid", "#E8ECF0"],
                capture_output=True, timeout=3,
                env={**os.environ, "DISPLAY": display},
            )
        except Exception:
            pass

        # 2. Start x11vnc
        vnc = subprocess.Popen(
            ["x11vnc", "-display", display, "-nopw", "-listen", "localhost",
             "-xkb", "-ncache", "10", "-ncache_cr", "-forever", "-shared",
             "-rfbport", str(vnc_display_port)],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        slot.vnc_pid = vnc.pid
        await asyncio.sleep(0.5)

        # 3. Start websockify
        ws = subprocess.Popen(
            ["/usr/bin/python3", "/usr/bin/websockify",
             "--web", NOVNC_WEB_DIR,
             str(slot.vnc_port), f"localhost:{vnc_display_port}",
             "--daemon"],
            stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        slot.websockify_pid = ws.pid
        await asyncio.sleep(0.5)

        _log.info(f"Started display {display}: Xvfb={slot.xvfb_pid}, x11vnc={slot.vnc_pid}, websockify={slot.websockify_pid}")

    async def _stop_processes(self, slot: DisplaySlot) -> None:
        """Stop all processes for a slot."""
        for pid_attr in ("websockify_pid", "vnc_pid", "xvfb_pid"):
            pid = getattr(slot, pid_attr, 0)
            if pid:
                try:
                    os.kill(pid, signal.SIGTERM)
                except ProcessLookupError:
                    pass
                except Exception as e:
                    _log.warning(f"Failed to kill {pid_attr}={pid}: {e}")

        # Also pkill by display to catch any children
        display = slot.display
        await asyncio.sleep(0.5)
        for proc_name in ["websockify", "x11vnc", "Xvfb"]:
            try:
                subprocess.run(
                    ["pkill", "-f", f"{proc_name}.*{display}"],
                    capture_output=True, timeout=3,
                )
            except Exception:
                pass


# Singleton
display_manager = DisplayManager()
