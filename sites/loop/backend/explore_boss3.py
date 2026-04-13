"""Find 获取简历 button and action buttons on BOSS chat page."""
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

    # Click first candidate
    await page.click(".geek-item")
    await asyncio.sleep(3)

    # Find buttons related to resume request
    btns = await page.evaluate(
        """() => {
        var els = document.querySelectorAll('a, button, span, div');
        var results = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var t = (el.textContent || '').trim();
            var c = (el.className || '').toString();
            var title = el.getAttribute('title') || '';
            var match = t.includes('获取') || t.includes('索要') || t.includes('交换')
                || c.includes('resume') || c.includes('exchange')
                || title.includes('简历') || title.includes('获取');
            if (match && el.offsetWidth > 0 && t.length < 40) {
                var r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName, cls: c.slice(0, 120), text: t,
                    title: title, x: Math.round(r.x), y: Math.round(r.y),
                    w: Math.round(r.width), h: Math.round(r.height),
                });
            }
        }
        return results;
    }"""
    )
    print("=== Resume request buttons ===")
    print(json.dumps(btns, ensure_ascii=False, indent=2))

    # Find action bar / toolbar buttons at bottom of chat
    toolbar = await page.evaluate(
        """() => {
        var els = document.querySelectorAll('[class*=op-btn], [class*=action-btn], [class*=toolbar] button, [class*=chat-op], .btn');
        var results = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.offsetWidth > 0) {
                var r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName, cls: (el.className || '').toString().slice(0, 120),
                    text: (el.textContent || '').trim().slice(0, 60),
                    x: Math.round(r.x), y: Math.round(r.y),
                });
            }
        }
        return results;
    }"""
    )
    print("\n=== Toolbar / action buttons ===")
    print(json.dumps(toolbar, ensure_ascii=False, indent=2))

    # Find all clickable elements in the conversation header area (top right)
    header = await page.evaluate(
        """() => {
        var container = document.querySelector('.chat-conversation, [class*=conversation]');
        if (!container) return [];
        var els = container.querySelectorAll('a, button, [role=button]');
        var results = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            if (el.offsetWidth > 0) {
                var r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName, cls: (el.className || '').toString().slice(0, 120),
                    text: (el.textContent || '').trim().slice(0, 40),
                    title: el.getAttribute('title') || '',
                    href: el.getAttribute('href') || '',
                    x: Math.round(r.x), y: Math.round(r.y),
                });
            }
        }
        return results;
    }"""
    )
    print("\n=== Conversation header buttons ===")
    print(json.dumps(header, ensure_ascii=False, indent=2))

    # Look for "合适" / "不合适" buttons
    fit = await page.evaluate(
        """() => {
        var els = document.querySelectorAll('*');
        var results = [];
        for (var i = 0; i < els.length; i++) {
            var el = els[i];
            var t = (el.textContent || '').trim();
            if ((t === '合适' || t === '不合适' || t === '不合适 ') && el.offsetWidth > 0) {
                var r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName, cls: (el.className || '').toString().slice(0, 120),
                    text: t, x: Math.round(r.x), y: Math.round(r.y),
                });
            }
        }
        return results;
    }"""
    )
    print("\n=== 合适/不合适 buttons ===")
    print(json.dumps(fit, ensure_ascii=False, indent=2))

    b64 = await capture_screenshot(page)
    with open("../logs/boss_btns.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    await provider.close()


asyncio.run(explore())
