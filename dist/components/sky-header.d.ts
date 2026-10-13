import { landEdge, skyLayersHtml } from './sky-art.js';
export { landEdge, skyLayersHtml };
/**
 * Wraps a `.lm-sky-head` header. Adds the sky layers when the server did not,
 * pauses every loop while the header is off-screen (`.lm-sky-off`), and wires
 * `button.lm-sky-pause` to the lm-pause contract (`html.paused` + `lm-pause` event).
 * concept="cruise" is M1 Cruise (the default). `compact` is the still post strip.
 */
export declare class LmSkyHeader extends HTMLElement {
    private observer;
    private wired;
    private readonly onPause;
    connectedCallback(): void;
    disconnectedCallback(): void;
}
export declare function defineLmSkyHeader(): void;
declare global {
    interface HTMLElementTagNameMap {
        'lm-sky-header': LmSkyHeader;
    }
}
//# sourceMappingURL=sky-header.d.ts.map