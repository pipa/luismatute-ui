// @vitest-environment happy-dom

import { beforeEach, describe, expect, it, vi } from 'vitest';
import css from '../../dist/tokens.css?raw';
import {
  colours,
  contrast,
  durations,
  easings,
  nightColours,
  PAPER,
  parseBlock,
  radii,
  spaces,
  swatchText,
  toRgb,
} from '../src/lib/tokens';
import { copyToken, initTokenCopy } from '../src/scripts/token-copy';
import docs from '../src/styles/docs.css?raw';

describe('token data comes from dist/tokens.css', () => {
  it('parses :root and the night block', () => {
    expect(
      parseBlock(':root {\n  --lm-a: 1px;\n  --lm-b: #fff;\n}', ':root'),
    ).toEqual([
      { name: '--lm-a', value: '1px' },
      { name: '--lm-b', value: '#fff' },
    ]);
    expect(colours.find((t) => t.name === '--lm-ink')?.value).toBe('#2b1b14');
    expect(nightColours.find((t) => t.name === '--lm-paper')?.value).toBe(
      '#120d2c',
    );
    for (const t of [...spaces, ...radii, ...easings, ...durations])
      expect(css).toContain(`${t.name}: ${t.value};`);
    expect(
      durations.find((t) => t.name === '--lm-duration-copy-fade')?.value,
    ).toBe('0.28s');
  });
});

describe('swatch labels pass AA', () => {
  it('computes WCAG contrast', () => {
    expect(contrast([0, 0, 0], [255, 255, 255])).toBeCloseTo(21, 0);
    expect(toRgb('#2b1b14')).toEqual([43, 27, 20]);
    expect(toRgb('rgba(43, 27, 20, 0)')).toEqual(PAPER);
  });
  it('every day and night swatch label is at least 4.5:1', () => {
    const fails = [
      ...colours.map((t) => ({ t, r: swatchText(t.value).ratio })),
      ...nightColours.map((t) => ({
        t,
        r: swatchText(t.value, [18, 13, 44]).ratio,
      })),
    ].filter((x) => x.r < 4.5);
    expect(
      fails.map((f) => `${f.t.name} ${f.t.value} ${f.r.toFixed(2)}`),
    ).toEqual([]);
  });
});

describe('token click-to-copy', () => {
  beforeEach(() => {
    document.body.innerHTML = `<p><code class="tok" data-copy-text="var(--lm-ink)" data-copy-label="Copy var(--lm-ink)">--lm-ink</code></p><p id="copy-live" aria-live="polite"></p>`;
    vi.useFakeTimers();
  });
  it('upgrades <code> to a labelled button keeping the text (no-JS shows plain code)', () => {
    expect(document.querySelector('button')).toBeNull();
    expect(initTokenCopy(document, { writeText: async () => {} })).toBe(1);
    const b = document.querySelector('button.tok-copy');
    expect(b?.getAttribute('type')).toBe('button');
    expect(b?.getAttribute('aria-label')).toBe('Copy var(--lm-ink)');
    expect(b?.textContent).toBe('--lm-ink');
  });
  it('copies, marks copied and announces, then resets after 2s', async () => {
    initTokenCopy(document);
    const b = document.querySelector<HTMLButtonElement>(
      'button.tok-copy',
    ) as HTMLButtonElement;
    const writeText = vi.fn(async () => {});
    expect(await copyToken(b, { writeText })).toBe(true);
    expect(writeText).toHaveBeenCalledWith('var(--lm-ink)');
    expect(b.hasAttribute('data-copied')).toBe(true);
    expect(document.getElementById('copy-live')?.textContent).toBe(
      'Copied var(--lm-ink)',
    );
    vi.advanceTimersByTime(2000);
    expect(b.hasAttribute('data-copied')).toBe(false);
  });
  it('selects the text and names the shortcut when the clipboard is blocked', async () => {
    initTokenCopy(document);
    const b = document.querySelector<HTMLButtonElement>(
      'button.tok-copy',
    ) as HTMLButtonElement;
    const ok = await copyToken(b, {
      platform: 'MacIntel',
      writeText: async () => {
        throw new Error('blocked');
      },
    });
    expect(ok).toBe(false);
    expect(window.getSelection()?.toString()).toBe('--lm-ink');
    expect(document.getElementById('copy-live')?.textContent).toBe(
      'Copy failed. Text selected, press ⌘C.',
    );
  });
});

describe('foundations CSS', () => {
  it('motion demo moves with transform only and stops under reduced motion', () => {
    const dot = docs.match(/\n\.pv-dot \{([^}]*)\}/)?.[1] ?? '';
    expect(dot).toMatch(/transition: transform var\(--lm-docs-demo-play\)/);
    expect(docs).toMatch(/--lm-docs-demo-play: var\(--lm-duration-copy-pop\)/);
    expect(docs).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{\s*--lm-docs-demo-play: 0s/,
    );
  });
});

describe('swatch label CSS (Muse #33)', () => {
  it('name and value inherit the label colour, no ligatures, room for descenders', () => {
    expect(docs).toMatch(
      /\.swatch \.tok,\s*\.swatch \.tok \* \{\s*color: inherit;\s*-webkit-text-fill-color: currentColor;\s*font-variant-ligatures: none;/,
    );
    expect(docs).toMatch(
      /\.swatch code\.tok,\s*\.swatch button\.tok-copy \{[^}]*line-height: 1\.5;[^}]*padding-block: 4px;/,
    );
  });
});
