"""Decorator-based action registry for the browser agent.

Inspired by browser-use's tools/registry pattern. Actions are registered
with a decorator and dispatched by name. The prompt description is
auto-generated from the registry metadata.

Reference: browser_use/tools/registry/views.py, browser_use/tools/registry/service.py
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from typing import Any, Callable, Optional

from agent.history import ActionResult

_logger = logging.getLogger("action_registry")


@dataclass
class ActionDef:
    """Definition of a registered action."""
    name: str
    description: str                    # Chinese description for prompt
    handler: Callable                   # async def handler(action, ctx) -> str
    terminates_sequence: bool = False   # If True, stops multi-action execution (Phase 3)
    requires_ref: bool = False          # Whether this action needs a ref param
    param_hints: str = ""               # Param description for prompt (e.g., '"ref": <编号>')


@dataclass
class ActionContext:
    """Context passed to every action handler."""
    page: Any           # playwright Page
    snapshot: Any       # Snapshot object
    snapshot_engine: Any  # SnapshotEngine
    ws: Any             # ConnectionManager
    planner: Any        # GLMPlanner (for screenshot_analyze)

    def get_node_info(self, ref: int) -> dict:
        """Get selector and name info for a snapshot node."""
        if not self.snapshot:
            return {"ref": ref, "role": "", "name": "", "selector": ""}
        for node in self.snapshot.nodes:
            if node.ref == ref:
                return {
                    "ref": ref,
                    "role": node.role,
                    "name": node.name,
                    "selector": node.selector_hint or "",
                }
        return {"ref": ref, "role": "", "name": "", "selector": ""}


class ActionRegistry:
    """Registry of all available actions."""

    def __init__(self) -> None:
        self._actions: dict[str, ActionDef] = {}

    def action(
        self,
        name: str,
        description: str,
        *,
        terminates_sequence: bool = False,
        requires_ref: bool = False,
        param_hints: str = "",
    ) -> Callable:
        """Decorator to register an action handler."""
        def decorator(fn: Callable) -> Callable:
            self._actions[name] = ActionDef(
                name=name,
                description=description,
                handler=fn,
                terminates_sequence=terminates_sequence,
                requires_ref=requires_ref,
                param_hints=param_hints,
            )
            return fn
        return decorator

    def get(self, name: str) -> Optional[ActionDef]:
        """Look up an action by name."""
        return self._actions.get(name)

    def prompt_description(self) -> str:
        """Auto-generate Chinese action documentation for the system prompt."""
        lines = []
        for i, (name, adef) in enumerate(self._actions.items(), 1):
            # Build example JSON
            example_parts = [f'"action": "{name}"']
            if adef.param_hints:
                example_parts.append(adef.param_hints)
            example_parts.append('"thinking": "..."')
            example_parts.append('"status_message": "..."')
            example_json = "{" + ", ".join(example_parts) + "}"

            lines.append(f"{i}. {adef.description}：")
            lines.append(example_json)
            lines.append("")
        return "\n".join(lines)

    async def execute(
        self,
        name: str,
        action: dict[str, Any],
        ctx: ActionContext,
    ) -> str:
        """Execute a registered action by name. Returns result string."""
        adef = self._actions.get(name)
        if adef is None:
            return f"unknown action: {name}"

        if adef.requires_ref and action.get("ref") is None:
            return "error: no ref"

        return await adef.handler(action, ctx)

    @property
    def action_names(self) -> list[str]:
        return list(self._actions.keys())


def create_default_registry() -> ActionRegistry:
    """Create and populate the default action registry with all built-in actions."""
    import asyncio
    from browser.humanize import human_click, human_type, human_scroll
    from utils.screenshot import capture_screenshot

    registry = ActionRegistry()

    @registry.action(
        "goto", "打开网页（当需要导航到某个网址时）",
        terminates_sequence=True,
        param_hints='"url": "https://example.com"',
    )
    async def handle_goto(action: dict, ctx: ActionContext) -> str:
        url = action.get("url", "")
        if not url:
            return "error: no url"
        if not url.startswith("http"):
            url = "https://" + url
        await ctx.page.goto(url, wait_until="domcontentloaded", timeout=15000)
        await asyncio.sleep(2)
        return f"navigated to {url[:50]}"

    @registry.action(
        "click", "点击元素",
        requires_ref=True,
        param_hints='"ref": <编号>',
    )
    async def handle_click(action: dict, ctx: ActionContext) -> str:
        ref = action["ref"]
        locator = await ctx.snapshot_engine.resolve(ctx.page, ctx.snapshot, ref)
        await human_click(locator)
        try:
            await ctx.page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        return "clicked"

    @registry.action(
        "type", "输入文本（会先清空再输入）",
        requires_ref=True,
        param_hints='"ref": <编号>, "text": "要输入的文本"',
    )
    async def handle_type(action: dict, ctx: ActionContext) -> str:
        ref = action["ref"]
        text = action.get("text", "")
        locator = await ctx.snapshot_engine.resolve(ctx.page, ctx.snapshot, ref)
        try:
            await locator.fill(text, timeout=5000)
        except Exception:
            try:
                await locator.click(timeout=3000)
            except Exception:
                pass
            await human_type(locator, text)
        return f"typed: {text[:30]}"

    @registry.action(
        "press", "按键",
        requires_ref=True,
        param_hints='"ref": <编号>, "key": "Enter"',
    )
    async def handle_press(action: dict, ctx: ActionContext) -> str:
        ref = action["ref"]
        key = action.get("key", "Enter")
        locator = await ctx.snapshot_engine.resolve(ctx.page, ctx.snapshot, ref)
        await locator.press(key)
        return f"pressed: {key}"

    @registry.action(
        "scroll", "滚动页面",
        param_hints='"direction": "down", "amount": 3',
    )
    async def handle_scroll(action: dict, ctx: ActionContext) -> str:
        direction = action.get("direction", "down")
        amount = action.get("amount", 3)
        await human_scroll(ctx.page, direction, amount)
        return f"scrolled {direction}"

    @registry.action("wait", "等待页面加载", param_hints='"seconds": 2')
    async def handle_wait(action: dict, ctx: ActionContext) -> str:
        seconds = min(action.get("seconds", 2), 10)
        await asyncio.sleep(seconds)
        return f"waited {seconds}s"

    @registry.action(
        "screenshot_analyze", "截图分析（当快照信息不够时）",
        param_hints='"thinking": "需要看截图来判断"',
    )
    async def handle_screenshot_analyze(action: dict, ctx: ActionContext) -> str:
        screenshot_b64 = await capture_screenshot(ctx.page)
        analysis = ctx.planner.analyze_screenshot(
            action.get("thinking", "分析页面"), screenshot_b64
        )
        return f"analyzed: {analysis[:100]}"

    @registry.action(
        "go_back", "返回上一页（或关闭当前标签页回到上一个）",
        terminates_sequence=True,
        param_hints='"thinking": "需要返回搜索结果"',
    )
    async def handle_go_back(action: dict, ctx: ActionContext) -> str:
        context = ctx.page.context
        pages = context.pages
        if len(pages) > 1:
            await ctx.page.close()
            # Note: page switching is handled by executor after this returns
            return "closed tab, switched back"
        else:
            await ctx.page.go_back(wait_until="domcontentloaded", timeout=10000)
            await asyncio.sleep(2)
            return "navigated back"

    @registry.action(
        "done", "任务完成",
        terminates_sequence=True,
        param_hints='"summary": "完成汇总"',
    )
    async def handle_done(action: dict, ctx: ActionContext) -> str:
        return "task complete"

    @registry.action(
        "wait_for_login", "页面需要登录，暂停等待用户人工登录",
        terminates_sequence=True,
    )
    async def handle_wait_for_login(action: dict, ctx: ActionContext) -> str:
        return "wait_for_login"

    return registry
