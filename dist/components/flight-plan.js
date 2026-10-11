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
  if (!customElements.get("lm-flight-plan"))
    customElements.define("lm-flight-plan", LmFlightPlan);
}

// src/components/entries/flight-plan.ts
defineLmFlightPlan();

export { LmFlightPlan, defineLmFlightPlan };
//# sourceMappingURL=flight-plan.js.map
//# sourceMappingURL=flight-plan.js.map