import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import { hoistInlineStyles } from './hoist-styles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
let htmlPath = resolve(root, 'scripts/illustration-source.html');
let outRoot = root;
for (let i = 0; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--out') {
    outRoot = resolve(args[++i] ?? '');
    continue;
  }
  if (arg.startsWith('--out=')) {
    outRoot = resolve(arg.slice('--out='.length));
    continue;
  }
  htmlPath = resolve(arg);
}
const html = readFileSync(htmlPath, 'utf8');
const start = html.indexOf('const N = (v) => Math.round(v * 10) / 10;');
const end = html.indexOf('/* ---------- globe:');
if (start < 0 || end < 0)
  throw new Error('Could not slice the illustration source');
const chunk = html.slice(start, end);
const extras = readFileSync(
  new URL('./illustration-extras.js', import.meta.url),
  'utf8',
);
const factory = new Function(`${chunk}\n${extras}\nreturn {
  planeSVG, planeTop, luisSVG, cloud, palm, isleAirport, isleResort, isleCampus, isleStudio,
  suitcase, gear, bush, pine, flower, foam, stampSVG, windmill, C,
  controlTower, hangar, windsock, nightTower, gullMark, sunMark, raysMark, skyMark, seaMark, wavesMark, houseMark
};`);
const api = factory();

const landMatch = html.match(/land: '([^']+)'/);
if (!landMatch) throw new Error('Missing globe land path');
const land = landMatch[1];

const map = new Map(
  Object.entries({
    '#2b1b14': 'var(--lm-ink)',
    '#5b4536': 'var(--lm-ink-soft)',
    '#fff6e4': 'var(--lm-paper)',
    '#fff4e2': 'var(--lm-cream)',
    '#f3e2c0': 'var(--lm-sand)',
    '#e2492f': 'var(--lm-tomato)',
    '#a8321e': 'var(--lm-tomato-d)',
    '#f6b43c': 'var(--lm-marigold)',
    '#1f7f7a': 'var(--lm-lagoon)',
    '#ffffff': 'var(--lm-white)',
    '#fff': 'var(--lm-white)',
    '#62a64e': 'var(--lm-leaf)',
    '#f2a08a': 'var(--lm-blush)',
    '#4a3570': 'var(--lm-plum)',
    '#b9773f': 'var(--lm-wood)',
    '#8d8178': 'var(--lm-steel)',
    '#bfe6ee': 'var(--lm-glass)',
    '#fffaf0': 'var(--lm-foam)',
    '#f1dfc0': 'var(--lm-cloud-shade)',
    '#120d2c': 'var(--lm-night)',
    '#c98e62': 'var(--lm-skin)',
    '#a96f47': 'var(--lm-skin-d)',
    '#e0805f': 'var(--lm-skin-blush)',
    '#231812': 'var(--lm-skin-hair)',
    '#5a463a': 'var(--lm-skin-fade)',
    '#2a1c15': 'var(--lm-skin-beard)',
    '#3f2a20': 'var(--lm-beard-line)',
    '#e1ad84': 'var(--lm-skin-highlight)',
    '#3a2a22': 'var(--lm-lens-tint)',
    '#b0662f': 'var(--lm-skin-amber)',
    '#5a2f18': 'var(--lm-skin-tort)',
    '#7a2e22': 'var(--lm-skin-lip)',
    '#a39282': 'var(--lm-wheel)',
    '#7d6a5c': 'var(--lm-strut)',
    '#2f9a93': 'var(--lm-wing)',
    '#efdbb9': 'var(--lm-belly)',
    '#fffdf6': 'var(--lm-stripe)',
    '#ffd36b': 'var(--lm-window-lit)',
    '#5f97a6': 'var(--lm-cockpit)',
    '#e0c391': 'var(--lm-wing-under)',
    '#d9c39c': 'var(--lm-engine)',
    '#ff7a5c': 'var(--lm-beacon)',
    '#ff3b2b': 'var(--lm-beacon-hot)',
    '#eadbbf': 'var(--lm-frame)',
    '#f5e1bb': 'var(--lm-cabin)',
    '#e8cfa3': 'var(--lm-rail)',
    '#16625e': 'var(--lm-stitch)',
    '#d8901f': 'var(--lm-fold)',
    '#4b3428': 'var(--lm-hair-line)',
    '#6e5646': 'var(--lm-sideburn)',
    '#fff7ea': 'var(--lm-teeth)',
    '#d9705e': 'var(--lm-mouth)',
    '#1a100b': 'var(--lm-lip-line)',
    '#c9843c': 'var(--lm-scratch)',
    '#1a1a1a': 'var(--lm-cap)',
    '#efdcbc': 'var(--lm-shade)',
    '#dcc49c': 'var(--lm-shade-line)',
    '#d4bf99': 'var(--lm-shade-pull)',
    '#b07a4c': 'var(--lm-trunk)',
    '#7f5333': 'var(--lm-trunk-ring)',
    '#7a4b2a': 'var(--lm-coconut)',
    '#4f9a48': 'var(--lm-frond)',
    '#2f86a8': 'var(--lm-globe-ocean)',
    '#3592b3': 'var(--lm-globe-deep)',
    '#8cc06a': 'var(--lm-globe-land)',
    '#163a52': 'var(--lm-globe-shade)',
    '#e8a090': 'var(--lm-route-cool)',
  }),
);

function expand(hex) {
  const h = hex.slice(1);
  if (h.length === 3) return `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}`;
  return hex;
}

function recolor(svg) {
  let out = svg
    .replace(
      /rgba\(43,\s*27,\s*20,\s*\.?3\)|rgba\(43,27,20,\.3\)/g,
      'var(--lm-porthole)',
    )
    .replace(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})\b/g, (full) => {
      const key = full.toLowerCase();
      return map.get(key) ?? map.get(expand(key)) ?? key;
    });
  const skinVars = [
    ['--lu-skin-d', '--lm-skin-d'],
    ['--lu-skin', '--lm-skin'],
    ['--lu-blush', '--lm-skin-blush'],
    ['--lu-hair', '--lm-skin-hair'],
    ['--lu-fade', '--lm-skin-fade'],
    ['--lu-beard', '--lm-skin-beard'],
    ['--lu-amber', '--lm-skin-amber'],
    ['--lu-tort', '--lm-skin-tort'],
    ['--lu-lip', '--lm-skin-lip'],
  ];
  for (const [from, to] of skinVars)
    out = out.replaceAll(`var(${from})`, `var(${to})`);
  return out
    .replace(/\bid="(?!__id__)([^"]+)"/g, 'id="__id__$1"')
    .replace(/url\(#(?!__id__)([^)]+)\)/g, 'url(#__id__$1)')
    .replace(/\bhref="#(?!__id__)([^"]+)"/g, 'href="#__id__$1"');
}

function wrapRaw(inner, openTag) {
  return recolor(`${openTag}${inner}</svg>`);
}

function wrap(inner, viewBox, attrs = '') {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" fill="none"${attrs ? ` ${attrs}` : ''}>${inner}</svg>`;
  const colored = recolor(svg);
  try {
    const out = optimize(colored, {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              convertColors: false,
              cleanupIds: false,
              collapseGroups: false,
              mergePaths: false,
              convertShapeToPath: false,
              moveElemsAttrsToGroup: false,
              moveGroupAttrsToElems: false,
            },
          },
        },
      ],
    });
    if (colored.includes('class=') && !out.data.includes('class='))
      return colored;
    return out.data;
  } catch {
    return colored;
  }
}

const globe = wrap(
  `<defs><clipPath id="lmglobe__id__"><circle cx="500" cy="500" r="500"/></clipPath></defs><g clip-path="url(#lmglobe__id__)"><circle cx="500" cy="500" r="500" fill="var(--lm-globe-ocean)"/><circle cx="500" cy="500" r="430" fill="var(--lm-globe-deep)"/><path d="${land}" fill="var(--lm-globe-land)" stroke="var(--lm-ink)" stroke-width="3" stroke-linejoin="round"/><path d="M-20 -20H1020V1020H-20ZM-110 420A530 530 0 1 0 950 420A530 530 0 1 0 -110 420Z" fill="var(--lm-globe-shade)" fill-rule="evenodd" opacity="0.26"/><path d="M-20 -20H1020V1020H-20ZM10 540A530 530 0 1 0 1070 540A530 530 0 1 0 10 540Z" fill="var(--lm-foam)" fill-rule="evenodd" opacity="0.3"/></g><circle cx="500" cy="500" r="500" fill="none" stroke="var(--lm-ink)" stroke-width="4.5"/>`,
  '0 0 1000 1000',
);

const art = {
  plane: ['plane', highlights(wrap(api.planeSVG('__id__'), '0 0 640 260'))],
  'plane-top': ['planeTop', wrap(api.planeTop(), '0 0 120 100')],
  cloud: [
    'cloud',
    wrap(
      api.cloud(16, 90, 280, { t: 0, ow: 3.5 }),
      '-10 -40 340 150',
    ).replaceAll('var(--lm-foam)', 'var(--lm-cloud)'),
  ],
  palm: [
    'palm',
    wrap(api.palm(90, 360, 280, -40, { tw: 18 }), '-40 -40 280 430'),
  ],
  sun: ['sun', wrap(api.sunMark(), '-90 -90 180 180')],
  'sun-rays': ['sunRays', wrap(api.raysMark(), '-100 -100 200 200')],
  sky: ['sky', wrap(api.skyMark(), '0 0 1200 640')],
  sea: ['sea', wrap(api.seaMark(), '0 0 1200 420')],
  waves: ['waves', wrap(api.wavesMark(), '-40 80 1400 260')],
  gull: ['gull', wrap(api.gullMark(), '-16 -12 32 16')],
  'control-tower': [
    'controlTower',
    wrap(api.controlTower(), '-40 -270 80 280'),
  ],
  hangar: ['hangar', wrap(api.hangar(), '-4 -140 190 150')],
  windsock: ['windsock', wrap(api.windsock(), '-4 -120 70 130')],
  'night-tower': ['nightTower', wrap(api.nightTower(), '-80 -180 420 200')],
  'island-aa': [
    'islandAa',
    highlights(wrap(api.isleAirport('__id__'), '-20 -20 1000 520')),
  ],
  'island-sandals': [
    'islandSandals',
    highlights(wrap(api.isleResort('__id__'), '-40 -80 1100 620')),
  ],
  'island-bsc': [
    'islandBsc',
    wrap(api.isleCampus('__id__'), '-40 -80 1100 620'),
  ],
  'island-fluky': [
    'islandFluky',
    wrap(api.isleStudio('__id__'), '-40 -80 1100 620'),
  ],
  suitcase: [
    'suitcase',
    wrap(
      api.suitcase(10, 24, 90, 68, api.C.tomato, { tag: api.C.cream }),
      '0 0 120 110',
    ),
  ],
  gear: [
    'gear',
    wrap(api.gear(50, 50, 32, api.C.marigold, 8, 'spin'), '0 0 100 100'),
  ],
  bush: ['bush', wrap(api.bush(80, 90, 1, api.C.tomato, 1), '0 0 170 120')],
  pine: ['pine', wrap(api.pine(40, 120, 100, 'var(--lm-leaf)'), '0 0 80 130')],
  flower: ['flower', wrap(api.flower(24, 24, 16, api.C.blush), '0 0 48 48')],
  house: ['house', wrap(api.houseMark(), '0 0 220 320')],
  windmill: ['windmill', wrap(api.windmill(60, 150, 1), '0 0 140 180')],
  stamp: ['stamp', wrap(api.stampSVG(), '-120 -120 240 240')],
  foam: ['foam', wrap(api.foam(0, 640, 24), '-10 0 700 50')],
  avatar: [
    'avatar',
    fixedInk(
      glints(
        wrapRaw(
          api.luisSVG('__id__'),
          '<svg xmlns="http://www.w3.org/2000/svg" fill="none" class="lu lm-art" viewBox="0 0 200 240">',
        ),
      ),
    ),
  ],
  globe: ['globe', globe],
};

/**
 * Muse (#39): the avatar's glints, eye highlights and lens glare use
 * --lm-glint (cream in both modes). The lu-book rect uses it too, so the
 * book stays paper at night. --lm-white stays a surface colour elsewhere.
 */
function glints(svg) {
  return svg
    .replace(/<(circle|path)\b[^>]*>/g, (tag) =>
      tag.replace(/(fill|stroke)="var\(--lm-white\)"/g, '$1="var(--lm-glint)"'),
    )
    .replace(
      /(<g class="lu-book"><rect\b[^>]*?)fill="var\(--lm-white\)"/,
      '$1fill="var(--lm-glint)"',
    );
}

/**
 * Muse (#43): the avatar is a paper portrait in both modes, so its linework
 * uses --lm-ink-fixed (dark ink by day and night). --lm-ink turns cream at
 * night and the outlines vanished on the cream window frame.
 */
function fixedInk(svg) {
  return svg.replaceAll('var(--lm-ink)', 'var(--lm-ink-fixed)');
}

/**
 * Muse (#41): every --lm-white in the plane (11), island-aa (5) and
 * island-sandals (2) is a highlight, so it uses --lm-glint like the avatar.
 */
function highlights(svg) {
  return svg.replace(
    /(fill|stroke)="var\(--lm-white\)"/g,
    '$1="var(--lm-glint)"',
  );
}

const svgDir = resolve(outRoot, 'src/illustrations/svg');
const fileDir = resolve(outRoot, 'src/illustrations/files');
mkdirSync(svgDir, { recursive: true });
mkdirSync(fileDir, { recursive: true });

const imports = [];
const keys = [];
const hoistedRules = new Map();
for (const [file, entry] of Object.entries(art)) {
  const [exportName, raw] = entry;
  const hoisted = hoistInlineStyles(raw);
  for (const [cls, value] of hoisted.rules) hoistedRules.set(cls, value);
  const svg = hoisted.svg;
  entry[1] = svg;
  writeFileSync(resolve(fileDir, `${file}.svg`), svg);
  writeFileSync(
    resolve(svgDir, `${file}.ts`),
    `export const ${exportName} = ${JSON.stringify(svg)};\n`,
  );
  imports.push(`import { ${exportName} } from './svg/${file}.ts';`);
  keys.push(`  '${file}': ${exportName},`);
}

// #59: generic ids for the stop islands. The old ids stay as deprecated aliases.
const deprecatedArt = {
  'island-sandals': 'island-resort',
  'island-fluky': 'island-studio',
  'island-aa': 'island-airport',
  'island-bsc': 'island-campus',
};
// #18 svg-kit: these generic ids also ship as files, so the kit can show a plain import path.
for (const to of ['island-airport', 'island-campus']) {
  const from = Object.keys(deprecatedArt).find((k) => deprecatedArt[k] === to);
  writeFileSync(resolve(fileDir, `${to}.svg`), art[from][1]);
}
for (const [from, to] of Object.entries(deprecatedArt)) {
  const line = keys.find((k) => k.startsWith(`  '${from}': `));
  if (!line) throw new Error(`missing ${from}`);
  const exportName = line.split(': ')[1].replace(',', '');
  keys.splice(keys.indexOf(line), 0, `  '${to}': ${exportName},`);
  keys[keys.indexOf(line)] = `  /** @deprecated Use '${to}'. */\n${line}`;
}
const inlineFn = `export function inlineIllustration(
  name: IllustrationName,
  prefix: string = name,
  options: IllustrationOptions = {},
): string {
  const svg = illustrations[name];
  if (!svg) throw new Error(\`Unknown illustration: \${name}\`);
  const rawCity = (options.city?.trim() || DEFAULT_STAMP_CITY).toUpperCase();
  const label = \`\${rawCity} · ARRIVALS · \`;
  // Fill the ring once: spread short labels with spacing; long ones tighten, then shrink (#62).
  // Set on both <text> (Firefox) and <textPath> (WebKit); Chromium honours either.
  const { fontSize, letterSpacing, adjust, textLength } = fitStampLabel(label);
  const date = options.date?.trim();
  let marked = svg
    .replaceAll('__id__', prefix)
    .replaceAll('__city__', escapeXml(rawCity))
    .replace(/(<text\\b[^>]*?)font-size="22"([^>]*?)letter-spacing="3"([^>]*><textPath\\b)/g, (_m, a, b, c) => \`\${a}font-size="\${fontSize}"\${b}letter-spacing="\${letterSpacing}"\${c}\`)
    .replace(/<text(\\b[^>]*>)<textPath\\b/g, \`<text textLength="\${textLength}" lengthAdjust="\${adjust}"$1<textPath textLength="\${textLength}" lengthAdjust="\${adjust}"\`);
  marked = date
    ? marked.replaceAll('__date__', escapeXml(date))
    : marked.replace(/<text\\b[^>]*>__date__<\\/text>/g, '');
  if (/\\bclass="[^"]*\\blm-art\\b/.test(marked)) return marked;
  if (/<svg\\b[^>]*\\bclass="/.test(marked))
    return marked.replace(/<svg\\b([^>]*?)class="([^"]*)"/, '<svg$1class="$2 lm-art"');
  return marked.replace('<svg', '<svg class="lm-art"');
}`;
const optionsBlock = `export interface IllustrationOptions {
  /** Stamp label (#59), rendered uppercase as "CITY · ARRIVALS". Defaults to "Destination". */
  city?: string;
  /** Stamp year or date (#59), e.g. "2026". Without it the stamp shows no year. */
  date?: string;
}

export const DEFAULT_STAMP_CITY = 'Destination';
/** Stamp ring text length (path circumference 2π·78 ≈ 490, minus a small seam gap). */
const STAMP_RING = 486;
/** Approximate advance per uppercase glyph at 22px/800 with letter-spacing 3. */
const STAMP_EM = 18;

/** Stamp label fitting floors (#62, Muse's spec). */
export const STAMP_MIN_FONT = 9;
export const STAMP_MIN_TRACKING_EM = -0.02;
export const STAMP_MIN_SQUEEZE = 0.92;
const STAMP_FONT = 22;
/** Default tracking: letter-spacing 3px at 22px. */
const STAMP_TRACKING_EM = 3 / STAMP_FONT;
/** Approximate uppercase glyph advance in em (18px advance minus 3px tracking at 22px). */
const STAMP_GLYPH_EM = (STAMP_EM - 3) / STAMP_FONT;

export interface StampFit {
  fontSize: number;
  /** Letter-spacing in px (rounded to 0.01). */
  letterSpacing: number;
  adjust: 'spacing' | 'spacingAndGlyphs';
  textLength: number;
}

/**
 * Fit a stamp label on one line around the ring (#62). Defaults stay as they were; long labels
 * first tighten tracking in 0.01em steps (floor -0.02em), then drop the font 1px at a time
 * (floor 9px), and only then squeeze glyphs, never below 92% of their natural width.
 */
export function fitStampLabel(label: string): StampFit {
  const n = [...label].length;
  const round = (v: number) => Math.round(v * 100) / 100;
  const width = (font: number, em: number) => n * font * (STAMP_GLYPH_EM + em);
  if (n * STAMP_EM <= STAMP_RING)
    return { fontSize: STAMP_FONT, letterSpacing: 3, adjust: 'spacing', textLength: STAMP_RING };
  const steps = Math.round((STAMP_TRACKING_EM - STAMP_MIN_TRACKING_EM) * 100);
  for (let i = 1; i <= steps + 1; i++) {
    const em = Math.max(STAMP_MIN_TRACKING_EM, STAMP_TRACKING_EM - i * 0.01);
    if (width(STAMP_FONT, em) <= STAMP_RING)
      return { fontSize: STAMP_FONT, letterSpacing: round(em * STAMP_FONT), adjust: 'spacing', textLength: STAMP_RING };
  }
  const em = STAMP_MIN_TRACKING_EM;
  for (let font = STAMP_FONT - 1; font >= STAMP_MIN_FONT; font--)
    if (width(font, em) <= STAMP_RING)
      return { fontSize: font, letterSpacing: round(em * font), adjust: 'spacing', textLength: STAMP_RING };
  const natural = width(STAMP_MIN_FONT, em);
  return {
    fontSize: STAMP_MIN_FONT,
    letterSpacing: round(em * STAMP_MIN_FONT),
    adjust: 'spacingAndGlyphs',
    textLength: Math.max(STAMP_RING, Math.ceil(natural * STAMP_MIN_SQUEEZE)),
  };
}

const escapeXml = (s: string): string => s.replace(/[&<>"']/g, (c) => \`&#\${c.charCodeAt(0)};\`);
`;
const index = `/** Generated by scripts/gen-illustrations.mjs. Colours are token variables. */\n${imports.join('\n')}\n\nexport const illustrations = {\n${keys.join('\n')}\n} as const;\n\nexport type IllustrationName = keyof typeof illustrations;\n\n/** @deprecated ids (#59) and the generic id each one aliases. */\nexport const deprecatedIllustrations = ${JSON.stringify(deprecatedArt)} as const;\n\nexport function illustrationNames(): IllustrationName[] {\n  return Object.keys(illustrations) as IllustrationName[];\n}\n\n${optionsBlock}\n/** Inline an illustration. \`prefix\` keeps clip-path ids unique when the same art is used twice. */\n${inlineFn}\n`;
writeFileSync(resolve(outRoot, 'src/illustrations/index.ts'), index);
if (outRoot === root) ensureIllustrationRules(hoistedRules);
console.log(`wrote ${Object.keys(art).length} illustrations`);

function ensureIllustrationRules(rules) {
  const cssPath = resolve(root, 'src/styles/base.css');
  let css = readFileSync(cssPath, 'utf8');
  let extra = '';
  for (const [cls, value] of rules) {
    if (css.includes(`.${cls}`)) continue;
    const decls = value
      .split(';')
      .map((part) => part.trim())
      .filter(Boolean)
      .map((decl) => {
        const splitAt = decl.indexOf(':');
        return `  ${decl.slice(0, splitAt).trim()}: ${decl.slice(splitAt + 1).trim()};`;
      });
    extra += `:where(.lm-art) .${cls} {\n${decls.join('\n')}\n}\n`;
  }
  if (!extra) return;
  const marker = '/* Per-instance illustration values.';
  const at = css.indexOf(marker);
  if (at < 0) throw new Error('missing illustration values marker in base.css');
  css = `${css.slice(0, at)}${extra}${css.slice(at)}`;
  writeFileSync(cssPath, css);
}
