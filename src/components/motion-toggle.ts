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
          button.getAttribute('data-pressed') === 'true' ? 'full' : 'calm';
        writeMotionPreference(next);
        const params = new URLSearchParams(location.search);
        if (params.has('motion')) {
          params.set('motion', next === 'full' ? 'on' : 'calm');
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
    const info = mode !== 'full';
    button.setAttribute('data-pressed', String(info));
    button.removeAttribute('aria-pressed');
    this.removeAttribute('aria-pressed');
    const long = button.querySelector('.lm-mt-long');
    const short = button.querySelector('.lm-mt-short');
    if (long) long.textContent = info ? 'Full flight' : 'Just the info';
    if (short) short.textContent = info ? 'Flight' : 'Info';
  }
}

export function defineLmMotionToggle(): void {
  applyMotionPreference();
  if (!customElements.get('lm-motion-toggle'))
    customElements.define('lm-motion-toggle', LmMotionToggle);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-motion-toggle': LmMotionToggle;
  }
}
