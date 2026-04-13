"""Find bottom action bar and 求简历 button."""
import asyncio
import json
import base64
from browser.provider import PatchrightProvider
from utils.screenshot import capture_screenshot


async def check():
    provider = PatchrightProvider()
    page = await provider.launch("default")
    await page.goto("https://www.zhipin.com/web/boss/chat")
    await asyncio.sleep(8)
    await page.click(".geek-item")
    await asyncio.sleep(3)

    # All operate items (bottom action bar)
    ops = await page.evaluate(
        "() => {"
        "  var els = document.querySelectorAll('[class*=operate]');"
        "  return Array.from(els).filter(function(el) { return el.offsetWidth > 0; })"
        "    .map(function(el) {"
        "      var r = el.getBoundingClientRect();"
        "      return { cls: (el.className||'').slice(0,80), text: (el.textContent||'').trim().slice(0,40),"
        "               x: Math.round(r.x), y: Math.round(r.y), tag: el.tagName };"
        "    });"
        "}"
    )
    print("=== Operate items ===")
    print(json.dumps(ops, ensure_ascii=False, indent=2))

    # Also search for anything with 简历/求 in bottom half of page
    bottom = await page.evaluate(
        "() => {"
        "  var els = document.querySelectorAll('*');"
        "  var results = [];"
        "  for (var i = 0; i < els.length; i++) {"
        "    var el = els[i];"
        "    var t = (el.textContent || '').trim();"
        "    var r = el.getBoundingClientRect();"
        "    if (r.y > 500 && el.offsetWidth > 0 && t.length < 20 && t.length > 0"
        "        && (t.includes('简历') || t.includes('求') || t.includes('获取'))) {"
        "      results.push({ tag: el.tagName, cls: (el.className||'').slice(0,80),"
        "        text: t, x: Math.round(r.x), y: Math.round(r.y) });"
        "    }"
        "  }"
        "  return results;"
        "}"
    )
    print("\n=== Bottom area 简历/求/获取 elements ===")
    print(json.dumps(bottom, ensure_ascii=False, indent=2))

    b64 = await capture_screenshot(page)
    with open("../logs/boss_ops.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    await provider.close()


asyncio.run(check())
