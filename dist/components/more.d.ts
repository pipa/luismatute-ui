export declare class LmMore extends HTMLElement {
    private button;
    private body;
    connectedCallback(): void;
    toggle(force?: boolean): void;
    get open(): boolean;
}
export declare function defineLmMore(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-more': LmMore;
    }
}
//# sourceMappingURL=more.d.ts.map