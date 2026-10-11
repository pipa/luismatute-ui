// src/components/shot.ts
var LmShot = class extends HTMLElement {
  connectedCallback() {
    const existing = this.querySelector("a");
    if (existing) {
      if (!existing.querySelector(".lm-shot-frame")) this.frame(existing);
      return;
    }
    const href = this.getAttribute("href");
    const src = this.getAttribute("src");
    if (!href || !src) return;
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const img = document.createElement("img");
    img.src = src;
    img.alt = this.getAttribute("alt") ?? "";
    img.width = Number(this.getAttribute("width") ?? "600");
    img.height = Number(this.getAttribute("height") ?? "390");
    img.loading = "lazy";
    img.decoding = "async";
    const srcset = this.getAttribute("srcset");
    const sizes = this.getAttribute("sizes");
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    link.append(img);
    this.frame(link);
    const chrome = this.getAttribute("chrome") ?? "";
    const caption = this.getAttribute("caption") ?? chrome;
    const cap = document.createElement("p");
    cap.className = "lm-shot-cap";
    cap.textContent = caption;
    const hint = document.createElement("span");
    hint.className = "lm-vh";
    hint.textContent = " (opens in a new tab)";
    link.append(cap, hint);
    this.append(link);
  }
  /** Wrap a light-DOM link's image in the browser frame. No-JS pages keep the link. */
  frame(link) {
    if (link.querySelector(".lm-shot-frame")) return;
    const img = link.querySelector("img");
    if (!img) return;
    const chrome = this.getAttribute("chrome") ?? "";
    const frame = document.createElement("span");
    frame.className = "lm-shot-frame";
    const bar = document.createElement("span");
    bar.className = "lm-shot-chrome";
    const dots = document.createElement("span");
    dots.className = "lm-shot-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.append(
      document.createElement("i"),
      document.createElement("i"),
      document.createElement("i")
    );
    bar.append(dots, document.createTextNode(chrome ? ` ${chrome}` : ""));
    frame.append(bar, img);
    link.prepend(frame);
  }
};
function defineLmShot() {
  if (!customElements.get("lm-shot")) customElements.define("lm-shot", LmShot);
}

// src/components/entries/shot.ts
defineLmShot();

export { LmShot, defineLmShot };
//# sourceMappingURL=shot.js.map
//# sourceMappingURL=shot.js.map