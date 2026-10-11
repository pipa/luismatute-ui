import { applyMotionPreference } from './motion.ts';

let moreSeq = 0;

export class LmMore extends HTMLElement {
  private button: HTMLButtonElement | null = null;
  private body: HTMLElement | null = null;

  connectedCallback(): void {
    if (this.button) return;
    const id = this.getAttribute('panel') ?? `lm-more-${++moreSeq}`;
    const label = this.getAttribute('label') ?? 'More';
    const body = document.createElement('div');
    body.className = 'lm-more-body';
    body.id = id;
    body.hidden = true;
    while (this.firstChild) body.append(this.firstChild);
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    button.addEventListener('click', () => this.toggle());
    const hit = document.createElement('span');
    hit.className = 'lm-hit';
    hit.setAttribute('aria-hidden', 'true');
    hit.addEventListener('click', () => this.toggle());
    const ctrl = document.createElement('span');
    ctrl.className = 'lm-more-ctrl';
    ctrl.append(hit, button);
    this.button = button;
    this.body = body;
    this.append(ctrl, body);
  }

  toggle(force?: boolean): void {
    if (!this.button || !this.body) return;
    const open = force ?? this.button.getAttribute('aria-expanded') !== 'true';
    this.button.setAttribute('aria-expanded', String(open));
    this.body.hidden = !open;
    this.dispatchEvent(
      new CustomEvent('lm-toggle', { detail: { open }, bubbles: true }),
    );
  }

  get open(): boolean {
    return this.button?.getAttribute('aria-expanded') === 'true';
  }
}

export function defineLmMore(): void {
  applyMotionPreference();
  if (!customElements.get('lm-more')) customElements.define('lm-more', LmMore);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-more': LmMore;
  }
}
