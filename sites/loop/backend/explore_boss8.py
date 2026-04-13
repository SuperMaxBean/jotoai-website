"""Find download icon - search ALL elements in toolbar area."""
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
    if await tab.count() > 0:
        await tab.first.click()
        await asyncio.sleep(3)

    await page.click(".geek-item")
    await asyncio.sleep(2)

    btn = page.locator("a.resume-btn-online")
    if await btn.count() > 0:
        await btn.first.click()
        await asyncio.sleep(5)

    # Find EVERY element in the x:850-1000 y:0-50 area (toolbar)
    all_els = await page.evaluate(
        "() => {"
        "  var all = document.querySelectorAll('*');"
        "  var results = [];"
        "  for (var i = 0; i < all.length; i++) {"
        "    var el = all[i];"
        "    var r = el.getBoundingClientRect();"
        "    if (r.x >= 850 && r.x <= 1000 && r.y >= 0 && r.y <= 50 && r.width > 0 && r.width < 50) {"
        "      results.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,120),"
        "        title: el.getAttribute('title')||'', text: (el.textContent||'').trim().slice(0,20),"
        "        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height),"
        "        href: el.getAttribute('href')||'', 'data-clipboard': el.getAttribute('data-clipboard-text')||'' });"
        "    }"
        "  }"
        "  return results;"
        "}"
    )
    print("=== ALL elements in toolbar area (x:850-1000, y:0-50) ===")
    print(json.dumps(all_els, ensure_ascii=False, indent=2))

    # Also check the attachment-resume-top area specifically
    top = await page.evaluate(
        "() => {"
        "  var el = document.querySelector('[class*=attachment-resume-top], [class*=resume-top]');"
        "  if (!el) return 'not found';"
        "  return { cls: el.className.slice(0,120), html: el.innerHTML.slice(0, 800) };"
        "}"
    )
    print("\n=== Resume top area ===")
    print(json.dumps(top, ensure_ascii=False, indent=2)[:1000])

    # Check iframes in the popup
    frames = page.frames
    print(f"\n=== Frames: {len(frames)} ===")
    for f in frames:
        if f != page.main_frame:
            print(f"  iframe: {f.url[:80]}")

    b64 = await capture_screenshot(page)
    with open("../logs/boss_viewer3.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    await provider.close()


asyncio.run(explore())
