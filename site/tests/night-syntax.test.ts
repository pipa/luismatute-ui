import { describe, expect, it } from 'vitest';
import { contrast, nightTokens, rootTokens, toRgb } from '../src/lib/tokens';

// #41: night syntax colours and dune-night, night only. Accents are
// measured on Muse's night code background #191338 (#39).
const night = Object.fromEntries(nightTokens.map((t) => [t.name, t.value]));
const root = Object.fromEntries(rootTokens.map((t) => [t.name, t.value]));
const CODE_BG = '#191338';
const ratio = (fg: string) =>
  contrast(
    toRgb(fg) as [number, number, number],
    toRgb(CODE_BG) as [number, number, number],
  );

describe('night syntax colours (#41)', () => {
  it('pins the night values', () => {
    expect(root['--lm-dune-night']).toBe('#2b2456');
    expect(night['--lm-code-text']).toBe('#fff1cf');
    expect(night['--lm-code-comment']).toBe('#b3a8dc');
    expect(night['--lm-code-punct']).toBe('#cfc6ea');
  });

  it('leaves the day syntax colours alone', () => {
    expect(root['--lm-code-text']).toBe('#2b1b14');
    expect(root['--lm-code-comment']).toBe('#6e5c4c');
    expect(root['--lm-code-punct']).toBe('#5b4536');
  });

  it('has no brown #3a2c22 in night tokens or dune-night', () => {
    const nightValues = [...Object.values(night), root['--lm-dune-night']];
    expect(nightValues.map((v) => (v ?? '').toLowerCase())).not.toContain(
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
});
