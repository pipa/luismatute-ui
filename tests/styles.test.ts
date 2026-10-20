import { readFileSync } from 'node:fs';
import { beforeEach, describe, expect, it } from 'vitest';
import { defineLmCard } from '../src/components/card.ts';
import { defineLmMore } from '../src/components/more.ts';
import { defineLmShot } from '../src/components/shot.ts';
import { illustrations } from '../src/illustrations/index.ts';
import { renderTokensCss } from '../src/tokens/render.ts';

const css = readFileSync('src/styles/base.css', 'utf8');

beforeEach(() => {
  document.head.replaceChildren();
  document.body.replaceChildren();
  const style = document.createElement('style');
  style.textContent = css;
  document.head.append(style);
});

describe('lm-shot frame', () => {
  it('is a block box so the border, radius and clip apply', () => {
    defineLmShot();
    const shot = document.createElement('lm-shot');
    shot.setAttribute('href', 'https://example.com');
    shot.setAttribute('src', 'shots/example-600.webp');
    shot.setAttribute('chrome', 'example.com');
    document.body.append(shot);
    const frame = shot.querySelector('.lm-shot-frame');
    expect(frame).toBeTruthy();
    expect(getComputedStyle(frame as Element).display).toBe('block');
    expect(getComputedStyle(frame as Element).overflow).toBe('hidden');
  });
});

describe('illustration class scope', () => {
  it('does not animate plain consumer classes', () => {
    const plain = document.createElement('p');
    plain.className = 'wave';
    const flag = document.createElement('span');
    flag.className = 'flag';
    const spin = document.createElement('i');
    spin.className = 'spin';
    document.body.append(plain, flag, spin);
    expect(['', 'none']).toContain(getComputedStyle(plain).animationName);
    expect(['', 'none']).toContain(getComputedStyle(flag).animationName);
    expect(['', 'none']).toContain(getComputedStyle(spin).animationName);
    const art = document.createElement('div');
    art.className = 'lm-art';
    const wave = document.createElement('span');
    wave.className = 'wave';
    art.append(wave);
    document.body.append(art);
    expect(css).toContain(':where(.lm-art) .wave');
    expect(css).toContain('animation: lm-wave');
    expect(css).toContain('.lm-shots.two');
    expect(css).toContain('.lm-shots--two');
  });

  it('keeps illustration motion values in classes, not style attributes', () => {
    for (const markup of Object.values(illustrations)) {
      expect(markup).not.toContain('style="');
    }
    expect(css).toContain('.lm-ix-9594eb');
    expect(css).toContain('--t: 3.4s');
    expect(css).toContain('--dx: 10px');
  });
});

describe('portrait breakpoint and copy size', () => {
  it('uses the desk aspect query and the copy tokens', () => {
    expect(css).toContain(
      '@media (max-width: 559.98px), (max-aspect-ratio: 23 / 20)',
    );
    expect(css).toContain('font-size: var(--lm-font-size-copy)');
    expect(css).toContain('font-size: var(--lm-font-size-copy-port)');
    expect(css).toContain('@media (max-width: 639px)');
    const toggleQuery = css.slice(
      css.indexOf('@media (max-width: 639px)'),
      css.indexOf('@media (max-width: 559.98px)'),
    );
    expect(toggleQuery).toContain('lm-motion-toggle');
    expect(toggleQuery).not.toContain('lm-font-size-copy-port');
  });
});

describe('reduced motion stylesheet', () => {
  it('pauses motion when the OS asks and data-motion is not full', () => {
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('html:not([data-motion="full"])');
    expect(css).toContain('animation-play-state: paused !important');
    expect(css).toContain(
      'html:not([data-motion="full"]) :where(.lm-art):not(.lu)',
    );
    expect(css).toContain('html[data-motion="calm"]');
    expect(css).toContain('animation: none !important');
    expect(css).toContain('transform: rotate(45deg)');
  });
});

describe('avatar tokens', () => {
  it('publishes beard, highlight, lens and amber alias', () => {
    const tokens = renderTokensCss();
    expect(tokens).toContain('--lm-beard-line: #3f2a20;');
    expect(tokens).toContain('--lm-skin-highlight: #e1ad84;');
    expect(tokens).toContain('--lm-lens-tint: #3a2a22;');
    expect(tokens).toContain('--lm-lens-tint-opacity: 0.82;');
    expect(tokens).toContain('--lm-avatar-amber: #b0662f;');
    expect(tokens).toContain('--lm-skin-amber: var(--lm-avatar-amber);');
    expect(illustrations.plane.match(/var\(--lm-skin-amber\)/g)?.length).toBe(
      2,
    );
  });
});

describe('lm-more hit target', () => {
  it('does not force a 44px box on the pill', () => {
    defineLmMore();
    defineLmCard();
    const more = document.createElement('lm-more');
    more.textContent = 'Details';
    document.body.append(more);
    const button = more.querySelector('button');
    expect(button).toBeTruthy();
    const style = getComputedStyle(button as Element);
    expect(style.minHeight).not.toBe('44px');
    expect(css).not.toContain(
      'min-height: var(--lm-target);\n  min-width: var(--lm-target);',
    );
    expect(css).toContain('calc(-6px - var(--lm-border-line))');
  });
});
