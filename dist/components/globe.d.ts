export declare class LmGlobe extends HTMLElement {
    private button;
    private overlay;
    private closeBtn;
    private stage;
    private stageSvg;
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