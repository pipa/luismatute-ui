import { landEdge, skyLayersCompact, skyLayersFull } from './sky-art.ts';

export { landEdge };

/** Sky layers HTML for server rendering (Astro `set:html`). Decorative, aria-hidden. */
export function skyLayersHtml(options: { compact?: boolean } = {}): string {
  return options.compact ? skyLayersCompact : skyLayersFull;
}

function setPaused(on: boolean): void {
  const root = document.documentElement;
  root.classList.toggle('paused', on);
  root.dataset.paused = on ? 'true' : 'false';
  root.dispatchEvent(new CustomEvent('lm-pause', { detail: { paused: on } }));
}

function syncPauseButtons(scope: ParentNode, on: boolean): void {
  for (const btn of scope.querySelectorAll<HTMLButtonElement>(
    'button.lm-sky-pause',
  )) {
    btn.setAttribute('aria-pressed', String(on));
    const label = btn.querySelector('.lm-pl');
    const text = on ? 'Play sky' : 'Pause sky';
    if (label) label.textContent = text;
    if (btn.hasAttribute('aria-label')) btn.setAttribute('aria-label', text);
  }
}

/**
 * Wraps a `.lm-sky-head` header. Adds the sky layers when the server did not,
 * pauses every loop while the header is off-screen (`.lm-sky-off`), and wires
 * `button.lm-sky-pause` to the lm-pause contract (`html.paused` + `lm-pause` event).
 * concept="cruise" is M1 Cruise (the default). `compact` is the still post strip.
 */
export class LmSkyHeader extends HTMLElement {
  private observer: IntersectionObserver | null = null;
  private wired = false;
  private readonly onPause = (event: Event): void => {
    const paused = (event as CustomEvent<{ paused: boolean }>).detail?.paused;
    syncPauseButtons(this, Boolean(paused));
  };

  connectedCallback(): void {
    const head = this.querySelector<HTMLElement>('.lm-sky-head') ?? this;
    const compact = this.hasAttribute('compact');
    head.classList.add('lm-sky-head');
    head.classList.toggle('lm-sky-head--compact', compact);
    if ((this.getAttribute('concept') ?? 'cruise') === 'cruise')
      head.classList.add('lm-cruise');
    if (!head.querySelector(':scope > .lm-sky'))
      head.insertAdjacentHTML('afterbegin', skyLayersHtml({ compact }));

    if (!this.wired) {
      this.wired = true;
      this.addEventListener('click', (event) => {
        const btn = (event.target as Element | null)?.closest?.(
          'button.lm-sky-pause',
        );
        if (btn) setPaused(btn.getAttribute('aria-pressed') !== 'true');
      });
    }
    syncPauseButtons(
      this,
      document.documentElement.classList.contains('paused'),
    );
    document.documentElement.addEventListener('lm-pause', this.onPause);

    if (!this.observer && 'IntersectionObserver' in globalThis) {
      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) head.classList.toggle('lm-sky-off', !entry.isIntersecting);
      });
      this.observer.observe(head);
    }
  }

  disconnectedCallback(): void {
    this.observer?.disconnect();
    this.observer = null;
    document.documentElement.removeEventListener('lm-pause', this.onPause);
  }
}

export function defineLmSkyHeader(): void {
  if (!customElements.get('lm-sky-header'))
    customElements.define('lm-sky-header', LmSkyHeader);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-sky-header': LmSkyHeader;
  }
}
