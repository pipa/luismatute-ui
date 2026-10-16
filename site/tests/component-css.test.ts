import { describe, expect, it } from 'vitest';
import { blocks, demoCss } from '../src/lib/component-css';

const sample = `/* reset */
*, *::before { box-sizing: border-box; }
html { background: red; }
body { margin: 0; }
button { font: inherit; }
lm-card { display: block; }
lm-card h2 { margin: 0; }
.lm-chips { display: flex; }
html[data-motion="reduce"] lm-more button { display: none; }
@media (max-width: 639px) {
  body { padding: 0; }
  lm-pause button { padding: 0; }
}
@keyframes spin { to { transform: rotate(1turn); } }`;

describe('demo stylesheet extraction', () => {
  it('splits top-level blocks', () => {
    expect(blocks('a{x:1}b{y:2}').map((b) => b.prelude)).toEqual(['a', 'b']);
  });
  it('keeps component rules, drops global resets', () => {
    const css = demoCss(sample);
    expect(css).toContain('lm-card {');
    expect(css).toContain('lm-card h2 {');
    expect(css).toContain('.lm-chips {');
    expect(css).toContain('html[data-motion="reduce"] lm-more button');
    expect(css).not.toMatch(/(^|\n)(html|body|button|\*)[ ,{]/);
    expect(css).not.toContain('@keyframes');
  });
  it('keeps component rules inside media queries, without the global ones', () => {
    const css = demoCss(sample);
    expect(css).toMatch(/@media \(max-width: 639px\) \{\s*lm-pause button \{/);
    expect(css).not.toContain('padding: 0; }\n  lm-pause');
  });
  it('covers every demoed element from the real base.css', () => {
    const css = demoCss();
    for (const sel of [
      'lm-card {',
      'lm-chip {',
      'lm-more button {',
      'lm-pause button {',
      '.lm-kicker {',
    ])
      expect(css).toContain(sel);
    expect(css).not.toMatch(/(^|\n)html \{/);
  });
});
