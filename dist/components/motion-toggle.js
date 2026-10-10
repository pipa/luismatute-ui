// src/components/motion.ts
var MOTION_KEY = "lm.ui.motion";
function readMotionPreference(search = globalThis.location?.search ?? "") {
  const qs = new URLSearchParams(search).get("motion");
  if (qs === "reduce") return "reduce";
  if (qs === "on") return "full";
  let stored = null;
  try {
    stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
  } catch {
    stored = null;
  }
  if (stored === "reduce" || stored === "full") return stored;
  const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return reduce ? "reduce" : "full";
}
function writeMotionPreference(mode) {
  try {
    globalThis.localStorage?.setItem(MOTION_KEY, mode);
  } catch {
  }
}
function applyMotionPreference(mode) {
  const next = mode ?? readMotionPreference();
  const root = document.documentElement;
  root.dataset.motion = next;
  root.classList.toggle("is-static", next === "reduce");
  root.classList.toggle("is-motion", next === "full");
  root.dispatchEvent(
    new CustomEvent("lm-motion", { detail: { motion: next } })
  );
  return next;
}

// src/components/motion-toggle.ts
var LmMotionToggle = class extends HTMLElement {
  button = null;
  connectedCallback() {
    const mode = applyMotionPreference();
    if (!this.button) {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = '<span class="lm-mt-i" aria-hidden="true"></span><span class="lm-mt-s"><span class="lm-mt-long"></span><span class="lm-mt-short"></span></span>';
      button.addEventListener("click", () => {
        const next = button.getAttribute("aria-pressed") === "true" ? "full" : "reduce";
        writeMotionPreference(next);
        const params = new URLSearchParams(location.search);
        if (params.has("motion")) {
          params.set("motion", next === "reduce" ? "reduce" : "on");
          const nextUrl = `${location.pathname}?${params.toString()}${location.hash}`;
          history.replaceState(null, "", nextUrl);
        }
        this.paint(applyMotionPreference(next));
      });
      this.button = button;
      this.append(button);
    }
    this.paint(mode);
  }
  paint(mode) {
    const button = this.button;
    if (!button) return;
    const reduced = mode === "reduce";
    button.setAttribute("aria-pressed", String(reduced));
    this.setAttribute("aria-pressed", String(reduced));
    const long = button.querySelector(".lm-mt-long");
    const short = button.querySelector(".lm-mt-short");
    if (long) long.textContent = reduced ? "Full flight" : "Just the info";
    if (short) short.textContent = reduced ? "Flight" : "Info";
  }
};
function defineLmMotionToggle() {
  if (!customElements.get("lm-motion-toggle"))
    customElements.define("lm-motion-toggle", LmMotionToggle);
}

export { LmMotionToggle, defineLmMotionToggle };
//# sourceMappingURL=motion-toggle.js.map
//# sourceMappingURL=motion-toggle.js.map