import { avatar as avatarMarkup } from '../illustrations/svg/avatar.ts';
import { motionReduced } from './motion.ts';

const POSES = new Set([
  'wow',
  'wave',
  'read',
  'beach',
  'grad',
  'sleep',
  'wink',
  'eek',
]);

let avatarSeq = 0;

interface Parts {
  head: SVGGElement;
  face: SVGGElement;
  nose: SVGGElement;
  beard: SVGGElement;
  hair: SVGGElement;
  ears: SVGGElement;
  bun: SVGGElement;
  torso: SVGGElement;
  seat: SVGGElement;
}

function n(v: number): string {
  return String(Math.round(v * 10) / 10);
}

export class LmAvatar extends HTMLElement {
  private svg: SVGSVGElement | null = null;
  private parts: Parts | null = null;
  private blinkT = 0;
  private glanceT = 0;
  private raf = 0;
  private last = 0;
  private x = 0;
  private y = 0;
  private vx = 0;
  private vy = 0;
  private bx = 0;
  private by = 0;
  private bvx = 0;
  private bvy = 0;
  private glance: [number, number] = [0, 0];
  private onMotion = (): void => this.sync();
  private onPause = (): void => this.sync();

  static get observedAttributes(): string[] {
    return ['pose', 'note'];
  }

  connectedCallback(): void {
    if (!this.svg) {
      const prefix = `a${++avatarSeq}`;
      const wrap = document.createElement('div');
      wrap.innerHTML = avatarMarkup.replaceAll('__id__', prefix);
      const svg = wrap.querySelector('svg');
      if (!svg) return;
      svg.setAttribute('role', 'img');
      const label = this.getAttribute('label') ?? 'Luis at the window';
      svg.setAttribute('aria-label', label);
      this.svg = svg;
      this.append(svg);
      const q = (sel: string) => svg.querySelector(sel) as SVGGElement;
      this.parts = {
        head: q('.lu-head'),
        face: q('.lu-face'),
        nose: q('.lu-nose'),
        beard: q('.lu-beard'),
        hair: q('.lu-hair'),
        ears: q('.lu-ears'),
        bun: q('.lu-bun'),
        torso: q('.lu-torso'),
        seat: q('.lu-seat'),
      };
      this.parts.head.style.transformOrigin = '100px 172px';
      this.parts.torso.style.transformOrigin = '100px 240px';
      document.documentElement.addEventListener('lm-motion', this.onMotion);
      document.documentElement.addEventListener('lm-pause', this.onPause);
    }
    this.applyPose();
    this.sync();
  }

  disconnectedCallback(): void {
    this.stop();
    document.documentElement.removeEventListener('lm-motion', this.onMotion);
    document.documentElement.removeEventListener('lm-pause', this.onPause);
  }

  attributeChangedCallback(): void {
    this.applyPose();
    this.sync();
  }

  private poseName(): string {
    const pose = this.getAttribute('pose') ?? '';
    return POSES.has(pose) ? pose : '';
  }

  private applyPose(): void {
    const svg = this.svg;
    if (!svg) return;
    for (const name of POSES) svg.classList.remove(`ex-${name}`);
    const pose = this.poseName();
    if (pose) svg.classList.add(`ex-${pose}`);
    const note = this.querySelector('.lm-note');
    const text = this.getAttribute('note');
    if (text && !note) {
      const p = document.createElement('p');
      p.className = 'lm-note';
      p.textContent = text;
      this.append(p);
    } else if (!text && note) {
      note.remove();
    } else if (text && note) {
      note.textContent = text;
    }
  }

  private frozen(): boolean {
    return (
      motionReduced() ||
      document.documentElement.classList.contains('paused') ||
      this.hasAttribute('static')
    );
  }

  private sync(): void {
    this.stop();
    if (this.frozen()) {
      if (this.poseName() === 'sleep') this.pose(-0.35, 0.5, 9);
      else this.pose(0, 0, 0);
      return;
    }
    this.blinkLoop();
    this.glanceLoop();
  }

  private stop(): void {
    window.clearTimeout(this.blinkT);
    window.clearTimeout(this.glanceT);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.svg?.classList.remove('blink');
  }

  private blinkLoop(): void {
    this.blinkT = window.setTimeout(
      () => {
        if (this.frozen()) return;
        if (this.poseName() !== 'sleep' && this.svg) {
          this.svg.classList.add('blink');
          window.setTimeout(
            () => this.svg?.classList.remove('blink'),
            120 + Math.random() * 40,
          );
        }
        this.blinkLoop();
      },
      2400 + Math.random() * 3200,
    );
  }

  private glanceLoop(): void {
    this.glanceT = window.setTimeout(
      () => {
        if (this.frozen()) return;
        const r = Math.random();
        this.glance =
          r < 0.4
            ? [0, 0]
            : [(Math.random() * 2 - 1) * 0.5, (Math.random() * 2 - 1) * 0.3];
        this.kick();
        this.glanceLoop();
      },
      1600 + Math.random() * 2400,
    );
  }

  private kick(): void {
    if (this.raf) return;
    this.last = 0;
    this.raf = requestAnimationFrame((now) => this.tick(now));
  }

  private tick(now: number): void {
    this.raf = 0;
    if (this.frozen() || !this.parts) return;
    const dt = Math.min(0.05, this.last ? (now - this.last) / 1000 : 1 / 60);
    this.last = now;
    let tx = this.glance[0];
    let ty = this.glance[1];
    if (this.poseName() === 'sleep') {
      tx = -0.35;
      ty = 0.5;
    }
    const kk = 70;
    const cc = 2 * 0.72 * Math.sqrt(kk);
    this.vx += ((tx - this.x) * kk - this.vx * cc) * dt;
    this.vy += ((ty - this.y) * kk - this.vy * cc) * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const kb = 120;
    const cb = 2 * 0.3 * Math.sqrt(kb);
    this.bvx += ((-this.vx * 0.9 - this.bx) * kb - this.bvx * cb) * dt;
    this.bvy += ((-this.vy * 0.6 - this.by) * kb - this.bvy * cb) * dt;
    this.bx += this.bvx * dt;
    this.by += this.bvy * dt;
    this.pose(this.x, this.y, this.poseName() === 'sleep' ? 9 : 0);
    const moving =
      Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.bvx) > 0.004 ||
      Math.abs(tx - this.x) + Math.abs(ty - this.y) > 0.002;
    if (moving) this.raf = requestAnimationFrame((t) => this.tick(t));
  }

  private pose(x: number, y: number, tilt: number): void {
    const p = this.parts;
    if (!p) return;
    p.head.style.transform = `translate(${n(x * 3)}px,${n(y * 2)}px) rotate(${n(x * 4.5 + tilt)}deg)`;
    p.face.style.transform = `translate(${n(x * 7.5)}px,${n(y * 4.5)}px)`;
    p.nose.style.transform = `translate(${n(x * 2.6)}px,${n(y * 1.2)}px)`;
    p.beard.style.transform = `translate(${n(x * 3.6)}px,${n(y * 2.2)}px)`;
    p.hair.style.transform = `translate(${n(x * 1.6)}px,${n(y * -0.8)}px)`;
    p.ears.style.transform = `translate(${n(-x * 3.4)}px,${n(y)}px)`;
    p.bun.style.transform = `translate(${n(-x * 5 + this.bx * 6)}px,${n(-y * 2.4 + this.by * 4)}px)`;
    p.torso.style.transform = `rotate(${n(x * 1.3)}deg)`;
    p.seat.style.transform = `translate(${n(-x * 2.2)}px,0)`;
  }
}

export function defineLmAvatar(): void {
  if (!customElements.get('lm-avatar'))
    customElements.define('lm-avatar', LmAvatar);
}

declare global {
  interface HTMLElementTagNameMap {
    'lm-avatar': LmAvatar;
  }
}
