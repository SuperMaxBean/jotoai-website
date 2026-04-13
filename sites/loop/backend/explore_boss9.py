"""Dump EVERY visible element in resume viewer header."""
import asyncio
import json
from browser.provider import PatchrightProvider


async def explore():
    provider = PatchrightProvider()
    page = await provider.launch("default")
    await page.goto("https://www.zhipin.com/web/boss/chat")
    await asyncio.sleep(8)

    # Go to 已获取简历
    tab = page.locator('.chat-label-item[title="已获取简历"]')
    await tab.first.click()
    await asyncio.sleep(3)

    # Click first candidate
    await page.click(".geek-item")
    await asyncio.sleep(2)

    # Open resume viewer
    await page.locator("a.resume-btn-online").first.click()
    await asyncio.sleep(8)  # Wait longer for full load

    # Get popup bounding box first
    popup_box = await page.evaluate(
        "() => {"
        "  var p = document.querySelector('.boss-popup__content, .resume-common-dialog');"
        "  if (!p) return null;"
        "  var r = p.getBoundingClientRect();"
        "  return {x: r.x, y: r.y, w: r.width, h: r.height};"
        "}"
    )
    print(f"Popup box: {popup_box}")

    # Get ALL visible elements in the top 60px of the popup
    top_y = popup_box["y"] if popup_box else 0
    results = await page.evaluate(
        "(topY) => {"
        "  var all = document.querySelectorAll('*');"
        "  var results = [];"
        "  for (var i = 0; i < all.length; i++) {"
        "    var el = all[i];"
        "    var r = el.getBoundingClientRect();"
        "    if (r.width > 0 && r.height > 0 && r.y >= topY - 5 && r.y < topY + 60) {"
        "      results.push({"
        "        tag: el.tagName,"
        "        cls: (el.className||'').toString().slice(0,100),"
        "        text: (el.textContent||'').trim().slice(0,20),"
        "        title: el.getAttribute('title')||'',"
        "        href: el.getAttribute('href')||'',"
        "        x: Math.round(r.x), y: Math.round(r.y),"
        "        w: Math.round(r.width), h: Math.round(r.height),"
        "      });"
        "    }"
        "  }"
        "  return results.sort(function(a,b) { return a.x - b.x; });"
        "}",
        top_y,
    )

    print(f"\n=== ALL visible elements in popup header (top 60px), sorted by x ===")
    for el in results:
        print(f"  x:{el['x']:4d} w:{el['w']:3d} | {el['tag']:5s} cls=\"{el['cls'][:60]}\" text=\"{el['text']}\" title=\"{el['title']}\" href=\"{el['href'][:30]}\"")

    await provider.close()


asyncio.run(explore())
