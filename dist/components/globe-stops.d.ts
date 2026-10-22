import type { GlobeRoute } from './globe-route.js';
/** The stops a page can be at (the luismatute.me scenes). */
export declare const GLOBE_STOPS: readonly ['hero', 'plan', 'aa', 'sandals', 'bsc', 'fluky', 'move', 'booking'];
export type GlobeStopKey = (typeof GLOBE_STOPS)[number];
/**
 * Hot leg per stop (#14). Ported from luismatute.me `STOP_AT`/`STOP_T`
 * (concept-c-takeoff.html): the early stops sit at the start, Sandals is
 * the first hop, the move is out over the ocean and booking has landed.
 * Mapped onto the built-in route's four legs.
 */
export declare const STOP_LEG: Record<GlobeStopKey, number>;
/** Where the plane sits along the hot leg, 0 (start) to 1 (end). `move` is two thirds across, as live (`tMid`). */
export declare const STOP_T: Record<GlobeStopKey, number>;
/** `html[data-theme]` → stop, the fallback when `stop` is absent. Old theme ids are accepted too. */
export declare const THEME_STOP: Record<string, GlobeStopKey>;
/** Live opacity rules (concept-c `globeSvg`). */
export declare const LEG_OPACITY: {
    readonly hot: 1;
    readonly past: 0.55;
    readonly future: 0.14;
};
export declare const PIN_DIM = 0.45;
export declare function resolveStop(stop: string | null | undefined, theme?: string | null): GlobeStopKey | null;
export type LegState = 'hot' | 'past' | 'future';
export interface RouteState {
    /** Hot leg index. */
    active: number;
    legs: LegState[];
    /** Opacity per pin; 1 for the stop the plane is at, PIN_DIM for the rest. */
    pins: number[];
    /** Plane pose in globe space, or null when no stop is set. */
    plane: {
        x: number;
        y: number;
        deg: number;
    } | null;
}
/** Point and heading (degrees, 0 = +x) at `t` along a leg. */
export declare function legPose(d: string, t: number): {
    x: number;
    y: number;
    deg: number;
};
/**
 * Leg and pin state for a stop. Without a stop it keeps the old behaviour:
 * `route.active` (or the last leg) hot, the rest past, all pins full, no plane.
 */
export declare function routeState(route: GlobeRoute, stop: GlobeStopKey | null): RouteState;
/**
 * Route stroke widths in screen px (non-scaling stroke). The hot leg is
 * drawn at 5.5 and the other legs at 4, as on luismatute.me (#57, #59).
 * The CSS in base.css is the source the browser uses; tests pin both.
 */
export declare const LEG_WIDTH_HOT = 5.5;
export declare const LEG_WIDTH = 4;
//# sourceMappingURL=globe-stops.d.ts.map