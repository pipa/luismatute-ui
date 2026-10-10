export class LmPause extends HTMLElement {
  private button: HTMLButtonElement | null = null;

  connectedCallback(): void {
    if (this.button) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML =
      '<span class="lm-pi" aria-hidden="true"></span><span class="lm-pl">Pause animation</span>';
    button.addEventListener('click', () => {
      const on = button.getAttribute('aria-pressed') !== 'true';
      button.setAttribute('aria-pressed', String(on));
      this.setAttribute('aria-pressed', String(on));
      document.documentElement.classList.toggle('paused', on);
      document.documentElement.dataset.paused = on ? 'true' : 'false';
      document.documentElement.dispatchEvent(
        new CustomEvent('lm-pause', { detail: { paused: on } }),
      );
    });
    this.button = button;
    this.append(button);
  }
}

export function defineLmPause(): void {
  if (!customElements.get('lm-pause'))
    customElements.define('lm-pause', LmPause);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-pause': LmPause;
  }
}
