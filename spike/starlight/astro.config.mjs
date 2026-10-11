import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const variant = process.env.SPIKE_VARIANT ?? 'stock';
const externalise = variant === 'external';

/** @type {import('@astrojs/starlight').StarlightUserConfig['components']} */
const externalComponents = {
  ThemeProvider: './src/components/ThemeProvider.astro',
  ThemeSelect: './src/components/ThemeSelect.astro',
};

export default defineConfig({
  site: 'https://luismatute.me',
  base: '/ui',
  outDir: `./dist-${variant}`,
  build: {
    inlineStylesheets: externalise ? 'never' : 'auto',
  },
  vite: {
    build: {
      assetsInlineLimit: externalise ? 0 : 4096,
    },
  },
  security:
    variant === 'csp'
      ? {
          csp: {
            scriptDirective: {
              resources: ["'self'", "'wasm-unsafe-eval'"],
            },
            styleDirective: {
              resources: ["'self'"],
            },
          },
        }
      : undefined,
  integrations: [
    starlight({
      title: 'CSP spike',
      description: 'Minimal Starlight site for the inline-script CSP investigation.',
      pagefind: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      expressiveCode: true,
      components: externalise ? externalComponents : {},
    }),
  ],
});
