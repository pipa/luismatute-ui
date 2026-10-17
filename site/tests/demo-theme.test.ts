// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { frameThemes } from '../src/pages/components.css';
import { initDemoThemes, pageTheme } from '../src/scripts/demo-theme';

describe('per-frame Day/Night toggle', () => {
  beforeEach(() => {
    document.documentElement.dataset.mode = 'day';
    document.body.innerHTML = `
      <div data-demo-frame id="a"><button data-demo-theme aria-pressed="false" hidden>Night</button></div>
      <div data-demo-frame id="b"><button data-demo-theme aria-pressed="false" hidden>Night</button></div>`;
  });
  it('starts from the page mode and reveals the button', () => {
    expect(initDemoThemes()).toBe(2);
    const a = document.getElementById('a') as HTMLElement;
    expect(a.dataset.theme).toBe('day');
    expect(a.querySelector('button')?.hidden).toBe(false);
    document.documentElement.dataset.mode = 'night';
    expect(pageTheme()).toBe('night');
  });
  it('flips only its own frame and mirrors aria-pressed', () => {
    initDemoThemes();
    const a = document.getElementById('a') as HTMLElement;
    const b = document.getElementById('b') as HTMLElement;
    a.querySelector('button')?.click();
    expect(a.dataset.theme).toBe('night');
    expect(a.querySelector('button')?.getAttribute('aria-pressed')).toBe(
      'true',
    );
    expect(b.dataset.theme).toBe('day');
    a.querySelector('button')?.click();
    expect(a.dataset.theme).toBe('day');
    expect(a.querySelector('button')?.getAttribute('aria-pressed')).toBe(
      'false',
    );
  });
});

describe('frame theme stylesheet', () => {
  it('maps both themes to the real token values', () => {
    const css = frameThemes();
    expect(css).toMatch(
      /\.demo-frame\[data-theme="day"\] \{[^}]*--lm-ink: #2b1b14;/,
    );
    expect(css).toMatch(
      /\.demo-frame\[data-theme="night"\] \{[^}]*--lm-ink: #fff6e4;/,
    );
    expect(css).toMatch(
      /\.demo-frame\[data-theme="night"\] \{[^}]*--lm-card: #1f1945;/,
    );
  });
});

describe('frame theme aliases', () => {
  it('redeclares var() aliases in both themes so they re-resolve in the frame', () => {
    const css = frameThemes();
    for (const theme of ['day', 'night'])
      expect(css).toMatch(
        new RegExp(
          `\\.demo-frame\\[data-theme="${theme}"\\] \\{[^}]*--lm-accent-ink: var\\(--lm-tomato-d\\);`,
        ),
      );
  });
});
