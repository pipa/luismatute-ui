import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';
import { hoistInlineStyles } from './hoist-styles.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const htmlPath = process.argv[2] ?? '/tmp/source/concept-c-takeoff.html';
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
  planeSVG, planeTop, luisSVG, cloud, palm, isleAA, isleSandals, isleBSc, isleFluky,
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
    .replace(/url\(#(?!__id__)([^)]+)\)/g, 'url(#__id__$1)');
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
  plane: ['plane', wrap(api.planeSVG('__id__'), '0 0 640 260')],
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
  'island-aa': ['islandAa', wrap(api.isleAA('__id__'), '-20 -20 1000 520')],
  'island-sandals': [
    'islandSandals',
    wrap(api.isleSandals('__id__'), '-40 -80 1100 620'),
  ],
  'island-bsc': ['islandBsc', wrap(api.isleBSc('__id__'), '-40 -80 1100 620')],
  'island-fluky': [
    'islandFluky',
    wrap(api.isleFluky('__id__'), '-40 -80 1100 620'),
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
  avatar: ['avatar', wrap(api.luisSVG('__id__'), '0 0 200 240', 'class="lu"')],
  globe: ['globe', globe],
};

const svgDir = resolve(root, 'src/illustrations/svg');
const fileDir = resolve(root, 'src/illustrations/files');
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

const inlineFn = `export function inlineIllustration(name: IllustrationName, prefix: string = name): string {
  const svg = illustrations[name];
  if (!svg) throw new Error(\`Unknown illustration: \${name}\`);
  const marked = svg.replaceAll('__id__', prefix);
  if (/\\bclass="[^"]*\\blm-art\\b/.test(marked)) return marked;
  if (/<svg\\b[^>]*\\bclass="/.test(marked)) {
    return marked.replace(/<svg\\b([^>]*?)class="([^"]*)"/, '<svg$1class="$2 lm-art"');
  }
  return marked.replace('<svg', '<svg class="lm-art"');
}`;
const index = `/** Generated by scripts/gen-illustrations.mjs. Colours are token variables. */\n${imports.join('\n')}\n\nexport const illustrations = {\n${keys.join('\n')}\n} as const;\n\nexport type IllustrationName = keyof typeof illustrations;\n\nexport function illustrationNames(): IllustrationName[] {\n  return Object.keys(illustrations) as IllustrationName[];\n}\n\n/** Inline an illustration. \`prefix\` keeps clip-path ids unique when the same art is used twice. */\n${inlineFn}\n`;
writeFileSync(resolve(root, 'src/illustrations/index.ts'), index);
ensureIllustrationRules(hoistedRules);
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
