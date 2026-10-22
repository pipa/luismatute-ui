import { globe as globeMarkup } from '../illustrations/svg/globe.ts';
import { planeTop } from '../illustrations/svg/plane-top.ts';
import {
  type GlobeRoute,
  LEG_OPACITY,
  parseRoute,
  resolveStop,
  routeState,
} from './globe-route.ts';
import { applyMotionPreference } from './motion.ts';

const SVG_NS = 'http://www.w3.org/2000/svg';

let globeSeq = 0;

export class LmGlobe extends HTMLElement {
  private button: HTMLButtonElement | null = null;
  private overlay: HTMLDialogElement | null = null;
  private closeBtn: HTMLButtonElement | null = null;
  private stage: HTMLElement | null = null;
  private stageSvg: SVGSVGElement | null = null;

  static get observedAttributes(): string[] {
    return ['stop'];
  }

  attributeChangedCallback(
    name: string,
    old: string | null,
    now: string | null,
  ): void {
    if (name !== 'stop' || old === now || !this.stageSvg) return;
    this.drawRoute(this.stageSvg);
  }

  /** The resolved stop: the `stop` attribute, else `html[data-theme]`. */
  get currentStop(): string | null {
    return resolveStop(
      this.getAttribute('stop'),
      document.documentElement.getAttribute('data-theme'),
    );
  }

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
    const overlay = document.createElement('dialog');
    overlay.className = 'lm-globe-overlay';
    overlay.id = id;
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
    stage.id = `${id}-stage`;
    stage.setAttribute('aria-hidden', 'true');
    panel.append(close, h, p, stage);
    overlay.append(panel);
    button.addEventListener('click', () =>
      overlay.open ? this.close() : this.open(),
    );
    close.addEventListener('click', () => this.close());
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) this.close();
    });
    overlay.addEventListener('cancel', (event) => {
      event.preventDefault();
      this.close();
    });
    overlay.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
      if (event.key === 'Tab') this.trap(event);
    });
    overlay.addEventListener('close', () => this.syncClosed());
    this.button = button;
    this.overlay = overlay;
    this.closeBtn = close;
    this.stage = stage;
    this.append(button, overlay);
    this.buildStage(id);
  }

  disconnectedCallback(): void {
    this.overlay?.close();
  }

  private route(): GlobeRoute {
    return parseRoute(this.getAttribute('route'));
  }

  private buildStage(id: string): void {
    const stage = this.stage;
    if (!stage || this.stageSvg) return;
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 1000 1000');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('fill', 'none');
    const holder = document.createElement('div');
    holder.innerHTML = globeMarkup.replaceAll('__id__', `${id}-map`);
    const source = holder.querySelector('svg');
    if (source) {
      while (source.firstChild) svg.append(source.firstChild);
    }
    for (const circle of svg.querySelectorAll('circle')) {
      if (circle.hasAttribute('stroke') && !circle.hasAttribute('fill'))
        circle.setAttribute('fill', 'none');
    }
    this.drawRoute(svg);
    stage.append(svg);
    this.stageSvg = svg;
  }

  private drawRoute(svg: SVGSVGElement): void {
    for (const el of svg.querySelectorAll('.lm-leg, .lm-pin, .lm-plane'))
      el.remove();
    const route = this.route();
    const state = routeState(
      route,
      resolveStop(
        this.getAttribute('stop'),
        document.documentElement.getAttribute('data-theme'),
      ),
    );
    for (const [i, d] of route.legs.entries()) {
      const leg = state.legs[i] ?? 'past';
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('class', 'lm-leg');
      path.setAttribute('data-hot', leg === 'hot' ? 'true' : 'false');
      path.setAttribute('data-leg', leg);
      path.setAttribute('d', d);
      path.setAttribute('fill', 'none');
      if (leg !== 'hot') path.setAttribute('opacity', String(LEG_OPACITY[leg]));
      svg.append(path);
    }
    for (const [i, stop] of route.stops.entries()) {
      if (!Number.isFinite(stop.x) || !Number.isFinite(stop.y)) continue;
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'lm-pin');
      const o = state.pins[i] ?? 1;
      g.setAttribute('data-current', o === 1 ? 'true' : 'false');
      if (o !== 1) g.setAttribute('opacity', String(o));
      const outer = document.createElementNS(SVG_NS, 'circle');
      outer.setAttribute('cx', String(stop.x));
      outer.setAttribute('cy', String(stop.y));
      outer.setAttribute('r', '9');
      outer.setAttribute('fill', 'var(--lm-marigold)');
      outer.setAttribute('stroke', 'var(--lm-ink)');
      outer.setAttribute('stroke-width', '3.5');
      const inner = document.createElementNS(SVG_NS, 'circle');
      inner.setAttribute('cx', String(stop.x));
      inner.setAttribute('cy', String(stop.y));
      inner.setAttribute('r', '3');
      inner.setAttribute('fill', 'var(--lm-ink)');
      g.append(outer, inner);
      svg.append(g);
    }
    if (state.plane) {
      // live: translate(x y) rotate(deg) scale(0.62) translate(-60 -50)
      const { x, y, deg } = state.plane;
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('class', 'lm-plane');
      g.setAttribute(
        'transform',
        `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(1)}) scale(0.62) translate(-60 -50)`,
      );
      // the art's 120×100 box, inlined (no nested <svg>)
      g.setAttribute('fill', 'none');
      g.innerHTML = planeTop.replace(/^<svg[^>]*>/, '').replace(/<\/svg>$/, '');
      svg.append(g);
    }
  }

  open(): void {
    const overlay = this.overlay;
    const button = this.button;
    if (!overlay || !button || overlay.open) return;
    overlay.showModal();
    button.setAttribute('aria-expanded', 'true');
    this.classList.add('is-open');
    this.closeBtn?.focus();
  }

  close(): void {
    const overlay = this.overlay;
    if (!overlay?.open) return;
    overlay.close();
  }

  private syncClosed(): void {
    this.classList.remove('is-open');
    this.button?.setAttribute('aria-expanded', 'false');
    if (
      document.activeElement &&
      this.overlay?.contains(document.activeElement)
    )
      this.button?.focus();
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
  applyMotionPreference();
  if (!customElements.get('lm-globe'))
    customElements.define('lm-globe', LmGlobe);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-globe': LmGlobe;
  }
}
