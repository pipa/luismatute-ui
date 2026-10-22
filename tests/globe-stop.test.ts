import { afterEach, describe, expect, it } from 'vitest';
import { defineLmGlobe } from '../src/components/globe.ts';
import {
  defaultRoute,
  GLOBE_STOPS,
  legPose,
  resolveStop,
  routeState,
  STOP_LEG,
  STOP_T,
} from '../src/components/globe-route.ts';

// #14: expected hot leg, plane position and current pin per stop on the built-in route.
const expected = {
  hero: { active: 0, pin: 0 },
  plan: { active: 0, pin: 0 },
  aa: { active: 0, pin: 1 },
  sandals: { active: 1, pin: 2 },
  bsc: { active: 2, pin: 3 },
  fluky: { active: 2, pin: 3 },
  move: { active: 3, pin: -1 },
  booking: { active: 3, pin: 4 },
} as const;

describe('globe-route stop state (#14)', () => {
  for (const stop of GLOBE_STOPS) {
    it(`${stop}: leg and pin state`, () => {
      const s = routeState(defaultRoute, stop);
      const e = expected[stop];
      expect(s.active).toBe(e.active);
      expect(STOP_LEG[stop]).toBe(e.active);
      s.legs.forEach((leg, i) => {
        expect(leg).toBe(
          i === e.active ? 'hot' : i < e.active ? 'past' : 'future',
        );
      });
      s.pins.forEach((o, i) => {
        expect(o).toBe(i === e.pin ? 1 : 0.45);
      });
      expect(s.plane).not.toBeNull();
      if (e.pin >= 0) {
        const p = defaultRoute.stops[e.pin];
        expect(s.plane?.x).toBeCloseTo(p?.x ?? Number.NaN, 5);
        expect(s.plane?.y).toBeCloseTo(p?.y ?? Number.NaN, 5);
      }
    });
  }

  it('move sits two thirds along the ocean leg, heading east', () => {
    expect(STOP_T.move).toBe(0.66);
    const s = routeState(defaultRoute, 'move');
    expect(Math.abs(s.plane?.deg ?? 180)).toBeLessThan(90);
  });

  it('legPose follows the cubic tangent', () => {
    const p = legPose('M0 0 C10 0 20 0 30 0', 0.5);
    expect(p).toEqual({ x: 15, y: 0, deg: 0 });
    expect(legPose('M0 0 C0 10 0 20 0 30', 1).deg).toBe(90);
  });

  it('no stop keeps the old state: last leg hot, all pins full, no plane', () => {
    const s = routeState(defaultRoute, null);
    expect(s.active).toBe(3);
    expect(s.legs).toEqual(['past', 'past', 'past', 'hot']);
    expect(s.pins.every((o) => o === 1)).toBe(true);
    expect(s.plane).toBeNull();
  });

  it('resolves stop, then data-theme, ignoring junk', () => {
    expect(resolveStop('sandals', 'campus')).toBe('sandals');
    expect(resolveStop(null, 'resort')).toBe('sandals');
    expect(resolveStop('nope', 'platform')).toBe('booking');
    expect(resolveStop(null, 'day')).toBeNull();
  });

  it('clamps the hot leg on short custom routes', () => {
    const r = {
      stops: [{ id: 'a', label: 'A', x: 1, y: 1 }],
      legs: ['M0 0 C1 1 2 2 3 3'],
    };
    expect(routeState(r, 'booking').active).toBe(0);
  });
});

describe('lm-globe stop attribute (#14)', () => {
  afterEach(() => {
    document.body.innerHTML = '';
    document.documentElement.removeAttribute('data-theme');
  });

  it('renders leg opacity, pin dimming and the plane, and redraws on change', () => {
    defineLmGlobe();
    const g = document.createElement('lm-globe');
    g.setAttribute('stop', 'sandals');
    document.body.append(g);
    const legs = () => [...g.querySelectorAll('.lm-leg')];
    expect(legs().map((l) => l.getAttribute('data-hot'))).toEqual([
      'false',
      'true',
      'false',
      'false',
    ]);
    expect(legs().map((l) => l.getAttribute('opacity'))).toEqual([
      '0.55',
      null,
      '0.14',
      '0.14',
    ]);
    const pins = [...g.querySelectorAll('.lm-pin')].map((p) =>
      p.getAttribute('opacity'),
    );
    expect(pins).toEqual(['0.45', '0.45', null, '0.45', '0.45']);
    expect(g.querySelectorAll('.lm-plane')).toHaveLength(1);
    expect(g.querySelector('.lm-plane')?.getAttribute('transform')).toMatch(
      /^translate\(238\.0 452\.0\) rotate\(/,
    );
    g.setAttribute('stop', 'booking');
    expect(legs()).toHaveLength(4);
    expect(legs().map((l) => l.getAttribute('opacity'))).toEqual([
      '0.55',
      '0.55',
      '0.55',
      null,
    ]);
    expect(g.querySelectorAll('.lm-plane')).toHaveLength(1);
    expect(g.querySelectorAll('.lm-pin')).toHaveLength(5);
  });

  it('falls back to html[data-theme]', () => {
    defineLmGlobe();
    document.documentElement.setAttribute('data-theme', 'campus');
    const g = document.createElement('lm-globe');
    document.body.append(g);
    expect(g.querySelector('.lm-leg[data-hot="true"]')).toBe(
      g.querySelectorAll('.lm-leg')[2],
    );
  });

  it('no stop and no theme: no plane, no dimming', () => {
    defineLmGlobe();
    const g = document.createElement('lm-globe');
    document.body.append(g);
    expect(g.querySelector('.lm-plane')).toBeNull();
    expect(g.querySelector('.lm-pin[opacity]')).toBeNull();
  });
});
