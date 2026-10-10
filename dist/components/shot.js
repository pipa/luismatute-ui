// src/components/shot.ts
var LmShot = class extends HTMLElement {
  connectedCallback() {
    if (this.querySelector("a")) return;
    const href = this.getAttribute("href");
    const src = this.getAttribute("src");
    if (!href || !src) return;
    const chrome = this.getAttribute("chrome") ?? "";
    const caption = this.getAttribute("caption") ?? chrome;
    const alt = this.getAttribute("alt") ?? "";
    const width = this.getAttribute("width") ?? "600";
    const height = this.getAttribute("height") ?? "390";
    const srcset = this.getAttribute("srcset");
    const sizes = this.getAttribute("sizes");
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
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
    const img = document.createElement("img");
    img.src = src;
    img.alt = alt;
    img.width = Number(width);
    img.height = Number(height);
    img.loading = "lazy";
    img.decoding = "async";
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    frame.append(bar, img);
    const cap = document.createElement("p");
    cap.className = "lm-shot-cap";
    cap.textContent = caption;
    const hint = document.createElement("span");
    hint.className = "lm-vh";
    hint.textContent = " (opens in a new tab)";
    link.append(frame, cap, hint);
    this.append(link);
  }
};
function defineLmShot() {
  if (!customElements.get("lm-shot")) customElements.define("lm-shot", LmShot);
}

export { LmShot, defineLmShot };
//# sourceMappingURL=shot.js.map
//# sourceMappingURL=shot.js.map