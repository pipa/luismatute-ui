// @vitest-environment happy-dom
import { beforeEach, describe, expect, it } from 'vitest';
import { initThemeSwitch } from '../src/scripts/theme-switch';

// #18 docs header: Day/Night only, shared lm-mode cookie.
function mount(): HTMLElement {
  document.body.innerHTML = `<fieldset hidden data-theme-switch>
    <button type="button" data-mode-set="day" aria-pressed="false">Day</button>
    <button type="button" data-mode-set="night" aria-pressed="false">Night</button>
  </fieldset>`;
  return document.querySelector('[data-theme-switch]') as HTMLElement;
}
const btn = (m: string) =>
  document.querySelector(`[data-mode-set="${m}"]`) as HTMLButtonElement;

beforeEach(() => {
  document.cookie = 'lm-mode=; Max-Age=0; Path=/';
  document.documentElement.dataset.mode = 'day';
});

describe('theme switch', () => {
  it('reveals the group and reflects the page mode', () => {
    const g = mount();
    expect(initThemeSwitch()).toBe(1);
    expect(g.hidden).toBe(false);
    expect(btn('day').getAttribute('aria-pressed')).toBe('true');
    expect(btn('night').getAttribute('aria-pressed')).toBe('false');
    expect(document.querySelector('[data-mode-set="auto"]')).toBeNull();
  });

  it('Night sets html[data-mode], aria-pressed and the lm-mode cookie', () => {
    mount();
    initThemeSwitch();
    btn('night').click();
    expect(document.documentElement.dataset.mode).toBe('night');
    expect(btn('night').getAttribute('aria-pressed')).toBe('true');
    expect(btn('day').getAttribute('aria-pressed')).toBe('false');
    expect(document.cookie).toContain('lm-mode=night');
    btn('day').click();
    expect(document.documentElement.dataset.mode).toBe('day');
    expect(document.cookie).toContain('lm-mode=day');
  });
});
