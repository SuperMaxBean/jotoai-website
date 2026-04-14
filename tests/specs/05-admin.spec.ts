import { test, expect } from '@playwright/test';
import { ADMIN } from '../fixtures/test-data';

test.describe('Admin Dashboard', () => {

  test('login page loads', async ({ page }) => {
    await page.goto(`${ADMIN.url}/admin/login.html`);
    expect(page.url()).toContain('login');
  });

  test('login with valid credentials succeeds', async ({ request }) => {
    const res = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.token).toBeTruthy();
  });

  test('login with wrong password fails', async ({ request }) => {
    const res = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: 'wrongpassword' },
    });
    expect(res.status()).toBe(401);
  });

  test('dashboard loads after login', async ({ page }) => {
    // Login via API
    const res = await page.request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    const { token } = await res.json();

    // Set token and navigate
    await page.goto(`${ADMIN.url}/admin/dashboard.html`);
    await page.evaluate((t) => localStorage.setItem('adminToken', t), token);
    await page.reload({ waitUntil: 'domcontentloaded' });

    // Dashboard should show site management heading
    await expect(page.locator('text=站点管理').or(page.locator('text=SITE MANAGEMENT'))).toBeVisible({ timeout: 5000 });
  });

  test('site status API returns data for all sites', async ({ request }) => {
    const loginRes = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    const { token } = await loginRes.json();

    const statusRes = await request.get(`${ADMIN.url}/api/admin/site-status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(statusRes.status()).toBe(200);
    const data = await statusRes.json();
    expect(data.success).toBe(true);
    expect(data.results.length).toBeGreaterThanOrEqual(5);
  });

  test('contacts API returns data', async ({ request }) => {
    const loginRes = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    const { token } = await loginRes.json();

    const contactsRes = await request.get(`${ADMIN.url}/api/admin/contacts`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(contactsRes.status()).toBe(200);
    const contacts = await contactsRes.json();
    expect(Array.isArray(contacts)).toBe(true);
  });

  test('config API requires authentication', async ({ request }) => {
    const res = await request.get(`${ADMIN.url}/api/admin/config`);
    expect(res.status()).toBe(401);
  });

  test('dashboard API returns stats', async ({ request }) => {
    const loginRes = await request.post(`${ADMIN.url}/api/admin/login`, {
      data: { email: ADMIN.email, password: ADMIN.password },
    });
    const { token } = await loginRes.json();

    const res = await request.get(`${ADMIN.url}/api/admin/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.sites).toBeTruthy();
    expect(Array.isArray(data.sites)).toBe(true);
  });
});
