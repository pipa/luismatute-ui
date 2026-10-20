import { describe, expect, it } from 'vitest';
import { renderThemeCss, renderTokensCss } from '../src/tokens/render.ts';
import { sea, textPairs, themeAliases, themes } from '../src/tokens/tokens.ts';

function channel(hex: string, index: number): number {
  const h = hex.replace('#', '');
  const pair =
    h.length === 3
      ? `${h[index]}${h[index]}`
      : h.slice(index * 2, index * 2 + 2);
  const n = Number.parseInt(pair, 16) / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 1, 2].map((i) => channel(hex, i));
  return 0.2126 * (r ?? 0) + 0.7152 * (g ?? 0) + 0.0722 * (b ?? 0);
}

function contrast(fg: string, bg: string): number {
  const a = luminance(fg);
  const b = luminance(bg);
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

describe('WCAG 2.2 AA text pairs', () => {
  it('meets 4.5:1 for normal text and 3:1 for large display text', () => {
    for (const pair of textPairs) {
      const ratio = contrast(pair.fg, pair.bg);
      expect(ratio, pair.name).toBeGreaterThanOrEqual(pair.large ? 3 : 4.5);
    }
  });
});

describe('generated token CSS', () => {
  it('publishes scene themes and a Tailwind v4 theme', () => {
    const css = renderTokensCss();
    expect(css).toContain('--lm-ink: #2b1b14;');
    expect(css).toContain('--lm-ease-pop: cubic-bezier(0.34, 1.56, 0.64, 1);');
    expect(css).toContain('[data-theme="resort"]');
    expect(css).toContain('[data-theme="move"]');
    expect(css).toContain('--lm-sea-1:');
    expect(renderThemeCss()).toContain('@theme {');
    expect(renderThemeCss()).toContain('--color-resort-sky-1:');
  });
});

describe('renamed scene themes (#59)', () => {
  const pairs = [
    ['aa', 'airport'],
    ['sandals', 'resort'],
    ['bsc', 'campus'],
    ['fluky', 'studio'],
    ['booking', 'platform'],
  ] as const;

  it('keeps every old id as a deprecated [data-theme] alias of the new one', () => {
    const css = renderTokensCss();
    for (const [from, to] of pairs) {
      expect(css).toContain(`[data-theme="${to}"],\n[data-theme="${from}"] {`);
      expect(themes).toHaveProperty(to);
      // Deprecated JS alias (Eddie, #61): resolves to the new theme, not enumerated.
      expect(themes[from]).toBe(themes[to]);
      expect(Object.keys(themes)).not.toContain(from);
      expect(themeAliases[from]).toBe(to);
    }
  });

  it('aliases the old Tailwind colour variables to the new ones', () => {
    const css = renderThemeCss();
    for (const [from, to] of pairs) {
      expect(css).toContain(`--color-${to}-sky-1: ${themes[to].sky[0]}`);
      themes[to].sky.forEach((_, i) => {
        expect(css).toContain(
          `--color-${from}-sky-${i + 1}: var(--color-${to}-sky-${i + 1})`,
        );
      });
      if (to in sea)
        expect(css).toContain(
          `--color-${from}-sea-1: var(--color-${to}-sea-1)`,
        );
    }
  });
});
