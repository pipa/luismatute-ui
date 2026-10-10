// src/components/chip.ts
var BADGE = "Featured";
var LmChip = class extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }
  connectedCallback() {
    this.sync();
  }
  attributeChangedCallback() {
    this.sync();
  }
  sync() {
    const featured = this.getAttribute("variant") === "featured";
    const badge = this.querySelector("b");
    if (featured && !badge) {
      const b = document.createElement("b");
      b.textContent = BADGE;
      this.append(b);
    } else if (!featured && badge?.textContent === BADGE) {
      badge.remove();
    }
  }
};
function defineLmChip() {
  if (!customElements.get("lm-chip")) customElements.define("lm-chip", LmChip);
}

export { LmChip, defineLmChip };
//# sourceMappingURL=chip.js.map
//# sourceMappingURL=chip.js.map