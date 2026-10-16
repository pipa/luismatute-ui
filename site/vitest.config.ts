/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    test: {
      include: ['tests/**/*.test.ts'],
      // Tests read stylesheets with ?raw; keep CSS processing on.
      css: true,
    },
  },
  { root: new URL('./', import.meta.url).pathname, base: '/ui/' },
);
