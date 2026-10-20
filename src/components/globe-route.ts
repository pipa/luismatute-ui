export interface GlobeStop {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface GlobeRoute {
  stops: GlobeStop[];
  /** SVG path `d` values in the 1000×1000 globe, one per leg. */
  legs: string[];
  /** Index of the hot leg. Defaults to the last leg. */
  active?: number;
}

// Generic example stops (#57): no real places. Four legs, the last a long
// arc across the open ocean so the draw-in still reads.
const a = { id: 'a', label: 'Stop A', x: 252, y: 430 };
const b = { id: 'b', label: 'Stop B', x: 334, y: 506 };
const c = { id: 'c', label: 'Stop C', x: 288, y: 604 };
const d = { id: 'd', label: 'Stop D', x: 372, y: 676 };
const e = { id: 'e', label: 'Stop E', x: 772, y: 302 };

/** The built-in example route: four legs, the last one hot. */
export const defaultRoute: GlobeRoute = {
  stops: [a, b, c, d, e],
  legs: [
    `M${a.x} ${a.y} C${a.x + 30} ${a.y + 6} ${b.x - 24} ${b.y - 40} ${b.x} ${b.y}`,
    `M${b.x} ${b.y} C${b.x + 18} ${b.y + 38} ${c.x + 34} ${c.y - 30} ${c.x} ${c.y}`,
    `M${c.x} ${c.y} C${c.x - 10} ${c.y + 40} ${d.x - 40} ${d.y + 10} ${d.x} ${d.y}`,
    `M${d.x} ${d.y} C${d.x + 110} ${d.y - 320} ${e.x - 300} ${e.y - 190} ${e.x} ${e.y}`,
  ],
  active: 3,
};

export function parseRoute(value: string | null): GlobeRoute {
  if (!value) return defaultRoute;
  try {
    const parsed = JSON.parse(value) as GlobeRoute;
    if (!Array.isArray(parsed.stops) || !Array.isArray(parsed.legs))
      return defaultRoute;
    return parsed;
  } catch {
    return defaultRoute;
  }
}
