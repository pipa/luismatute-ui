import type { APIRoute } from 'astro';

/**
 * SVG kit page styles (Muse, ui#64 fidelity r2), external so CSP style-src stays 'self'.
 * --lm-sky is not a package token yet, so it is scoped to the grid here.
 */
const css = `
.kit-grid{--lm-sky:#cfe6f2;list-style:none;margin:24px 0 0;padding:0;display:grid;gap:20px;grid-template-columns:minmax(0,1fr)}
html[data-mode="night"] .kit-grid{--lm-sky:#2a3266}
@media (min-width:600px){.kit-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media (min-width:1024px){.kit-grid{grid-template-columns:repeat(3,minmax(0,1fr))}}
.kit-grid .kit-card{margin:0;min-width:0;display:flex;flex-direction:column;gap:10px;padding:12px;background:var(--lm-sky);color:var(--lm-docs-ink);border:2px solid transparent;box-shadow:none}
html[data-mode="night"] .kit-grid .kit-card{border-color:#3a4380}
.kit-art{aspect-ratio:4/3;display:grid;place-items:center;overflow:hidden}
.kit-art svg{max-width:85%;max-height:85%;width:auto;height:auto}
.kit-row{display:flex;align-items:center;gap:8px;min-width:0}
.kit-name{margin:0;min-width:0;font-size:1rem;overflow-wrap:anywhere}
.kit-name code{white-space:nowrap;font-size:13px}
.kit-grid .copy{min-width:0}
.kit-grid .copy{flex:none;color:inherit;border-color:currentColor}
.kit-path{margin:0;min-width:0}
.kit-path code{display:block;white-space:normal;overflow-wrap:break-word;word-break:normal;font-size:13px;line-height:1.5;background:transparent;border:0;padding:0;color:inherit}
@media (min-width:1024px){.kit-grid .copy{padding:0 8px}.kit-grid .copy .copy-t{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}}
`;
export const GET: APIRoute = () => new Response(css.trim(), { headers: { 'content-type': 'text/css' } });
