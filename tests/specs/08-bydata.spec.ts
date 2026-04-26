import { test, expect } from '@playwright/test';
import { ADMIN, SITES } from '../fixtures/test-data';

const BYDATA = SITES.bydata;
const SHARED_API = ADMIN.url;

test.describe('BYDATA — Site-specific surface', () => {
  test('home renders Hero CTA and Contact section', async ({ page }) => {
    await page.goto(BYDATA.url, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /生成式 AI|Generative AI/i })).toBeVisible();
    // ContactForm renders inside #contact section
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact form')).toBeVisible();
    await expect(page.locator('#contact form button[type="submit"]')).toBeVisible();
  });

  test('English variant loads via ?lang=en', async ({ page }) => {
    await page.goto(`${BYDATA.url}/?lang=en`, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /Generative AI/i })).toBeVisible();
  });

  test('shared backend accepts /api/bydata/contact via captcha + payload', async ({ request }) => {
    const captchaRes = await request.get(`${SHARED_API}/api/captcha`);
    expect(captchaRes.status()).toBe(200);
    const captcha = await captchaRes.json();
    const svg = Buffer.from(
      captcha.svg.replace('data:image/svg+xml;base64,', ''),
      'base64',
    ).toString();
    const text = [...svg.matchAll(/<text[^>]*>([^<])<\/text>/g)]
      .map((m) => m[1])
      .join('');

    const submit = await request.post(`${SHARED_API}/api/bydata/contact`, {
      data: {
        name: `E2E-bydata-${Date.now()}`,
        company: 'E2E 自动化',
        email: 'e2e-test@jototech.cn',
        phone: '13800000000',
        message: `bydata e2e ${new Date().toISOString()}`,
        captchaId: captcha.captchaId,
        captcha: text,
      },
    });
    expect(submit.status()).toBe(200);
    const body = await submit.json();
    expect(body.success).toBe(true);
  });

  test('contact endpoint rejects wrong captcha', async ({ request }) => {
    const captchaRes = await request.get(`${SHARED_API}/api/captcha`);
    const captcha = await captchaRes.json();
    const submit = await request.post(`${SHARED_API}/api/bydata/contact`, {
      data: {
        name: 'Test',
        company: '测试公司',
        email: 'test@test.com',
        phone: '123',
        message: 'wrong captcha',
        captchaId: captcha.captchaId,
        captcha: 'XXXX',
      },
    });
    expect(submit.status()).toBe(400);
  });

  test('contact endpoint rejects missing company (required field)', async ({ request }) => {
    const captchaRes = await request.get(`${SHARED_API}/api/captcha`);
    const captcha = await captchaRes.json();
    const svg = Buffer.from(
      captcha.svg.replace('data:image/svg+xml;base64,', ''),
      'base64',
    ).toString();
    const text = [...svg.matchAll(/<text[^>]*>([^<])<\/text>/g)]
      .map((m) => m[1])
      .join('');
    const submit = await request.post(`${SHARED_API}/api/bydata/contact`, {
      data: {
        name: 'Test',
        email: 'test@test.com',
        phone: '123',
        message: 'no company',
        captchaId: captcha.captchaId,
        captcha: text,
      },
    });
    expect(submit.status()).toBe(400);
  });
});
