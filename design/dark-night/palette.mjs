// node palette.mjs -> contrast.json, contrast.md, swatches.html
import { writeFile } from 'node:fs/promises';
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const c = hex(h).map((v) => v / 255).map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4)); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
const cr = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const mix = (fg, a, bg) => '#' + hex(fg).map((v, i) => Math.round(v * a + hex(bg)[i] * (1 - a)).toString(16).padStart(2, '0')).join('');

// token, old (current dark), new (night), source
export const P = [
  ['--docs-bg', '#2b1b14', '#1f1840', 'SKY.move[0], top band of the night sky'],
  ['--docs-cream (sidebar, inline TOC)', '#120d2c', '#1b1640', 'lighthouse rock and cloud outlines'],
  ['--docs-elev (cards, inputs, chips)', '#120d2c', '#2c2354', 'SKY.move[2]'],
  ['--docs-sunken (badge, table head, demo chrome)', '#4b3428', '#120d2c', '--lm-night, the scene outline colour'],
  ['--docs-fg (text)', '#fff6e4', '#fff4e2', 'stars and the "The move." title (= --lm-cream)'],
  ['--docs-muted', '#a39282', '#b3a8dc', 'derived: moonlit cloud #8b7cc4 mixed 35% to white'],
  ['--docs-border', '#fff6e4', '#8b7cc4', 'moonlit cloud, light side'],
  ['--docs-rule (hairlines, dashed rails)', '#f3e2c0', '#5a4c92', 'moonlit cloud, shade side'],
  ['--docs-shadow (hard offset shadow)', '#fff6e4', '#5a4c92', 'moonlit cloud, shade side'],
  ['--docs-link, group labels, kicker', '#f6b43c', '#ffd36b', 'lighthouse lantern and the lit windows'],
  ['--docs-accent (pressed, current mark)', '#f6b43c', '#ffd36b', 'lighthouse lantern'],
  ['--docs-on-accent (new: text on accent)', '#2b1b14', '#120d2c', 'lantern outline (#120d2c on #ffd36b)'],
  ['--docs-focus (3px ring)', '#fff6e4', '#ffd36b', 'lighthouse lantern'],
  ['--docs-hover (wash)', 'rgba(246,180,60,.22)', 'rgba(139,124,196,.24)', 'derived: moonlit cloud at 24%'],
  ['--docs-overlay', '#120d2c', 'rgba(18,13,44,.8)', 'derived: --lm-night at 80%'],
  ['nav current item', 'marigold 22% wash', '#2c2354 + lantern bar', 'SKY.move[2] + lantern'],
  ['title text-shadow', '#120d2c', '#e2492f', 'lighthouse stripes (= --lm-tomato)'],
  ['--docs-code-bg', '#120d2c', '#120d2c', '--lm-night (unchanged)'],
  ['--docs-code-caption (new)', '#4b3428', '#2a2450', 'lighthouse gallery rail'],
  ['--docs-code-fg', '#fff6e4', '#fff4e2', 'stars'],
  ['--docs-code-comment', '#a39282', '#8b7cc4', 'moonlit cloud'],
  ['--docs-code-keyword', '#f6b43c', '#ffd36b', 'lantern'],
  ['--docs-code-string', '#62a64e', '#8cc06a', '--lm-globe-land (package green)'],
  ['--docs-code-function', '#f2a08a', '#f2a08a', '--lm-blush (unchanged)'],
  ['--docs-code-number', '#fbd682', '#fff1cf', 'moon disc and beam'],
  ['--docs-code-tag', '#ff7a5c', '#ff6b5c', 'ship mast beacon'],
  ['--docs-code-attr', '#d8901f', '#d8901f', '--lm-fold (unchanged)'],
  ['--docs-code-property', '#5f97a6', '#bfe6ee', '--lm-glass'],
  ['--docs-code-punct', '#f3e2c0', '#b3a8dc', 'derived lavender (= muted)'],
  ['--docs-code-literal', '#e8a090', '#e8a090', '--lm-route-cool (unchanged)'],
  ['--docs-code-class', '#8cc06a', '#a89bd8', 'derived: stop-5 marker #7563bd mixed 35% to white'],
  ['--docs-note', '#bfe6ee', '#a89bd8', 'derived violet (stop-5 marker)'],
  ['--docs-warn', '#ff7a5c', '#ff6b5c', 'ship mast beacon'],
  ['--docs-tip', '#62a64e', '#8cc06a', '--lm-globe-land'],
  ['copy button idle fill / text', '#fff6e4 / #2b1b14', '#fff1cf / #120d2c', 'moon / outline'],
  ['copy button hover', '#f6b43c', '#ffd36b', 'lantern'],
  ['copy button copied', '#fbd682', '#8cc06a', '--lm-globe-land'],
  ['copy button error fill / text', '#f3e2c0 / #a8321e', '#120d2c / #ff6b5c', 'night / ship beacon'],
];

const N = { bg: '#1f1840', cream: '#1b1640', elev: '#2c2354', sunk: '#120d2c', gal: '#2a2450', fg: '#fff4e2', muted: '#b3a8dc', border: '#8b7cc4', rule: '#5a4c92', lantern: '#ffd36b', deep: '#120d2c', moon: '#fff1cf', land: '#8cc06a', beacon: '#ff6b5c', violet: '#a89bd8', tomato: '#e2492f' };
const hovBg = mix('#8b7cc4', 0.24, N.bg), hovCream = mix('#8b7cc4', 0.24, N.cream), hovElev = mix('#8b7cc4', 0.24, N.elev);
const T = 4.5, U = 3;
const pairs = [
  ['text on page', N.fg, N.bg, T], ['text on sidebar', N.fg, N.cream, T], ['text on elev', N.fg, N.elev, T], ['text on sunken / table head', N.fg, N.sunk, T],
  ['text on hover wash (page)', N.fg, hovBg, T], ['text on hover wash (sidebar)', N.fg, hovCream, T], ['text on hover wash (elev)', N.fg, hovElev, T],
  ['muted on page', N.muted, N.bg, T], ['muted on sidebar', N.muted, N.cream, T], ['muted on elev', N.muted, N.elev, T], ['muted on sunken', N.muted, N.sunk, T],
  ['link on page', N.lantern, N.bg, T], ['link on sidebar', N.lantern, N.cream, T], ['link on elev', N.lantern, N.elev, T], ['link on hover wash (page)', N.lantern, hovBg, T],
  ['on-accent on accent (pressed, search hover)', N.deep, N.lantern, T],
  ['copy idle text on moon', N.deep, N.moon, T], ['copy copied text on green', N.deep, N.land, T], ['copy error text on night', N.beacon, N.deep, T],
  ['code caption text on gallery', N.fg, N.gal, T],
  ...[['code fg', N.fg], ['comment', '#8b7cc4'], ['keyword', N.lantern], ['string', N.land], ['function', '#f2a08a'], ['number', N.moon], ['tag', N.beacon], ['attr', '#d8901f'], ['property', '#bfe6ee'], ['punct', N.muted], ['literal', '#e8a090'], ['class', N.violet]].map(([n, c]) => [`code ${n} on code bg`, c, N.deep, T]),
  ['note label on elev', N.violet, N.elev, T], ['warning label on elev', N.beacon, N.elev, T], ['tip label on elev', N.land, N.elev, T],
  ['border vs page (UI)', N.border, N.bg, U], ['border vs elev (UI)', N.border, N.elev, U], ['border vs sunken (UI)', N.border, N.sunk, U], ['border vs sidebar (UI)', N.border, N.cream, U],
  ['focus ring vs page (UI)', N.lantern, N.bg, U], ['focus ring vs elev (UI)', N.lantern, N.elev, U], ['focus ring vs sunken (UI)', N.lantern, N.sunk, U],
  ['accent fill vs elev (pressed segment, UI)', N.lantern, N.elev, U],
  ['tomato vs page (large / decorative only)', N.tomato, N.bg, U],
  ['title shadow tomato vs page (decorative)', N.tomato, N.bg, 0],
  ['rule vs page (decorative)', N.rule, N.bg, 0], ['shadow vs page (decorative)', N.rule, N.bg, 0],
  ['paper ticket inside demo (unchanged): ink on paper', '#2b1b14', '#fff6e4', T],
];
const res = pairs.map(([name, fg, bg, min]) => ({ name, fg, bg, ratio: +cr(fg, bg).toFixed(2), min, pass: cr(fg, bg) >= min }));
const old = [['old text on page', '#fff6e4', '#2b1b14', T], ['old muted on page', '#a39282', '#2b1b14', T], ['old muted on elev', '#a39282', '#120d2c', T], ['old link on page', '#f6b43c', '#2b1b14', T]].map(([name, fg, bg, min]) => ({ name, fg, bg, ratio: +cr(fg, bg).toFixed(2), min, pass: cr(fg, bg) >= min }));
await writeFile('contrast.json', JSON.stringify({ night: res, current: old, composites: { hovBg, hovCream, hovElev } }, null, 2));
const md = ['| Pair | FG | BG | Ratio | Needs | Result |', '| --- | --- | --- | --- | --- | --- |', ...res.map((r) => `| ${r.name} | \`${r.fg}\` | \`${r.bg}\` | ${r.ratio}:1 | ${r.min ? r.min + ':1' : 'n/a'} | ${r.min ? (r.pass ? 'pass' : '**FAIL**') : 'decorative'} |`)].join('\n');
await writeFile('contrast.md', md + '\n');
const ptab = ['| Token / role | Current dark | Night dark | Source |', '| --- | --- | --- | --- |', ...P.map(([t, o, n, s]) => `| ${t} | \`${o}\` | \`${n}\` | ${s} |`)].join('\n');
await writeFile('palette-table.md', ptab + '\n');
const fails = res.filter((r) => r.min && !r.pass);
console.log(res.map((r) => `${r.pass ? 'ok  ' : 'FAIL'} ${r.ratio.toFixed(2).padStart(6)}  ${r.name}`).join('\n'));
console.log('composites', hovBg, hovCream, hovElev, '\nfails:', fails.length);
process.exit(fails.length ? 1 : 0);
