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
function writeMotionPreference(mode) {
  const stored = mode === "reduce" ? "off" : mode;
  try {
    globalThis.localStorage?.setItem(MOTION_KEY, stored);
  } catch {
  }
}
function applyMotionPreference(mode) {
  if (typeof document === "undefined") return mode ?? "full";
  const next = mode ?? readMotionPreference();
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
        const next = button.getAttribute("data-pressed") === "true" ? "full" : "calm";
        writeMotionPreference(next);
        const params = new URLSearchParams(location.search);
        if (params.has("motion")) {
          params.set("motion", next === "full" ? "on" : "calm");
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
    const info = mode !== "full";
    button.setAttribute("data-pressed", String(info));
    button.removeAttribute("aria-pressed");
    this.removeAttribute("aria-pressed");
    const long = button.querySelector(".lm-mt-long");
    const short = button.querySelector(".lm-mt-short");
    if (long) long.textContent = info ? "Full flight" : "Just the info";
    if (short) short.textContent = info ? "Flight" : "Info";
  }
};
function defineLmMotionToggle() {
  applyMotionPreference();
  if (!customElements.get("lm-motion-toggle"))
    customElements.define("lm-motion-toggle", LmMotionToggle);
}

// src/components/entries/motion-toggle.ts
defineLmMotionToggle();

export { LmMotionToggle, defineLmMotionToggle };
//# sourceMappingURL=motion-toggle.js.map
//# sourceMappingURL=motion-toggle.js.map