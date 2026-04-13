"""Full test: login + compose + send email on 163 mail."""
import asyncio
import base64
from pathlib import Path
from browser.provider import PatchrightProvider
from browser.snapshot import SnapshotEngine
from agent.planner import GLMPlanner
from utils.screenshot import capture_screenshot


async def test():
    provider = PatchrightProvider()
    page = await provider.launch("mail_full_test")
    await page.goto("https://mail.163.com")
    await asyncio.sleep(5)

    planner = GLMPlanner()
    engine = SnapshotEngine()

    task = (
        "请完成以下步骤：\n"
        "1. 先登录163邮箱（用户名: tomi3, 密码: Wohenhao3@）"
        "注意登录框旁边已有@163.com后缀，只输入tomi3\n"
        "2. 登录成功后，点击'写 信'按钮\n"
        "3. 收件人填 xu.tomi3@gmail.com\n"
        "4. 主题填 hello\n"
        "5. 正文填 这是一封测试邮件\n"
        "6. 点击发送\n"
        "注意：每步操作后检查页面是否变化，不要重复已完成的操作。"
    )
    history = []

    for step in range(25):
        snap = await engine.capture(page)
        text = snap.to_text()
        url = page.url

        print(f"\nStep {step+1}: {len(snap.nodes)} nodes | {url[:60]}")
        # Show key elements
        for n in snap.nodes[:25]:
            extra = f' value="{n.value}"' if n.value else ""
            frame = " [iframe]" if n.frame_index >= 0 else ""
            print(f"  [{n.ref}] {n.role} \"{n.name[:35]}\"{extra}{frame}")
        if len(snap.nodes) > 25:
            print(f"  ... ({len(snap.nodes) - 25} more)")

        action = planner.plan_action(task, text, history)
        atype = action.get("action")
        ref = action.get("ref", "")
        action_text = action.get("text", "")[:30]
        think = action.get("thinking", "")[:80]
        print(f"  -> {atype}(ref={ref}) text=\"{action_text}\" think=\"{think}\"")

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
                await asyncio.sleep(min(action.get("seconds", 3), 5))
            history.append({"action": f"{atype}({ref})", "result": "ok"})
        except Exception as e:
            err = str(e)[:120]
            print(f"  ERROR: {err}")
            history.append({"action": f"{atype}({ref})", "result": f"error: {err[:60]}"})

        # Save screenshot every 3 steps
        if step % 3 == 0:
            b64 = await capture_screenshot(page)
            Path("../logs").mkdir(exist_ok=True)
            with open(f"../logs/full_step_{step+1}.jpg", "wb") as f:
                f.write(base64.b64decode(b64))

    # Final screenshot
    b64 = await capture_screenshot(page)
    with open("../logs/full_final.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    print(f"\nFinal URL: {page.url}")
    await provider.close()


asyncio.run(test())
