// src/components/motion.ts
var MOTION_KEY = "lm.ui.motion";
function modeFromQuery(value) {
  if (value === "reduce" || value === "off") return "reduce";
  if (value === "calm" || value === "info") return "calm";
  if (value === "on" || value === "full") return "full";
  return null;
}
function modeFromStorage(value) {
  if (value === "off") return "reduce";
  if (value === "reduce" || value === "calm" || value === "info") return "calm";
  if (value === "full" || value === "on") return "full";
  return null;
}
function readMotionPreference(search = globalThis.location?.search ?? "") {
  const query = modeFromQuery(new URLSearchParams(search).get("motion"));
  if (query) return query;
  let stored = null;
  try {
    stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
  } catch {
    stored = null;
  }
  const saved = modeFromStorage(stored);
  if (saved) return saved;
  const reduce = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  return reduce ? "reduce" : "full";
}
function applyMotionPreference(mode) {
  if (typeof document === "undefined") return "full";
  const next = readMotionPreference();
  const root = document.documentElement;
  root.dataset.motion = next;
  root.classList.toggle("is-static", next === "reduce" || next === "calm");
  root.classList.toggle("is-calm", next === "calm");
  root.classList.toggle("is-motion", next === "full");
  root.dispatchEvent(
    new CustomEvent("lm-motion", { detail: { motion: next } })
  );
  bindMotionMedia();
  return next;
}
function explicitMotionChoice(search = globalThis.location?.search ?? "") {
  const qs = new URLSearchParams(search).get("motion");
  if (modeFromQuery(qs)) return true;
  try {
    const stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
    return modeFromStorage(stored) !== null;
  } catch {
    return false;
  }
}
var motionMediaBound = false;
function bindMotionMedia() {
  if (motionMediaBound) return;
  const mq = globalThis.matchMedia?.("(prefers-reduced-motion: reduce)");
  if (!mq?.addEventListener) return;
  motionMediaBound = true;
  mq.addEventListener("change", () => {
    const root = document.documentElement;
    if (explicitMotionChoice()) {
      root.dispatchEvent(
        new CustomEvent("lm-motion", {
          detail: { motion: root.dataset.motion }
        })
      );
      return;
    }
    if (root.dataset.motion === "reduce" || root.dataset.motion === "calm" || root.dataset.motion === "full") {
      applyMotionPreference();
      return;
    }
    root.dispatchEvent(
      new CustomEvent("lm-motion", {
        detail: { motion: mq.matches ? "reduce" : "full" }
      })
    );
  });
}

// src/components/pause.ts
var LmPause = class extends HTMLElement {
  button = null;
  connectedCallback() {
    if (this.button) return;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = '<span class="lm-pi" aria-hidden="true"></span><span class="lm-pl">Pause animation</span>';
    button.addEventListener("click", () => {
      const on = button.getAttribute("aria-pressed") !== "true";
      button.setAttribute("aria-pressed", String(on));
      this.removeAttribute("aria-pressed");
      document.documentElement.classList.toggle("paused", on);
      document.documentElement.dataset.paused = on ? "true" : "false";
      document.documentElement.dispatchEvent(
        new CustomEvent("lm-pause", { detail: { paused: on } })
      );
    });
    this.button = button;
    this.append(button);
  }
};
function defineLmPause() {
  applyMotionPreference();
  if (!customElements.get("lm-pause"))
    customElements.define("lm-pause", LmPause);
}

// src/components/entries/pause.ts
defineLmPause();

export { LmPause, defineLmPause };
//# sourceMappingURL=pause.js.map
//# sourceMappingURL=pause.js.map