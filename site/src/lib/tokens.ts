/**
 * Design tokens for the Foundations pages, read from the shipped
 * dist/tokens.css so the docs always show the real names and values.
 */
import css from '../../../dist/tokens.css?raw';

export interface Token {
  name: string;
  value: string;
}

/** Custom properties declared directly in the first `selector { ... }` block. */
export function parseBlock(source: string, selector: string): Token[] {
  const start = source.indexOf(`${selector} {`);
  if (start < 0) return [];
  const end = source.indexOf('\n}', start);
  const body = source.slice(source.indexOf('{', start) + 1, end);
  const out: Token[] = [];
  for (const m of body.matchAll(/(--lm-[\w-]+)\s*:\s*([^;]+);/g)) {
    out.push({ name: m[1] as string, value: (m[2] as string).trim() });
  }
  return out;
}

export const rootTokens = parseBlock(css, ':root');
export const nightTokens = parseBlock(css, 'html[data-mode="night"]');

const by = (re: RegExp) => rootTokens.filter((t) => re.test(t.name));

export const isColour = (v: string) => /^#[0-9a-f]{3,8}$|^rgba?\(/i.test(v);

/** Literal colours only; aliases (var(...)) are listed separately. */
export const colours = rootTokens.filter(
  (t) => isColour(t.value) && !/^--lm-shadow/.test(t.name),
);
export const colourAliases = rootTokens.filter(
  (t) =>
    /^var\(--lm-[\w-]+\)$/.test(t.value) &&
    !/^--lm-(shadow|ease|duration|dur|font|space|radius)/.test(t.name),
);
export const nightColours = nightTokens.filter((t) => isColour(t.value));

export const families = by(/^--lm-font-(display|text|mono|hand)$/);
export const fontSizes = by(/^--lm-font-size-/);
export const leading = by(/^--lm-leading-/);
export const tracking = by(/^--lm-tracking-/);
export const weights = by(/^--lm-weight-/);
export const spaces = by(/^--lm-space-/);
export const radii = by(/^--lm-radius-/);
export const borders = by(/^--lm-border-/);
export const easings = by(/^--lm-ease-/);
export const durations = by(/^--lm-(duration|dur)-/);

/** Class-safe slug for a token name: --lm-sky-1 -> lm-sky-1. */
export const slug = (name: string) => name.replace(/^--/, '');

// ---- contrast (WCAG 2.x) ----
type Rgb = [number, number, number];

export function toRgb(value: string, over: Rgb = [255, 246, 228]): Rgb | null {
  const v = value.trim().toLowerCase();
  if (v.startsWith('#')) {
    let h = v.slice(1);
    if (h.length === 3 || h.length === 4) h = [...h].map((c) => c + c).join('');
    const n = (i: number) => Number.parseInt(h.slice(i, i + 2), 16);
    const a = h.length === 8 ? n(6) / 255 : 1;
    return blend([n(0), n(2), n(4)], a, over);
  }
  const m = v.match(/^rgba?\(([^)]+)\)$/);
  if (!m) return null;
  const parts = (m[1] as string)
    .split(/[\s,/]+/)
    .filter(Boolean)
    .map(Number);
  const [r = 0, g = 0, b = 0, a = 1] = parts;
  return blend([r, g, b], a, over);
}

function blend(c: Rgb, a: number, over: Rgb): Rgb {
  return [0, 1, 2].map((i) =>
    Math.round((c[i] as number) * a + (over[i] as number) * (1 - a)),
  ) as Rgb;
}

function lum([r, g, b]: Rgb): number {
  const f = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

export function contrast(a: Rgb, b: Rgb): number {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

export const INK: Rgb = [43, 27, 20]; // --lm-ink #2b1b14
export const PAPER: Rgb = [255, 246, 228]; // --lm-paper #fff6e4

export const BLACK: Rgb = [0, 0, 0];
export const WHITE: Rgb = [255, 255, 255];

export type Tone = 'ink' | 'paper' | 'black' | 'white';
const tones: [Tone, Rgb][] = [
  ['ink', INK],
  ['paper', PAPER],
  ['black', BLACK],
  ['white', WHITE],
];

/**
 * Label colour for a swatch: the brand ink or paper when either passes AA
 * (4.5:1), otherwise pure black or white, whichever reads best.
 */
export function swatchText(
  value: string,
  over: Rgb = PAPER,
): { tone: Tone; ratio: number } {
  const c = toRgb(value, over) ?? PAPER;
  const scored = tones.map(([tone, rgb]) => ({
    tone,
    ratio: contrast(rgb, c),
  }));
  const brand = scored.slice(0, 2).sort((a, b) => b.ratio - a.ratio)[0] as {
    tone: Tone;
    ratio: number;
  };
  if (brand.ratio >= 4.5) return brand;
  return scored.sort((a, b) => b.ratio - a.ratio)[0] as {
    tone: Tone;
    ratio: number;
  };
}
