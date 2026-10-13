// src/theme-init.ts
(() => {
  const root = document.documentElement;
  let mode = null;
  try {
    mode = new URLSearchParams(location.search).get("mode");
    if (mode !== "night" && mode !== "day")
      mode = localStorage.getItem("lm.ui.theme");
  } catch {
    mode = null;
  }
  if (mode !== "night" && mode !== "day")
    mode = matchMedia("(prefers-color-scheme: dark)").matches ? "night" : "day";
  root.dataset.mode = mode;
})();
//# sourceMappingURL=theme-init.js.map
//# sourceMappingURL=theme-init.js.map