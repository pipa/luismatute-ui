import type { APIRoute } from 'astro';
import { demoCss } from '../lib/component-css';
import { nightTokens, rootTokens } from '../lib/tokens';

/**
 * Component chrome for the live demos, plus per-frame themes, as an external
 * stylesheet (CSP). A frame with data-theme gets that theme's token values,
 * so its Day/Night toggle flips only that frame.
 */
export function frameThemes(): string {
  const names = new Set(nightTokens.map((t) => t.name));
  // Aliases like --lm-accent-ink: var(--lm-tomato-d) resolve where they are
  // declared, so redeclare them on the frame to pick up the frame's theme.
  const aliases = rootTokens.filter(
    (t) => t.value.includes('var(') && !names.has(t.name),
  );
  const day = [...rootTokens.filter((t) => names.has(t.name)), ...aliases];
  const night = [...nightTokens, ...aliases];
  const decl = (ts: { name: string; value: string }[]) =>
    ts.map((t) => `  ${t.name}: ${t.value};`).join('\n');
  return `.demo-frame[data-theme="day"] {\n${decl(day)}\n}\n.demo-frame[data-theme="night"] {\n${decl(night)}\n}\n`;
}

export const GET: APIRoute = () =>
  new Response(`${frameThemes()}${demoCss()}`, {
    headers: { 'content-type': 'text/css' },
  });
