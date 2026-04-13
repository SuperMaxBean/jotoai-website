"""Detect CAPTCHA presence on a page via DOM checks + VL fallback."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from typing import Optional

from playwright.async_api import Page

import config

logger = logging.getLogger(__name__)

# Known CAPTCHA selectors on Chinese sites (Alibaba, Tencent, Geetest)
CAPTCHA_SELECTORS = [
    # Geetest (very common on BOSS直聘)
    ".geetest_holder",
    ".geetest_panel",
    ".geetest_widget",
    # Alibaba / NoCaptcha
    ".nc_wrapper",
    ".nc-container",
    "#nc_1_wrapper",
    # Tencent
    "#tcaptcha_iframe",
    ".verify-wrap",
    # Generic
    ".captcha-container",
    '[class*="captcha"]',
    'iframe[src*="captcha"]',
    'iframe[src*="verify"]',
]

SLIDER_SELECTORS = [
    ".geetest_slider",
    ".geetest_slider_button",
    ".nc_iconfont",
    ".slide-verify",
    ".nc-lang-cnt",
    '#nc_1__scale_text',
]


@dataclass
class CaptchaInfo:
    captcha_type: str  # "slider", "image", "text", "unknown"
    selector: str  # The selector that matched
    iframe_src: Optional[str] = None


async def detect_captcha(page: Page) -> Optional[CaptchaInfo]:
    """Check if a CAPTCHA is visible on the page.

    Returns CaptchaInfo if found, None if no CAPTCHA.
    Uses DOM checks first (fast, no token cost), then VL fallback.
    """
    # Step 1: DOM-based detection
    for sel in CAPTCHA_SELECTORS:
        try:
            count = await page.locator(sel).count()
            if count > 0:
                # Check if it's visible
                visible = await page.locator(sel).first.is_visible()
                if visible:
                    captcha_type = await _classify_captcha_type(page)
                    logger.info(f"CAPTCHA detected via DOM: {sel} (type: {captcha_type})")
                    return CaptchaInfo(
                        captcha_type=captcha_type,
                        selector=sel,
                    )
        except Exception:
            continue

    # Step 2: Check for CAPTCHA iframes
    for frame in page.frames:
        url = frame.url.lower()
        if any(kw in url for kw in ["captcha", "verify", "geetest", "nocaptcha"]):
            logger.info(f"CAPTCHA detected via iframe: {url[:80]}")
            return CaptchaInfo(
                captcha_type="unknown",
                selector="iframe",
                iframe_src=url,
            )

    return None


async def _classify_captcha_type(page: Page) -> str:
    """Determine CAPTCHA type: slider, image, or text."""
    for sel in SLIDER_SELECTORS:
        try:
            if await page.locator(sel).count() > 0:
                return "slider"
        except Exception:
            continue

    # Check for image captcha (input field near an image)
    try:
        img_captcha = await page.locator('[class*="captcha"] img, .verify-img').count()
        if img_captcha > 0:
            return "image"
    except Exception:
        pass

    return "unknown"
