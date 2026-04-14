---
name: tomitest
description: E2E test suite for all JOTO.AI websites. Covers all pages, forms, i18n, SEO, admin dashboard, and cross-site functionality.
---

# TomiTest — JOTO.AI Website E2E Test Suite

## Overview

Comprehensive end-to-end test suite covering all JOTO.AI product websites.

## Mandatory Testing Rules

1. **Must use Puppeteer MCP to open a browser** for every verification — do NOT rely on curl or direct API calls alone. Every test item must be confirmed visually in a real browser via `mcp__puppeteer__puppeteer_navigate`, `mcp__puppeteer__puppeteer_screenshot`, etc.
2. **All operations must go through the frontend UI** — click buttons, fill forms, and observe results in the browser. Do NOT bypass the frontend to call APIs directly. The goal is to verify the real user experience, not just the backend.
3. **Always test against the PRODUCTION URLs** (e.g. `https://audit.jotoai.com`), NEVER against `localhost`. Testing localhost hits different API routes, different configs, and misses real deployment issues (nginx routing, CORS, SSL, etc.). The whole point of E2E testing is to verify what real users see on the real server.
4. **Clean up all test data after testing** — delete test users, notebooks, chat sessions, uploaded files, and any other artifacts created during the test run. The test suite must leave zero pollution in the user environment.

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

**Admin article generation:**

| # | Test | Method | Expected |
|---|------|--------|----------|
| AG1 | Login to admin | Open admin.jotoai.com → login with tomi@jototech.cn | Dashboard visible with Sites/Forms/Articles stats |
| AG2 | Navigate to articles | Click 文章管理 in sidebar | Article list for selected site |
| AG3 | Switch site | Select each site (audit/shanyue/sec/kb/fasium/noteflow) | Shows articles for that site |
| AG4 | Generate article | Click 生成文章 → configure → generate | New article created, appears in list |
| AG5 | Verify on frontend | After generating, open site's /blog page | New article visible on frontend |
| AG6 | Delete test article | Select article → delete | Article removed from list and frontend |

### 6. Admin Dashboard Tests (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| AD1 | Login | Open admin.jotoai.com → fill email/password → login | Dashboard loads |
| AD2 | Dashboard stats | Check stats cards | Sites=7, Forms count, Articles count, Version visible |
| AD3 | Site status | Check Site Status section | All 7 sites show "All OK" with response times |
| AD4 | 留言管理 | Click 留言管理 in sidebar | Contact submissions list with sender info |
| AD5 | 文章管理 | Click 文章管理 | Article list with site selector |
| AD6 | 站点管理 | Click 站点管理 | All 7 sites listed with URLs |
| AD7 | 邮件设置 | Click 邮件设置 | Resend API key configured, FROM address visible |
| AD8 | 文章配置 | Click 文章配置 | LLM model, SEO keywords configuration |
| AD9 | 管理员 | Click 管理员 | Admin user list |
| AD10 | SSL 证书 | Click SSL 证书 | Certificate status for each domain |

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

