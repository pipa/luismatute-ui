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

// src/components/flight-plan.ts
var LmFlightPlan = class extends HTMLElement {
  built = false;
  connectedCallback() {
    if (this.upgradeProperty("stops")) return;
    this.render();
  }
  set stops(value) {
    this.render(value);
  }
  upgradeProperty(prop) {
    const desc = Object.getOwnPropertyDescriptor(this, prop);
    if (!desc || !("value" in desc)) return false;
    const value = desc.value;
    delete this[prop];
    this.stops = value;
    return true;
  }
  stopsFromAttr() {
    const fromAttr = this.getAttribute("stops");
    if (!fromAttr) return null;
    try {
      const parsed = JSON.parse(fromAttr);
      return Array.isArray(parsed) ? parsed : null;
    } catch {
      return null;
    }
  }
  stopsFromChildren() {
    return [...this.querySelectorAll(":scope > a")].map(
      (a) => {
        const years = a.querySelector(".lm-yr")?.textContent ?? a.dataset.years ?? "";
        const named = a.querySelector(".lm-name")?.textContent;
        const label = named ?? (a.textContent ?? "").replace(years, "").trim();
        return {
          href: a.getAttribute("href") ?? "#",
          years,
          label
        };
      }
    );
  }
  render(stops) {
    const data = stops ?? this.stopsFromAttr() ?? this.stopsFromChildren();
    if (!data.length && this.built) return;
    this.replaceChildren();
    const ol = document.createElement("ol");
    for (const stop of data) {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = stop.href;
      a.className = "lm-plan-jump";
      const years = document.createElement("span");
      years.className = "lm-yr";
      years.textContent = stop.years;
      const name = document.createElement("span");
      name.className = "lm-name";
      name.textContent = stop.label;
      a.append(years, name);
      li.append(a);
      ol.append(li);
    }
    this.append(ol);
    this.built = true;
  }
};
function defineLmFlightPlan() {
  applyMotionPreference();
  if (!customElements.get("lm-flight-plan"))
    customElements.define("lm-flight-plan", LmFlightPlan);
}

// src/components/entries/flight-plan.ts
defineLmFlightPlan();

export { LmFlightPlan, defineLmFlightPlan };
//# sourceMappingURL=flight-plan.js.map
//# sourceMappingURL=flight-plan.js.map