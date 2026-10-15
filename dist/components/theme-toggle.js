// src/components/theme.ts
var THEME_KEY = "lm.ui.theme";
var THEME_COOKIE = "lm-mode";
var THEME_COOKIE_DOMAIN = ".luismatute.me";
var THEME_COOKIE_MAX_AGE = 31536e3;
function parse(value) {
  if (value === "night" || value === "dark") return "night";
  if (value === "day" || value === "light") return "day";
  return null;
}
function parseChoice(value) {
  return value === "auto" ? "auto" : parse(value);
}
function hostMatches(host, domain) {
  const bare = domain.replace(/^\./, "").toLowerCase();
  const h = host.toLowerCase();
  return bare !== "" && (h === bare || h.endsWith(`.${bare}`));
}
function themeCookieConfig(script = globalThis.document?.querySelector(
  "script[data-lm-theme]"
) ?? null, loc = globalThis.location) {
  const host = loc?.hostname ?? "";
  const wanted = script?.getAttribute("data-cookie-domain")?.trim() || THEME_COOKIE_DOMAIN;
  const secureAttr = script?.getAttribute("data-cookie-secure") ?? "auto";
  return {
    domain: hostMatches(host, wanted) ? wanted : null,
    secure: secureAttr === "true" || secureAttr !== "false" && loc?.protocol === "https:"
  };
}
function themeCookieString(choice, config = themeCookieConfig()) {
  let s = `${THEME_COOKIE}=${choice}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  if (config.domain) s += `; Domain=${config.domain}`;
  if (config.secure) s += "; Secure";
  return s;
}
function system() {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "night" : "day";
}
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
function saveTheme(choice) {
  if (!parseChoice(choice)) return;
  try {
    document.cookie = themeCookieString(choice);
  } catch {
  }
  try {
    if (choice === "auto") globalThis.localStorage?.removeItem(THEME_KEY);
    else globalThis.localStorage?.setItem(THEME_KEY, choice);
  } catch {
  }
}
function setTheme(choice) {
  saveTheme(choice);
  const mode = choice === "auto" ? system() : choice;
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