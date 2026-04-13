"""Human-like behavior simulation for browser actions.

Wraps Playwright actions with natural delays, typing rhythm,
and randomized timing to avoid bot detection.

This is the single source of truth for all humanization logic.
All skills should import wait helpers from here, not from each other.

All timing reads from ``config.antifraud`` at call time so that changes
made via the Settings UI take effect immediately without restart.
"""

import asyncio
import random

from playwright.async_api import Page, Locator

import config


# ---------------------------------------------------------------------------
# Helpers — read antifraud config at call time
# ---------------------------------------------------------------------------

def _af() -> dict:
    """Return the current antifraud config dict."""
    return config.antifraud


def _range(lo_frac: float, hi_frac: float) -> tuple[float, float]:
    """Return (lo, hi) seconds derived from the configured min/max delay."""
    af = _af()
    lo = af["min_delay"] * lo_frac
    hi = af["max_delay"] * hi_frac
    return (lo, hi)


# ---------------------------------------------------------------------------
# Low-level micro-delays (used inside composite helpers)
# ---------------------------------------------------------------------------

async def random_delay() -> None:
    """Wait a random duration between configured min and max delay."""
    af = _af()
    wait = random.uniform(af["min_delay"], af["max_delay"])
    await asyncio.sleep(wait)


async def short_delay() -> None:
    """Short pause for between micro-actions (100-400ms)."""
    await asyncio.sleep(random.uniform(0.1, 0.4))


# ---------------------------------------------------------------------------
# Human-like interaction primitives
# ---------------------------------------------------------------------------

async def human_click(locator: Locator) -> None:
    """Click with a small random position offset and delay."""
    await short_delay()
    await locator.click(
        delay=random.randint(30, 80),
    )
    await short_delay()


async def human_type(locator: Locator, text: str) -> None:
    """Type text with natural per-character delay variation."""
    await locator.click()
    await short_delay()

    for char in text:
        await locator.press_sequentially(
            char,
            delay=random.randint(50, 180),
        )
        # Occasional longer pause (simulating thinking)
        if random.random() < 0.08:
            await asyncio.sleep(random.uniform(0.2, 0.6))

    await short_delay()


async def human_scroll(page: Page, direction: str = "down", amount: int = 3) -> None:
    """Scroll with variable chunk sizes and pauses, mimicking real scrolling."""
    for _ in range(amount):
        delta = random.randint(80, 200)
        if direction == "up":
            delta = -delta
        await page.mouse.wheel(0, delta)
        await asyncio.sleep(random.uniform(0.05, 0.15))

    await short_delay()


# ---------------------------------------------------------------------------
# High-level wait helpers
#
# Timing is derived from config.antifraud min_delay / max_delay so the
# Settings UI slider directly controls actual behavior.
#
#   min_delay=15, max_delay=180  (defaults)
#   wait_page_load  → 33%-6%  range ≈ 5-10s
#   wait_after_filter → 20%-4% ≈ 3-7s
#   wait_before_action → 13%-3% ≈ 2-5s  (+ long pause chance)
#   wait_after_click → 20%-4% ≈ 3-8s
#   wait_after_send → 13%-3% ≈ 2-5s
#   wait_between_items → 100%-100% ≈ 15-180s
# ---------------------------------------------------------------------------

async def _interruptible_sleep(seconds: float, stop_check=None) -> bool:
    """Sleep in 1-second chunks, checking stop_check() each second.
    Returns True if interrupted (stopped), False if completed normally."""
    elapsed = 0.0
    while elapsed < seconds:
        chunk = min(1.0, seconds - elapsed)
        await asyncio.sleep(chunk)
        elapsed += chunk
        if stop_check and stop_check():
            return True
    return False


async def _wait_with_long_pause(lo_mult: float = 0.5, hi_mult: float = 1.0, ws=None, label: str = "", stop_check=None) -> float:
    """Base wait with long-pause probability. All wait functions use this."""
    af = _af()
    t = random.uniform(af["min_delay"] * lo_mult, af["max_delay"] * hi_mult)
    if ws and t >= 2:
        await ws.send_status(f"等待 {t:.0f} 秒...{(' (' + label + ')') if label else ''}")
    if await _interruptible_sleep(t, stop_check):
        return t
    # Long pause probability
    pause_prob = af["pause_prob"] / 100.0
    if random.random() < pause_prob:
        extra = random.uniform(af["min_delay"], af["max_delay"] * 2)
        if ws:
            await ws.send_status(f"长停留触发，额外等待 {extra:.0f} 秒...")
        if await _interruptible_sleep(extra, stop_check):
            return t + extra
        t += extra
    return t


async def wait_page_load(ws=None, stop_check=None) -> None:
    """Wait after page navigation — like watching the page load."""
    await _wait_with_long_pause(1.0, 1.0, ws=ws, label="页面加载", stop_check=stop_check)


async def wait_after_filter(ws=None, stop_check=None) -> None:
    """Wait after clicking a filter tab."""
    await _wait_with_long_pause(0.5, 1.0, ws=ws, label="筛选", stop_check=stop_check)


async def wait_before_action(ws=None, stop_check=None) -> float:
    """Pause before clicking — like reading/scanning content first. Returns total wait seconds."""
    return await _wait_with_long_pause(0.5, 1.0, ws=ws, label="操作前", stop_check=stop_check)


async def wait_after_click(ws=None, stop_check=None) -> None:
    """Wait after clicking — like watching what happens."""
    await _wait_with_long_pause(0.5, 1.0, ws=ws, label="点击后", stop_check=stop_check)


async def wait_after_send(ws=None, stop_check=None) -> None:
    """Wait after sending a message — like re-reading what you wrote."""
    await _wait_with_long_pause(0.5, 1.0, ws=ws, label="发送后", stop_check=stop_check)


async def wait_between_items() -> float:
    """Variable wait between processing items (candidates, products, etc.).

    Uses the full min_delay..max_delay range with variable distribution.
    """
    af = _af()
    lo = af["min_delay"]
    hi = af["max_delay"]
    pause_prob = af["pause_prob"] / 100.0

    roll = random.random()
    if roll < pause_prob * 0.5:
        # Very long pause (top end of range)
        wait = random.uniform(hi * 0.67, hi)
    elif roll < pause_prob:
        # Long pause
        wait = random.uniform(hi * 0.25, hi * 0.50)
    elif roll < 0.60:
        # Medium pause
        wait = random.uniform(lo * 1.3, hi * 0.25)
    else:
        # Normal pause (bottom end)
        wait = random.uniform(lo, lo * 2.0)
    return wait


async def wait_batch_break(processed: int) -> float:
    """Longer break every N items to simulate taking a break."""
    batch_size = random.randint(3, 5)
    if processed > 0 and processed % batch_size == 0:
        af = _af()
        pause = random.uniform(af["max_delay"] * 0.33, af["max_delay"])
        return pause
    return 0


# Backward-compatible aliases (used by boss_skill, boss_collect_skill, etc.)
_wait_page_load = wait_page_load
_wait_after_filter = wait_after_filter
_wait_before_action = wait_before_action
_wait_after_click = wait_after_click
_wait_after_send = wait_after_send
_wait_between_candidates = wait_between_items
_wait_batch_break = wait_batch_break
