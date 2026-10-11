import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2];
const out = process.argv[3];
if (!root) {
  console.error('usage: node scripts/scan-inline.mjs <dist-dir> [results.json]');
  process.exit(1);
}

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else if (name.endsWith('.html')) acc.push(path);
  }
  return acc;
}

function lineOf(source, index) {
  return source.slice(0, index).split('\n').length;
}

function excerpt(text, max = 180) {
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max)}…` : flat;
}

const files = walk(root);
const findings = [];

for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const rel = relative(root, file);

  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    const hasSrc = /\bsrc\s*=/.test(attrs);
    if (hasSrc && body.trim() === '') continue;
    const type = attrs.match(/\btype\s*=\s*["']([^"']+)["']/i)?.[1] ?? '';
    findings.push({
      file: rel,
      kind: 'inline-script',
      line: lineOf(html, match.index ?? 0),
      type: type || '(classic)',
      hasSrc,
      ariaHidden: /\baria-hidden\s*=/.test(attrs),
      bytes: Buffer.byteLength(body),
      excerpt: excerpt(body),
    });
  }

  for (const match of html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)) {
    const attrs = match[1] ?? '';
    const body = match[2] ?? '';
    findings.push({
      file: rel,
      kind: 'style-block',
      line: lineOf(html, match.index ?? 0),
      bytes: Buffer.byteLength(body),
      excerpt: excerpt(body),
    });
  }

  for (const match of html.matchAll(/\sstyle\s*=\s*("([^"]*)"|'([^']*)')/gi)) {
    const value = match[2] ?? match[3] ?? '';
    findings.push({
      file: rel,
      kind: 'style-attribute',
      line: lineOf(html, match.index ?? 0),
      excerpt: value,
    });
  }
}

const summary = {
  root,
  htmlFiles: files.length,
  inlineScripts: findings.filter((item) => item.kind === 'inline-script').length,
  styleBlocks: findings.filter((item) => item.kind === 'style-block').length,
  styleAttributes: findings.filter((item) => item.kind === 'style-attribute').length,
  findings,
};

if (out) {
  mkdirSync(join(out, '..'), { recursive: true });
  writeFileSync(out, JSON.stringify(summary, null, 2));
}

console.log(JSON.stringify({
  root: summary.root,
  htmlFiles: summary.htmlFiles,
  inlineScripts: summary.inlineScripts,
  styleBlocks: summary.styleBlocks,
  styleAttributes: summary.styleAttributes,
}, null, 2));

for (const item of findings) {
  console.log(`\n[${item.kind}] ${item.file}:${item.line}`);
  console.log(item.excerpt);
}
