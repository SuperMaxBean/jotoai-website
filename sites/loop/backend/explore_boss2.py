"""Explore BOSS chat DOM - resume button, send button, filter tabs."""
import asyncio
import json
from browser.provider import PatchrightProvider


async def explore():
    provider = PatchrightProvider()
    page = await provider.launch("default")
    await page.goto("https://www.zhipin.com/web/boss/chat")
    await asyncio.sleep(8)

    # Click first candidate
    await page.click(".geek-item")
    await asyncio.sleep(3)

    # Resume button
    resume_btn = await page.evaluate(
        """() => {
        const els = document.querySelectorAll('a, button, span, div');
        const results = [];
        for (let i = 0; i < els.length; i++) {
            const el = els[i];
            const t = (el.textContent || '').trim();
            if (t === '在线简历' || t === '获取简历' || t === '查看简历' || t === '下载简历') {
                const r = el.getBoundingClientRect();
                results.push({
                    tag: el.tagName,
                    cls: (el.className || '').toString().slice(0, 120),
                    text: t.slice(0, 30),
                    href: el.getAttribute('href') || '',
                    visible: r.width > 0,
                    x: Math.round(r.x), y: Math.round(r.y),
                });
            }
        }
        return results;
    }"""
    )
    print("=== Resume buttons ===")
    print(json.dumps(resume_btn, ensure_ascii=False, indent=2))

    # Send-related elements
    send_els = await page.evaluate(
        """() => {
        const els = document.querySelectorAll('*');
        const results = [];
        for (let i = 0; i < els.length; i++) {
            const el = els[i];
            const c = (el.className || '').toString();
            const t = (el.textContent || '').trim();
            if ((c.includes('send') || t === '发送') && el.offsetWidth > 0) {
                results.push({
                    tag: el.tagName,
                    cls: c.slice(0, 120),
                    text: t.slice(0, 30),
                });
            }
        }
        return results;
    }"""
    )
    print("\n=== Send elements ===")
    print(json.dumps(send_els, ensure_ascii=False, indent=2))

    # Filter tabs
    tabs = await page.evaluate(
        """() => {
        const items = document.querySelectorAll('.chat-label-item');
        return Array.from(items).map(function(el) {
            return {
                cls: (el.className || '').toString().slice(0, 100),
                text: (el.textContent || '').trim().slice(0, 30),
                title: el.getAttribute('title') || '',
            };
        });
    }"""
    )
    print("\n=== Filter tabs ===")
    print(json.dumps(tabs, ensure_ascii=False, indent=2))

    # Candidate badge details
    badges = await page.evaluate(
        """() => {
        var items = document.querySelectorAll('.geek-item');
        var result = [];
        for (var i = 0; i < Math.min(items.length, 5); i++) {
            var el = items[i];
            var badge = el.querySelector('.badge-count');
            var name = el.querySelector('.geek-name');
            result.push({
                name: name ? name.textContent.trim() : '',
                hasBadge: !!badge,
                badgeText: badge ? badge.textContent.trim() : '',
                dataId: el.getAttribute('data-id') || el.id || '',
            });
        }
        return result;
    }"""
    )
    print("\n=== Candidate badges ===")
    print(json.dumps(badges, ensure_ascii=False, indent=2))

    await provider.close()


asyncio.run(explore())
