from __future__ import annotations

import asyncio
import os
import subprocess
from abc import ABC, abstractmethod

from playwright.async_api import async_playwright, Page, BrowserContext, Playwright

import config


class BrowserProvider(ABC):
    """Abstract browser provider interface."""

    @abstractmethod
    async def launch(self, profile_id: str = "default", display: str = ":99") -> Page: ...

    @abstractmethod
    async def get_page(self) -> Page: ...

    @abstractmethod
    async def save_session(self, profile_id: str) -> None: ...

    @abstractmethod
    async def close(self) -> None: ...


class CamoufoxProvider(BrowserProvider):
    """Anti-detect Firefox via Camoufox with persistent context.

    Built-in fingerprint spoofing at browser level (no stealth.js needed).
    Uses Juggler protocol instead of CDP — undetectable by CDP-sniffing checks.
    """

    def __init__(self) -> None:
        self._playwright: Playwright | None = None
        self._context: BrowserContext | None = None
        self._page: Page | None = None

    async def launch(self, profile_id: str = "default", display: str = ":99") -> Page:
        from camoufox.async_api import AsyncNewBrowser

        profile_dir = config.BROWSER_PROFILE_DIR / profile_id
        profile_dir.mkdir(parents=True, exist_ok=True)

        self._playwright = await async_playwright().start()

        # Get Xvfb resolution for this display
        env = {**os.environ, "DISPLAY": display}
        w, h = 1920, 1080
        try:
            result = subprocess.run(["xdpyinfo"], capture_output=True, text=True, timeout=5, env=env)
            for line in result.stdout.splitlines():
                if "dimensions:" in line:
                    dims = line.split()[1]
                    w, h = [int(x) for x in dims.split("x")]
                    break
        except Exception:
            pass

        self._context = await AsyncNewBrowser(
            self._playwright,
            persistent_context=True,
            user_data_dir=str(profile_dir),
            headless=False,
            humanize=True,
            locale="zh-CN",
            window=(w, h),
            firefox_user_prefs={
                "layout.css.devPixelsPerPx": "1.0",
                "extensions.activeThemeID": "firefox-compact-light@mozilla.org",
                "ui.systemUsesDarkTheme": 0,
                "browser.theme.content-theme": 1,
                "browser.theme.toolbar-theme": 1,
                "browser.display.background_color": "#E8ECF0",
            },
        )

        # Use existing page or create new one
        if self._context.pages:
            self._page = self._context.pages[0]
        else:
            self._page = await self._context.new_page()

        # Set X11 background to match UI
        try:
            subprocess.run(["xsetroot", "-solid", "#E8ECF0"], capture_output=True, timeout=5, env=env)
        except Exception:
            pass

        # Maximize browser window to fill Xvfb display
        await asyncio.sleep(3)
        try:
            subprocess.run(
                ["bash", "-c",
                 f'for wid in $(DISPLAY={display} xdotool search --onlyvisible --name "" 2>/dev/null); do '
                 f'DISPLAY={display} xdotool windowmove --sync $wid 0 0 2>/dev/null; '
                 f'DISPLAY={display} xdotool windowsize --sync $wid {w} {h} 2>/dev/null; '
                 f'done'],
                capture_output=True, timeout=10, env=env,
            )
        except Exception:
            pass

        return self._page

    async def get_page(self) -> Page:
        if self._page is None:
            raise RuntimeError("Browser not launched. Call launch() first.")
        return self._page

    async def save_session(self, profile_id: str) -> None:
        pass

    async def close(self) -> None:
        if self._context:
            await self._context.close()
            self._context = None
            self._page = None
        if self._playwright:
            await self._playwright.stop()
            self._playwright = None


# Backward-compatible alias
PatchrightProvider = CamoufoxProvider
