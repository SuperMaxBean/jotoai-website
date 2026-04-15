# CLAUDE.md — JOTO.AI Website Project

## Core Principles

1. **Fix from the root, not workarounds.** Every bug fix and new feature must address the root cause with a universal solution. Do NOT apply temporary patches, hacks, or workarounds — they will be rejected and redone. If the fix only works for one case but breaks or doesn't cover others, it's not a real fix.

2. **Browser-test everything after changes.** After any new feature or bug fix, you MUST open a browser (Playwright or Puppeteer MCP) and verify the result visually, simulating real user operations. If one browser MCP is unavailable (crashed, stuck PID, GPU error), automatically switch to the other MCP — do NOT stop and report the browser is broken. Never verify only via curl/API — that misses rendering bugs, JS errors, and UX issues.

3. **All tests go into tomitest.** Any new test scenario discovered during development or testing must be added to the tomitest skill (project-level: `.claude/skills/tomitest/SKILL.md` in this repo). This keeps the test suite growing and ensures nothing is forgotten in future sessions.

## Browser MCP Fallback Order

1. Try `mcp__playwright__browser_navigate` first
2. If Playwright fails (closed, stuck PID, GPU error), switch to `mcp__puppeteer__puppeteer_navigate`
3. If both fail, kill all Chrome processes (`pkill -9 -f Chrome`), clear singleton locks, and retry
4. Only if all attempts fail, report the issue to the user

## Project Structure

- `sites/` — Individual site source code (audit, shanyue, sec, kb, fasium, loop)
- `sites/audit/backend/` — Shared admin backend (port 3004)
- `.claude/skills/tomitest/` — E2E test suite
- Server: 139.224.51.172 (all *.jotoai.com sites)
- Noteflow server: 124.223.93.11 (note.jotoai.com)
