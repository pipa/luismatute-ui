import { execFileSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function listFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = resolve(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFiles(path));
    else out.push(path);
  }
  return out.sort();
}

describe('gen-illustrations', () => {
  it('writes byte-identical files to a temp dir', () => {
    const out = mkdtempSync(resolve(tmpdir(), 'lm-ix-'));
    execFileSync(
      process.execPath,
      ['scripts/gen-illustrations.mjs', `--out=${out}`],
      {
        cwd: root,
        stdio: 'pipe',
      },
    );
    const committedDir = resolve(root, 'src/illustrations');
    const generatedDir = resolve(out, 'src/illustrations');
    const committed = listFiles(committedDir).map((path) =>
      relative(committedDir, path),
    );
    const generated = listFiles(generatedDir).map((path) =>
      relative(generatedDir, path),
    );
    expect(generated).toEqual(committed);
    const diffs: string[] = [];
    for (const file of committed) {
      const left = readFileSync(resolve(committedDir, file));
      const right = readFileSync(resolve(generatedDir, file));
      if (!left.equals(right)) {
        diffs.push(
          `${file} (${statSync(resolve(committedDir, file)).size} vs ${right.length} bytes)`,
        );
      }
    }
    expect(diffs).toEqual([]);
  });
});
