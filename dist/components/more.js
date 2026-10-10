// src/components/more.ts
var moreSeq = 0;
var LmMore = class extends HTMLElement {
  button = null;
  body = null;
  connectedCallback() {
    if (this.button) return;
    const id = this.getAttribute("panel") ?? `lm-more-${++moreSeq}`;
    const label = this.getAttribute("label") ?? "More";
    const body = document.createElement("div");
    body.className = "lm-more-body";
    body.id = id;
    body.hidden = true;
    while (this.firstChild) body.append(this.firstChild);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);
    button.addEventListener("click", () => this.toggle());
    this.button = button;
    this.body = body;
    this.append(button, body);
  }
  toggle(force) {
    if (!this.button || !this.body) return;
    const open = force ?? this.button.getAttribute("aria-expanded") !== "true";
    this.button.setAttribute("aria-expanded", String(open));
    this.body.hidden = !open;
    this.dispatchEvent(
      new CustomEvent("lm-toggle", { detail: { open }, bubbles: true })
    );
  }
  get open() {
    return this.button?.getAttribute("aria-expanded") === "true";
  }
};
function defineLmMore() {
  if (!customElements.get("lm-more")) customElements.define("lm-more", LmMore);
}

export { LmMore, defineLmMore };
//# sourceMappingURL=more.js.map
//# sourceMappingURL=more.js.map