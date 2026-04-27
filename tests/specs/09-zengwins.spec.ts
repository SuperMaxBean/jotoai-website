import { test, expect } from '@playwright/test';
import { ADMIN, SITES } from '../fixtures/test-data';

const ZENGWINS = SITES.zengwins;
const SHARED_API = ADMIN.url;

test.describe('Zengwins — Site-specific surface', () => {
  test('home renders Hero, Services, ContactCTA form', async ({ page }) => {
    await page.goto(ZENGWINS.url, { waitUntil: 'domcontentloaded' });
    await expect(page.getByRole('heading', { name: /赋能企业|Network/i })).toBeVisible();
    // Services section
    await page.locator('#services').scrollIntoViewIfNeeded();
    await expect(page.locator('#services')).toBeVisible();
    // Coverage / global section with regional cards
    await page.locator('#global').scrollIntoViewIfNeeded();
    await expect(page.locator('#global')).toBeVisible();
    // Contact form
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact form')).toBeVisible();
  });

  test('credentials section shows ISO 9001 / ISO 27001 / CMMI / 厂商授权', async ({ page }) => {
    await page.goto(ZENGWINS.url, { waitUntil: 'domcontentloaded' });
    await page.locator('#about').scrollIntoViewIfNeeded();
    await expect(page.getByText('ISO 9001')).toBeVisible();
    await expect(page.getByText('ISO 27001')).toBeVisible();
    await expect(page.getByText('CMMI')).toBeVisible();
    await expect(page.getByText('厂商授权')).toBeVisible();
  });

  test('phone/email anchors point to real values (not placeholders)', async ({ page }) => {
    await page.goto(ZENGWINS.url, { waitUntil: 'domcontentloaded' });
    const telLink = page.locator('a[href="tel:13681624613"]').first();
    await expect(telLink).toBeVisible();
    const mailLink = page.locator('a[href="mailto:sales@zengwins.com"]').first();
    await expect(mailLink).toBeVisible();
    // Should NOT contain old placeholder
    const html = await page.content();
    expect(html).not.toContain('400-XXX-XXXX');
    expect(html).not.toContain('400-888-XXXX');
    expect(html).not.toContain('沪 ICP 备 XXXXXXXX');
    expect(html).not.toContain('普陀区某商务中心');
  });

  test('shared backend accepts /api/zengwins/contact via captcha + payload', async ({ request }) => {
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

    const submit = await request.post(`${SHARED_API}/api/zengwins/contact`, {
      data: {
        name: `E2E-zengwins-${Date.now()}`,
        company: 'E2E 自动化',
        email: 'e2e-test@jototech.cn',
        phone: '13800000000',
        message: `zengwins e2e ${new Date().toISOString()}`,
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
    const submit = await request.post(`${SHARED_API}/api/zengwins/contact`, {
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
});
