import { createHash } from 'node:crypto';
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? 'dist-external';
const patchPagefind = process.argv.includes('--patch-pagefind');
const base = '/ui';

function walk(dir, acc = []) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, acc);
    else acc.push(path);
  }
  return acc;
}

function hash(text) {
  return createHash('sha256').update(text).digest('hex').slice(0, 10);
}

const scriptFiles = new Map();
const styleClasses = new Map();

function classFor(decl) {
  let name = styleClasses.get(decl);
  if (!name) {
    name = `csp-${hash(decl)}`;
    styleClasses.set(decl, name);
  }
  return name;
}

function extractScripts(html) {
  return html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (full, attrs, body) => {
    if (/\bsrc\s*=/.test(attrs)) return full;
    let code = body;
    if (code.includes('shortcut.style.display')) {
      code = code.replace(/shortcut\.style\.display\s*=\s*['"]{2}\s*;/, 'shortcut.hidden = false;');
    }
    const isModule = /\btype\s*=\s*["']module["']/i.test(attrs);
    const name = `${hash(code)}.js`;
    scriptFiles.set(name, code.trim());
    const typeAttr = isModule ? ' type="module"' : '';
    return `<script${typeAttr} src="${base}/_astro/csp/${name}"></script>`;
  });
}

function hideSearchShortcut(html) {
  return html.replace(' style="display: none;"', ' hidden');
}

function externaliseStyleAttributes(html) {
  return html.replace(/<([A-Za-z][\w:-]*)([^>]*?)>/g, (full, tag, attrs) => {
    const style = attrs.match(/\sstyle\s*=\s*"([^"]*)"/);
    if (!style) return full;
    const name = classFor(style[1]);
    let next = attrs.replace(style[0], '');
    if (/\sclass\s*=\s*"/.test(next)) {
      next = next.replace(/\sclass\s*=\s*"([^"]*)"/, (_match, value) => ` class="${value} ${name}"`);
    } else {
      next += ` class="${name}"`;
    }
    return `<${tag}${next}>`;
  });
}

const styleBlocks = new Map();

function extractStyleBlocks(html) {
  return html.replace(/<style\b[^>]*>([\s\S]*?)<\/style>/gi, (_full, body) => {
    const name = `${hash(body)}.css`;
    styleBlocks.set(name, body);
    return `<link rel="stylesheet" href="${base}/_astro/csp/${name}">`;
  });
}

function addStylesheet(html, href) {
  if (html.includes(href)) return html;
  return html.replace('</head>', `<link rel="stylesheet" href="${href}"></head>`);
}

const htmlFiles = walk(root).filter((file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  let html = readFileSync(file, 'utf8');
  html = hideSearchShortcut(html);
  html = extractScripts(html);
  html = extractStyleBlocks(html);
  html = externaliseStyleAttributes(html);
  if (styleClasses.size > 0) {
    html = addStylesheet(html, `${base}/_astro/csp/inline.css`);
  }
  writeFileSync(file, html);
}

const assetDir = join(root, '_astro/csp');
mkdirSync(assetDir, { recursive: true });
for (const [name, code] of scriptFiles) writeFileSync(join(assetDir, name), code);
for (const [name, code] of styleBlocks) writeFileSync(join(assetDir, name), code);
if (styleClasses.size > 0) {
  const css = [...styleClasses.entries()]
    .map(([decl, name]) => `.${name}{${decl.endsWith(';') ? decl : `${decl};`}}`)
    .join('\n');
  writeFileSync(join(assetDir, 'inline.css'), css);
}

let pagefindPatches = 0;
if (patchPagefind) {
  for (const file of walk(root).filter((path) => path.endsWith('.js'))) {
    const js = readFileSync(file, 'utf8');
    if (!js.includes('.style.paddingRight')) continue;
    const next = js.replace(/\.style\.paddingRight=`\$\{Q\+2\}px`/g, '.dataset.cspPad=`${Q+2}`');
    if (next !== js) {
      writeFileSync(file, next);
      pagefindPatches += 1;
      console.log(`patched ${relative(root, file)}`);
    }
  }
}

console.log(
  JSON.stringify(
    {
      htmlFiles: htmlFiles.length,
      scripts: scriptFiles.size,
      styleClasses: styleClasses.size,
      styleBlocks: styleBlocks.size,
      pagefindPatches,
    },
    null,
    2,
  ),
);
