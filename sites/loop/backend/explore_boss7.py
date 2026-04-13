"""Find download icon in resume viewer - broader search."""
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
        await asyncio.sleep(3)

    # Get the FULL resume viewer/popup HTML structure
    popup = await page.evaluate(
        "() => {"
        "  var el = document.querySelector('.boss-popup, [class*=resume-popup], [class*=resume-dialog], [class*=geek-resume]');"
        "  if (!el) {"
        "    var all = document.querySelectorAll('[class*=popup]');"
        "    for (var i = 0; i < all.length; i++) {"
        "      if (all[i].offsetWidth > 500) { el = all[i]; break; }"
        "    }"
        "  }"
        "  if (!el) return 'no popup found';"
        "  return { cls: (el.className||'').slice(0,120), childrenHTML: el.innerHTML.slice(0, 500) };"
        "}"
    )
    print("=== Resume popup ===")
    print(json.dumps(popup, ensure_ascii=False, indent=2)[:800])

    # Find ALL icon elements in the popup header
    icons = await page.evaluate(
        "() => {"
        "  var popup = document.querySelector('.boss-popup, [class*=popup]');"
        "  if (!popup) return [];"
        "  var els = popup.querySelectorAll('i, svg, [class*=icon], a, button');"
        "  return Array.from(els).filter(function(el) {"
        "    return el.offsetWidth > 0;"
        "  }).map(function(el) {"
        "    var r = el.getBoundingClientRect();"
        "    return { tag: el.tagName, cls: (el.className||'').toString().slice(0,120),"
        "      title: el.getAttribute('title')||'', text: (el.textContent||'').trim().slice(0,20),"
        "      x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width),"
        "      href: el.getAttribute('href')||'' };"
        "  });"
        "}"
    )
    print("\n=== All icons in popup ===")
    print(json.dumps(icons, ensure_ascii=False, indent=2))

    b64 = await capture_screenshot(page)
    with open("../logs/boss_viewer2.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    await provider.close()


asyncio.run(explore())
