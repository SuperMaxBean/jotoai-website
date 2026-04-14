import { test, expect } from '@playwright/test';
import { SITES } from '../fixtures/test-data';

for (const [siteId, site] of Object.entries(SITES)) {
  test.describe(`${site.name} (${siteId}) — Page Load`, () => {
    for (const path of site.pages) {
      test(`${path} loads with 200`, async ({ page }) => {
        const res = await page.goto(`${site.url}${path}`, { waitUntil: 'domcontentloaded' });
        expect(res?.status()).toBe(200);
      });

      test(`${path} has <title>`, async ({ page }) => {
        await page.goto(`${site.url}${path}`, { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        expect(title.length).toBeGreaterThan(3);
      });

      test(`${path} has visible <h1> or <h2>`, async ({ page }) => {
        await page.goto(`${site.url}${path}`, { waitUntil: 'domcontentloaded' });
        const heading = page.locator('h1, h2').first();
        await expect(heading).toBeVisible({ timeout: 5000 });
      });

      test(`${path} has meta description`, async ({ page }) => {
        await page.goto(`${site.url}${path}`, { waitUntil: 'domcontentloaded' });
        const desc = await page.getAttribute('meta[name="description"]', 'content');
        expect(desc).toBeTruthy();
        expect(desc!.length).toBeGreaterThan(10);
      });

      test(`${path} has SSR content (HTML > 5KB)`, async ({ page }) => {
        const res = await page.goto(`${site.url}${path}`, { waitUntil: 'domcontentloaded' });
        const body = await res?.text();
        expect(body!.length).toBeGreaterThan(5000);
      });
    }
  });
}
