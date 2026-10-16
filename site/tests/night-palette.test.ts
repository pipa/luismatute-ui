import { describe, expect, it } from 'vitest';
import { contrast, nightTokens, rootTokens, toRgb } from '../src/lib/tokens';

const night = Object.fromEntries(nightTokens.map((t) => [t.name, t.value]));
const day = Object.fromEntries(rootTokens.map((t) => [t.name, t.value]));
const rgb = (v: string) => toRgb(v) as [number, number, number];

// Muse's final night palette (#39, posted by Eddie in comment 6224355471).
const surfaces = {
  '--lm-paper': '#120d2c',
  '--lm-card': '#1f1945',
  '--lm-sand': '#2b2456',
  '--lm-white': '#3a3270',
} as const;
const text = { cream: '#fff1cf', marigold: '#ffd27a', 'theme ink': '#fff6e4' };
const rim = '#b3a8dc';

describe('night palette (#39)', () => {
  it('uses Muse’s indigo values, no brown', () => {
    for (const [name, value] of Object.entries(surfaces))
      expect(night[name], name).toBe(value);
    expect(night['--lm-toggle-pressed']).toBe('var(--lm-card)');
  });
  it('leaves day unchanged', () => {
    expect(day['--lm-paper']).toBe('#fff6e4');
    expect(day['--lm-card']).toBe('var(--lm-paper)');
    expect(day['--lm-sand']).toBe('#f3e2c0');
    expect(day['--lm-white']).toBe('#ffffff');
  });
  for (const [surface, bg] of Object.entries(surfaces)) {
    it(`text is 4.5:1+ and the rim 3:1+ on ${surface} ${bg}`, () => {
      // Measured against the shipped night value, so a palette drift is caught too.
      expect(night[surface]).toBe(bg);
      for (const [label, fg] of Object.entries(text))
        expect(
          contrast(rgb(fg), rgb(bg)),
          `${label} on ${surface}`,
        ).toBeGreaterThanOrEqual(4.5);
      expect(
        contrast(rgb(rim), rgb(bg)),
        `rim on ${surface}`,
      ).toBeGreaterThanOrEqual(3);
    });
  }
  it('matches Muse’s measured ratios', () => {
    const r = (fg: string, bg: string) =>
      Math.round(contrast(rgb(fg), rgb(bg)) * 100) / 100;
    expect(r('#fff1cf', '#120d2c')).toBeCloseTo(16.73, 1);
    expect(r('#ffd27a', '#3a3270')).toBeCloseTo(7.89, 1);
    expect(r('#fff6e4', '#1f1945')).toBeCloseTo(15.24, 1);
    expect(r(rim, '#3a3270')).toBeCloseTo(5.11, 1);
  });
});
