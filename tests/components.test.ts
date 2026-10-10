import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { defineLmAvatar } from '../src/components/avatar.ts';
import { defineLmCard } from '../src/components/card.ts';
import { defineLmChip } from '../src/components/chip.ts';
import { defineLmFlightPlan } from '../src/components/flight-plan.ts';
import { defineLmGlobe } from '../src/components/globe.ts';
import { defineLmMore } from '../src/components/more.ts';
import { MOTION_KEY, readMotionPreference } from '../src/components/motion.ts';
import { defineLmMotionToggle } from '../src/components/motion-toggle.ts';
import { defineLmPause } from '../src/components/pause.ts';
import { defineLmShot } from '../src/components/shot.ts';
import {
  illustrations,
  inlineIllustration,
} from '../src/illustrations/index.ts';

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
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.textContent).toContain('Just the info');
    expect(document.documentElement.dataset.motion).toBe('full');
    button?.click();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
    expect(localStorage.getItem(MOTION_KEY)).toBe('reduce');
    expect(document.documentElement.dataset.motion).toBe('reduce');
    expect(document.documentElement.classList.contains('is-static')).toBe(true);
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
});

describe('lm-pause', () => {
  it('toggles aria-pressed and the paused flag', () => {
    defineLmPause();
    document.documentElement.dataset.motion = 'full';
    const pause = document.createElement('lm-pause');
    document.body.append(pause);
    const button = pause.querySelector('button');
    expect(button?.getAttribute('aria-pressed')).toBe('false');
    expect(button?.textContent).toContain('Pause animation');
    button?.click();
    expect(button?.getAttribute('aria-pressed')).toBe('true');
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
    expect((overlay as HTMLElement).hidden).toBe(true);
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect((overlay as HTMLElement).hidden).toBe(false);
    expect(overlay?.querySelectorAll('.lm-leg').length).toBe(4);
    overlay?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }),
    );
    expect((overlay as HTMLElement).hidden).toBe(true);
    expect(button?.getAttribute('aria-expanded')).toBe('false');
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
});

describe('illustrations', () => {
  it('recolours skin through tokens and keeps unique clip ids', () => {
    expect(illustrations.avatar).toContain('var(--lm-skin)');
    expect(illustrations.avatar).toContain('var(--lm-skin-beard)');
    expect(illustrations.avatar).not.toContain('--lu-');
    expect(illustrations.plane).not.toContain('--lu-');
    const one = inlineIllustration('avatar', 'seat-a');
    const two = inlineIllustration('avatar', 'seat-b');
    expect(one).toContain('seat-a');
    expect(one).not.toContain('__id__');
    expect(one).not.toContain('seat-b');
    expect(two).toContain('seat-b');
  });
});
