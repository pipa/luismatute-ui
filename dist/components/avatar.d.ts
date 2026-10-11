export declare class LmAvatar extends HTMLElement {
    private svg;
    private parts;
    private blinkT;
    private glanceT;
    private raf;
    private last;
    private x;
    private y;
    private vx;
    private vy;
    private bx;
    private by;
    private bvx;
    private bvy;
    private glance;
    private onMotion;
    private onPause;
    static get observedAttributes(): string[];
    connectedCallback(): void;
    disconnectedCallback(): void;
    attributeChangedCallback(): void;
    private poseName;
    private applyPose;
    /**
     * Idle stops for the OS reduced-motion setting, the pause control, explicit
     * `data-motion="reduce"`, `static`, or `motion="off"|"reduce"`.
     * `motion="idle"` (the default when the attribute is omitted) keeps running
     * in Info (`data-motion="calm"`).
     */
    private frozen;
    private sync;
    private stop;
    private blinkLoop;
    private glanceLoop;
    private kick;
    private tick;
    private pose;
}
export declare function defineLmAvatar(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-avatar': LmAvatar;
    }
}
//# sourceMappingURL=avatar.d.ts.map