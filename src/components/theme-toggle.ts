import { currentTheme, setTheme } from './theme.ts';

/**
 * 44px icon pill that flips html[data-mode] between day and night.
 * Server-render a `<button class="lm-pill lm-pill--icon">` inside to avoid a
 * layout shift; otherwise one is created. The button keeps aria-label "Night"
 * and exposes the state with aria-pressed (pressed = night).
 */
export class LmThemeToggle extends HTMLElement {
  private button: HTMLButtonElement | null = null;
  private readonly sync = (): void => {
    this.button?.setAttribute(
      'aria-pressed',
      String(currentTheme() === 'night'),
    );
  };

  connectedCallback(): void {
    if (!this.button) {
      let button = this.querySelector('button');
      if (!button) {
        button = document.createElement('button');
        button.className = 'lm-pill lm-pill--icon lm-theme-btn';
        button.innerHTML =
          '<span class="lm-i-moon" aria-hidden="true"></span><span class="lm-i-sun" aria-hidden="true"></span>';
        this.append(button);
      }
      button.type = 'button';
      if (!button.hasAttribute('aria-label'))
        button.setAttribute('aria-label', 'Night');
      button.addEventListener('click', () => {
        setTheme(currentTheme() === 'night' ? 'day' : 'night');
      });
      this.button = button;
    }
    this.sync();
    document.documentElement.addEventListener('lm-theme', this.sync);
  }

  disconnectedCallback(): void {
    document.documentElement.removeEventListener('lm-theme', this.sync);
  }
}

export function defineLmThemeToggle(): void {
  if (!customElements.get('lm-theme-toggle'))
    customElements.define('lm-theme-toggle', LmThemeToggle);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-theme-toggle': LmThemeToggle;
  }
}
