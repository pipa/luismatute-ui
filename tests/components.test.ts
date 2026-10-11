import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineLmAvatar } from '../src/components/avatar.ts';
import { defineLmCard } from '../src/components/card.ts';
import { defineLmChip } from '../src/components/chip.ts';
import { defineLmFlightPlan } from '../src/components/flight-plan.ts';
import { defineLmGlobe } from '../src/components/globe.ts';
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
    chip.textContent = 'Catch Advisory Group';
    chip.setAttribute('variant', 'featured');
    document.body.append(chip);
    expect(chip.querySelector('b')?.textContent).toBe('Featured');
    chip.removeAttribute('variant');
    expect(chip.querySelector('b')).toBeNull();
    expect(chip.textContent).toContain('Catch Advisory Group');
  });
});

describe('lm-more', () => {
  it('opens and closes with aria-expanded and aria-controls', () => {
    defineLmMore();
    const more = document.createElement('lm-more');
    more.setAttribute('label', 'More');
    more.setAttribute('panel', 'more-sandals');
    more.textContent = 'Led several full redesigns.';
    document.body.append(more);
    const button = more.querySelector('button');
    const body = more.querySelector<HTMLElement>('.lm-more-body');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(button?.getAttribute('aria-controls')).toBe('more-sandals');
    expect(body?.id).toBe('more-sandals');
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
    shot.setAttribute(
      'href',
      'https://web.archive.org/web/20160620110713/http://www.sandals.com/',
    );
    shot.setAttribute('src', 'shots/sandals-600.webp');
    shot.setAttribute('chrome', 'sandals.com');
    shot.setAttribute('caption', 'sandals.com');
    document.body.append(shot);
    const link = shot.querySelector('a');
    expect(link?.target).toBe('_blank');
    expect(link?.rel).toContain('noopener');
    expect(link?.rel).toContain('noreferrer');
    expect(link?.querySelector('.lm-vh')?.textContent).toBe(
      ' (opens in a new tab)',
    );
    expect(shot.querySelector('.lm-shot-chrome')?.textContent).toContain(
      'sandals.com',
    );
    expect(shot.querySelector('img')?.getAttribute('src')).toBe(
      'shots/sandals-600.webp',
    );
  });

  it('wraps a light-DOM image instead of replacing the link', () => {
    defineLmShot();
    const shot = document.createElement('lm-shot');
    shot.setAttribute('chrome', 'sandals.com');
    shot.innerHTML =
      '<a href="https://example.com"><img src="shots/sandals-600.webp" alt="" /></a>';
    document.body.append(shot);
    const link = shot.querySelector('a');
    expect(link?.getAttribute('href')).toBe('https://example.com');
    expect(link?.querySelector('.lm-shot-frame img')?.getAttribute('src')).toBe(
      'shots/sandals-600.webp',
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
        { href: '#stop-aa', years: '2006–2011', label: 'American Airlines' },
        { href: '#stop-sandals', years: '2011–2017', label: 'Sandals Resorts' },
      ]),
    );
    document.body.append(plan);
    const links = plan.querySelectorAll('a');
    expect(links).toHaveLength(2);
    expect(links[1]?.getAttribute('href')).toBe('#stop-sandals');
    expect(links[1]?.className).toBe('lm-plan-jump');
    expect(links[1]?.textContent).toContain('Sandals Resorts');
    const broken = document.createElement('lm-flight-plan');
    broken.setAttribute('stops', '{');
    expect(() => document.body.append(broken)).not.toThrow();
    expect(broken.querySelectorAll('a')).toHaveLength(0);
    const kept = document.createElement('lm-flight-plan');
    kept.setAttribute('stops', '{');
    kept.innerHTML =
      '<a href="#stop-aa"><span class="lm-yr">2006–2011</span><span class="lm-name">American Airlines</span></a>';
    document.body.append(kept);
    expect(kept.querySelectorAll('a')).toHaveLength(1);
    expect(kept.querySelector('a')?.getAttribute('href')).toBe('#stop-aa');
    const early = document.createElement('lm-flight-plan');
    Object.defineProperty(early, 'stops', {
      value: [
        { href: '#stop-aa', years: '2006–2011', label: 'American Airlines' },
        { href: '#stop-sandals', years: '2011–2017', label: 'Sandals Resorts' },
      ],
      writable: true,
      configurable: true,
    });
    document.body.append(early);
    expect(early.querySelectorAll('a')).toHaveLength(2);
    expect(early.querySelectorAll('a')[1]?.textContent).toContain(
      'Sandals Resorts',
    );
  });
});

describe('lm-globe', () => {
  it('opens the route overlay and closes on Escape', () => {
    defineLmGlobe();
    document.documentElement.dataset.motion = 'reduce';
    const globe = document.createElement('lm-globe');
    globe.setAttribute('heading', 'Route');
    globe.setAttribute(
      'description',
      'Honduras, the Caribbean, then Amsterdam.',
    );
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
