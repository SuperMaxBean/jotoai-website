"""CAPTCHA handler: orchestrates detection → solving → verification.

Call `check_and_solve_captcha(page, ws)` after page navigation or when
selector failures might indicate a CAPTCHA page.
"""

from __future__ import annotations

import asyncio
import logging
from typing import Optional, Protocol

from playwright.async_api import Page

import config
from services.captcha_detector import detect_captcha, SLIDER_SELECTORS
from services.captcha_solver import solve_slider, solve_image_captcha

logger = logging.getLogger(__name__)


class WSLike(Protocol):
    """Minimal interface for status reporting."""
    async def send_status(self, content: str) -> None: ...
    async def send_error(self, message: str) -> None: ...


async def check_and_solve_captcha(
    page: Page,
    ws: Optional[WSLike] = None,
    max_retries: int = 3,
) -> bool:
    """Check for CAPTCHA and solve it if found.

    Returns True if a CAPTCHA was found and solved.
    Returns False if no CAPTCHA was found.
    Raises RuntimeError if CAPTCHA found but solving failed.
    """
    if not config.CAPTCHA_ENABLED:
        return False

    info = await detect_captcha(page)
    if info is None:
        return False

    if ws:
        await ws.send_status(f"检测到验证码 (类型: {info.captcha_type})，正在自动处理...")

    for attempt in range(max_retries):
        try:
            solved = False

            if info.captcha_type == "slider":
                # Find the slider button
                slider_sel = ""
                for sel in SLIDER_SELECTORS:
                    try:
                        if await page.locator(sel).count() > 0:
                            slider_sel = sel
                            break
                    except Exception:
                        continue

                if slider_sel:
                    solved = await solve_slider(page, slider_sel)

            elif info.captcha_type == "image":
                solved = await solve_image_captcha(
                    page,
                    image_selector='[class*="captcha"] img, .verify-img',
                    input_selector='[class*="captcha"] input, .verify-input',
                )

            if solved:
                # Verify CAPTCHA is gone
                await asyncio.sleep(2)
                recheck = await detect_captcha(page)
                if recheck is None:
                    if ws:
                        await ws.send_status("验证码已通过")
                    logger.info(f"CAPTCHA solved on attempt {attempt + 1}")
                    return True
                else:
                    logger.warning(f"CAPTCHA still present after solve attempt {attempt + 1}")
            else:
                logger.warning(f"CAPTCHA solve returned False on attempt {attempt + 1}")

        except Exception as e:
            logger.error(f"CAPTCHA solve attempt {attempt + 1} failed: {str(e)[:100]}")

        await asyncio.sleep(2)

    # All retries exhausted
    msg = f"验证码处理失败 ({max_retries} 次尝试)，请使用 Take Control 手动处理"
    if ws:
        await ws.send_error(msg)
    logger.error(msg)
    return False
