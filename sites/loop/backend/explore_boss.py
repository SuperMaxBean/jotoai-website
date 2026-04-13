"""Explore BOSS chat page DOM structure."""
import asyncio
import base64
import json
from browser.provider import PatchrightProvider
from utils.screenshot import capture_screenshot


async def explore():
    provider = PatchrightProvider()
    page = await provider.launch("default")

    await page.goto("https://www.zhipin.com/web/boss/chat")
    await asyncio.sleep(8)

    # Click first candidate
    first = await page.query_selector(".geek-item")
    if first:
        await first.click()
        await asyncio.sleep(3)
        print("Clicked first candidate")

    b64 = await capture_screenshot(page)
    with open("../logs/boss_chat_open.jpg", "wb") as f:
        f.write(base64.b64decode(b64))

    # Chat input
    editors = await page.evaluate(
        """() => {
        const els = document.querySelectorAll('[contenteditable], textarea');
        return Array.from(els).map(el => ({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 100),
            ce: el.getAttribute('contenteditable'),
            ph: el.getAttribute('placeholder') || '',
            visible: el.offsetWidth > 0 && el.offsetHeight > 0,
        }));
    }"""
    )
    print("=== Editors ===")
    print(json.dumps(editors, ensure_ascii=False, indent=2))

    # Send button
    btns = await page.evaluate(
        """() => {
        const els = document.querySelectorAll('button');
        return Array.from(els).filter(el => {
            const t = el.textContent || '';
            return t.includes('发送');
        }).map(el => ({
            tag: el.tagName,
            cls: (el.className || '').toString().slice(0, 100),
            text: (el.textContent || '').trim().slice(0, 30),
            disabled: el.disabled,
        }));
    }"""
    )
    print("\n=== Send buttons ===")
    print(json.dumps(btns, ensure_ascii=False, indent=2))

    # Resume elements
    resume = await page.evaluate(
        """() => {
        const els = document.querySelectorAll('*');
        const results = [];
        for (const el of els) {
            const t = ((el.textContent || '') + (el.getAttribute('title') || '')).toLowerCase();
            const c = (el.className || '').toString().toLowerCase();
            if ((t.includes('简历') || c.includes('resume')) && el.children.length < 5) {
                results.push({
                    tag: el.tagName,
                    cls: (el.className || '').toString().slice(0, 100),
                    text: (el.textContent || '').trim().slice(0, 60),
                    title: el.getAttribute('title') || '',
                    visible: el.offsetWidth > 0,
                });
            }
            if (results.length >= 15) break;
        }
        return results;
    }"""
    )
    print("\n=== Resume elements ===")
    print(json.dumps(resume, ensure_ascii=False, indent=2))

    # Right sidebar / candidate info panel
    info = await page.evaluate(
        """() => {
        const panel = document.querySelector('[class*=geek-info], [class*=info-panel], [class*=right-side]');
        if (!panel) return 'No info panel found';
        return {
            cls: panel.className.slice(0, 100),
            html: panel.innerHTML.slice(0, 1000),
        };
    }"""
    )
    print("\n=== Info panel ===")
    print(json.dumps(info, ensure_ascii=False, indent=2)[:1000])

    await provider.close()


asyncio.run(explore())
