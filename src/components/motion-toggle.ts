import {
  applyMotionPreference,
  type MotionMode,
  writeMotionPreference,
} from './motion.ts';

export class LmMotionToggle extends HTMLElement {
  private button: HTMLButtonElement | null = null;

  connectedCallback(): void {
    const mode = applyMotionPreference();
    if (!this.button) {
      const button = document.createElement('button');
      button.type = 'button';
      button.innerHTML =
        '<span class="lm-mt-i" aria-hidden="true"></span><span class="lm-mt-s"><span class="lm-mt-long"></span><span class="lm-mt-short"></span></span>';
      button.addEventListener('click', () => {
        const next: MotionMode =
          button.getAttribute('aria-pressed') === 'true' ? 'full' : 'reduce';
        writeMotionPreference(next);
        const params = new URLSearchParams(location.search);
        if (params.has('motion')) {
          params.set('motion', next === 'reduce' ? 'reduce' : 'on');
          const nextUrl = `${location.pathname}?${params.toString()}${location.hash}`;
          history.replaceState(null, '', nextUrl);
        }
        this.paint(applyMotionPreference(next));
      });
      this.button = button;
      this.append(button);
    }
    this.paint(mode);
  }

  private paint(mode: MotionMode): void {
    const button = this.button;
    if (!button) return;
    const reduced = mode === 'reduce';
    button.setAttribute('aria-pressed', String(reduced));
    this.setAttribute('aria-pressed', String(reduced));
    const long = button.querySelector('.lm-mt-long');
    const short = button.querySelector('.lm-mt-short');
    if (long) long.textContent = reduced ? 'Full flight' : 'Just the info';
    if (short) short.textContent = reduced ? 'Flight' : 'Info';
  }
}

export function defineLmMotionToggle(): void {
  if (!customElements.get('lm-motion-toggle'))
    customElements.define('lm-motion-toggle', LmMotionToggle);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-motion-toggle': LmMotionToggle;
  }
}
