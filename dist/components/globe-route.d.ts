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
/** The four legs from concept-c-takeoff.html, same control points. */
export declare const defaultRoute: GlobeRoute;
export declare function parseRoute(value: string | null): GlobeRoute;
//# sourceMappingURL=globe-route.d.ts.map