// src/components/globe-route.ts
var hon = { id: "hon", label: "Honduras", x: 185.6, y: 578.7 };
var car = { id: "car", label: "Caribbean", x: 263.9, y: 636.4 };
var rtb = { id: "rtb", label: "Roat\xE1n", x: 188.4, y: 658.6 };
var ams = { id: "ams", label: "Amsterdam", x: 736.9, y: 259.7 };
var defaultRoute = {
  stops: [hon, car, rtb, ams],
  legs: [
    `M${hon.x} ${hon.y} C${hon.x + 26} ${hon.y + 30} ${hon.x + 52} ${hon.y + 4} ${hon.x + 38} ${hon.y - 18} C${hon.x + 26} ${hon.y - 36} ${hon.x - 8} ${hon.y - 22} ${hon.x} ${hon.y}`,
    `M${hon.x} ${hon.y} C${hon.x + 24} ${hon.y - 18} ${car.x - 40} ${car.y - 34} ${car.x} ${car.y}`,
    `M${car.x} ${car.y} C${car.x - 24} ${car.y + 42} ${rtb.x + 30} ${rtb.y + 20} ${rtb.x} ${rtb.y}`,
    `M${rtb.x} ${rtb.y} C${rtb.x + 120} ${rtb.y - 300} ${ams.x - 320} ${ams.y - 200} ${ams.x} ${ams.y}`
  ],
  active: 3
};
function parseRoute(value) {
  if (!value) return defaultRoute;
  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed.stops) || !Array.isArray(parsed.legs))
      return defaultRoute;
    return parsed;
  } catch {
    return defaultRoute;
  }
}

// src/illustrations/svg/avatar.ts
var avatar = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="lu lm-art" viewBox="0 0 200 240"><defs><clipPath id="__id__lw__id__"><rect width="152" height="192" x="24" y="24" rx="70"/></clipPath></defs><rect width="184" height="224" x="15" y="18" fill="var(--lm-porthole)" rx="88"/><rect width="184" height="224" x="8" y="8" fill="var(--lm-cream)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="5" rx="88"/><rect width="166" height="206" x="17" y="17" fill="var(--lm-frame)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" rx="79"/><g clip-path="url(#__id__lw__id__)"><rect width="200" height="240" fill="var(--lm-cabin)"/><rect width="200" height="4" y="150" fill="var(--lm-rail)"/><g class="lu-seat"><path fill="var(--lm-lagoon)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m42 240 3-128q3-40 55-44 52 4 55 44l3 128Z"/><rect width="60" height="34" x="70" y="79" fill="var(--lm-cream)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" rx="14"/><path stroke="var(--lm-stitch)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M58 150h84"/></g><g class="lu-torso"><path fill="var(--lm-marigold)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M24 240q2-36 38-46 20-6 38-5 18-1 38 5 36 10 38 46Z"/><path fill="var(--lm-cream)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M84 190q16 24 32 0Z"/><path fill="var(--lm-fold)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m81 189 15 35-28-19Z"/><path fill="var(--lm-fold)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="m119 189-15 35 28-19Z"/><circle cx="100" cy="232" r="2.6" fill="var(--lm-ink)"/><g class="lu-wave" opacity="0"><path fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M151.3 172L157 103A6 6 0 0 1 169 103L166.8 172Z"/><path fill="var(--lm-marigold)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M141 212C143 196 145 180 147.5 165Q159 161 170.5 166C171.5 182 173 199 175 214L153 224Z"/><g class="lu-hand"><path class="lu-finger" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M156.3 90.4L151.9 74A2.7 2.7 0 0 0 146.7 75.4L151.1 91.8Z"/><path class="lu-finger" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M160.7 89L157.3 69.3A2.7 2.7 0 0 0 151.9 70.3L155.4 90Z"/><path class="lu-finger" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M165.4 88.6L163.8 69.7A2.7 2.7 0 0 0 158.4 70.2L160 89.1Z"/><path class="lu-finger" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M170.3 90.2L170.5 75.2A2.7 2.7 0 0 0 165.1 75.1L164.9 90.1Z"/><path class="lu-thumb" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M157.9 99.1L151.7 91.2A3.1 3.1 0 0 0 146.9 95L153 102.9Z"/><path fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M150.6 91.6C149.9 86.6 169.7 83.8 170.4 88.8L171.8 98.7C172.8 105.6 168.2 108.8 163.2 109.5C158.3 110.2 153 108.4 152 101.5Z"/></g></g></g><rect width="24" height="42" x="88" y="150" fill="var(--lm-skin-d)"/><g class="lu-head"><g class="lu-bun"><circle cx="100" cy="60" r="14.5" fill="var(--lm-skin-hair)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3"/><path stroke="var(--lm-hair-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" d="M91 56q9-7 18 0"/><path stroke="var(--lm-hair-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M93 63q7-4 14 0"/><rect width="22" height="7" x="89" y="70" fill="var(--lm-tomato)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" rx="3.5"/></g><g class="lu-ears"><ellipse cx="63" cy="122" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" rx="8.5" ry="12"/><ellipse cx="137" cy="122" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" rx="8.5" ry="12"/><path stroke="var(--lm-skin-d)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M62 116q-5 6 1 12"/><path stroke="var(--lm-skin-d)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.4" d="M138 116q5 6-1 12"/></g><ellipse cx="100" cy="118" fill="var(--lm-skin)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" rx="37" ry="45"/><path fill="var(--lm-sideburn)" d="M63.5 116Q62 99 68 90l8 3q-6 10-5.5 23Z"/><path fill="var(--lm-sideburn)" d="M136.5 116q1.5-17-4.5-26l-8 3q6 10 5.5 23Z"/><g class="lu-hair"><path fill="var(--lm-skin-hair)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M64 104q-2-35 36-37 38 2 36 37-6-17-20-21-16-4-32 0-14 4-20 21"/><path fill="var(--lm-sideburn)" d="M70.6 81.5L80.5 84Q75.5 90 73.5 97Q72 102 70 107H65.3V105Q63.9 92.8 70.6 81.5Z"/><path fill="var(--lm-sideburn)" d="M129.4 81.5L119.5 84Q124.5 90 126.5 97Q128 102 130 107H134.7V105Q136.1 92.8 129.4 81.5Z"/><path fill="var(--lm-skin-fade)" d="M66.3 90.6L75.6 92.6Q74.2 94.6 73.5 97Q72 102 70 107H65.3V105Q64.5 97.9 66.3 90.6Z"/><path fill="var(--lm-skin-fade)" d="M133.7 90.6L124.4 92.6Q125.8 94.6 126.5 97Q128 102 130 107H134.7V105Q135.5 97.9 133.7 90.6Z"/><path stroke="var(--lm-hair-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M82 77q13-6 28-3"/></g><g class="lu-beard"><path fill="var(--lm-skin-beard)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M63 106c-2 36 9 65 37 72 28-7 39-36 37-72h-6c0 18-5 28-13 31-8-6-28-6-36 0-8-3-13-13-13-31Z"/><path stroke="var(--lm-beard-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M86 162q14 8 28 0"/></g><g class="lu-face"><ellipse cx="75" cy="128" fill="var(--lm-skin-blush)" opacity=".55" rx="7" ry="4"/><ellipse cx="125" cy="128" fill="var(--lm-skin-blush)" opacity=".55" rx="7" ry="4"/><g class="lu-nose"><path fill="var(--lm-skin-d)" d="M100 111q-5 14-7 19 7 5 14 0-2-5-7-19"/><circle cx="97" cy="128" r="1.6" fill="var(--lm-skin-highlight)"/></g><path fill="var(--lm-skin-hair)" d="M83 138q8-9 17-6 9-3 17 6-9 4-17 1-8 3-17-1"/><path fill="var(--lm-skin)" d="M83.1 149.9A3.5 3.5 0 0 1 89.9 148.3C90.9 152.1 90.7 157.8 88.8 158.3C86.9 158.8 84.1 153.8 83.1 149.9Z"/><path fill="var(--lm-skin)" d="M110.1 148.3A3.5 3.5 0 0 1 116.9 149.9C115.9 153.8 113.1 158.8 111.2 158.3C109.3 157.8 109.1 152.1 110.1 148.3Z"/><g class="ms"><path fill="var(--lm-skin-lip)" stroke="var(--lm-lip-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M88 144.5q12 13.5 24 0-12 5-24 0"/><path fill="var(--lm-teeth)" d="M90.5 145.6q9.5 4 19 0l-.9 2.4q-8.6 3.4-17.2 0Z"/></g><g class="mo"><ellipse cx="100" cy="148" fill="var(--lm-skin-lip)" stroke="var(--lm-lip-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" rx="6" ry="7.4"/><ellipse cx="100" cy="151.5" fill="var(--lm-mouth)" rx="3.6" ry="2.4"/></g><g class="mw"><path fill="var(--lm-skin-lip)" stroke="var(--lm-lip-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M85 143q15 19 30 0-15 6-30 0"/><path fill="var(--lm-teeth)" d="M88 144.2q12 5 24 0l-1.4 3.4q-10.6 4.4-21.2 0Z"/><ellipse cx="100" cy="155" fill="var(--lm-mouth)" rx="4.5" ry="2.2"/></g><g class="eo l"><ellipse cx="85" cy="113" fill="var(--lm-skin-hair)" rx="3.4" ry="4.3"/><circle cx="86.3" cy="111.4" r="1.2" fill="var(--lm-white)"/></g><g class="eo r"><ellipse cx="115" cy="113" fill="var(--lm-skin-hair)" rx="3.4" ry="4.3"/><circle cx="116.3" cy="111.4" r="1.2" fill="var(--lm-white)"/></g><g class="ec l"><path stroke="var(--lm-skin-hair)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" d="M80 113q5 4.5 10 0"/></g><g class="ec r"><path stroke="var(--lm-skin-hair)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.6" d="M110 113q5 4.5 10 0"/></g><circle cx="85" cy="113" r="12.5" fill="rgba(255,255,255,.14)"/><circle cx="115" cy="113" r="12.5" fill="rgba(255,255,255,.14)"/><g class="lu-shades" opacity="0"><circle cx="85" cy="113" r="12.5" fill="var(--lm-lens-tint)" opacity="var(--lm-lens-tint-opacity)"/><circle cx="115" cy="113" r="12.5" fill="var(--lm-lens-tint)" opacity="var(--lm-lens-tint-opacity)"/><path stroke="var(--lm-white)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M79.5 116.5 86.5 109.5" opacity=".9"/><path stroke="var(--lm-white)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M109.5 116.5 116.5 109.5" opacity=".9"/></g><circle cx="85" cy="113" r="12.5" stroke="var(--lm-skin-tort)" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.6"/><circle cx="115" cy="113" r="12.5" stroke="var(--lm-skin-tort)" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.6"/><circle cx="85" cy="113" r="12.5" stroke="var(--lm-scratch)" stroke-dasharray="1.4 3.6 3.2 5.4 0.8 4.2 2.2 6" stroke-linecap="round" stroke-width="2.4"/><circle cx="115" cy="113" r="12.5" stroke="var(--lm-scratch)" stroke-dasharray="2.6 4.8 1 3.8 3.6 6.2 1.4 4" stroke-dashoffset="7" stroke-linecap="round" stroke-width="2.4"/><path stroke="var(--lm-skin-tort)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3.6" d="M97.5 112q2.5-3.5 5 0"/><path stroke="var(--lm-skin-tort)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m72.5 110-8.5-4"/><path stroke="var(--lm-skin-tort)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="m127.5 110 8.5-4"/><g class="lu-glint"><path stroke="var(--lm-white)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M78 106q3-3 7-3" opacity=".75"/><path stroke="var(--lm-white)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M108 106q3-3 7-3" opacity=".75"/></g><g class="brw"><path stroke="var(--lm-skin-hair)" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.8" d="M75 96q10-5.5 19-1"/><path stroke="var(--lm-skin-hair)" stroke-linecap="round" stroke-linejoin="round" stroke-width="4.8" d="M106 95q9-4.5 19 1"/></g><g class="lu-cap"><path fill="var(--lm-cap)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M72 78h56l-28-20Z"/><rect width="56" height="8" x="72" y="78" fill="var(--lm-cap)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/><circle cx="100" cy="90" r="3" fill="var(--lm-marigold)"/></g><g class="lu-book"><rect width="34" height="26" x="118" y="168" fill="var(--lm-white)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" rx="4"/><path stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M124 174h22m-22 6h22m-22 6h16"/></g></g></g><g fill="var(--lm-ink)" class="zz" font-family="Bricolage Display, sans-serif" font-weight="800"><text x="146" y="92" font-size="18">z</text><text x="156" y="74" font-size="22">z</text><text x="166" y="54" font-size="26">z</text></g><path fill="var(--lm-white)" d="m38 74 36-36h14L42 84Z" opacity=".2"/><path fill="var(--lm-white)" d="m42 104 64-64h10l-70 74Z" opacity=".12"/><g class="shade"><rect width="164" height="232" x="18" y="-210" fill="var(--lm-shade)"/><path stroke="var(--lm-shade-line)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M18-20h164M18-2h164"/><rect width="24" height="9" x="88" y="12" fill="var(--lm-shade-pull)" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.2" rx="4.5"/></g></g><rect width="152" height="192" x="24" y="24" stroke="var(--lm-ink)" stroke-linecap="round" stroke-linejoin="round" stroke-width="3" rx="70"/></svg>';

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
function motionReduced() {
  const mode = document.documentElement.dataset.motion;
  if (mode === "reduce") return true;
  if (mode === "full") return false;
  return globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

// src/components/avatar.ts
var POSES = /* @__PURE__ */ new Set([
  "wow",
  "wave",
  "read",
  "beach",
  "grad",
  "sleep",
  "wink",
  "eek"
]);
var avatarSeq = 0;
function n(v) {
  return String(Math.round(v * 10) / 10);
}
var LmAvatar = class extends HTMLElement {
  svg = null;
  parts = null;
  blinkT = 0;
  glanceT = 0;
  raf = 0;
  last = 0;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  bx = 0;
  by = 0;
  bvx = 0;
  bvy = 0;
  glance = [0, 0];
  onMotion = () => this.sync();
  onPause = () => this.sync();
  static get observedAttributes() {
    return ["pose", "note", "motion"];
  }
  connectedCallback() {
    if (!this.svg) {
      const prefix = `a${++avatarSeq}`;
      const existing = this.querySelector("svg");
      let svg = existing;
      if (!svg) {
        const wrap = document.createElement("div");
        wrap.innerHTML = avatar.replaceAll("__id__", prefix);
        svg = wrap.querySelector("svg");
        if (!svg) return;
        this.append(svg);
      } else if (svg.outerHTML.includes("__id__")) {
        const html = svg.outerHTML.replaceAll("__id__", prefix);
        const wrap = document.createElement("div");
        wrap.innerHTML = html;
        const next = wrap.querySelector("svg");
        if (next) {
          svg.replaceWith(next);
          svg = next;
        }
      }
      svg.setAttribute("role", "img");
      const label = this.getAttribute("label") ?? "Luis at the window";
      svg.setAttribute("aria-label", label);
      if (!svg.classList.contains("lm-art")) svg.classList.add("lm-art");
      this.svg = svg;
      const q = (sel) => svg.querySelector(sel);
      this.parts = {
        head: q(".lu-head"),
        face: q(".lu-face"),
        nose: q(".lu-nose"),
        beard: q(".lu-beard"),
        hair: q(".lu-hair"),
        ears: q(".lu-ears"),
        bun: q(".lu-bun"),
        torso: q(".lu-torso"),
        seat: q(".lu-seat")
      };
      if (this.parts.head)
        this.parts.head.style.transformOrigin = "100px 172px";
      if (this.parts.torso)
        this.parts.torso.style.transformOrigin = "100px 240px";
    }
    document.documentElement.addEventListener("lm-motion", this.onMotion);
    document.documentElement.addEventListener("lm-pause", this.onPause);
    bindMotionMedia();
    this.applyPose();
    this.sync();
  }
  disconnectedCallback() {
    this.stop();
    document.documentElement.removeEventListener("lm-motion", this.onMotion);
    document.documentElement.removeEventListener("lm-pause", this.onPause);
  }
  attributeChangedCallback() {
    this.applyPose();
    this.sync();
  }
  poseName() {
    const pose = this.getAttribute("pose") ?? "";
    return POSES.has(pose) ? pose : "";
  }
  applyPose() {
    const svg = this.svg;
    if (!svg) return;
    for (const name of POSES) svg.classList.remove(`ex-${name}`);
    const pose = this.poseName();
    if (pose) svg.classList.add(`ex-${pose}`);
    const note = this.querySelector(".lm-note");
    const text = this.getAttribute("note");
    if (text && !note) {
      const p = document.createElement("p");
      p.className = "lm-note";
      p.textContent = text;
      this.append(p);
    } else if (!text && note) {
      note.remove();
    } else if (text && note) {
      note.textContent = text;
    }
  }
  /**
   * Idle stops for the OS reduced-motion setting, the pause control, explicit
   * `data-motion="reduce"`, `static`, or `motion="off"|"reduce"`.
   * `motion="idle"` (the default when the attribute is omitted) keeps running
   * in Info (`data-motion="calm"`).
   */
  frozen() {
    const choice = this.getAttribute("motion");
    if (this.hasAttribute("static") || choice === "off" || choice === "reduce") {
      return true;
    }
    return motionReduced() || document.documentElement.classList.contains("paused");
  }
  sync() {
    this.stop();
    if (this.frozen()) {
      if (this.poseName() === "sleep") this.pose(-0.35, 0.5, 9);
      else this.pose(0, 0, 0);
      return;
    }
    this.blinkLoop();
    this.glanceLoop();
  }
  stop() {
    window.clearTimeout(this.blinkT);
    window.clearTimeout(this.glanceT);
    if (this.raf) cancelAnimationFrame(this.raf);
    this.raf = 0;
    this.svg?.classList.remove("blink");
  }
  blinkLoop() {
    this.blinkT = window.setTimeout(
      () => {
        if (this.frozen()) return;
        if (this.poseName() !== "sleep" && this.svg) {
          this.svg.classList.add("blink");
          window.setTimeout(
            () => this.svg?.classList.remove("blink"),
            120 + Math.random() * 40
          );
        }
        this.blinkLoop();
      },
      2400 + Math.random() * 3200
    );
  }
  glanceLoop() {
    this.glanceT = window.setTimeout(
      () => {
        if (this.frozen()) return;
        const r = Math.random();
        this.glance = r < 0.4 ? [0, 0] : [(Math.random() * 2 - 1) * 0.5, (Math.random() * 2 - 1) * 0.3];
        this.kick();
        this.glanceLoop();
      },
      1600 + Math.random() * 2400
    );
  }
  kick() {
    if (this.raf) return;
    this.last = 0;
    this.raf = requestAnimationFrame((now) => this.tick(now));
  }
  tick(now) {
    this.raf = 0;
    if (this.frozen() || !this.parts) return;
    const dt = Math.min(0.05, this.last ? (now - this.last) / 1e3 : 1 / 60);
    this.last = now;
    let tx = this.glance[0];
    let ty = this.glance[1];
    if (this.poseName() === "sleep") {
      tx = -0.35;
      ty = 0.5;
    }
    const kk = 70;
    const cc = 2 * 0.72 * Math.sqrt(kk);
    this.vx += ((tx - this.x) * kk - this.vx * cc) * dt;
    this.vy += ((ty - this.y) * kk - this.vy * cc) * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const kb = 120;
    const cb = 2 * 0.3 * Math.sqrt(kb);
    this.bvx += ((-this.vx * 0.9 - this.bx) * kb - this.bvx * cb) * dt;
    this.bvy += ((-this.vy * 0.6 - this.by) * kb - this.bvy * cb) * dt;
    this.bx += this.bvx * dt;
    this.by += this.bvy * dt;
    this.pose(this.x, this.y, this.poseName() === "sleep" ? 9 : 0);
    const moving = Math.abs(this.vx) + Math.abs(this.vy) + Math.abs(this.bvx) > 4e-3 || Math.abs(tx - this.x) + Math.abs(ty - this.y) > 2e-3;
    if (moving) this.raf = requestAnimationFrame((t) => this.tick(t));
  }
  pose(x, y, tilt) {
    const p = this.parts;
    if (!p) return;
    p.head.style.transform = `translate(${n(x * 3)}px,${n(y * 2)}px) rotate(${n(x * 4.5 + tilt)}deg)`;
    p.face.style.transform = `translate(${n(x * 7.5)}px,${n(y * 4.5)}px)`;
    p.nose.style.transform = `translate(${n(x * 2.6)}px,${n(y * 1.2)}px)`;
    p.beard.style.transform = `translate(${n(x * 3.6)}px,${n(y * 2.2)}px)`;
    p.hair.style.transform = `translate(${n(x * 1.6)}px,${n(y * -0.8)}px)`;
    p.ears.style.transform = `translate(${n(-x * 3.4)}px,${n(y)}px)`;
    p.bun.style.transform = `translate(${n(-x * 5 + this.bx * 6)}px,${n(-y * 2.4 + this.by * 4)}px)`;
    p.torso.style.transform = `rotate(${n(x * 1.3)}deg)`;
    p.seat.style.transform = `translate(${n(-x * 2.2)}px,0)`;
  }
};
function defineLmAvatar() {
  applyMotionPreference();
  if (!customElements.get("lm-avatar"))
    customElements.define("lm-avatar", LmAvatar);
}

// src/components/card.ts
var LmCard = class extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }
  connectedCallback() {
    if (!this.hasAttribute("variant")) this.setAttribute("variant", "stop");
  }
};
function defineLmCard() {
  applyMotionPreference();
  if (!customElements.get("lm-card")) customElements.define("lm-card", LmCard);
}

// src/components/chip.ts
var BADGE = "Featured";
var LmChip = class extends HTMLElement {
  static get observedAttributes() {
    return ["variant"];
  }
  connectedCallback() {
    this.sync();
  }
  attributeChangedCallback() {
    this.sync();
  }
  sync() {
    const featured = this.getAttribute("variant") === "featured";
    const badge = this.querySelector("b");
    if (featured && !badge) {
      const b = document.createElement("b");
      b.textContent = BADGE;
      this.append(b);
    } else if (!featured && badge?.textContent === BADGE) {
      badge.remove();
    }
  }
};
function defineLmChip() {
  applyMotionPreference();
  if (!customElements.get("lm-chip")) customElements.define("lm-chip", LmChip);
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

// src/illustrations/svg/globe.ts
var globe = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 1000 1000"><defs><clipPath id="__id__lmglobe__id__"><circle cx="500" cy="500" r="500"/></clipPath></defs><g clip-path="url(#__id__lmglobe__id__)"><circle cx="500" cy="500" r="500" fill="var(--lm-globe-ocean)"/><circle cx="500" cy="500" r="430" fill="var(--lm-globe-deep)"/><path fill="var(--lm-globe-land)" stroke="var(--lm-ink)" stroke-linejoin="round" stroke-width="3" d="M286 571q4 0 13 3 10 4 15 9 6 6 4 7-1 2-9-1-7-2-10 0-3 3-7 0-3-4-9-5-6 0-7-3t6-2q8 2 5-3-4-5-1-5Zm-50-44q8 5 25 22 16 17 4 14-13-3-10-4 3-2-2-9-4-6-14-12-10-7-9-8 0-2-11-3t-1-3 18 3Zm210-202q-2 4-4 7-2 4 0 3 2-2 2 1 1 2 7 4 7 2 5 5-1 3 1 2 2 0 3 5t-1 8q-1 4-4 3-4-1-3-5 0-4-4-1-4 4-6 3-1 0 1-2 2-1 0-3-3-1-12-2-8-1-1-13 8-12 12-15 5-4 4 0Zm245-51q2 9 0 13t-6 4q-3 1-4-4 0-4-3-8-3-3-2-9 2-6 7-6 5 1 8 10Zm-17-40q3-2 4 3 1 4 5 2 3-2 5 5 2 6 19 13t20 12 3 8-7 7-10 8q-3 5-5 5-1 0 1-7t-3-7q-5-1-4-3 2-2-2-6-3-4 0-5t2-3-7-3q-5-1-8-5-3-3-3-1t-4-3q-4-4-7-12-2-7 1-8Zm-78-34q8-5 12-1 5 4 0 12-6 8-13 8-8 0-7-2t-4-3q-4-1-2-3t-2-2q-4-1-4-3 1-2 6-2 6 1 14-4Zm-220-39q1 2-2 5t1 1q4-1 0 6-3 7 6 0 10-7 12-5 3 2-1 10-5 9-9 10t-7-1q-3-1-10 3-7 5-27 12t-27 13q-6 6-4 7 2 2-1 9-3 6-1 6 3 1 9 13t11 14q5 3 1 10-3 7-3 16 1 10 7 6 5-4 7-13 1-9 11-14 11-4 11-14 1-9 5-12t8-12 11-7q8 1 10 7 3 6 6 7t1 9q-3 8-1 11 3 4 12-3t12 7q4 14 2 16-1 3 8 11t12 13q3 6 3 11-1 4-14 11-13 6-30 4-16-3-33 8t-2 4q15-6 19-6t6 3q2 2-1 4-3 3-3 11-1 7 8 10 8 3 12-1t5 0q1 5-18 12-18 8-20 7-3-1-2-4 1-4 7-6 6-3-2-4-8 0-18 4-11 4-14 9-4 5-2 9 1 3-11 3t-6 2q5 1-1 0-7 0-12 6-5 7-6 4t-1 2-5 9q-4 4-2-4 1-8 0-4-2 5-3 3-2-1-2 11 0 13-22 24-23 12-24 32-2 21-5 27-2 7-6 2-4-4-4-19 1-15-2-20-2-6-6-5-3 1-6-4t-10-8q-8-3-11 1-2 5-11-3-10-8-14-9t-14 3q-10 5-18 23-9 19-9 28-1 8 1 17 1 10 4 15 4 5 15 6 12 1 15-5t13-4q11 2 0 23-12 20 1 25t17 10q5 5 1 22-4 16 3 28 7 13 14 12t17 6 14 5q5-2 8-7 4-6 10-5 5 1 12-3 7-3 9-1t-1 4-3 12 3 7 1-7q-1-5 4-6 5 0 7-3 1-3 7 5t19 12q14 5 16 3 3-2 13-1 10 2 6 2-4 1-2 3 1 2 7 6 7 3 7 6 1 3 7 7 7 3 15 12t21 11q14 2 25 9 12 6 15 15 4 9 6 10t-1 6q-3 6 6 8t9 6q0 3 4 1 3-2 16 1 13 4 14 8t21 4 32 6q12 7 20 8 9 2 11 8t0 12-17 20q-16 15-19 29-3 15-11 26-7 12-11 15-5 3-27 8-23 5-26 7-4 3-5 9t-18 17-34 8q-16-2-9 3t5 8q-3 2-18 1t-13 2q3 3-6 2t-3 2q7 3-2 4-8 2-2 5 7 2 2 4-5 1-1 2 5 2-12-2-16-4-27-10t-11-8q-1-2 3-1 4 2 2-1-1-2-4-2-4 0-10-9t-4-17q2-7-2-15-3-8-4-25-1-18-4-27-3-8-26-25t-40-46-22-35q-6-5-7-10t5-11q5-5 1-8t-4-8q0-4 3-10t7-6q5-1 6-5 2-5 7-8t4-14q0-12-6-23-5-11-10-10-4 1-3 5 1 3-1 4-1 0-12-8-10-9-14-17-5-9-5-7-1 2-3 0-1-3-1-7 0-5-4-16-4-12-15-20-12-8-20-23-8-14-13-15-6-1-20-24-14-22-17-32-2-10 1-20 3-9 1-28-2-20 2-53 3-33 0-26-4 6-8 41-3 35-5 36t-3-11q0-11 2-16t1-16q-1-12 2-13 2-2 8-24 5-21 5-33 0-11 9-31 8-20 35-49 26-30 24-24-2 7 4 1t9-18q4-11 28-37 24-25 25-31 2-5 13-19 11-15 8-14-3 0-4-3t6-4q8-2-5-4-13-1-12-6 2-6 4-2 2 3 7 3 5-1 9-6 3-5 17-12 14-6 18-6t2 3q-1 3 12-5 14-7 10-2t9 0q13-4 12-3t2 2q4 2 5 5 0 3-6 8-6 4-15 17-9 12-3 16 6 3 4 4-2 2 1 1 4 0 0 3-3 4 0 4 3-1 0 1-3 1-1 2 2 0 2 8 0 7-4 11-3 4 0 6 4 2 2 4-1 3 6 1 7-1 7 5t4 8q3 2 6 0 4-2 1 3-2 4 5 1 8-4 9-8t8-8 5 2q-2 7-4 8-3 1-1 2Zm-19-44q8 1 6 1-2 1 0 2 3 0 1 2-1 2 2 2 2-1-1 3-4 4 2 2t-2 9q-8 12-12 13t-5-2q-2-4-9-8-8-4-5-9 4-6 8-4 4 3 2-1t1-5q4 0 4-3-1-2 8-2Zm51 28q-2 1-3 4-1 2 6 0 6-2 4 3-3 5 2 4 5 0 6 5 2 6 4 6 3 0 6 9t0 10 5 9 3 14q-6 6-9 0-3-5-5-5t-1 11q2 11 1 14-2 2-7-3-6-5-3 2 2 8-6 2-7-5-11-13-3-8-9-9-7-2-4-4t9-1q7 2 12-4 5-5 3-17-3-12-7-12-4 1-11-5-7-5-3-11t9-8q5-3 9-3 3 1 0 2Zm-51-30q-11 1-14 0-2-1 1-5 3-3 13-6t12-1q1 1-1 7-1 5-11 5Zm56 5q3 0 3 6-1 6 6 8 7 3 6 5 0 3-7 2-8-1-12-5-4-3 0-7 3-5 3-7-1-2 1-2ZM381 15q16-4 9-1t6-1q12-4 41-8 28-4 75-3 46 1 77 7 30 5 74 21 44 15 72 30 27 14 65 42 37 28 58 51 22 22 49 60t30 47-2 5-4 1q1 4 11 16t6-1q-5-12 10 21 14 34 22 70 8 37 3 23-4-13-16-29-11-16-21-23-11-8-13-13-3-6 0 3 3 8-3 3-5-5 12 14 18 19 34 45 16 27 12 6-3-21 3 13 6 35 6 87 0 51-9 96-8 44-19 74-11 29-34 70-22 41-42 67-20 25-6 0t16-39 11-36 9-40q-1-19-8-28-7-8-4-26 2-17-2-22-3-4-10 3t-12 2q-4-5-23 11-18 16-26 19-9 2-18 9-10 8-15 8t-18-5-23-17q-10-11-17-15-7-3-8-9-1-5-5-9t-1-11q4-7 4-15 0-9-6-24t-1-36 16-42q11-20 9-31-3-12 1-21 5-9 5-17t11-10 17-12q7-11 20-21 13-9 16-14 3-4 5-3 3 2 4-1t6 11q6 13 29 12t21-15 6-16q7-2 13-6 5-4 6-11 0-6 2-6 2 1 3-5 1-5-11-26-12-22-12-13-1 8-3 8-2-1-2 4-1 6-4 7-3 2-12-5t-10-27 5-25q5-5 4-12t-4-10q-4-3-13-3-9 1-14-9-6-9-4 0 1 9 6 10 4 2 5 8t-3 5-5-4q-2-4-5-1-3 2 6 19t15 20q5 3 5 10t-2 6q-2-2-4-1-1 2 0 7 2 5-1 5-2 0 6 7 9 8 7 8-1 1 1 7 3 7-10-2-14-8-18-13-3-6-23-10-20-5-17 2 3 6 23 11 19 5 19 7 1 1-3 1-3 0 1 10 5 10-1 4t-15-7q-10-2-22-7-13-5-14 3-1 7-8 12-7 4-4 9 2 4-1 11-3 6 0 15 3 10 1 21-1 11-7 14-6 2-7 7-1 4-6 1t-11 0q-7 3-18-21-12-24-10-29 2-4 18-9 15-5 15-8t-4-11q-4-7-16-11-11-4-13-7-2-2 5-5 6-3 3-7t-1-3q3 0 6-5t1-8q-1-3 1-8t0-11q-3-6 2-11 4-5-6-17t-9-16 6 4q6 8 12 12 6 3 7 0 1-4 5-3 4 0 5-7 1-8 4-9 4-1 3-5t-8-11q-7-6-7-8-1-2 3-2t-4-5-6-10q2-6 1-9-2-2-4-2t-3 7q-2 7-6 6-4 0-11-5-7-4-15-15t-10-11q-3 0-3 3 0 2 11 17 12 16 18 18 6 1 16 16 10 14 8 15t0 4 1 4q-2 2-18-8t-15-4q2 5-3 7-5 1-16-8-10-10-12-22-1-12-13-31-11-20-12-29t7-8q7 0 6-1t4-3q4-2 11-4 7-1 13 4 5 5 2 8-4 4 8 5 12 2 7 0-5-3-2-4 2-1-5-7-8-6-6-7t-8-4-9-5 7 0q7 2-3-7-10-8-7-8 2-1-2-5-5-4-3-4t-4-2q-7-2-5-7 3-4-7-5-10 0-20-4t14-2 16 0q-8-3-25-4-18 0-13-1 4-1-2-4t-11-2q-6 1-12-2t-30-6-24-5-6-5q-5-2 2-2 8-1 4-3-3-2-19-4-17-1-21-4-5-3-49 0-44 4-68 13-25 9-37 9-11 0-9-2 3-1-6 1-8 1 0-4 7-6 20-10 12-4 7-3-6 1 10-3Zm484 180q9 5 19 15 11 10 12 7t-1-7q-3-4-13-16-11-11-14-12-2-2 1 2t-6 0q-9-5-17-15-8-9 1 6t18 20Zm-402-93q14 1 16 4 3 2-7 8-10 5-15 6-5 0-5 2-1 3-7 5-7 2-6 4t-3 3q-4 0-10-3-6-4-1-7t6-1 1-1q1-3 7-7t9-4q3 1 0-1-3-1-1-5 3-4 16-3Zm47 1q8-1 13 0 4 1-1 4t0 2 6 2q2 2 5-1 2-3 6-2 3 1 1 5-3 4 5 13 7 8 5 10-2 1 4 8 7 6 4 7-2 0 0 2 3 2 0 4-3 1 0 4t0 3q-3 1 3 5 7 4 5 5-2 2-6-1-4-2-4 2 1 4 7 3 5-1 0 6-6 7-11 9-6 2-12 11-6 8-12 10t-10 13q-5 10-6 20t-4 10-6-3-7-3q-5 0-11-11-6-10-8-23-3-13 3-22t1-9q-6 1-5-3t5-3-1-3q-6-4-4-7t0-12q-2-10-12-13-9-4-10-7t4-3q4-1 0-4-5-3 4-5 8-3 7-5 0-2 6-6 5-4 13-5t11 1q4 2 3 0-2-3 0-5 2-1 9-3Z"/><path fill="var(--lm-globe-shade)" fill-rule="evenodd" d="M-20-20h1040v1040H-20Zm-90 440a530 530 0 1 0 1060 0 530 530 0 1 0-1060 0" opacity=".26"/><path fill="var(--lm-foam)" fill-rule="evenodd" d="M-20-20h1040v1040H-20Zm30 560a530 530 0 1 0 1060 0 530 530 0 1 0-1060 0" opacity=".3"/></g><circle cx="500" cy="500" r="500" stroke="var(--lm-ink)" stroke-width="4.5"/></svg>';

// src/components/globe.ts
var SVG_NS = "http://www.w3.org/2000/svg";
var globeSeq = 0;
var LmGlobe = class extends HTMLElement {
  button = null;
  overlay = null;
  closeBtn = null;
  stage = null;
  stageSvg = null;
  connectedCallback() {
    if (this.button) return;
    const id = `lm-globe-${++globeSeq}`;
    const titleId = `${id}-title`;
    const button = document.createElement("button");
    button.type = "button";
    button.className = "lm-globe-btn";
    button.setAttribute("aria-label", "Open route map");
    button.setAttribute("aria-expanded", "false");
    button.setAttribute("aria-controls", id);
    button.innerHTML = globe.replaceAll("__id__", `${id}-mini`);
    const overlay = document.createElement("dialog");
    overlay.className = "lm-globe-overlay";
    overlay.id = id;
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-labelledby", titleId);
    const panel = document.createElement("div");
    panel.className = "lm-globe-panel";
    const close = document.createElement("button");
    close.type = "button";
    close.className = "lm-globe-close";
    close.setAttribute("aria-label", "Close route map");
    close.textContent = "\xD7";
    const h = document.createElement("h2");
    h.id = titleId;
    h.textContent = this.getAttribute("heading") ?? "Route";
    const p = document.createElement("p");
    const description = this.getAttribute("description");
    p.hidden = !description;
    p.textContent = description ?? "";
    const stage = document.createElement("div");
    stage.className = "lm-globe-stage";
    stage.id = `${id}-stage`;
    stage.setAttribute("aria-hidden", "true");
    panel.append(close, h, p, stage);
    overlay.append(panel);
    button.addEventListener(
      "click",
      () => overlay.open ? this.close() : this.open()
    );
    close.addEventListener("click", () => this.close());
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) this.close();
    });
    overlay.addEventListener("cancel", (event) => {
      event.preventDefault();
      this.close();
    });
    overlay.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      }
      if (event.key === "Tab") this.trap(event);
    });
    overlay.addEventListener("close", () => this.syncClosed());
    this.button = button;
    this.overlay = overlay;
    this.closeBtn = close;
    this.stage = stage;
    this.append(button, overlay);
    this.buildStage(id);
  }
  disconnectedCallback() {
    this.overlay?.close();
  }
  route() {
    return parseRoute(this.getAttribute("route"));
  }
  buildStage(id) {
    const stage = this.stage;
    if (!stage || this.stageSvg) return;
    const svg = document.createElementNS(SVG_NS, "svg");
    svg.setAttribute("viewBox", "0 0 1000 1000");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("fill", "none");
    const holder = document.createElement("div");
    holder.innerHTML = globe.replaceAll("__id__", `${id}-map`);
    const source = holder.querySelector("svg");
    if (source) {
      while (source.firstChild) svg.append(source.firstChild);
    }
    for (const circle of svg.querySelectorAll("circle")) {
      if (circle.hasAttribute("stroke") && !circle.hasAttribute("fill"))
        circle.setAttribute("fill", "none");
    }
    this.drawRoute(svg);
    stage.append(svg);
    this.stageSvg = svg;
  }
  drawRoute(svg) {
    const route = this.route();
    const active = route.active ?? route.legs.length - 1;
    for (const [i, d] of route.legs.entries()) {
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("class", "lm-leg");
      path.setAttribute("data-hot", i === active ? "true" : "false");
      path.setAttribute("d", d);
      path.setAttribute("fill", "none");
      if (i !== active) path.setAttribute("opacity", "0.55");
      svg.append(path);
    }
    for (const stop of route.stops) {
      if (!Number.isFinite(stop.x) || !Number.isFinite(stop.y)) continue;
      const g = document.createElementNS(SVG_NS, "g");
      g.setAttribute("class", "lm-pin");
      const outer = document.createElementNS(SVG_NS, "circle");
      outer.setAttribute("cx", String(stop.x));
      outer.setAttribute("cy", String(stop.y));
      outer.setAttribute("r", "9");
      outer.setAttribute("fill", "var(--lm-marigold)");
      outer.setAttribute("stroke", "var(--lm-ink)");
      outer.setAttribute("stroke-width", "3.5");
      const inner = document.createElementNS(SVG_NS, "circle");
      inner.setAttribute("cx", String(stop.x));
      inner.setAttribute("cy", String(stop.y));
      inner.setAttribute("r", "3");
      inner.setAttribute("fill", "var(--lm-ink)");
      g.append(outer, inner);
      svg.append(g);
    }
  }
  open() {
    const overlay = this.overlay;
    const button = this.button;
    if (!overlay || !button || overlay.open) return;
    overlay.showModal();
    button.setAttribute("aria-expanded", "true");
    this.classList.add("is-open");
    this.closeBtn?.focus();
  }
  close() {
    const overlay = this.overlay;
    if (!overlay?.open) return;
    overlay.close();
  }
  syncClosed() {
    this.classList.remove("is-open");
    this.button?.setAttribute("aria-expanded", "false");
    if (document.activeElement && this.overlay?.contains(document.activeElement))
      this.button?.focus();
  }
  trap(event) {
    const overlay = this.overlay;
    if (!overlay) return;
    const items = [
      ...overlay.querySelectorAll("button, a, [tabindex]")
    ].filter((el) => !el.hasAttribute("disabled"));
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
};
function defineLmGlobe() {
  applyMotionPreference();
  if (!customElements.get("lm-globe"))
    customElements.define("lm-globe", LmGlobe);
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

// src/components/shot.ts
var LmShot = class extends HTMLElement {
  connectedCallback() {
    const existing = this.querySelector("a");
    if (existing) {
      if (!existing.querySelector(".lm-shot-frame")) this.frame(existing);
      return;
    }
    const href = this.getAttribute("href");
    const src = this.getAttribute("src");
    if (!href || !src) return;
    const link = document.createElement("a");
    link.href = href;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    const img = document.createElement("img");
    img.src = src;
    img.alt = this.getAttribute("alt") ?? "";
    img.width = Number(this.getAttribute("width") ?? "600");
    img.height = Number(this.getAttribute("height") ?? "390");
    img.loading = "lazy";
    img.decoding = "async";
    const srcset = this.getAttribute("srcset");
    const sizes = this.getAttribute("sizes");
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    link.append(img);
    this.frame(link);
    const chrome = this.getAttribute("chrome") ?? "";
    const caption = this.getAttribute("caption") ?? chrome;
    const cap = document.createElement("p");
    cap.className = "lm-shot-cap";
    cap.textContent = caption;
    const hint = document.createElement("span");
    hint.className = "lm-vh";
    hint.textContent = " (opens in a new tab)";
    link.append(cap, hint);
    this.append(link);
  }
  /** Wrap a light-DOM link's image in the browser frame. No-JS pages keep the link. */
  frame(link) {
    if (link.querySelector(".lm-shot-frame")) return;
    const img = link.querySelector("img");
    if (!img) return;
    const chrome = this.getAttribute("chrome") ?? "";
    const frame = document.createElement("span");
    frame.className = "lm-shot-frame";
    const bar = document.createElement("span");
    bar.className = "lm-shot-chrome";
    const dots = document.createElement("span");
    dots.className = "lm-shot-dots";
    dots.setAttribute("aria-hidden", "true");
    dots.append(
      document.createElement("i"),
      document.createElement("i"),
      document.createElement("i")
    );
    bar.append(dots, document.createTextNode(chrome ? ` ${chrome}` : ""));
    frame.append(bar, img);
    link.prepend(frame);
  }
};
function defineLmShot() {
  applyMotionPreference();
  if (!customElements.get("lm-shot")) customElements.define("lm-shot", LmShot);
}

// src/components/index.ts
function defineLmUi() {
  defineLmCard();
  defineLmChip();
  defineLmMore();
  defineLmMotionToggle();
  defineLmPause();
  defineLmShot();
  defineLmAvatar();
  defineLmGlobe();
  defineLmFlightPlan();
  if (typeof document !== "undefined") applyMotionPreference();
}

// src/components/entries/index.ts
defineLmUi();

export { LmAvatar, LmCard, LmChip, LmFlightPlan, LmGlobe, LmMore, LmMotionToggle, LmPause, LmShot, MOTION_KEY, applyMotionPreference, bindMotionMedia, defaultRoute, defineLmAvatar, defineLmCard, defineLmChip, defineLmFlightPlan, defineLmGlobe, defineLmMore, defineLmMotionToggle, defineLmPause, defineLmShot, defineLmUi, parseRoute, readMotionPreference, writeMotionPreference };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map