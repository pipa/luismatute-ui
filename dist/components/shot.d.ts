export declare class LmShot extends HTMLElement {
    connectedCallback(): void;
    /** Wrap a light-DOM link's image in the browser frame. No-JS pages keep the link. */
    private frame;
}
export declare function defineLmShot(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-shot': LmShot;
    }
}
//# sourceMappingURL=shot.d.ts.map