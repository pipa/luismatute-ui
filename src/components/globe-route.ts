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

const hon = { id: 'hon', label: 'Honduras', x: 185.6, y: 578.7 };
const car = { id: 'car', label: 'Caribbean', x: 263.9, y: 636.4 };
const rtb = { id: 'rtb', label: 'Roatán', x: 188.4, y: 658.6 };
const ams = { id: 'ams', label: 'Amsterdam', x: 736.9, y: 259.7 };

/** The four legs from concept-c-takeoff.html, same control points. */
export const defaultRoute: GlobeRoute = {
  stops: [hon, car, rtb, ams],
  legs: [
    `M${hon.x} ${hon.y} C${hon.x + 26} ${hon.y + 30} ${hon.x + 52} ${hon.y + 4} ${hon.x + 38} ${hon.y - 18} C${hon.x + 26} ${hon.y - 36} ${hon.x - 8} ${hon.y - 22} ${hon.x} ${hon.y}`,
    `M${hon.x} ${hon.y} C${hon.x + 24} ${hon.y - 18} ${car.x - 40} ${car.y - 34} ${car.x} ${car.y}`,
    `M${car.x} ${car.y} C${car.x - 24} ${car.y + 42} ${rtb.x + 30} ${rtb.y + 20} ${rtb.x} ${rtb.y}`,
    `M${rtb.x} ${rtb.y} C${rtb.x + 120} ${rtb.y - 300} ${ams.x - 320} ${ams.y - 200} ${ams.x} ${ams.y}`,
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
