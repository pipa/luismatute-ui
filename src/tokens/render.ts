import { tokens } from './tokens.ts';

const header = `/* Generated from src/tokens/tokens.ts — do not edit. */\n`;

function decl(name: string, value: string): string {
  return `  --lm-${name}: ${value};\n`;
}

function kebab(key: string): string {
  return key.replace(/[A-Z0-9]+/g, (m) => `-${m.toLowerCase()}`);
}

/** Night overrides: same names as day, so components don't branch. */
export function renderNightCss(): string {
  const lines = ['color-scheme: dark;'];
  for (const [key, value] of Object.entries(tokens.night))
    lines.push(`--lm-${kebab(key)}: ${value};`);
  for (const [key, value] of Object.entries(tokens.code.night))
    lines.push(`--lm-code-${key}: ${value};`);
  return themeBlock('html[data-mode="night"]', lines);
}

function themeBlock(selector: string, lines: string[]): string {
  return `${selector} {\n${lines.map((line) => `  ${line}\n`).join('')}}\n`;
}

function skyDecls(bands: readonly string[]): string[] {
  return bands.map((hex, i) => `--lm-sky-${i + 1}: ${hex};`);
}

function seaDecls(bands: readonly string[]): string[] {
  return bands.map((hex, i) => `--lm-sea-${i + 1}: ${hex};`);
}

export function renderTokensCss(): string {
  const {
    color,
    skin,
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
    climb,
  } = tokens;
  let css = header;
  css += ':root {\n';
  css += '  color-scheme: light;\n';
  css += decl('ink', color.ink);
  css += decl('ink-soft', color.inkSoft);
  css += decl('paper', color.paper);
  css += decl('card', 'var(--lm-paper)');
  css += decl('cream', color.cream);
  css += decl('sand', color.sand);
  css += decl('tomato', color.tomato);
  css += decl('tomato-d', color.tomatoD);
  css += decl('marigold', color.marigold);
  css += decl('lagoon', color.lagoon);
  css += decl('white', color.white);
  css += decl('accent', 'var(--lm-tomato)');
  css += decl('accent-ink', 'var(--lm-tomato-d)');
  css += decl('highlight', 'var(--lm-marigold)');
  css += decl('focus', 'var(--lm-ink)');
  css += decl('leaf', color.leaf);
  css += decl('blush', color.blush);
  css += decl('plum', color.plum);
  css += decl('wood', color.wood);
  css += decl('steel', color.steel);
  css += decl('glass', color.glass);
  css += decl('theme', color.theme);
  css += decl('foam', color.foam);
  css += decl('cloud', 'var(--lm-foam)');
  css += decl('cloud-light', color.foam);
  css += decl('cloud-shade', color.cloudShade);
  css += decl('night', color.night);
  css += decl('stage', color.stage);
  css += decl('mat', color.mat);
  css += decl('wheel', color.wheel);
  css += decl('strut', color.strut);
  css += decl('wing', color.wing);
  css += decl('belly', color.belly);
  css += decl('stripe', color.stripe);
  css += decl('window-lit', color.windowLit);
  css += decl('cockpit', color.cockpit);
  css += decl('wing-under', color.wingUnder);
  css += decl('engine', color.engine);
  css += decl('beacon', color.beacon);
  css += decl('beacon-hot', color.beaconHot);
  css += decl('frame', color.frame);
  css += decl('cabin', color.cabin);
  css += decl('rail', color.rail);
  css += decl('stitch', color.stitch);
  css += decl('fold', color.fold);
  css += decl('hair-line', color.hairLine);
  css += decl('sideburn', color.sideburn);
  css += decl('teeth', color.teeth);
  css += decl('mouth', color.mouth);
  css += decl('lip-line', color.lipLine);
  css += decl('scratch', color.scratch);
  css += decl('cap', color.cap);
  css += decl('shade', color.shade);
  css += decl('shade-line', color.shadeLine);
  css += decl('shade-pull', color.shadePull);
  css += decl('trunk', color.trunk);
  css += decl('trunk-ring', color.trunkRing);
  css += decl('coconut', color.coconut);
  css += decl('frond', color.frond);
  css += decl('globe-ocean', color.globeOcean);
  css += decl('globe-deep', color.globeDeep);
  css += decl('globe-land', color.globeLand);
  css += decl('globe-shade', color.globeShade);
  css += decl('route-cool', color.routeCool);
  css += decl('sun', color.sun);
  css += decl('sun-2', color.sunRing);
  css += decl('sun-3', color.sunRing2);
  css += decl('rays', color.rays);
  css += decl('title', color.ink);
  css += decl('title-shadow', color.tomato);
  css += decl('skin', skin.skin);
  css += decl('skin-d', skin.d);
  css += decl('skin-blush', skin.blush);
  css += decl('skin-hair', skin.hair);
  css += decl('skin-fade', skin.fade);
  css += decl('skin-beard', skin.beard);
  css += decl('avatar-amber', skin.amber);
  css += decl('skin-amber', 'var(--lm-avatar-amber)');
  css += decl('skin-tort', skin.tort);
  css += decl('skin-lip', skin.lip);
  css += decl('beard-line', skin.beardLine);
  css += decl('skin-highlight', skin.highlight);
  css += decl('lens-tint', skin.lensTint);
  css += decl('lens-tint-opacity', skin.lensTintOpacity);
  css += decl('rule', alpha.rule);
  css += decl('rule-route', alpha.ruleRoute);
  css += decl('hover', alpha.hover);
  css += decl('overlay', alpha.overlay);
  css += decl('paper-fade', alpha.paperFade);
  css += decl('porthole', alpha.porthole);
  css += decl('font-display', font.display);
  css += decl('font-text', font.text);
  css += decl('font-mono', font.mono);
  css += decl('font-hand', font.hand);
  for (const [key, value] of Object.entries(fontSize))
    css += decl(
      `font-size-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    );
  for (const [key, value] of Object.entries(lineHeight))
    css += decl(`leading-${key}`, value);
  for (const [key, value] of Object.entries(letterSpacing))
    css += decl(`tracking-${key}`, value);
  for (const [key, value] of Object.entries(fontWeight))
    css += decl(`weight-${key}`, value);
  for (const [key, value] of Object.entries(space))
    css += decl(`space-${key}`, value);
  for (const [key, value] of Object.entries(radius))
    css += decl(`radius-${key}`, value);
  for (const [key, value] of Object.entries(border))
    css += decl(`border-${key}`, value);
  for (const [key, value] of Object.entries(shadow))
    css += decl(
      `shadow-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    );
  for (const [key, value] of Object.entries(zIndex))
    css += decl(`z-${key}`, value);
  for (const [key, value] of Object.entries(easing))
    css += decl(
      `ease-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    );
  for (const [key, value] of Object.entries(duration))
    css += decl(
      `duration-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    );
  for (const [key, value] of Object.entries(breakpoint))
    css += decl(
      `breakpoint-${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`,
      value,
    );
  css += decl('target', target.min);
  css += skyDecls(themes.hero.sky)
    .map((line) => `  ${line}\n`)
    .join('');
  css += seaDecls(tokens.sea.aa)
    .map((line) => `  ${line}\n`)
    .join('');
  climb.forEach((hex, i) => {
    css += decl(`climb-${i + 1}`, hex);
  });
  css += decl('ink-fixed', tokens.modeStable.inkFixed);
  css += decl('glint', tokens.modeStable.glint);
  css += decl('moon', tokens.modeStable.moon);
  css += decl('moon-crater', tokens.modeStable.moonCrater);
  css += decl('star', tokens.modeStable.star);
  css += decl('dune-day', tokens.modeStable.duneDay);
  css += decl('dune-night', tokens.modeStable.duneNight);
  css += decl('tag-paper', tokens.modeStable.tagPaper);
  css += decl('tag-ink', tokens.modeStable.tagInk);
  tokens.modeStable.skyDay.forEach((hex, i) => {
    css += decl(`sky-day-${i + 1}`, hex);
  });
  tokens.modeStable.skyNight.forEach((hex, i) => {
    css += decl(`sky-night-${i + 1}`, hex);
  });
  for (const [key, value] of Object.entries(tokens.day))
    css += decl(kebab(key), value);
  for (const [key, value] of Object.entries(tokens.code.day))
    css += decl(`code-${key}`, value);
  for (const [key, value] of Object.entries(tokens.motion))
    css += decl(
      key.startsWith('sky') || key.startsWith('dur')
        ? kebab(key)
        : `dur-${kebab(key)}`,
      value,
    );
  css += '}\n\n';
  css += renderNightCss();

  for (const [name, theme] of Object.entries(themes)) {
    const lines = [
      ...skyDecls(theme.sky),
      `--lm-rays: ${theme.rays};`,
      `--lm-sun: ${theme.sun[0]};`,
      `--lm-sun-2: ${theme.sun[1]};`,
      `--lm-sun-3: ${theme.sun[2]};`,
      `--lm-title: ${theme.title};`,
      `--lm-title-shadow: ${theme.titleShadow};`,
    ];
    if ('sea' in theme && theme.sea) lines.push(...seaDecls(theme.sea));
    if ('stop' in theme && theme.stop) lines.push(`--lm-stop: ${theme.stop};`);
    if ('wave' in theme && theme.wave) lines.push(`--lm-wave: ${theme.wave};`);
    if ('cloud' in theme && theme.cloud)
      lines.push(
        `--lm-cloud: ${theme.cloud[0]};`,
        `--lm-cloud-shade: ${theme.cloud[1]};`,
      );
    css += themeBlock(`[data-theme="${name}"]`, lines);
  }
  return css;
}

export function renderThemeCss(): string {
  const {
    color,
    skin,
    font,
    fontSize,
    radius,
    easing,
    breakpoint,
    themes,
    sea,
    climb,
  } = tokens;
  const lines: string[] = [header.trim(), '@theme {'];
  const add = (name: string, value: string) =>
    lines.push(`  ${name}: ${value};`);
  add('--color-ink', color.ink);
  add('--color-ink-soft', color.inkSoft);
  add('--color-paper', color.paper);
  add('--color-card', color.paper);
  add('--color-cream', color.cream);
  add('--color-sand', color.sand);
  add('--color-tomato', color.tomato);
  add('--color-tomato-d', color.tomatoD);
  add('--color-marigold', color.marigold);
  add('--color-lagoon', color.lagoon);
  add('--color-accent', color.tomato);
  add('--color-accent-ink', color.tomatoD);
  add('--color-highlight', color.marigold);
  add('--color-focus', color.ink);
  add('--color-leaf', color.leaf);
  add('--color-blush', color.blush);
  add('--color-plum', color.plum);
  add('--color-wood', color.wood);
  add('--color-steel', color.steel);
  add('--color-glass', color.glass);
  add('--color-white', color.white);
  add('--color-foam', color.foam);
  add('--color-night', color.night);
  add('--color-skin', skin.skin);
  add('--color-skin-beard', skin.beard);
  add('--font-display', font.display);
  add('--font-text', font.text);
  add('--font-mono', font.mono);
  add('--font-hand', font.hand);
  add('--text-body', fontSize.body);
  add('--text-kicker', fontSize.kicker);
  add('--text-title', fontSize.title);
  add('--text-pass', fontSize.pass);
  add('--text-display', fontSize.display);
  add('--radius-card', radius.card);
  add('--radius-shot', radius.shot);
  add('--radius-pill', radius.pill);
  add('--shadow-card', `6px 7px 0 ${color.ink}`);
  add('--ease-pop', easing.pop);
  add('--ease-out-soft', easing.out);
  add('--breakpoint-sm', breakpoint.sm);
  add('--breakpoint-desk', breakpoint.deskMin);
  for (const [name, theme] of Object.entries(themes)) {
    theme.sky.forEach((hex, i) => {
      add(`--color-${name}-sky-${i + 1}`, hex);
    });
  }
  for (const [name, bands] of Object.entries(sea)) {
    bands.forEach((hex, i) => {
      add(`--color-${name}-sea-${i + 1}`, hex);
    });
  }
  climb.forEach((hex, i) => {
    add(`--color-climb-${i + 1}`, hex);
  });
  lines.push('}');
  lines.push('');
  return lines.join('\n');
}

export function renderTokensJson(): string {
  return `${JSON.stringify(tokens, null, 2)}\n`;
}
