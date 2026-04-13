"""Resilient browser operations with VL model fallback.

When a CSS selector fails, uses the same SnapshotEngine + VL planner
that powers the learning phase to find and interact with the element.
After successful self-heal, updates the skill source code so the fix
persists — no VL call needed next time.
"""

from __future__ import annotations

import logging
import re
from pathlib import Path
from typing import Optional

from openai import OpenAI
from playwright.async_api import Page, Locator

import config
from utils.screenshot import capture_screenshot
from browser.snapshot import SnapshotEngine, Snapshot

_logger = logging.getLogger("resilient_ops")

_snapshot_engine = SnapshotEngine()

CUSTOM_SKILLS_DIR = config.DATA_DIR / "custom_skills"

VL_FIND_PROMPT = """你是一个浏览器自动化助手。页面上有以下可交互元素列表（和学习阶段相同的格式）：

{snapshot}

用户想要操作的元素描述：「{description}」
原始 CSS 选择器 `{selector}` 已失效。

请从上面的元素列表中，找到与「{description}」最匹配的元素，返回它的 ref 编号（数字）。

## 严格要求
1. 只返回一个数字（ref 编号），不要解释
2. 必须是列表中实际存在的 ref 编号
3. 根据元素的 role 和 name 判断哪个最匹配描述

例如：如果描述是"搜索框"，应该找 textbox 或 searchbox 类型的元素。
如果描述是"发送按钮"，应该找 button 类型且 name 包含"发送"的元素。

只返回数字："""


VL_LOGIN_CHECK_PROMPT = """看这张浏览器截图，判断当前页面是否需要用户登录。

判断标准：
- 页面的主要内容是登录/注册表单（用户名、密码输入框）
- 页面被重定向到了登录页（整个页面就是一个登录界面）
- 出现了登录弹窗遮挡了原本的内容

以下情况不算需要登录：
- 页面正常显示内容（商品、搜索结果等），只是右上角有"登录"链接
- 页面能正常使用，只是部分功能需要登录

只回答 YES 或 NO，不要解释。"""


async def check_needs_login(page: Page) -> bool:
    """Universal login detection using VL model.

    Called REACTIVELY when an operation fails, not proactively.
    Takes a screenshot and asks VL model to judge if the page is a login page.
    """
    try:
        b64 = await capture_screenshot(page)
        client, model = _get_vl_client()
        response = client.chat.completions.create(
            model=model,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                    {"type": "text", "text": VL_LOGIN_CHECK_PROMPT},
                ],
            }],
            max_tokens=10,
            temperature=0.1,
        )
        answer = (response.choices[0].message.content or "").strip().upper()
        result = "YES" in answer
        _logger.warning(f"VL login check: {'needs login' if result else 'no login needed'}")
        return result
    except Exception as e:
        _logger.error(f"VL login check failed: {str(e)[:80]}")
        return False


async def wait_for_login(page: Page, ws=None, timeout_minutes: int = 15) -> bool:
    """Wait for user to complete login. Returns True if login succeeded.

    Universal helper — any Skill can call this when it detects a login page.
    Polls every 5s, asking VL model to check if login is still needed.
    """
    if ws:
        await ws.send_login_required(
            "页面需要登录，请点击「人工接管」在浏览器中登录，登录后系统自动继续。"
        )

    for i in range(timeout_minutes * 12):  # Check every 5s
        await __import__("asyncio").sleep(5)
        still_login = await check_needs_login(page)
        if not still_login:
            if ws:
                await ws.send_status("登录成功，继续执行...")
            return True
        if i > 0 and i % 60 == 0 and ws:
            await ws.send_status(f"仍在等待登录... (已等待 {i * 5 // 60} 分钟)")

    if ws:
        await ws.send_error(f"等待登录超时（{timeout_minutes}分钟）")
    return False


def _get_vl_client():
    return OpenAI(api_key=config.VL_API_KEY, base_url=config.VL_BASE_URL), config.VL_MODEL


async def _get_stable_selector(page: Page, locator: Locator) -> Optional[str]:
    """Extract a stable CSS selector from a matched Locator element."""
    try:
        sel = await locator.evaluate("""el => {
            // Priority 1: unique attributes
            if (el.id) return '#' + CSS.escape(el.id);
            if (el.getAttribute('name')) return el.tagName.toLowerCase() + '[name="' + el.getAttribute('name') + '"]';
            if (el.getAttribute('data-testid')) return '[data-testid="' + el.getAttribute('data-testid') + '"]';
            if (el.getAttribute('aria-label')) return '[aria-label="' + el.getAttribute('aria-label') + '"]';
            if (el.type === 'submit' && el.value) return el.tagName.toLowerCase() + '[type="submit"][value="' + el.value + '"]';
            if (el.getAttribute('placeholder')) return el.tagName.toLowerCase() + '[placeholder="' + el.getAttribute('placeholder') + '"]';

            // Priority 2: role + accessible name
            const role = el.getAttribute('role');
            if (role) return '[role="' + role + '"]';

            // Priority 3: tag + unique class combination
            const tag = el.tagName.toLowerCase();
            const classes = Array.from(el.classList).filter(c => c.length > 3 && c.length < 40);
            if (classes.length > 0) {
                // Use the most specific-looking class
                const best = classes.sort((a, b) => b.length - a.length)[0];
                const selector = tag + '.' + best;
                if (document.querySelectorAll(selector).length === 1) return selector;
                // Try combining two classes
                if (classes.length >= 2) {
                    const combo = tag + '.' + classes[0] + '.' + classes[1];
                    if (document.querySelectorAll(combo).length === 1) return combo;
                }
            }

            // Priority 4: tag + type
            if (el.type && el.type !== 'text') return tag + '[type="' + el.type + '"]';

            return null;
        }""")
        return sel
    except Exception:
        return None


def _update_skill_file(old_selector: str, new_selector: str) -> bool:
    """Find and replace old_selector with new_selector in skill source files, then reload."""
    try:
        from services.skill_loader import load_skill_file

        for py_file in CUSTOM_SKILLS_DIR.glob("*.py"):
            code = py_file.read_text(encoding="utf-8")
            if old_selector in code:
                updated = code.replace(old_selector, new_selector)
                py_file.write_text(updated, encoding="utf-8")
                _logger.warning(f"Updated skill file {py_file.name}: '{old_selector}' → '{new_selector}'")
                loaded = load_skill_file(py_file)
                if loaded:
                    _logger.warning(f"Reloaded skill: {loaded}")
                return True

        return False
    except Exception as e:
        _logger.error(f"Failed to update skill file: {str(e)[:80]}")
        return False


async def _vl_find_locator(page: Page, selector: str, description: str) -> tuple[Optional[Locator], Optional[str]]:
    """Use VL model + SnapshotEngine to find an element.
    Returns (locator, new_selector_hint) — hint is used to update skill code."""
    try:
        snapshot = await _snapshot_engine.capture(page)
        snapshot_text = snapshot.to_text()
        b64 = await capture_screenshot(page)

        client, model = _get_vl_client()
        prompt = VL_FIND_PROMPT.format(
            snapshot=snapshot_text[:4000],
            description=description,
            selector=selector,
        )

        response = client.chat.completions.create(
            model=model,
            messages=[{
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64}"}},
                ],
            }],
            max_tokens=50,
            temperature=0.1,
        )

        raw = (response.choices[0].message.content or "").strip()
        match = re.search(r'\d+', raw)
        if not match:
            _logger.warning(f"VL returned non-numeric: {raw}")
            return None, None

        ref = int(match.group(0))
        _logger.warning(f"VL picked ref={ref} for '{description}' (original: {selector})")

        # Get the selector_hint from the node for persisting the fix
        new_hint = None
        for node in snapshot.nodes:
            if node.ref == ref and node.selector_hint:
                new_hint = node.selector_hint
                break

        locator = await _snapshot_engine.resolve(page, snapshot, ref)
        return locator, new_hint

    except Exception as e:
        _logger.error(f"VL fallback failed: {str(e)[:100]}")
        return None, None


def _extract_keywords(description: str) -> list[str]:
    clean = description
    for suffix in ["按钮", "输入框", "链接", "区域", "文本框", "选项"]:
        clean = clean.replace(suffix, "")
    clean = clean.strip()
    spaced = " ".join(clean) if clean else ""
    results = [clean] if clean else []
    if spaced and spaced != clean:
        results.append(spaced)
    return results


def _is_input_description(description: str) -> bool:
    return any(kw in description for kw in ["框", "输入", "搜索", "input", "编辑"])


async def _try_text_click(page: Page, description: str, timeout: int = 5000) -> Optional[Locator]:
    keywords = _extract_keywords(description)

    if _is_input_description(description):
        for kw in keywords:
            for sel in [
                f'input[placeholder*="{kw}"]', f'textarea[placeholder*="{kw}"]',
                f'[aria-label*="{kw}"]', f'input[name*="{kw}"]',
                'input[type="text"]', 'input[type="search"]',
                'input:not([type="hidden"]):not([type="password"]):not([type="checkbox"]):not([type="radio"]):not([type="submit"])',
            ]:
                try:
                    locator = page.locator(sel).first
                    if await locator.is_visible(timeout=1000):
                        _logger.warning(f"Input fallback found: {sel}")
                        return locator
                except Exception:
                    continue

    for kw in keywords:
        try:
            locator = page.get_by_text(kw, exact=False).first
            if await locator.is_visible(timeout=2000):
                _logger.warning(f"Text fallback found: get_by_text('{kw}')")
                return locator
        except Exception:
            pass
        for role in ["link", "button", "menuitem", "tab"]:
            try:
                locator = page.get_by_role(role, name=kw).first
                if await locator.is_visible(timeout=1000):
                    _logger.warning(f"Role fallback found: get_by_role('{role}', name='{kw}')")
                    return locator
            except Exception:
                continue
    return None


async def _try_text_fill(page: Page, text: str, description: str, timeout: int = 5000) -> Optional[Locator]:
    keywords = _extract_keywords(description)
    for kw in keywords:
        for sel in [
            f'input[placeholder*="{kw}"]', f'textarea[placeholder*="{kw}"]',
            f'[aria-label*="{kw}"]', f'input[name*="{kw}"]',
        ]:
            try:
                locator = page.locator(sel).first
                if await locator.count() > 0 and await locator.is_visible(timeout=1000):
                    _logger.warning(f"Text fallback fill found: {sel}")
                    return locator
            except Exception:
                continue
    if _is_input_description(description):
        for sel in ['input[type="search"]', 'input[type="text"]', 'input:not([type="hidden"]):not([type="password"])']:
            try:
                locator = page.locator(sel).first
                if await locator.is_visible(timeout=1000):
                    _logger.warning(f"Generic input fallback found: {sel}")
                    return locator
            except Exception:
                continue
    return None


async def resilient_click(
    page: Page,
    selector: str,
    description: str,
    ws=None,
    timeout: int = 5000,
) -> Optional[str]:
    """Click with self-heal. On success, updates skill source code so VL is never called again."""
    # 1. Try original selector
    try:
        await page.click(selector, timeout=timeout)
        return None
    except Exception as e:
        _logger.warning(f"Click failed for '{selector}' ({description}): {str(e)[:80]}")

    # 1.5. Wait for page load and retry
    try:
        await page.wait_for_load_state("domcontentloaded", timeout=5000)
        await page.click(selector, timeout=3000)
        return None
    except Exception:
        pass

    # 2. Text-based matching (fast)
    if ws:
        await ws.send_status(f"⚠️ 选择器「{selector}」失效，尝试文本匹配「{description}」...")
    locator = await _try_text_click(page, description, timeout)
    if locator:
        try:
            await locator.click(timeout=timeout)
            # Try to get a stable attribute from the matched element for code update
            stable_sel = await _get_stable_selector(page, locator)
            _logger.warning(f"Text fallback click OK. stable_sel={stable_sel}")
            if stable_sel and stable_sel != selector:
                updated = _update_skill_file(selector, stable_sel)
                if ws and updated:
                    await ws.send_status(f"✅ 自愈成功，已更新源码: {selector} → {stable_sel}")
                elif ws:
                    await ws.send_status(f"✅ 文本匹配成功（无法提取稳定selector，未更新源码）")
            elif ws:
                await ws.send_status(f"✅ 文本匹配成功（元素无id/name属性，未更新源码）")
            return stable_sel or "text_fallback"
        except Exception:
            pass

    # 3. VL model + SnapshotEngine (same as learning phase)
    if ws:
        await ws.send_status(f"⚠️ 文本匹配失败，启动 AI 视觉分析...")
    locator, new_hint = await _vl_find_locator(page, selector, description)
    if locator:
        try:
            await locator.click(timeout=timeout)
            _logger.warning(f"VL fallback click OK. new_hint={new_hint}")
            # Persist the fix: update skill source code
            if new_hint and new_hint != selector:
                updated = _update_skill_file(selector, new_hint)
                if ws:
                    if updated:
                        await ws.send_status(f"✅ AI 自愈成功，已更新源码: {selector} → {new_hint}")
                    else:
                        await ws.send_status(f"✅ AI 自愈成功（源码中未找到原selector）")
            else:
                if ws:
                    await ws.send_status(f"✅ AI 视觉匹配成功")
            return new_hint or "vl_fallback"
        except Exception as e2:
            _logger.error(f"VL locator click failed: {str(e2)[:80]}")

    if ws:
        await ws.send_status(f"❌ 无法找到「{description}」元素")
    raise Exception(f"resilient_click failed: could not find '{description}' (original: {selector})")


async def resilient_fill(
    page: Page,
    selector: str,
    text: str,
    description: str,
    ws=None,
    timeout: int = 5000,
) -> Optional[str]:
    """Fill with self-heal. On success, updates skill source code."""
    # 1. Try original selector
    try:
        await page.fill(selector, text, timeout=timeout)
        return None
    except Exception as e:
        _logger.warning(f"Fill failed for '{selector}' ({description}): {str(e)[:80]}")

    # 1.5. Wait for page load and retry
    try:
        await page.wait_for_load_state("domcontentloaded", timeout=5000)
        await page.fill(selector, text, timeout=3000)
        return None
    except Exception:
        pass

    # 2. Text-based matching
    if ws:
        await ws.send_status(f"⚠️ 选择器「{selector}」失效，尝试文本匹配「{description}」...")
    locator = await _try_text_fill(page, text, description, timeout)
    if locator:
        try:
            await locator.fill(text, timeout=timeout)
            stable_sel = await _get_stable_selector(page, locator)
            _logger.warning(f"Text fallback fill OK. stable_sel={stable_sel}")
            if stable_sel and stable_sel != selector:
                updated = _update_skill_file(selector, stable_sel)
                if ws and updated:
                    await ws.send_status(f"✅ 自愈成功，已更新源码: {selector} → {stable_sel}")
                elif ws:
                    await ws.send_status(f"✅ 文本匹配成功（无法提取稳定selector，未更新源码）")
            elif ws:
                await ws.send_status(f"✅ 文本匹配成功（元素无id/name属性，未更新源码）")
            return stable_sel or "text_fallback"
        except Exception:
            pass

    # 3. VL model + SnapshotEngine
    if ws:
        await ws.send_status(f"⚠️ 文本匹配失败，启动 AI 视觉分析...")
    locator, new_hint = await _vl_find_locator(page, selector, description)
    if locator:
        try:
            await locator.fill(text, timeout=timeout)
            _logger.warning(f"VL fallback fill OK. new_hint={new_hint}")
            if new_hint and new_hint != selector:
                updated = _update_skill_file(selector, new_hint)
                if ws:
                    if updated:
                        await ws.send_status(f"✅ AI 自愈成功，已更新源码: {selector} → {new_hint}")
                    else:
                        await ws.send_status(f"✅ AI 自愈成功（源码中未找到原selector）")
            else:
                if ws:
                    await ws.send_status(f"✅ AI 视觉匹配成功")
            return new_hint or "vl_fallback"
        except Exception as e2:
            _logger.error(f"VL locator fill failed: {str(e2)[:80]}")

    if ws:
        await ws.send_status(f"❌ 无法找到「{description}」元素")
    raise Exception(f"resilient_fill failed: could not find '{description}' (original: {selector})")
