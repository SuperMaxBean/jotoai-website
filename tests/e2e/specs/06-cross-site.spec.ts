import { test, expect } from '@playwright/test';
import { SITES } from '../fixtures/test-data';

test.describe('Cross-Site Verification', () => {

  test('all sites share the same backend API (captcha)', async ({ request }) => {
    const urls = [SITES.audit.url, SITES.sec.url, SITES.kb.url, SITES.fasium.url];
    for (const url of urls) {
      const res = await request.get(`${url}/api/captcha`);
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(data.captchaId).toBeTruthy();
      expect(data.svg).toBeTruthy();
    }
  });

  test('all Next.js sites return proper Content-Type', async ({ request }) => {
    for (const [, site] of Object.entries(SITES)) {
      const res = await request.get(site.url);
      const ct = res.headers()['content-type'] || '';
      expect(ct).toContain('text/html');
    }
  });

  test('all sites use HTTPS', async ({ request }) => {
    for (const [, site] of Object.entries(SITES)) {
      expect(site.url).toMatch(/^https:\/\//);
      const res = await request.get(site.url);
      expect(res.status()).toBe(200);
    }
  });

  test('navigation to contact page works', async ({ request }) => {
    // Verify contact page is accessible on fasium
    const res = await request.get(`${SITES.fasium.url}/contact`);
    expect(res.status()).toBe(200);
    const html = await res.text();
    expect(html).toContain('联系');
  });

  test('wechat QR code images load on all sites', async ({ page }) => {
    const sitesWithQR = [SITES.fasium.url, SITES.sec.url, SITES.kb.url];
    for (const url of sitesWithQR) {
      const res = await page.request.get(`${url}/wechat-qr.png`);
      expect(res.status()).toBe(200);
      const ct = res.headers()['content-type'] || '';
      expect(ct).toMatch(/image/);
    }
  });
});
