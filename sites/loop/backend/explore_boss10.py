"""Find download icon for a candidate who HAS sent their resume."""
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

    # Click "已获取简历" tab - these candidates have shared their resume
    tab = page.locator('.chat-label-item[title="已获取简历"]')
    await tab.first.click()
    await asyncio.sleep(3)

    # Try multiple candidates to find one with 附件简历 enabled
    candidates = await page.query_selector_all(".geek-item")
    print(f"已获取简历 candidates: {len(candidates)}")

    for i in range(min(5, len(candidates))):
        candidates = await page.query_selector_all(".geek-item")
        c = candidates[i]
        name_el = await c.query_selector(".geek-name")
        name = (await name_el.text_content()).strip() if name_el else "?"

        await c.click()
        await asyncio.sleep(2)

        # Check if 附件简历 button is NOT disabled
        file_btn = page.locator(".resume-btn-file")
        is_disabled = True
        if await file_btn.count() > 0:
            is_disabled = await file_btn.first.evaluate(
                "el => el.classList.contains('disabled')"
            )

        print(f"\n[{i+1}] {name} - 附件简历 disabled: {is_disabled}")

        if not is_disabled:
            # This candidate has attachment resume! Open viewer
            await page.locator("a.resume-btn-online").first.click()
            await asyncio.sleep(5)

            # Screenshot
            b64 = await capture_screenshot(page)
            with open("../logs/boss_dl_candidate.jpg", "wb") as f:
                f.write(base64.b64decode(b64))

            # Get popup bounding box
            popup_box = await page.evaluate(
                "() => {"
                "  var p = document.querySelector('.boss-popup__content');"
                "  if (!p) return null;"
                "  var r = p.getBoundingClientRect();"
                "  return {x: r.x, y: r.y, w: r.width, h: r.height};"
                "}"
            )
            print(f"Popup: {popup_box}")

            # Dump ALL elements in popup header
            top_y = popup_box["y"] if popup_box else 0
            results = await page.evaluate(
                "(topY) => {"
                "  var p = document.querySelector('.attachment-resume-top-content, .boss-popup__content');"
                "  if (!p) return [];"
                "  var all = p.querySelectorAll('*');"
                "  var results = [];"
                "  for (var i = 0; i < all.length; i++) {"
                "    var el = all[i];"
                "    var r = el.getBoundingClientRect();"
                "    if (r.width > 0 && r.height > 0 && r.height < 50) {"
                "      results.push({"
                "        tag: el.tagName,"
                "        cls: (el.className||'').toString().slice(0,120),"
                "        text: (el.textContent||'').trim().slice(0,30),"
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
            print(f"\n=== Toolbar elements for {name} ===")
            for el in results:
                print(
                    f"  x:{el['x']:4d} w:{el['w']:3d} | {el['tag']:5s} "
                    f"cls=\"{el['cls'][:50]}\" text=\"{el['text']}\" "
                    f"title=\"{el['title']}\" href=\"{el['href'][:30]}\""
                )

            # Close viewer
            close = page.locator(".boss-popup__close")
            if await close.count() > 0:
                await close.first.click()
                await asyncio.sleep(1)
            break

    await provider.close()


asyncio.run(explore())
