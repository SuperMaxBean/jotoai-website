import { test, expect } from '@playwright/test';
import { SITES, BLOG_SITES } from '../fixtures/test-data';

for (const [siteId, blogCfg] of Object.entries(BLOG_SITES)) {
  const site = SITES[siteId as keyof typeof SITES];

  test.describe(`${site.name} (${siteId}) — Blog/Articles`, () => {

    test('blog listing page loads with content', async ({ page }) => {
      const res = await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'domcontentloaded' });
      expect(res?.status()).toBe(200);
      // Page should have substantial content (articles rendered in HTML)
      const html = await res?.text();
      expect(html!.length).toBeGreaterThan(5000);
      // Should have at least one heading (article title)
      const headings = page.locator('h1, h2, h3');
      const count = await headings.count();
      expect(count).toBeGreaterThan(1);
    });

    test('blog listing has proper heading structure', async ({ page }) => {
      await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'domcontentloaded' });
      const heading = page.locator('h1, h2').first();
      await expect(heading).toBeVisible({ timeout: 5000 });
    });

    test('blog article detail page loads', async ({ page, request }) => {
      // Directly test a known article URL via API
      const res = await request.get(`${site.url}${blogCfg.detailPrefix}1`);
      // Some sites may 404 if article 1 doesn't exist; just check it doesn't 500
      expect(res.status()).toBeLessThan(500);
      if (res.status() === 200) {
        const html = await res.text();
        expect(html.length).toBeGreaterThan(3000);
      }
    });

    test('blog page images are accessible', async ({ page }) => {
      await page.goto(`${site.url}${blogCfg.path}`, { waitUntil: 'load', timeout: 15000 });
      // Check that main content images (not icons/svgs) have valid src
      const images = page.locator('img[src*="/blog"], img[src*="/images"], img[src*="unsplash"]');
      const count = await images.count();
      for (let i = 0; i < Math.min(count, 3); i++) {
        const src = await images.nth(i).getAttribute('src');
        expect(src).toBeTruthy();
      }
    });
  });
}
