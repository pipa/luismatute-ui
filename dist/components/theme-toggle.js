// src/components/theme.ts
var THEME_KEY = "lm.ui.theme";
function currentTheme() {
  if (typeof document === "undefined") return "day";
  return document.documentElement.dataset.mode === "night" ? "night" : "day";
}
function applyTheme(mode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.dataset.mode = mode;
  root.dispatchEvent(new CustomEvent("lm-theme", { detail: { mode } }));
}
function setTheme(mode) {
  try {
    globalThis.localStorage?.setItem(THEME_KEY, mode);
  } catch {
  }
  const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  const doc = document;
  if (!reduce && typeof doc.startViewTransition === "function")
    doc.startViewTransition(() => applyTheme(mode));
  else applyTheme(mode);
}

// src/components/theme-toggle.ts
var LmThemeToggle = class extends HTMLElement {
  button = null;
  sync = () => {
    this.button?.setAttribute(
      "aria-pressed",
      String(currentTheme() === "night")
    );
  };
  connectedCallback() {
    if (!this.button) {
      let button = this.querySelector("button");
      if (!button) {
        button = document.createElement("button");
        button.className = "lm-pill lm-pill--icon lm-theme-btn";
        button.innerHTML = '<span class="lm-i-moon" aria-hidden="true"></span><span class="lm-i-sun" aria-hidden="true"></span>';
        this.append(button);
      }
      button.type = "button";
      if (!button.hasAttribute("aria-label"))
        button.setAttribute("aria-label", "Night");
      button.addEventListener("click", () => {
        setTheme(currentTheme() === "night" ? "day" : "night");
      });
      this.button = button;
    }
    this.sync();
    document.documentElement.addEventListener("lm-theme", this.sync);
  }
  disconnectedCallback() {
    document.documentElement.removeEventListener("lm-theme", this.sync);
  }
};
function defineLmThemeToggle() {
  if (!customElements.get("lm-theme-toggle"))
    customElements.define("lm-theme-toggle", LmThemeToggle);
}

// src/components/entries/theme-toggle.ts
defineLmThemeToggle();

export { LmThemeToggle, defineLmThemeToggle };
//# sourceMappingURL=theme-toggle.js.map
//# sourceMappingURL=theme-toggle.js.map