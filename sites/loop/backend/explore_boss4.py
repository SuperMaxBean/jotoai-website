"""Check resume button for multiple candidates."""
import asyncio
import json
import base64
from browser.provider import PatchrightProvider
from utils.screenshot import capture_screenshot


async def explore():
    provider = PatchrightProvider()
    page = await provider.launch("default")
    await page.goto("https://www.zhipin.com/web/boss/chat")
    await asyncio.sleep(8)

    # Click "新招呼" filter
    new_tab = page.locator(".chat-label-item", has_text="新招呼")
    if await new_tab.count() > 0:
        await new_tab.first.click()
        await asyncio.sleep(3)

    candidates = await page.query_selector_all(".geek-item")
    print(f"Total: {len(candidates)}")

    for i in range(min(4, len(candidates))):
        candidates = await page.query_selector_all(".geek-item")
        if i >= len(candidates):
            break
        c = candidates[i]
        name_el = await c.query_selector(".geek-name")
        name = (await name_el.text_content()).strip() if name_el else "?"

        await c.click()
        await asyncio.sleep(2)

        # Get resume button area HTML
        html = await page.evaluate(
            "() => {"
            "  var el = document.querySelector('.resume-btn-content');"
            "  if (!el) return 'no .resume-btn-content';"
            "  return el.outerHTML.slice(0, 400);"
            "}"
        )
        print(f"\n[{i+1}] {name}: {html}")

        # Screenshot each candidate
        b64 = await capture_screenshot(page)
        with open(f"../logs/boss_c{i+1}.jpg", "wb") as f:
            f.write(base64.b64decode(b64))

    await provider.close()


asyncio.run(explore())
