/**
 * Single source for @luismatute/ui.
 * Every value is taken from design/travel-opus/concept-c-takeoff.html
 * at tag concept-c-v2 (the Wheels up page). Do not invent colours,
 * durations, or easings here.
 *
 * Avatar skin is option B from the likeness study: skin #c89a6b and
 * shadow #a57950 replace the page pair. The plane pilot shares them.
 * The nostril (#e1ad84) and the beach lens tint stay in the drawing.
 */
export declare const color: {
    readonly ink: '#2b1b14';
    readonly inkSoft: '#5b4536';
    readonly paper: '#fff6e4';
    readonly cream: '#fff4e2';
    readonly sand: '#f3e2c0';
    readonly tomato: '#e2492f';
    readonly tomatoD: '#a8321e';
    readonly marigold: '#f6b43c';
    readonly lagoon: '#1f7f7a';
    readonly white: '#ffffff';
    readonly leaf: '#62a64e';
    readonly blush: '#f2a08a';
    readonly plum: '#4a3570';
    readonly wood: '#b9773f';
    readonly steel: '#8d8178';
    readonly glass: '#bfe6ee';
    readonly theme: '#f6b44c';
    readonly foam: '#fffaf0';
    readonly cloudShade: '#f1dfc0';
    readonly night: '#120d2c';
    readonly stage: '#fbd682';
    readonly mat: '#e8e0d4';
    readonly wheel: '#a39282';
    readonly strut: '#7d6a5c';
    readonly wing: '#2f9a93';
    readonly belly: '#efdbb9';
    readonly stripe: '#fffdf6';
    readonly windowLit: '#ffd36b';
    readonly cockpit: '#5f97a6';
    readonly wingUnder: '#e0c391';
    readonly engine: '#d9c39c';
    readonly beacon: '#ff7a5c';
    readonly beaconHot: '#ff3b2b';
    readonly frame: '#eadbbf';
    readonly cabin: '#f5e1bb';
    readonly rail: '#e8cfa3';
    readonly stitch: '#16625e';
    readonly fold: '#d8901f';
    readonly hairLine: '#4b3428';
    readonly sideburn: '#6e5646';
    readonly teeth: '#fff7ea';
    readonly mouth: '#d9705e';
    readonly lipLine: '#1a100b';
    readonly scratch: '#c9843c';
    readonly cap: '#1a1a1a';
    readonly shade: '#efdcbc';
    readonly shadeLine: '#dcc49c';
    readonly shadePull: '#d4bf99';
    readonly trunk: '#b07a4c';
    readonly trunkRing: '#7f5333';
    readonly coconut: '#7a4b2a';
    readonly frond: '#4f9a48';
    readonly globeOcean: '#2f86a8';
    readonly globeDeep: '#3592b3';
    readonly globeLand: '#8cc06a';
    readonly globeShade: '#163a52';
    readonly routeCool: '#e8a090';
    readonly sun: '#fff3d0';
    readonly sunRing: '#fde3a6';
    readonly sunRing2: '#fdd88f';
    readonly rays: '#fff6dc';
};
export declare const skin: {
    readonly skin: '#c89a6b';
    readonly d: '#a57950';
    readonly blush: '#e0805f';
    readonly hair: '#231812';
    readonly fade: '#957a64';
    readonly beard: '#2a1c15';
    readonly amber: '#b0662f';
    readonly tort: '#5a2f18';
    readonly lip: '#7a2e22';
};
/** Eight-band skies, top to bottom, from the SKY table. */
export declare const sky: {
    readonly hero: readonly ['#f29a3a', '#f4a742', '#f6b34c', '#f8bf5a', '#f9ca6b', '#fbd580', '#fce09a', '#fdebb7'];
    readonly high: readonly ['#3f8fc4', '#4c9bcc', '#5aa7d3', '#69b3da', '#7bbfe0', '#8ecae5', '#a3d5ea', '#bae0ef'];
    readonly aa: readonly ['#4cacd5', '#59b4d9', '#67bcdd', '#76c4e1', '#86cce5', '#98d4e9', '#abdced', '#bfe4f1'];
    readonly sandals: readonly ['#ec6a58', '#ee7760', '#f08568', '#f29372', '#f4a17c', '#f6af88', '#f8bd95', '#f9cba4'];
    readonly bsc: readonly ['#1d877d', '#229087', '#289a90', '#31a39a', '#3dada3', '#4bb7ad', '#5dc1b7', '#72cbc1'];
    readonly fluky: readonly ['#d6412b', '#da4b32', '#de5539', '#e26042', '#e56b4c', '#e87857', '#eb8564', '#ee9372'];
    readonly move: readonly ['#1f1840', '#251d4a', '#2c2354', '#33295e', '#3b3068', '#443872', '#4e417c', '#594b86'];
    readonly booking: readonly ['#f19c74', '#f4a87e', '#f6b389', '#f8bf95', '#f9caa1', '#fbd4ad', '#fcdebb', '#fde8c9'];
};
/** Twelve-band climb gradient (HIGH) used above the hero sky. */
export declare const climb: readonly ['#3c8cc2', '#4797ca', '#54a3d1', '#62aed7', '#73b9dc', '#87c4df', '#a0cfdf', '#bcd9d6', '#d8dfc6', '#eedcae', '#f5c98a', '#f4b46a'];
/** Four-band seas, horizon to deep, from the SEA table. */
export declare const sea: {
    readonly aa: readonly ['#2c84ad', '#2a789f', '#276b90', '#235e80'];
    readonly sandals: readonly ['#45bfb4', '#35aba2', '#2a958f', '#227f7b'];
    readonly bsc: readonly ['#2c6f95', '#286386', '#235777', '#1e4b68'];
    readonly fluky: readonly ['#1f7470', '#1c6764', '#185a58', '#144d4c'];
    readonly move: readonly ['#2a3266', '#242b5a', '#1f254e', '#1a1f43'];
};
export declare const font: {
    readonly display: '"Bricolage Display", "Arial Narrow", system-ui, sans-serif';
    readonly text: '"Bricolage", system-ui, -apple-system, "Segoe UI", sans-serif';
    readonly mono: '"IBM Plex Mono", ui-monospace, monospace';
    readonly hand: '"Caveat", "Segoe Print", cursive';
};
export declare const fontSize: {
    readonly micro: '10.5px';
    readonly routeLabel: '11px';
    readonly kicker: '12px';
    readonly togglePort: '12.5px';
    readonly pause: '12px';
    readonly small: '13px';
    readonly chipPort: '14px';
    readonly meta: '14px';
    readonly chip: '14.5px';
    readonly globe: '14.5px';
    readonly copyPort: '15.5px';
    readonly skip: '15px';
    readonly body: '17px';
    readonly routePort: '17px';
    readonly route: '19px';
    readonly globeTitle: '20px';
    readonly close: '22px';
    readonly hand: '27px';
    readonly stage: '100px';
    readonly lead: 'clamp(18px, 1.5vw, 21px)';
    readonly title: 'clamp(22px, 1.8vw, 29px)';
    readonly titlePort: 'clamp(20px, 5.3vw, 25px)';
    readonly contactLink: 'clamp(18px, 1.7vw, 24px)';
    readonly pass: 'clamp(34px, 3vw, 46px)';
    readonly passPort: 'clamp(30px, 8.6vw, 40px)';
    readonly copy: 'clamp(15.5px, 0.4vw + 10.5px, 17.5px)';
    readonly display: 'clamp(76px, 11vw, 190px)';
};
export declare const lineHeight: {
    readonly none: '1';
    readonly display: '0.86';
    readonly pass: '0.95';
    readonly title: '1.1';
    readonly tight: '1.15';
    readonly chip: '1.25';
    readonly snug: '1.3';
    readonly caption: '1.35';
    readonly kicker: '1.4';
    readonly body: '1.5';
};
export declare const letterSpacing: {
    readonly tight: '-0.012em';
    readonly display: '-0.01em';
    readonly ui: '0.02em';
    readonly chrome: '0.06em';
    readonly label: '0.1em';
    readonly kicker: '0.12em';
};
export declare const fontWeight: {
    readonly regular: '400';
    readonly medium: '500';
    readonly semibold: '600';
    readonly bold: '700';
    readonly display: '800';
};
/** Spacing values that appear in the page, in pixels. */
export declare const space: {
    readonly 0: '0px';
    readonly 1: '1px';
    readonly 2: '2px';
    readonly 3: '3px';
    readonly 4: '4px';
    readonly 5: '5px';
    readonly 6: '6px';
    readonly 7: '7px';
    readonly 8: '8px';
    readonly 9: '9px';
    readonly 10: '10px';
    readonly 11: '11px';
    readonly 12: '12px';
    readonly 14: '14px';
    readonly 16: '16px';
    readonly 18: '18px';
    readonly 20: '20px';
    readonly 22: '22px';
    readonly 24: '24px';
    readonly 26: '26px';
    readonly 32: '32px';
};
export declare const radius: {
    readonly plan: '8px';
    readonly skip: '12px';
    readonly shot: '14px';
    readonly globe: '16px';
    readonly card: '20px';
    readonly panel: '22px';
    readonly pill: '999px';
    readonly round: '50%';
};
export declare const border: {
    readonly hair: '2px';
    readonly line: '2.5px';
    readonly thick: '3px';
};
export declare const shadow: {
    readonly card: '6px 7px 0 var(--lm-ink)';
    readonly toggle: '4px 4px 0 var(--lm-ink)';
    readonly togglePress: '2px 2px 0 var(--lm-ink)';
    readonly pause: '3px 3px 0 var(--lm-ink)';
    readonly pausePress: '1px 1px 0 var(--lm-ink)';
    readonly more: '3px 3px 0 var(--lm-ink)';
    readonly morePress: '1px 1px 0 var(--lm-ink)';
    readonly shot: '4px 4px 0 var(--lm-ink)';
    readonly contact: '4px 5px 0 var(--lm-ink)';
    readonly contactPress: '1px 2px 0 var(--lm-ink)';
    readonly panel: '8px 9px 0 var(--lm-ink)';
    readonly close: '3px 3px 0 var(--lm-ink)';
    readonly closePress: '1px 1px 0 var(--lm-ink)';
    readonly globe: '4px 4px 0 var(--lm-ink)';
    readonly globePress: '2px 2px 0 var(--lm-ink)';
    readonly text: '0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-tomato))';
    readonly nightText: '0 0 0.14em var(--lm-night), 0 0 0.32em var(--lm-night), 0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-night))';
    readonly inset: 'inset 0 -3px 0 rgba(43, 27, 20, 0.12)';
};
export declare const zIndex: {
    readonly copy: '2';
    readonly hud: '3';
    readonly copies: '5';
    readonly contact: '6';
    readonly window: '7';
    readonly globe: '42';
    readonly topbar: '45';
    readonly overlay: '48';
    readonly skip: '50';
};
export declare const easing: {
    readonly pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)';
    readonly out: 'cubic-bezier(0.16, 1, 0.3, 1)';
    readonly drop: 'cubic-bezier(0.5, 0, 0.9, 0.5)';
    readonly settle: 'cubic-bezier(0.2, 0.6, 0.4, 1)';
    readonly stamp: 'cubic-bezier(0.6, 0, 1, 0.6)';
    readonly fall: 'cubic-bezier(0.6, 0, 0.8, 0.4)';
    readonly inOut: 'ease-in-out';
    readonly standard: 'ease';
    readonly linear: 'linear';
    readonly outCss: 'ease-out';
};
/** Durations from the stylesheet, including the scene loops. */
export declare const duration: {
    readonly idle: '0.16s';
    readonly chevron: '0.2s';
    readonly letter: '0.22s';
    readonly copy: '0.28s';
    readonly note: '0.35s';
    readonly brow: '0.35s';
    readonly turbHud: '0.38s';
    readonly prop: '0.45s';
    readonly turb: '0.46s';
    readonly flap: '0.5s';
    readonly copyOn: '0.5s';
    readonly puffFade: '0.5s';
    readonly copyPop: '0.7s';
    readonly drop: '0.72s';
    readonly lit: '0.8s';
    readonly flag: '0.9s';
    readonly noteDraw: '0.9s';
    readonly shade: '1.1s';
    /** One wave gesture. Three swings, then the hand is back at rest. */
    readonly avatarWaveOnce: '1.2s';
    readonly strip: '1.3s';
    readonly beacon: '1.4s';
    readonly puff: '1.5s';
    readonly cue: '1.6s';
    readonly scan: '1.8s';
    readonly stamper: '2.4s';
    readonly shim: '2.6s';
    readonly toss: '2.6s';
    readonly twinkle: '3s';
    readonly smoke: '3.2s';
    readonly bob: '3.4s';
    /** Wave gesture, then a rest, then it repeats. */
    readonly avatarWave: '4.2s';
    readonly wave: '3.6s';
    readonly beam: '3.6s';
    readonly sway: '4.4s';
    readonly tick: '4.8s';
    readonly mag: '5s';
    readonly crab: '5.2s';
    readonly belt: '6s';
    readonly shoot: '8.4s';
    readonly spin: '12s';
    readonly drift: '16s';
    readonly rays: '140s';
    readonly globeDraw: '2.2s';
    readonly copyDelay: '0.05s';
    readonly noteDelay: '0.5s';
};
export declare const breakpoint: {
    /** max-width query in the page. */
    readonly portMax: '639px';
    /** min-width query in the page. */
    readonly sm: '640px';
    /** Layout treats the viewport as a desk from this width, and only when width/height ≥ 1.15. */
    readonly deskMin: '560px';
    readonly deskAspect: '1.15';
};
export declare const alpha: {
    readonly rule: 'rgba(43, 27, 20, 0.28)';
    readonly ruleRoute: 'rgba(43, 27, 20, 0.3)';
    readonly hover: 'rgba(246, 180, 60, 0.22)';
    readonly overlay: 'rgba(43, 27, 20, 0.55)';
    readonly inset: 'rgba(43, 27, 20, 0.12)';
    readonly paperFade: 'rgba(255, 246, 228, 0)';
    readonly porthole: 'rgba(43, 27, 20, 0.3)';
};
export declare const target: {
    readonly min: '44px';
};
/**
 * Scene themes. Keys are the SKY / scene ids from the source file.
 * `sea` is omitted when that scene has no SEA entry.
 */
export declare const themes: {
    readonly hero: {
        readonly label: 'Hero sunrise';
        readonly sky: readonly ["#f29a3a", "#f4a742", "#f6b34c", "#f8bf5a", "#f9ca6b", "#fbd580", "#fce09a", "#fdebb7"];
        readonly rays: '#fff6dc';
        readonly sun: readonly ['#fff3d0', '#fde3a6', '#fdd88f'];
        readonly title: "#2b1b14";
        readonly titleShadow: "#e2492f";
    };
    readonly high: {
        readonly label: 'High sky';
        readonly sky: readonly ["#3f8fc4", "#4c9bcc", "#5aa7d3", "#69b3da", "#7bbfe0", "#8ecae5", "#a3d5ea", "#bae0ef"];
        readonly rays: '#ffffff';
        readonly sun: readonly ['#fff8e0', '#d3eff7', '#bfe6f2'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#2a7aa3';
    };
    readonly aa: {
        readonly label: 'AA sky';
        readonly sky: readonly ["#4cacd5", "#59b4d9", "#67bcdd", "#76c4e1", "#86cce5", "#98d4e9", "#abdced", "#bfe4f1"];
        readonly sea: readonly ["#2c84ad", "#2a789f", "#276b90", "#235e80"];
        readonly rays: '#ffffff';
        readonly sun: readonly ['#fff8e0', '#d3eff7', '#bfe6f2'];
        readonly cloud: readonly ['#e6f5fa', '#cbe9f3'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#2a7aa3';
        readonly stop: '#3d9ad0';
        readonly wave: '#7fc0dc';
    };
    readonly sandals: {
        readonly label: 'Sandals coral';
        readonly sky: readonly ["#ec6a58", "#ee7760", "#f08568", "#f29372", "#f4a17c", "#f6af88", "#f8bd95", "#f9cba4"];
        readonly sea: readonly ["#45bfb4", "#35aba2", "#2a958f", "#227f7b"];
        readonly rays: '#fff1c7';
        readonly sun: readonly ['#fff1c7', '#fbc79d', '#fab88f'];
        readonly cloud: readonly ['#fbd2bd', '#f4b49c'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#c54b3d';
        readonly stop: '#ef6f5a';
        readonly wave: '#a3e3da';
    };
    readonly bsc: {
        readonly label: 'BSc teal';
        readonly sky: readonly ["#1d877d", "#229087", "#289a90", "#31a39a", "#3dada3", "#4bb7ad", "#5dc1b7", "#72cbc1"];
        readonly sea: readonly ["#2c6f95", "#286386", "#235777", "#1e4b68"];
        readonly rays: '#e9fff8';
        readonly sun: readonly ['#fff6d6', '#82d3c9', '#6dc9be'];
        readonly cloud: readonly ['#b9e6df', '#93d6cc'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#13675f';
        readonly stop: '#22a093';
        readonly wave: '#5c9bc0';
    };
    readonly fluky: {
        readonly label: 'Fluky red';
        readonly sky: readonly ["#d6412b", "#da4b32", "#de5539", "#e26042", "#e56b4c", "#e87857", "#eb8564", "#ee9372"];
        readonly sea: readonly ["#1f7470", "#1c6764", "#185a58", "#144d4c"];
        readonly rays: '#ffd9a8';
        readonly sun: readonly ['#ffe7b0', '#f4a07f', '#f0906f'];
        readonly cloud: readonly ['#f5b39b', '#e98f75'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#9e2a18';
        readonly stop: "#e2492f";
        readonly wave: '#3f9a92';
    };
    readonly move: {
        readonly label: 'Move night';
        readonly sky: readonly ["#1f1840", "#251d4a", "#2c2354", "#33295e", "#3b3068", "#443872", "#4e417c", "#594b86"];
        readonly sea: readonly ["#2a3266", "#242b5a", "#1f254e", "#1a1f43"];
        readonly rays: '#ffd36b';
        readonly sun: readonly ['#ffd36b', '#ffd36b', '#ffd36b'];
        readonly cloud: readonly ['#8b7cc4', '#5a4c92'];
        readonly title: "#fff4e2";
        readonly titleShadow: "#120d2c";
        readonly stop: '#7563bd';
        readonly wave: '#3a4278';
    };
    readonly booking: {
        readonly label: 'Booking';
        readonly sky: readonly ["#f19c74", "#f4a87e", "#f6b389", "#f8bf95", "#f9caa1", "#fbd4ad", "#fcdebb", "#fde8c9"];
        readonly rays: '#fff3d0';
        readonly sun: readonly ['#fff3d0', '#fcd2a8', '#fbc79a'];
        readonly title: "#2b1b14";
        readonly titleShadow: '#c8603f';
        readonly stop: '#f2913f';
    };
};
export type ThemeName = keyof typeof themes;
/**
 * Text/background pairs the components and base styles actually paint.
 * `large` follows WCAG large text (display titles). Normal text must clear 4.5:1.
 */
export declare const textPairs: readonly [{
    readonly name: 'ink on paper';
    readonly fg: "#2b1b14";
    readonly bg: "#fff6e4";
    readonly large: false;
}, {
    readonly name: 'ink on sand';
    readonly fg: "#2b1b14";
    readonly bg: "#f3e2c0";
    readonly large: false;
}, {
    readonly name: 'ink on marigold';
    readonly fg: "#2b1b14";
    readonly bg: "#f6b43c";
    readonly large: false;
}, {
    readonly name: 'ink on white';
    readonly fg: "#2b1b14";
    readonly bg: "#ffffff";
    readonly large: false;
}, {
    readonly name: 'ink on cream';
    readonly fg: "#2b1b14";
    readonly bg: "#fff4e2";
    readonly large: false;
}, {
    readonly name: 'ink-soft on paper';
    readonly fg: "#5b4536";
    readonly bg: "#fff6e4";
    readonly large: false;
}, {
    readonly name: 'tomato-d on paper';
    readonly fg: "#a8321e";
    readonly bg: "#fff6e4";
    readonly large: false;
}, {
    readonly name: 'cream on move sky';
    readonly fg: "#fff4e2";
    readonly bg: "#1f1840";
    readonly large: true;
}, {
    readonly name: 'cream on move sky end';
    readonly fg: "#fff4e2";
    readonly bg: "#594b86";
    readonly large: true;
}, {
    readonly name: 'ink on hero sky';
    readonly fg: "#2b1b14";
    readonly bg: "#f29a3a";
    readonly large: true;
}, {
    readonly name: 'ink on aa sky';
    readonly fg: "#2b1b14";
    readonly bg: "#4cacd5";
    readonly large: true;
}, {
    readonly name: 'ink on sandals sky';
    readonly fg: "#2b1b14";
    readonly bg: "#ec6a58";
    readonly large: true;
}, {
    readonly name: 'ink on bsc sky';
    readonly fg: "#2b1b14";
    readonly bg: "#1d877d";
    readonly large: true;
}, {
    readonly name: 'ink on fluky sky';
    readonly fg: "#2b1b14";
    readonly bg: "#d6412b";
    readonly large: true;
}, {
    readonly name: 'ink on booking sky';
    readonly fg: "#2b1b14";
    readonly bg: "#f19c74";
    readonly large: true;
}];
export declare const tokens: {
    readonly color: {
        readonly ink: '#2b1b14';
        readonly inkSoft: '#5b4536';
        readonly paper: '#fff6e4';
        readonly cream: '#fff4e2';
        readonly sand: '#f3e2c0';
        readonly tomato: '#e2492f';
        readonly tomatoD: '#a8321e';
        readonly marigold: '#f6b43c';
        readonly lagoon: '#1f7f7a';
        readonly white: '#ffffff';
        readonly leaf: '#62a64e';
        readonly blush: '#f2a08a';
        readonly plum: '#4a3570';
        readonly wood: '#b9773f';
        readonly steel: '#8d8178';
        readonly glass: '#bfe6ee';
        readonly theme: '#f6b44c';
        readonly foam: '#fffaf0';
        readonly cloudShade: '#f1dfc0';
        readonly night: '#120d2c';
        readonly stage: '#fbd682';
        readonly mat: '#e8e0d4';
        readonly wheel: '#a39282';
        readonly strut: '#7d6a5c';
        readonly wing: '#2f9a93';
        readonly belly: '#efdbb9';
        readonly stripe: '#fffdf6';
        readonly windowLit: '#ffd36b';
        readonly cockpit: '#5f97a6';
        readonly wingUnder: '#e0c391';
        readonly engine: '#d9c39c';
        readonly beacon: '#ff7a5c';
        readonly beaconHot: '#ff3b2b';
        readonly frame: '#eadbbf';
        readonly cabin: '#f5e1bb';
        readonly rail: '#e8cfa3';
        readonly stitch: '#16625e';
        readonly fold: '#d8901f';
        readonly hairLine: '#4b3428';
        readonly sideburn: '#6e5646';
        readonly teeth: '#fff7ea';
        readonly mouth: '#d9705e';
        readonly lipLine: '#1a100b';
        readonly scratch: '#c9843c';
        readonly cap: '#1a1a1a';
        readonly shade: '#efdcbc';
        readonly shadeLine: '#dcc49c';
        readonly shadePull: '#d4bf99';
        readonly trunk: '#b07a4c';
        readonly trunkRing: '#7f5333';
        readonly coconut: '#7a4b2a';
        readonly frond: '#4f9a48';
        readonly globeOcean: '#2f86a8';
        readonly globeDeep: '#3592b3';
        readonly globeLand: '#8cc06a';
        readonly globeShade: '#163a52';
        readonly routeCool: '#e8a090';
        readonly sun: '#fff3d0';
        readonly sunRing: '#fde3a6';
        readonly sunRing2: '#fdd88f';
        readonly rays: '#fff6dc';
    };
    readonly skin: {
        readonly skin: '#c89a6b';
        readonly d: '#a57950';
        readonly blush: '#e0805f';
        readonly hair: '#231812';
        readonly fade: '#957a64';
        readonly beard: '#2a1c15';
        readonly amber: '#b0662f';
        readonly tort: '#5a2f18';
        readonly lip: '#7a2e22';
    };
    readonly sky: {
        readonly hero: readonly ['#f29a3a', '#f4a742', '#f6b34c', '#f8bf5a', '#f9ca6b', '#fbd580', '#fce09a', '#fdebb7'];
        readonly high: readonly ['#3f8fc4', '#4c9bcc', '#5aa7d3', '#69b3da', '#7bbfe0', '#8ecae5', '#a3d5ea', '#bae0ef'];
        readonly aa: readonly ['#4cacd5', '#59b4d9', '#67bcdd', '#76c4e1', '#86cce5', '#98d4e9', '#abdced', '#bfe4f1'];
        readonly sandals: readonly ['#ec6a58', '#ee7760', '#f08568', '#f29372', '#f4a17c', '#f6af88', '#f8bd95', '#f9cba4'];
        readonly bsc: readonly ['#1d877d', '#229087', '#289a90', '#31a39a', '#3dada3', '#4bb7ad', '#5dc1b7', '#72cbc1'];
        readonly fluky: readonly ['#d6412b', '#da4b32', '#de5539', '#e26042', '#e56b4c', '#e87857', '#eb8564', '#ee9372'];
        readonly move: readonly ['#1f1840', '#251d4a', '#2c2354', '#33295e', '#3b3068', '#443872', '#4e417c', '#594b86'];
        readonly booking: readonly ['#f19c74', '#f4a87e', '#f6b389', '#f8bf95', '#f9caa1', '#fbd4ad', '#fcdebb', '#fde8c9'];
    };
    readonly climb: readonly ["#3c8cc2", "#4797ca", "#54a3d1", "#62aed7", "#73b9dc", "#87c4df", "#a0cfdf", "#bcd9d6", "#d8dfc6", "#eedcae", "#f5c98a", "#f4b46a"];
    readonly sea: {
        readonly aa: readonly ['#2c84ad', '#2a789f', '#276b90', '#235e80'];
        readonly sandals: readonly ['#45bfb4', '#35aba2', '#2a958f', '#227f7b'];
        readonly bsc: readonly ['#2c6f95', '#286386', '#235777', '#1e4b68'];
        readonly fluky: readonly ['#1f7470', '#1c6764', '#185a58', '#144d4c'];
        readonly move: readonly ['#2a3266', '#242b5a', '#1f254e', '#1a1f43'];
    };
    readonly font: {
        readonly display: '"Bricolage Display", "Arial Narrow", system-ui, sans-serif';
        readonly text: '"Bricolage", system-ui, -apple-system, "Segoe UI", sans-serif';
        readonly mono: '"IBM Plex Mono", ui-monospace, monospace';
        readonly hand: '"Caveat", "Segoe Print", cursive';
    };
    readonly fontSize: {
        readonly micro: '10.5px';
        readonly routeLabel: '11px';
        readonly kicker: '12px';
        readonly togglePort: '12.5px';
        readonly pause: '12px';
        readonly small: '13px';
        readonly chipPort: '14px';
        readonly meta: '14px';
        readonly chip: '14.5px';
        readonly globe: '14.5px';
        readonly copyPort: '15.5px';
        readonly skip: '15px';
        readonly body: '17px';
        readonly routePort: '17px';
        readonly route: '19px';
        readonly globeTitle: '20px';
        readonly close: '22px';
        readonly hand: '27px';
        readonly stage: '100px';
        readonly lead: 'clamp(18px, 1.5vw, 21px)';
        readonly title: 'clamp(22px, 1.8vw, 29px)';
        readonly titlePort: 'clamp(20px, 5.3vw, 25px)';
        readonly contactLink: 'clamp(18px, 1.7vw, 24px)';
        readonly pass: 'clamp(34px, 3vw, 46px)';
        readonly passPort: 'clamp(30px, 8.6vw, 40px)';
        readonly copy: 'clamp(15.5px, 0.4vw + 10.5px, 17.5px)';
        readonly display: 'clamp(76px, 11vw, 190px)';
    };
    readonly lineHeight: {
        readonly none: '1';
        readonly display: '0.86';
        readonly pass: '0.95';
        readonly title: '1.1';
        readonly tight: '1.15';
        readonly chip: '1.25';
        readonly snug: '1.3';
        readonly caption: '1.35';
        readonly kicker: '1.4';
        readonly body: '1.5';
    };
    readonly letterSpacing: {
        readonly tight: '-0.012em';
        readonly display: '-0.01em';
        readonly ui: '0.02em';
        readonly chrome: '0.06em';
        readonly label: '0.1em';
        readonly kicker: '0.12em';
    };
    readonly fontWeight: {
        readonly regular: '400';
        readonly medium: '500';
        readonly semibold: '600';
        readonly bold: '700';
        readonly display: '800';
    };
    readonly space: {
        readonly 0: '0px';
        readonly 1: '1px';
        readonly 2: '2px';
        readonly 3: '3px';
        readonly 4: '4px';
        readonly 5: '5px';
        readonly 6: '6px';
        readonly 7: '7px';
        readonly 8: '8px';
        readonly 9: '9px';
        readonly 10: '10px';
        readonly 11: '11px';
        readonly 12: '12px';
        readonly 14: '14px';
        readonly 16: '16px';
        readonly 18: '18px';
        readonly 20: '20px';
        readonly 22: '22px';
        readonly 24: '24px';
        readonly 26: '26px';
        readonly 32: '32px';
    };
    readonly radius: {
        readonly plan: '8px';
        readonly skip: '12px';
        readonly shot: '14px';
        readonly globe: '16px';
        readonly card: '20px';
        readonly panel: '22px';
        readonly pill: '999px';
        readonly round: '50%';
    };
    readonly border: {
        readonly hair: '2px';
        readonly line: '2.5px';
        readonly thick: '3px';
    };
    readonly shadow: {
        readonly card: '6px 7px 0 var(--lm-ink)';
        readonly toggle: '4px 4px 0 var(--lm-ink)';
        readonly togglePress: '2px 2px 0 var(--lm-ink)';
        readonly pause: '3px 3px 0 var(--lm-ink)';
        readonly pausePress: '1px 1px 0 var(--lm-ink)';
        readonly more: '3px 3px 0 var(--lm-ink)';
        readonly morePress: '1px 1px 0 var(--lm-ink)';
        readonly shot: '4px 4px 0 var(--lm-ink)';
        readonly contact: '4px 5px 0 var(--lm-ink)';
        readonly contactPress: '1px 2px 0 var(--lm-ink)';
        readonly panel: '8px 9px 0 var(--lm-ink)';
        readonly close: '3px 3px 0 var(--lm-ink)';
        readonly closePress: '1px 1px 0 var(--lm-ink)';
        readonly globe: '4px 4px 0 var(--lm-ink)';
        readonly globePress: '2px 2px 0 var(--lm-ink)';
        readonly text: '0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-tomato))';
        readonly nightText: '0 0 0.14em var(--lm-night), 0 0 0.32em var(--lm-night), 0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-night))';
        readonly inset: 'inset 0 -3px 0 rgba(43, 27, 20, 0.12)';
    };
    readonly zIndex: {
        readonly copy: '2';
        readonly hud: '3';
        readonly copies: '5';
        readonly contact: '6';
        readonly window: '7';
        readonly globe: '42';
        readonly topbar: '45';
        readonly overlay: '48';
        readonly skip: '50';
    };
    readonly easing: {
        readonly pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)';
        readonly out: 'cubic-bezier(0.16, 1, 0.3, 1)';
        readonly drop: 'cubic-bezier(0.5, 0, 0.9, 0.5)';
        readonly settle: 'cubic-bezier(0.2, 0.6, 0.4, 1)';
        readonly stamp: 'cubic-bezier(0.6, 0, 1, 0.6)';
        readonly fall: 'cubic-bezier(0.6, 0, 0.8, 0.4)';
        readonly inOut: 'ease-in-out';
        readonly standard: 'ease';
        readonly linear: 'linear';
        readonly outCss: 'ease-out';
    };
    readonly duration: {
        readonly idle: '0.16s';
        readonly chevron: '0.2s';
        readonly letter: '0.22s';
        readonly copy: '0.28s';
        readonly note: '0.35s';
        readonly brow: '0.35s';
        readonly turbHud: '0.38s';
        readonly prop: '0.45s';
        readonly turb: '0.46s';
        readonly flap: '0.5s';
        readonly copyOn: '0.5s';
        readonly puffFade: '0.5s';
        readonly copyPop: '0.7s';
        readonly drop: '0.72s';
        readonly lit: '0.8s';
        readonly flag: '0.9s';
        readonly noteDraw: '0.9s';
        readonly shade: '1.1s';
        /** One wave gesture. Three swings, then the hand is back at rest. */
        readonly avatarWaveOnce: '1.2s';
        readonly strip: '1.3s';
        readonly beacon: '1.4s';
        readonly puff: '1.5s';
        readonly cue: '1.6s';
        readonly scan: '1.8s';
        readonly stamper: '2.4s';
        readonly shim: '2.6s';
        readonly toss: '2.6s';
        readonly twinkle: '3s';
        readonly smoke: '3.2s';
        readonly bob: '3.4s';
        /** Wave gesture, then a rest, then it repeats. */
        readonly avatarWave: '4.2s';
        readonly wave: '3.6s';
        readonly beam: '3.6s';
        readonly sway: '4.4s';
        readonly tick: '4.8s';
        readonly mag: '5s';
        readonly crab: '5.2s';
        readonly belt: '6s';
        readonly shoot: '8.4s';
        readonly spin: '12s';
        readonly drift: '16s';
        readonly rays: '140s';
        readonly globeDraw: '2.2s';
        readonly copyDelay: '0.05s';
        readonly noteDelay: '0.5s';
    };
    readonly breakpoint: {
        /** max-width query in the page. */
        readonly portMax: '639px';
        /** min-width query in the page. */
        readonly sm: '640px';
        /** Layout treats the viewport as a desk from this width, and only when width/height ≥ 1.15. */
        readonly deskMin: '560px';
        readonly deskAspect: '1.15';
    };
    readonly alpha: {
        readonly rule: 'rgba(43, 27, 20, 0.28)';
        readonly ruleRoute: 'rgba(43, 27, 20, 0.3)';
        readonly hover: 'rgba(246, 180, 60, 0.22)';
        readonly overlay: 'rgba(43, 27, 20, 0.55)';
        readonly inset: 'rgba(43, 27, 20, 0.12)';
        readonly paperFade: 'rgba(255, 246, 228, 0)';
        readonly porthole: 'rgba(43, 27, 20, 0.3)';
    };
    readonly target: {
        readonly min: '44px';
    };
    readonly themes: {
        readonly hero: {
            readonly label: 'Hero sunrise';
            readonly sky: readonly ["#f29a3a", "#f4a742", "#f6b34c", "#f8bf5a", "#f9ca6b", "#fbd580", "#fce09a", "#fdebb7"];
            readonly rays: '#fff6dc';
            readonly sun: readonly ['#fff3d0', '#fde3a6', '#fdd88f'];
            readonly title: "#2b1b14";
            readonly titleShadow: "#e2492f";
        };
        readonly high: {
            readonly label: 'High sky';
            readonly sky: readonly ["#3f8fc4", "#4c9bcc", "#5aa7d3", "#69b3da", "#7bbfe0", "#8ecae5", "#a3d5ea", "#bae0ef"];
            readonly rays: '#ffffff';
            readonly sun: readonly ['#fff8e0', '#d3eff7', '#bfe6f2'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#2a7aa3';
        };
        readonly aa: {
            readonly label: 'AA sky';
            readonly sky: readonly ["#4cacd5", "#59b4d9", "#67bcdd", "#76c4e1", "#86cce5", "#98d4e9", "#abdced", "#bfe4f1"];
            readonly sea: readonly ["#2c84ad", "#2a789f", "#276b90", "#235e80"];
            readonly rays: '#ffffff';
            readonly sun: readonly ['#fff8e0', '#d3eff7', '#bfe6f2'];
            readonly cloud: readonly ['#e6f5fa', '#cbe9f3'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#2a7aa3';
            readonly stop: '#3d9ad0';
            readonly wave: '#7fc0dc';
        };
        readonly sandals: {
            readonly label: 'Sandals coral';
            readonly sky: readonly ["#ec6a58", "#ee7760", "#f08568", "#f29372", "#f4a17c", "#f6af88", "#f8bd95", "#f9cba4"];
            readonly sea: readonly ["#45bfb4", "#35aba2", "#2a958f", "#227f7b"];
            readonly rays: '#fff1c7';
            readonly sun: readonly ['#fff1c7', '#fbc79d', '#fab88f'];
            readonly cloud: readonly ['#fbd2bd', '#f4b49c'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#c54b3d';
            readonly stop: '#ef6f5a';
            readonly wave: '#a3e3da';
        };
        readonly bsc: {
            readonly label: 'BSc teal';
            readonly sky: readonly ["#1d877d", "#229087", "#289a90", "#31a39a", "#3dada3", "#4bb7ad", "#5dc1b7", "#72cbc1"];
            readonly sea: readonly ["#2c6f95", "#286386", "#235777", "#1e4b68"];
            readonly rays: '#e9fff8';
            readonly sun: readonly ['#fff6d6', '#82d3c9', '#6dc9be'];
            readonly cloud: readonly ['#b9e6df', '#93d6cc'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#13675f';
            readonly stop: '#22a093';
            readonly wave: '#5c9bc0';
        };
        readonly fluky: {
            readonly label: 'Fluky red';
            readonly sky: readonly ["#d6412b", "#da4b32", "#de5539", "#e26042", "#e56b4c", "#e87857", "#eb8564", "#ee9372"];
            readonly sea: readonly ["#1f7470", "#1c6764", "#185a58", "#144d4c"];
            readonly rays: '#ffd9a8';
            readonly sun: readonly ['#ffe7b0', '#f4a07f', '#f0906f'];
            readonly cloud: readonly ['#f5b39b', '#e98f75'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#9e2a18';
            readonly stop: "#e2492f";
            readonly wave: '#3f9a92';
        };
        readonly move: {
            readonly label: 'Move night';
            readonly sky: readonly ["#1f1840", "#251d4a", "#2c2354", "#33295e", "#3b3068", "#443872", "#4e417c", "#594b86"];
            readonly sea: readonly ["#2a3266", "#242b5a", "#1f254e", "#1a1f43"];
            readonly rays: '#ffd36b';
            readonly sun: readonly ['#ffd36b', '#ffd36b', '#ffd36b'];
            readonly cloud: readonly ['#8b7cc4', '#5a4c92'];
            readonly title: "#fff4e2";
            readonly titleShadow: "#120d2c";
            readonly stop: '#7563bd';
            readonly wave: '#3a4278';
        };
        readonly booking: {
            readonly label: 'Booking';
            readonly sky: readonly ["#f19c74", "#f4a87e", "#f6b389", "#f8bf95", "#f9caa1", "#fbd4ad", "#fcdebb", "#fde8c9"];
            readonly rays: '#fff3d0';
            readonly sun: readonly ['#fff3d0', '#fcd2a8', '#fbc79a'];
            readonly title: "#2b1b14";
            readonly titleShadow: '#c8603f';
            readonly stop: '#f2913f';
        };
    };
    readonly textPairs: readonly [{
        readonly name: 'ink on paper';
        readonly fg: "#2b1b14";
        readonly bg: "#fff6e4";
        readonly large: false;
    }, {
        readonly name: 'ink on sand';
        readonly fg: "#2b1b14";
        readonly bg: "#f3e2c0";
        readonly large: false;
    }, {
        readonly name: 'ink on marigold';
        readonly fg: "#2b1b14";
        readonly bg: "#f6b43c";
        readonly large: false;
    }, {
        readonly name: 'ink on white';
        readonly fg: "#2b1b14";
        readonly bg: "#ffffff";
        readonly large: false;
    }, {
        readonly name: 'ink on cream';
        readonly fg: "#2b1b14";
        readonly bg: "#fff4e2";
        readonly large: false;
    }, {
        readonly name: 'ink-soft on paper';
        readonly fg: "#5b4536";
        readonly bg: "#fff6e4";
        readonly large: false;
    }, {
        readonly name: 'tomato-d on paper';
        readonly fg: "#a8321e";
        readonly bg: "#fff6e4";
        readonly large: false;
    }, {
        readonly name: 'cream on move sky';
        readonly fg: "#fff4e2";
        readonly bg: "#1f1840";
        readonly large: true;
    }, {
        readonly name: 'cream on move sky end';
        readonly fg: "#fff4e2";
        readonly bg: "#594b86";
        readonly large: true;
    }, {
        readonly name: 'ink on hero sky';
        readonly fg: "#2b1b14";
        readonly bg: "#f29a3a";
        readonly large: true;
    }, {
        readonly name: 'ink on aa sky';
        readonly fg: "#2b1b14";
        readonly bg: "#4cacd5";
        readonly large: true;
    }, {
        readonly name: 'ink on sandals sky';
        readonly fg: "#2b1b14";
        readonly bg: "#ec6a58";
        readonly large: true;
    }, {
        readonly name: 'ink on bsc sky';
        readonly fg: "#2b1b14";
        readonly bg: "#1d877d";
        readonly large: true;
    }, {
        readonly name: 'ink on fluky sky';
        readonly fg: "#2b1b14";
        readonly bg: "#d6412b";
        readonly large: true;
    }, {
        readonly name: 'ink on booking sky';
        readonly fg: "#2b1b14";
        readonly bg: "#f19c74";
        readonly large: true;
    }];
};
export type Tokens = typeof tokens;
//# sourceMappingURL=tokens.d.ts.map