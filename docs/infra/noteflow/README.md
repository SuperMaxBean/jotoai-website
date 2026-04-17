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
