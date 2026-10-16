/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config';

export default getViteConfig(
  {
    test: {
      include: ['tests/**/*.test.ts'],
    },
  },
  { root: new URL('./', import.meta.url).pathname, base: '/ui/' },
);
