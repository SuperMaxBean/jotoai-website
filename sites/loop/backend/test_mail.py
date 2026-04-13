"""Test: login to mail.163.com and send an email."""
import asyncio
from browser.provider import PatchrightProvider
from browser.snapshot import SnapshotEngine
from agent.planner import GLMPlanner


async def test():
    provider = PatchrightProvider()
    page = await provider.launch("mail_test")

    await page.goto("https://mail.163.com")
    await asyncio.sleep(3)

    planner = GLMPlanner()
    engine = SnapshotEngine()

    task = (
        "登录163邮箱（账号: tomi@163.com, 密码: Wohenhao3@），"
        "然后写一封邮件发给 xu.tomi3@gmail.com，标题写 hello，"
        "内容随便写一句话，然后点发送。"
    )
    history = []

    for step in range(25):
        snap = await engine.capture(page)
        text = snap.to_text()
        print(f"\nStep {step+1}: {len(snap.nodes)} nodes | {page.url[:60]}")
        if len(snap.nodes) < 30:
            print(text[:600])
        else:
            first3 = ", ".join(
                f'{n.role} "{n.name[:20]}"' for n in snap.nodes[:3]
            )
            print(f"  (nodes: {len(snap.nodes)}, first 3: {first3})")

        action = planner.plan_action(task, text, history)
        atype = action.get("action")
        ref = action.get("ref", "")
        print(
            f"  -> {atype}(ref={ref}) "
            f'text="{action.get("text","")[:30]}" '
            f'think="{action.get("thinking","")[:60]}"'
        )

        if atype == "done":
            print(f"  DONE: {action.get('summary')}")
            break

        try:
            if atype == "click":
                loc = await engine.resolve(page, snap, ref)
                await loc.click(timeout=5000)
                await asyncio.sleep(2)
            elif atype == "type":
                loc = await engine.resolve(page, snap, ref)
                try:
                    await loc.click(timeout=2000)
                except Exception:
                    pass
                try:
                    await loc.fill("", timeout=2000)
                except Exception:
                    pass
                await loc.type(action.get("text", ""), delay=80)
                await asyncio.sleep(1)
            elif atype == "press":
                loc = await engine.resolve(page, snap, ref)
                await loc.press(action.get("key", "Enter"))
                await asyncio.sleep(2)
            elif atype == "scroll":
                await page.mouse.wheel(0, 300)
                await asyncio.sleep(1)
            elif atype == "wait":
                await asyncio.sleep(min(action.get("seconds", 2), 5))
            history.append({"action": f"{atype}({ref})", "result": "ok"})
        except Exception as e:
            err = str(e)[:100]
            print(f"  ERROR: {err}")
            history.append(
                {"action": f"{atype}({ref})", "result": f"error: {err}"}
            )

    print(f"\nFinal URL: {page.url}")
    await provider.close()


asyncio.run(test())
