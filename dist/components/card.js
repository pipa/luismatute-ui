// src/components/card.ts
var LmCard = class extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }
  connectedCallback() {
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "stop");
  }
};
function defineLmCard() {
  if (!customElements.get("lm-card")) customElements.define("lm-card", LmCard);
}

export { LmCard, defineLmCard };
//# sourceMappingURL=card.js.map
//# sourceMappingURL=card.js.map