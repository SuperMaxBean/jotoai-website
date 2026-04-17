# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Core Principles

1. **Fix from the root, not workarounds.** Every bug fix and new feature must address the root cause with a universal solution. Do NOT apply temporary patches, hacks, or workarounds — they will be rejected and redone. If the fix only works for one case but breaks or doesn't cover others, it's not a real fix.

2. **Browser-test everything after changes.** After any new feature or bug fix, you MUST open a browser (Playwright or Puppeteer MCP) and verify the result visually, simulating real user operations. If one browser MCP is unavailable (crashed, stuck PID, GPU error), automatically switch to the other MCP — do NOT stop and report the browser is broken. Never verify only via curl/API — that misses rendering bugs, JS errors, and UX issues.

3. **All tests go into tomitest.** Any new test scenario discovered during development or testing must be added to the tomitest skill at `.claude/skills/tomitest/SKILL.md`. This keeps the test suite growing and ensures nothing is forgotten in future sessions.

4. **Test against production URLs, not localhost.** E2E verification uses `https://<site>.jotoai.com`, never `localhost`. Localhost hits different API routes, skips nginx/CORS/SSL, and misses real deployment bugs. See tomitest rule 3.

## Browser MCP Fallback Order

1. Try `mcp__playwright__browser_navigate` first
2. If Playwright fails (closed, stuck PID, GPU error), switch to `mcp__puppeteer__puppeteer_navigate`
3. If both fail, kill all Chrome processes (`pkill -9 -f Chrome`), clear singleton locks, and retry
4. Only if all attempts fail, report the issue to the user

## Architecture

This is a **monorepo of six product sites** sharing one backend. Each site under `sites/` is a standalone app with its own `package.json` (or `requirements.txt` for Loop). There is no root-level build — you operate per site.

**Shared Express backend.** All five Next.js sites (audit, shanyue, sec, kb, fasium) talk to a single Express server at `sites/audit/backend/index.js` (port **3004**, served at `https://admin.jotoai.com`). It provides contact-form + captcha, Resend email (domain `mail.jotoai.com`), blog/article generation (`article-generator.js`, `article-rewriter.js`, `article-search.js`, Unsplash fetchers), and admin dashboard APIs. When editing "the backend," this is the one — do not confuse it with the per-site Next.js API routes.

**Loop is the exception.** `sites/loop/backend/` is a FastAPI/Python service (uvicorn on port 8000) with its own agent, browser automation, auth, and DB layer. `sites/loop/landing/` is a plain static `index.html` + assets, not a build step. Loop does **not** use the shared Express backend.

**Site port layout** (authoritative copy in `.claude/skills/tomitest/SKILL.md`):
`audit` 3001 · `shanyue` 3002 · `sec` 3003 · `admin backend` 3004 · `fasium` 3005 · `kb` 3006 · `loop` 8000.
Many "site shows wrong content" bugs trace to nginx proxying the wrong port — check `/etc/nginx/sites-enabled/<site>.jotoai.com` first.

**Servers.**
- `139.224.51.172` hosts all `*.jotoai.com` sites + admin backend.
- `124.223.93.11` hosts `note.jotoai.com` (Noteflow — separate product, referenced from SITES but deployed independently).

## Common Commands

Each Next.js site (`audit/frontend`, `shanyue`, `sec`, `kb`, `fasium`) uses the same script names. From `sites/<site>/` (or `sites/audit/frontend/` for audit):

```bash
npm install
npm run dev      # dev server (site-specific port — see package.json)
npm run build    # next build
npm start        # production start
npm run lint     # next lint
```

**Shared Express backend** — from `sites/audit/backend/`:
```bash
npm install
npm run dev      # nodemon index.js
npm start        # node index.js  (port 3004)
```

**Loop backend** — from `sites/loop/backend/`:
```bash
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

**E2E tests** — from `tests/`:
```bash
npm install
npm test                              # run all specs (Playwright, baseURL=https://audit.jotoai.com)
npm run test:headed                   # headed mode
npm run test:ui                       # Playwright UI
npx playwright test specs/<file>      # single spec
npx playwright test -g "<title>"      # single test by title
npm run report                        # open HTML report
```

The `tests/` suite runs against production (`baseURL` is set in `playwright.config.ts`). Scenario coverage is tracked in `.claude/skills/tomitest/SKILL.md` — new scenarios belong there, not as ad-hoc scripts.
