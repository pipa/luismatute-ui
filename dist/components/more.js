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

// src/components/more.ts
var moreSeq = 0;
var LmMore = class extends HTMLElement {
  button = null;
  body = null;
  connectedCallback() {
    if (this.button) return;
    const id = this.getAttribute("panel") ?? `lm-more-${++moreSeq}`;
    const label = this.getAttribute("label") ?? "More";
    const body = document.createElement("div");
    body.className = "lm-more-body";
    body.id = id;
    body.hidden = true;
    while (this.firstChild) body.append(this.firstChild);
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);
    button.addEventListener("click", () => this.toggle());
    const hit = document.createElement("span");
    hit.className = "lm-hit";
    hit.setAttribute("aria-hidden", "true");
    hit.addEventListener("click", () => this.toggle());
    const ctrl = document.createElement("span");
    ctrl.className = "lm-more-ctrl";
    ctrl.append(hit, button);
    this.button = button;
    this.body = body;
    this.append(ctrl, body);
  }
  toggle(force) {
    if (!this.button || !this.body) return;
    const open = force ?? this.button.getAttribute("aria-expanded") !== "true";
    this.button.setAttribute("aria-expanded", String(open));
    this.body.hidden = !open;
    this.dispatchEvent(
      new CustomEvent("lm-toggle", { detail: { open }, bubbles: true })
    );
  }
  get open() {
    return this.button?.getAttribute("aria-expanded") === "true";
  }
};
function defineLmMore() {
  applyMotionPreference();
  if (!customElements.get("lm-more")) customElements.define("lm-more", LmMore);
}

// src/components/entries/more.ts
defineLmMore();

export { LmMore, defineLmMore };
//# sourceMappingURL=more.js.map
//# sourceMappingURL=more.js.map