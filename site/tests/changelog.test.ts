import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { parseChangelog } from '../src/lib/changelog';

describe('parseChangelog', () => {
  it('splits the real CHANGELOG.md into one section per version', () => {
    const md = readFileSync(
      new URL('../../CHANGELOG.md', import.meta.url),
      'utf8',
    );
    const s = parseChangelog(md);
    const versions = [...md.matchAll(/^## (.+)$/gm)].map((m) => m[1]);
    expect(s.map((x) => x.title)).toEqual(versions);
    expect(s.every((x) => x.html.length > 0)).toBe(true);
  });

  it('escapes raw HTML and renders lists, code and continuations', () => {
    const s = parseChangelog(
      '# Changelog\n\n## 1.0.0\n\n### Added\n\n- `lm-x` <script>\n  continued\n- second\n\nA para.\n',
    )[0]!;
    expect(s.id).toBe('v1-0-0');
    expect(s.html).toContain('<h3>Added</h3>');
    expect(s.html).toContain(
      '<li><code>lm-x</code> &lt;script&gt; continued</li>',
    );
    expect(s.html).toContain('<li>second</li>');
    expect(s.html).toContain('<p>A para.</p>');
    expect(s.html).not.toContain('<script>');
  });
});
