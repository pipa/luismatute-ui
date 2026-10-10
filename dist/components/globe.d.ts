export declare class LmGlobe extends HTMLElement {
    private button;
    private overlay;
    private closeBtn;
    private stage;
    private raf;
    connectedCallback(): void;
    disconnectedCallback(): void;
    private route;
    private paint;
    open(): void;
    close(): void;
    private trap;
}
export declare function defineLmGlobe(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-globe': LmGlobe;
    }
}
//# sourceMappingURL=globe.d.ts.map