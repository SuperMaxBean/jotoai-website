"""Check inside the resume viewer iframe for download button."""
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

    tab = page.locator('.chat-label-item[title="已获取简历"]')
    await tab.first.click()
    await asyncio.sleep(3)

    # Find candidate with attachment resume
    candidates = await page.query_selector_all(".geek-item")
    for i in range(min(5, len(candidates))):
        candidates = await page.query_selector_all(".geek-item")
        c = candidates[i]
        await c.click()
        await asyncio.sleep(2)
        file_btn = page.locator(".resume-btn-file")
        if await file_btn.count() > 0:
            disabled = await file_btn.first.evaluate("el => el.classList.contains('disabled')")
            if not disabled:
                name_el = await c.query_selector(".geek-name")
                name = (await name_el.text_content()).strip() if name_el else "?"
                print(f"Found candidate with attachment: {name}")

                # Open viewer
                await page.locator("a.resume-btn-online").first.click()
                await asyncio.sleep(8)

                # Check ALL frames
                frames = page.frames
                print(f"\nTotal frames: {len(frames)}")
                for fi, frame in enumerate(frames):
                    url = frame.url[:80]
                    if frame == page.main_frame:
                        continue
                    print(f"\n--- Frame {fi}: {url} ---")

                    try:
                        # Look for icons/buttons in this frame
                        icons = await frame.evaluate(
                            "() => {"
                            "  var all = document.querySelectorAll('a, button, i, svg, [class*=icon], [class*=download], [class*=btn]');"
                            "  return Array.from(all).filter(function(el) { return el.offsetWidth > 0; })"
                            "    .map(function(el) {"
                            "      var r = el.getBoundingClientRect();"
                            "      return { tag: el.tagName, cls: (el.className||'').toString().slice(0,100),"
                            "        text: (el.textContent||'').trim().slice(0,30),"
                            "        title: el.getAttribute('title')||'',"
                            "        href: el.getAttribute('href')||'',"
                            "        x: Math.round(r.x), y: Math.round(r.y),"
                            "        w: Math.round(r.width) };"
                            "    }).slice(0, 30);"
                            "}"
                        )
                        if icons:
                            for icon in icons:
                                print(f"  x:{icon['x']:4d} | {icon['tag']:5s} cls=\"{icon['cls'][:50]}\" text=\"{icon['text']}\" title=\"{icon['title']}\" href=\"{icon['href'][:40]}\"")
                    except Exception as e:
                        print(f"  Cannot access: {str(e)[:60]}")

                b64 = await capture_screenshot(page)
                with open("../logs/boss_iframe_dl.jpg", "wb") as f:
                    f.write(base64.b64decode(b64))

                break

    await provider.close()


asyncio.run(explore())
