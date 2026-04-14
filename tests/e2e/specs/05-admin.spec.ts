import { test, expect } from '@playwright/test';
import { ADMIN } from '../fixtures/test-data';

async function login(request: any) {
  const res = await request.post(`${ADMIN.url}/api/admin/login`, {
    data: { email: ADMIN.email, password: ADMIN.password },
  });
  return (await res.json()).token;
}

async function authPage(page: any, token: string) {
  await page.goto(`${ADMIN.url}/admin/dashboard.html`);
  await page.evaluate((t: string) => localStorage.setItem('adminToken', t), token);
  await page.reload({ waitUntil: 'domcontentloaded' });
}

test.describe('Auth', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${ADMIN.url}/admin/login.html`);
    expect(page.url()).toContain('login');
  });

  test('login with valid credentials', async ({ request }) => {
    const res = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).success).toBe(true);
  });

  test('login with wrong password fails', async ({ request }) => {
    const res = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: 'wrong' },
    });
    expect(res.status()).toBe(401);
  });

  test('config requires auth', async ({ request }) => {
    expect((await request.get(`${ADMIN.url}/api/admin/config`)).status()).toBe(401);
  });
});

test.describe('Overview', () => {
  test('dashboard loads with sidebar', async ({ page, request }) => {
    await authPage(page, await login(request));
    await expect(page.locator('h1:has-text("Dashboard")')).toBeVisible({ timeout: 5000 });
  });

  test('site status API', async ({ request }) => {
    const d = await (await request.get(`${ADMIN.url}/api/admin/site-status`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(d.success).toBe(true);
    expect(d.results.length).toBeGreaterThanOrEqual(5);
  });

  test('dashboard stats API', async ({ request }) => {
    const d = await (await request.get(`${ADMIN.url}/api/admin/dashboard`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(Array.isArray(d.sites)).toBe(true);
  });
});

test.describe('Contacts', () => {
  test('contacts API returns array', async ({ request }) => {
    const c = await (await request.get(`${ADMIN.url}/api/admin/contacts`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(Array.isArray(c)).toBe(true);
  });
});

test.describe('Sites', () => {
  test('sites API returns list with required fields', async ({ request }) => {
    const d = await (await request.get(`${ADMIN.url}/api/admin/sites`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(d.sites.length).toBeGreaterThanOrEqual(5);
    for (const s of d.sites) { expect(s.id).toBeTruthy(); expect(s.name).toBeTruthy(); expect(s.url).toBeTruthy(); }
  });
});

test.describe('Admins', () => {
  test('admins API returns list', async ({ request }) => {
    const d = await (await request.get(`${ADMIN.url}/api/admin/admins`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    const admins = d.admins || d;
    expect(Array.isArray(admins)).toBe(true);
    expect(admins.length).toBeGreaterThanOrEqual(1);
  });

  test('wrong current password rejected', async ({ request }) => {
    const d = await (await request.post(`${ADMIN.url}/api/admin/change-password`, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${await login(request)}` },
      data: { currentPassword: 'definitelywrong', newPassword: 'X' },
    })).json();
    expect(d.success).toBeFalsy();
  });
});

test.describe('Email Config', () => {
  test('Resend API key configured', async ({ request }) => {
    const c = await (await request.get(`${ADMIN.url}/api/admin/config`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(c.resendApiKey).toMatch(/^re_/);
  });

  test('sender uses mail.jotoai.com', async ({ request }) => {
    const c = await (await request.get(`${ADMIN.url}/api/admin/config`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(c.emailFrom).toContain('mail.jotoai.com');
  });
});

test.describe('Article Config', () => {
  test('LLM config is set', async ({ request }) => {
    const c = await (await request.get(`${ADMIN.url}/api/admin/config`, { headers: { Authorization: `Bearer ${await login(request)}` } })).json();
    expect(c.llmApiKey).toBeTruthy();
    expect(c.llmModel).toBeTruthy();
  });
});

test.describe('Articles', () => {
  test('can fetch articles per site', async ({ request }) => {
    const token = await login(request);
    const { sites } = await (await request.get(`${ADMIN.url}/api/admin/sites`, { headers: { Authorization: `Bearer ${token}` } })).json();
    for (const s of sites) {
      const r = await request.get(`${ADMIN.url}/api/admin/${s.id}/articles`, { headers: { Authorization: `Bearer ${token}` } });
      expect(r.status()).toBeLessThan(500);
    }
  });
});

test.describe('SSL', () => {
  test('SSL status endpoint responds (not 401)', async ({ request }) => {
    const r = await request.get(`${ADMIN.url}/api/admin/ssl-status`, { headers: { Authorization: `Bearer ${await login(request)}` } });
    expect(r.status()).not.toBe(401);
  });
});

test.describe('All 9 Sidebar Pages Render', () => {
  for (const pg of ['overview', 'contacts', 'articles', 'sites', 'email', 'integrations', 'artconfig', 'admins', 'ssl']) {
    test(`page "${pg}" visible after click`, async ({ page, request }) => {
      await authPage(page, await login(request));
      await page.click(`[data-p="${pg}"]`);
      await expect(page.locator(`#pg-${pg}`)).toBeVisible({ timeout: 3000 });
    });
  }
});
