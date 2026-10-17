import { describe, expect, it } from 'vitest';
import { contrast, nightTokens, rootTokens, toRgb } from '../src/lib/tokens';
import docs from '../src/styles/docs.css?raw';

// #41: night syntax colours and dune-night, night only. Accents are
// measured on Muse's night code background #191338 (#39).
const night = Object.fromEntries(nightTokens.map((t) => [t.name, t.value]));
const root = Object.fromEntries(rootTokens.map((t) => [t.name, t.value]));

// docs.css has several blocks per selector; merge every top-level one in order.
const docsBlock = (selector: string) => {
  const out: Record<string, string> = {};
  for (const block of docs.split(`\n${selector} {`).slice(1)) {
    const body = block.slice(0, block.indexOf('\n}'));
    for (const m of body.matchAll(/(--lm-[\w-]+)\s*:\s*([^;]+);/g))
      out[m[1] as string] = (m[2] as string).trim();
  }
  return out;
};
const CODE_BG = '#191338';
const ratio = (fg: string) =>
  contrast(
    toRgb(fg) as [number, number, number],
    toRgb(CODE_BG) as [number, number, number],
  );

describe('night syntax colours (#41)', () => {
  it('pins the night values', () => {
    expect(night['--lm-dune-night']).toBe('#2b2456');
    expect(root['--lm-dune-night']).toBe('#3a2c22'); // day dune unchanged
    expect(night['--lm-code-text']).toBe('#fff1cf');
    expect(night['--lm-code-comment']).toBe('#b3a8dc');
    expect(night['--lm-code-punct']).toBe('#cfc6ea');
  });

  it('leaves the day syntax colours alone', () => {
    expect(root['--lm-code-text']).toBe('#2b1b14');
    expect(root['--lm-code-comment']).toBe('#6e5c4c');
    expect(root['--lm-code-punct']).toBe('#5b4536');
  });

  it('has no brown #3a2c22 in night tokens', () => {
    expect(Object.values(night).map((v) => v.toLowerCase())).not.toContain(
      '#3a2c22',
    );
  });

  it.each([
    ['--lm-code-text', 15.72],
    ['--lm-code-comment', 8.02],
    ['--lm-code-punct', 10.84],
    ['--lm-code-keyword', 7.91],
    ['--lm-code-attr', 11.08],
    ['--lm-tomato-d', 8.54],
  ])('%s is 4.5:1 or better on #191338', (name, expected) => {
    const r = ratio(night[name] as string);
    expect(r).toBeGreaterThanOrEqual(4.5);
    expect(r).toBeCloseTo(expected, 1);
  });

  describe('docs code panel (#41)', () => {
    const docsDay = docsBlock(':root');
    const docsNight = docsBlock('html[data-mode="night"]');
    it('night text, comment and punctuation', () => {
      expect(docsNight['--lm-docs-c-text']).toBe('#fff1cf');
      expect(docsNight['--lm-docs-c-comment']).toBe('#b3a8dc');
      expect(docsNight['--lm-docs-c-punct']).toBe('#cfc6ea');
    });
    it('accents are not overridden at night, and day values are unchanged', () => {
      for (const k of ['keyword', 'string', 'fn', 'tag', 'attr'])
        expect(docsNight[`--lm-docs-c-${k}`], k).toBeUndefined();
      expect(docsDay['--lm-docs-c-text']).toBe('var(--lm-moon)');
      expect(docsDay['--lm-docs-c-comment']).toBe('#b8acdf');
      expect(docsDay['--lm-docs-c-punct']).toBe('#d9cfee');
      expect(docsDay['--lm-docs-c-keyword']).toBe('#ffb59f');
      expect(docsDay['--lm-docs-c-attr']).toBe('#e6c9ff');
    });
    it.each([
      ['--lm-docs-c-text', 17.51],
      ['--lm-docs-c-comment', 8.93],
      ['--lm-docs-c-punct', 12.08],
    ])('%s is 4.5:1 or better on the night docs panel', (name, expected) => {
      const bg = toRgb(docsNight['--lm-docs-c-bg'] as string) as [
        number,
        number,
        number,
      ];
      const r = contrast(
        toRgb(docsNight[name] as string) as [number, number, number],
        bg,
      );
      expect(r).toBeGreaterThanOrEqual(4.5);
      expect(r).toBeCloseTo(expected, 1);
    });
  });
});
