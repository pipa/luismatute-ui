// Fails the build on anything the /ui CSP would block: inline <style>,
// inline <script> (no src), or a style= attribute. Usage: node check-csp.mjs <dir>
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

/** Returns human-readable problems found in one HTML string. */
export function cspProblems(html) {
  const problems = [];
  if (/<style[\s>]/i.test(html)) problems.push('inline <style>');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = m[1] ?? '';
    if (!/\ssrc\s*=/.test(attrs) || (m[2] ?? '').trim() !== '')
      problems.push('inline <script>');
  }
  if (/<[a-z][^>]*\sstyle\s*=/i.test(html)) problems.push('style= attribute');
  return problems;
}

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory()
      ? htmlFiles(p)
      : p.endsWith('.html')
        ? [p]
        : [];
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const dir = process.argv[2] ?? 'site-dist';
  const files = htmlFiles(dir);
  const bad = files.flatMap((f) =>
    cspProblems(readFileSync(f, 'utf8')).map((p) => `${f}: ${p}`),
  );
  if (files.length === 0) {
    console.error(`check-csp: no HTML in ${dir}`);
    process.exit(1);
  }
  if (bad.length) {
    console.error(bad.join('\n'));
    process.exit(1);
  }
  console.log(`check-csp: ${files.length} pages clean`);
}
