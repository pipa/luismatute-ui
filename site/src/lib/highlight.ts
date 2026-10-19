import Prism from 'prismjs';

/** Languages the docs show. Astro frontmatter is TS, markup is HTML. */
export type CodeLang = 'html' | 'css' | 'js' | 'ts' | 'astro' | 'sh';

const grammar: Record<Exclude<CodeLang, 'sh'>, string> = {
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
  sh: 'Shell',
};

/**
 * Build-time highlighting. Prism emits class names only (`token keyword`),
 * never style attributes, so the output is CSP-safe.
 */
export function highlight(code: string, lang: CodeLang): string {
  // Shell lines are one command each; plain escaped text reads fine.
  if (lang === 'sh') return escapeHtml(code);
  const g = Prism.languages[grammar[lang]];
  if (!g) throw new Error(`No grammar for ${lang}`);
  return Prism.highlight(code, g, grammar[lang]);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
