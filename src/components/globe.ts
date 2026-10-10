import { globe as globeMarkup } from '../illustrations/svg/globe.ts';
import { type GlobeRoute, parseRoute } from './globe-route.ts';
import { motionReduced } from './motion.ts';

let globeSeq = 0;

export class LmGlobe extends HTMLElement {
  private button: HTMLButtonElement | null = null;
  private overlay: HTMLElement | null = null;
  private closeBtn: HTMLButtonElement | null = null;
  private stage: HTMLElement | null = null;
  private raf = 0;

  connectedCallback(): void {
    if (this.button) return;
    const id = `lm-globe-${++globeSeq}`;
    const titleId = `${id}-title`;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'lm-globe-btn';
    button.setAttribute('aria-label', 'Open route map');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-controls', id);
    button.innerHTML = globeMarkup.replaceAll('__id__', `${id}-mini`);
    const overlay = document.createElement('div');
    overlay.className = 'lm-globe-overlay';
    overlay.id = id;
    overlay.hidden = true;
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', titleId);
    const panel = document.createElement('div');
    panel.className = 'lm-globe-panel';
    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'lm-globe-close';
    close.setAttribute('aria-label', 'Close route map');
    close.textContent = '×';
    const h = document.createElement('h2');
    h.id = titleId;
    h.textContent = this.getAttribute('heading') ?? 'Route';
    const p = document.createElement('p');
    const description = this.getAttribute('description');
    p.hidden = !description;
    p.textContent = description ?? '';
    const stage = document.createElement('div');
    stage.className = 'lm-globe-stage';
    stage.setAttribute('aria-hidden', 'true');
    panel.append(close, h, p, stage);
    overlay.append(panel);
    button.addEventListener('click', () =>
      overlay.hidden ? this.open() : this.close(),
    );
    close.addEventListener('click', () => this.close());
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) this.close();
    });
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        this.close();
      }
      if (event.key === 'Tab') this.trap(event);
    });
    this.button = button;
    this.overlay = overlay;
    this.closeBtn = close;
    this.stage = stage;
    this.append(button, overlay);
    this.paint(motionReduced() ? 1 : 0, false);
  }

  disconnectedCallback(): void {
    if (this.raf) cancelAnimationFrame(this.raf);
  }

  private route(): GlobeRoute {
    return parseRoute(this.getAttribute('route'));
  }

  private paint(reveal: number, animate: boolean): void {
    const stage = this.stage;
    const button = this.button;
    if (!stage || !button) return;
    const route = this.route();
    const active = route.active ?? route.legs.length - 1;
    const legs = route.legs
      .map((d, i) => {
        const hot = i === active;
        const offset = animate ? 1 - reveal : 0;
        return `<path class="lm-leg" data-hot="${hot}" d="${d}" pathLength="1" stroke-dasharray="1" stroke-dashoffset="${hot ? offset : 0}" opacity="${hot ? 1 : 0.55}"/>`;
      })
      .join('');
    const pins = route.stops
      .map(
        (stop) =>
          `<g><circle cx="${stop.x}" cy="${stop.y}" r="9" fill="var(--lm-marigold)" stroke="var(--lm-ink)" stroke-width="3.5"/><circle cx="${stop.x}" cy="${stop.y}" r="3" fill="var(--lm-ink)"/></g>`,
      )
      .join('');
    const svg = `<svg viewBox="0 0 1000 1000" width="100%" height="100%">${globeMarkup
      .replaceAll('__id__', 'stage')
      .replace(/^<svg[^>]*>/, '')
      .replace(/<\/svg>$/, '')}${legs}${pins}</svg>`;
    stage.innerHTML = svg;
    if (!button.querySelector('svg'))
      button.innerHTML = globeMarkup.replaceAll('__id__', 'mini');
  }

  open(): void {
    const overlay = this.overlay;
    const button = this.button;
    if (!overlay || !button || !overlay.hidden) return;
    overlay.hidden = false;
    button.setAttribute('aria-expanded', 'true');
    this.closeBtn?.focus();
    if (motionReduced()) {
      this.paint(1, false);
      return;
    }
    const t0 = performance.now();
    const run = (now: number): void => {
      const reveal = Math.min(1, (now - t0) / 2200);
      this.paint(reveal, true);
      if (reveal < 1) this.raf = requestAnimationFrame(run);
    };
    this.raf = requestAnimationFrame(run);
  }

  close(): void {
    if (!this.overlay || !this.button || this.overlay.hidden) return;
    this.overlay.hidden = true;
    this.button.setAttribute('aria-expanded', 'false');
    if (this.raf) cancelAnimationFrame(this.raf);
    this.button.focus();
  }

  private trap(event: KeyboardEvent): void {
    const overlay = this.overlay;
    if (!overlay) return;
    const items = [
      ...overlay.querySelectorAll<HTMLElement>('button, a, [tabindex]'),
    ].filter((el) => !el.hasAttribute('disabled'));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}

export function defineLmGlobe(): void {
  if (!customElements.get('lm-globe'))
    customElements.define('lm-globe', LmGlobe);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-globe': LmGlobe;
  }
}
