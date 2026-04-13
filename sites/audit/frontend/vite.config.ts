import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, loadEnv} from 'vite';

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  const isSsr = process.env.BUILD_SSR === 'true';
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || ''),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    ...(isSsr ? {
      build: {
        ssr: true,
        rollupOptions: {
          input: './src/entry-server.tsx',
          output: { dir: 'dist/server', format: 'es' },
        },
      },
    } : {}),
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      proxy: {
        '/api': {
          target: 'https://audit.jotoai.com',
          changeOrigin: true,
          secure: true,
        }
      }
    },
  };
});
