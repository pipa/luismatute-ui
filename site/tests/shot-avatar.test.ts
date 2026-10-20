// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { avatar } from '../../src/illustrations/svg/avatar.ts';
import { demoCss } from '../src/lib/component-css';
import { initAvatarPoses } from '../src/scripts/avatar-poses';
import docsCss from '../src/styles/docs.css?raw';

describe('demo stylesheet for lm-shot and lm-avatar (#18)', () => {
  const css = demoCss();
  it('carries the shot frame, the avatar and the hidden-text helper', () => {
    for (const sel of [
      'lm-shot .lm-shot-frame {',
      'lm-shot .lm-shot-chrome {',
      '.lm-shots--two {',
      'lm-avatar {',
      'lm-avatar .lm-note {',
      ':where(.lm-art) .zz text,',
      '.lm-vh {',
    ])
      expect(css).toContain(sel);
  });
  it('keeps the keyframes the demoed elements use, and only those', () => {
    // lm-globe-reveal is in since the lm-globe page (#18) demos it.
    for (const k of ['lm-avatar-wave', 'lm-avatar-wave-once', 'lm-zz', 'lm-globe-reveal'])
      expect(css).toMatch(new RegExp(`@keyframes ${k} \\{`));
    for (const k of ['lm-bob', 'lm-spin', 'lm-wave'])
      expect(css).not.toMatch(new RegExp(`@keyframes ${k} \\{`));
  });
  it('keeps the avatar reduced-motion holds, inside their media query', () => {
    expect(css).toContain(
      'html[data-motion="reduce"] lm-avatar .lu.ex-wave .lu-hand',
    );
    expect(css).toMatch(
      /@media \(prefers-reduced-motion: reduce\) \{\s*html:not\(\[data-motion="full"\]\) lm-avatar/,
    );
  });
  it('keyframes are kept by exact name, not by prefix', () => {
    const src = `a lm-x { animation: lm-x-long 1s; }
@keyframes lm-x { to { opacity: 1; } }
@keyframes lm-x-long { to { opacity: 0; } }`;
    const out = demoCss(src, /lm-x\b/);
    expect(out).toContain('@keyframes lm-x-long');
    expect(out).not.toMatch(/@keyframes lm-x \{/);
  });
});

describe('demo motion holds in docs.css', () => {
  it('pause and reduce hold the demo animations; the shell is left alone', () => {
    expect(docsCss).toMatch(/html\.paused \.demo-stage \*,/);
    expect(docsCss).toMatch(/html\[data-motion="reduce"\] \.demo-stage \*,/);
    expect(docsCss).not.toMatch(/(^|\n)html\.paused \*,/);
  });
  it('pose buttons change state without a transition', () => {
    const rule = docsCss.match(/\n\.demo-pose \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(rule).toContain('min-height: var(--lm-docs-tap)');
    expect(rule).not.toContain('transition');
  });
});

describe('lm-avatar pose picker', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div data-demo-frame>
        <lm-avatar pose="wave"></lm-avatar>
        <div data-avatar-poses hidden>
          <button data-pose="wave" aria-pressed="true">wave</button>
          <button data-pose="sleep" aria-pressed="false">sleep</button>
          <button data-pose="" aria-pressed="false">none</button>
        </div>
      </div>`;
  });
  it('shows the picker and sets the pose on its own avatar', () => {
    expect(initAvatarPoses()).toBe(1);
    const group = document.querySelector('[data-avatar-poses]') as HTMLElement;
    expect(group.hidden).toBe(false);
    const [wave, sleep, none] = [...group.querySelectorAll('button')];
    sleep?.click();
    const avatar = document.querySelector('lm-avatar') as HTMLElement;
    expect(avatar.getAttribute('pose')).toBe('sleep');
    expect(sleep?.getAttribute('aria-pressed')).toBe('true');
    expect(wave?.getAttribute('aria-pressed')).toBe('false');
    none?.click();
    expect(avatar.hasAttribute('pose')).toBe(false);
    expect(none?.getAttribute('aria-pressed')).toBe('true');
    expect(sleep?.getAttribute('aria-pressed')).toBe('false');
  });
});

describe('avatar linework uses fixed ink (#43)', () => {
  it('every ink stroke and fill in the portrait is --lm-ink-fixed', () => {
    expect(avatar).not.toContain('var(--lm-ink)');
    expect(avatar.match(/var\(--lm-ink-fixed\)/g)?.length).toBe(31);
  });
  it('the pressed pose pill has a 1px fixed-ink border', () => {
    expect(docsCss).toContain(
      'border: var(--lm-border-hairline) solid var(--lm-ink-fixed);',
    );
  });
});
