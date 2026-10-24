/**
 * Docs header theme control (#18): Day / Night only (Luis dropped Auto on
 * Oct 19). Reuses the package's theme module, so the choice goes into the
 * shared `lm-mode` cookie exactly like luismatute.me and the blog.
 */
import {
  currentTheme,
  setTheme,
  type ThemeMode,
} from '../../../src/components/theme';

function sync(group: HTMLElement): void {
  const mode = currentTheme();
  for (const b of group.querySelectorAll<HTMLButtonElement>('[data-mode-set]'))
    b.setAttribute('aria-pressed', String(b.dataset.modeSet === mode));
}

export function initThemeSwitch(root: ParentNode = document): number {
  const groups = [...root.querySelectorAll<HTMLElement>('[data-theme-switch]')];
  for (const group of groups) {
    for (const b of group.querySelectorAll<HTMLButtonElement>(
      '[data-mode-set]',
    )) {
      b.addEventListener('click', () => {
        const mode = b.dataset.modeSet as ThemeMode;
        if (mode !== 'day' && mode !== 'night') return;
        if (mode !== currentTheme()) setTheme(mode);
        else sync(group);
      });
    }
    sync(group);
    document.documentElement.addEventListener('lm-theme', () => sync(group));
    group.hidden = false;
  }
  return groups.length;
}
