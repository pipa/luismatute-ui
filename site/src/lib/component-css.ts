/**
 * Pulls the component rules for the live demos out of the package's
 * dist/base.css. base.css also resets html/body/buttons globally, which would
 * fight the docs shell, so only rules that target the demoed elements are kept.
 */
import base from '../../../dist/base.css?raw';

export const DEMO_MATCH = /lm-(card|chip|more|pause)\b|\.lm-(kicker|chips)\b/;

interface Block {
  prelude: string;
  body: string;
}

/** Split a stylesheet into top-level `prelude { body }` blocks (comments removed). */
export function blocks(source: string): Block[] {
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  const out: Block[] = [];
  let depth = 0;
  let start = 0;
  let open = -1;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') {
      if (depth === 0) open = i;
      depth++;
    } else if (ch === '}') {
      depth--;
      if (depth === 0) {
        out.push({
          prelude: css.slice(start, open).trim(),
          body: css.slice(open + 1, i),
        });
        start = i + 1;
      }
    }
  }
  return out;
}

export function demoCss(
  source: string = base,
  match: RegExp = DEMO_MATCH,
): string {
  const parts: string[] = [];
  for (const b of blocks(source)) {
    if (b.prelude.startsWith('@media') || b.prelude.startsWith('@supports')) {
      const inner = demoCss(b.body, match);
      if (inner.trim()) parts.push(`${b.prelude} {\n${inner}}`);
    } else if (!b.prelude.startsWith('@') && match.test(b.prelude)) {
      parts.push(`${b.prelude} {${b.body}}`);
    }
  }
  return `${parts.join('\n')}\n`;
}
