import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, 'dist');

// Routes to prerender
const routes = ['/', '/contact', '/blog', '/privacy'];

async function prerender() {
  const template = readFileSync(path.resolve(distDir, 'index.html'), 'utf-8');
  const { render } = await import('./dist/server/entry-server.js');

  for (const route of routes) {
    try {
      const { html: appHtml, headTags } = render(route);

      const html = template
        .replace('<!--helmet-tags-->', headTags || '')
        .replace('<!--ssr-outlet-->', appHtml);

      const routeDir = route === '/'
        ? distDir
        : path.resolve(distDir, route.slice(1));

      mkdirSync(routeDir, { recursive: true });
      writeFileSync(path.join(routeDir, 'index.html'), html);
      console.log(`✓ Prerendered: ${route}`);
    } catch (err) {
      console.error(`✗ Failed: ${route}`, err.message);
    }
  }
}

prerender().catch(console.error);
