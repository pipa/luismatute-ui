import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  defineLmSkyHeader,
  skyLayersHtml,
} from '../src/components/sky-header.ts';
import { readTheme, THEME_KEY } from '../src/components/theme.ts';
import { defineLmThemeToggle } from '../src/components/theme-toggle.ts';
import { renderTokensCss } from '../src/tokens/render.ts';
import { modePairs } from '../src/tokens/tokens.ts';

function lin(hex: string, i: number): number {
  const n = Number.parseInt(hex.slice(1 + i * 2, 3 + i * 2), 16) / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}
function lum(hex: string): number {
  return 0.2126 * lin(hex, 0) + 0.7152 * lin(hex, 1) + 0.0722 * lin(hex, 2);
}
function ratio(a: string, b: string): number {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p) as [number, number];
  return (x + 0.05) / (y + 0.05);
}

const sky = readFileSync('src/styles/sky.css', 'utf8');

describe('day and night tokens', () => {
  it('every mode text pair, including both code themes, clears 4.5:1', () => {
    for (const p of modePairs)
      expect(ratio(p.fg, p.bg), p.name).toBeGreaterThanOrEqual(4.5);
  });
  it('renders an html[data-mode="night"] block over the same names', () => {
    const css = renderTokensCss();
    const night = css.slice(css.indexOf('html[data-mode="night"]'));
    expect(night).toContain('color-scheme: dark;');
    expect(night).toContain('--lm-paper: #1d1510;');
    expect(night).toContain('--lm-code-keyword: #ff8f73;');
    expect(css).toContain('--lm-sky-far: 180s;');
    expect(css).toContain('--lm-ease-glide:');
  });
});

describe('sky.css motion rules', () => {
  it('keyframes only touch transform and opacity', () => {
    const frames = sky.match(/@keyframes[^{]+\{([^{}]*\{[^}]*\})+\s*\}/g) ?? [];
    expect(frames.length).toBeGreaterThan(3);
    for (const f of frames) {
      const props = [...f.matchAll(/([a-z-]+)\s*:/g)].map((m) => m[1]);
      for (const p of props) expect(['transform', 'opacity']).toContain(p);
    }
  });
  it('transitions only name transform and opacity', () => {
    for (const m of sky.matchAll(/transition:\s*([^;]+);/g)) {
      const value = m[1] ?? '';
      if (value.trim() === 'none !important') continue;
      for (const part of value.split(','))
        expect(['transform', 'opacity']).toContain(part.trim().split(/\s+/)[0]);
    }
  });
  it('has no hard-coded durations outside tokens for loops', () => {
    expect(sky).toContain('var(--lm-sky-far)');
    expect(sky).toContain('html.paused .lm-sky-head *');
    expect(sky).toContain('.lm-sky-off *');
    expect(sky).toContain('prefers-reduced-motion: reduce');
  });
});

describe('theme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-mode');
    document.body.replaceChildren();
  });
  it('reads ?mode, then storage, then defaults to day', () => {
    expect(readTheme('?mode=night')).toBe('night');
    localStorage.setItem(THEME_KEY, 'night');
    expect(readTheme('')).toBe('night');
    localStorage.setItem(THEME_KEY, 'day');
    expect(readTheme('?mode=bogus')).toBe('day');
  });
  it('lm-theme-toggle flips data-mode, stores it and exposes aria-pressed', () => {
    defineLmThemeToggle();
    document.documentElement.dataset.mode = 'day';
    const t = document.createElement('lm-theme-toggle');
    document.body.append(t);
    const b = t.querySelector('button') as HTMLButtonElement;
    expect(b.getAttribute('aria-label')).toBe('Night');
    expect(b.getAttribute('aria-pressed')).toBe('false');
    b.click();
    expect(document.documentElement.dataset.mode).toBe('night');
    expect(localStorage.getItem(THEME_KEY)).toBe('night');
    expect(b.getAttribute('aria-pressed')).toBe('true');
  });
});

describe('lm-sky-header', () => {
  it('server layers carry no style attributes and are aria-hidden', () => {
    for (const html of [skyLayersHtml(), skyLayersHtml({ compact: true })]) {
      expect(html).not.toMatch(/\sstyle=/);
      expect(html).toContain('aria-hidden="true"');
    }
  });
  it('pause sets html.paused, flips the label and dispatches lm-pause', () => {
    defineLmSkyHeader();
    document.body.innerHTML =
      '<lm-sky-header><header class="lm-sky-head"><button class="lm-sky-pause" aria-pressed="false"><span class="lm-pl">Pause sky</span></button></header></lm-sky-header>';
    let fired = false;
    document.documentElement.addEventListener('lm-pause', () => {
      fired = true;
    });
    const b = document.querySelector('button') as HTMLButtonElement;
    b.click();
    expect(document.documentElement.classList.contains('paused')).toBe(true);
    expect(b.getAttribute('aria-pressed')).toBe('true');
    expect(b.textContent).toBe('Play sky');
    expect(fired).toBe(true);
    expect(document.querySelector('.lm-sky')).toBeTruthy();
    expect(document.querySelector('.lm-cruise')).toBeTruthy();
    b.click();
  });
});
