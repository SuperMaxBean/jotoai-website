---
name: tomitest
description: E2E test suite for all JOTO.AI websites. Covers all pages, forms, i18n, SEO, admin dashboard, and cross-site functionality.
---

# TomiTest — JOTO.AI Website E2E Test Suite

## Overview

Comprehensive end-to-end test suite covering all JOTO.AI product websites.

## Mandatory Testing Rules

1. **Must use Playwright MCP to open a browser** for every verification — do NOT rely on curl or direct API calls alone. Every test item must be confirmed visually in a real browser via `mcp__playwright__browser_navigate`, `mcp__playwright__browser_take_screenshot`, etc.
2. **All operations must go through the frontend UI** — click buttons, fill forms, and observe results in the browser. Do NOT bypass the frontend to call APIs directly. The goal is to verify the real user experience, not just the backend.
3. **Always test against the PRODUCTION URLs** (e.g. `https://audit.jotoai.com`), NEVER against `localhost`. Testing localhost hits different API routes, different configs, and misses real deployment issues (nginx routing, CORS, SSL, etc.). The whole point of E2E testing is to verify what real users see on the real server.
4. **Clean up all test data after testing** — delete test users, notebooks, chat sessions, uploaded files, and any other artifacts created during the test run. The test suite must leave zero pollution in the user environment.
5. **Be strict about PASS/FAIL** — if a page shows wrong data (e.g. "? 天", wrong company name, missing elements), mark it FAIL immediately. Do NOT rationalize partial results as passing.
6. **Check nginx port routing** — many bugs are caused by nginx proxying to the wrong port. If a site shows another site's content, check `grep proxy_pass /etc/nginx/sites-enabled/{site}.jotoai.com`.

## Testing Methodology

Use a systematic page-by-page approach:
1. **Navigate** to each URL in Playwright browser
2. **Screenshot** the page for visual verification
3. **Evaluate** specific checks via `browser_evaluate` (e.g. check footer text, form fields, link counts)
4. **Interact** — click buttons, fill forms, submit, verify results
5. **Record** results in a summary table per category
6. **Fix bugs** found during testing, then re-verify

For batch checks across sites (ICP, company name, email, WeChat QR), use `browser_evaluate` with JSON output to check multiple properties at once:
```javascript
() => {
  const text = document.body.innerText;
  const footer = document.querySelector('footer');
  return JSON.stringify({
    hasICP: text.includes('沪ICP备15056478号-5'),
    hasCompany: text.includes('上海聚托信息科技有限公司'),
    email: (text.match(/[\w.-]+@[\w.-]+/g) || []),
    wechatQR: !!document.querySelector('img[src*="wechat"]')
  });
}
```

## Server Port Mapping (Reference)

| Site | Port | Nginx Config |
|------|------|-------------|
| audit | 3001 | /etc/nginx/sites-enabled/audit.jotoai.com |
| shanyue | 3002 | /etc/nginx/sites-enabled/shanyue.jotoai.com |
| sec | 3003 | /etc/nginx/sites-enabled/sec.jotoai.com |
| admin backend | 3004 | /etc/nginx/sites-enabled/admin.jotoai.com |
| fasium | 3005 | /etc/nginx/sites-enabled/fasium.jotoai.com |
| kb | 3006 | /etc/nginx/sites-enabled/kb.jotoai.com |
| loop | 8000 | /etc/nginx/sites-enabled/loop.jotoai.com (uvicorn) |

## Sites Under Test

| Site | URL | Key Flows |
|------|-----|-----------|
| 唯客智审 (audit) | https://audit.jotoai.com | Landing, blog, contact form, admin |
| 闪阅 (shanyue) | https://shanyue.jotoai.com | Landing, articles, capabilities, contact |
| 唯客AI护栏 (sec) | https://sec.jotoai.com | Landing, features, articles, pricing, contact |
| 知识中台 (kb) | https://kb.jotoai.com | Landing, blog, login |
| FasiumAI (fasium) | https://fasium.jotoai.com | Landing, blog, blog detail, contact form |
| Loop | https://loop.jotoai.com | Landing, admin |
| Admin Dashboard | https://admin.jotoai.com | Login, dashboard, site status, email config, contacts |

---

## JOTO.AI Website Tests

### 1. Page Load Tests (Browser)

**Open each page in Puppeteer, screenshot, verify content renders.**

| # | Site | Pages to test | Expected |
|---|------|--------------|----------|
| PL1 | audit | `/`, `/features`, `/architecture`, `/blog`, `/contact`, `/privacy` | Each page renders with content, no blank screens |
| PL2 | shanyue | `/`, `/capabilities`, `/architecture`, `/articles`, `/contact`, `/privacy`, `/login` | Same |
| PL3 | sec | `/`, `/features`, `/contact`, `/articles`, `/about`, `/changelog`, `/roadmap`, `/pricing` | Same |
| PL4 | kb | `/`, `/blog`, `/login` | Same |
| PL5 | fasium | `/`, `/blog`, `/contact`, `/privacy` | Same |
| PL6 | loop | `/` | Landing page renders |
| PL7 | noteflow | `/`, `/features`, `/use-cases`, `/blog`, `/contact`, `/privacy` | Same |
| PL8 | admin | `https://admin.jotoai.com` | Login page renders |

### 2. i18n Tests (Browser)

**Click language toggle, verify ALL visible text switches.**

| # | Site | Test | Expected |
|---|------|------|----------|
| I1 | audit | Click EN → verify navbar, hero, footer all English | No Chinese text in main content (blog content excluded) |
| I2 | shanyue | Click EN → verify | Same |
| I3 | sec | Click EN → verify | Same |
| I4 | kb | Click EN → verify | Same |
| I5 | fasium | Click EN → verify | Same |
| I6 | loop | Click EN → verify | Same |
| I7 | noteflow | Click 中文 → verify | All UI switches to Chinese |
| I8 | All sites | Brand names in EN mode | No Chinese brand names mixed in English text (e.g. no "唯客智审" in EN mode) |

### 3. SEO Tests (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| SEO1 | robots.txt | Navigate to `/{site}/robots.txt` | Valid robots.txt content |
| SEO2 | sitemap.xml | Navigate to `/{site}/sitemap.xml` | Valid sitemap |
| SEO3 | Favicon | Check favicon in browser tab | Each site has favicon |
| SEO4 | ICP备案 | Scroll to footer | 沪ICP备15056478号-5 visible on all sites |
| SEO5 | Company name | Footer | 上海聚托信息科技有限公司 (or English equivalent in EN mode) |

### 3. Contact Form E2E Tests (Browser Required)

**Every test MUST be done via Puppeteer browser — fill the form, type captcha, click submit, verify success message AND email receipt.**

| # | Site | URL | API Route | Test Steps | Expected |
|---|------|-----|-----------|------------|----------|
| CF1 | audit | https://audit.jotoai.com/contact | `/api/audit/contact` | Open page → fill name/company/email/phone/message → read captcha from screenshot → fill captcha → click 提交 | "提交成功" message + email received at `tomi@jototech.cn` |
| CF2 | fasium | https://fasium.jotoai.com/contact | `/api/fasium/contact` | Same flow — note: dark theme, captcha uses base64 SVG img | "提交成功" + email received |
| CF3 | shanyue | https://shanyue.jotoai.com/contact | `/api/shanyue/contact` | Same flow — has role select dropdown | "提交成功" + email received |
| CF4 | sec | https://sec.jotoai.com/contact | `/api/sec/contact` | Same flow | "提交成功" + email received |
| CF5 | kb | https://kb.jotoai.com/ (scroll to contact section) | `/api/kb/contact` | Scroll to contact form at bottom of landing page → fill → submit | "提交成功" + email received |
| CF6 | audit EN | https://audit.jotoai.com/contact (EN mode) | `/api/audit/contact` | Click EN toggle → fill form in English → submit | English success message + email received |
| CF7 | fasium EN | https://fasium.jotoai.com/contact (EN mode) | `/api/fasium/contact` | Click EN toggle → fill → submit | English success message + email |

**Validation tests (per site):**

| # | Test | Method | Expected |
|---|------|--------|----------|
| CV1 | Empty required fields | Leave name blank, click submit | Browser validation blocks submit |
| CV2 | Empty message (required) | Fill all except message | Browser validation blocks submit (message is required with *) |
| CV3 | Wrong captcha | Fill form + wrong captcha text | "验证码错误" error message |
| CV4 | Expired captcha | Wait >5min then submit | "验证码已过期" error |

**Email content verification:**
- FROM: `noreply@mail.jotoai.com`
- TO: `tomi@jototech.cn` (configured in each site's `data/sites/{site}/config.json`)
- Subject: `[{站点名}] 新的联系表单`
- Body contains: name, company, email, phone, message, submit time

**Known bug (fixed):** Site-specific route `/api/:site/contact` previously did NOT send email. Fixed 2026-04-14 by adding `sendEmail()` call to the handler in `index.js`.

### 5. Blog/Article Tests (Browser)

| # | Site | URL | Test | Expected |
|---|------|-----|------|----------|
| BL1 | audit | /blog | Open blog listing page | Article cards visible with titles, dates, categories |
| BL2 | audit | /blog/{id} | Click first article | Article detail page renders with full content |
| BL3 | shanyue | /articles | Open articles page | Article list renders |
| BL4 | shanyue | /articles/{id} | Click article | Detail page renders |
| BL5 | sec | /articles | Open articles page | Article list renders |
| BL6 | sec | /articles/{id} | Click article | Detail page renders |
| BL7 | kb | /blog | Open blog page | Article list renders |
| BL8 | kb | /blog/{id} | Click article | Detail page renders |
| BL9 | fasium | /blog | Open blog page | Article list renders |
| BL10 | fasium | /blog/{id} | Click article | Detail page renders |
| BL11 | noteflow | /blog | Open blog page | Article cards render (from admin API or fallback) |
| BL12 | noteflow | /blog/{id} | Click article | Detail page renders |

**Admin article management (full E2E):**

| # | Test | Method | Expected |
|---|------|--------|----------|
| AG1 | Login to admin | Open admin.jotoai.com → login with tomi@jototech.cn | Dashboard loads with Sites/Forms/Articles stats |
| AG2 | Navigate to articles | Click 文章管理 in sidebar | Article list with site selector tabs (全部/唯客智审/闪阅/...), "文章配置" gear button + "+ 生成新文章" button in top-right |
| AG3 | Switch site tab | Click each site tab (唯客智审/闪阅/sec/kb/fasium) | Article count in tab matches, list filters to that site |
| AG4 | Open article config | Click gear "文章配置" button in top-right | Config panel expands below article list with scope tabs: 全局 + all 7 sites |
| AG5 | Global config loads | Config scope = "全局" (default) | LLM model fields filled (API Key, Endpoint, Model), Unsplash, auto-publish, SEO keywords all visible |
| AG6 | Switch to site config | Click a site tab (e.g. "唯客智审") | Hint "站点级配置会覆盖全局配置。留空则使用全局值。" appears; fields load that site's config (may differ from global) |
| AG7 | Site has own LLM | Check "唯客智审" config | Endpoint/Model differ from global (e.g. `ark.cn-beijing.volces.com` + `doubao-seed`) |
| AG8 | Save site config | Change SEO keywords for one site → click 保存 | Toast "站点配置已保存"; reload config → keywords persisted |
| AG9 | Save global config | Switch to 全局 → change a value → click 保存 | Toast "全局配置已保存"; reload config → value persisted |
| AG10 | Generate article | Click "+ 生成新文章" | Article generated, appears at top of list with site tag + date |
| AG11 | Preview article | Click "预览" on an article | Modal opens with article title + rendered HTML content |
| AG12 | Delete test article | Click "删除" on test article → confirm | Article removed from list; verify it no longer appears on frontend blog page |
| AG13 | Verify on frontend | After generating, open that site's /blog page in browser | New article visible with title, date, image |
| AG14 | Config panel toggle | Click gear button again | Config panel hides; click again → re-expands (remembers last scope tab) |

**Config fields to verify per scope (global or site):**

| Section | Fields | Notes |
|---------|--------|-------|
| LLM 模型 | API Key (password), Endpoint, Model | 保存 + 测试连接 buttons |
| Unsplash 图片配置 | Access Key, 图片去重窗口, 启用图片去重 checkbox | |
| 自动发布 | 启用开关, 发布时间, AI 文章数, 字数 | |
| 搜索改写 | 启用开关, 改写文章数量, 发布间隔(小时) | Description: "从网上搜索相关文章并深度改写" |
| SEO 关键字 | 多行文本框, 逗号分隔 | |

### 6. Admin Dashboard Tests (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| AD1 | Login | Open admin.jotoai.com → fill email/password → login | Dashboard loads |
| AD2 | Dashboard stats | Check stats cards | Sites=7, Forms count, Articles count, Version visible |
| AD3 | Site status | Check Site Status section | All 7 sites show "All OK" with response times |
| AD4 | 留言管理 | Click 留言管理 in sidebar | Contact submissions list with sender info |
| AD5 | 文章管理 | Click 文章管理 | Article list with site tabs + gear "文章配置" button in top-right. Click gear → config panel with scope tabs (全局 + 7 sites). See AG1-AG14 for full article management tests |
| AD6 | 站点管理 | Click 站点管理 | All 7 sites listed with URLs |
| AD7 | 邮件设置 | Click 邮件设置 | Resend API key configured, FROM address visible |
| AD8 | 集成 | Click 集成 | Feishu webhook + table sync config |
| AD9 | 管理员 | Click 管理员 | Admin user list |
| AD10 | SSL 证书 | Click SSL 证书 | Table showing ALL 8 domains (audit/shanyue/sec/kb/fasium/loop/noteflow/admin) with expiry dates, days left (green >30, yellow 7-30, red <7), and issued dates |

**Admin UI rules:**
- No emojis anywhere in the admin dashboard (UI text, site icons, buttons)
- All sidebar items must render their page correctly when clicked
- "文章配置" is NOT a separate sidebar item — it's a gear icon button in the 文章管理 page header (top-right, next to "+ 生成新文章")
- Article config supports global + per-site scope switching (7 sites + global tab)
- Site-level config overrides global config; empty fields fall back to global values

### 7. Contact Info Consistency (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| CI1 | Phone | Check every site's contact page | `+86 (021) 6566 1628` on all sites |
| CI2 | Email | Check every site's contact page | `jotoai@jototech.cn` on all sites |
| CI3 | WeChat QR | Check contact pages with QR | Real QR code image loads (not placeholder) |
| CI4 | Company name | Check footer on all sites | 上海聚托信息科技有限公司 |

### 8. Noteflow Landing Page Integration (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| NF1 | Contact form | Open note.jotoai.com/contact → fill → submit with captcha | "消息已发送成功" + email received |
| NF2 | Blog from admin API | Open note.jotoai.com/blog | Articles load (from admin API or fallback) |
| NF3 | Blog detail | Click article | Detail page renders |
| NF4 | Admin API proxy | note.jotoai.com/admin-api/captcha | Returns JSON captcha (not HTML) |
| NF5 | WeChat QR | Check contact page | QR image loads correctly |
| NF6 | i18n toggle | Click 中文/EN | Language switches |

### 9. China Accessibility Tests (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| CA1 | No Google Fonts | Open page, check network requests | No requests to fonts.googleapis.com |
| CA2 | No Google Analytics | Check network requests | No requests to google-analytics.com |
| CA3 | No blocked CDNs | Check for reCAPTCHA, Google CDN | No external blocked resources |
| CA4 | All assets load | Open each site, check for broken images/CSS | No 404s or loading failures |

