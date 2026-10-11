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
  bindMotionMedia();
  return next;
}
function explicitMotionChoice(search = globalThis.location?.search ?? "") {
  const qs = new URLSearchParams(search).get("motion");
  if (qs === "reduce" || qs === "on") return true;
  try {
    const stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
    return stored === "reduce" || stored === "full";
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
    if (explicitMotionChoice()) return;
    const root = document.documentElement;
    if (root.dataset.motion === "reduce" || root.dataset.motion === "full") {
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
        const next = button.getAttribute("data-pressed") === "true" ? "full" : "reduce";
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
    button.setAttribute("data-pressed", String(reduced));
    button.removeAttribute("aria-pressed");
    this.removeAttribute("aria-pressed");
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

// src/components/entries/motion-toggle.ts
defineLmMotionToggle();

export { LmMotionToggle, defineLmMotionToggle };
//# sourceMappingURL=motion-toggle.js.map
//# sourceMappingURL=motion-toggle.js.map