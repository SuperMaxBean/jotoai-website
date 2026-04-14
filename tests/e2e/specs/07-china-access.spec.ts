import { test, expect } from '@playwright/test';
import { SITES, BLOCKED_PATTERNS } from '../fixtures/test-data';

for (const [siteId, site] of Object.entries(SITES)) {
  test.describe(`${site.name} (${siteId}) — China Accessibility`, () => {

    test('HTML contains no blocked resources', async ({ request }) => {
      const res = await request.get(site.url);
      const html = await res.text();
      for (const pattern of BLOCKED_PATTERNS) {
        expect(html.toLowerCase()).not.toContain(pattern.toLowerCase());
      }
    });

    test('CSS files contain no blocked font imports', async ({ request }) => {
      const htmlRes = await request.get(site.url);
      const html = await htmlRes.text();
      // Find CSS file references
      const cssFiles = [...html.matchAll(/\/_next\/static\/css\/[^"]+/g)].map(m => m[0]);
      for (const cssPath of cssFiles) {
        const cssRes = await request.get(`${site.url}${cssPath}`);
        const css = await cssRes.text();
        // Should not import from googleapis or gstatic
        expect(css.toLowerCase()).not.toContain('googleapis.com');
        expect(css.toLowerCase()).not.toContain('gstatic.com');
        // fonts.loli.net is OK (Chinese mirror)
      }
    });

    test('page loads without external blocked requests', async ({ page }) => {
      const blockedRequests: string[] = [];
      page.on('request', (req) => {
        const url = req.url().toLowerCase();
        for (const pattern of BLOCKED_PATTERNS) {
          if (url.includes(pattern.toLowerCase())) {
            blockedRequests.push(url);
          }
        }
      });
      await page.goto(site.url, { waitUntil: 'load', timeout: 15000 });
      expect(blockedRequests).toEqual([]);
    });
  });
}
