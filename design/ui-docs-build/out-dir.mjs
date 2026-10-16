// Stills live outside the repo (in /workspace/team/luismatute/stills/), never under design/ (#30).
import { mkdirSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const repo = resolve(new URL('../..', import.meta.url).pathname);

/** Resolves the output dir and refuses any path inside the repo. */
export function stillsDir(dir) {
  const out = resolve(dir);
  const rel = relative(repo, out);
  if (!rel.startsWith('..') && !rel.startsWith('/')) {
    throw new Error(
      `Stills must not be written into the repo (${out}). Use /workspace/team/luismatute/stills/<name>/.`,
    );
  }
  mkdirSync(out, { recursive: true });
  return out;
}
