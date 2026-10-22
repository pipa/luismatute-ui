export declare class LmGlobe extends HTMLElement {
    private button;
    private overlay;
    private closeBtn;
    private stage;
    private stageSvg;
    static get observedAttributes(): string[];
    attributeChangedCallback(name: string, old: string | null, now: string | null): void;
    /** The resolved stop: the `stop` attribute, else `html[data-theme]`. */
    get currentStop(): string | null;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private route;
    private buildStage;
    private drawRoute;
    open(): void;
    close(): void;
    private syncClosed;
    private trap;
}
export declare function defineLmGlobe(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-globe': LmGlobe;
    }
}
//# sourceMappingURL=globe.d.ts.map