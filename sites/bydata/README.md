# Bydata 比笛塔

Generative AI implementation consultancy site — production URL: `https://www.bydata.net`.

Part of the [JOTO.AI monorepo](../../README.md). Read the root `CLAUDE.md` for shared rules (root-cause fixes, browser-test verification, no-emoji brand rule, production-only E2E, etc.).

## Tech stack

- **Vite 6** + **React 19** + **TypeScript**
- **Tailwind CSS 4** (CSS-first config in `src/index.css`, no `tailwind.config.ts`)
- **motion** (Framer Motion successor) for section animations
- Single-file app: `src/App.tsx` — CN/EN i18n object inline, sections: nav · hero · about · workflow · services · industries · stories · contact · footer
- Language persistence: URL `?lang=en` query string + `localStorage`, with `<link rel="alternate" hreflang>` in `index.html` for SEO

## Local development

```bash
npm install
npm run dev      # http://localhost:3007
```

Hot module replacement is enabled — edit `src/App.tsx` or `src/index.css` and the browser auto-refreshes.

## Build & preview

```bash
npm run build    # outputs static SPA to dist/
npm start        # vite preview on port 3007 (production-build serve)
npm run lint     # tsc --noEmit type check
npm run clean    # rm -rf dist
```

## Deploy

Static SPA. On the production server, Nginx serves `dist/` directly with SPA fallback:

```nginx
root /path/to/sites/bydata/dist;
location / {
  try_files $uri $uri/ /index.html;
}
```

DNS for `bydata.net` and `www.bydata.net` points to the JOTO.AI host server. Refer to root deploy plan for the full nginx + certbot procedure.

## Brand & content rules

- No emoji on any user-facing surface (root `CLAUDE.md` rule 5)
- Browser-test every change with Playwright/Puppeteer MCP before declaring done
- E2E tests run against `https://www.bydata.net`, never `localhost`
- New test scenarios go into `.claude/skills/tomitest/SKILL.md`
