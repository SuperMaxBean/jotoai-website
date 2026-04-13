"""Taobao 评论抓取 Skill.

搜索商品 → 打开前N个商品 → 抓取评论（名字、时间、内容）→ 导出CSV
"""

from __future__ import annotations

import asyncio
import csv
import io
import random
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

from playwright.async_api import Page

import config
from api.websocket import ConnectionManager
from services.skill_registry import register_skill
from browser.humanize import (
    wait_page_load, wait_before_action, wait_after_click,
    wait_between_items, human_click, human_scroll,
)
# captcha_solver imports removed — captcha is now manual-only

TAOBAO_URL = "https://www.taobao.com"
CSV_DIR = config.DATA_DIR / "taobao_reviews"


@register_skill
class TaobaoReviewSkill:
    """抓取淘宝商品评论。

    流程: 打开淘宝 → 搜索关键词 → 打开前N个商品 → 抓取评论 → 导出CSV
    """

    NAME = "taobao_review"
    PLATFORM = "淘宝"
    DESCRIPTION = "淘宝商品评论抓取：搜索商品→抓取评论→导出CSV→写入飞书表格"
    PARAMS_SCHEMA = {
        "keyword": {"type": "str", "description": "搜索关键词", "required": True},
        "top_n": {"type": "int", "description": "打开前几个商品，默认3", "required": False},
        "sort_by": {"type": "str", "description": "评论排序：default(默认) 或 time(时间)", "required": False},
        "max_reviews": {"type": "int", "description": "每个商品最多抓取评论数，默认50", "required": False},
        "feishu_url": {"type": "str", "description": "飞书多维表格URL（可选，填写后自动写入飞书）", "required": False},
        "product_url": {"type": "str", "description": "直接商品URL（可选，填写后跳过搜索直接抓取该商品）", "required": False},
    }

    def __init__(self, page: Page, ws: ConnectionManager) -> None:
        self._page = page
        self._ws = ws
        self._running = True
        self._paused = asyncio.Event()
        self._paused.set()  # Not paused initially

    def stop(self) -> None:
        self._running = False
        self._paused.set()  # Unblock if paused

    def pause(self) -> None:
        self._paused.clear()

    def resume(self) -> None:
        self._paused.set()

    async def _sleep(self, seconds: float) -> None:
        """Interruptible sleep — checks _running every second."""
        elapsed = 0.0
        while elapsed < seconds and self._running:
            chunk = min(1.0, seconds - elapsed)
            await asyncio.sleep(chunk)
            elapsed += chunk

    async def _wait_if_paused(self) -> None:
        """Block until resumed if currently paused. Auto-resumes after 3 minutes."""
        if not self._paused.is_set():
            await self._ws.send_status("Skill 已暂停，等待释放控制权...")
            for _ in range(36):  # 36 * 5s = 3 minutes max
                try:
                    await asyncio.wait_for(self._paused.wait(), timeout=5)
                    return  # Resumed
                except asyncio.TimeoutError:
                    if not self._running:
                        return
            # Auto-resume after timeout
            await self._ws.send_status("等待超时，自动恢复执行...")
            self._paused.set()

    async def _try_solve_captcha(self) -> bool:
        """Detect captcha and wait for user to solve manually."""
        if not await self._has_captcha_overlay():
            return False

        await self._ws.send_status("检测到验证码，请点击「人工接管」用远程桌面手动过验证码")
        await self._ws.send_login_required("检测到验证码，请人工接管完成验证后释放控制。")

        # Wait for user to solve — poll for captcha overlay removal
        for _ in range(300):  # Wait up to 5 minutes
            await self._sleep(1)
            if not self._running:
                return False
            try:
                if not await self._has_captcha_overlay():
                    await self._ws.send_status("验证码已通过！继续执行...")
                    return True
            except Exception:
                pass
        await self._ws.send_status("等待验证码超时")
        return False

    async def _has_captcha_overlay(self) -> bool:
        """Check if a captcha overlay/modal is visible on the page."""
        return await self._page.evaluate("""() => {
            const body = document.body?.innerText || '';
            // Check body text for captcha keywords
            if (body.includes('拖动') || body.includes('滑块')) return true;
            // Check for common captcha overlay elements (NoCaptcha, etc.)
            const selectors = [
                '#nc_1_wrapper', '#nc_1__scale_text', '.nc-container',
                '#nocaptcha', '[class*="captcha"]', '[class*="Captcha"]',
                '#baxia-dialog', '.baxia-dialog', '[class*="baxia"]',
                '#alicaptcha', '.alicaptcha-container',
                'iframe[src*="captcha"]', 'iframe[src*="nocaptcha"]',
            ];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.offsetWidth > 0 && el.offsetHeight > 0) return true;
            }
            // Check for any full-screen overlay that might be a captcha
            const overlays = document.querySelectorAll('[class*="mask"], [class*="modal"], [class*="overlay"]');
            for (const ol of overlays) {
                if (ol.offsetWidth > 300 && ol.offsetHeight > 200) {
                    const olText = ol.innerText || '';
                    if (olText.includes('验证') || olText.includes('安全') || olText.includes('拖动')) {
                        return true;
                    }
                }
            }
            return false;
        }""")

    async def run(
        self,
        keyword: str = "",
        top_n: int = 3,
        sort_by: str = "default",
        max_reviews: int = 50,
        feishu_url: str = "",
        product_url: str = "",
    ) -> None:
        if not keyword and not product_url:
            await self._ws.send_error("请输入搜索关键词或商品URL")
            return

        self._running = True
        CSV_DIR.mkdir(parents=True, exist_ok=True)
        all_reviews: list[dict] = []
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")

        try:
            # Direct URL mode: skip search, go straight to product
            if product_url:
                is_tmall = "tmall.com" in product_url
                await self._ws.send_status(f"直接打开{'天猫' if is_tmall else '淘宝'}商品...")
                product_links = [{"url": product_url, "title": "直接链接商品"}]
            else:
                # Step 1-3: Search and get product links (with login retry)
                product_links = None
                for _attempt in range(2):  # At most 1 retry after login
                    await self._ws.send_status("正在打开淘宝...")
                    await self._page.goto(TAOBAO_URL, wait_until="domcontentloaded", timeout=15000)
                    await wait_page_load(ws=self._ws)

                    await self._wait_if_paused()
                    await self._ws.send_status(f"搜索: {keyword}")
                    import urllib.parse
                    search_url = f"https://s.taobao.com/search?q={urllib.parse.quote(keyword)}"
                    await self._page.goto(search_url, wait_until="domcontentloaded", timeout=20000)
                    await wait_page_load(ws=self._ws)

                    # Auto-solve captcha if present
                    await self._try_solve_captcha()

                    await self._ws.send_status("获取商品列表...")
                    await self._page.evaluate("window.scrollTo(0, 0)")
                    await self._sleep(1)
                    product_links = await self._page.evaluate(f"""() => {{
                        const allLinks = document.querySelectorAll(
                            'a[href*="item.taobao.com"], a[href*="detail.tmall.com"], a[href*="item.htm"]'
                        );
                        const cards = [];
                        const seen = new Set();
                        for (const a of allLinks) {{
                            const href = a.href;
                            if (!href || seen.has(href)) continue;
                            if (!href.includes('item.taobao.com') && !href.includes('detail.tmall.com') && !href.includes('item.htm')) continue;
                            const rect = a.getBoundingClientRect();
                            if (rect.width < 50 || rect.height < 50) continue;
                            seen.add(href);
                            const title = (a.textContent || '').trim().slice(0, 60);
                            cards.push({{url: href, title: title}});
                        }}
                        return cards.slice(0, {top_n}).map(c => ({{url: c.url, title: c.title}}));
                    }}""")

                    if product_links:
                        break  # Got results, continue

                    # Reactive: no results, check if login is needed
                    if await self._check_login_on_failure():
                        await self._ws.send_status("登录后重新搜索...")
                        continue  # Retry after login
                    break  # Not a login issue, just no results

                if not product_links:
                    await self._ws.send_error("未找到商品链接，页面结构可能已变化")
                    return

                await self._ws.send_status(f"找到 {len(product_links)} 个商品")

            # Step 4: Open each product and scrape reviews
            for pi, product in enumerate(product_links):
                if not self._running:
                    break

                url = product["url"]
                title = product.get("title", "")[:30]
                await self._ws.send_status(f"[{pi+1}/{len(product_links)}] 打开: {title}")

                try:
                    await self._wait_if_paused()
                    t = await wait_before_action(ws=self._ws, stop_check=lambda: not self._running)
                    await self._ws.send_status(f"[{pi+1}] 等待 {t:.0f} 秒后打开...")
                    await self._page.goto(url, wait_until="domcontentloaded", timeout=20000)
                    await wait_page_load(ws=self._ws, stop_check=lambda: not self._running)

                    # Extract real product title from page
                    page_title = await self._page.evaluate("""() => {
                        const el = document.querySelector('h1, [class*="title"], [class*="Title"], title');
                        const t = (el?.textContent || document.title || '').trim();
                        return t.replace(/[-–—|].*$/, '').trim().slice(0, 40);
                    }""")
                    if page_title and page_title != "about:blank":
                        title = page_title

                    # Auto-solve captcha if present
                    await self._try_solve_captcha()

                    # Scroll to reviews section
                    await self._ws.send_status(f"[{pi+1}] 查找评论区...")
                    reviews = await self._scrape_reviews(
                        product_title=title,
                        sort_by=sort_by,
                        max_reviews=max_reviews,
                    )
                    all_reviews.extend(reviews)
                    await self._ws.send_status(f"[{pi+1}] {title}: 抓取 {len(reviews)} 条评论")

                except Exception as e:
                    await self._ws.send_error(f"[{pi+1}] {title}: {str(e)[:60]}")

                # Wait between products
                if pi < len(product_links) - 1:
                    wait = await wait_between_items()
                    await self._ws.send_status(f"商品间等待 {wait:.0f} 秒...")
                    await self._sleep(wait)

            # Step 5: Export CSV
            if all_reviews:
                import urllib.parse as _urlparse
                safe_keyword = _urlparse.quote(keyword, safe="")
                csv_filename = f"taobao_{safe_keyword}_{timestamp}.csv"
                csv_path = CSV_DIR / csv_filename
                self._write_csv(csv_path, all_reviews)
                await self._ws.send_file(csv_filename, f"/api/taobao/csv/{csv_filename}")
                await self._ws.send_status(f"CSV 已导出: {csv_filename} ({len(all_reviews)} 条评论)")

            # Step 6: Write to Feishu Bitable (if configured)
            if all_reviews and feishu_url:
                try:
                    from services.feishu import FeishuBitable
                    fb = FeishuBitable()
                    await self._ws.send_status("正在写入飞书表格...")
                    count = await fb.write_reviews(feishu_url, all_reviews)
                    await self._ws.send_status(f"飞书表格已写入 {count} 条评论")
                except Exception as e:
                    await self._ws.send_error(f"飞书写入失败: {e}")

        except Exception as e:
            await self._ws.send_error(f"Skill 错误: {str(e)[:200]}")
        finally:
            # Clean up extra tabs opened during scraping (e.g. "查看全部评价")
            # Keep only the first page in the context, close the rest.
            try:
                context = self._page.context
                pages = context.pages
                if len(pages) > 1:
                    first_page = pages[0]
                    for p in pages[1:]:
                        try:
                            await p.close()
                        except Exception:
                            pass
                    self._page = first_page
            except Exception:
                pass

        await self._ws.send_complete(
            f"完成！搜索「{keyword}」，抓取 {len(all_reviews)} 条评论"
        )
        self._running = False

    async def _check_login_on_failure(self) -> bool:
        """Reactively check for login page when an operation fails.

        Uses VL model to judge — no hardcoded URL or selector patterns.
        Returns True if login was detected and user completed it.
        """
        from browser.resilient_ops import check_needs_login, wait_for_login
        if await check_needs_login(self._page):
            return await wait_for_login(self._page, self._ws)
        return False

    async def _scroll_reviews(self) -> None:
        """Scroll the review container to trigger lazy loading."""
        scroll_info = await self._page.evaluate("""() => {
            // Find the last review item and scroll it into view
            const items = document.querySelectorAll(
                '[class*="Comment--"], [class*="comment-item"], [class*="rate-item"]'
            );
            if (items.length === 0) {
                window.scrollBy({ top: 800, behavior: 'smooth' });
                return 'no items, page scroll';
            }

            const lastItem = items[items.length - 1];
            // Scroll the last item into view to trigger lazy loading
            lastItem.scrollIntoView({ behavior: 'smooth', block: 'end' });

            // Also try scrolling all ancestors that are scrollable
            let el = lastItem.parentElement;
            let scrolled = false;
            while (el && el !== document.body && el !== document.documentElement) {
                if (el.scrollHeight > el.clientHeight + 10) {
                    el.scrollTop = el.scrollHeight;
                    scrolled = true;
                }
                el = el.parentElement;
            }
            return true;
        }""")

    async def _try_next_page(self) -> bool:
        """Try to click next page button in review pagination. Returns True if clicked."""
        try:
            # Try multiple selector strategies for the next page button
            clicked = await self._page.evaluate("""() => {
                // Common next page selectors for Taobao reviews
                const selectors = [
                    'button:not([disabled])[class*="next"]',
                    'a[class*="next"]:not([class*="content"])',
                    '[class*="pg-next"]',
                    '[class*="Next"]',
                    'button[class*="Next"]',
                ];
                for (const sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.offsetWidth > 0 && el.offsetHeight > 0) {
                        el.click();
                        return sel;
                    }
                }
                // Also try text-based search
                const allBtns = document.querySelectorAll('button, a, span');
                for (const btn of allBtns) {
                    const text = (btn.textContent || '').trim();
                    if ((text === '下一页' || text === '>' || text === '»') && btn.offsetWidth > 0) {
                        btn.click();
                        return 'text:' + text;
                    }
                }
                return null;
            }""")
            if clicked:
                await self._ws.send_status(f"翻页: {clicked}")
                await self._sleep(random.uniform(3, 5))
                return True
        except Exception:
            pass
        return False

    async def _scrape_reviews(
        self, product_title: str, sort_by: str, max_reviews: int,
    ) -> list[dict]:
        """Navigate to reviews tab and scrape."""
        reviews: list[dict] = []

        # Step A: Click "用户评价" tab to scroll to review section
        await self._ws.send_status("滚动到评论区...")
        for scroll_attempt in range(6):
            await human_scroll(self._page, "down", amount=random.randint(3, 5))
            await self._sleep(random.uniform(1, 2))

            # Look for "用户评价" tab (exact match, not the whole nav bar)
            tab_clicked = await self._page.evaluate("""() => {
                const allEls = document.querySelectorAll('a, span, div, li');
                for (const el of allEls) {
                    const text = el.textContent?.trim() || '';
                    // Must be exact or very close (e.g. "用户评价" or "用户评价(600+)")
                    if (text.startsWith('用户评价') && text.length < 15 && el.offsetWidth > 20) {
                        el.scrollIntoView({behavior: 'smooth', block: 'center'});
                        el.click();
                        return true;
                    }
                }
                return false;
            }""")
            if tab_clicked:
                await self._ws.send_status("已点击「用户评价」Tab")
                await self._sleep(random.uniform(2, 4))
                break

        # Step B: Find and click "查看全部评价" button — check BEFORE scrolling
        clicked_full = False
        for attempt in range(8):
            # Check first, scroll after
            btn = self._page.locator('text="查看全部评价"').first
            try:
                if await btn.is_visible(timeout=1000):
                    await self._ws.send_status("找到「查看全部评价」按钮，点击进入...")
                    await self._sleep(random.uniform(0.5, 1))
                    try:
                        async with self._page.context.expect_page(timeout=3000) as new_page_info:
                            await human_click(btn)
                        new_page = await new_page_info.value
                        await self._ws.send_status("评论页已打开（新Tab），等待加载...")
                        await new_page.wait_for_load_state("domcontentloaded", timeout=10000)
                        self._page = new_page
                    except Exception:
                        # Didn't open new tab — overlay/in-place expansion
                        await self._ws.send_status("评论区已展开，等待加载...")
                        await self._sleep(3)
                    clicked_full = True
                    # Wait for overlay content to load
                    await self._sleep(2)
                    break
            except Exception:
                pass

            # Not found yet, scroll down a bit
            await human_scroll(self._page, "down", amount=random.randint(2, 3))
            await self._sleep(random.uniform(1, 2))

        if not clicked_full:
            await self._ws.send_status("未找到「查看全部评价」按钮，从当前页面抓取...")

        # Sort by time if requested
        if sort_by == "time":
            try:
                time_sort = self._page.locator(
                    '[class*="sort"]:has-text("最新"), '
                    '[class*="sort"]:has-text("时间"), '
                    'a:has-text("最新"), a:has-text("按时间"), '
                    'li:has-text("最新"), span:has-text("最新")'
                )
                if await time_sort.count() > 0:
                    await human_click(time_sort.first)
                    await wait_after_click()
            except Exception:
                pass

        # Scrape reviews — continuous scroll + lazy load
        seen_keys: set[str] = set()
        no_new_count = 0
        last_reported = 0

        for scroll_round in range(100):  # Safety cap
            if not self._running or len(reviews) >= max_reviews:
                break

            # Scroll down to trigger lazy loading
            await self._scroll_reviews()
            await self._sleep(random.uniform(1.5, 3))

            # Scrape all currently visible reviews (supports Taobao + Tmall)
            new_reviews = await self._page.evaluate("""() => {
                const results = [];
                const url = window.location.href;
                const isTmall = url.includes('tmall.com');

                // Try multiple selector strategies for Taobao and Tmall
                const itemSelectors = [
                    '[class*="Comment--"]',
                    '[class*="comment-item"]', '[class*="commentItem"]',
                    '[class*="rate-item"]', '[class*="rateItem"]',
                    '[class*="review-item"]', '[class*="reviewItem"]',
                    '.rate-grid tr',
                    '.tb-rate-content .rate-item',
                    '.J_KaiRate .rate-item',
                ];
                let items = [];
                for (const sel of itemSelectors) {
                    const found = document.querySelectorAll(sel);
                    if (found.length > items.length) items = Array.from(found);
                }

                // Fallback: if no items found, try to find review blocks by structure
                // (elements containing a date pattern like 2026年 or 202X-)
                if (items.length === 0) {
                    const allDivs = document.querySelectorAll('div');
                    for (const div of allDivs) {
                        const text = div.textContent || '';
                        const hasDate = /20\d{2}[年\-\/]/.test(text);
                        const hasContent = text.length > 20 && text.length < 2000;
                        const isSmall = div.offsetHeight > 50 && div.offsetHeight < 500;
                        if (hasDate && hasContent && isSmall && div.children.length >= 2) {
                            items.push(div);
                        }
                    }
                    // Deduplicate: remove parent elements that contain child elements also in the list
                    if (items.length > 0) {
                        items = items.filter(item =>
                            !items.some(other => other !== item && item.contains(other))
                        );
                    }
                }

                for (const item of items) {
                    if (item.offsetHeight < 30) continue;

                    // Try multiple name selectors
                    const nameEl = item.querySelector(
                        '[class*="userName"], [class*="user-name"], [class*="nick"], ' +
                        '[class*="Name"], [class*="name"]:not([class*="filename"]), ' +
                        '.rate-user-name, .tb-rate-nick'
                    );
                    // Try multiple date selectors
                    const dateEl = item.querySelector(
                        '[class*="meta"], [class*="date"], [class*="time"], [class*="Date"], [class*="Time"], ' +
                        '.rate-date, .tb-rate-date'
                    );
                    // Try multiple content selectors
                    const contentEl = item.querySelector(
                        '[class*="content"], [class*="Content"], ' +
                        '[class*="text"], [class*="Text"]:not(textarea), ' +
                        '[class*="desc"], [class*="Desc"], ' +
                        '.rate-content, .tb-rate-content'
                    );

                    const name = (nameEl?.textContent || '').trim();
                    let date = (dateEl?.textContent || '').trim();
                    // Clean date: extract just the date, remove "已购：..." suffix
                    const dateMatch = date.match(/(\\d{4}[年\\-\\/]\\d{1,2}[月\\-\\/]\\d{1,2}[日]?)/);
                    if (dateMatch) date = dateMatch[1];
                    let content = (contentEl?.textContent || '').trim();

                    // If no content element found, try the item's direct text
                    if (!content || content.length <= 2) {
                        // Get text that's not from name/date elements
                        const clone = item.cloneNode(true);
                        if (nameEl) { const n = clone.querySelector(nameEl.tagName + '.' + (nameEl.className||'').split(' ')[0]); if(n) n.remove(); }
                        if (dateEl) { const d = clone.querySelector(dateEl.tagName + '.' + (dateEl.className||'').split(' ')[0]); if(d) d.remove(); }
                        content = (clone.textContent || '').trim().slice(0, 500);
                    }

                    if (content && content.length > 2) {
                        results.push({name, date, content: content.slice(0, 500)});
                    }
                }

                // Debug info when no reviews found
                if (results.length === 0) {
                    return { _debug: true, url: url.slice(0, 80), isTmall,
                        sampleClasses: Array.from(document.querySelectorAll('div[class]'))
                            .slice(0, 200).map(d => d.className.toString().slice(0, 40))
                            .filter(c => /comment|rate|review|item|content|user/i.test(c))
                            .slice(0, 20)
                    };
                }
                return results;
            }""")

            # Handle debug output
            if isinstance(new_reviews, dict) and new_reviews.get("_debug"):
                if scroll_round == 0:
                    await self._ws.send_status(
                        f"评论元素调试 ({('天猫' if new_reviews.get('isTmall') else '淘宝')}): "
                        f"匹配class: {new_reviews.get('sampleClasses', [])[:10]}"
                    )
                new_reviews = []

            # Deduplicate and add new reviews
            added = 0
            for r in (new_reviews or []):
                if len(reviews) >= max_reviews:
                    break
                key = f"{r.get('name', '')}|{r.get('content', '')[:100]}"
                if key in seen_keys:
                    continue
                seen_keys.add(key)
                r["product"] = product_title
                reviews.append(r)
                added += 1

            # Only report progress when count changes (avoid flooding)
            if len(reviews) != last_reported:
                await self._ws.send_status(f"已抓取 {len(reviews)}/{max_reviews} 条评论")
                last_reported = len(reviews)

            if added > 0:
                no_new_count = 0
            else:
                no_new_count += 1

            if len(reviews) >= max_reviews:
                break

            # After 3 rounds no new reviews, try next page then give up
            if no_new_count >= 3:
                clicked_next = await self._try_next_page()
                if clicked_next:
                    no_new_count = 0
                    continue
                break

            # Human-like pause between scroll rounds
            await self._sleep(random.uniform(2, 4))

        return reviews

    def _write_csv(self, path: Path, reviews: list[dict]) -> None:
        with open(path, "w", newline="", encoding="utf-8-sig") as f:
            writer = csv.writer(f)
            writer.writerow(["商品", "用户名", "评论时间", "评论内容"])
            for r in reviews:
                writer.writerow([
                    r.get("product", ""),
                    r.get("name", ""),
                    r.get("date", ""),
                    r.get("content", ""),
                ])
