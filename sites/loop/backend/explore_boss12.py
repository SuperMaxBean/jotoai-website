"""Click 附件简历 instead of 在线简历, check for download icon."""
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

    # Find candidate with attachment resume enabled
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
                print(f"Candidate: {name}")

                # Click 附件简历 (NOT 在线简历)
                await file_btn.first.click()
                await asyncio.sleep(8)

                # Screenshot
                b64 = await capture_screenshot(page)
                with open("../logs/boss_attachment_viewer.jpg", "wb") as f:
                    f.write(base64.b64decode(b64))

                # Dump popup header elements
                results = await page.evaluate(
                    "() => {"
                    "  var p = document.querySelector('.boss-popup__content, .attachment-resume-top-content');"
                    "  if (!p) p = document.querySelector('[class*=popup]');"
                    "  if (!p) return [];"
                    "  var all = p.querySelectorAll('*');"
                    "  var results = [];"
                    "  for (var i = 0; i < all.length; i++) {"
                    "    var el = all[i];"
                    "    var r = el.getBoundingClientRect();"
                    "    if (r.width > 0 && r.height > 0 && r.height < 40 && r.y < 60) {"
                    "      results.push({ tag: el.tagName, cls: (el.className||'').toString().slice(0,100),"
                    "        text: (el.textContent||'').trim().slice(0,30),"
                    "        title: el.getAttribute('title')||'',"
                    "        href: el.getAttribute('href')||'',"
                    "        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) });"
                    "    }"
                    "  }"
                    "  return results.sort(function(a,b) { return a.x - b.x; });"
                    "}"
                )
                print(f"\n=== Attachment viewer toolbar ===")
                for el in results:
                    print(
                        f"  x:{el['x']:4d} w:{el['w']:3d} | {el['tag']:5s} "
                        f"cls=\"{el['cls'][:50]}\" text=\"{el['text']}\" href=\"{el['href'][:30]}\""
                    )

                # Also check frames
                for fi, frame in enumerate(page.frames):
                    if frame == page.main_frame:
                        continue
                    print(f"\n  Frame {fi}: {frame.url[:60]}")
                    try:
                        icons = await frame.evaluate(
                            "() => {"
                            "  var els = document.querySelectorAll('a, button, [class*=icon], [class*=download], [class*=btn]');"
                            "  return Array.from(els).filter(function(el) { return el.offsetWidth > 0; })"
                            "    .map(function(el) { var r = el.getBoundingClientRect();"
                            "      return { tag: el.tagName, cls: (el.className||'').toString().slice(0,80),"
                            "        text: (el.textContent||'').trim().slice(0,30),"
                            "        title: el.getAttribute('title')||'',"
                            "        x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width) };"
                            "    }).slice(0, 20);"
                            "}"
                        )
                        for icon in icons:
                            print(f"    x:{icon['x']:4d} | {icon['tag']:5s} cls=\"{icon['cls'][:50]}\" text=\"{icon['text']}\" title=\"{icon['title']}\"")
                    except Exception as e:
                        print(f"    Error: {str(e)[:60]}")

                break

    await provider.close()


asyncio.run(explore())
