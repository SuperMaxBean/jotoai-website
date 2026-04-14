import { test, expect } from '@playwright/test';
import { SITES, ADMIN } from '../fixtures/test-data';

/**
 * Email notification tests.
 *
 * These tests submit contact forms on each site and verify that
 * notification emails are delivered to xu.tomi3@gmail.com via Resend.
 *
 * The email recipient is temporarily switched to xu.tomi3@gmail.com
 * for testing, then restored after each test.
 *
 * After running these Playwright tests, use Gmail MCP to verify delivery:
 *   mcp__claude_ai_Gmail__gmail_search_messages({
 *     q: 'from:noreply@mail.jotoai.com subject:联系表单 newer_than:10m'
 *   })
 */

const TEST_EMAIL = 'xu.tomi3@gmail.com';
const API_BASE = 'https://admin.jotoai.com';

// Helper: login and get token
async function getAdminToken(request: any): Promise<string> {
  const res = await request.post(`${API_BASE}/api/admin/login`, {
    data: { email: ADMIN.email, password: ADMIN.password },
  });
  const { token } = await res.json();
  return token;
}

// Helper: update email recipient in config
async function setEmailRecipient(request: any, token: string, email: string) {
  await request.post(`${API_BASE}/api/admin/config`, {
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    data: { email },
  });
}

// Helper: get captcha text from SVG
function decodeCaptcha(captchaData: { captchaId: string; svg: string }) {
  const svg = Buffer.from(captchaData.svg.replace('data:image/svg+xml;base64,', ''), 'base64').toString();
  return [...svg.matchAll(/<text[^>]*>([^<])<\/text>/g)].map(m => m[1]).join('');
}

test.describe('Email Notification Tests', () => {
  let token: string;
  let originalEmail: string;

  test.beforeAll(async ({ request }) => {
    token = await getAdminToken(request);
    // Save current email recipient
    const configRes = await request.get(`${API_BASE}/api/admin/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const config = await configRes.json();
    originalEmail = config.email || '';
    // Switch to test email
    await setEmailRecipient(request, token, TEST_EMAIL);
  });

  test.afterAll(async ({ request }) => {
    // Restore original email recipient
    if (originalEmail) {
      const t = await getAdminToken(request);
      await setEmailRecipient(request, t, originalEmail);
    }
  });

  // Test email delivery from each site with contact form
  const contactSites = [
    { name: 'FasiumAI', url: SITES.fasium.url },
    { name: '唯客智审', url: SITES.audit.url },
    { name: '唯客AI护栏', url: SITES.sec.url },
    { name: '唯客知识中台', url: SITES.kb.url },
  ];

  for (const site of contactSites) {
    test(`${site.name}: contact form triggers email to ${TEST_EMAIL}`, async ({ request }) => {
      // Get captcha
      const captchaRes = await request.get(`${site.url}/api/captcha`);
      const captcha = await captchaRes.json();
      const captchaText = decodeCaptcha(captcha);

      // Submit contact form
      const submitRes = await request.post(`${site.url}/api/contact`, {
        data: {
          name: `邮件测试-${site.name}`,
          company: '自动化邮件测试',
          email: TEST_EMAIL,
          phone: '13800000000',
          message: `E2E邮件测试 from ${site.name} at ${new Date().toISOString()}`,
          captchaId: captcha.captchaId,
          captchaText,
        },
      });

      expect(submitRes.status()).toBe(200);
      const result = await submitRes.json();
      expect(result.success).toBe(true);
    });
  }

  test('admin test email sends successfully', async ({ request }) => {
    const res = await request.post(`${API_BASE}/api/admin/test-email`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      data: { testEmail: TEST_EMAIL },
    });
    expect(res.status()).toBe(200);
    const result = await res.json();
    expect(result.success).toBe(true);
  });

  test('Resend API key is configured', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/admin/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const config = await res.json();
    expect(config.resendApiKey).toBeTruthy();
    expect(config.resendApiKey).toMatch(/^re_/);
  });

  test('email sender domain is mail.jotoai.com', async ({ request }) => {
    const res = await request.get(`${API_BASE}/api/admin/config`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const config = await res.json();
    expect(config.emailFrom).toContain('mail.jotoai.com');
  });
});

/**
 * === Gmail MCP Verification (run manually after tests) ===
 *
 * After running `npx playwright test specs/08-email.spec.ts`, verify
 * email delivery using Gmail MCP:
 *
 * 1. Search for received emails:
 *    mcp__claude_ai_Gmail__gmail_search_messages({
 *      q: 'from:noreply@mail.jotoai.com newer_than:10m',
 *      maxResults: 10
 *    })
 *
 * 2. Expected results (4 contact form + 1 test email = 5 emails):
 *    - [FasiumAI] 新的联系表单
 *    - [唯客智审] 新的联系表单
 *    - [唯客 AI 护栏] 新的联系表单
 *    - [唯客知识中台] 新的联系表单
 *    - SMTP测试邮件 (or similar test email subject)
 *
 * 3. Each email should:
 *    - From: noreply@mail.jotoai.com
 *    - To: xu.tomi3@gmail.com
 *    - Subject contains site name in brackets [站点名]
 *    - Body contains: 来源站点, 姓名, 邮箱, 电话
 */
