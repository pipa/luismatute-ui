export declare class LmChip extends HTMLElement {
    static get observedAttributes(): string[];
    connectedCallback(): void;
    attributeChangedCallback(): void;
    private sync;
}
export declare function defineLmChip(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-chip': LmChip;
    }
}
//# sourceMappingURL=chip.d.ts.map