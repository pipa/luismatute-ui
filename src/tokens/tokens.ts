/**
 * Single source for @luismatute/ui.
 * Every value is taken from design/travel-opus/concept-c-takeoff.html
 * at tag concept-c-v2 (the Wheels up page). Do not invent colours,
 * durations, or easings here.
 *
 * Avatar skin is option B from the likeness study: skin #c89a6b and
 * shadow #a57950 replace the page pair. The plane pilot shares them.
 * The nostril and beach lenses are tokens too. Their defaults are the
 * signed-off paint: nostril #e1ad84 (not the earlier #e2a17a swatch),
 * beard line #3f2a20, lens tint #3a2a22 at 82%.
 */

export const color = {
  ink: '#2b1b14',
  inkSoft: '#5b4536',
  paper: '#fff6e4',
  cream: '#fff4e2',
  sand: '#f3e2c0',
  tomato: '#e2492f',
  tomatoD: '#a8321e',
  marigold: '#f6b43c',
  lagoon: '#1f7f7a',
  white: '#ffffff',
  leaf: '#62a64e',
  blush: '#f2a08a',
  plum: '#4a3570',
  wood: '#b9773f',
  steel: '#8d8178',
  glass: '#bfe6ee',
  theme: '#f6b44c',
  foam: '#fffaf0',
  cloudShade: '#f1dfc0',
  night: '#120d2c',
  stage: '#fbd682',
  mat: '#e8e0d4',
  wheel: '#a39282',
  strut: '#7d6a5c',
  wing: '#2f9a93',
  belly: '#efdbb9',
  stripe: '#fffdf6',
  windowLit: '#ffd36b',
  cockpit: '#5f97a6',
  wingUnder: '#e0c391',
  engine: '#d9c39c',
  beacon: '#ff7a5c',
  beaconHot: '#ff3b2b',
  frame: '#eadbbf',
  cabin: '#f5e1bb',
  rail: '#e8cfa3',
  stitch: '#16625e',
  fold: '#d8901f',
  hairLine: '#4b3428',
  sideburn: '#6e5646',
  teeth: '#fff7ea',
  mouth: '#d9705e',
  lipLine: '#1a100b',
  scratch: '#c9843c',
  cap: '#1a1a1a',
  shade: '#efdcbc',
  shadeLine: '#dcc49c',
  shadePull: '#d4bf99',
  trunk: '#b07a4c',
  trunkRing: '#7f5333',
  coconut: '#7a4b2a',
  frond: '#4f9a48',
  globeOcean: '#2f86a8',
  globeDeep: '#3592b3',
  globeLand: '#8cc06a',
  globeShade: '#163a52',
  routeCool: '#e8a090',
  sun: '#fff3d0',
  sunRing: '#fde3a6',
  sunRing2: '#fdd88f',
  rays: '#fff6dc',
} as const;

export const skin = {
  skin: '#c89a6b',
  d: '#a57950',
  blush: '#e0805f',
  hair: '#231812',
  fade: '#957a64',
  beard: '#2a1c15',
  /** Pilot glasses. Canonical custom property is --lm-avatar-amber. */
  amber: '#b0662f',
  tort: '#5a2f18',
  lip: '#7a2e22',
  /** Beard outline. Signed-off #3f2a20. */
  beardLine: '#3f2a20',
  /** Nostril highlight. Signed-off #e1ad84. */
  highlight: '#e1ad84',
  /** Beach lens tint. */
  lensTint: '#3a2a22',
  lensTintOpacity: '0.82',
} as const;


/** Old ids kept on `sky`, `sea` and `themes` (#59). Each is a non-enumerable getter for its new key. */
type LegacyKeys<T> = {
  /** @deprecated Use `airport`. */ readonly aa: T extends { airport: infer V } ? V : never;
  /** @deprecated Use `resort`. */ readonly sandals: T extends { resort: infer V } ? V : never;
  /** @deprecated Use `campus`. */ readonly bsc: T extends { campus: infer V } ? V : never;
  /** @deprecated Use `studio`. */ readonly fluky: T extends { studio: infer V } ? V : never;
};
type LegacyPlatform<T> = {
  /** @deprecated Use `platform`. */ readonly booking: T extends { platform: infer V } ? V : never;
};
type WithLegacy<T> = T & LegacyKeys<T> & ('platform' extends keyof T ? LegacyPlatform<T> : unknown);

function withLegacy<T extends object>(base: T): WithLegacy<T> {
  const legacy: Record<string, string> = {
    aa: 'airport',
    sandals: 'resort',
    bsc: 'campus',
    fluky: 'studio',
    booking: 'platform',
  };
  for (const [old, now] of Object.entries(legacy)) {
    if (!(now in base)) continue;
    // Non-enumerable so Object.keys/entries (CSS output, docs lists) never see duplicates.
    Object.defineProperty(base, old, {
      get: () => (base as Record<string, unknown>)[now],
      enumerable: false,
    });
  }
  return base as WithLegacy<T>;
}

/** Eight-band skies, top to bottom, from the SKY table. */
const skyBase = {
  hero: [
    '#f29a3a',
    '#f4a742',
    '#f6b34c',
    '#f8bf5a',
    '#f9ca6b',
    '#fbd580',
    '#fce09a',
    '#fdebb7',
  ],
  high: [
    '#3f8fc4',
    '#4c9bcc',
    '#5aa7d3',
    '#69b3da',
    '#7bbfe0',
    '#8ecae5',
    '#a3d5ea',
    '#bae0ef',
  ],
  airport: [
    '#4cacd5',
    '#59b4d9',
    '#67bcdd',
    '#76c4e1',
    '#86cce5',
    '#98d4e9',
    '#abdced',
    '#bfe4f1',
  ],
  resort: [
    '#ec6a58',
    '#ee7760',
    '#f08568',
    '#f29372',
    '#f4a17c',
    '#f6af88',
    '#f8bd95',
    '#f9cba4',
  ],
  campus: [
    '#1d877d',
    '#229087',
    '#289a90',
    '#31a39a',
    '#3dada3',
    '#4bb7ad',
    '#5dc1b7',
    '#72cbc1',
  ],
  studio: [
    '#d6412b',
    '#da4b32',
    '#de5539',
    '#e26042',
    '#e56b4c',
    '#e87857',
    '#eb8564',
    '#ee9372',
  ],
  move: [
    '#1f1840',
    '#251d4a',
    '#2c2354',
    '#33295e',
    '#3b3068',
    '#443872',
    '#4e417c',
    '#594b86',
  ],
  platform: [
    '#f19c74',
    '#f4a87e',
    '#f6b389',
    '#f8bf95',
    '#f9caa1',
    '#fbd4ad',
    '#fcdebb',
    '#fde8c9',
  ],
} as const;
export const sky = withLegacy(skyBase);

/** Twelve-band climb gradient (HIGH) used above the hero sky. */
export const climb = [
  '#3c8cc2',
  '#4797ca',
  '#54a3d1',
  '#62aed7',
  '#73b9dc',
  '#87c4df',
  '#a0cfdf',
  '#bcd9d6',
  '#d8dfc6',
  '#eedcae',
  '#f5c98a',
  '#f4b46a',
] as const;

/** Four-band seas, horizon to deep, from the SEA table. */
const seaBase = {
  airport: ['#2c84ad', '#2a789f', '#276b90', '#235e80'],
  resort: ['#45bfb4', '#35aba2', '#2a958f', '#227f7b'],
  campus: ['#2c6f95', '#286386', '#235777', '#1e4b68'],
  studio: ['#1f7470', '#1c6764', '#185a58', '#144d4c'],
  move: ['#2a3266', '#242b5a', '#1f254e', '#1a1f43'],
} as const;
export const sea = withLegacy(seaBase);

export const font = {
  display: '"Bricolage Display", "Arial Narrow", system-ui, sans-serif',
  text: '"Bricolage", system-ui, -apple-system, "Segoe UI", sans-serif',
  mono: '"IBM Plex Mono", ui-monospace, monospace',
  hand: '"Caveat", "Segoe Print", cursive',
} as const;

export const fontSize = {
  micro: '10.5px',
  routeLabel: '11px',
  kicker: '12px',
  togglePort: '12.5px',
  pause: '12px',
  small: '13px',
  chipPort: '14px',
  meta: '14px',
  chip: '14.5px',
  globe: '14.5px',
  copyPort: '15.5px',
  skip: '15px',
  body: '17px',
  routePort: '17px',
  route: '19px',
  globeTitle: '20px',
  close: '22px',
  hand: '27px',
  stage: '100px',
  lead: 'clamp(18px, 1.5vw, 21px)',
  title: 'clamp(22px, 1.8vw, 29px)',
  titlePort: 'clamp(20px, 5.3vw, 25px)',
  contactLink: 'clamp(18px, 1.7vw, 24px)',
  pass: 'clamp(34px, 3vw, 46px)',
  passPort: 'clamp(30px, 8.6vw, 40px)',
  copy: 'clamp(15.5px, 0.4vw + 10.5px, 17.5px)',
  display: 'clamp(76px, 11vw, 190px)',
} as const;

export const lineHeight = {
  none: '1',
  display: '0.86',
  pass: '0.95',
  title: '1.1',
  tight: '1.15',
  chip: '1.25',
  snug: '1.3',
  caption: '1.35',
  kicker: '1.4',
  body: '1.5',
} as const;

export const letterSpacing = {
  tight: '-0.012em',
  display: '-0.01em',
  ui: '0.02em',
  chrome: '0.06em',
  label: '0.1em',
  kicker: '0.12em',
} as const;

export const fontWeight = {
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  display: '800',
} as const;

/** Spacing values that appear in the page, in pixels. */
export const space = {
  0: '0px',
  1: '1px',
  2: '2px',
  3: '3px',
  4: '4px',
  5: '5px',
  6: '6px',
  7: '7px',
  8: '8px',
  9: '9px',
  10: '10px',
  11: '11px',
  12: '12px',
  14: '14px',
  16: '16px',
  18: '18px',
  20: '20px',
  22: '22px',
  24: '24px',
  26: '26px',
  32: '32px',
} as const;

export const radius = {
  plan: '8px',
  skip: '12px',
  shot: '14px',
  globe: '16px',
  card: '20px',
  panel: '22px',
  pill: '999px',
  round: '50%',
} as const;

export const border = {
  /** Muse: 1px rules, e.g. the docs demo frame. */
  hairline: '1px',
  hair: '2px',
  line: '2.5px',
  thick: '3px',
} as const;

export const shadow = {
  card: '6px 7px 0 var(--lm-ink)',
  toggle: '4px 4px 0 var(--lm-ink)',
  togglePress: '2px 2px 0 var(--lm-ink)',
  pause: '3px 3px 0 var(--lm-ink)',
  pausePress: '1px 1px 0 var(--lm-ink)',
  more: '3px 3px 0 var(--lm-ink)',
  morePress: '1px 1px 0 var(--lm-ink)',
  shot: '4px 4px 0 var(--lm-ink)',
  contact: '4px 5px 0 var(--lm-ink)',
  contactPress: '1px 2px 0 var(--lm-ink)',
  panel: '8px 9px 0 var(--lm-ink)',
  close: '3px 3px 0 var(--lm-ink)',
  closePress: '1px 1px 0 var(--lm-ink)',
  globe: '4px 4px 0 var(--lm-ink)',
  globePress: '2px 2px 0 var(--lm-ink)',
  text: '0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-tomato))',
  nightText:
    '0 0 0.14em var(--lm-night), 0 0 0.32em var(--lm-night), 0.045em 0.05em 0 var(--lm-title-shadow, var(--lm-night))',
  inset: 'inset 0 -3px 0 rgba(43, 27, 20, 0.12)',
} as const;

export const zIndex = {
  copy: '2',
  hud: '3',
  copies: '5',
  contact: '6',
  window: '7',
  globe: '42',
  topbar: '45',
  overlay: '48',
  skip: '50',
} as const;

export const easing = {
  pop: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  out: 'cubic-bezier(0.16, 1, 0.3, 1)',
  /** Porthole glare sweep (blog sky, M1 Cruise). */
  glide: 'cubic-bezier(0.45, 0, 0.2, 1)',
  /** Boarding-pass seat-line draw (luismatute.me #12). */
  seatLine: 'cubic-bezier(0.5, 0.06, 0.24, 1)',
  drop: 'cubic-bezier(0.5, 0, 0.9, 0.5)',
  settle: 'cubic-bezier(0.2, 0.6, 0.4, 1)',
  stamp: 'cubic-bezier(0.6, 0, 1, 0.6)',
  fall: 'cubic-bezier(0.6, 0, 0.8, 0.4)',
  inOut: 'ease-in-out',
  standard: 'ease',
  linear: 'linear',
  outCss: 'ease-out',
} as const;

/** Durations from the stylesheet, including the scene loops. */
export const duration = {
  idle: '0.16s',
  chevron: '0.2s',
  letter: '0.22s',
  copy: '0.28s',
  // Copy button copied-state overlay fade (opacity only), docs #30.
  copyFade: '0.28s',
  note: '0.35s',
  brow: '0.35s',
  turbHud: '0.38s',
  prop: '0.45s',
  turb: '0.46s',
  flap: '0.5s',
  copyOn: '0.5s',
  puffFade: '0.5s',
  copyPop: '0.7s',
  drop: '0.72s',
  lit: '0.8s',
  flag: '0.9s',
  noteDraw: '0.9s',
  shade: '1.1s',
  /** One wave gesture. Three swings, then the hand is back at rest. */
  avatarWaveOnce: '1.2s',
  strip: '1.3s',
  beacon: '1.4s',
  puff: '1.5s',
  cue: '1.6s',
  scan: '1.8s',
  stamper: '2.4s',
  shim: '2.6s',
  toss: '2.6s',
  twinkle: '3s',
  smoke: '3.2s',
  bob: '3.4s',
  /** Wave gesture, then a rest, then it repeats. */
  avatarWave: '4.2s',
  wave: '3.6s',
  beam: '3.6s',
  sway: '4.4s',
  tick: '4.8s',
  mag: '5s',
  crab: '5.2s',
  belt: '6s',
  shoot: '8.4s',
  spin: '12s',
  drift: '16s',
  rays: '140s',
  globeDraw: '2.2s',
  copyDelay: '0.05s',
  noteDelay: '0.5s',
} as const;

export const breakpoint = {
  /**
   * Motion-toggle long/short labels swap here (max-width: 639px / min-width: 640px).
   * Card, pass, chip, route and stage-title portrait sizes do not: those follow deskMin.
   */
  portMax: '639px',
  /** min-width query for the motion-toggle labels. */
  sm: '640px',
  /**
   * Desk type and card padding apply only when the viewport is at least this wide
   * AND width / height is at least deskAspect (1.15). Otherwise the portrait sizes apply.
   * CSS: `@media (max-width: 559.98px), (max-aspect-ratio: 23/20)` where 23/20 = 1.15.
   */
  deskMin: '560px',
  /** width / height. 23/20 in the portrait media query. */
  deskAspect: '1.15',
} as const;

export const alpha = {
  rule: 'rgba(43, 27, 20, 0.28)',
  ruleRoute: 'rgba(43, 27, 20, 0.3)',
  hover: 'rgba(246, 180, 60, 0.22)',
  overlay: 'rgba(43, 27, 20, 0.55)',
  inset: 'rgba(43, 27, 20, 0.12)',
  paperFade: 'rgba(255, 246, 228, 0)',
  porthole: 'rgba(43, 27, 20, 0.3)',
} as const;

export const target = {
  min: '44px',
} as const;

/**
 * Scene themes. Keys are the SKY / scene ids from the source file.
 * `sea` is omitted when that scene has no SEA entry.
 */
/**
 * Deprecated theme ids (#59) → their generic names. The old ids keep working
 * as `[data-theme]` selectors and as `--color-<old>-sky-*` / `-sea-*` aliases.
 * @deprecated Use the generic names (`airport`, `resort`, `campus`, `studio`,
 * `platform`); the old ids will be removed in a future major.
 */
export const themeAliases = {
  aa: 'airport',
  sandals: 'resort',
  bsc: 'campus',
  fluky: 'studio',
  booking: 'platform',
} as const;

const themesBase = {
  hero: {
    label: 'Hero sunrise',
    sky: sky.hero,
    rays: '#fff6dc',
    sun: ['#fff3d0', '#fde3a6', '#fdd88f'],
    title: color.ink,
    titleShadow: color.tomato,
  },
  high: {
    label: 'High sky',
    sky: sky.high,
    rays: '#ffffff',
    sun: ['#fff8e0', '#d3eff7', '#bfe6f2'],
    title: color.ink,
    titleShadow: '#2a7aa3',
  },
  airport: {
    label: 'Airport sky',
    sky: sky.airport,
    sea: sea.airport,
    rays: '#ffffff',
    sun: ['#fff8e0', '#d3eff7', '#bfe6f2'],
    cloud: ['#e6f5fa', '#cbe9f3'],
    title: color.ink,
    titleShadow: '#2a7aa3',
    stop: '#3d9ad0',
    wave: '#7fc0dc',
  },
  resort: {
    label: 'Resort coral',
    sky: sky.resort,
    sea: sea.resort,
    rays: '#fff1c7',
    sun: ['#fff1c7', '#fbc79d', '#fab88f'],
    cloud: ['#fbd2bd', '#f4b49c'],
    title: color.ink,
    titleShadow: '#c54b3d',
    stop: '#ef6f5a',
    wave: '#a3e3da',
  },
  campus: {
    label: 'Campus teal',
    sky: sky.campus,
    sea: sea.campus,
    rays: '#e9fff8',
    sun: ['#fff6d6', '#82d3c9', '#6dc9be'],
    cloud: ['#b9e6df', '#93d6cc'],
    title: color.ink,
    titleShadow: '#13675f',
    stop: '#22a093',
    wave: '#5c9bc0',
  },
  studio: {
    label: 'Studio red',
    sky: sky.studio,
    sea: sea.studio,
    rays: '#ffd9a8',
    sun: ['#ffe7b0', '#f4a07f', '#f0906f'],
    cloud: ['#f5b39b', '#e98f75'],
    title: color.ink,
    titleShadow: '#9e2a18',
    stop: color.tomato,
    wave: '#3f9a92',
  },
  move: {
    label: 'Move night',
    sky: sky.move,
    sea: sea.move,
    rays: '#ffd36b',
    sun: ['#ffd36b', '#ffd36b', '#ffd36b'],
    cloud: ['#8b7cc4', '#5a4c92'],
    title: color.cream,
    titleShadow: color.night,
    stop: '#7563bd',
    wave: '#3a4278',
  },
  platform: {
    label: 'Platform',
    sky: sky.platform,
    rays: '#fff3d0',
    sun: ['#fff3d0', '#fcd2a8', '#fbc79a'],
    title: color.ink,
    titleShadow: '#c8603f',
    stop: '#f2913f',
  },
} as const;

export const themes = withLegacy(themesBase);

export type ThemeName = keyof typeof themesBase;

/**
 * Text/background pairs the components and base styles actually paint.
 * `large` follows WCAG large text (display titles). Normal text must clear 4.5:1.
 */
export const textPairs = [
  { name: 'ink on paper', fg: color.ink, bg: color.paper, large: false },
  { name: 'ink on sand', fg: color.ink, bg: color.sand, large: false },
  { name: 'ink on marigold', fg: color.ink, bg: color.marigold, large: false },
  { name: 'ink on white', fg: color.ink, bg: color.white, large: false },
  { name: 'ink on cream', fg: color.ink, bg: color.cream, large: false },
  {
    name: 'ink-soft on paper',
    fg: color.inkSoft,
    bg: color.paper,
    large: false,
  },
  {
    name: 'tomato-d on paper',
    fg: color.tomatoD,
    bg: color.paper,
    large: false,
  },
  { name: 'cream on move sky', fg: color.cream, bg: sky.move[0], large: true },
  {
    name: 'cream on move sky end',
    fg: color.cream,
    bg: sky.move[7],
    large: true,
  },
  { name: 'ink on hero sky', fg: color.ink, bg: sky.hero[0], large: true },
  {
    name: 'ink on airport sky',
    fg: color.ink,
    bg: sky.airport[0],
    large: true,
  },
  {
    name: 'ink on resort sky',
    fg: color.ink,
    bg: sky.resort[0],
    large: true,
  },
  { name: 'ink on campus sky', fg: color.ink, bg: sky.campus[0], large: true },
  { name: 'ink on studio sky', fg: color.ink, bg: sky.studio[0], large: true },
  {
    name: 'ink on platform sky',
    fg: color.ink,
    bg: sky.platform[0],
    large: true,
  },
] as const;

/**
 * Motion tokens for the day/night sky, theme switch and small UI. The one
 * place these durations live: `--lm-dur-*` and `--lm-sky-*` in tokens.css.
 * From design/blog/SPEC.md § Motion (luismatute.me #55).
 */
export const motion = {
  durFast: '160ms',
  durPop: '360ms',
  durFade: '900ms',
  durTheme: '1200ms',
  /** Cloud strip speeds, per 1440px tile. */
  skyFar: '180s',
  skyMid: '110s',
  skyNear: '70s',
  /** Porthole glare cycle (one ~1.3s sweep, then rest). */
  glare: '12s',
  glareDelay: '2s',
  /** Boarding-pass seat-line draw and its start delay (luismatute.me #12). */
  seatLine: '1.45s',
  seatLineDelay: '0.15s',
  twinkle1: '3.2s',
  twinkle2: '4.4s',
  twinkle3: '5.6s',
} as const;

/** Colours that do not change between day and night. */
export const modeStable = {
  inkFixed: '#2b1b14',
  /** Muse (#39): avatar glints and eye highlights, cream in both modes. */
  glint: '#fff6e4',
  skyDay: ['#fde7b0', '#fcde98', '#fbd682', '#f9cc70'],
  skyNight: ['#120d2c', '#1b1640', '#241d52', '#2e2563'],
  moon: '#fff1cf',
  moonCrater: '#e9d9b4',
  star: '#fff6dc',
  duneDay: '#f3e2c0',
  duneNight: '#3a2c22',
  /** The paper tag behind kickers on the sky, both modes. */
  tagPaper: '#fff6e4',
  tagInk: '#a8321e',
} as const;

/** Day values that the night block overrides (same names, so components don't branch). */
export const day = {
  link: '#1f7e7a',
  shadowInk: '#2b1b14',
  skyText: '#2b1b14',
  pillBg: '#fff6e4',
  pillInk: '#2b1b14',
  pillRim: '#2b1b14',
  /** Pressed lm-motion-toggle fill: paper by day. */
  togglePressed: '#fff6e4',
} as const;

/** html[data-mode="night"]: dark sand page, indigo sky (CONTRAST.md § Night). */
export const night = {
  // Muse's final indigo night palette (#39): no brown at night.
  paper: '#120d2c',
  card: '#1f1945',
  sand: '#2b2456',
  ink: '#fff6e4',
  inkSoft: '#cfc6ea',
  tomatoD: '#ff9a7f',
  white: '#3a3270',
  link: '#6fd0c6',
  lagoon: '#6fd0c6',
  ruleRoute: 'rgba(255, 246, 228, 0.3)',
  shadowInk: '#0b0820',
  skyText: '#fff6e4',
  pillBg: '#241d52',
  pillInk: '#fff6e4',
  pillRim: '#fff6e4',
  /** Pressed lm-motion-toggle fill follows the night card (#39). */
  togglePressed: 'var(--lm-card)',
  /** Sky dune at night only (#41); day keeps #3a2c22. */
  duneNight: '#2b2456',
} as const;

/**
 * Code theme. Day is the blog's shipped theme (luismatute.me #51) on sand.
 * Night is the dark-sand theme from CONTRAST.md on #33261c; tag, attr and
 * number were not in CONTRAST.md and were picked to clear AA (see tests).
 */
export const code = {
  day: {
    bg: '#f3e2c0',
    text: '#2b1b14',
    keyword: '#a3240f',
    string: '#17665f',
    function: '#1d4f9a',
    tag: '#8a2a6b',
    attr: '#7a5200',
    number: '#4f6100',
    comment: '#6e5c4c',
    punct: '#5b4536',
  },
  night: {
    bg: '#191338',
    text: '#fff1cf',
    keyword: '#ff8f73',
    string: '#7fd3c6',
    function: '#9cc0ff',
    tag: '#f2a7d6',
    attr: '#f6c66b',
    number: '#c9dc7a',
    comment: '#b3a8dc',
    punct: '#cfc6ea',
  },
} as const;

/** Text pairs for both modes of the blog sky, cards and code (CONTRAST.md). */
export const modePairs = [
  {
    name: 'day ink on sky band 4',
    fg: modeStable.inkFixed,
    bg: modeStable.skyDay[3],
    large: false,
  },
  {
    name: 'day tag kicker',
    fg: modeStable.tagInk,
    bg: modeStable.tagPaper,
    large: false,
  },
  { name: 'night paper on page', fg: night.ink, bg: night.paper, large: false },
  {
    name: 'night ink-soft on page',
    fg: night.inkSoft,
    bg: night.paper,
    large: false,
  },
  {
    name: 'night kicker on page',
    fg: night.tomatoD,
    bg: night.paper,
    large: false,
  },
  { name: 'night link on page', fg: night.link, bg: night.paper, large: false },
  { name: 'night paper on card', fg: night.ink, bg: night.card, large: false },
  {
    name: 'night ink-soft on card',
    fg: night.inkSoft,
    bg: night.card,
    large: false,
  },
  {
    name: 'night kicker on card',
    fg: night.tomatoD,
    bg: night.card,
    large: false,
  },
  { name: 'night paper on sand', fg: night.ink, bg: night.sand, large: false },
  {
    name: 'night ink-soft on sand',
    fg: night.inkSoft,
    bg: night.sand,
    large: false,
  },
  {
    name: 'night paper on pill',
    fg: night.pillInk,
    bg: night.pillBg,
    large: false,
  },
  {
    name: 'night paper on sky band 4',
    fg: night.skyText,
    bg: modeStable.skyNight[3],
    large: false,
  },
  {
    name: 'ink-fixed on marigold',
    fg: modeStable.inkFixed,
    bg: '#f6b43c',
    large: false,
  },
  ...Object.entries(code.day)
    .filter(([k]) => k !== 'bg')
    .map(([k, fg]) => ({
      name: `day code ${k}`,
      fg,
      bg: code.day.bg,
      large: false,
    })),
  ...Object.entries(code.night)
    .filter(([k]) => k !== 'bg')
    .map(([k, fg]) => ({
      name: `night code ${k}`,
      fg,
      bg: code.night.bg,
      large: false,
    })),
] as const;

export const tokens = {
  themeAliases,
  color,
  skin,
  sky,
  climb,
  sea,
  font,
  fontSize,
  lineHeight,
  letterSpacing,
  fontWeight,
  space,
  radius,
  border,
  shadow,
  zIndex,
  easing,
  duration,
  breakpoint,
  alpha,
  target,
  themes,
  textPairs,
  motion,
  modeStable,
  day,
  night,
  code,
  modePairs,
} as const;

export type Tokens = typeof tokens;
