"""CAPTCHA solving: xdotool (real X11 events), CapSolver API, 2Captcha API.

Primary method: xdotool injects real X11 mouse events into the Xvfb display,
which are indistinguishable from hardware input. This bypasses NoCaptcha's
behavioral detection that rejects Playwright's synthetic CDP events.

Fallback: CapSolver / 2Captcha APIs for other captcha types.
"""

from __future__ import annotations

import asyncio
import base64
import logging
import os
import random
import subprocess
import time as _time

import httpx
from playwright.async_api import Page

import config

logger = logging.getLogger(__name__)

CAPSOLVER_URL = "https://api.capsolver.com"
_DISPLAY = os.getenv("DISPLAY", ":99")


# ---------------------------------------------------------------------------
# JS to find slider track and button on the page
# ---------------------------------------------------------------------------
_FIND_SLIDER_JS = """() => {
    // Strategy 1: NoCaptcha (Alibaba) selectors
    const ncTrack = document.querySelector(
        '#nc_1__scale_text, .nc-lang-cnt, .nc_scale, #nc_1_wrapper'
    );
    const ncButton = document.querySelector(
        '#nc_1_n1z, .nc_iconfont.btn_slide, .nc_iconfont'
    );
    if (ncTrack && ncButton) {
        const tb = ncTrack.getBoundingClientRect();
        const bb = ncButton.getBoundingClientRect();
        if (tb.width > 50 && bb.width > 5)
            return { track: {x:tb.x,y:tb.y,w:tb.width,h:tb.height},
                     btn: {x:bb.x,y:bb.y,w:bb.width,h:bb.height} };
    }
    // Strategy 2: Generic slider
    const candidates = document.querySelectorAll(
        '[class*="slider"], [class*="slide"], [class*="verify"], [class*="captcha"]'
    );
    for (const el of candidates) {
        const r = el.getBoundingClientRect();
        if (r.width > 200 && r.height > 10 && r.height < 80) {
            for (const child of el.querySelectorAll('*')) {
                const cr = child.getBoundingClientRect();
                if (cr.width > 10 && cr.width < 80 && cr.height > 10 &&
                    cr.left < r.left + 100 && Math.abs(cr.top - r.top) < 30) {
                    return { track: {x:r.x,y:r.y,w:r.width,h:r.height},
                             btn: {x:cr.x,y:cr.y,w:cr.width,h:cr.height} };
                }
            }
            return { track: {x:r.x,y:r.y,w:r.width,h:r.height}, btn: null };
        }
    }
    // Strategy 3: Find by text "拖动"/"滑块"
    for (const el of document.querySelectorAll('*')) {
        const txt = el.textContent || '';
        if ((txt.includes('拖动') || txt.includes('滑块')) && el.children.length < 10) {
            const r = el.getBoundingClientRect();
            if (r.width > 200 && r.height > 20 && r.height < 80)
                return { track: {x:r.x,y:r.y,w:r.width,h:r.height}, btn: null };
        }
    }
    return null;
}"""


def _xdotool(*args: str) -> str:
    """Run xdotool command targeting the Xvfb display."""
    env = {**os.environ, "DISPLAY": _DISPLAY}
    r = subprocess.run(["xdotool", *args], capture_output=True, text=True, env=env, timeout=5)
    return r.stdout.strip()


def _find_chrome_window() -> tuple[int, int, int]:
    """Return (window_id, offset_x, offset_y) for the Chrome content area.

    offset_x/y = screen coords of the top-left corner of the page viewport.
    """
    # Find the largest Chrome window (the actual browser, not pop-ups)
    wids = _xdotool("search", "--class", "chrome").split("\n")
    best_wid, best_area = "", 0
    best_x, best_y, best_w, best_h = 0, 0, 0, 0
    for wid in wids:
        if not wid.strip():
            continue
        try:
            geo = _xdotool("getwindowgeometry", "--shell", wid)
            vals = {}
            for line in geo.split("\n"):
                if "=" in line:
                    k, v = line.split("=", 1)
                    vals[k] = int(v)
            w, h = vals.get("WIDTH", 0), vals.get("HEIGHT", 0)
            if w * h > best_area:
                best_area = w * h
                best_wid = wid
                best_x = vals.get("X", 0)
                best_y = vals.get("Y", 0)
                best_w, best_h = w, h
        except Exception:
            continue

    if not best_wid:
        raise RuntimeError("Chrome window not found in Xvfb")

    # The browser viewport starts below the Chrome title/tab bar.
    # Viewport is 1280x800, window is ~1288x931. Toolbar ~ (931 - 800) = 131px.
    toolbar_h = max(best_h - 800, 0)
    sidebar_w = max(best_w - 1280, 0) // 2
    offset_x = best_x + sidebar_w
    offset_y = best_y + toolbar_h

    logger.info(f"Chrome window: wid={best_wid} pos=({best_x},{best_y}) "
                f"size={best_w}x{best_h} viewport_offset=({offset_x},{offset_y})")
    return int(best_wid), offset_x, offset_y


async def solve_slider_xdotool(page: Page) -> bool:
    """Solve 'drag to right' slider using xdotool (real X11 events).

    This bypasses NoCaptcha behavioral detection because xdotool injects
    events at the X11 level, indistinguishable from real hardware input.
    """
    # 1. Find slider elements via JS
    result = await page.evaluate(_FIND_SLIDER_JS)
    if not result:
        logger.warning("xdotool solve: no slider found on page")
        return False

    track = result["track"]
    btn = result.get("btn")

    if btn:
        page_start_x = btn["x"] + btn["w"] / 2
        page_start_y = btn["y"] + btn["h"] / 2
    else:
        page_start_x = track["x"] + 20
        page_start_y = track["y"] + track["h"] / 2

    page_end_x = track["x"] + track["w"] - 10
    distance = page_end_x - page_start_x
    if distance < 30:
        logger.warning(f"xdotool solve: distance too short ({distance:.0f})")
        return False

    # 2. Find Chrome window position to convert page → screen coords
    try:
        wid, offset_x, offset_y = _find_chrome_window()
    except RuntimeError as e:
        logger.error(str(e))
        return False

    sx = int(offset_x + page_start_x)
    sy = int(offset_y + page_start_y)
    ex = int(offset_x + page_end_x)

    logger.info(f"xdotool solve: drag from ({sx},{sy}) to ({ex},{sy}), distance={distance:.0f}px")

    # 3. Focus the window
    _xdotool("windowactivate", "--sync", str(wid))
    _time.sleep(0.3)

    # 4. Human-like drag via xdotool (real X11 events)
    _xdotool("mousemove", "--window", str(wid), str(sx), str(sy))
    _time.sleep(random.uniform(0.2, 0.4))
    _xdotool("mousedown", "1")
    _time.sleep(random.uniform(0.05, 0.15))

    steps = random.randint(22, 35)
    for i in range(steps):
        progress = (i + 1) / steps
        # Ease-in-out curve
        if progress < 0.5:
            eased = 2 * progress * progress
        else:
            eased = 1 - (-2 * progress + 2) ** 2 / 2
        x = int(sx + distance * eased + random.uniform(-1, 1))
        y = int(sy + random.uniform(-2, 2))
        _xdotool("mousemove", str(x), str(y))
        # Variable speed
        if progress < 0.15 or progress > 0.85:
            _time.sleep(random.uniform(0.02, 0.06))
        else:
            _time.sleep(random.uniform(0.008, 0.025))

    # Overshoot then correct
    _xdotool("mousemove", str(ex + random.randint(3, 8)), str(sy + random.randint(-1, 1)))
    _time.sleep(random.uniform(0.05, 0.1))
    _xdotool("mousemove", str(ex), str(sy))
    _time.sleep(random.uniform(0.1, 0.3))
    _xdotool("mouseup", "1")

    logger.info("xdotool solve: drag complete, waiting for verification...")
    await asyncio.sleep(2)
    return True


async def solve_slider(page: Page, slider_selector: str, bg_selector: str = "") -> bool:
    """Solve a slider CAPTCHA by getting slide distance from CapSolver.

    Returns True if solved successfully.
    """
    if not config.CAPSOLVER_API_KEY:
        logger.warning("CAPSOLVER_API_KEY not set, cannot solve slider")
        return False

    try:
        from utils.screenshot import capture_screenshot
        b64_screenshot = await capture_screenshot(page)

        # Create task
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(f"{CAPSOLVER_URL}/createTask", json={
                "clientKey": config.CAPSOLVER_API_KEY,
                "task": {
                    "type": "AntiSliderTaskByImage",
                    "image": b64_screenshot,
                },
            })
            data = resp.json()

            if data.get("errorId", 0) != 0:
                logger.error(f"CapSolver createTask error: {data.get('errorDescription', '')}")
                return False

            task_id = data.get("taskId")
            if not task_id:
                logger.error("CapSolver returned no taskId")
                return False

            # Poll for result
            for _ in range(30):
                await asyncio.sleep(2)
                resp = await client.post(f"{CAPSOLVER_URL}/getTaskResult", json={
                    "clientKey": config.CAPSOLVER_API_KEY,
                    "taskId": task_id,
                })
                result = resp.json()
                status = result.get("status", "")

                if status == "ready":
                    solution = result.get("solution", {})
                    slide_distance = solution.get("slideDistance", solution.get("distance", 0))
                    if slide_distance:
                        await _simulate_slide(page, slider_selector, int(slide_distance))
                        return True
                    logger.error(f"CapSolver returned no distance: {solution}")
                    return False
                elif status == "failed":
                    logger.error(f"CapSolver task failed: {result.get('errorDescription', '')}")
                    return False

        logger.error("CapSolver timeout waiting for result")
        return False

    except Exception as e:
        logger.error(f"Slider solve failed: {str(e)[:100]}")
        return False


async def solve_image_captcha(page: Page, image_selector: str, input_selector: str) -> bool:
    """Solve an image/text CAPTCHA.

    Returns True if solved successfully.
    """
    if not config.CAPSOLVER_API_KEY:
        logger.warning("CAPSOLVER_API_KEY not set, cannot solve image captcha")
        return False

    try:
        # Get the captcha image
        img_el = page.locator(image_selector).first
        img_b64 = await img_el.screenshot(type="png")
        img_b64_str = base64.b64encode(img_b64).decode()

        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(f"{CAPSOLVER_URL}/createTask", json={
                "clientKey": config.CAPSOLVER_API_KEY,
                "task": {
                    "type": "ImageToTextTask",
                    "body": img_b64_str,
                },
            })
            data = resp.json()

            if data.get("errorId", 0) != 0:
                logger.error(f"CapSolver error: {data.get('errorDescription', '')}")
                return False

            task_id = data.get("taskId")
            if not task_id:
                # Some tasks return result directly
                solution = data.get("solution", {})
                text = solution.get("text", "")
                if text:
                    await _type_answer(page, input_selector, text)
                    return True
                return False

            # Poll
            for _ in range(20):
                await asyncio.sleep(2)
                resp = await client.post(f"{CAPSOLVER_URL}/getTaskResult", json={
                    "clientKey": config.CAPSOLVER_API_KEY,
                    "taskId": task_id,
                })
                result = resp.json()
                if result.get("status") == "ready":
                    text = result.get("solution", {}).get("text", "")
                    if text:
                        await _type_answer(page, input_selector, text)
                        return True
                    return False
                elif result.get("status") == "failed":
                    return False

        return False

    except Exception as e:
        logger.error(f"Image captcha solve failed: {str(e)[:100]}")
        return False


async def _simulate_slide(page: Page, slider_selector: str, distance: int) -> None:
    """Simulate human-like slider drag with bezier curve movement."""
    slider = page.locator(slider_selector).first
    box = await slider.bounding_box()
    if not box:
        return

    start_x = box["x"] + box["width"] / 2
    start_y = box["y"] + box["height"] / 2

    await page.mouse.move(start_x, start_y)
    await asyncio.sleep(random.uniform(0.1, 0.3))
    await page.mouse.down()
    await asyncio.sleep(random.uniform(0.05, 0.15))

    # Move in steps with slight randomness (simulates human hand)
    steps = random.randint(15, 25)
    for i in range(steps):
        progress = (i + 1) / steps
        # Ease-out curve: fast start, slow end
        eased = 1 - (1 - progress) ** 2
        x = start_x + distance * eased + random.uniform(-2, 2)
        y = start_y + random.uniform(-3, 3)
        await page.mouse.move(x, y)
        await asyncio.sleep(random.uniform(0.01, 0.04))

    # Final position
    await page.mouse.move(start_x + distance, start_y)
    await asyncio.sleep(random.uniform(0.05, 0.2))
    await page.mouse.up()
    await asyncio.sleep(1)


async def solve_slide_to_right(page: Page) -> bool:
    """Auto-solve 'drag to right' slider (Alibaba NoCaptcha etc.) without API.

    Finds the slider track and button, calculates drag distance, then
    drags with human-like trajectory (ease-out + jitter).
    Returns True if a slider was found and dragged.
    """
    # Use JS to find the slider track and button bounding boxes reliably
    result = await page.evaluate("""() => {
        // Strategy 1: NoCaptcha (Alibaba) selectors
        const ncTrack = document.querySelector(
            '#nc_1__scale_text, .nc-lang-cnt, .nc_scale, #nc_1_wrapper'
        );
        const ncButton = document.querySelector(
            '#nc_1_n1z, .nc_iconfont.btn_slide, .nc_iconfont'
        );
        if (ncTrack && ncButton) {
            const tb = ncTrack.getBoundingClientRect();
            const bb = ncButton.getBoundingClientRect();
            if (tb.width > 50 && bb.width > 5)
                return { track: {x:tb.x,y:tb.y,w:tb.width,h:tb.height},
                         btn: {x:bb.x,y:bb.y,w:bb.width,h:bb.height} };
        }

        // Strategy 2: Generic slider — look for a narrow, wide track with
        //             a small draggable handle inside
        const candidates = document.querySelectorAll(
            '[class*="slider"], [class*="slide"], [class*="verify"], [class*="captcha"]'
        );
        for (const el of candidates) {
            const r = el.getBoundingClientRect();
            // Track-like: wide, short
            if (r.width > 200 && r.height > 10 && r.height < 80) {
                // Find a child that looks like a button (small, at left side)
                for (const child of el.querySelectorAll('*')) {
                    const cr = child.getBoundingClientRect();
                    if (cr.width > 10 && cr.width < 80 && cr.height > 10 &&
                        cr.left < r.left + 100 && Math.abs(cr.top - r.top) < 30) {
                        return { track: {x:r.x,y:r.y,w:r.width,h:r.height},
                                 btn: {x:cr.x,y:cr.y,w:cr.width,h:cr.height} };
                    }
                }
                // No button found, use track left side as start
                return { track: {x:r.x,y:r.y,w:r.width,h:r.height}, btn: null };
            }
        }

        // Strategy 3: Find by page text "请按住滑块" / "拖动下方滑块"
        const allEls = document.querySelectorAll('*');
        for (const el of allEls) {
            const txt = el.textContent || '';
            if ((txt.includes('拖动') || txt.includes('滑块') || txt.includes('拖到最右')) &&
                el.children.length < 10) {
                const r = el.getBoundingClientRect();
                if (r.width > 200 && r.height > 20 && r.height < 80) {
                    return { track: {x:r.x,y:r.y,w:r.width,h:r.height}, btn: null };
                }
            }
        }

        return null;
    }""")

    if not result:
        logger.warning("solve_slide_to_right: no slider found on page")
        return False

    track = result["track"]
    btn = result.get("btn")

    if btn:
        start_x = btn["x"] + btn["w"] / 2
        start_y = btn["y"] + btn["h"] / 2
    else:
        start_x = track["x"] + 20
        start_y = track["y"] + track["h"] / 2

    end_x = track["x"] + track["w"] - 10
    distance = end_x - start_x

    if distance < 30:
        logger.warning(f"solve_slide_to_right: distance too short ({distance})")
        return False

    logger.info(f"solve_slide_to_right: dragging {distance:.0f}px from ({start_x:.0f},{start_y:.0f})")

    # Human-like drag: move to start, press, drag with eased curve + jitter, release
    await page.mouse.move(start_x, start_y)
    await asyncio.sleep(random.uniform(0.2, 0.5))
    await page.mouse.down()
    await asyncio.sleep(random.uniform(0.05, 0.15))

    steps = random.randint(20, 35)
    for i in range(steps):
        progress = (i + 1) / steps
        # Ease-in-out: slow start, fast middle, slow end (more human-like)
        if progress < 0.5:
            eased = 2 * progress * progress
        else:
            eased = 1 - (-2 * progress + 2) ** 2 / 2
        x = start_x + distance * eased + random.uniform(-1, 1)
        y = start_y + random.uniform(-2, 2)
        await page.mouse.move(x, y)
        # Variable speed: slower at start and end
        if progress < 0.15 or progress > 0.85:
            await asyncio.sleep(random.uniform(0.02, 0.06))
        else:
            await asyncio.sleep(random.uniform(0.008, 0.025))

    # Overshoot slightly then correct (very human)
    await page.mouse.move(end_x + random.uniform(2, 8), start_y + random.uniform(-1, 1))
    await asyncio.sleep(random.uniform(0.05, 0.1))
    await page.mouse.move(end_x, start_y)
    await asyncio.sleep(random.uniform(0.1, 0.3))
    await page.mouse.up()
    await asyncio.sleep(1.5)
    return True


async def _type_answer(page: Page, input_selector: str, text: str) -> None:
    """Type CAPTCHA answer into the input field."""
    input_el = page.locator(input_selector).first
    await input_el.click()
    await asyncio.sleep(0.2)
    await input_el.fill("")
    await page.keyboard.type(text, delay=random.randint(50, 120))
    await asyncio.sleep(0.3)
    await page.keyboard.press("Enter")
