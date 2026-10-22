import type { GlobeRoute } from './globe-route.ts';

/** The stops a page can be at (the luismatute.me scenes). */
export const GLOBE_STOPS = [
  'hero',
  'plan',
  'aa',
  'sandals',
  'bsc',
  'fluky',
  'move',
  'booking',
] as const;
export type GlobeStopKey = (typeof GLOBE_STOPS)[number];

/**
 * Hot leg per stop (#14). Ported from luismatute.me `STOP_AT`/`STOP_T`
 * (concept-c-takeoff.html): the early stops sit at the start, Sandals is
 * the first hop, the move is out over the ocean and booking has landed.
 * Mapped onto the built-in route's four legs.
 */
export const STOP_LEG: Record<GlobeStopKey, number> = {
  hero: 0,
  plan: 0,
  aa: 0,
  sandals: 1,
  bsc: 2,
  fluky: 2,
  move: 3,
  booking: 3,
};

/** Where the plane sits along the hot leg, 0 (start) to 1 (end). `move` is two thirds across, as live (`tMid`). */
export const STOP_T: Record<GlobeStopKey, number> = {
  hero: 0,
  plan: 0,
  aa: 1,
  sandals: 1,
  bsc: 1,
  fluky: 1,
  move: 0.66,
  booking: 1,
};

/** `html[data-theme]` → stop, the fallback when `stop` is absent. Old theme ids are accepted too. */
export const THEME_STOP: Record<string, GlobeStopKey> = {
  hero: 'hero',
  high: 'plan',
  airport: 'aa',
  resort: 'sandals',
  campus: 'bsc',
  studio: 'fluky',
  move: 'move',
  platform: 'booking',
  aa: 'aa',
  sandals: 'sandals',
  bsc: 'bsc',
  fluky: 'fluky',
  booking: 'booking',
};

/** Live opacity rules (concept-c `globeSvg`). */
export const LEG_OPACITY = { hot: 1, past: 0.55, future: 0.14 } as const;
export const PIN_DIM = 0.45;

export function resolveStop(
  stop: string | null | undefined,
  theme?: string | null,
): GlobeStopKey | null {
  if (stop && (GLOBE_STOPS as readonly string[]).includes(stop))
    return stop as GlobeStopKey;
  if (theme && theme in THEME_STOP) return THEME_STOP[theme] ?? null;
  return null;
}

export type LegState = 'hot' | 'past' | 'future';

export interface RouteState {
  /** Hot leg index. */
  active: number;
  legs: LegState[];
  /** Opacity per pin; 1 for the stop the plane is at, PIN_DIM for the rest. */
  pins: number[];
  /** Plane pose in globe space, or null when no stop is set. */
  plane: { x: number; y: number; deg: number } | null;
}

type Pt = [number, number];

/** Cubic segments of a leg path (`M x y C … C …`). */
function cubics(d: string): [Pt, Pt, Pt, Pt][] {
  const n = (d.match(/-?\d*\.?\d+(?:e-?\d+)?/gi) ?? []).map(Number);
  const out: [Pt, Pt, Pt, Pt][] = [];
  if (n.length < 2) return out;
  let p: Pt = [n[0] as number, n[1] as number];
  for (let i = 2; i + 5 < n.length; i += 6) {
    const c1: Pt = [n[i] as number, n[i + 1] as number];
    const c2: Pt = [n[i + 2] as number, n[i + 3] as number];
    const e: Pt = [n[i + 4] as number, n[i + 5] as number];
    out.push([p, c1, c2, e]);
    p = e;
  }
  return out;
}

/** Point and heading (degrees, 0 = +x) at `t` along a leg. */
export function legPose(
  d: string,
  t: number,
): { x: number; y: number; deg: number } {
  const segs = cubics(d);
  const tt = Math.min(1, Math.max(0, t));
  if (!segs.length) return { x: 0, y: 0, deg: 0 };
  const f = tt * segs.length;
  const i = Math.min(segs.length - 1, Math.floor(f));
  const u = f - i;
  const [p0, p1, p2, p3] = segs[i] as [Pt, Pt, Pt, Pt];
  const v = 1 - u;
  const at = (k: 0 | 1) =>
    v * v * v * p0[k] +
    3 * v * v * u * p1[k] +
    3 * v * u * u * p2[k] +
    u * u * u * p3[k];
  const tan = (k: 0 | 1) =>
    3 * v * v * (p1[k] - p0[k]) +
    6 * v * u * (p2[k] - p1[k]) +
    3 * u * u * (p3[k] - p2[k]);
  let dx = tan(0);
  let dy = tan(1);
  // degenerate end tangent (control point on the end point): use the chord
  if (Math.hypot(dx, dy) < 1e-9) {
    dx = p3[0] - p0[0];
    dy = p3[1] - p0[1];
  }
  return { x: at(0), y: at(1), deg: (Math.atan2(dy, dx) * 180) / Math.PI };
}

/**
 * Leg and pin state for a stop. Without a stop it keeps the old behaviour:
 * `route.active` (or the last leg) hot, the rest past, all pins full, no plane.
 */
export function routeState(
  route: GlobeRoute,
  stop: GlobeStopKey | null,
): RouteState {
  const last = route.legs.length - 1;
  if (!stop) {
    const active = route.active ?? last;
    return {
      active,
      legs: route.legs.map((_, i) => (i === active ? 'hot' : 'past')),
      pins: route.stops.map(() => 1),
      plane: null,
    };
  }
  const active = Math.min(STOP_LEG[stop], last);
  const t = STOP_T[stop];
  // stop i sits at the start of leg i; the plane is at a pin only at t 0 or 1
  const here = t <= 0 ? active : t >= 1 ? active + 1 : -1;
  const d = route.legs[active];
  return {
    active,
    legs: route.legs.map((_, i) =>
      i === active ? 'hot' : i < active ? 'past' : 'future',
    ),
    pins: route.stops.map((_, i) => (i === here ? 1 : PIN_DIM)),
    plane: d ? legPose(d, t) : null,
  };
}
