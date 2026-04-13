import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Mock browser globals for SSR
const noop = () => {};
const noopEl = { addEventListener: noop, removeEventListener: noop, dispatchEvent: noop, style: {}, ownerDocument: null };
if (typeof globalThis.localStorage === 'undefined') {
  globalThis.localStorage = { getItem: () => null, setItem: noop, removeItem: noop };
}
if (typeof globalThis.document === 'undefined') {
  globalThis.document = {
    addEventListener: noop, removeEventListener: noop, dispatchEvent: noop,
    documentElement: { ...noopEl, style: {}, offsetWidth: 0, offsetHeight: 0 },
    body: { ...noopEl },
    createElement: () => ({ ...noopEl }),
    createElementNS: () => ({ ...noopEl }),
  };
  noopEl.ownerDocument = globalThis.document;
}
if (typeof globalThis.window === 'undefined') {
  globalThis.window = { ...globalThis, addEventListener: noop, removeEventListener: noop, document: globalThis.document };
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const toAbsolute = (p) => path.resolve(__dirname, p);

const template = fs.readFileSync(toAbsolute('dist/index.html'), 'utf-8');
const { render } = await import('./dist/server/entry-server.js');

// Blog post IDs from blogData.ts
const blogIds = [1, 2, 3, 4, 5, 6, 7, 8];

const routesToPrerender = [
  '/',
  '/features',
  '/architecture',
  '/blog',
  '/contact',
  '/privacy',
  ...blogIds.map(id => `/blog/${id}`),
];

for (const url of routesToPrerender) {
  const { html: appHtml, headTags } = render(url);

  const rendered = template
    .replace('<!--app-head-->', headTags || '')
    .replace('<!--app-html-->', appHtml);

  const filePath = url === '/'
    ? toAbsolute('dist/index.html')
    : toAbsolute(`dist${url}/index.html`);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, rendered);
  console.log(`✓ Prerendered: ${url}`);
}
