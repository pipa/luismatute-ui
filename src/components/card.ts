export class LmCard extends HTMLElement {
  static get observedAttributes(): string[] {
    return ['variant'];
  }

  connectedCallback(): void {
    if (!this.hasAttribute('variant')) this.setAttribute('variant', 'stop');
  }
}

export function defineLmCard(): void {
  if (!customElements.get('lm-card')) customElements.define('lm-card', LmCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-card': LmCard;
  }
}
