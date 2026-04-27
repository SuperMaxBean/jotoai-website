# Zengwins 增瀛网络

Enterprise network integration consultancy site for 上海增瀛网络科技有限公司 — production URL: `https://www.zengwins.com`.

Part of the [JOTO.AI monorepo](../../README.md). Read the root `CLAUDE.md` for shared rules (root-cause fixes, browser-test verification, no-emoji brand rule, production-only E2E, etc.).

## Tech stack

- **Vite 6** + **React 19** + **TypeScript** (strict + noUnusedLocals + noUnusedParameters)
- **Tailwind CSS 4** (CSS-first `@theme` tokens in `src/index.css`)
- **motion** for section animations
- **lucide-react** for line icons
- Component split: `src/components/{Navbar,Hero,Services,AboutSection,ProjectCase,GlobalNetwork,Footer}.tsx`
- Brand palette: white surface + brand blue (`#2563eb`) + neutral slate; display font Outfit, body Inter, with PingFang SC / Microsoft YaHei / Noto Sans SC fallback for Chinese
- Sections: navbar · hero · services · about · cases · global · footer (Footer is the `#contact` anchor)

## Local development

```bash
npm install
npm run dev      # http://localhost:3008
```

## Build & preview

```bash
npm run build    # outputs static SPA to dist/
npm start        # vite preview on port 3008
npm run lint     # tsc --noEmit type check
npm run clean    # rm -rf dist
```

## Deploy notes

Static SPA. Serve `dist/` via Nginx with SPA fallback (`try_files $uri $uri/ /index.html`).

Note: `zengwins.com` does not currently hold an ICP filing. If hosting on a mainland China server (e.g. JOTO.AI's `139.224.51.172`), the ICP filing process must complete first or the domain will be blocked. The site footer already omits the ICP line — update `src/components/Footer.tsx` once a filing number is issued.

## Brand & content rules

- No emoji on any user-facing surface (root `CLAUDE.md` rule 5)
- Browser-test every change with Playwright/Puppeteer MCP before declaring done
- E2E tests run against `https://www.zengwins.com`, never `localhost`
- New test scenarios go into `.claude/skills/tomitest/SKILL.md`
