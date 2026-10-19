import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { inline, parseChangelog } from '../src/lib/changelog';

describe('parseChangelog', () => {
  it('splits the real CHANGELOG.md into one dated section per version', () => {
    const md = readFileSync(
      new URL('../../CHANGELOG.md', import.meta.url),
      'utf8',
    );
    const s = parseChangelog(md);
    const versions = [...md.matchAll(/^## (\S+)/gm)].map((m) => m[1]);
    expect(s.map((x) => x.version)).toEqual(versions);
    for (const x of s) {
      expect(x.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(x.groups.length).toBeGreaterThan(0);
    }
  });

  it('escapes raw HTML, keeps groups, lists and continuations, drops Unreleased', () => {
    const s = parseChangelog(
      '# Changelog\n\n## Unreleased\n\n- wip\n\n## 1.0.0 - 2026-01-02\n\nIntro.\n\n### Added\n\n- `lm-x` <script>\n  continued\n- second\n\n### Fixed (misc)\n\nA para.\n',
    );
    expect(s).toHaveLength(1);
    const r = s[0]!;
    expect(r).toMatchObject({
      id: 'v1-0-0',
      version: '1.0.0',
      date: '2026-01-02',
      lead: '<p>Intro.</p>',
    });
    expect(r.groups.map((g) => g.id)).toEqual(['v1-0-0-added', 'v1-0-0-fixed']);
    expect(r.groups[0]!.html).toBe(
      '<ul><li><code>lm-x</code> &lt;script&gt; continued</li><li>second</li></ul>',
    );
    expect(r.groups[1]!.html).toBe('<p>A para.</p>');
  });

  it('links refs to the right repo and leaves code alone', () => {
    expect(inline('fix (#26)')).toContain(
      '<a href="https://github.com/pipa/luismatute-ui/issues/26">#26</a>',
    );
    expect(inline('luismatute.me #55/#56')).toBe(
      'luismatute.me <a href="https://github.com/pipa/luismatute.me/issues/55">#55</a>/<a href="https://github.com/pipa/luismatute.me/issues/56">#56</a>',
    );
    expect(inline('`#fff`')).toBe('<code>#fff</code>');
  });
});
