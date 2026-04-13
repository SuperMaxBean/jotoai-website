"""Find the download button inside the resume viewer."""
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

    # Click "已获取简历" filter
    tab = page.locator('.chat-label-item[title="已获取简历"]')
    if await tab.count() > 0:
        await tab.first.click()
        await asyncio.sleep(3)
        print("Clicked 已获取简历 tab")

    # Click first candidate
    await page.click(".geek-item")
    await asyncio.sleep(2)

    # Click "在线简历" to open viewer
    btn = page.locator("a.resume-btn-online")
    if await btn.count() > 0:
        await btn.first.click()
        await asyncio.sleep(3)
        print("Opened resume viewer")

    # Screenshot
    b64 = await capture_screenshot(page)
    with open("../logs/boss_resume_viewer.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    # Find toolbar icons in the viewer
    icons = await page.evaluate(
        "() => {"
        "  var els = document.querySelectorAll('a, button, i, svg, span, div');"
        "  var results = [];"
        "  for (var i = 0; i < els.length; i++) {"
        "    var el = els[i];"
        "    var c = (el.className || '').toString();"
        "    var t = el.getAttribute('title') || '';"
        "    var r = el.getBoundingClientRect();"
        "    if (r.y < 80 && r.x > 800 && r.width > 0 && r.width < 60) {"
        "      results.push({"
        "        tag: el.tagName, cls: c.slice(0, 120),"
        "        title: t, text: (el.textContent||'').trim().slice(0, 20),"
        "        x: Math.round(r.x), y: Math.round(r.y),"
        "        w: Math.round(r.width), h: Math.round(r.height),"
        "        href: el.getAttribute('href') || '',"
        "      });"
        "    }"
        "  }"
        "  return results;"
        "}"
    )
    print("\n=== Top-right toolbar icons ===")
    print(json.dumps(icons, ensure_ascii=False, indent=2))

    # Also search for download-related elements
    dl = await page.evaluate(
        "() => {"
        "  var els = document.querySelectorAll('[class*=download], [title*=下载], [class*=icon-download]');"
        "  return Array.from(els).map(function(el) {"
        "    var r = el.getBoundingClientRect();"
        "    return { tag: el.tagName, cls: (el.className||'').toString().slice(0,120),"
        "      title: el.getAttribute('title')||'', text: (el.textContent||'').trim().slice(0,20),"
        "      x: Math.round(r.x), y: Math.round(r.y), visible: r.width > 0 };"
        "  });"
        "}"
    )
    print("\n=== Download elements ===")
    print(json.dumps(dl, ensure_ascii=False, indent=2))

    await provider.close()


asyncio.run(explore())
