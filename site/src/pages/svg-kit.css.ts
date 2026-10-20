import type { APIRoute } from 'astro';

/** SVG kit page styles, external so CSP style-src stays 'self'. */
const css = `
.kit-grid{list-style:none;margin:1.5rem 0 0;padding:0;display:grid;gap:1.25rem;grid-template-columns:repeat(auto-fill,minmax(min(100%,16rem),1fr))}
.kit-card{min-width:0;display:flex;flex-direction:column;gap:.5rem;border:1px solid var(--lm-docs-border-hair);border-radius:var(--lm-docs-radius-card);padding:.75rem}
.kit-art{aspect-ratio:4/3;display:grid;place-items:center;border-radius:8px;background:var(--lm-sky-top, #cfe6f5);overflow:hidden}
.kit-art svg{max-width:80%;max-height:80%;width:auto;height:auto}
.kit-name{margin:0;font-size:1rem}
.kit-card .code{margin:0;min-width:0}
.kit-card .code pre{overflow-x:auto;max-width:100%}
.kit-card .code{max-width:100%;overflow:hidden}
`;
export const GET: APIRoute = () => new Response(css.trim(), { headers: { 'content-type': 'text/css' } });
