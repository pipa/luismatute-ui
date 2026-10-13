// src/components/sky-art.ts
var skyLayersFull = '<div class="lm-sky" aria-hidden="true"><svg class="lm-vh" aria-hidden="true" focusable="false"><defs><symbol id="lm-sky-cloud" viewBox="-10 -40 340 150"><circle cx="60.8" cy="59.2" r="37.1" class="lm-cloud-rim"/><circle cx="108.4" cy="31.2" r="51.1" class="lm-cloud-rim"/><circle cx="167.2" cy="14.4" r="62.3" class="lm-cloud-rim"/><circle cx="223.2" cy="39.6" r="45.5" class="lm-cloud-rim"/><circle cx="262.4" cy="62" r="31.5" class="lm-cloud-rim"/><rect width="264.6" height="40.6" x="23.7" y="52.9" class="lm-cloud-rim" rx="20.3"/><circle cx="60.8" cy="59.2" r="33.6" class="lm-cloud-shade"/><circle cx="108.4" cy="31.2" r="47.6" class="lm-cloud-shade"/><circle cx="167.2" cy="14.4" r="58.8" class="lm-cloud-shade"/><circle cx="223.2" cy="39.6" r="42" class="lm-cloud-shade"/><circle cx="262.4" cy="62" r="28" class="lm-cloud-shade"/><rect width="257.6" height="33.6" x="27.2" y="56.4" class="lm-cloud-shade" rx="16.8"/><circle cx="58.8" cy="54.2" r="28.2" class="lm-cloud-face"/><circle cx="105.5" cy="24.1" r="40" class="lm-cloud-face"/><circle cx="163.7" cy="5.6" r="49.4" class="lm-cloud-face"/><circle cx="220.7" cy="33.3" r="35.3" class="lm-cloud-face"/><circle cx="260.7" cy="57.8" r="23.5" class="lm-cloud-face"/></symbol></defs></svg><div class="lm-bands lm-bands--day"></div><div class="lm-bands lm-bands--night"></div><svg class="lm-stars" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false"><g class="lm-tw1"><circle cx="1156" cy="8" r="2"/><circle cx="1347" cy="139" r="1.5"/><circle cx="1121" cy="113" r="1.2"/><circle cx="203" cy="101" r="1"/><circle cx="700" cy="170" r="1.5"/><circle cx="1185" cy="59" r="1"/><circle cx="1182" cy="59" r="1"/><circle cx="1201" cy="148" r="1.2"/><circle cx="797" cy="180" r="1"/><circle cx="328" cy="104" r="1.2"/><circle cx="392" cy="30" r="1.2"/><circle cx="1154" cy="61" r="2"/><circle cx="388" cy="188" r="2"/><circle cx="267" cy="177" r="1"/></g><g class="lm-tw2"><circle cx="449" cy="140" r="1.2"/><circle cx="399" cy="50" r="1.2"/><circle cx="1135" cy="133" r="1.5"/><circle cx="20" cy="174" r="1"/><circle cx="1204" cy="100" r="1"/><circle cx="1173" cy="178" r="1"/><circle cx="1087" cy="147" r="1"/><circle cx="1259" cy="133" r="2"/><circle cx="1397" cy="98" r="2"/><circle cx="771" cy="55" r="2"/><circle cx="1136" cy="133" r="1"/><circle cx="1407" cy="60" r="1.2"/><circle cx="713" cy="208" r="2"/><circle cx="302" cy="8" r="1.2"/></g><g class="lm-tw3"><circle cx="629" cy="42" r="1.5"/><circle cx="954" cy="8" r="1.2"/><circle cx="71" cy="160" r="1.5"/><circle cx="1050" cy="47" r="1"/><circle cx="111" cy="154" r="1.5"/><circle cx="1246" cy="207" r="2"/><circle cx="508" cy="189" r="1"/><circle cx="1060" cy="129" r="1.5"/><circle cx="1260" cy="61" r="1"/><circle cx="1350" cy="183" r="2"/><circle cx="282" cy="48" r="1.2"/><circle cx="1080" cy="169" r="1"/></g></svg><div class="lm-orb lm-orb--sun"><svg viewBox="0 0 168 168" aria-hidden="true" focusable="false"><circle class="lm-sun-1" cx="84" cy="84" r="84"/><circle class="lm-sun-2" cx="84" cy="84" r="62"/><circle class="lm-sun-3" cx="84" cy="84" r="42"/></svg></div><div class="lm-orb lm-orb--moon"><svg viewBox="0 0 168 168" aria-hidden="true" focusable="false"><circle class="lm-moon-glow" cx="84" cy="84" r="84"/><circle class="lm-moon-disc" cx="84" cy="84" r="46"/><circle class="lm-moon-crater" cx="70" cy="74" r="9"/><circle class="lm-moon-crater" cx="98" cy="96" r="6"/><circle class="lm-moon-crater" cx="96" cy="66" r="4"/></svg></div><div class="lm-cl lm-cl--far"><svg viewBox="0 0 4320 46" aria-hidden="true" focusable="false"><use href="#lm-sky-cloud" x="170" y="10" width="90" height="40"/><use href="#lm-sky-cloud" x="610" y="34" width="70" height="31"/><use href="#lm-sky-cloud" x="1010" y="0" width="104" height="46"/><use href="#lm-sky-cloud" x="1610" y="10" width="90" height="40"/><use href="#lm-sky-cloud" x="2050" y="34" width="70" height="31"/><use href="#lm-sky-cloud" x="2450" y="0" width="104" height="46"/><use href="#lm-sky-cloud" x="3050" y="10" width="90" height="40"/><use href="#lm-sky-cloud" x="3490" y="34" width="70" height="31"/><use href="#lm-sky-cloud" x="3890" y="0" width="104" height="46"/></svg></div><div class="lm-cl lm-cl--mid"><svg viewBox="0 0 4320 99" aria-hidden="true" focusable="false"><use href="#lm-sky-cloud" x="330" y="6" width="140" height="62"/><use href="#lm-sky-cloud" x="880" y="40" width="112" height="49"/><use href="#lm-sky-cloud" x="1290" y="0" width="120" height="53"/><use href="#lm-sky-cloud" x="1770" y="6" width="140" height="62"/><use href="#lm-sky-cloud" x="2320" y="40" width="112" height="49"/><use href="#lm-sky-cloud" x="2730" y="0" width="120" height="53"/><use href="#lm-sky-cloud" x="3210" y="6" width="140" height="62"/><use href="#lm-sky-cloud" x="3760" y="40" width="112" height="49"/><use href="#lm-sky-cloud" x="4170" y="0" width="120" height="53"/></svg></div><div class="lm-cl lm-cl--near"><svg viewBox="0 0 4320 108" aria-hidden="true" focusable="false"><use href="#lm-sky-cloud" x="40" y="0" width="200" height="88"/><use href="#lm-sky-cloud" x="760" y="24" width="168" height="74"/><use href="#lm-sky-cloud" x="1480" y="0" width="200" height="88"/><use href="#lm-sky-cloud" x="2200" y="24" width="168" height="74"/><use href="#lm-sky-cloud" x="2920" y="0" width="200" height="88"/><use href="#lm-sky-cloud" x="3640" y="24" width="168" height="74"/></svg></div><svg class="lm-dune lm-dune--day" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 26c120-22 220-22 340 0s220 22 340 0 220-22 340 0 220 22 420 0V60H0z" vector-effect="non-scaling-stroke"/></svg><svg class="lm-dune lm-dune--night" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 26c120-22 220-22 340 0s220 22 340 0 220-22 340 0 220 22 420 0V60H0z" vector-effect="non-scaling-stroke"/></svg></div>';
var skyLayersCompact = '<div class="lm-sky" aria-hidden="true"><div class="lm-bands lm-bands--day"></div><div class="lm-bands lm-bands--night"></div><svg class="lm-stars" viewBox="0 0 1440 240" preserveAspectRatio="xMidYMin slice" aria-hidden="true" focusable="false"><g class="lm-tw1"><circle cx="1156" cy="8" r="2"/><circle cx="1347" cy="139" r="1.5"/><circle cx="1121" cy="113" r="1.2"/><circle cx="203" cy="101" r="1"/><circle cx="700" cy="170" r="1.5"/><circle cx="1185" cy="59" r="1"/><circle cx="1182" cy="59" r="1"/><circle cx="1201" cy="148" r="1.2"/><circle cx="797" cy="180" r="1"/><circle cx="328" cy="104" r="1.2"/><circle cx="392" cy="30" r="1.2"/><circle cx="1154" cy="61" r="2"/><circle cx="388" cy="188" r="2"/><circle cx="267" cy="177" r="1"/></g><g class="lm-tw2"><circle cx="449" cy="140" r="1.2"/><circle cx="399" cy="50" r="1.2"/><circle cx="1135" cy="133" r="1.5"/><circle cx="20" cy="174" r="1"/><circle cx="1204" cy="100" r="1"/><circle cx="1173" cy="178" r="1"/><circle cx="1087" cy="147" r="1"/><circle cx="1259" cy="133" r="2"/><circle cx="1397" cy="98" r="2"/><circle cx="771" cy="55" r="2"/><circle cx="1136" cy="133" r="1"/><circle cx="1407" cy="60" r="1.2"/><circle cx="713" cy="208" r="2"/><circle cx="302" cy="8" r="1.2"/></g><g class="lm-tw3"><circle cx="629" cy="42" r="1.5"/><circle cx="954" cy="8" r="1.2"/><circle cx="71" cy="160" r="1.5"/><circle cx="1050" cy="47" r="1"/><circle cx="111" cy="154" r="1.5"/><circle cx="1246" cy="207" r="2"/><circle cx="508" cy="189" r="1"/><circle cx="1060" cy="129" r="1.5"/><circle cx="1260" cy="61" r="1"/><circle cx="1350" cy="183" r="2"/><circle cx="282" cy="48" r="1.2"/><circle cx="1080" cy="169" r="1"/></g></svg><svg class="lm-dune lm-dune--day" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 26c120-22 220-22 340 0s220 22 340 0 220-22 340 0 220 22 420 0V60H0z" vector-effect="non-scaling-stroke"/></svg><svg class="lm-dune lm-dune--night" viewBox="0 0 1440 60" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 26c120-22 220-22 340 0s220 22 340 0 220-22 340 0 220 22 420 0V60H0z" vector-effect="non-scaling-stroke"/></svg></div>';
var landEdge = '<svg class="lm-land-edge" viewBox="0 0 1440 40" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="M0 40V18c160-20 300-20 460 0s300 20 520 0 300-20 460 0V40z" vector-effect="non-scaling-stroke"/></svg>';

// src/components/sky-header.ts
function skyLayersHtml(options = {}) {
  return options.compact ? skyLayersCompact : skyLayersFull;
}
function setPaused(on) {
  const root = document.documentElement;
  root.classList.toggle("paused", on);
  root.dataset.paused = on ? "true" : "false";
  root.dispatchEvent(new CustomEvent("lm-pause", { detail: { paused: on } }));
}
function syncPauseButtons(scope, on) {
  for (const btn of scope.querySelectorAll(
    "button.lm-sky-pause"
  )) {
    btn.setAttribute("aria-pressed", String(on));
    const label = btn.querySelector(".lm-pl");
    const text = on ? "Play sky" : "Pause sky";
    if (label) label.textContent = text;
    if (btn.hasAttribute("aria-label")) btn.setAttribute("aria-label", text);
  }
}
var LmSkyHeader = class extends HTMLElement {
  observer = null;
  wired = false;
  onPause = (event) => {
    const paused = event.detail?.paused;
    syncPauseButtons(this, Boolean(paused));
  };
  connectedCallback() {
    const head = this.querySelector(".lm-sky-head") ?? this;
    const compact = this.hasAttribute("compact");
    head.classList.add("lm-sky-head");
    head.classList.toggle("lm-sky-head--compact", compact);
    if ((this.getAttribute("concept") ?? "cruise") === "cruise")
      head.classList.add("lm-cruise");
    if (!head.querySelector(":scope > .lm-sky"))
      head.insertAdjacentHTML("afterbegin", skyLayersHtml({ compact }));
    if (!this.wired) {
      this.wired = true;
      this.addEventListener("click", (event) => {
        const btn = event.target?.closest?.(
          "button.lm-sky-pause"
        );
        if (btn) setPaused(btn.getAttribute("aria-pressed") !== "true");
      });
    }
    syncPauseButtons(
      this,
      document.documentElement.classList.contains("paused")
    );
    document.documentElement.addEventListener("lm-pause", this.onPause);
    if (!this.observer && "IntersectionObserver" in globalThis) {
      this.observer = new IntersectionObserver((entries) => {
        const entry = entries[entries.length - 1];
        if (entry) head.classList.toggle("lm-sky-off", !entry.isIntersecting);
      });
      this.observer.observe(head);
    }
  }
  disconnectedCallback() {
    this.observer?.disconnect();
    this.observer = null;
    document.documentElement.removeEventListener("lm-pause", this.onPause);
  }
};
function defineLmSkyHeader() {
  if (!customElements.get("lm-sky-header"))
    customElements.define("lm-sky-header", LmSkyHeader);
}

// src/components/entries/sky-header.ts
defineLmSkyHeader();

export { LmSkyHeader, defineLmSkyHeader, landEdge, skyLayersHtml };
//# sourceMappingURL=sky-header.js.map
//# sourceMappingURL=sky-header.js.map