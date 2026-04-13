# JOTO.AI Official Websites

Monorepo for all JOTO.AI product websites.

## Sites

| Site | Directory | URL | Tech Stack |
|------|-----------|-----|------------|
| 唯客智审 | `sites/audit` | https://audit.jotoai.com | Next.js + Express backend |
| 闪阅 | `sites/shanyue` | https://shanyue.jotoai.com | Next.js |
| 唯客AI护栏 | `sites/sec` | https://sec.jotoai.com | Next.js + Express backend |
| 唯客知识中台 | `sites/kb` | https://kb.jotoai.com | Next.js |
| FasiumAI | `sites/fasium` | https://fasium.jotoai.com | Next.js |
| Loop | `sites/loop` | https://loop.jotoai.com | FastAPI + Vite |

## Shared Backend

All Next.js sites share a single Express backend (`sites/audit/backend/`) running on port 3004, which provides:
- Contact form API with captcha
- Email notifications via Resend (domain: mail.jotoai.com)
- Blog/article management
- Admin dashboard

## Deployment

Server: Ubuntu 24.04 LTS with Nginx reverse proxy.

```bash
# Install dependencies
cd sites/<site> && npm install

# Build
npm run build

# Start
npm start
```
