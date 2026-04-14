import { test, expect } from '@playwright/test';
import { SITES } from '../fixtures/test-data';

const CONTACT_CONFIGS = [
  { siteId: 'fasium', url: SITES.fasium.url, path: '/contact' },
  { siteId: 'audit',  url: SITES.audit.url,  path: '/contact' },
  { siteId: 'sec',    url: SITES.sec.url,    path: '/contact' },
  { siteId: 'kb',     url: SITES.kb.url,     path: '/' }, // kb contact is on landing page
];

for (const cfg of CONTACT_CONFIGS) {
  test.describe(`${cfg.siteId} — Contact Form`, () => {

    test('captcha API returns valid data', async ({ request }) => {
      const res = await request.get(`${cfg.url}/api/captcha`);
      expect(res.status()).toBe(200);
      const data = await res.json();
      expect(data.captchaId).toBeTruthy();
      expect(data.svg).toContain('data:image/svg+xml;base64,');
    });

    test('captcha SVG contains readable text', async ({ request }) => {
      const res = await request.get(`${cfg.url}/api/captcha`);
      const data = await res.json();
      const svg = Buffer.from(data.svg.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
      const chars = [...svg.matchAll(/<text[^>]*>([^<])<\/text>/g)].map(m => m[1]);
      expect(chars.length).toBe(4); // 4-character captcha
    });

    test('form submission with correct captcha succeeds', async ({ request }) => {
      // Get captcha
      const captchaRes = await request.get(`${cfg.url}/api/captcha`);
      const captcha = await captchaRes.json();
      const svg = Buffer.from(captcha.svg.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
      const text = [...svg.matchAll(/<text[^>]*>([^<])<\/text>/g)].map(m => m[1]).join('');

      // Submit form
      const submitRes = await request.post(`${cfg.url}/api/contact`, {
        data: {
          name: `E2E测试-${cfg.siteId}`,
          company: 'E2E自动化测试',
          email: 'e2e-test@jototech.cn',
          phone: '13800000000',
          message: `自动化测试 ${new Date().toISOString()}`,
          captchaId: captcha.captchaId,
          captchaText: text,
        },
      });
      expect(submitRes.status()).toBe(200);
      const result = await submitRes.json();
      expect(result.success).toBe(true);
    });

    test('form submission with wrong captcha fails', async ({ request }) => {
      const captchaRes = await request.get(`${cfg.url}/api/captcha`);
      const captcha = await captchaRes.json();

      const submitRes = await request.post(`${cfg.url}/api/contact`, {
        data: {
          name: 'Test', email: 'test@test.com', phone: '123',
          message: 'wrong captcha test',
          captchaId: captcha.captchaId,
          captchaText: 'XXXX', // Wrong
        },
      });
      expect(submitRes.status()).toBe(400);
    });

    test('form submission without captcha fails', async ({ request }) => {
      const submitRes = await request.post(`${cfg.url}/api/contact`, {
        data: { name: 'Test', email: 'test@test.com', phone: '123', message: 'no captcha' },
      });
      expect(submitRes.status()).toBe(400);
    });
  });
}
