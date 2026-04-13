"""Test: login to mail.163.com and send email using the full agent loop."""
import asyncio
from browser.provider import PatchrightProvider
from browser.snapshot import SnapshotEngine
from agent.planner import GLMPlanner
from utils.screenshot import capture_screenshot
import base64
from pathlib import Path


async def test():
    provider = PatchrightProvider()
    page = await provider.launch("mail_v2")

    await page.goto("https://mail.163.com")
    await asyncio.sleep(5)

    planner = GLMPlanner()
    engine = SnapshotEngine()

    task = (
        "登录163邮箱（账号: tomi@163.com, 密码: Wohenhao3@），"
        "然后写一封邮件发给 xu.tomi3@gmail.com，标题写 hello，"
        "内容写\"这是一封测试邮件\"，然后点发送。"
    )
    history = []
    last_snapshot_text = ""

    for step in range(30):
        snap = await engine.capture(page)
        text = snap.to_text()

        # Detect if stuck (same snapshot as last time)
        if text == last_snapshot_text and step > 0:
            # Take screenshot for VL analysis
            print(f"\nStep {step+1}: SAME SNAPSHOT — taking screenshot for VL analysis")
            b64 = await capture_screenshot(page)
            analysis = planner.analyze_screenshot(task, b64)
            print(f"  VL analysis: {analysis[:200]}")
            history.append({"action": "screenshot_analysis", "result": analysis[:100]})
            # Save screenshot for debugging
            Path("../logs").mkdir(exist_ok=True)
            with open(f"../logs/step_{step+1}.jpg", "wb") as f:
                f.write(base64.b64decode(b64))
            last_snapshot_text = ""  # Reset to try again
            continue

        last_snapshot_text = text
        print(f"\nStep {step+1}: {len(snap.nodes)} nodes | {page.url[:60]}")
        # Print compact snapshot
        if len(snap.nodes) < 40:
            for n in snap.nodes:
                extra = f' value="{n.value}"' if n.value else ""
                frame = f" [iframe]" if n.frame_index >= 0 else ""
                print(f"  [{n.ref}] {n.role} \"{n.name[:30]}\"{extra}{frame}")

        action = planner.plan_action(task, text, history)
        atype = action.get("action")
        ref = action.get("ref", "")
        print(f"  -> {atype}(ref={ref}) text=\"{action.get('text','')[:30]}\"")
        print(f"     think: {action.get('thinking','')[:80]}")

        if atype == "done":
            print(f"  DONE: {action.get('summary')}")
            break

        try:
            if atype == "click":
                loc = await engine.resolve(page, snap, ref)
                await loc.click(timeout=5000)
                await asyncio.sleep(3)
            elif atype == "type":
                loc = await engine.resolve(page, snap, ref)
                # Use fill for reliable input (works with iframes)
                await loc.fill(action.get("text", ""), timeout=5000)
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

            result = "ok"
            history.append({"action": f"{atype}({ref})", "result": result})

        except Exception as e:
            err = str(e)[:150]
            print(f"  ERROR: {err}")
            history.append({"action": f"{atype}({ref})", "result": f"error: {err[:80]}"})

    print(f"\nFinal URL: {page.url}")
    await provider.close()


asyncio.run(test())
