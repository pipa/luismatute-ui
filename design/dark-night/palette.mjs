// node palette.mjs -> contrast.json, contrast.md, palette-table.md
// Writes next to this file. Exits 1 if any required pair fails WCAG 2.2 AA.
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => {
  const c = hex(h).map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};
const cr = (a, b) => {
  const x = lum(a);
  const y = lum(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const mix = (fg, a, bg) => '#' + hex(fg).map((v, i) => Math.round(v * a + hex(bg)[i] * (1 - a)).toString(16).padStart(2, '0')).join('');

// token, first pass, v2, source in the scene, why
export const P = [
  ['--docs-bg', '#1f1840', '#1f1840', 'SKY.move[0], zenith', 'The page stays the top of the night sky. Depth is the other planes, not a lighter sky.'],
  ['--docs-cream (sidebar)', '#1b1640', '#2a3266', 'SEA.move[0], horizon', 'The rock colour was the same purple as the page. The sea horizon is bluer and a step lighter, so the rail is its own plane.'],
  ['--docs-elev (cards)', '#2c2354', '#443872', 'SKY.move[5]', 'Band 2 sat 1.17:1 off the page, so cards disappeared. Band 5 is 1.63:1, a moonlit plane.'],
  ['--docs-sunken', '#120d2c', '#120d2c', 'scene outline, --lm-night', 'Wells stay the darkest ink. On the lighter cards the inset reads at 1.83:1.'],
  ['--docs-fg', '#fff4e2', '#fff4e2', 'stars and the title', 'Unchanged. Text is the star colour.'],
  ['--docs-muted', '#b3a8dc', '#c3bbe0', 'derived: cloud #8b7cc4 mixed 48% to white', 'The 35% tint fell to 4.65:1 on the lighter cards. This clears 5:1.'],
  ['--docs-border', '#8b7cc4', '#b9acd0', 'derived: cloud mixed 40% toward star #fff4e2', 'The raw cloud was 2.81:1 on the new cards and looked muddy. The lit rim is a hard edge, 4.8:1.'],
  ['--docs-rule', '#5a4c92', '#aea0cd', 'derived: cloud mixed 30% toward the star', 'Shade-side dashes were 1.40:1 on the cards. Interior lines now clear 3:1.'],
  ['--docs-shadow', '#5a4c92', '#8b7cc4', 'moonlit cloud, light side', 'The shade offset was 2.28:1 on the page, a soft smear. The cloud itself is 4.57:1, a hard slab, the ink-edge idea.'],
  ['--docs-link', '#ffd36b', '#ffd36b', 'lighthouse lantern', 'Unchanged for real links. Group labels no longer use it.'],
  ['--docs-kicker (new)', '#ffd36b', '#b9acd0', 'lit cloud rim', 'Labels and kickers were lantern, so yellow stopped meaning “on”. They take the rim.'],
  ['--docs-accent', '#ffd36b', '#ffd36b', 'lantern', 'Pressed segment and the current-item bar. The light, used rarely.'],
  ['--docs-on-accent', '#120d2c', '#120d2c', 'lantern outline', 'Text on the solid lantern.'],
  ['--docs-focus', '#ffd36b', '#ffd36b', 'lantern', 'The ring is the light.'],
  ['--docs-hover', 'rgba(139,124,196,.24)', 'rgba(139,124,196,.12)', 'derived: cloud at 12%', '24% muddied the lighter cards and squeezed muted text. 12% still reads as hover.'],
  ['--docs-overlay', 'rgba(18,13,44,.8)', 'rgba(18,13,44,.8)', 'derived: --lm-night at 80%', 'Unchanged.'],
  ['nav current item', '#2c2354 + bar', '#443872 + lantern text + bar', 'SKY.move[5] + lantern', 'The row is the raised plane. The label is the one lantern in the nav.'],
  ['title text-shadow', '#e2492f', '#e2492f', 'lighthouse stripes, --lm-tomato', 'Tomato stays decoration on large titles only.'],
  ['--docs-code-bg', '#120d2c', '#1a1f43', 'SEA.move[3], deep', 'Code was the same purple-black as the wells. The deep sea is blue.'],
  ['--docs-code-caption', '#2a2450', '#242b5a', 'SEA.move[1]', 'The waterline above the deep, so the block has a sea step.'],
  ['--docs-code-fg', '#fff4e2', '#fff4e2', 'stars', 'Unchanged.'],
  ['--docs-code-comment', '#8b7cc4', '#9486c6', 'derived: cloud mixed 8% toward the star', 'The cloud was 4.37:1 on the deep sea. The lift clears 4.5:1.'],
  ['--docs-code-keyword', '#ffd36b', '#ffd36b', 'lantern', 'A few keywords, like lights on the water. Chrome labels are not lantern.'],
  ['--docs-code-string', '#8cc06a', '#8cc06a', '--lm-globe-land', 'The package green. Unchanged.'],
  ['--docs-code-function', '#f2a08a', '#f2a08a', '--lm-blush', 'Unchanged.'],
  ['--docs-code-number', '#fff1cf', '#fff1cf', 'moon disc and beam', 'Moon on the water, distinct from the lantern keywords.'],
  ['--docs-code-tag', '#ff6b5c', '#ff9383', 'derived from the mast beacon #ff6b5c', 'The beacon missed 4.5:1 on the lighter cards. Lifted toward the star.'],
  ['--docs-code-attr', '#d8901f', '#d8901f', '--lm-fold', 'Unchanged.'],
  ['--docs-code-property', '#bfe6ee', '#bfe6ee', '--lm-glass', 'Unchanged.'],
  ['--docs-code-punct', '#b3a8dc', '#c3bbe0', 'derived lavender, same as muted', 'Tracks muted so it holds on the sea.'],
  ['--docs-code-literal', '#e8a090', '#e8a090', '--lm-route-cool', 'Unchanged.'],
  ['--docs-code-class', '#a89bd8', '#b9aacf', 'derived from stop marker #7563bd', 'Same lift as the note label, so it clears the lighter cards and the sea.'],
  ['--docs-note', '#a89bd8', '#b9aacf', 'derived from stop marker #7563bd', '4.06:1 on the new cards. Lifted toward the star until it clears 4.5:1.'],
  ['--docs-warn', '#ff6b5c', '#ff9383', 'derived from mast beacon #ff6b5c', 'Same lift as code tags. Still the beacon, light enough for the cards.'],
  ['--docs-tip', '#8cc06a', '#8cc06a', '--lm-globe-land', 'Green stays the success and tip colour.'],
  ['copy idle', '#fff1cf / #120d2c', '#fff1cf / #120d2c', 'moon / outline', 'Unchanged. A moon chip.'],
  ['copy hover', '#ffd36b', '#ffd36b', 'lantern', 'Hover is the lantern coming on.'],
  ['copy copied', '#8cc06a', '#8cc06a', '--lm-globe-land', 'Green success. Unchanged.'],
  ['copy error', '#120d2c / #ff6b5c', '#120d2c / #ff9383', 'night / lifted beacon', 'Text tracks the lifted beacon so it matches warning.'],
  ['demo paper stage', '#fff6e4', '#3e3470', 'moon halo ring', 'A cream stage made the ticket look pasted on. The halo is the moonlight; the paper card is the light.'],
  ['top bar', 'flat #1f1840', '#18143a → #2c2354', 'ship hull to SKY.move[2]', 'A faint sky step across the bar. Stars (star colour, static) sit on the page only.'],
];

const N = {
  bg: '#1f1840',
  cream: '#2a3266',
  elev: '#443872',
  sunk: '#120d2c',
  sea: '#1a1f43',
  cap: '#242b5a',
  halo: '#3e3470',
  fg: '#fff4e2',
  muted: '#c3bbe0',
  border: '#b9acd0',
  rule: '#aea0cd',
  shadow: '#8b7cc4',
  lantern: '#ffd36b',
  deep: '#120d2c',
  moon: '#fff1cf',
  land: '#8cc06a',
  beacon: '#ff9383',
  violet: '#b9aacf',
  tomato: '#e2492f',
  comment: '#9486c6',
  kicker: '#b9acd0',
  topLight: '#2c2354',
  blush: '#f2a08a',
  fold: '#d8901f',
  glass: '#bfe6ee',
  literal: '#e8a090',
};
const hov = (bg) => mix('#8b7cc4', 0.12, bg);
const hovBg = hov(N.bg);
const hovCream = hov(N.cream);
const hovElev = hov(N.elev);
const hovSunk = hov(N.sunk);
const T = 4.5;
const U = 3;
const code = [
  ['code fg', N.fg],
  ['comment', N.comment],
  ['keyword', N.lantern],
  ['string', N.land],
  ['function', N.blush],
  ['number', N.moon],
  ['tag', N.beacon],
  ['attr', N.fold],
  ['property', N.glass],
  ['punct', N.muted],
  ['literal', N.literal],
  ['class', N.violet],
];
const pairs = [
  ['text on page', N.fg, N.bg, T],
  ['text on sidebar', N.fg, N.cream, T],
  ['text on elev', N.fg, N.elev, T],
  ['text on sunken', N.fg, N.sunk, T],
  ['text on code sea', N.fg, N.sea, T],
  ['text on code caption', N.fg, N.cap, T],
  ['text on top-bar light end', N.fg, N.topLight, T],
  ['text on hover (page)', N.fg, hovBg, T],
  ['text on hover (sidebar)', N.fg, hovCream, T],
  ['text on hover (elev)', N.fg, hovElev, T],
  ['text on hover (sunken)', N.fg, hovSunk, T],
  ['muted on page', N.muted, N.bg, T],
  ['muted on sidebar', N.muted, N.cream, T],
  ['muted on elev', N.muted, N.elev, T],
  ['muted on sunken', N.muted, N.sunk, T],
  ['muted on hover (elev)', N.muted, hovElev, T],
  ['muted on hover (page)', N.muted, hovBg, T],
  ['kicker on page', N.kicker, N.bg, T],
  ['kicker on sidebar', N.kicker, N.cream, T],
  ['kicker on elev (home card)', N.kicker, N.elev, T],
  ['link on page', N.lantern, N.bg, T],
  ['link on sidebar', N.lantern, N.cream, T],
  ['link on elev', N.lantern, N.elev, T],
  ['link on top-bar light end', N.lantern, N.topLight, T],
  ['link on hover (page)', N.lantern, hovBg, T],
  ['link on hover (elev)', N.lantern, hovElev, T],
  ['current nav label on elev', N.lantern, N.elev, T],
  ['on-accent on accent', N.deep, N.lantern, T],
  ['copy idle on moon', N.deep, N.moon, T],
  ['copy copied on green', N.deep, N.land, T],
  ['copy error on night', N.beacon, N.deep, T],
  ...code.map(([n, c]) => [`code ${n} on sea`, c, N.sea, T]),
  ['note label on elev', N.violet, N.elev, T],
  ['warning label on elev', N.beacon, N.elev, T],
  ['tip label on elev', N.land, N.elev, T],
  ['border vs page (UI)', N.border, N.bg, U],
  ['border vs elev (UI)', N.border, N.elev, U],
  ['border vs sunken (UI)', N.border, N.sunk, U],
  ['border vs sidebar (UI)', N.border, N.cream, U],
  ['border vs sea (UI)', N.border, N.sea, U],
  ['border vs halo stage (UI)', N.border, N.halo, U],
  ['border vs top-bar light end (UI)', N.border, N.topLight, U],
  ['rule vs elev (UI)', N.rule, N.elev, U],
  ['rule vs page (UI)', N.rule, N.bg, U],
  ['rule vs sunken (UI)', N.rule, N.sunk, U],
  ['shadow vs page (UI)', N.shadow, N.bg, U],
  ['shadow vs sidebar (UI)', N.shadow, N.cream, U],
  ['focus vs page (UI)', N.lantern, N.bg, U],
  ['focus vs elev (UI)', N.lantern, N.elev, U],
  ['focus vs sunken (UI)', N.lantern, N.sunk, U],
  ['focus vs sidebar (UI)', N.lantern, N.cream, U],
  ['focus vs sea (UI)', N.lantern, N.sea, U],
  ['accent fill vs elev (UI)', N.lantern, N.elev, U],
  ['tomato vs page (large)', N.tomato, N.bg, U],
  ['title shadow tomato vs page (decorative)', N.tomato, N.bg, 0],
  ['paper ticket: ink on paper', '#2b1b14', '#fff6e4', T],
  ['page vs elev (surface step)', N.bg, N.elev, 0],
  ['page vs sidebar (surface step)', N.bg, N.cream, 0],
  ['elev vs sunken (surface step)', N.elev, N.sunk, 0],
];

const starDot = mix('#fff4e2', 0.8, N.bg);
const res = pairs.map(([name, fg, bg, min]) => ({
  name,
  fg,
  bg,
  ratio: +cr(fg, bg).toFixed(2),
  min,
  pass: min ? cr(fg, bg) >= min : true,
}));
const fails = res.filter((r) => r.min && !r.pass);
const md = [
  '| Pair | FG | BG | Ratio | Needs | Result |',
  '| --- | --- | --- | --- | --- | --- |',
  ...res.map((r) => `| ${r.name} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio}:1 | ${r.min ? r.min + ':1' : 'n/a'} | ${r.min ? (r.pass ? 'pass' : '**FAIL**') : 'note'} |`),
  '',
  `Brightest star dot composited on the page is \`${starDot}\` (${cr(N.fg, starDot).toFixed(2)}:1 if a glyph sat on the dot). Dots are about 3px, static, and sparse. Text is measured on \`${N.bg}\`.`,
  '',
].join('\n');
const ptab = [
  '| Token / role | First pass | v2 | Source in the scene | Why |',
  '| --- | --- | --- | --- | --- |',
  ...P.map(([t, o, n, s, w]) => `| ${t} | \`${o}\` | \`${n}\` | ${s} | ${w} |`),
  '',
].join('\n');
await writeFile(path.join(here, 'contrast.json'), JSON.stringify({
  night: res,
  composites: { hovBg, hovCream, hovElev, hovSunk, starDot },
  fails: fails.length,
}, null, 2));
await writeFile(path.join(here, 'contrast.md'), md);
await writeFile(path.join(here, 'palette-table.md'), ptab);
const lowest = [...res].filter((r) => r.min).sort((a, b) => a.ratio - b.ratio).slice(0, 8);
console.log(res.map((r) => `${r.pass ? 'ok  ' : 'FAIL'} ${r.ratio.toFixed(2).padStart(6)}  ${r.name}`).join('\n'));
console.log('\nlowest', lowest.map((r) => `${r.ratio} ${r.name}`).join(' | '));
console.log('composites', hovBg, hovCream, hovElev, hovSunk, 'star', starDot, '\nfails:', fails.length);
process.exit(fails.length ? 1 : 0);
