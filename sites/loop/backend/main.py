from __future__ import annotations

import asyncio
import random
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse, StreamingResponse

from api.websocket import ConnectionManager, manager
from services.browser_session import BrowserSession
from services.boss_skill import BossReplySkill, BossDownloadSkill, BossInterviewSkill, BossEngageSkill
from services.boss_collect_skill import BossCollectSkill
from services.boss_workflow import BossWorkflowSkill
from services.taobao_skill import TaobaoReviewSkill
from services import candidate_store
from services import scheduler
from services import skill_loader
from services import skill_generator
from services import boss_file_manager, boss_qa_manager
from services.skill_registry import list_skills as registry_list_skills
from services.skill_runner import run_skill as runner_run_skill
from services.checkpoint import CheckpointManager
from services.selector_store import selector_store
from utils.screenshot import capture_screenshot
import config
import uuid

app = FastAPI(title="BrowserAgent")

# Register auth routes
from api.auth_routes import router as auth_router
app.include_router(auth_router)

from api.admin_routes import router as admin_router
app.include_router(admin_router)


@app.get("/api/session/vnc")
async def api_get_vnc(request: Request):
    """Get the VNC port for the current user's session."""
    from auth import get_current_user
    from services.session_manager import session_manager
    user = await get_current_user(request)
    session = session_manager.get(user["user_id"])
    if not session:
        return {"vnc_port": None, "status": "no_session"}
    return {"vnc_port": session.vnc_port, "display": session.display}


# Global session kept for backward compat with REST APIs that don't have auth yet
_session = BrowserSession(manager)


async def _do_mouse_drag(page, data: dict) -> None:
    """Execute a human-like mouse drag on the given page."""
    sx = data.get("startX", 0)
    sy = data.get("startY", 0)
    ex = data.get("endX", 0)
    ey = data.get("endY", 0)
    await page.mouse.move(sx, sy)
    await asyncio.sleep(0.05)
    await page.mouse.down()
    steps = max(10, abs(ex - sx) // 5)
    for i in range(1, steps + 1):
        t = i / steps
        cx = sx + (ex - sx) * t
        cy = sy + (ey - sy) * t
        await page.mouse.move(cx, cy)
        await asyncio.sleep(random.uniform(0.005, 0.02))
    await asyncio.sleep(random.uniform(0.05, 0.15))
    await page.mouse.up()
    await asyncio.sleep(0.3)

async def _scheduled_run_skill(skill_name: str, params: dict) -> dict:
    """Execute a skill for the scheduler (headless, no WebSocket)."""
    if _session.browser_locked:
        import logging
        logging.getLogger("scheduler").warning(f"Skipped scheduled {skill_name}: browser is locked by active task")
        return {"skill": skill_name, "status": "skipped", "error": "browser locked by active task"}
    await _session.ensure_browser()
    page = await _session.get_page()
    return await runner_run_skill(page, skill_name, params)


@app.on_event("startup")
async def startup():
    # Initialize database and seed admin
    import db
    await db.init_db()

    count = candidate_store.migrate_legacy()
    if count > 0:
        import logging
        logging.getLogger("startup").warning(f"Migrated {count} legacy records to candidates.json")

    skill_loader.load_all_custom_skills()
    scheduler.init(_scheduled_run_skill)

    # Start session manager
    from services.session_manager import session_manager
    await session_manager.start()


FRONTEND_DIST = Path(__file__).parent.parent / "frontend" / "dist"
LANDING_DIR = Path(__file__).parent.parent / "landing"


# Backward-compatible helpers that delegate to _session
async def _ensure_browser() -> None:
    await _session.ensure_browser()

async def _get_page():
    return await _session.get_page()

async def _get_visible_page():
    return await _session.get_visible_page()

async def _push_tabs_info() -> None:
    await _session.push_tabs_info()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket) -> None:
    from auth import get_ws_user
    from services.session_manager import session_manager

    # Accept WebSocket first, then authenticate
    await websocket.accept()

    user = get_ws_user(websocket)
    if not user:
        await websocket.send_json({"type": "error", "message": "未登录，请刷新页面"})
        await websocket.close(code=4001, reason="未登录")
        return

    user_id = user["user_id"]

    # Get or create per-user session
    try:
        _session = await session_manager.get_or_create(user_id)
    except RuntimeError as e:
        await websocket.accept()
        await websocket.send_json({"type": "error", "message": str(e)})
        await websocket.close(code=4002, reason="服务器繁忙")
        return

    # Use per-user WS ws_manager (not global)
    ws_manager = _session.ws
    await ws_manager.connect(websocket, already_accepted=True)

    # Ensure browser is launched
    try:
        await _session.ensure_browser()
        await _session.push_tabs_info()
    except Exception as e:
        import logging; logging.getLogger("ws").error(f"Browser init error: {e}")

    try:
        while True:
            data = await ws_manager.receive_json(websocket)
            msg_type = data.get("type", "")

            import logging; logging.getLogger("ws").warning(f"WS msg: {msg_type}")

            # Structured skill creation from dialog
            if msg_type == "create_skill":
                # Stop any running executor task first
                if _session.executor:
                    _session.executor.stop()
                    await asyncio.sleep(1)

                skill_name = data.get("name", "").strip()
                skill_desc = data.get("description", "").strip()
                skill_prompt = data.get("prompt", "").strip()
                target_url = data.get("url", "").strip()
                if target_url and not target_url.startswith(("http://", "https://")):
                    target_url = "https://" + target_url

                if not skill_prompt:
                    await ws_manager.send_error("请提供 Skill 的详细描述")
                    continue

                # Build an enriched prompt with structured info
                enriched_prompt = skill_prompt
                if skill_name:
                    enriched_prompt = f"[Skill名称: {skill_name}] " + enriched_prompt
                if skill_desc:
                    enriched_prompt = enriched_prompt + f"\n\n[Skill描述: {skill_desc}]"

                await ws_manager.send_status(f"正在生成 Skill「{skill_name}」...")
                try:
                    await _ensure_browser()
                    page = await _get_page()

                    # --- Navigate & detect login ---
                    did_login = False
                    if target_url:
                        await ws_manager.send_status(f"正在打开 {target_url} 分析页面结构...")
                        await page.goto(target_url, wait_until="domcontentloaded", timeout=20000)
                        await asyncio.sleep(3)

                        # Detect login page — only URL patterns or password inputs (not page text, too many false positives)
                        is_login = await page.evaluate("""() => {
                            const url = location.href.toLowerCase();
                            const loginUrlKeywords = ['login', 'signin', 'sign-in', 'auth', 'passport', 'sso', 'account/login', 'accounts.google'];
                            const urlHit = loginUrlKeywords.some(k => url.includes(k));
                            const pwdInputs = document.querySelectorAll('input[type="password"]');
                            const hasPwd = pwdInputs.length > 0;
                            return urlHit || hasPwd;
                        }""")

                        if is_login:
                            await ws_manager.send_login_required(
                                "目标网站需要登录，请人工接管浏览器完成登录。"
                            )
                            # Wait loop: handle browser control messages until login_done
                            _session.controlling = True
                            _cancelled = False
                            while True:
                                login_data = await ws_manager.receive_json(websocket)
                                lt = login_data.get("type", "")
                                if lt == "login_done":
                                    _session.controlling = False
                                    await ws_manager.send_status("登录完成，正在继续分析页面...")
                                    await asyncio.sleep(2)
                                    did_login = True
                                    break
                                elif lt == "take_control":
                                    _session.controlling = True
                                elif lt == "release_control":
                                    _session.controlling = False
                                    await ws_manager.send_status("登录完成，正在继续...")
                                    await asyncio.sleep(2)
                                    did_login = True
                                    break
                                elif lt == "mouse_click" and _session.controlling:
                                    try:
                                        x, y = login_data.get("x", 0), login_data.get("y", 0)
                                        await page.mouse.click(x, y)
                                        await asyncio.sleep(0.3)
                                    except Exception:
                                        pass
                                elif lt == "mouse_drag" and _session.controlling:
                                    try:
                                        await _do_mouse_drag(page, login_data)
                                    except Exception:
                                        pass
                                elif lt == "mouse_down" and _session.controlling:
                                    try:
                                        x, y = login_data.get("x", 0), login_data.get("y", 0)
                                        await page.mouse.move(x, y)
                                        await page.mouse.down()
                                    except Exception:
                                        pass
                                elif lt == "mouse_move" and _session.controlling:
                                    try:
                                        await page.mouse.move(login_data.get("x", 0), login_data.get("y", 0))
                                    except Exception:
                                        pass
                                elif lt == "mouse_up" and _session.controlling:
                                    try:
                                        x, y = login_data.get("x", 0), login_data.get("y", 0)
                                        await page.mouse.move(x, y)
                                        await page.mouse.up()
                                    except Exception:
                                        pass
                                elif lt == "key_input" and _session.controlling:
                                    try:
                                        await page.keyboard.press(login_data.get("key", ""))
                                    except Exception:
                                        pass
                                elif lt == "type_text" and _session.controlling:
                                    try:
                                        await page.keyboard.type(login_data.get("text", ""), delay=50)
                                    except Exception:
                                        pass
                                elif lt == "stop":
                                    _cancelled = True
                                    _session.controlling = False
                                    await ws_manager.send_status("已取消创建 Skill。")
                                    break
                            if _cancelled:
                                continue

                    # --- Learning run: AI executes the task once ---
                    import logging as _logging
                    _log = _logging.getLogger("create_skill")
                    _log.warning("=== Starting learning run ===")
                    await ws_manager.send_status("🎓 AI 开始学习运行，请在工作台观看浏览器操作...")
                    await _ensure_browser()
                    page = await _get_page()
                    assert _session.executor is not None

                    # Force navigate to target URL before learning (don't rely on AI's first step)
                    if target_url:
                        try:
                            await page.goto(target_url, wait_until="domcontentloaded", timeout=15000)
                            await asyncio.sleep(2)
                            await ws_manager.send_status(f"已打开 {target_url}")
                        except Exception as nav_err:
                            _log.warning(f"Pre-navigate failed: {nav_err}")

                    _session.browser_locked = True
                    learn_task = asyncio.create_task(_session.executor.execute_task(enriched_prompt))
                    while not learn_task.done():
                        try:
                            next_msg = await asyncio.wait_for(
                                ws_manager.receive_json(websocket), timeout=0.5
                            )
                            next_type = next_msg.get("type")
                            _log.warning(f"Learning loop got msg: {next_type}")
                            if next_type == "stop":
                                _session.executor.stop()
                                await ws_manager.send_status("已停止学习运行。")
                            elif next_type == "take_control":
                                # Pause executor instead of stopping — human-in-the-loop
                                _session.executor.pause()
                                _session.controlling = True
                                await ws_manager.send_status("⏸️ AI 已暂停，您可以手动操作浏览器。AI 会录制您的操作。完成后点击「释放控制」继续学习。")
                            elif next_type == "release_control":
                                _session.controlling = False
                                _session.executor.resume()
                                await ws_manager.send_status("▶️ 已释放控制权，AI 继续学习...")
                            elif next_type == "mouse_click" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.click(x, y)
                                    await asyncio.sleep(0.3)
                                    # Record the human click
                                    _session.executor.record_human_action("click", x=x, y=y)
                                except Exception:
                                    pass
                            elif next_type == "mouse_drag" and _session.controlling:
                                try:
                                    await _do_mouse_drag(page, next_msg)
                                    _session.executor.record_human_action("drag", startX=next_msg.get("startX", 0), startY=next_msg.get("startY", 0), endX=next_msg.get("endX", 0), endY=next_msg.get("endY", 0))
                                except Exception:
                                    pass
                            elif next_type == "mouse_down" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.move(x, y)
                                    await page.mouse.down()
                                except Exception:
                                    pass
                            elif next_type == "mouse_move" and _session.controlling:
                                try:
                                    await page.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                except Exception:
                                    pass
                            elif next_type == "mouse_up" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.move(x, y)
                                    await page.mouse.up()
                                except Exception:
                                    pass
                            elif next_type == "key_input" and _session.controlling:
                                try:
                                    key = next_msg.get("key", "")
                                    await page.keyboard.press(key)
                                    _session.executor.record_human_action("press", key=key)
                                except Exception:
                                    pass
                            elif next_type == "type_text" and _session.controlling:
                                try:
                                    text = next_msg.get("text", "")
                                    await page.keyboard.type(text, delay=50)
                                    _session.executor.record_human_action("type", text=text)
                                except Exception:
                                    pass
                        except asyncio.TimeoutError:
                            continue
                        except WebSocketDisconnect:
                            _session.executor.stop()
                            raise
                    _session.browser_locked = False
                    _log.warning(f"Learning task done. Exception: {learn_task.exception()}")
                    if learn_task.exception():
                        raise learn_task.exception()

                    # --- Generate skill from recorded steps ---
                    from services.history_to_skill import history_to_skill_prompt
                    history = _session.executor.get_history()
                    steps = _session.executor.get_recorded_steps()
                    _log.warning(f"Recorded steps: {len(steps)}")
                    if len(steps) < 2:
                        await ws_manager.send_status(
                            "学习运行步骤不足（仅 {} 步），请提供更详细的描述后重试。".format(len(steps))
                        )
                        continue

                    await ws_manager.send_status(f"学习完成（{len(steps)} 步），正在生成 Python Skill...")

                    prompt = history_to_skill_prompt(
                        history, skill_name, skill_desc or skill_prompt[:50]
                    )
                    code = await skill_generator.generate_skill(prompt)
                    preview = code[:800]
                    if len(code) > 800:
                        preview += "\n... (更多代码)"
                    await ws_manager.send_status(
                        f"Skill「{skill_name}」已生成（{len(steps)} 步），"
                        f"输入 '确认' 保存：\n\n{preview}"
                    )
                    websocket._skill_draft = {"code": code, "prompt": skill_prompt, "name": skill_name}
                except Exception as e:
                    _session.browser_locked = False
                    await ws_manager.send_error(f"生成失败: {str(e)[:100]}")
                continue

            if msg_type == "user_message":
                content = data.get("content", "").strip()

                # Skill generation mode (legacy: text-based /create command)
                if content.startswith("/create") or content.startswith("创建"):
                    prompt = content.replace("/create", "").replace("创建Skill", "").replace("创建", "").strip()
                    if not prompt:
                        await ws_manager.send_status("请描述你想创建的 Skill，例如：\n打开小红书搜索'咖啡机'，抓取前5个帖子的标题和点赞数\n\n提示：描述中包含目标网址效果更好")
                    else:
                        await ws_manager.send_status(f"正在生成 Skill: {prompt[:50]}...")
                        try:
                            await _ensure_browser()
                            page = await _get_page()

                            # Extract URL from prompt if any
                            import re as _re
                            url_match = _re.search(r'https?://[^\s,，]+', prompt)
                            target_url = url_match.group(0) if url_match else ""

                            if target_url:
                                await ws_manager.send_status(f"正在打开 {target_url} 分析页面结构...")

                            code = await skill_generator.generate_skill(
                                prompt, page=page, url=target_url
                            )
                            await ws_manager.send_status(f"代码已生成（{len(code)} 字符），正在保存...")
                            # Auto-save without confirmation
                            import re as _re
                            match = _re.search(r'NAME\s*=\s*["\']([^"\']+)', code)
                            sname = match.group(1) if match else f"custom_{int(asyncio.get_event_loop().time())}"
                            path = skill_loader.save_skill_code(sname, code)
                            loaded = skill_loader.load_skill_file(path)
                            if loaded:
                                await ws_manager.send_status(f"Skill '{loaded}' 已保存并加载！可在技能页使用。")
                            else:
                                await ws_manager.send_error("Skill 保存失败。")
                        except Exception as e:
                            await ws_manager.send_error(f"生成失败: {str(e)[:100]}")
                    continue

                # Convert recorded AI actions into a Skill
                if content in ("保存Skill", "保存skill", "saveskill"):
                    recorded = getattr(websocket, "_recorded_task", None)
                    if recorded:
                        await ws_manager.send_status("正在将录制的操作转换为 Skill 代码...")
                        try:
                            import json
                            steps_text = json.dumps(recorded["steps"], ensure_ascii=False, indent=2)
                            prompt = f"""将以下浏览器操作录制转换为一个可复用的 Skill。

## 用户的原始任务描述
{recorded["task"]}

## 录制的操作步骤
```json
{steps_text[:3000]}
```

每一步记录了：action（操作类型）、url（当前页面URL）、selector（CSS选择器）、name（元素名称）、text（输入的文字）等。

请基于这些真实的操作步骤和选择器，生成一个完整的 Python Skill 文件。
- 参数化可变部分（如搜索关键词、输入内容等）
- 保留固定的操作流程和CSS选择器
- 如果有循环/重复操作，用 for 循环处理"""

                            code = await skill_generator.generate_skill(prompt)
                            await ws_manager.send_status(f"Skill 代码已生成（{len(code)} 字符），正在保存...")
                            # Auto-save without confirmation
                            import re as _re
                            match = _re.search(r'NAME\s*=\s*["\']([^"\']+)', code)
                            sname = match.group(1) if match else f"custom_{int(asyncio.get_event_loop().time())}"
                            path = skill_loader.save_skill_code(sname, code)
                            loaded = skill_loader.load_skill_file(path)
                            if loaded:
                                await ws_manager.send_status(f"Skill '{loaded}' 已保存并加载！可在技能页使用。")
                            else:
                                await ws_manager.send_error("Skill 保存失败。")
                        except Exception as e:
                            await ws_manager.send_error(f"转换失败: {str(e)[:100]}")
                        websocket._recorded_task = None
                    else:
                        await ws_manager.send_status("没有可转换的录制操作。先执行一个任务，完成后再保存。")
                    continue

                # Confirm generated skill
                if content in ("确认", "confirm", "保存"):
                    draft = getattr(websocket, "_skill_draft", None)
                    if draft:
                        try:
                            import re
                            # Extract skill name from code
                            match = re.search(r'NAME\s*=\s*["\']([^"\']+)', draft["code"])
                            sname = match.group(1) if match else f"custom_{int(asyncio.get_event_loop().time())}"
                            path = skill_loader.save_skill_code(sname, draft["code"])
                            loaded = skill_loader.load_skill_file(path)
                            if loaded:
                                await ws_manager.send_status(f"Skill '{loaded}' 已保存并加载！刷新页面后可使用。")
                            else:
                                await ws_manager.send_error("Skill 加载失败。")
                        except Exception as e:
                            await ws_manager.send_error(f"保存失败: {str(e)[:100]}")
                        websocket._skill_draft = None
                    else:
                        await ws_manager.send_status("没有待确认的 Skill 代码。")
                    continue

                await ws_manager.send_status(f"收到指令: {content}")

                # If input is just a URL, navigate directly without AI planning
                if content.startswith("http://") or content.startswith("https://"):
                    try:
                        await _ensure_browser()
                        page = await _get_page()
                        await page.goto(content, wait_until="domcontentloaded", timeout=15000)
                        await asyncio.sleep(2)
                        b64 = await capture_screenshot(page)
                        await ws_manager.send_screenshot(b64)
                        await ws_manager.send_status(f"已打开: {await page.title()}")
                    except Exception as e:
                        await ws_manager.send_error(f"导航失败: {str(e)[:100]}")
                    continue

                try:
                    await _ensure_browser()
                    assert _session.executor is not None
                    _session.browser_locked = True
                    task = asyncio.create_task(_session.executor.execute_task(content))
                    while not task.done():
                        try:
                            next_msg = await asyncio.wait_for(
                                ws_manager.receive_json(websocket), timeout=0.5
                            )
                            next_type = next_msg.get("type")
                            if next_type == "stop":
                                _session.executor.stop()
                                await ws_manager.send_status("正在停止...")
                            elif next_type == "take_control":
                                _session.executor.pause()
                                _session.controlling = True
                                await ws_manager.send_status("⏸️ AI 已暂停，您可以手动操作。完成后点击「释放控制」。")
                            elif next_type == "release_control":
                                _session.controlling = False
                                _session.executor.resume()
                                await ws_manager.send_status("▶️ 已释放控制权，AI 继续执行...")
                            elif next_type == "mouse_click" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.click(x, y)
                                    _session.executor.record_human_action("click", x=x, y=y)
                                except Exception:
                                    pass
                            elif next_type == "mouse_drag" and _session.controlling:
                                try:
                                    await _do_mouse_drag(page, next_msg)
                                    _session.executor.record_human_action("drag", startX=next_msg.get("startX", 0), startY=next_msg.get("startY", 0), endX=next_msg.get("endX", 0), endY=next_msg.get("endY", 0))
                                except Exception:
                                    pass
                            elif next_type == "mouse_down" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.move(x, y)
                                    await page.mouse.down()
                                except Exception:
                                    pass
                            elif next_type == "mouse_move" and _session.controlling:
                                try:
                                    await page.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                except Exception:
                                    pass
                            elif next_type == "mouse_up" and _session.controlling:
                                try:
                                    x, y = next_msg.get("x", 0), next_msg.get("y", 0)
                                    await page.mouse.move(x, y)
                                    await page.mouse.up()
                                except Exception:
                                    pass
                            elif next_type == "key_input" and _session.controlling:
                                try:
                                    await page.keyboard.press(next_msg.get("key", ""))
                                    _session.executor.record_human_action("press", key=next_msg.get("key", ""))
                                except Exception:
                                    pass
                            elif next_type == "type_text" and _session.controlling:
                                try:
                                    text = next_msg.get("text", "")
                                    await page.keyboard.type(text, delay=50)
                                    _session.executor.record_human_action("type", text=text)
                                except Exception:
                                    pass
                        except asyncio.TimeoutError:
                            continue
                        except WebSocketDisconnect:
                            _session.executor.stop()
                            raise
                    _session.browser_locked = False
                    if task.exception():
                        raise task.exception()

                    # Offer to save as Skill if steps were recorded
                    steps = _session.executor.get_recorded_steps()
                    if len(steps) >= 2:
                        await ws_manager.send_status(
                            f"操作已录制 ({len(steps)} 步)。输入 '保存Skill' 可将此操作保存为可复用的 Skill。"
                        )
                        websocket._recorded_task = {
                            "task": content,
                            "steps": steps,
                        }

                except WebSocketDisconnect:
                    raise
                except Exception as e:
                    await ws_manager.send_error(f"执行错误: {str(e)[:200]}")

            elif msg_type == "stop":
                if _session.executor:
                    _session.executor.stop()
                if _session.current_skill:
                    _session.current_skill.stop()
                # Cancel running skill tasks
                for tid, info in _session.skill_tasks.items():
                    task = info.get("_task")
                    if task and not task.done():
                        task.cancel()
                await ws_manager.send_status("已停止执行。")

            elif msg_type == "take_control":
                import logging; logging.getLogger("ws").warning("take_control received")
                _session.controlling = True
                if _session.executor:
                    _session.executor.stop()
                await _ensure_browser()
                await ws_manager.send_status("已接管控制权。")
                await _push_tabs_info()

            elif msg_type == "release_control":
                _session.controlling = False
                await ws_manager.send_status("已释放控制权，AI 可以继续操作。")

            elif msg_type == "switch_tab":
                tab_index = data.get("index", 0)
                if _session.executor:
                    await _session.executor.switch_tab(tab_index)
                else:
                    # Handle tab switch without executor
                    try:
                        if _session.provider and _session.provider._context:
                            pages = _session.provider._context.pages
                            if 0 <= tab_index < len(pages):
                                target = pages[tab_index]
                                await target.bring_to_front()
                                await ws_manager.send_status(f"已切换到标签页 {tab_index + 1}")
                                await _push_tabs_info()
                                b64 = await capture_screenshot(target)
                                await ws_manager.send_screenshot(b64)
                    except Exception:
                        pass

            elif msg_type == "mouse_click":
                import logging; logging.getLogger("ws").warning(f"mouse_click x={data.get('x')} y={data.get('y')} controlling={_session.controlling}")
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        x = data.get("x", 0)
                        y = data.get("y", 0)
                        await page.mouse.click(x, y)
                        await asyncio.sleep(0.3)
                    except Exception as e:
                        await ws_manager.send_error(f"点击失败: {str(e)[:100]}")

            elif msg_type == "mouse_drag":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        await _do_mouse_drag(page, data)
                    except Exception as e:
                        await ws_manager.send_error(f"拖拽失败: {str(e)[:100]}")

            elif msg_type == "mouse_down":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        x, y = data.get("x", 0), data.get("y", 0)
                        await page.mouse.move(x, y)
                        await page.mouse.down()
                    except Exception:
                        pass

            elif msg_type == "mouse_move":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        x, y = data.get("x", 0), data.get("y", 0)
                        await page.mouse.move(x, y)
                    except Exception:
                        pass

            elif msg_type == "mouse_up":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        x, y = data.get("x", 0), data.get("y", 0)
                        await page.mouse.move(x, y)
                        await page.mouse.up()
                    except Exception:
                        pass

            elif msg_type == "key_input":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        key = data.get("key", "")
                        await page.keyboard.press(key)
                    except Exception as e:
                        await ws_manager.send_error(f"按键失败: {str(e)[:100]}")

            elif msg_type == "type_text":
                if _session.controlling:
                    try:
                        page = await _get_visible_page()
                        text = data.get("text", "")
                        await page.keyboard.type(text, delay=50)
                    except Exception as e:
                        await ws_manager.send_error(f"输入失败: {str(e)[:100]}")

            elif msg_type == "run_skill":
                # Stop any running executor/skill first
                if _session.executor:
                    _session.executor.stop()

                skill_name = data.get("skill", "")
                params = data.get("params", {})

                if skill_name in ("boss_reply", "boss_download", "boss_interview", "boss_engage", "boss_collect", "boss_workflow", "taobao_review"):
                    try:
                        await _ensure_browser()
                        page = await _get_page()
                        if skill_name == "boss_reply":
                            skill = BossReplySkill(page, ws_manager)
                            task = asyncio.create_task(
                                skill.run(reply_text=params.get("reply_text"))
                            )
                        elif skill_name == "boss_download":
                            skill = BossDownloadSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run())
                        elif skill_name == "boss_engage":
                            q_list = [
                                v for k, v in sorted(params.items())
                                if k.startswith("q") and v.strip()
                            ]
                            skill = BossEngageSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run(
                                reply_text=params.get("reply_text"),
                                questions=q_list if q_list else None,
                            ))
                        elif skill_name == "boss_collect":
                            skill = BossCollectSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run(
                                webhook_url=params.get("webhook_url", ""),
                            ))
                        elif skill_name == "boss_workflow":
                            import json as _json
                            pq_raw = params.get("position_questions", "")
                            pq = _json.loads(pq_raw) if pq_raw else {}
                            max_n = int(params.get("max_per_run", "20"))
                            skill = BossWorkflowSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run(
                                reply_text=params.get("reply_text"),
                                position_questions=pq if pq else None,
                                max_per_run=max_n,
                            ))
                        elif skill_name == "taobao_review":
                            skill = TaobaoReviewSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run(
                                keyword=params.get("keyword", ""),
                                top_n=int(params.get("top_n", "3")),
                                sort_by=params.get("sort_by", "default"),
                                max_reviews=int(params.get("max_reviews", "50")),
                                feishu_url=params.get("feishu_url", ""),
                                product_url=params.get("product_url", ""),
                            ))
                        else:
                            # boss_interview
                            q_list = [
                                v for k, v in sorted(params.items())
                                if k.startswith("q") and v.strip()
                            ]
                            wait_s = int(params.get("wait_seconds", "60"))
                            skill = BossInterviewSkill(page, ws_manager)
                            task = asyncio.create_task(skill.run(q_list, wait_s))
                        # Listen for stop while skill runs; refresh screencast & tabs periodically
                        _screencast_tick = 0
                        _pending_run_skill = None  # If user starts new skill while current runs
                        await _push_tabs_info()
                        while not task.done():
                            try:
                                next_msg = await asyncio.wait_for(
                                    ws_manager.receive_json(websocket), timeout=0.5
                                )
                                next_type = next_msg.get("type")
                                if next_type == "stop":
                                    skill.stop()
                                    task.cancel()
                                    try:
                                        await task
                                    except (asyncio.CancelledError, Exception):
                                        pass
                                    await ws_manager.send_status("已停止 Skill。")
                                    break
                                elif next_type == "run_skill":
                                    # New skill requested — stop current and break
                                    skill.stop()
                                    task.cancel()
                                    try:
                                        await task
                                    except (asyncio.CancelledError, Exception):
                                        pass
                                    _pending_run_skill = next_msg
                                    await ws_manager.send_status("正在切换 Skill...")
                                    break
                                elif next_type == "take_control":
                                    _session.controlling = True
                                    if hasattr(skill, 'pause'):
                                        skill.pause()
                                    await ws_manager.send_status("已接管控制权，Skill 已暂停。")
                                elif next_type == "release_control":
                                    _session.controlling = False
                                    if hasattr(skill, 'resume'):
                                        skill.resume()
                                    await ws_manager.send_status("已释放控制权，Skill 继续执行。")
                                elif next_type == "switch_tab":
                                    tab_idx = next_msg.get("index", 0)
                                    try:
                                        if _session.provider and _session.provider._context:
                                            tab_pages = _session.provider._context.pages
                                            if 0 <= tab_idx < len(tab_pages):
                                                await tab_pages[tab_idx].bring_to_front()
                                                await _push_tabs_info()
                                                b64 = await capture_screenshot(tab_pages[tab_idx])
                                                await ws_manager.send_screenshot(b64)
                                    except Exception:
                                        pass
                                elif next_type == "mouse_click" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.mouse.click(next_msg.get("x", 0), next_msg.get("y", 0))
                                elif next_type == "mouse_drag" and _session.controlling:
                                    page = await _get_visible_page()
                                    await _do_mouse_drag(page, next_msg)
                                elif next_type == "mouse_down" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                    await page.mouse.down()
                                elif next_type == "mouse_move" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                elif next_type == "mouse_up" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                    await page.mouse.up()
                                elif next_type == "key_input" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.keyboard.press(next_msg.get("key", ""))
                                elif next_type == "type_text" and _session.controlling:
                                    page = await _get_visible_page()
                                    await page.keyboard.type(next_msg.get("text", ""), delay=50)
                            except asyncio.TimeoutError:
                                _screencast_tick += 1
                                # Refresh screencast every ~5 seconds (10 * 0.5s)
                                if _screencast_tick % 10 == 0:
                                    await _push_tabs_info()
                                continue
                            except WebSocketDisconnect:
                                skill.stop()
                                raise
                        if not task.cancelled() and task.done() and task.exception():
                            raise task.exception()
                    except WebSocketDisconnect:
                        raise
                    except asyncio.CancelledError:
                        pass
                    except Exception as e:
                        await ws_manager.send_error(f"Skill 错误: {str(e)[:200]}")
                    # Push final tab state & clean up
                    await _push_tabs_info()
                    _pending_run_skill = None
                else:
                    # Try loading as custom/dynamic skill
                    from services.skill_registry import get_skill_class
                    cls = get_skill_class(skill_name)
                    if cls:
                        try:
                            await _ensure_browser()
                            page = await _get_page()
                            skill = cls(page, ws_manager)
                            task = asyncio.create_task(skill.run(**params))
                            _custom_tick = 0
                            await _push_tabs_info()
                            while not task.done():
                                try:
                                    next_msg = await asyncio.wait_for(
                                        ws_manager.receive_json(websocket), timeout=0.5
                                    )
                                    next_type = next_msg.get("type")
                                    if next_type == "stop":
                                        skill.stop()
                                        task.cancel()
                                        try:
                                            await task
                                        except (asyncio.CancelledError, Exception):
                                            pass
                                        await ws_manager.send_status("已停止 Skill。")
                                        break
                                    elif next_type == "take_control":
                                        _session.controlling = True
                                        if hasattr(skill, 'pause'):
                                            skill.pause()
                                        await ws_manager.send_status("已接管控制权，Skill 已暂停。")
                                    elif next_type == "release_control":
                                        _session.controlling = False
                                        if hasattr(skill, 'resume'):
                                            skill.resume()
                                        await ws_manager.send_status("已释放控制权，Skill 继续执行。")
                                    elif next_type == "switch_tab":
                                        tab_idx = next_msg.get("index", 0)
                                        try:
                                            if _session.provider and _session.provider._context:
                                                tab_pages = _session.provider._context.pages
                                                if 0 <= tab_idx < len(tab_pages):
                                                    await tab_pages[tab_idx].bring_to_front()
                                                    await _push_tabs_info()
                                                    b64 = await capture_screenshot(tab_pages[tab_idx])
                                                    await ws_manager.send_screenshot(b64)
                                        except Exception:
                                            pass
                                    elif next_type == "mouse_click" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.mouse.click(next_msg.get("x", 0), next_msg.get("y", 0))
                                    elif next_type == "mouse_drag" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await _do_mouse_drag(pg, next_msg)
                                    elif next_type == "mouse_down" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                        await pg.mouse.down()
                                    elif next_type == "mouse_move" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                    elif next_type == "mouse_up" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.mouse.move(next_msg.get("x", 0), next_msg.get("y", 0))
                                        await pg.mouse.up()
                                    elif next_type == "key_input" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.keyboard.press(next_msg.get("key", ""))
                                    elif next_type == "type_text" and _session.controlling:
                                        pg = await _get_visible_page()
                                        await pg.keyboard.type(next_msg.get("text", ""), delay=50)
                                except asyncio.TimeoutError:
                                    _custom_tick += 1
                                    if _custom_tick % 10 == 0:
                                        await _push_tabs_info()
                                    continue
                                except WebSocketDisconnect:
                                    skill.stop()
                                    raise
                            if task.exception():
                                raise task.exception()
                        except WebSocketDisconnect:
                            raise
                        except Exception as e:
                            await ws_manager.send_error(f"Skill 错误: {str(e)[:200]}")
                    else:
                        await ws_manager.send_error(f"未知 Skill: {skill_name}")

            elif msg_type == "login_done":
                # User finished logging in (skill monitors URL change automatically)
                await ws_manager.send_status("登录完成，AI 可以继续操作。")

            else:
                await ws_manager.send_error(f"未知消息类型: {msg_type}")

    except WebSocketDisconnect:
        _session.controlling = False
        ws_manager.disconnect(websocket)


@app.get("/api/candidates")
async def api_list_candidates(status: str = "", position: str = "", date: str = "", updated_date: str = ""):
    candidates = candidate_store.list_all(
        status=status or None,
        position=position or None,
        date=date or None,
        updated_date=updated_date or None,
    )
    return {"candidates": candidates, "total": len(candidates)}


@app.get("/api/candidates/stats")
async def api_candidates_stats():
    return candidate_store.get_stats()


@app.get("/api/candidates/csv")
async def api_candidates_csv(status: str = "", position: str = ""):
    import csv as _csv, io
    candidates = candidate_store.list_all(
        status=status or None, position=position or None
    )
    output = io.StringIO()
    writer = _csv.writer(output)
    writer.writerow(["boss_id", "name", "position", "status", "engaged_at",
                      "resume_filename", "resume_path", "questions", "replies",
                      "replied_at", "created_at", "updated_at"])
    for c in candidates:
        resume = c.get("resume") or {}
        writer.writerow([
            c.get("boss_id", ""),
            c.get("name", ""),
            c.get("position", ""),
            c.get("status", ""),
            c.get("engaged_at", ""),
            resume.get("filename", ""),
            resume.get("path", ""),
            "; ".join(c.get("questions", [])),
            "; ".join(c.get("replies", [])),
            c.get("replied_at", ""),
            c.get("created_at", ""),
            c.get("updated_at", ""),
        ])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=candidates.csv"},
    )


@app.get("/api/candidates/{boss_id}")
async def api_get_candidate(boss_id: str):
    c = candidate_store.get(boss_id)
    if not c:
        return JSONResponse({"error": "candidate not found"}, status_code=404)
    return c


@app.get("/api/scheduler")
async def api_list_schedules():
    return {"schedules": scheduler.list_schedules()}


@app.put("/api/scheduler/{skill_name}")
async def api_upsert_schedule(skill_name: str, body: dict):
    sched = scheduler.upsert_schedule(
        skill=skill_name,
        params=body.get("params"),
        interval_hours=body.get("interval_hours", 24),
        enabled=body.get("enabled", True),
    )
    return sched


@app.delete("/api/scheduler/{skill_name}")
async def api_delete_schedule(skill_name: str):
    ok = scheduler.delete_schedule(skill_name)
    if not ok:
        return JSONResponse({"error": "schedule not found"}, status_code=404)
    return {"skill": skill_name, "status": "deleted"}


_OP_LOG_PATH = config.DATA_DIR / "operation_log.json"


@app.get("/api/logs")
async def api_get_logs():
    import json
    if _OP_LOG_PATH.exists():
        try:
            return json.loads(_OP_LOG_PATH.read_text(encoding="utf-8"))
        except Exception:
            pass
    return {"messages": []}


@app.post("/api/logs")
async def api_save_logs(body: dict):
    import json
    msgs = body.get("messages", [])
    # Keep last 500 messages max
    msgs = msgs[-500:]
    _OP_LOG_PATH.write_text(json.dumps({"messages": msgs}, ensure_ascii=False), encoding="utf-8")
    return {"saved": len(msgs)}


@app.get("/api/models")
async def api_get_models():
    return {
        "vl": {"model": config.VL_MODEL, "base_url": config.VL_BASE_URL, "api_key": config.VL_API_KEY[:8] + "***"},
        "code": {"model": config.CODE_MODEL, "base_url": config.CODE_BASE_URL, "api_key": config.CODE_API_KEY[:8] + "***"},
    }


@app.put("/api/models")
async def api_set_models(body: dict):
    vl = body.get("vl", {})
    code = body.get("code", {})
    if vl.get("model"):
        config.VL_MODEL = vl["model"]
    if vl.get("base_url"):
        config.VL_BASE_URL = vl["base_url"]
    if vl.get("api_key"):
        config.VL_API_KEY = vl["api_key"]
    if code.get("model"):
        config.CODE_MODEL = code["model"]
    if code.get("base_url"):
        config.CODE_BASE_URL = code["base_url"]
    if code.get("api_key"):
        config.CODE_API_KEY = code["api_key"]
    return {"status": "updated"}


@app.get("/api/feishu")
async def api_get_feishu():
    data = dict(config.feishu)
    # Mask secret
    if data.get("app_secret"):
        data["app_secret"] = data["app_secret"][:6] + "***"
    return data


@app.put("/api/feishu")
async def api_set_feishu(body: dict):
    if body.get("app_id"):
        config.feishu["app_id"] = body["app_id"]
    if body.get("app_secret") and "***" not in body["app_secret"]:
        config.feishu["app_secret"] = body["app_secret"]
    config._save_feishu(config.feishu)
    return {"status": "updated"}


@app.get("/api/antifraud")
async def api_get_antifraud():
    return config.antifraud


@app.put("/api/antifraud")
async def api_set_antifraud(body: dict):
    for key in ("min_delay", "max_delay", "pause_prob"):
        if key in body:
            config.antifraud[key] = int(body[key])
    for key in ("stealth_enabled", "mouse_trace"):
        if key in body:
            config.antifraud[key] = bool(body[key])
    config._save_antifraud(config.antifraud)
    return config.antifraud


@app.get("/api/skills/export/{skill_name}")
async def api_export_skill(skill_name: str):
    code = skill_loader.get_skill_source(skill_name)
    if not code:
        return JSONResponse({"error": "skill not found"}, status_code=404)
    # Detect format from content
    is_md = code.strip().startswith("---")
    ext = ".md" if is_md else ".py"
    media = "text/markdown" if is_md else "text/x-python"
    return StreamingResponse(
        iter([code]),
        media_type=media,
        headers={"Content-Disposition": f"attachment; filename={skill_name}{ext}"},
    )


@app.post("/api/skills/upload")
async def api_upload_skill(body: dict):
    """Upload a skill .py file. Expects {"filename": "...", "code": "..."}"""
    filename = body.get("filename", "")
    code = body.get("code", "")
    if not code:
        return JSONResponse({"error": "missing code"}, status_code=400)
    if not filename:
        filename = "custom_skill.py"
    if not filename.endswith(".py"):
        filename += ".py"
    path = skill_loader.CUSTOM_SKILLS_DIR / filename
    path.write_text(code, encoding="utf-8")
    loaded = skill_loader.load_skill_file(path)
    if loaded:
        return {"skill": loaded, "status": "loaded", "filename": filename}
    else:
        return JSONResponse({"error": "failed to load skill from uploaded file"}, status_code=500)


@app.delete("/api/skills/custom/{skill_name}")
async def api_delete_custom_skill(skill_name: str):
    ok = skill_loader.unload_skill(skill_name)
    if not ok:
        return JSONResponse({"error": "skill not found"}, status_code=404)
    # Also delete the file
    for f in skill_loader.CUSTOM_SKILLS_DIR.glob("*.py"):
        code = f.read_text(encoding="utf-8")
        if f'NAME = "{skill_name}"' in code or f"NAME = '{skill_name}'" in code:
            f.unlink()
            break
    return {"skill": skill_name, "status": "deleted"}


@app.post("/api/skills/generate")
async def api_generate_skill(body: dict):
    prompt = body.get("prompt", "")
    conversation = body.get("conversation", [])
    if not prompt:
        return JSONResponse({"error": "missing prompt"}, status_code=400)
    try:
        code = await skill_generator.generate_skill(prompt, conversation)
        return {"code": code}
    except Exception as e:
        return JSONResponse({"error": str(e)[:200]}, status_code=500)


@app.post("/api/skills/generate/confirm")
async def api_confirm_skill(body: dict):
    code = body.get("code", "")
    skill_name = body.get("skill_name", "")
    if not code or not skill_name:
        return JSONResponse({"error": "missing code or skill_name"}, status_code=400)

    # Save and load
    path = skill_loader.save_skill_code(skill_name, code)
    loaded = skill_loader.load_skill_file(path)
    if loaded:
        return {"skill": loaded, "status": "loaded", "path": str(path)}
    else:
        return JSONResponse({"error": "failed to load skill"}, status_code=500)


@app.get("/api/custom-csv/{filename}")
async def api_custom_csv(filename: str):
    """Serve CSV files from custom skill data directories."""
    # Search in all subdirs of DATA_DIR
    for csv_file in config.DATA_DIR.rglob(filename):
        return FileResponse(csv_file, filename=filename, media_type="text/csv")
    return JSONResponse({"error": "file not found"}, status_code=404)


@app.get("/api/resumes/zip")
async def api_resumes_zip(date: str = ""):
    """Download all resumes as a ZIP file."""
    import zipfile, io
    resume_dir = config.RESUME_DIR
    if not resume_dir.exists():
        return JSONResponse({"error": "no resumes"}, status_code=404)

    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        for pdf in resume_dir.rglob("*.pdf"):
            rel = pdf.relative_to(resume_dir)
            if date and not str(rel).startswith(date):
                continue
            zf.write(pdf, str(rel))
        for docx in resume_dir.rglob("*.docx"):
            rel = docx.relative_to(resume_dir)
            if date and not str(rel).startswith(date):
                continue
            zf.write(docx, str(rel))
    buf.seek(0)
    filename = f"resumes_{date}.zip" if date else "resumes_all.zip"
    return StreamingResponse(
        iter([buf.getvalue()]),
        media_type="application/zip",
        headers={"Content-Disposition": f"attachment; filename={filename}"},
    )


@app.get("/api/taobao/csv/{filename}")
async def api_taobao_csv(filename: str):
    csv_dir = config.DATA_DIR / "taobao_reviews"
    file_path = csv_dir / filename
    if not file_path.exists():
        return JSONResponse({"error": "file not found"}, status_code=404)
    return FileResponse(file_path, filename=filename, media_type="text/csv")


@app.get("/api/debug/dom")
async def api_debug_dom(selector: str = "*", js: str = "", request: Request = None):
    """Admin-only: inspect DOM."""
    from auth import require_admin
    await require_admin(request)
    await _ensure_browser()
    page = await _get_page()
    if js:
        result = await page.evaluate(js)
        return {"result": result}
    count = await page.locator(selector).count()
    return {"selector": selector, "count": count}


@app.on_event("shutdown")
async def shutdown() -> None:
    # Clean up all multi-tenant sessions
    from services.session_manager import session_manager
    await session_manager.stop()

    # Clean up legacy global session
    _session.controlling = False
    if _session.provider:
        await _session.provider.close()
        _session.provider = None


@app.get("/downloads/{filename}")
async def download_file(filename: str) -> FileResponse:
    file_path = config.DOWNLOAD_DIR / filename
    if not file_path.exists():
        return JSONResponse({"error": "file not found"}, status_code=404)
    return FileResponse(file_path, filename=filename)


# Resume API
@app.get("/api/resumes")
async def api_list_resumes(date: str = "", position: str = ""):
    resumes = boss_file_manager.list_resumes(
        date=date or None, position=position or None
    )
    return {"resumes": resumes, "total": len(resumes)}


@app.get("/api/qa")
async def api_list_qa(date: str = "", candidate: str = ""):
    records = boss_qa_manager.list_qa(
        date=date or None, candidate=candidate or None
    )
    return {"records": records, "total": len(records)}


@app.get("/api/resumes/stats")
async def api_resume_stats():
    return boss_file_manager.get_stats()


@app.get("/api/resumes/{date}/{position}/{filename}")
async def api_download_resume(date: str, position: str, filename: str):
    file_path = config.RESUME_DIR / date / position / filename
    if not file_path.exists():
        return JSONResponse({"error": "file not found"}, status_code=404)
    return FileResponse(file_path, filename=filename)


@app.post("/api/skills/{skill_name}/reset-checkpoint")
async def api_reset_checkpoint(skill_name: str):
    ckpt = CheckpointManager(skill_name)
    count = ckpt.count()
    ckpt.reset()
    return {"skill": skill_name, "cleared": count}


@app.get("/api/skills/{skill_name}/checkpoint")
async def api_get_checkpoint(skill_name: str):
    ckpt = CheckpointManager(skill_name)
    return {"skill": skill_name, "processed_count": ckpt.count(), "processed_ids": ckpt.processed_ids}


@app.get("/api/skills/{skill_name}/params")
async def api_get_skill_params(skill_name: str):
    """Return last-used params for a skill."""
    params_file = config.DATA_DIR / "skill_params.json"
    if params_file.exists():
        try:
            import json as _j
            all_params = _j.loads(params_file.read_text(encoding="utf-8"))
            return {"skill": skill_name, "params": all_params.get(skill_name, {})}
        except Exception:
            pass
    return {"skill": skill_name, "params": {}}


@app.put("/api/skills/{skill_name}/params")
async def api_save_skill_params(skill_name: str, body: dict):
    """Save last-used params for a skill."""
    import json as _j
    params_file = config.DATA_DIR / "skill_params.json"
    all_params: dict = {}
    if params_file.exists():
        try:
            all_params = _j.loads(params_file.read_text(encoding="utf-8"))
        except Exception:
            pass
    all_params[skill_name] = body.get("params", {})
    params_file.write_text(_j.dumps(all_params, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"skill": skill_name, "params": all_params[skill_name]}


@app.get("/api/selectors")
async def api_list_selectors():
    return {"selectors": selector_store.list_all()}


@app.post("/api/selectors/{key}")
async def api_set_selector(key: str, body: dict):
    new_selector = body.get("selector", "")
    if not new_selector:
        return JSONResponse({"error": "missing 'selector' field"}, status_code=400)
    selector_store.set_override(key, new_selector)
    return {"key": key, "selector": new_selector, "status": "overridden"}


@app.delete("/api/selectors/{key}")
async def api_delete_selector(key: str):
    selector_store.remove_override(key)
    return {"key": key, "status": "reverted to default"}


@app.post("/api/solve-captcha")
async def api_solve_captcha():
    """Trigger xdotool captcha solver on the current page."""
    from services.captcha_solver import solve_slider_xdotool
    try:
        page = await _get_visible_page()
        solved = await solve_slider_xdotool(page)
        return {"solved": solved}
    except Exception as e:
        return {"solved": False, "error": str(e)[:200]}


@app.post("/api/taobao-login")
async def api_taobao_login(body: dict = {}, request: Request = None):
    """Admin-only: Fill Taobao login form via xdotool."""
    from auth import require_admin
    await require_admin(request)

    import subprocess, os, time as _time
    from services.captcha_solver import solve_slider_xdotool, _find_chrome_window

    username = body.get("username", "")
    password = body.get("password", "")
    display = os.getenv("DISPLAY", ":99")
    steps = []

    def xdo(*args):
        env = {**os.environ, "DISPLAY": display}
        subprocess.run(["xdotool", *args], env=env, capture_output=True, timeout=5)

    try:
        page = await _get_visible_page()

        # Get Chrome window offset
        wid, off_x, off_y = _find_chrome_window()
        steps.append(f"window: wid={wid} offset=({off_x},{off_y})")

        # Find login form elements across all frames (handles cross-origin iframes)
        positions = {}
        for frame in page.frames:
            try:
                frame_positions = await frame.evaluate("""() => {
                    const result = {};
                    const inputs = document.querySelectorAll('input');
                    for (const inp of inputs) {
                        const r = inp.getBoundingClientRect();
                        if (r.width < 10 || r.height < 10) continue;
                        const ph = (inp.placeholder || '').toLowerCase();
                        const type = inp.type || 'text';
                        const cx = r.x + r.width/2;
                        const cy = r.y + r.height/2;
                        if (!result.username && type !== 'password' && type !== 'hidden' &&
                            (ph.includes('账号') || ph.includes('手机') || ph.includes('邮箱') ||
                             ph.includes('用户') || inp.name === 'loginId' ||
                             inp.name === 'TPL_username' || inp.id.includes('user'))) {
                            result.username = {x: cx, y: cy, ph: inp.placeholder};
                        }
                        if (!result.password && (type === 'password' ||
                            ph.includes('密码') || ph.includes('password'))) {
                            result.password = {x: cx, y: cy, ph: inp.placeholder};
                        }
                    }
                    const btns = document.querySelectorAll('button, input[type="submit"]');
                    for (const btn of btns) {
                        const txt = (btn.textContent || btn.value || '').trim();
                        if (txt.includes('登录')) {
                            const r = btn.getBoundingClientRect();
                            if (r.width > 30)
                                result.loginBtn = {x: r.x + r.width/2, y: r.y + r.height/2};
                        }
                    }
                    return result;
                }""")
                # If this is a child frame, add iframe offset
                if frame != page.main_frame and frame_positions:
                    try:
                        # Get iframe element position in parent
                        iframe_box = await frame.frame_element().bounding_box()
                        if iframe_box:
                            for key in frame_positions:
                                if frame_positions[key]:
                                    frame_positions[key]["x"] += iframe_box["x"]
                                    frame_positions[key]["y"] += iframe_box["y"]
                    except Exception:
                        pass
                # Merge found positions
                for key in frame_positions:
                    if frame_positions[key] and key not in positions:
                        positions[key] = frame_positions[key]
            except Exception:
                continue

        steps.append(f"positions: {positions}")

        if not positions.get("username") and not positions.get("password"):
            return {"status": "no_login_form", "steps": steps}

        # Type username via xdotool at exact screen coords
        if positions.get("username"):
            sx = int(off_x + positions["username"]["x"])
            sy = int(off_y + positions["username"]["y"])
            xdo("mousemove", str(sx), str(sy))
            _time.sleep(0.2)
            xdo("click", "--repeat", "3", "1")
            _time.sleep(0.1)
            xdo("key", "BackSpace")
            _time.sleep(0.1)
            xdo("type", "--clearmodifiers", "--delay", "50", username)
            steps.append(f"username typed at ({sx},{sy})")
            _time.sleep(0.3)

        # Type password via xdotool at exact screen coords
        if positions.get("password"):
            sx = int(off_x + positions["password"]["x"])
            sy = int(off_y + positions["password"]["y"])
            xdo("mousemove", str(sx), str(sy))
            _time.sleep(0.2)
            xdo("click", "1")
            _time.sleep(0.2)
            xdo("type", "--clearmodifiers", "--delay", "60", password)
            steps.append(f"password typed at ({sx},{sy})")
            _time.sleep(0.3)

        # Solve slider via xdotool
        try:
            solved = await solve_slider_xdotool(page)
            steps.append(f"slider: {'solved' if solved else 'not found'}")
        except Exception as e:
            steps.append(f"slider: {str(e)[:60]}")

        # Click login button via xdotool
        if positions.get("loginBtn"):
            sx = int(off_x + positions["loginBtn"]["x"])
            sy = int(off_y + positions["loginBtn"]["y"])
            _time.sleep(0.5)
            xdo("mousemove", str(sx), str(sy))
            _time.sleep(0.2)
            xdo("click", "1")
            steps.append(f"login clicked at ({sx},{sy})")

        await asyncio.sleep(3)
        return {"status": "ok", "steps": steps}
    except Exception as e:
        return {"status": "error", "error": str(e)[:200], "steps": steps}


@app.post("/api/debug/eval")
async def api_debug_eval(body: dict, request: Request):
    """Admin-only: evaluate JS on the current browser page for debugging."""
    from auth import require_admin
    await require_admin(request)
    js = body.get("js", "")
    if not js:
        return {"error": "missing js"}
    try:
        page = await _get_page()
        result = await page.evaluate(js)
        return {"result": result}
    except Exception as e:
        return {"error": str(e)[:300]}


@app.get("/api/skills")
async def api_list_skills():
    return {"skills": registry_list_skills()}


@app.post("/api/skills/run")
async def api_run_skill(body: dict):
    """Trigger a Skill asynchronously. Returns task_id for polling."""
    skill_name = body.get("skill", "")
    params = body.get("params", {})

    if not skill_name:
        return JSONResponse({"error": "missing 'skill' field"}, status_code=400)

    # Check if there's already a running skill
    for tid, info in _session.skill_tasks.items():
        if info["status"] == "running":
            return JSONResponse(
                {"error": f"Skill '{info['skill']}' is already running (task: {tid})"},
                status_code=409,
            )

    task_id = uuid.uuid4().hex[:12]
    _session.skill_tasks[task_id] = {
        "status": "running",
        "skill": skill_name,
        "params": params,
        "result": None,
    }

    _current_task = None

    async def _run_in_background():
        def _save_ref(s):
            _session.current_skill = s
        try:
            await _ensure_browser()
            page = await _get_page()
            result = await runner_run_skill(page, skill_name, params, ws_manager=manager,
                                            skill_ref_callback=_save_ref)
            _session.skill_tasks[task_id]["result"] = result
            _session.skill_tasks[task_id]["status"] = "completed"
        except asyncio.CancelledError:
            _session.skill_tasks[task_id]["result"] = {
                "skill": skill_name, "status": "stopped", "error": "用户停止",
            }
            _session.skill_tasks[task_id]["status"] = "stopped"
        except Exception as e:
            _session.skill_tasks[task_id]["result"] = {
                "skill": skill_name, "status": "error", "error": str(e)[:200],
            }
            _session.skill_tasks[task_id]["status"] = "error"
        finally:
            _session.current_skill = None

    _session.skill_tasks[task_id]["_task"] = asyncio.create_task(_run_in_background())

    return {"task_id": task_id, "skill": skill_name, "status": "running"}


@app.get("/api/skills/tasks/{task_id}")
async def api_get_skill_task(task_id: str):
    """Poll for skill execution status and result."""
    info = _session.skill_tasks.get(task_id)
    if not info:
        return JSONResponse({"error": "task not found"}, status_code=404)
    return {
        "task_id": task_id,
        "skill": info["skill"],
        "status": info["status"],
        "result": info["result"],
    }


@app.post("/api/skills/stop")
async def api_stop_skill():
    """Stop the currently running skill."""
    # current_skill accessed via _session
    stopped = False
    if _session.current_skill:
        _session.current_skill.stop()
        stopped = True
    if _session.executor:
        _session.executor.stop()
        stopped = True
    # Cancel the asyncio task for immediate stop
    for tid, info in _session.skill_tasks.items():
        task = info.get("_task")
        if task and not task.done():
            task.cancel()
            stopped = True
    if stopped:
        await manager.send_status("已停止执行。")
    return {"stopped": stopped}


@app.get("/api/skills/tasks")
async def api_list_skill_tasks():
    """List all skill execution tasks."""
    return {
        "tasks": [
            {"task_id": tid, "skill": info["skill"], "status": info["status"]}
            for tid, info in _session.skill_tasks.items()
        ]
    }


# Serve frontend at /admin
if FRONTEND_DIST.exists():
    app.mount("/admin", StaticFiles(directory=str(FRONTEND_DIST), html=True), name="frontend")

# Serve landing page at / (must be last)
if LANDING_DIR.exists():
    app.mount("/", StaticFiles(directory=str(LANDING_DIR), html=True), name="landing")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
