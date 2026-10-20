import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineLmAvatar } from '../src/components/avatar.ts';
import { defineLmCard } from '../src/components/card.ts';
import { defineLmChip } from '../src/components/chip.ts';
import { defineLmFlightPlan } from '../src/components/flight-plan.ts';
import { defineLmGlobe } from '../src/components/globe.ts';
import { defaultRoute } from '../src/components/globe-route.ts';
import { defineLmMore } from '../src/components/more.ts';
import {
  MOTION_KEY,
  motionReduced,
  readMotionPreference,
  writeMotionPreference,
} from '../src/components/motion.ts';
import { defineLmMotionToggle } from '../src/components/motion-toggle.ts';
import { defineLmPause } from '../src/components/pause.ts';
import { defineLmShot } from '../src/components/shot.ts';
import {
  deprecatedIllustrations,
  illustrations,
  inlineIllustration,
} from '../src/illustrations/index.ts';
import { duration, skin } from '../src/tokens/tokens.ts';

function media(matches: boolean): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false;
    },
  }));
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.className = '';
  document.documentElement.removeAttribute('data-motion');
  document.documentElement.removeAttribute('data-paused');
  document.body.replaceChildren();
  history.replaceState(null, '', '/');
  media(false);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe('lm-card', () => {
  it('defaults to the stop variant', () => {
    defineLmCard();
    const card = document.createElement('lm-card');
    document.body.append(card);
    expect(card.getAttribute('variant')).toBe('stop');
    card.setAttribute('variant', 'pass');
    expect(card.getAttribute('variant')).toBe('pass');
  });
});

describe('lm-chip', () => {
  it('adds and removes the featured badge', () => {
    defineLmChip();
    const chip = document.createElement('lm-chip');
    chip.textContent = 'Featured client';
    chip.setAttribute('variant', 'featured');
    document.body.append(chip);
    expect(chip.querySelector('b')?.textContent).toBe('Featured');
    chip.removeAttribute('variant');
    expect(chip.querySelector('b')).toBeNull();
    expect(chip.textContent).toContain('Featured client');
  });
});

describe('lm-more', () => {
  it('opens and closes with aria-expanded and aria-controls', () => {
    defineLmMore();
    const more = document.createElement('lm-more');
    more.setAttribute('label', 'More');
    more.setAttribute('panel', 'more-example');
    more.textContent = 'Led several full redesigns.';
    document.body.append(more);
    const button = more.querySelector('button');
    const body = more.querySelector<HTMLElement>('.lm-more-body');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-controls')).toBe('more-example');
    expect(body?.id).toBe('more-example');
    expect(body?.hidden).toBe(true);
    expect(body?.textContent).toContain('Led several full redesigns.');
    button?.click();
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(body?.hidden).toBe(false);
    button?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }),
    );
    button?.click();
    expect(more.open).toBe(false);
    expect(body?.hidden).toBe(true);
  });
});

describe('lm-motion-toggle', () => {
  it('persists Just the info and sets data-motion', () => {
    defineLmMotionToggle();
    const toggle = document.createElement('lm-motion-toggle');
    document.body.append(toggle);
    const button = toggle.querySelector('button');
    expect(button?.hasAttribute('aria-pressed')).toBe(false);
    expect(toggle.hasAttribute('aria-pressed')).toBe(false);
    expect(button?.getAttribute('data-pressed')).toBe('false');
    expect(button?.textContent).toContain('Just the info');
    expect(document.documentElement.dataset.motion).toBe('full');
    button?.click();
    expect(button?.getAttribute('data-pressed')).toBe('true');
    expect(button?.textContent).toContain('Full flight');
    expect(localStorage.getItem(MOTION_KEY)).toBe('calm');
    expect(document.documentElement.dataset.motion).toBe('calm');
    expect(document.documentElement.classList.contains('is-static')).toBe(true);
    expect(document.documentElement.classList.contains('is-calm')).toBe(true);
    button?.click();
    expect(localStorage.getItem(MOTION_KEY)).toBe('full');
    expect(document.documentElement.dataset.motion).toBe('full');
  });

  it('honours ?motion=reduce over storage and ?motion=on over prefers-reduced-motion', () => {
    localStorage.setItem(MOTION_KEY, 'full');
    history.replaceState(null, '', '/?motion=reduce');
    expect(readMotionPreference()).toBe('reduce');
    history.replaceState(null, '', '/?motion=on');
    media(true);
    expect(readMotionPreference()).toBe('full');
    history.replaceState(null, '', '/');
    localStorage.clear();
    expect(readMotionPreference()).toBe('reduce');
  });

  it('reads Info as calm and keeps explicit off on the query', () => {
    history.replaceState(null, '', '/?motion=calm');
    expect(readMotionPreference()).toBe('calm');
    history.replaceState(null, '', '/?motion=info');
    expect(readMotionPreference()).toBe('calm');
    history.replaceState(null, '', '/?motion=off');
    localStorage.setItem(MOTION_KEY, 'calm');
    expect(readMotionPreference()).toBe('reduce');
    history.replaceState(null, '', '/');
    localStorage.setItem(MOTION_KEY, 'reduce');
    expect(readMotionPreference()).toBe('calm');
    writeMotionPreference('reduce');
    expect(localStorage.getItem(MOTION_KEY)).toBe('off');
    expect(readMotionPreference()).toBe('reduce');
    document.documentElement.dataset.motion = 'calm';
    media(false);
    expect(motionReduced()).toBe(false);
    media(true);
    expect(motionReduced()).toBe(true);
    document.documentElement.dataset.motion = 'full';
    expect(motionReduced()).toBe(false);
  });

  it('reads prefers-reduced-motion when data-motion is unset', () => {
    document.documentElement.removeAttribute('data-motion');
    media(true);
    expect(motionReduced()).toBe(true);
    media(false);
    expect(motionReduced()).toBe(false);
    document.documentElement.dataset.motion = 'full';
    media(true);
    expect(motionReduced()).toBe(false);
  });
});

describe('lm-pause', () => {
  it('toggles aria-pressed and the paused flag', () => {
    defineLmPause();
    document.documentElement.dataset.motion = 'full';
    const pause = document.createElement('lm-pause');
    document.body.append(pause);
    const button = pause.querySelector('button');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(pause.hasAttribute('aria-pressed')).toBe(false);
    expect(button?.textContent).toContain('Pause animation');
    button?.click();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(pause.hasAttribute('aria-pressed')).toBe(false);
    expect(document.documentElement.classList.contains('paused')).toBe(true);
    expect(document.documentElement.dataset.paused).toBe('true');
    button?.click();
    expect(document.documentElement.classList.contains('paused')).toBe(false);
  });
});

describe('lm-shot', () => {
  it('links the framed shot out with an accessible hint', () => {
    defineLmShot();
    const shot = document.createElement('lm-shot');
    shot.setAttribute('href', 'https://example.com/');
    shot.setAttribute('src', 'shots/example-600.webp');
    shot.setAttribute('chrome', 'example.com');
    shot.setAttribute('caption', 'example.com');
    document.body.append(shot);
    const link = shot.querySelector('a');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toContain('noopener');
    expect(link?.rel).toContain('noreferrer');
    expect(link?.querySelector('.lm-vh')?.textContent).toBe(
      ' (opens in a new tab)',
    );
    expect(shot.querySelector('.lm-shot-chrome')?.textContent).toContain(
      'example.com',
    );
    expect(shot.querySelector('img')?.getAttribute('src')).toBe(
      'shots/example-600.webp',
    );
  });

  it('wraps a light-DOM image instead of replacing the link', () => {
    defineLmShot();
    const shot = document.createElement('lm-shot');
    shot.setAttribute('chrome', 'example.com');
    shot.innerHTML =
      '<a href="https://example.com"><img src="shots/example-600.webp" alt="" /></a>';
    document.body.append(shot);
    const link = shot.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.querySelector('.lm-shot-frame img')?.getAttribute('src')).toBe(
      'shots/example-600.webp',
    );
    expect(shot.querySelectorAll('a')).toHaveLength(1);
  });
});

describe('lm-flight-plan', () => {
  it('renders anchor rows and ignores broken JSON', () => {
    defineLmFlightPlan();
    const plan = document.createElement('lm-flight-plan');
    plan.setAttribute(
      'stops',
      JSON.stringify([
        {
          href: '#stop-one',
          years: '2010–2014',
          label: 'Stop one, Example Co.',
        },
        { href: '#stop-example', years: '2011–2017', label: 'Example Co.' },
      ]),
    );
    document.body.append(plan);
    const links = plan.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[1]?.getAttribute('href')).toBe('#stop-example');
    expect(links[1]?.className).toBe('lm-plan-jump');
    expect(links[1]?.textContent).toContain('Example Co.');
    const broken = document.createElement('lm-flight-plan');
    broken.setAttribute('stops', '{');
    expect(() => document.body.append(broken)).not.toThrow();
    expect(broken.querySelectorAll('a')).toHaveLength(0);
    const kept = document.createElement('lm-flight-plan');
    kept.setAttribute('stops', '{');
    kept.innerHTML =
      '<a href="#stop-one"><span class="lm-yr">2010–2014</span><span class="lm-name">Stop one, Example Co.</span></a>';
    document.body.append(kept);
    expect(kept.querySelectorAll('a')).toHaveLength(1);
    expect(kept.querySelector('a')?.getAttribute('href')).toBe('#stop-one');
    const early = document.createElement('lm-flight-plan');
    Object.defineProperty(early, 'stops', {
      value: [
        {
          href: '#stop-one',
          years: '2010–2014',
          label: 'Stop one, Example Co.',
        },
        { href: '#stop-example', years: '2011–2017', label: 'Example Co.' },
      ],
      writable: true,
      configurable: true,
    });
    document.body.append(early);
    expect(early.querySelectorAll('a')).toHaveLength(2);
    expect(early.querySelectorAll('a')[1]?.textContent).toContain(
      'Example Co.',
    );
  });
});

describe('lm-globe', () => {
  it('opens the route overlay and closes on Escape', () => {
    defineLmGlobe();
    document.documentElement.dataset.motion = 'reduce';
    const globe = document.createElement('lm-globe');
    globe.setAttribute('heading', 'Route');
    globe.setAttribute('description', 'Four example stops.');
    document.body.append(globe);
    const button = globe.querySelector('.lm-globe-btn');
    const overlay = globe.querySelector('.lm-globe-overlay');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(overlay?.getAttribute('role')).toBe('dialog');
    expect((overlay as HTMLDialogElement).open).toBe(false);
    const stageSvg = globe.querySelector('.lm-globe-stage svg');
    expect(stageSvg?.getAttribute('fill')).toBe('none');
    const outline = [...(stageSvg?.querySelectorAll('circle') ?? [])].find(
      (circle) =>
        circle.getAttribute('r') === '500' && circle.hasAttribute('stroke'),
    );
    expect(outline?.getAttribute('fill')).toBe('none');
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect((overlay as HTMLDialogElement).open).toBe(true);
    expect(overlay?.querySelectorAll('.lm-leg').length).toBe(4);
    overlay?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect((overlay as HTMLDialogElement).open).toBe(false);
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    const second = document.createElement('lm-globe');
    document.body.append(second);
    const firstClip = globe.querySelector('clipPath')?.id;
    const secondClip = second.querySelector('clipPath')?.id;
    expect(firstClip).toBeTruthy();
    expect(secondClip).toBeTruthy();
    expect(firstClip).not.toBe(secondClip);
  });

  it('builds route geometry as attributes, not markup', () => {
    defineLmGlobe();
    const globe = document.createElement('lm-globe');
    globe.setAttribute(
      'route',
      JSON.stringify({
        stops: [{ id: 'x', label: '<b>nope</b>', x: 10, y: 20 }],
        legs: ['M0 0"><img alt="xss">'],
        active: 0,
      }),
    );
    document.body.append(globe);
    const leg = globe.querySelector('.lm-leg');
    expect(leg?.getAttribute('d')).toBe('M0 0"><img alt="xss">');
    expect(globe.querySelector('.lm-globe-stage img')).toBeNull();
    expect(globe.querySelector('.lm-pin circle')?.getAttribute('cx')).toBe(
      '10',
    );
  });
});

// Real route places (Sentinel, #58) and real career content (#59). The bio
// terms are case-sensitive so art ids like
// island-sandals (public API names) don't trip them; the copy does.
const BIO =
  /Sandals|Fluky|Booking\.com|sandals\.com|beaches\.com|American Airlines|BSc Computer|Catch Advisory/;
const PLACES =
  /Honduras|Roat[aá]n|Amsterdam|Netherlands|Caribbean|Miami|San Pedro|Tegucigalpa/i;
const BANNED =
  /Honduras|Roat[aá]n|Amsterdam|Netherlands|Caribbean|Miami|San Pedro|Tegucigalpa|Sandals|Booking\.com|Fluky/i;

describe('lm-globe night palette and dashed route (#57)', () => {
  const css = readFileSync(resolve('src/styles/base.css'), 'utf8');
  const block = (sel: string) => {
    const i = css.indexOf(`${sel} {`);
    expect(i, sel).toBeGreaterThan(-1);
    return css.slice(i, css.indexOf('}', i));
  };

  it('ships one night token map keyed on data-mode', () => {
    const night = block('html[data-mode="night"] lm-globe');
    expect(night).toContain('--lm-globe-deep: #2a3266');
    expect(night).toContain('--lm-globe-ocean: #1f254e');
    expect(night).toContain('--lm-globe-shade: #1a1f43');
    expect(night).toContain('--lm-globe-land: #24402f');
    expect(night).toContain('--lm-globe-line: #3a4380');
    expect(night).not.toMatch(/filter|marigold|tomato/);
  });

  it('scopes night outlines to the rim and land, not route or pins', () => {
    const i = css.indexOf(
      'html[data-mode="night"] lm-globe svg > circle[stroke]',
    );
    const sel = css.slice(i, css.indexOf('{', i));
    expect(sel).toContain('svg > g > path[stroke]');
    expect(sel).not.toMatch(/lm-leg|lm-pin|svg path\b/);
    const globeCss = css.slice(
      css.indexOf('/* ---------- globe'),
      css.indexOf('@keyframes lm-globe-reveal'),
    );
    expect(globeCss).not.toMatch(/filter\s*:|mix-blend/);
  });

  it('has a dashed route matching the live globe', () => {
    const dash = block('lm-globe[route-style="dashed"] .lm-leg');
    expect(dash).toContain('stroke: var(--lm-tomato)');
    expect(dash).toContain('stroke-dasharray: 13.64 8.36');
    expect(dash).toContain('stroke-linecap: round');
    expect(dash).not.toContain('data-mode');
    expect(block('lm-globe .lm-leg')).toContain(
      'vector-effect: non-scaling-stroke',
    );
  });

  it('default route is generic: four legs, last one long and hot', () => {
    expect(defaultRoute.legs).toHaveLength(4);
    expect(defaultRoute.active).toBe(3);
    for (const stop of defaultRoute.stops)
      expect(stop.label).toMatch(/^Stop [A-Z]$/);
    const first = defaultRoute.stops[0];
    const last = defaultRoute.stops.at(-1);
    expect(first && last).toBeTruthy();
    if (first && last)
      expect(Math.hypot(last.x - first.x, last.y - first.y)).toBeGreaterThan(
        400,
      );
    const src = readFileSync(resolve('src/components/globe-route.ts'), 'utf8');
    expect(src).not.toMatch(BANNED);
  });

  it('docs/*.html and site/src/** carry no real route or bio terms', () => {
    const walk = (dir: string): string[] =>
      readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory()
          ? walk(resolve(dir, e.name))
          : /\.(html|astro|ts|mjs|js|md|mdx|css|json)$/.test(e.name)
            ? [resolve(dir, e.name)]
            : [],
      );
    const files = [
      ...readdirSync(resolve('docs'))
        .filter((f) => f.endsWith('.html'))
        .map((f) => resolve('docs', f)),
      ...walk(resolve('site/src')),
    ];
    expect(files.length).toBeGreaterThan(20);
    for (const f of files) {
      const text = readFileSync(f, 'utf8');
      expect(text, f).not.toMatch(PLACES);
      expect(text, f).not.toMatch(BIO);
    }
  });

  it('illustration art text carries no employer or place names', () => {
    const dir = resolve('src/illustrations/files');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.svg'))) {
      const text = readFileSync(resolve(dir, f), 'utf8');
      expect(text, f).not.toMatch(PLACES);
      expect(text, f).not.toMatch(BIO);
    }
  });

  // Sentinel (#61): Muse's copy fixes stay fixed in the art and in the shipped dist/.
  it('illustration art has no Factory sign or hard-coded 2017 (src and dist)', () => {
    for (const dir of ['src/illustrations/files', 'dist/illustrations']) {
      for (const f of readdirSync(resolve(dir)).filter((n) => n.endsWith('.svg'))) {
        const text = readFileSync(resolve(dir, f), 'utf8');
        expect(text, `${dir}/${f}`).not.toMatch(/>\s*Factory\s*</);
        expect(text, `${dir}/${f}`).not.toMatch(/>\s*2017\s*</);
      }
    }
  });

  it('dist/illustrations SVGs match src/illustrations/files (dist rebuilt)', () => {
    const src = resolve('src/illustrations/files');
    for (const f of readdirSync(src).filter((n) => n.endsWith('.svg')))
      expect(readFileSync(resolve('dist/illustrations', f), 'utf8'), f).toBe(
        readFileSync(resolve(src, f), 'utf8'),
      );
  });

  it('the scan still catches the terms it bans', () => {
    expect('Front-end developer, Sandals Resorts').toMatch(BIO);
    expect('Booking.com').toMatch(BIO);
    expect('Fluky Factory').toMatch(BIO);
    expect('Born in Honduras').toMatch(PLACES);
    expect('island-sandals').not.toMatch(BIO);
  });

  it('draws the default route when no route attribute is set', () => {
    defineLmGlobe();
    const globe = document.createElement('lm-globe');
    globe.setAttribute('route-style', 'dashed');
    document.body.append(globe);
    expect(globe.querySelectorAll('.lm-leg')).toHaveLength(4);
    expect(globe.querySelectorAll('.lm-pin')).toHaveLength(5);
    expect(
      globe.querySelector('.lm-leg[data-hot="true"]')?.getAttribute('d'),
    ).toBe(defaultRoute.legs[3]);
  });
});

describe('lm-avatar', () => {
  it('applies a pose and does not blink when motion is reduced', () => {
    vi.useFakeTimers();
    defineLmAvatar();
    document.documentElement.dataset.motion = 'reduce';
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('pose', 'beach');
    avatar.setAttribute('static', '');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    expect(svg?.classList.contains('ex-beach')).toBe(true);
    expect(svg?.getAttribute('aria-label')).toBe('Luis at the window');
    vi.advanceTimersByTime(8000);
    expect(svg?.classList.contains('blink')).toBe(false);
  });

  it('stays still when the OS prefers reduced motion and no toggle has set data-motion', () => {
    vi.useFakeTimers();
    defineLmAvatar();
    document.documentElement.removeAttribute('data-motion');
    media(true);
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('pose', 'beach');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    const add = vi.spyOn(svg?.classList as DOMTokenList, 'add');
    const head = avatar.querySelector('.lu-head') as SVGGElement;
    const pose = head.style.transform;
    vi.advanceTimersByTime(20000);
    expect(add).not.toHaveBeenCalledWith('blink');
    expect(head.style.transform).toBe(pose);
    expect(document.documentElement.dataset.motion).toBeUndefined();
  });

  it('idles in calm while pause, OS reduce, and explicit off stop it', () => {
    vi.useFakeTimers();
    defineLmAvatar();
    document.documentElement.dataset.motion = 'calm';
    media(false);
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('motion', 'idle');
    avatar.setAttribute('pose', 'beach');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    const add = vi.spyOn(svg?.classList as DOMTokenList, 'add');
    vi.advanceTimersByTime(8000);
    expect(add).toHaveBeenCalledWith('blink');

    add.mockClear();
    document.documentElement.classList.add('paused');
    document.documentElement.dispatchEvent(new CustomEvent('lm-pause'));
    vi.advanceTimersByTime(8000);
    expect(add).not.toHaveBeenCalledWith('blink');

    document.documentElement.classList.remove('paused');
    document.documentElement.dispatchEvent(new CustomEvent('lm-pause'));
    add.mockClear();
    media(true);
    document.documentElement.dispatchEvent(
      new CustomEvent('lm-motion', { detail: { motion: 'calm' } }),
    );
    vi.advanceTimersByTime(8000);
    expect(add).not.toHaveBeenCalledWith('blink');

    media(false);
    document.documentElement.dataset.motion = 'reduce';
    document.documentElement.dispatchEvent(
      new CustomEvent('lm-motion', { detail: { motion: 'reduce' } }),
    );
    vi.advanceTimersByTime(8000);
    expect(add).not.toHaveBeenCalledWith('blink');
  });

  it('motion=off freezes idle in Flight, and full still overrides the OS', () => {
    vi.useFakeTimers();
    defineLmAvatar();
    document.documentElement.dataset.motion = 'full';
    media(true);
    const avatar = document.createElement('lm-avatar');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    const add = vi.spyOn(svg?.classList as DOMTokenList, 'add');
    vi.advanceTimersByTime(8000);
    expect(add).toHaveBeenCalledWith('blink');
    add.mockClear();
    avatar.setAttribute('motion', 'off');
    vi.advanceTimersByTime(8000);
    expect(add).not.toHaveBeenCalledWith('blink');
    avatar.setAttribute('motion', 'idle');
    document.documentElement.classList.add('paused');
    document.documentElement.dispatchEvent(new CustomEvent('lm-pause'));
    vi.advanceTimersByTime(8000);
    expect(add).not.toHaveBeenCalledWith('blink');
  });

  it('keeps motion and pause listeners after a DOM move', () => {
    defineLmAvatar();
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('static', '');
    const add = vi.spyOn(document.documentElement, 'addEventListener');
    document.body.append(avatar);
    expect(add).toHaveBeenCalledWith('lm-motion', expect.any(Function));
    expect(add).toHaveBeenCalledWith('lm-pause', expect.any(Function));
    const next = document.createElement('div');
    document.body.append(next);
    add.mockClear();
    next.append(avatar);
    expect(add).toHaveBeenCalledWith('lm-motion', expect.any(Function));
    expect(add).toHaveBeenCalledWith('lm-pause', expect.any(Function));
    document.documentElement.dataset.motion = 'reduce';
    document.documentElement.dispatchEvent(
      new CustomEvent('lm-motion', { detail: { motion: 'reduce' } }),
    );
    expect(avatar.querySelector('svg')?.classList.contains('blink')).toBe(
      false,
    );
  });

  it('tints the round lenses on the beach pose and draws no separate sunglasses', () => {
    defineLmAvatar();
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('pose', 'beach');
    avatar.setAttribute('static', '');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    expect(svg?.querySelector('.lu-glasses')).toBeNull();
    const shades = svg?.querySelector('.lu-shades');
    const lenses = shades?.querySelectorAll('circle');
    expect(lenses?.length).toBe(2);
    expect(lenses?.[0]?.getAttribute('r')).toBe('12.5');
    expect(lenses?.[0]?.getAttribute('opacity')).toBe(
      'var(--lm-lens-tint-opacity)',
    );
    expect(lenses?.[0]?.getAttribute('fill')).toBe('var(--lm-lens-tint)');
    expect(shades?.innerHTML).not.toContain('#3a2a22');
    expect(shades?.querySelectorAll('path').length).toBe(2);
  });

  it('raises his own arm and open hand for the wave pose', () => {
    defineLmAvatar();
    const avatar = document.createElement('lm-avatar');
    avatar.setAttribute('pose', 'wave');
    avatar.setAttribute('static', '');
    document.body.append(avatar);
    const svg = avatar.querySelector('svg');
    expect(svg?.classList.contains('ex-wave')).toBe(true);
    expect(svg?.querySelectorAll('.lu-finger').length).toBe(4);
    expect(svg?.querySelector('.lu-thumb')).not.toBeNull();
    expect(svg?.querySelector('.lu-hand')?.innerHTML).toContain(
      'var(--lm-skin)',
    );
    const wave = svg?.querySelector('.lu-wave');
    expect(wave?.closest('.lu-torso')).not.toBeNull();
    expect(wave?.innerHTML).toContain('var(--lm-marigold)');
  });
});

describe('illustrations', () => {
  it('recolours skin through tokens and keeps unique clip ids', () => {
    expect(illustrations.avatar).toContain('var(--lm-skin)');
    expect(illustrations.avatar).toContain('var(--lm-skin-beard)');
    expect(illustrations.avatar).not.toContain('--lu-');
    expect(illustrations.plane).not.toContain('--lu-');
    const one = inlineIllustration('avatar', 'seat-a');
    const two = inlineIllustration('avatar', 'seat-b');
    expect(one).toContain('lm-art');
    expect(one).toContain('seat-a');
    expect(one).not.toContain('__id__');
    expect(one).not.toContain('seat-b');
    expect(two).toContain('seat-b');
  });

  it('keeps the round glasses and beard, adds notches and a transform-only wave', () => {
    const svg = illustrations.avatar;
    expect(skin.skin).toBe('#c89a6b');
    expect(skin.d).toBe('#a57950');
    expect(skin.beard).toBe('#2a1c15');
    expect(svg).toContain(
      'd="M63 106c-2 36 9 65 37 72 28-7 39-36 37-72h-6c0 18-5 28-13 31-8-6-28-6-36 0-8-3-13-13-13-31Z"',
    );
    expect(svg).toContain('d="M86 162q14 8 28 0"');
    expect(svg).toContain(
      '<circle cx="85" cy="113" r="12.5" stroke="var(--lm-skin-tort)"',
    );
    expect(svg).toContain(
      '<circle cx="115" cy="113" r="12.5" stroke="var(--lm-skin-tort)"',
    );
    expect(svg).toContain(
      '<path fill="var(--lm-skin)" d="M83.1 149.9A3.5 3.5 0 0 1 89.9 148.3C90.9 152.1 90.7 157.8 88.8 158.3C86.9 158.8 84.1 153.8 83.1 149.9Z"/>',
    );
    expect(svg).toContain(
      '<path fill="var(--lm-skin)" d="M110.1 148.3A3.5 3.5 0 0 1 116.9 149.9C115.9 153.8 113.1 158.8 111.2 158.3C109.3 157.8 109.1 152.1 110.1 148.3Z"/>',
    );
    expect(svg).toContain('var(--lm-skin-highlight)');
    expect(svg).toContain('var(--lm-beard-line)');
    expect(svg).not.toContain('#e1ad84');
    expect(svg).not.toContain('#3f2a20');
    expect(skin.highlight).toBe('#e1ad84');
    expect(skin.beardLine).toBe('#3f2a20');
    expect(skin.lensTint).toBe('#3a2a22');
    expect(skin.lensTintOpacity).toBe('0.82');
    expect(skin.fade).toBe('#957a64');
    const hair = svg.slice(
      svg.indexOf('<g class="lu-hair">'),
      svg.indexOf('<g class="lu-beard">'),
    );
    expect(hair.match(/fill="var\(--lm-sideburn\)"/g)?.length).toBe(2);
    expect(hair.match(/fill="var\(--lm-skin-fade\)"/g)?.length).toBe(2);
    expect(svg).not.toContain('linearGradient');
    expect(svg).not.toContain('radialGradient');
    expect(svg).not.toContain('lu-glasses');
    expect(svg).not.toContain('#e2a17a');
    expect(svg.match(/class="lu-finger"/g)?.length).toBe(4);
    const css = readFileSync(resolve('src/styles/base.css'), 'utf8');
    expect(css).toContain('@keyframes lm-avatar-wave');
    expect(css).toContain('rotate(-14deg)');
    expect(css).toContain('rotate(14deg)');
    expect(css).toContain('transform-origin: 163px 108px;');
    expect(css).toContain('var(--lm-duration-avatar-wave)');
    expect(duration.avatarWave).toBe('4.2s');
    expect(duration.avatarWaveOnce).toBe('1.2s');
    expect(css).toContain('@media (prefers-reduced-motion: reduce)');
    expect(css).toContain('lm-avatar[static] .lu.ex-wave .lu-hand');
    const waveMotion = css.slice(
      css.indexOf('@keyframes lm-avatar-wave'),
      css.indexOf('@keyframes lm-bob'),
    );
    expect(waveMotion).toContain('transform: rotate');
    expect(waveMotion).not.toContain('translate');
  });
});

describe('deprecated island ids (#59)', () => {
  it('serves the same art under the new and the old ids', () => {
    for (const [from, to] of Object.entries(deprecatedIllustrations)) {
      expect(illustrations[to as keyof typeof illustrations]).toBe(
        illustrations[from as keyof typeof illustrations],
      );
      expect(inlineIllustration(from as never, 'x')).toBe(
        inlineIllustration(to as never, 'x'),
      );
    }
    expect(deprecatedIllustrations).toEqual({
      'island-sandals': 'island-resort',
      'island-fluky': 'island-studio',
    });
  });
});

describe('island-studio sign (#59)', () => {
  it('reads Demo Studio, not Factory', () => {
    const svg = inlineIllustration('island-studio', 'is-a');
    expect(svg).toMatch(/>Demo<\/text>/);
    expect(svg).toMatch(/>Studio<\/text>/);
    expect(svg).not.toMatch(/Factory/);
  });
});

describe('stamp city label (#59)', () => {
  const label = (svg: string) =>
    svg.match(/<textPath[^>]*>([^<]*)<\/textPath>/)?.[1] ?? '';

  it('defaults to DESTINATION · ARRIVALS when no city is set', () => {
    const svg = inlineIllustration('stamp', 'st-a');
    expect(label(svg)).toBe('DESTINATION · ARRIVALS · ');
    expect(svg.match(/ARRIVALS/g)).toHaveLength(1);
    expect(svg).not.toContain('__city__');
    expect(svg).not.toMatch(/AMSTERDAM/i);
  });

  it('renders the city uppercase and escaped', () => {
    expect(label(inlineIllustration('stamp', 'st-b', { city: 'Lisbon' }))).toBe(
      'LISBON · ARRIVALS · ',
    );
    const odd = inlineIllustration('stamp', 'st-c', { city: 'a<b>&' });
    expect(odd).toContain('A&#60;B&#62;&#38; · ARRIVALS');
    expect(label(inlineIllustration('stamp', 'st-d', { city: '  ' }))).toMatch(
      /^DESTINATION · ARRIVALS/,
    );
  });

  it('fills the ring once: spacing for short labels, squeezes long ones', () => {
    const short = inlineIllustration('stamp', 'st-g', { city: 'Lisbon' });
    expect(short).toContain('textLength="486" lengthAdjust="spacing" ');
    const long = inlineIllustration('stamp', 'st-h', { city: 'Llanfairpwllgwyngyll' });
    expect(long).toContain('lengthAdjust="spacingAndGlyphs"');
    expect(long.match(/ARRIVALS/g)).toHaveLength(1);
  });

  it('shows no year without a date, and the date when set', () => {
    const none = inlineIllustration('stamp', 'st-i');
    expect(none).not.toMatch(/2017|__date__/);
    expect(none).not.toContain('font-size="46"');
    const dated = inlineIllustration('stamp', 'st-j', { date: '2026' });
    expect(dated).toMatch(/font-size="46"[^>]*>2026<\/text>/);
    expect(inlineIllustration('stamp', 'st-k', { date: '<x>' })).toContain('&#60;x&#62;');
  });

  it('points the label at its own prefixed path, so it renders', () => {
    const svg = inlineIllustration('stamp', 'st-f');
    expect(svg).toContain('id="st-fstp"');
    expect(svg).toContain('href="#st-fstp"');
  });

  it('keeps the stamp geometry, type and colour', () => {
    const svg = inlineIllustration('stamp', 'st-e');
    expect(svg).toContain('font-size="22"');
    expect(svg).toContain('letter-spacing="3"');
    expect(svg).toContain('fill="#d63c25"');
    expect(svg).toContain('viewBox="-120 -120 240 240"');
  });
});
