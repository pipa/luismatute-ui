import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

// Copy Luis removed (#56). Fails on any text, alt or aria value in src, docs or dist.
const BANNED = [/window[\s-]+seat/i];
const ROOTS = ['src', 'docs', 'dist'];
const TEXT = /\.(ts|js|mjs|css|html|svg|json|md|txt)$/;

function* files(dir: string): Generator<string> {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* files(p);
    else if (TEXT.test(name)) yield p;
  }
}

describe('banned phrases', () => {
  it('none in src, docs or dist (text, alt, aria)', () => {
    const hits: string[] = [];
    for (const root of ROOTS)
      for (const f of files(root)) {
        const text = readFileSync(f, 'utf8');
        for (const re of BANNED) if (re.test(text)) hits.push(`${f}: ${re}`);
      }
    expect(hits).toEqual([]);
  });
});
