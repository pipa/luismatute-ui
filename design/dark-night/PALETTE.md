# Dark mode from "The move." · v2

Muse · branch `muse/dark-night` · design only, no production code.

Luis on the first pass: looks good, not good enough. It read as one purple fill. The sidebar, the page and the cards were three steps of the same indigo (1.17:1 between page and card). The cloud-shade offset was 2.28:1 on the page, a soft smear rather than a hard edge. Lantern yellow was on every group label and kicker, so it stopped reading as light. The cream demo stage was a paper rectangle pasted onto the night.

v2 keeps the zenith as the page and builds the rest of the scene around it. Files: `night.css`, `night-sheet-v2.png` (first pass | v2 | light), `night-v2-1280.png`, `contrast.md` / `contrast.json`, `palette.mjs`.

## Scene

From `concept-c-takeoff.html`, the night of "The move." Sky bands, top to bottom: `#1f1840` `#251d4a` `#2c2354` `#33295e` `#3b3068` `#443872` `#4e417c` `#594b86`. Sea, horizon to deep: `#2a3266` `#242b5a` `#1f254e` `#1a1f43`. Outlines `#120d2c`. Ship hull `#18143a`. Moon halo `#3e3470`. Moon `#fff1cf`. Stars `#fff4e2`. Lantern `#ffd36b`. Lighthouse stripes `#e2492f`. Moonlit cloud `#8b7cc4` / shade `#5a4c92`. Mast beacon `#ff6b5c`.

Derived tints are named in the table. They live on `--docs-*` only. No `--lm-*` changes.

## Palette

| Token / role | First pass | v2 | Source in the scene | Why |
| --- | --- | --- | --- | --- |
| --docs-bg | `#1f1840` | `#1f1840` | SKY.move[0], zenith | The page stays the top of the night sky. Depth is the other planes, not a lighter sky. |
| --docs-cream (sidebar) | `#1b1640` | `#2a3266` | SEA.move[0], horizon | The rock colour was the same purple as the page. The sea horizon is bluer and a step lighter, so the rail is its own plane. |
| --docs-elev (cards) | `#2c2354` | `#443872` | SKY.move[5] | Band 2 sat 1.17:1 off the page, so cards disappeared. Band 5 is 1.63:1, a moonlit plane. |
| --docs-sunken | `#120d2c` | `#120d2c` | scene outline, --lm-night | Wells stay the darkest ink. On the lighter cards the inset reads at 1.83:1. |
| --docs-fg | `#fff4e2` | `#fff4e2` | stars and the title | Unchanged. Text is the star colour. |
| --docs-muted | `#b3a8dc` | `#c3bbe0` | derived: cloud #8b7cc4 mixed 48% to white | The 35% tint fell to 4.65:1 on the lighter cards. This clears 5:1. |
| --docs-border | `#8b7cc4` | `#b9acd0` | derived: cloud mixed 40% toward star #fff4e2 | The raw cloud was 2.81:1 on the new cards and looked muddy. The lit rim is a hard edge, 4.8:1. |
| --docs-rule | `#5a4c92` | `#aea0cd` | derived: cloud mixed 30% toward the star | Shade-side dashes were 1.40:1 on the cards. Interior lines now clear 3:1. |
| --docs-shadow | `#5a4c92` | `#8b7cc4` | moonlit cloud, light side | The shade offset was 2.28:1 on the page, a soft smear. The cloud itself is 4.57:1, a hard slab, the ink-edge idea. |
| --docs-link | `#ffd36b` | `#ffd36b` | lighthouse lantern | Unchanged for real links. Group labels no longer use it. |
| --docs-kicker (new) | `#ffd36b` | `#b9acd0` | lit cloud rim | Labels and kickers were lantern, so yellow stopped meaning “on”. They take the rim. |
| --docs-accent | `#ffd36b` | `#ffd36b` | lantern | Pressed segment and the current-item bar. The light, used rarely. |
| --docs-on-accent | `#120d2c` | `#120d2c` | lantern outline | Text on the solid lantern. |
| --docs-focus | `#ffd36b` | `#ffd36b` | lantern | The ring is the light. |
| --docs-hover | `rgba(139,124,196,.24)` | `rgba(139,124,196,.12)` | derived: cloud at 12% | 24% muddied the lighter cards and squeezed muted text. 12% still reads as hover. |
| --docs-overlay | `rgba(18,13,44,.8)` | `rgba(18,13,44,.8)` | derived: --lm-night at 80% | Unchanged. |
| nav current item | `#2c2354 + bar` | `#443872 + lantern text + bar` | SKY.move[5] + lantern | The row is the raised plane. The label is the one lantern in the nav. |
| title text-shadow | `#e2492f` | `#e2492f` | lighthouse stripes, --lm-tomato | Tomato stays decoration on large titles only. |
| --docs-code-bg | `#120d2c` | `#1a1f43` | SEA.move[3], deep | Code was the same purple-black as the wells. The deep sea is blue. |
| --docs-code-caption | `#2a2450` | `#242b5a` | SEA.move[1] | The waterline above the deep, so the block has a sea step. |
| --docs-code-fg | `#fff4e2` | `#fff4e2` | stars | Unchanged. |
| --docs-code-comment | `#8b7cc4` | `#9486c6` | derived: cloud mixed 8% toward the star | The cloud was 4.37:1 on the deep sea. The lift clears 4.5:1. |
| --docs-code-keyword | `#ffd36b` | `#ffd36b` | lantern | A few keywords, like lights on the water. Chrome labels are not lantern. |
| --docs-code-string | `#8cc06a` | `#8cc06a` | --lm-globe-land | The package green. Unchanged. |
| --docs-code-function | `#f2a08a` | `#f2a08a` | --lm-blush | Unchanged. |
| --docs-code-number | `#fff1cf` | `#fff1cf` | moon disc and beam | Moon on the water, distinct from the lantern keywords. |
| --docs-code-tag | `#ff6b5c` | `#ff9383` | derived from the mast beacon #ff6b5c | The beacon missed 4.5:1 on the lighter cards. Lifted toward the star. |
| --docs-code-attr | `#d8901f` | `#d8901f` | --lm-fold | Unchanged. |
| --docs-code-property | `#bfe6ee` | `#bfe6ee` | --lm-glass | Unchanged. |
| --docs-code-punct | `#b3a8dc` | `#c3bbe0` | derived lavender, same as muted | Tracks muted so it holds on the sea. |
| --docs-code-literal | `#e8a090` | `#e8a090` | --lm-route-cool | Unchanged. |
| --docs-code-class | `#a89bd8` | `#b9aacf` | derived from stop marker #7563bd | Same lift as the note label, so it clears the lighter cards and the sea. |
| --docs-note | `#a89bd8` | `#b9aacf` | derived from stop marker #7563bd | 4.06:1 on the new cards. Lifted toward the star until it clears 4.5:1. |
| --docs-warn | `#ff6b5c` | `#ff9383` | derived from mast beacon #ff6b5c | Same lift as code tags. Still the beacon, light enough for the cards. |
| --docs-tip | `#8cc06a` | `#8cc06a` | --lm-globe-land | Green stays the success and tip colour. |
| copy idle | `#fff1cf / #120d2c` | `#fff1cf / #120d2c` | moon / outline | Unchanged. A moon chip. |
| copy hover | `#ffd36b` | `#ffd36b` | lantern | Hover is the lantern coming on. |
| copy copied | `#8cc06a` | `#8cc06a` | --lm-globe-land | Green success. Unchanged. |
| copy error | `#120d2c / #ff6b5c` | `#120d2c / #ff9383` | night / lifted beacon | Text tracks the lifted beacon so it matches warning. |
| demo paper stage | `#fff6e4` | `#3e3470` | moon halo ring | A cream stage made the ticket look pasted on. The halo is the moonlight; the paper card is the light. |
| top bar | `flat #1f1840` | `#18143a → #2c2354` | ship hull to SKY.move[2] | A faint sky step across the bar. Stars (star colour, static) sit on the page only. |

How it reads: the page is the zenith, with a static star field (CSS radial-gradients, 1–2px, no image, no animation). The top bar is a short sky step, hull at the top to sky band 2 at the perforation. The sidebar is the sea horizon. Cards are the moonlit band. Table heads, badges and demo chrome sink to the outline colour. Code is the deep sea, caption the waterline. The boarding pass stays cream paper with its ink edge; it sits on the moon halo, so the ticket is the light in the room. Borders are the lit rim of the cloud. The offset shadow is the cloud itself, a hard slab at 4.57:1 on the page, the same idea as ink on paper. Lantern is links, the focus ring, the current nav label and bar, the pressed segment, and copy hover. Tomato is the title shadow only. Green is tip, string, and Copied.

Shell geometry and type stay the docs shell: existing radii, Bricolage, IBM Plex Mono, Caveat for the hand line. No inline styles or scripts in the theme. New alias: `--docs-kicker`. `--docs-on-accent`, `--docs-code-caption` and `--docs-title-shadow` were already introduced in the first pass.

## Contrast

`node design/dark-night/palette.mjs` exits 0. Body text 4.5:1, large text and UI borders, rules, shadow and focus 3:1. Full list in `contrast.md`.

Lowest required ratios:

| Pair | Ratio | Needs |
| --- | --- | --- |
| shadow vs sidebar | 3.31:1 | 3:1 |
| tomato vs page (large) | 4.14:1 | 3:1 |
| rule vs elev | 4.24:1 | 3:1 |
| shadow vs page | 4.57:1 | 3:1 |
| note label on elev | 4.73:1 | 4.5:1 |
| warning label on elev | 4.75:1 | 4.5:1 |
| tip label on elev | 4.80:1 | 4.5:1 |
| kicker on elev | 4.81:1 | 4.5:1 |
| code comment on sea | 4.91:1 | 4.5:1 |
| muted on hover (elev) | 4.92:1 | 4.5:1 |

The brightest star dot, composited, is a 2px speck. Text is measured on the page colour `#1f1840` (15.27:1). See the note at the end of `contrast.md`.

## Render-look-fix

Round 1 is the palette above, checked against the first-pass sheet. Notes from the stills are added after each look.

## Reproduce

```sh
# from the repo root
python3 -m http.server 3400 --bind 127.0.0.1 &
node design/dark-night/palette.mjs
node design/dark-night/capture.mjs
node design/dark-night/render-sheet.mjs
```
