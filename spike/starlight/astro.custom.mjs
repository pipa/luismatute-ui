import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./custom-site/', import.meta.url));

export default defineConfig({
  site: 'https://luismatute.me',
  base: '/ui',
  root,
  srcDir: fileURLToPath(new URL('./custom-site/src/', import.meta.url)),
  publicDir: fileURLToPath(new URL('./custom-site/public/', import.meta.url)),
  outDir: fileURLToPath(new URL('./dist-custom/', import.meta.url)),
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
});
