import Prism from 'prismjs';

/** Languages the docs show. Astro frontmatter is TS, markup is HTML. */
export type CodeLang = 'html' | 'css' | 'js' | 'ts' | 'astro';

const grammar: Record<CodeLang, string> = {
  html: 'markup',
  astro: 'markup',
  css: 'css',
  js: 'javascript',
  ts: 'javascript',
};

export const langLabel: Record<CodeLang, string> = {
  html: 'HTML',
  astro: 'Astro',
  css: 'CSS',
  js: 'JS',
  ts: 'TS',
};

/**
 * Build-time highlighting. Prism emits class names only (`token keyword`),
 * never style attributes, so the output is CSP-safe.
 */
export function highlight(code: string, lang: CodeLang): string {
  const g = Prism.languages[grammar[lang]];
  if (!g) throw new Error(`No grammar for ${lang}`);
  return Prism.highlight(code, g, grammar[lang]);
}
