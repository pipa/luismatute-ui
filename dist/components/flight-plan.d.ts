export interface FlightStop {
    href: string;
    years: string;
    label: string;
}
export declare class LmFlightPlan extends HTMLElement {
    private built;
    connectedCallback(): void;
    set stops(value: FlightStop[]);
    private stopsFromAttr;
    private stopsFromChildren;
    private render;
}
export declare function defineLmFlightPlan(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-flight-plan': LmFlightPlan;
    }
}
//# sourceMappingURL=flight-plan.d.ts.map