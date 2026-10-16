/// <reference types="astro/client" />

// Plain tsc has no .astro plugin; the container API types the component.
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const component: AstroComponentFactory;
  export default component;
}
