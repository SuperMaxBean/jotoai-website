"""Page snapshot engine for LLM-driven browser automation.

Extracts interactive and content elements from the DOM (including iframes),
formats them as a numbered ref list for the LLM, and resolves refs back to
Playwright Locator objects for action execution.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Optional
from playwright.async_api import Page, Locator, Frame

MAX_NAME_LEN = 80

# JavaScript that extracts interactive elements from the page DOM.
_EXTRACT_JS = """() => {
    const INTERACTIVE = 'a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="combobox"], [role="searchbox"], [role="switch"], [role="tab"], [role="menuitem"], [role="option"], [role="slider"], [role="spinbutton"], [contenteditable="true"]';
    const CONTENT = 'h1, h2, h3, h4, h5, h6, [role="heading"], [role="alert"], [role="status"], [role="dialog"], label';

    const seen = new Set();
    const results = [];

    function isVisible(el) {
        if (el.offsetWidth === 0 && el.offsetHeight === 0) return false;
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
        let parent = el.parentElement;
        while (parent) {
            const ps = getComputedStyle(parent);
            if (ps.display === 'none' || ps.visibility === 'hidden' || ps.opacity === '0') return false;
            parent = parent.parentElement;
        }
        const rect = el.getBoundingClientRect();
        if (rect.width < 1 || rect.height < 1) return false;
        if (rect.bottom < 0 || rect.top > window.innerHeight * 1.5) return false;
        if (rect.right < 0 || rect.left > window.innerWidth) return false;
        return true;
    }

    function getRole(el) {
        const explicit = el.getAttribute('role');
        if (explicit) return explicit;
        const tag = el.tagName.toLowerCase();
        const type = (el.getAttribute('type') || '').toLowerCase();
        const map = {
            'a': 'link', 'button': 'button', 'select': 'combobox',
            'textarea': 'textbox', 'h1': 'heading', 'h2': 'heading',
            'h3': 'heading', 'h4': 'heading', 'h5': 'heading', 'h6': 'heading',
            'label': 'label',
        };
        if (tag === 'input') {
            const inputMap = {
                'checkbox': 'checkbox', 'radio': 'radio', 'search': 'searchbox',
                'range': 'slider', 'number': 'spinbutton',
                'hidden': 'hidden',
            };
            return inputMap[type] || 'textbox';
        }
        return map[tag] || tag;
    }

    function getName(el) {
        return el.getAttribute('aria-label')
            || el.getAttribute('title')
            || el.getAttribute('placeholder')
            || el.getAttribute('alt')
            || (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT'
                ? (el.labels?.[0]?.textContent?.trim() || '')
                : el.textContent?.trim()?.slice(0, 100) || '');
    }

    function getSelector(el) {
        if (el.id) return '#' + CSS.escape(el.id);
        const testId = el.getAttribute('data-testid');
        if (testId) return '[data-testid="' + testId + '"]';
        const tag = el.tagName.toLowerCase();
        const name = el.getAttribute('name');
        if (name && ['input', 'textarea', 'select'].includes(tag)) {
            return tag + '[name="' + name + '"]';
        }
        return null;
    }

    function process(selector, isContent) {
        for (const el of document.querySelectorAll(selector)) {
            if (seen.has(el) || !isVisible(el)) continue;
            seen.add(el);
            const role = getRole(el);
            if (role === 'hidden') continue;
            const name = getName(el);
            if (!name && isContent) continue;
            results.push({
                role: role,
                name: name.slice(0, 100),
                value: (el.value !== undefined && el.value !== '') ? el.value : null,
                checked: el.type === 'checkbox' || el.type === 'radio' ? el.checked : null,
                disabled: el.disabled || el.getAttribute('aria-disabled') === 'true' || false,
                selector: getSelector(el),
                isContent: isContent,
            });
        }
    }

    process(INTERACTIVE, false);
    process(CONTENT, true);
    return results;
}"""


@dataclass(frozen=True)
class SnapshotNode:
    ref: int
    role: str
    name: str
    value: Optional[str] = None
    checked: Optional[bool] = None
    disabled: bool = False
    selector_hint: Optional[str] = None
    depth: int = 0
    frame_index: int = -1  # -1 = main frame, 0+ = iframe index


@dataclass
class Snapshot:
    title: str
    url: str
    nodes: list[SnapshotNode] = field(default_factory=list)
    frame_urls: list[str] = field(default_factory=list)  # iframe URLs for reference

    def to_text(self) -> str:
        lines = [f"Page: {self.title}", f"URL: {self.url}", ""]
        current_frame = -1
        for node in self.nodes:
            if node.frame_index != current_frame:
                current_frame = node.frame_index
                if current_frame >= 0 and current_frame < len(self.frame_urls):
                    lines.append(f"--- iframe: {self.frame_urls[current_frame][:60]} ---")
                elif current_frame >= 0:
                    lines.append(f"--- iframe {current_frame} ---")
            indent = "  " * node.depth
            parts = [f"[{node.ref}]", node.role, f'"{_trunc(node.name)}"']
            if node.value is not None:
                parts.append(f'value="{_trunc(node.value)}"')
            if node.checked is not None:
                parts.append(f"checked={node.checked}")
            if node.disabled:
                parts.append("disabled")
            lines.append(f"{indent}{' '.join(parts)}")
        lines.append("")
        lines.append(f"Refs: {len(self.nodes)} | Viewport: 1280x800")
        return "\n".join(lines)


class SnapshotEngine:
    """Captures page snapshots and resolves refs to Locators."""

    async def capture(self, page: Page) -> Snapshot:
        title = await page.title()
        url = page.url

        # Extract from main frame
        nodes: list[SnapshotNode] = []
        ref_counter = 0

        try:
            main_elements = await page.evaluate(_EXTRACT_JS)
            for el in main_elements:
                ref_counter += 1
                nodes.append(SnapshotNode(
                    ref=ref_counter,
                    role=el.get("role", ""),
                    name=str(el.get("name", "")).strip(),
                    value=str(el["value"]) if el.get("value") is not None else None,
                    checked=el.get("checked"),
                    disabled=el.get("disabled", False),
                    selector_hint=el.get("selector"),
                    depth=0,
                    frame_index=-1,
                ))
        except Exception:
            pass

        # Extract from iframes
        frame_urls: list[str] = []
        frames = page.frames
        for i, frame in enumerate(frames):
            if frame == page.main_frame:
                continue
            frame_idx = len(frame_urls)
            frame_urls.append(frame.url or "about:blank")
            try:
                iframe_elements = await frame.evaluate(_EXTRACT_JS)
                for el in iframe_elements:
                    ref_counter += 1
                    nodes.append(SnapshotNode(
                        ref=ref_counter,
                        role=el.get("role", ""),
                        name=str(el.get("name", "")).strip(),
                        value=str(el["value"]) if el.get("value") is not None else None,
                        checked=el.get("checked"),
                        disabled=el.get("disabled", False),
                        selector_hint=el.get("selector"),
                        depth=0,
                        frame_index=frame_idx,
                    ))
                # Check if iframe has a contenteditable body (rich text editor)
                has_editable_body = await frame.evaluate(
                    "() => document.body && "
                    "(document.body.isContentEditable || document.designMode === 'on')"
                )
                if has_editable_body:
                    body_text = await frame.evaluate(
                        "() => (document.body.innerText || '').trim().slice(0, 100)"
                    )
                    ref_counter += 1
                    nodes.append(SnapshotNode(
                        ref=ref_counter,
                        role="textbox",
                        name="邮件正文编辑区",
                        value=body_text if body_text else None,
                        selector_hint="body",
                        depth=0,
                        frame_index=frame_idx,
                    ))
            except Exception:
                # Frame might be cross-origin or detached
                pass

        return Snapshot(title=title, url=url, nodes=nodes, frame_urls=frame_urls)

    async def resolve(self, page: Page, snapshot: Snapshot, ref: int) -> Locator:
        """Resolve a ref number to a Playwright Locator."""
        target = None
        for node in snapshot.nodes:
            if node.ref == ref:
                target = node
                break

        if target is None:
            raise ValueError(f"Ref {ref} not found in snapshot (valid: 1-{len(snapshot.nodes)})")

        # Determine which frame to search in
        search_target: Page | Frame = page
        if target.frame_index >= 0:
            frame_idx = target.frame_index
            # Find the matching frame
            non_main_frames = [f for f in page.frames if f != page.main_frame]
            if frame_idx < len(non_main_frames):
                search_target = non_main_frames[frame_idx]

        # Strategy 1: CSS selector hint
        if target.selector_hint:
            try:
                loc = search_target.locator(target.selector_hint)
                if await loc.count() >= 1:
                    return loc.first
            except Exception:
                pass

        # Strategy 2: role + name
        if target.name:
            try:
                loc = search_target.get_by_role(target.role, name=target.name, exact=False)
                if await loc.count() >= 1:
                    return loc.first
            except Exception:
                pass

        # Strategy 3: text match
        if target.name:
            try:
                loc = search_target.get_by_text(target.name, exact=False)
                if await loc.count() >= 1:
                    return loc.first
            except Exception:
                pass

        # Strategy 4: placeholder match (for inputs)
        if target.name and target.role in ("textbox", "searchbox"):
            try:
                loc = search_target.get_by_placeholder(target.name, exact=False)
                if await loc.count() >= 1:
                    return loc.first
            except Exception:
                pass

        # Strategy 5: aria-label
        if target.name:
            try:
                loc = search_target.locator(f'[aria-label="{target.name}"]')
                if await loc.count() >= 1:
                    return loc.first
            except Exception:
                pass

        # Strategy 6: positional index among same-role elements
        tag_map = {
            "button": "button, [role='button']",
            "link": "a, [role='link']",
            "textbox": "input:not([type='checkbox']):not([type='radio']):not([type='hidden']), textarea, [contenteditable='true']",
            "checkbox": "input[type='checkbox']",
            "radio": "input[type='radio']",
            "combobox": "select, [role='combobox']",
            "searchbox": "input[type='search'], [role='searchbox']",
        }
        selector = tag_map.get(target.role)
        if selector:
            try:
                same_role_idx = 0
                for node in snapshot.nodes:
                    if node.role == target.role and node.frame_index == target.frame_index:
                        if node.ref == ref:
                            break
                        same_role_idx += 1
                loc = search_target.locator(selector)
                count = await loc.count()
                if same_role_idx < count:
                    return loc.nth(same_role_idx)
            except Exception:
                pass

        raise ValueError(
            f"Could not resolve ref {ref} ({target.role} \"{target.name}\") with any strategy"
        )


def _trunc(s) -> str:
    s = str(s)
    if len(s) <= MAX_NAME_LEN:
        return s
    return s[:MAX_NAME_LEN - 3] + "..."
