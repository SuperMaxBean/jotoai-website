import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function createServer() {
  const app = express();

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  app.use('*', async (req, res) => {
    const template = fs.readFileSync(
      path.resolve(__dirname, 'index.html'), 'utf-8'
    );
    res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
  });

  app.listen(3000, '0.0.0.0', () => {
    console.log('Server running at http://localhost:3000');
  });
}

createServer();
