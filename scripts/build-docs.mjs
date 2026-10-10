import { cpSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
const docs = resolve(root, 'docs');
const out = resolve(root, 'docs-dist');

if (!statSync(resolve(dist, 'index.js'), { throwIfNoEntry: false })) {
  throw new Error('dist/ is missing. Run pnpm build first.');
}

rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
cpSync(docs, out, { recursive: true });
cpSync(dist, resolve(out, 'ui'), { recursive: true });
console.log('built docs-dist/');
