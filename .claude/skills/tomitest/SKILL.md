---
name: tomitest
description: E2E test suite for all JOTO.AI websites + Noteflow. Covers all pages, forms, API endpoints, SEO, admin dashboard, and cross-site functionality.
---

# TomiTest — JOTO.AI & Noteflow E2E Test Suite

## Overview

Comprehensive end-to-end test suite covering all JOTO.AI product websites and Noteflow deployment verification.

## Mandatory Testing Rules

1. **Must use Puppeteer MCP to open a browser** for every verification — do NOT rely on curl or direct API calls alone. Every test item must be confirmed visually in a real browser via `mcp__puppeteer__puppeteer_navigate`, `mcp__puppeteer__puppeteer_screenshot`, etc.
2. **All operations must go through the frontend UI** — click buttons, fill forms, and observe results in the browser. Do NOT bypass the frontend to call APIs directly. The goal is to verify the real user experience, not just the backend.
3. **Clean up all test data after testing** — delete test users, notebooks, chat sessions, uploaded files, and any other artifacts created during the test run. The test suite must leave zero pollution in the user environment.

## Sites Under Test

| Site | URL | Key Flows |
|------|-----|-----------|
| **Noteflow (prod)** | https://noteflow.jotoai.com | Full app test suite (see below) |
| **Noteflow (prod2)** | https://note.jotoai.com | Full app test suite (see below) |
| **Noteflow (test)** | https://cloud.jototech.cn:1001 | Dev/test instance |
| 唯客智审 (audit) | https://audit.jotoai.com | Landing, blog, contact form, admin |
| 闪阅 (shanyue) | https://shanyue.jotoai.com | Landing, articles, capabilities, contact |
| 唯客AI护栏 (sec) | https://sec.jotoai.com | Landing, features, articles, pricing, contact |
| 知识中台 (kb) | https://kb.jotoai.com | Landing, blog, login |
| FasiumAI (fasium) | https://fasium.jotoai.com | Landing, blog, blog detail, contact form |
| Loop | https://loop.jotoai.com | Landing, admin |
| Admin Dashboard | https://admin.jotoai.com | Login, dashboard, site status, email config, contacts |

---

## Noteflow E2E Test Suite

### Test Accounts
- **Test**: `testclaude@noteflow.dev` / `Test1234` (admin on test server)
- **Prod2**: `e2e-final@noteflow.dev` / `Test1234` (admin on note.jotoai.com)
- **Gmail for invite test**: `xu.tomi3@gmail.com`

### Server Credentials
- **Test server** (10.200.0.112): root / Jototech@123
- **Prod2 server** (124.223.93.11): ubuntu / Jototech@123
- **Internal services** (10.200.0.102): ubuntu / Nl369099@joto (GPU server: MinerU, ASR, Xinference)

### A. Infrastructure Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| A1 | HTTPS landing page loads | `curl -s https://{domain}/` | HTTP 200, HTML with landing-assets |
| A2 | HTTP → HTTPS redirect | `curl -s http://{domain}/` | HTTP 301 |
| A3 | API health check | `GET /api/health` | `{"status":"ok"}` |
| A4 | SSL certificate valid | `openssl s_client` | Let's Encrypt, not expired |
| A5 | SSL auto-renewal | Check certbot container running | Certbot running, 12h cycle |
| A6 | Landing page i18n | Check `/landing-assets/` JS | Contains Chinese translations |
| A7 | Login page loads | `GET /login` | HTTP 200 |
| A8 | Features page loads | `GET /features` | HTTP 200 |
| A9 | Nginx WebSocket headers | Check nginx config | 4x Upgrade headers (HTTP+HTTPS, /api/+/) |

### B. Auth Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| B1 | Register new user | `POST /api/auth/register` | Returns access_token + refresh_token |
| B2 | Login | `POST /api/auth/login` | Returns tokens |
| B3 | Get profile | `GET /api/auth/me` | Returns name, email, language, is_admin |
| B4 | Update language | `PATCH /api/auth/profile {"language":"zh"}` | language=zh persisted |
| B5 | Forgot password email | `POST /api/auth/forgot-password {"email":"xu.tomi3@gmail.com"}` → verify via `mcp__claude_ai_Gmail__gmail_search_messages` query `from:noreply@mail.jotoai.com subject:reset` | Email received with reset link pointing to correct domain |
| B6 | Apple Sign In | `POST /api/auth/apple {identity_token}` | Returns tokens (iOS only) |
| B7 | Microsoft OAuth | `GET /api/auth/microsoft` | Redirects to Microsoft login |

### C. Document Upload & Processing Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| C1 | Upload TXT file | `POST /api/notebooks/{id}/sources -F file=@test.txt` | Source created, status→ready |
| C2 | Upload PDF + MinerU parse | Upload PDF, wait for status=ready | Parsed content with `<!-- page:N -->` markers |
| C3 | Upload DOCX + parse | Upload DOCX, wait for ready | Content extracted, RAGFlow indexed |
| C4 | Source content API | `GET /api/notebooks/{id}/sources/{sid}/content` | Returns full parsed markdown |
| C5 | RAGFlow vectorization | Check source status after upload | status=ready, chunks created in RAGFlow |
| C6 | Digest auto-generation | Check `_digest.md` file after upload | Digest file created (~2000-3000 chars) |

### D. Chat Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| D1 | Chat with RAG + citations | `POST /api/notebooks/{id}/chat` with source_ids | SSE stream with tokens, ends with `[N]` citation |
| D2 | Chat without sources | Send message without source_ids | Response from LLM (no citations) |
| D3 | Deep Thinking (ReAct) | `{"message":"...","deep_thinking":true}` | SSE includes `type:thinking` steps |
| D4 | Web Search mode | `{"message":"...","web_search":true}` | Response includes web results |
| D5 | Chat history | `GET /api/notebooks/{id}/chat/history` | Returns previous messages |
| D6 | Chat sessions | `GET /api/notebooks/{id}/sessions` | Returns session list with names |
| D7 | Session auto-naming | Send first message in new session | Session renamed based on content |
| D8 | Error handling (LLM down) | Simulate primary failure | Fallback to backup LLM, friendly error message |

### E. Studio Skills Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| E1 | Summary | `POST /api/notebooks/{id}/studio/summary` | Returns structured summary |
| E2 | FAQ | `POST .../studio/faq` | Returns Q&A pairs |
| E3 | Action Items | `POST .../studio/action_items` | Returns tasks/deadlines |
| E4 | SWOT Analysis | `POST .../studio/swot` | Returns SWOT sections |
| E5 | Recommendations | `POST .../studio/recommendations` | Returns actionable advice |
| E6 | Mind Map | `POST .../studio/mindmap` | Returns valid JSON tree |
| E7 | Custom Skill CRUD | POST/GET/PATCH/DELETE custom-skills | Create, list, update, delete |
| E8 | Custom Skill execute | `POST .../custom-skills/{id}/execute` | Returns generated content |
| E9 | Custom Skill full_document flag | Create skill with full_document=true | Flag persisted and used |

### F. Meeting & ASR Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| F1 | Create meeting | `POST /api/notebooks/{id}/meetings` | Meeting created with status=recording |
| F2 | WebSocket audio connect | `WS /api/notebooks/{id}/meetings/{mid}/audio` | WebSocket accepted |
| F3 | ASR transcription | Send PCM audio chunks via WebSocket | Receive utterance JSON with text |
| F4 | Meeting pause/resume | `POST .../meetings/{mid}/pause` and `/resume` | Status changes |
| F5 | Meeting end + minutes | `POST .../meetings/{mid}/end` | Transcript saved, source created |
| F6 | Meeting hotwords | `GET/PUT .../meetings/hotwords` | Words persisted per user |
| F7 | Active meetings API | `GET /api/meetings/my-active` | Returns active meetings across notebooks |
| F8 | Auto-pause on WS disconnect | Disconnect WebSocket | ASR paused, 5-min auto-end timer |
| F9 | Meeting minutes share | `POST .../chat/{msgId}/share-minutes` | Returns share token + URL |

### G. Notebook & Collaboration Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| G1 | Create notebook | `POST /api/notebooks` | Returns notebook with ID |
| G2 | Notebook overview | `GET /api/notebooks/{id}/overview` | Returns AI-generated overview |
| G3 | Notebook persona | `PATCH /api/notebooks/{id} {custom_prompt}` | Persona saved and used in chat |
| G4 | 7 persona presets | Open Notebook Settings in browser | Balanced, Detailed, Strict, Advisor, Concise, Teacher, Custom |
| G5 | Create invite link | `POST /api/notebooks/{id}/share` | Returns token with expiry |
| G6 | Email invite | `POST /api/notebooks/{id}/share/email` | Email sent to recipient |
| G7 | List members | `GET /api/notebooks/{id}/members` | Returns member list with roles |
| G8 | Notes CRUD | `POST/GET /api/notebooks/{id}/notes` | Create and list notes |
| G9 | Dashboard recording indicator | Navigate away from recording notebook | Shows REC/PAUSED on dashboard card |
| G10 | Auto-pause on leave | Navigate away during recording | Recording pauses, 5-min timeout |

### H. Admin Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| H1 | Admin dashboard | Open /admin in browser | Shows stats cards (users, notebooks, docs, storage) |
| H2 | Admin users | `GET /api/admin/users` | Returns paginated user list |
| H3 | Admin settings | `GET /api/admin/settings` | Returns all system settings |
| H4 | Admin LLM config | Open /admin LLM Config | Shows Primary + Backup LLM with DB override |
| H5 | Admin system health | `GET /api/admin/health` | 12/12 services healthy |
| H6 | Context Window = 200K | Check admin LLM Config | glm-4.7, context_window=200000 |

### I. Health Check Services (12 total)

| # | Service | Health Check Method |
|---|---------|-------------------|
| I1 | PostgreSQL | `pg_isready` |
| I2 | RAGFlow | `GET /api/v1/datasets` with API key |
| I3 | MinerU | `GET /gradio_api/info` |
| I4 | Elasticsearch | `GET /_cluster/health` (green/yellow) |
| I5 | Redis | `redis-cli ping` |
| I6 | Docmee AiPPT | `GET /api/user/apiInfo` |
| I7 | Chat LLM Primary (glm-4.7) | Generate test completion |
| I8 | Chat LLM Secondary (qwen3.5-plus) | Generate test completion |
| I9 | Vision LLM (glm-4.6v) | Generate test completion |
| I10 | Embedding (bge-m3) | Generate test embedding |
| I11 | Rerank (gte-rerank) | Test rerank API |
| I12 | ASR (Qwen3-ASR) | Send silent audio, get 200 OK |

### J. LLM Fallback Tests

| # | Test | Expected |
|---|------|----------|
| J1 | Primary works normally | Response from glm-4.7 |
| J2 | Primary down → backup | Auto-fallback to qwen3.5-plus |
| J3 | Primary restored → back | Next request uses primary again |
| J4 | 429 rate limit → backup | Fallback triggered |
| J5 | Content filter → no fallback | User-facing error, no fallback |

### K. i18n Tests

| # | Test | Expected |
|---|------|----------|
| K1 | Browser zh → Chinese UI | Auto-detect browser language |
| K2 | Settings language switch | EN ↔ 中文 toggle in Settings page |
| K3 | Language persisted in DB | `PATCH /api/auth/profile {language}` |
| K4 | Dashboard in Chinese | "个人笔记本", "新建" |
| K5 | Settings in Chinese | "设置", "个人资料", "保存更改" |
| K6 | Landing page i18n | EN \| 中文 toggle in navbar |

### L. Error Handling Tests

| # | Test | Expected |
|---|------|----------|
| L1 | Context too long | "Selected sources contain too much data..." |
| L2 | Content filter | "内容安全审核误拦截..." |
| L3 | Service unavailable | "服务暂时不可用..." |
| L4 | Unknown error | "出了点问题，请重试" (no raw error exposed) |

### M. File Type Tests (Upload + Parse + RAG)

| # | Test | Method | Expected |
|---|------|--------|----------|
| M1 | PDF upload + MinerU parse | Upload PDF, check `_parsed.md` | Content with `<!-- page:N -->` markers, RAGFlow indexed |
| M2 | DOCX upload + parse | Upload DOCX | Content extracted, status=ready |
| M3 | PPTX upload + parse | Upload PPTX | Slides extracted as markdown |
| M4 | Excel/CSV upload | Upload .xlsx/.csv | RAGFlow indexed with html4excel |
| M5 | Image upload + Vision OCR | Upload JPG/PNG | Vision LLM extracts text, saved as .md |
| M6 | Audio upload + ASR transcription | Upload MP3/WAV | Qwen3-ASR transcribes, saved as .md |
| M7 | URL/Web import | `POST /sources/url {"url":"..."}` | Web page scraped, markdown saved |
| M8 | Large file upload (>10MB) | Upload large PDF | Processing completes within timeout |
| M9 | Source rename | `PATCH /sources/{id}/rename` | Filename updated |
| M10 | Source delete | `DELETE /sources/{id}` | Source + RAGFlow doc removed |
| M11 | Source retry (failed) | `POST /sources/{id}/retry` | Reprocessing triggered |
| M12 | Source status SSE | `GET /sources/status` (SSE) | Real-time progress events |
| M13 | File viewer (PDF) | `GET /sources/{id}/file` | Returns PDF for inline viewer |
| M14 | File viewer (PPTX → PDF) | `GET /sources/{id}/file` for PPTX | Auto-converts and returns PDF |

### N. Session Management Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| N1 | List sessions | `GET /notebooks/{id}/sessions` | Returns session list |
| N2 | Create session | `POST /notebooks/{id}/sessions` | New session created |
| N3 | Rename session | `PATCH /sessions/{id}` | Name updated |
| N4 | Delete session | `DELETE /sessions/{id}` | Session + messages deleted |
| N5 | Session auto-pruning | Create >20 sessions | Oldest sessions auto-deleted |
| N6 | Chat history per session | Query with session_id | Only that session's messages |

### O. PPT Generation Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| O1 | List PPT templates | `GET /api/ppt/templates` | Returns template list |
| O2 | Get generation options | `GET /api/ppt/generation-options` | Returns scene/audience/language |
| O3 | Generate PPT (Docmee) | `POST /studio/ppt` | Returns PPT download URL |
| O4 | Generate PPT (fallback) | POST when Docmee unavailable | python-pptx generates PPTX |

### P. Podcast Generation Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| P1 | Generate podcast | `POST /studio/podcast` | Returns MP3 audio URL |
| P2 | TTS voices working | Check ailun + aicheng voices | Audio with host/guest dialogue |

### Q. Multi-Model Chat (Just Chat)

| # | Test | Method | Expected |
|---|------|--------|----------|
| Q1 | List LLM models | `GET /chat/models` | Returns enabled models (no keys exposed) |
| Q2 | Multi-model chat | `POST /chat/multi` with model_ids | Returns responses from all selected models |
| Q3 | Multi-model streaming | `POST /chat/multi/stream` | SSE stream with per-model tokens |
| Q4 | Just Chat notebook | Create notebook with is_just_chat=true | Special chat-only interface |

### R. Voice Transcription (Push-to-Talk)

| # | Test | Method | Expected |
|---|------|--------|----------|
| R1 | Voice transcribe | `POST /api/voice/transcribe` with audio file | Returns transcribed text |

### S. Sharing & Collaboration (Advanced)

| # | Test | Method | Expected |
|---|------|--------|----------|
| S1 | Create invite link | `POST /notebooks/{id}/share` | Returns token + expiry |
| S2 | Email invite | `POST /notebooks/{id}/share/email` | Email sent via Resend |
| S3 | Revoke invite | `DELETE /notebooks/{id}/share` | Link invalidated |
| S4 | Join via invite link | `GET /join/{token}` in browser | User added to notebook |
| S5 | Role permissions (Viewer) | Login as viewer, try edit | Cannot upload/delete |
| S6 | Role permissions (Editor) | Login as editor | Can upload/chat, cannot manage members |
| S7 | Toggle shared chat | `PATCH /notebooks/{id}/shared-chat` | Shared chat mode on/off |
| S8 | Shared chat messages | Two users chat in shared notebook | Both see each other's messages |
| S9 | Meeting minutes share | `POST /chat/{msgId}/share-minutes` | Public URL created |
| S10 | Public minutes view | `GET /public/meeting-minutes/{token}` | Content visible without login |
| S11 | Revoke minutes share | `DELETE /chat/{msgId}/share-minutes` | Link invalidated |

### T. Notebook Management Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| T1 | Rename notebook | `PATCH /notebooks/{id}` with name | Name updated |
| T2 | Change emoji | `PATCH /notebooks/{id}` with emoji | Emoji updated |
| T3 | Change cover color | `PATCH /notebooks/{id}` with cover_color | Color updated |
| T4 | Delete notebook | `DELETE /notebooks/{id}` | Notebook + sources deleted |
| T5 | AI prompt optimize | `POST /notebooks/optimize-prompt` | Prompt rewritten by AI |
| T6 | Suggestion level | `PATCH /notebooks/{id}` with suggestion_level | Meeting AI insight frequency changed |

### U. Chat Feedback Tests

| # | Test | Method | Expected |
|---|------|--------|----------|
| U1 | Thumbs up | `POST /chat/feedback` vote=up | Feedback saved |
| U2 | Thumbs down + comment | `POST /chat/feedback` vote=down, comment | Feedback + correction saved |
| U3 | Remove feedback | `POST /chat/feedback` vote=none | Feedback cleared |

### V. User Feedback (Bug Report)

| # | Test | Method | Expected |
|---|------|--------|----------|
| V1 | Submit bug report | `POST /api/feedback` type=bug | Feedback saved |
| V2 | Submit feature wish | `POST /api/feedback` type=wish | Feedback saved |
| V3 | Bug with screenshot | POST with image attachment | Image saved |

### W. Frontend Pages Tests (Browser)

| # | Test | Method | Expected |
|---|------|--------|----------|
| W1 | Landing page (EN) | Open / | Hero, nav, features, comparison |
| W2 | Landing page (中文) | Click 中文 toggle | All text translated |
| W3 | Features page | Open /features | Feature list renders |
| W4 | Use Cases page | Open /use-cases | Use case cards render |
| W5 | Blog page | Open /blog | Blog list renders |
| W6 | Contact page | Open /contact | Form renders |
| W7 | Privacy page | Open /privacy | Policy text renders |
| W8 | Login page | Open /login | Email, password, Microsoft, Apple buttons |
| W9 | Register page | Open /register | Registration form |
| W10 | Forgot password page | Open /forgot-password | Email form |
| W11 | Settings page | Open /settings | Profile + Language selector |
| W12 | Help center | Open /help | FAQ content |
| W13 | Join page | Open /join/{token} | Join confirmation |
| W14 | Auth callback | Open /auth/callback?token=... | Redirects to dashboard |
| W15 | 404 page | Open /nonexistent | "Page not found" |
| W16 | Admin dashboard | Open /admin | Stats cards (requires admin) |
| W17 | Admin users | Open /admin → Users | Paginated user list |
| W18 | Admin LLM config | Open /admin → LLM Config | Primary + Backup config |
| W19 | Admin system health | Open /admin → System | 12 service checks |

---

### X. Email Delivery Verification (via Gmail MCP)

| # | Test | Method | Expected |
|---|------|--------|----------|
| X1 | Invite email received | Send invite to xu.tomi3@gmail.com, check Gmail MCP | Email from `noreply@mail.jotoai.com` with "Join Notebook" |
| X2 | Password reset email | `POST /forgot-password` for xu.tomi3@gmail.com | Email with reset link |
| X3 | Email FROM address | Check Gmail header | `Noteflow <noreply@mail.jotoai.com>` |
| X4 | Join URL correct domain | Check join_url in invite | `https://note.jotoai.com/join/{token}` |

**How to verify**: Use `mcp__claude_ai_Gmail__gmail_search_messages` with query `from:noreply@mail.jotoai.com subject:Noteflow`

---

## Known Bugs & Issues

| # | Bug | Severity | Status |
|---|-----|----------|--------|
| BUG-1 | Share modal pops up repeatedly (Puppeteer only) | Low | Not a real bug — Puppeteer 800x600 viewport causes overlapping click targets. Normal browsers unaffected. |
| BUG-2 | `docker compose restart` doesn't pick up env var changes | Medium | Known Docker behavior — always use `docker compose up -d --force-recreate` |
| BUG-3 | iOS Capacitor WebSocket "bad response from server" | High | **Fixed** — added `server.url: 'https://note.jotoai.com'` to capacitor.config.ts |
| BUG-4 | ASR on Xinference returns garbage for quiet audio | Medium | Normalize audio before _has_speech check (fixed). Quality depends on mic volume. |
| BUG-5 | Landing page "Sign Up Free" pointed to noteflow.jotoai.com | High | **Fixed** — changed to relative paths `/login`, `/register` |
| BUG-6 | Admin chat-logs endpoint returns 404 | Low | **Not a bug** — correct route is `/api/admin/logs` not `/api/admin/chat-logs` |
| BUG-7 | Resend email fails with unverified domain | Medium | **Fixed** — FROM changed to `noreply@mail.jotoai.com` |
| BUG-8 | RAGFlow slim has no Web UI | Low | By design — use MySQL to create user/tenant/api_token manually |
| BUG-9 | Health check LLM secondary shows error on first check | Low | **Fixed** — added LLM_BACKUP_API_KEY to docker-compose.override env |
| BUG-10 | Nginx config lost on docker compose recreate | Medium | Volume mount from host — ensure host file is correct. Use `nginx -s reload` after updating. |

---

## JOTO.AI Website Tests (Original)

### 1. Page Load & SSR Tests
Verify every page on every site loads with correct status, title, meta tags, and server-rendered content.

### 2. SEO Tests
Verify robots.txt, sitemap.xml, canonical URLs, OG tags, meta description, and no blocked resources for all sites.

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

### 4. Blog/Article Tests
Test blog listing, article detail pages, search, and category filtering.

### 5. Admin Dashboard Tests
Test login, dashboard stats, site status monitoring, email config, contacts list, and site management.

### 6. Cross-Site Tests
Verify shared backend API, consistent branding, and navigation.

### 7. China Accessibility Tests
Verify no blocked resources (Google Fonts, Analytics, reCAPTCHA, etc.).

---

## Deployment Checklist (New Noteflow Instance)

When deploying to a new server, verify:

- [ ] Docker + Docker Compose installed
- [ ] All 11 containers running (nginx, frontend, landing, backend, postgres, certbot, ragflow-server, ragflow-mysql, ragflow-es, ragflow-redis, minio)
- [ ] SSL cert (Let's Encrypt) obtained + auto-renewal
- [ ] Nginx WebSocket headers in /api/ block
- [ ] RAGFlow API key created (via MySQL: user + user_tenant + tenant + tenant_llm + api_token)
- [ ] LLM API keys in DB (system_settings: qwen_api_key, llm_backup_api_key, llm_vision_api_key)
- [ ] LLM model config: llm_model=glm-4.7, llm_context_window=200000
- [ ] Resend email FROM address set (env: RESEND_FROM=Noteflow <noreply@mail.jotoai.com>)
- [ ] ASR URL with /v1 suffix
- [ ] No hardcoded domain names (landing page uses relative paths)
- [ ] Health check: 12/12 services green

## Known Issues & Gotchas

1. **docker compose restart vs up -d** — `restart` does NOT pick up env var changes. Always use `docker compose up -d --force-recreate`.
2. **Nginx config not updating** — Nginx volume-mounts config from host. After editing, must recreate nginx container.
3. **RAGFlow slim vs full** — Use `latest-slim` for API-only. Full version requires additional nginx config.
4. **RAGFlow tenant setup** — Must create user + user_tenant + tenant + tenant_llm tables manually via MySQL for slim version.
5. **ASR provider env var** — `docker-compose.yml` default was `comparison` (deprecated). Changed to `qwen3-asr`.
6. **Landing page hardcoded URLs** — Changed to relative paths (`/login` not `https://noteflow.jotoai.com/login`).
7. **Share modal popup** — New notebooks show "Invite team members" modal repeatedly. Set localStorage `share_modal_dismissed_{notebook_id}=true` to dismiss.
