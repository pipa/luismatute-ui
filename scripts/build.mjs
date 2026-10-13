import { execSync } from 'node:child_process';
import {
  cpSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  renderThemeCss,
  renderTokensCss,
  renderTokensJson,
} from '../src/tokens/render.ts';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = resolve(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });

writeFileSync(resolve(dist, 'tokens.css'), renderTokensCss());
writeFileSync(resolve(dist, 'theme.css'), renderThemeCss());
writeFileSync(resolve(dist, 'tokens.json'), renderTokensJson());
cpSync(resolve(root, 'src/styles/base.css'), resolve(dist, 'base.css'));
cpSync(resolve(root, 'src/styles/fonts.css'), resolve(dist, 'fonts.css'));
cpSync(resolve(root, 'src/styles/sky.css'), resolve(dist, 'sky.css'));
cpSync(resolve(root, 'fonts'), resolve(dist, 'fonts'), { recursive: true });
cpSync(
  resolve(root, 'src/illustrations/files'),
  resolve(dist, 'illustrations'),
  { recursive: true },
);

execSync('pnpm exec tsup', { cwd: root, stdio: 'inherit' });
execSync('pnpm exec tsc -p tsconfig.build.json', {
  cwd: root,
  stdio: 'inherit',
});
rewriteDeclarationSpecifiers(dist);
console.log('built dist/');

function rewriteDeclarationSpecifiers(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) {
      rewriteDeclarationSpecifiers(path);
      continue;
    }
    if (!entry.name.endsWith('.d.ts')) continue;
    const text = readFileSync(path, 'utf8');
    const next = text.replaceAll(/from '(\.[^']+)\.ts'/g, "from '$1.js'");
    if (next !== text) writeFileSync(path, next);
  }
}
