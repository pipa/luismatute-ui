import { applyMotionPreference } from './motion.ts';

const BADGE = 'Featured';

export class LmChip extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant'];
  }

  connectedCallback(): void {
    this.sync();
  }

  attributeChangedCallback(): void {
    this.sync();
  }

  private sync(): void {
    const featured = this.getAttribute('variant') === 'featured';
    const badge = this.querySelector('b');
    if (featured && !badge) {
      const b = document.createElement('b');
      b.textContent = BADGE;
      this.append(b);
    } else if (!featured && badge?.textContent === BADGE) {
      badge.remove();
    }
  }
}

export function defineLmChip(): void {
  applyMotionPreference();
  if (!customElements.get('lm-chip')) customElements.define('lm-chip', LmChip);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-chip': LmChip;
  }
}
