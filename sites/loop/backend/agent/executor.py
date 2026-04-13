"""Action execution loop: plan → execute → observe → repeat."""

from __future__ import annotations

import asyncio
import time
from typing import Any, Optional

from playwright.async_api import Page

from agent.planner import GLMPlanner
from agent.history import (
    AgentHistoryList, AgentStep, AgentStepOutput,
    ActionResult, BrowserState, LoopDetector,
)
from agent.action_registry import ActionRegistry, ActionContext, create_default_registry
from browser.snapshot import SnapshotEngine, Snapshot
from browser.humanize import random_delay
from utils.screenshot import capture_screenshot
from utils.logger import log_action, log_plan, log_error
from api.websocket import ConnectionManager

MAX_STEPS = 50


class ActionExecutor:
    """Runs the plan-execute-observe loop."""

    def __init__(
        self,
        page: Page,
        planner: GLMPlanner,
        snapshot_engine: SnapshotEngine,
        ws_manager: ConnectionManager,
        on_tab_switch: Any = None,
    ) -> None:
        self._page = page
        self._planner = planner
        self._snapshot = snapshot_engine
        self._ws = ws_manager
        self._running = False
        self._paused = asyncio.Event()
        self._paused.set()  # Not paused initially
        self._agent_history = AgentHistoryList()
        self._task_description: str = ""
        self._on_tab_switch = on_tab_switch  # Callback when tab switches
        self._registry = create_default_registry()
        # Step lifecycle callbacks (Phase 4A)
        self._on_step_start: list[Any] = []
        self._on_step_end: list[Any] = []
        self._on_done: list[Any] = []

    def register_step_start(self, cb: Any) -> None:
        self._on_step_start.append(cb)

    def register_step_end(self, cb: Any) -> None:
        self._on_step_end.append(cb)

    def register_done(self, cb: Any) -> None:
        self._on_done.append(cb)

    async def _fire_callbacks(self, cbs: list, *args: Any) -> None:
        for cb in cbs:
            try:
                result = cb(*args)
                if asyncio.iscoroutine(result):
                    await result
            except Exception:
                pass

    async def execute_task(self, task: str) -> None:
        """Execute a user task through the action loop."""
        self._running = True
        self._agent_history = AgentHistoryList(task=task)
        self._task_description = task
        self._last_url = ""
        self._stall_count = 0

        await self._ws.send_status(f"开始执行: {task}")
        log_plan(task, {"status": "started"})

        for step in range(MAX_STEPS):
            if not self._running:
                await self._ws.send_status("任务已手动停止。")
                break

            action_type = "unknown"  # Initialize for error handler
            try:
                # -1. Auto-switch to newest tab; check if relevant to task
                try:
                    context = self._page.context
                    pages = context.pages
                    if len(pages) > 1 and pages[-1] != self._page:
                        new_page = pages[-1]
                        try:
                            await new_page.wait_for_load_state("domcontentloaded", timeout=5000)
                        except Exception:
                            pass

                        # Get new tab info
                        new_title = await new_page.title()
                        new_url = new_page.url

                        # Check if it's a captcha/security verification page
                        is_captcha = any(kw in new_url.lower() + new_title.lower() for kw in [
                            'captcha', 'verify', 'security', 'challenge',
                            '验证', '安全验证', '拦截', '滑块', 'punish',
                        ])

                        if is_captcha:
                            # Switch to captcha page and pause for human intervention
                            old_url = self._page.url[:50]
                            self._page = new_page
                            await self._ws.send_status(f"⚠️ 检测到验证码页面，请人工接管完成验证: {new_title[:30]}")
                            await self._ws.send_login_required("检测到安全验证/验证码，请点击「人工接管」完成验证后释放控制。")
                            await self._notify_tab_switch()
                            # Pause and wait for human to solve captcha
                            self.pause()
                            await self._paused.wait()
                            if not self._running:
                                break
                            await self._ws.send_status("▶️ 验证完成，AI 继续学习...")
                        else:
                            # Let VL model judge if the new tab is relevant to the current task
                            try:
                                is_relevant = await asyncio.wait_for(
                                    asyncio.to_thread(
                                        self._planner.judge_tab_relevance,
                                        self._task_description,
                                        new_title,
                                        new_url,
                                    ),
                                    timeout=10,
                                )
                            except Exception:
                                is_relevant = True

                            if is_relevant:
                                old_url = self._page.url[:50]
                                self._page = new_page
                                await self._ws.send_status(f"新标签页与任务相关，已切换: {new_title[:30]}")
                                await self._notify_tab_switch()
                                self._agent_history.steps.append(AgentStep(
                                    step_number=step,
                                    browser_state=BrowserState(url=self._page.url),
                                    action_results=[ActionResult(
                                        action_type="tab_switch",
                                        action_params={"from_url": old_url},
                                        result=f"switched to: {new_title[:30]}",
                                    )],
                                ))
                            else:
                                await new_page.close()
                                await self._ws.send_status(f"新标签页与任务无关，已关闭: {new_title[:30]}")
                except Exception:
                    pass

                # 0. Auto-dismiss popups/modals/overlays before each step
                try:
                    dismissed = await self._page.evaluate("""() => {
                        let closed = 0;
                        // Strategy 1: Click visible close buttons (×, 关闭, close)
                        const closePatterns = ['×', '✕', '✖', 'X', '关闭', 'close', 'Close'];
                        for (const el of document.querySelectorAll('button, a, span, div, i')) {
                            const text = (el.textContent || '').trim();
                            const ariaLabel = (el.getAttribute('aria-label') || '').toLowerCase();
                            if (el.offsetWidth > 0 && el.offsetHeight > 0 && el.offsetHeight < 60) {
                                if (closePatterns.some(p => text === p) || ariaLabel.includes('close') || ariaLabel.includes('关闭')) {
                                    // Check if it's inside a modal/popup (has high z-index parent)
                                    let parent = el.parentElement;
                                    let isModal = false;
                                    for (let i = 0; i < 10 && parent; i++) {
                                        const z = parseInt(getComputedStyle(parent).zIndex);
                                        if (z > 100 || parent.getAttribute('role') === 'dialog') { isModal = true; break; }
                                        parent = parent.parentElement;
                                    }
                                    if (isModal) { el.click(); closed++; }
                                }
                            }
                        }
                        // Strategy 2: Remove overlay masks (high z-index full-screen divs)
                        for (const el of document.querySelectorAll('div')) {
                            const style = getComputedStyle(el);
                            const z = parseInt(style.zIndex);
                            if (z > 1000 && style.position === 'fixed' && el.offsetWidth > window.innerWidth * 0.8 && el.offsetHeight > window.innerHeight * 0.8) {
                                el.remove();
                                closed++;
                            }
                        }
                        return closed;
                    }""")
                    if dismissed and dismissed > 0:
                        await self._ws.send_status(f"自动关闭了 {dismissed} 个弹窗")
                        await asyncio.sleep(1)
                except Exception:
                    pass

                # 0.5. Wait if paused (human-in-the-loop takeover)
                if not self._paused.is_set():
                    await self._ws.send_status("⏸️ AI 已暂停，人工接管中。AI 会继续录制您的操作...")
                    await self._paused.wait()
                    if not self._running:
                        break
                    await self._ws.send_status("▶️ 人工操作完成，AI 继续学习...")

                # 1. Capture snapshot
                snapshot = await self._snapshot.capture(self._page)
                snapshot_text = snapshot.to_text()

                # Detect stall and loops
                current_url = self._page.url
                task_with_hint = task
                if current_url == self._last_url:
                    self._stall_count += 1
                else:
                    self._stall_count = 0
                    self._last_url = current_url

                # Append stall hint if URL hasn't changed
                if self._stall_count >= 3:
                    task_with_hint += f"\n\n⚠️ 注意：页面已连续{self._stall_count}步没有变化（URL: {current_url[:60]}）。之前的操作可能没有生效。请尝试完全不同的方法，例如：用其他方式提交表单（按Enter/Escape后再Enter）、直接通过URL导航、或跳过当前步骤。"

                # Append loop detection nudge
                loop_nudge = self._agent_history.loop_detector.get_nudge()
                if loop_nudge:
                    task_with_hint += f"\n\n{loop_nudge}"

                # 2. Push screenshot + tab info to frontend
                screenshot_b64 = await capture_screenshot(self._page)
                await self._ws.send_screenshot(screenshot_b64)
                await self._push_tabs()

                # 3. Build browser state for history
                browser_state = BrowserState(
                    url=current_url,
                    title=(await self._page.title()) if self._page else "",
                    tab_count=len(self._page.context.pages) if self._page else 1,
                    snapshot_text=snapshot_text[:2000],
                )

                # 3.5 Step start callback
                await self._fire_callbacks(self._on_step_start, step, browser_state)

                # 4. Ask GLM for next actions (with timeout)
                try:
                    actions, memory = await asyncio.wait_for(
                        asyncio.to_thread(self._planner.plan_actions, task_with_hint, snapshot_text, self._agent_history),
                        timeout=45,  # Slightly longer for multi-action responses
                    )
                except asyncio.TimeoutError:
                    await self._ws.send_status("⚠️ VL 模型响应超时，重试中...")
                    self._agent_history.steps.append(AgentStep(
                        step_number=step,
                        browser_state=browser_state,
                        action_results=[ActionResult(
                            action_type="plan_timeout",
                            result="VL model timed out after 45s",
                            error="timeout",
                        )],
                    ))
                    continue

                # 5. Execute multi-action sequence
                ctx = ActionContext(
                    page=self._page,
                    snapshot=snapshot,
                    snapshot_engine=self._snapshot,
                    ws=self._ws,
                    planner=self._planner,
                )

                first_thinking = actions[0].get("thinking", "") if actions else ""
                if first_thinking:
                    await self._ws.send_thinking(first_thinking)
                first_status = actions[0].get("status_message", "") if actions else ""
                if first_status:
                    await self._ws.send_status(first_status)

                action_results = []
                is_done = False
                pre_url = self._page.url

                for i, action in enumerate(actions):
                    action_type = action.get("action", "done")

                    # Send status for 2nd+ actions
                    if i > 0:
                        status_msg = action.get("status_message", "")
                        if status_msg:
                            await self._ws.send_status(status_msg)
                        await asyncio.sleep(0.3)  # Short delay between batch actions

                    # Execute via registry
                    result = await self._registry.execute(action_type, action, ctx)

                    # Handle go_back page switching
                    if action_type == "go_back" and "closed tab" in result:
                        pages = self._page.context.pages
                        if pages:
                            self._page = pages[-1]
                            await self._notify_tab_switch()

                    # Log each action
                    log_action(action_type, action, result)
                    await self._ws.send_action_log(action_type, str(action.get("ref", "")), result)

                    # Build action result
                    node_info = self._get_node_info(snapshot, action.get("ref", 0)) if action.get("ref") else {}
                    ar = ActionResult(
                        action_type=action_type,
                        action_params={**node_info, **{k: v for k, v in action.items() if k not in ("thinking", "status_message", "memory")}},
                        result=result,
                    )
                    action_results.append(ar)
                    self._agent_history.loop_detector.record(action_type, action)

                    # Check termination conditions (browser-use multi_act pattern)
                    if action_type == "done":
                        is_done = True
                        break

                    if action_type == "wait_for_login":
                        await self._ws.send_login_required(
                            "AI 检测到需要登录，请点击「人工接管」完成登录，登录后释放控制，AI 自动继续。"
                        )
                        # Wait for user to log in (poll every 5s, max 15 min)
                        for _ in range(180):
                            if not self._running:
                                break
                            await asyncio.sleep(5)
                            still_login = await self._page.evaluate("""() => {
                                const url = window.location.href.toLowerCase();
                                const pwdInput = document.querySelector('input[type="password"]');
                                const hasPwd = pwdInput && pwdInput.offsetWidth > 0;
                                return url.includes('login') || url.includes('signin') ||
                                    url.includes('passport') || url.includes('auth') || hasPwd;
                            }""")
                            if not still_login:
                                await self._ws.send_status("登录成功，AI 继续执行...")
                                break
                        break  # Re-plan after login

                    adef = self._registry.get(action_type)
                    if adef and adef.terminates_sequence:
                        break  # goto, go_back change the page

                    if self._page.url != pre_url:
                        break  # URL changed, remaining actions would target stale DOM

                # 6. Record structured history for this step
                self._agent_history.steps.append(AgentStep(
                    step_number=step,
                    browser_state=browser_state,
                    agent_output=AgentStepOutput(
                        thinking=first_thinking,
                        memory=memory,
                        actions=actions,
                        raw_response="",
                    ),
                    action_results=action_results,
                ))

                # 6.5 Step end callback
                await self._fire_callbacks(self._on_step_end, step, self._agent_history.steps[-1])

                # 7. Check if done
                if is_done:
                    summary = actions[-1].get("summary", "任务完成") if actions else "任务完成"
                    await self._ws.send_complete(summary)
                    break

                # 8. Memory compaction (every 25 steps, if history is large)
                if len(self._agent_history.steps) >= 25 and len(self._agent_history.steps) % 25 == 0:
                    try:
                        summary_text = await asyncio.wait_for(
                            asyncio.to_thread(self._planner.compact_history, self._agent_history),
                            timeout=30,
                        )
                        if summary_text:
                            self._agent_history.compacted_summary = summary_text
                            # Keep only last 6 steps
                            self._agent_history.steps = self._agent_history.steps[-6:]
                            await self._ws.send_status("📝 历史记忆已压缩")
                    except Exception:
                        pass

                # 9. Wait between steps
                await random_delay()

            except Exception as e:
                error_msg = str(e)
                log_error(f"Step {step + 1}: {error_msg}")

                # Critical errors — stop immediately
                if "page closed" in error_msg.lower() or "browser" in error_msg.lower():
                    await self._ws.send_error(f"浏览器错误: {error_msg[:100]}")
                    break

                # Action failed (timeout, element blocked, etc.)
                # Take screenshot and let VL model analyze what went wrong
                error_result = f"error: {error_msg[:100]}"
                try:
                    await self._ws.send_status("操作失败，正在截图分析页面状态...")
                    screenshot_b64 = await capture_screenshot(self._page)
                    await self._ws.send_screenshot(screenshot_b64)
                    analysis = await asyncio.wait_for(
                        asyncio.to_thread(self._planner.analyze_screenshot, task, screenshot_b64),
                        timeout=30,
                    )
                    await self._ws.send_thinking(f"[页面分析] {analysis[:200]}")
                    error_result = f"error: {error_msg[:80]}. 页面分析: {analysis[:150]}"
                except Exception:
                    pass
                self._agent_history.steps.append(AgentStep(
                    step_number=step,
                    browser_state=BrowserState(url=self._page.url if self._page else ""),
                    action_results=[ActionResult(
                        action_type=action_type,
                        result=error_result,
                        error=error_msg[:200],
                    )],
                ))

        else:
            await self._ws.send_complete(f"已达到最大步数 ({MAX_STEPS})，任务停止。")

        await self._fire_callbacks(self._on_done, self._agent_history)
        self._running = False

    def stop(self) -> None:
        self._running = False
        self._paused.set()  # Unblock if paused

    def pause(self) -> None:
        """Pause the executor (for human-in-the-loop takeover)."""
        self._paused.clear()

    def resume(self) -> None:
        """Resume the executor after human takeover."""
        self._paused.set()

    @property
    def is_paused(self) -> bool:
        return not self._paused.is_set()

    async def _notify_tab_switch(self) -> None:
        """Notify that the active tab changed — restart screencast etc."""
        await self._push_tabs()
        if self._on_tab_switch:
            try:
                await self._on_tab_switch(self._page)
            except Exception:
                pass

    async def _push_tabs(self) -> None:
        """Push all tab info to frontend."""
        try:
            context = self._page.context
            pages = context.pages
            tabs = []
            active_index = 0
            for i, p in enumerate(pages):
                try:
                    title = await p.title()
                except Exception:
                    title = "(loading...)"
                tabs.append({"title": title[:40], "url": p.url[:80]})
                if p == self._page:
                    active_index = i
            await self._ws.send_tabs(tabs, active_index)
        except Exception:
            pass

    async def switch_tab(self, index: int) -> None:
        """Switch to a specific tab by index."""
        try:
            context = self._page.context
            pages = context.pages
            if 0 <= index < len(pages):
                self._page = pages[index]
                await self._page.bring_to_front()
                await self._ws.send_status(f"已切换到标签页 {index + 1}")
                await self._notify_tab_switch()
                screenshot_b64 = await capture_screenshot(self._page)
                await self._ws.send_screenshot(screenshot_b64)
        except Exception:
            pass

    def record_human_action(self, action: str, **kwargs: Any) -> None:
        """Record a human action during takeover (click, type, etc.)."""
        self._agent_history.steps.append(AgentStep(
            step_number=len(self._agent_history.steps),
            browser_state=BrowserState(url=self._page.url),
            action_results=[ActionResult(
                action_type=f"human_{action}",
                action_params={"human": True, **kwargs},
                result=f"human action: {action}",
            )],
        ))

    def _get_node_info(self, snapshot: Snapshot, ref: int) -> dict:
        """Get selector and name info for a snapshot node."""
        for node in snapshot.nodes:
            if node.ref == ref:
                return {
                    "ref": ref,
                    "role": node.role,
                    "name": node.name,
                    "selector": node.selector_hint or "",
                }
        return {"ref": ref, "role": "", "name": "", "selector": ""}

    def get_recorded_steps(self) -> list[dict[str, Any]]:
        """Return recorded steps for Skill generation (backward compatible)."""
        return self._agent_history.to_recorded_steps()

    def get_history(self) -> AgentHistoryList:
        """Return the full structured history."""
        return self._agent_history
