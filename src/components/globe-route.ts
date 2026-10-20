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

// Generic example stops (#57): no real places named. Three short legs down
// an east coast, then one long arc across the ocean so the draw-in reads.
const a = { id: 'a', label: 'Stop A', x: 276, y: 346 };
const b = { id: 'b', label: 'Stop B', x: 258, y: 398 };
const c = { id: 'c', label: 'Stop C', x: 238, y: 452 };
const d = { id: 'd', label: 'Stop D', x: 214, y: 500 };
const e = { id: 'e', label: 'Stop E', x: 730, y: 350 };

/** The built-in example route: four legs, the last (long) one hot. */
export const defaultRoute: GlobeRoute = {
  stops: [a, b, c, d, e],
  legs: [
    `M${a.x} ${a.y} C${a.x + 6} ${a.y + 18} ${b.x + 10} ${b.y - 20} ${b.x} ${b.y}`,
    `M${b.x} ${b.y} C${b.x - 4} ${b.y + 20} ${c.x + 12} ${c.y - 22} ${c.x} ${c.y}`,
    `M${c.x} ${c.y} C${c.x - 8} ${c.y + 18} ${d.x + 10} ${d.y - 22} ${d.x} ${d.y}`,
    `M${d.x} ${d.y} C${d.x + 140} ${d.y - 260} ${e.x - 280} ${e.y - 200} ${e.x} ${e.y}`,
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
