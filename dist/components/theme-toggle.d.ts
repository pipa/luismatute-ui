/**
 * 44px icon pill that flips html[data-mode] between day and night.
 * Server-render a `<button class="lm-pill lm-pill--icon">` inside to avoid a
 * layout shift; otherwise one is created. The button keeps aria-label "Night"
 * and exposes the state with aria-pressed (pressed = night).
 */
export declare class LmThemeToggle extends HTMLElement {
    private button;
    private readonly sync;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare function defineLmThemeToggle(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-theme-toggle': LmThemeToggle;
    }
}
//# sourceMappingURL=theme-toggle.d.ts.map