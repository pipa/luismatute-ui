import { defineConfig } from 'astro/config';

// Served at https://luismatute.me/ui/ (built into the main site's deploy bundle).
// Every link goes through import.meta.env.BASE_URL; never a root-absolute /foo.
export default defineConfig({
  site: 'https://luismatute.me',
  base: '/ui/',
  trailingSlash: 'always',
  outDir: '../site-dist',
  // Pixel's dev ports are 3100-3109.
  server: { host: '127.0.0.1', port: 3100 },
  // CSP: no inline <style>/<script>, no data: assets.
  build: { inlineStylesheets: 'never', format: 'directory' },
  vite: { build: { assetsInlineLimit: 0 } },
  devToolbar: { enabled: false },
});
