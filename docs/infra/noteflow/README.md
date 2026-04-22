# Noteflow Landing Deployment Notes

Noteflow (note.jotoai.com) is NOT part of this monorepo. Its source lives
on the production server at `/opt/noteflow/` and is deployed via Docker
Compose. The tree there is **not git-tracked**.

This folder documents changes made to noteflow from this repo's work so
future investigations can correlate commits in this repo with edits on
the noteflow server.

## Server

- **Host**: 124.223.93.11
- **User**: ubuntu (sudo for /opt/noteflow)
- **Project root**: /opt/noteflow/
- **Landing source**: /opt/noteflow/landing/src/
- **Deploy**: `cd /opt/noteflow && sudo docker compose build landing && sudo docker compose up -d landing`
- **Docker Compose services**: nginx + frontend + backend + landing + postgres + certbot

## Related changes made from this repo's work

### 2026-04-17 — Centralized WeChat QR
**This repo's commit**: `f67fda8` (centralized WeChat QR for all 7 JOTO-managed sites)

**Noteflow server edits** (not in git):
- `/opt/noteflow/landing/src/App.tsx:788` — home-page WeChat section:
  - BEFORE: `src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://jotoai.com"` (placeholder generated QR)
  - AFTER:  `src="https://admin.jotoai.com/brand/wechat-qr.png"` (centralized, admin-uploadable)
- `/opt/noteflow/landing/src/pages/Contact.tsx:177` — contact-page WeChat:
  - BEFORE: `src="/wechat-qr.png"` (local static, out of sync with main brand)
  - AFTER:  `src="https://admin.jotoai.com/brand/wechat-qr.png"` (centralized)

**Snapshots**: `landing-App.tsx.snapshot`, `landing-Contact.tsx.snapshot` —
raw files copied from server right after the edit, Apr 17 23:14 CST.
Use `diff <snapshot> /opt/noteflow/landing/src/...` to detect drift.

**Verified**:
- Home page (https://note.jotoai.com/): WeChat QR loads 359×359 from shared URL
- Contact page (https://note.jotoai.com/contact): same

**Deploy steps executed**:
```bash
# 1. Edit source on server
sudo sed -i 's|https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://jotoai.com|https://admin.jotoai.com/brand/wechat-qr.png|g' /opt/noteflow/landing/src/App.tsx
sudo sed -i 's|"/wechat-qr\.png"|"https://admin.jotoai.com/brand/wechat-qr.png"|g' /opt/noteflow/landing/src/pages/Contact.tsx

# 2. Rebuild landing Docker image
cd /opt/noteflow && sudo docker compose build landing

# 3. Recreate container
sudo docker compose up -d landing

# 4. Verify
curl -I https://note.jotoai.com/  # 200 OK, page references admin.jotoai.com/brand/wechat-qr.png
```

### 2026-04-22 — SEO 全套（landing meta + sitemap + blog pre-render）
**This repo's commit**: `18675c6` + `80331ea`（只修了主 monorepo 6 站；noteflow 独立服务器 124.223.93.11，本条仅做记录）

**Noteflow 服务器上的改动（不在 git）：**

1. **`/opt/noteflow/landing/index.html`** — 从 lang=en 只有 `<title>` 的裸页改为完整 SEO head：lang=zh-CN、description、keywords、canonical、og:*、twitter:card
2. **`/opt/noteflow/landing/public/robots.txt`** + **`/opt/noteflow/landing/public/sitemap.xml`** — 新建
3. **nginx locations.inc** 新增 3 条 location：
   - `location = /sitemap.xml { proxy_pass http://landing; }` —— 让 sitemap 走 landing 而非 frontend SPA
   - `location = /robots.txt { proxy_pass http://landing; }`
   - `location ~ ^/blog/(?<article_id>[A-Za-z0-9_-]+)$` —— rewrite 到 `/blog/pre/$1`，serve cleanUrls 匹配 pre-rendered HTML，404 fallback 到 SPA
4. **`/opt/noteflow/landing/dist/serve.json`** (docker exec 写入容器内)：`{"cleanUrls": false, "trailingSlash": false}` 禁止 301 重定向
5. **`/opt/noteflow/gen-sitemap.sh`** — 从 admin API 拉文章生成 sitemap.xml → `docker cp` 到 landing 容器
6. **`/opt/noteflow/gen-blog-pre.sh`** — 从 admin API 拉文章，每篇生成带 JSON-LD/canonical/og:* 的静态 HTML → `docker cp` 到 `/app/dist/blog/pre/`

**sudo crontab：**
```
23 * * * * /opt/noteflow/gen-sitemap.sh >> /var/log/noteflow-sitemap.log 2>&1
29 * * * * /opt/noteflow/gen-blog-pre.sh >> /var/log/noteflow-blog-pre.log 2>&1
```

**Deploy：**
```bash
cd /opt/noteflow
sudo docker compose build landing && sudo docker compose up -d --force-recreate landing
sudo docker compose exec nginx nginx -s reload
```

**Verified（Googlebot UA）：**
- `https://note.jotoai.com/` lang=zh-CN / canonical / og:image ✓
- `https://note.jotoai.com/sitemap.xml` 17 URL (7 静态 + 10 篇文章) ✓
- `https://note.jotoai.com/blog/{id}` 12.7KB SSR，h1=2，JSON-LD=1，canonical ✓
