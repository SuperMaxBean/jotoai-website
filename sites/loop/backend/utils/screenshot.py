"""Screenshot capture and JPEG compression."""

import base64
from io import BytesIO

from PIL import Image
from playwright.async_api import Page

import config


async def capture_screenshot(page: Page) -> str:
    """Capture page screenshot, compress to JPEG, return base64 string."""
    png_bytes = await page.screenshot(type="png", full_page=False)

    img = Image.open(BytesIO(png_bytes))

    # Resize if wider than configured width
    if img.width > config.SCREENSHOT_WIDTH:
        ratio = config.SCREENSHOT_WIDTH / img.width
        new_height = int(img.height * ratio)
        img = img.resize((config.SCREENSHOT_WIDTH, new_height), Image.LANCZOS)

    # Convert to JPEG
    buf = BytesIO()
    img.convert("RGB").save(buf, format="JPEG", quality=config.SCREENSHOT_QUALITY)
    return base64.b64encode(buf.getvalue()).decode("ascii")
