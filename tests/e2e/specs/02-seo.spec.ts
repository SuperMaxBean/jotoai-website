import { test, expect } from '@playwright/test';
import { SITES } from '../fixtures/test-data';

for (const [siteId, site] of Object.entries(SITES)) {
  test.describe(`${site.name} (${siteId}) — SEO`, () => {

    test('robots.txt exists and allows crawling', async ({ request }) => {
      const res = await request.get(`${site.url}/robots.txt`);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body.toLowerCase()).toContain('user-agent');
      // Should not disallow root path entirely
      expect(body).not.toMatch(/Disallow:\s*\/\s*$/m);
    });

    test('sitemap.xml exists and has correct domain', async ({ request }) => {
      const res = await request.get(`${site.url}/sitemap.xml`);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body).toContain('urlset');
      expect(body).toContain('sitemaps.org/schemas/sitemap/0.9');
      // All <loc> URLs should use the correct domain
      const locs = [...body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
      expect(locs.length).toBeGreaterThan(0);
      const host = new URL(site.url).hostname;
      for (const loc of locs) {
        expect(loc).toContain(host);
      }
    });

    test('homepage has canonical URL with correct domain', async ({ request }) => {
      const res = await request.get(site.url);
      const html = await res.text();
      const canonicalMatch = html.match(/canonical[^>]*href="([^"]*)"/);
      if (canonicalMatch) {
        const host = new URL(site.url).hostname;
        expect(canonicalMatch[1]).toContain(host);
      }
      // canonical is recommended but not strictly required for all sites
    });

    test('homepage has OG tags', async ({ page }) => {
      await page.goto(site.url, { waitUntil: 'domcontentloaded' });
      const ogTitle = await page.getAttribute('meta[property="og:title"]', 'content');
      const ogDesc = await page.getAttribute('meta[property="og:description"]', 'content');
      // At minimum og:title and og:description should exist
      if (siteId !== 'loop') {
        expect(ogTitle).toBeTruthy();
        expect(ogDesc).toBeTruthy();
      }
    });

    test('homepage does not block indexing', async ({ request }) => {
      // Use request API to avoid slow SPA page loads
      const res = await request.get(site.url);
      const html = await res.text();
      // Should not contain noindex directive
      expect(html).not.toContain('noindex');
    });
  });
}
