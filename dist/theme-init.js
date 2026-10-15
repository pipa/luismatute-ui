// src/components/theme.ts
var THEME_KEY = "lm.ui.theme";
var THEME_COOKIE = "lm-mode";
function parse(value) {
  if (value === "night" || value === "dark") return "night";
  if (value === "day" || value === "light") return "day";
  return null;
}
function readThemeCookie(cookie = globalThis.document?.cookie ?? "") {
  try {
    for (const part of String(cookie).split(";")) {
      const eq = part.indexOf("=");
      if (eq < 0 || part.slice(0, eq).trim() !== THEME_COOKIE) continue;
      const v = part.slice(eq + 1).trim();
      if (v === "day" || v === "night" || v === "auto") return v;
      return null;
    }
  } catch {
  }
  return null;
}
function system() {
  return globalThis.matchMedia?.("(prefers-color-scheme: dark)").matches ? "night" : "day";
}
function readTheme(search = globalThis.location?.search ?? "") {
  let query = null;
  try {
    query = parse(new URLSearchParams(search).get("mode"));
  } catch {
    query = null;
  }
  if (query) return query;
  const cookie = readThemeCookie();
  if (cookie) return cookie === "auto" ? system() : cookie;
  let stored = null;
  try {
    stored = globalThis.localStorage?.getItem(THEME_KEY) ?? null;
  } catch {
    stored = null;
  }
  return parse(stored) ?? system();
}

// src/theme-init.ts
try {
  document.documentElement.dataset.mode = readTheme();
} catch {
  document.documentElement.dataset.mode = "day";
}
//# sourceMappingURL=theme-init.js.map
//# sourceMappingURL=theme-init.js.map