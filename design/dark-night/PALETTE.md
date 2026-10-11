# Dark mode from "The move."

Muse · branch `muse/dark-night` · design only, no production code.

Luis: the light palette hangs together, the current dark one just flips it (brown ink canvas, paper borders, paper shadows). This proposal builds dark mode from the night scene on the live page, "The move." (purple night sky, moon, sea, lighthouse beam, plane): the night colours, used as the base.

Files: `night-sheet.png` (current dark vs night dark vs light, docs-shell mock at 1280 and 375), `swatches.png` (every role with its hex), `night.css` (the proposal as an override layer for `design/docs-shell/mock/mock.css`), `contrast.md` / `contrast.json` (every ratio), `palette.mjs` (the contrast check, exits 1 on any fail), `capture.mjs` + `render-sheet.mjs` (Playwright renders), `shots/` (the raw stills).

## 1. What dark is today

- **@luismatute/ui package:** no dark tokens. `tokens.css` sets `color-scheme: light`. Cards and illustrations are paper tickets on both themes.
- **luismatute.me live page** (`concept-c-takeoff.html` @ `40c607f`): no dark styles, no `prefers-color-scheme`, no `data-theme`.
- **Docs shell** (`design/docs-shell/SPEC.md` + `mock/mock.css`): the only dark theme. It remaps the `--docs-*` aliases. Values are in the "Current dark" column below. Extra dark-only hardcodes in `mock.css`: title shadow `--lm-night`, nav current item `--lm-hover` (marigold 22%), code caption `--lm-hair-line #4b3428`, search hover and pressed theme text `--lm-ink`, copy button paper and ink.

## 2. What "The move." paints (concept-c-takeoff.html, `// ---- the move`)

| Hex | Where in the scene |
| --- | --- |
| `#1f1840` `#251d4a` `#2c2354` `#33295e` `#3b3068` `#443872` `#4e417c` `#594b86` | SKY.move, 8 bands top to bottom |
| `#2a3266` `#242b5a` `#1f254e` `#1a1f43` | SEA.move, horizon to deep |
| `#120d2c` | outlines (lighthouse, lantern, rock), title extrusion (= `--lm-night`) |
| `#1b1640` | lighthouse rock, cloud outlines (INK swapped at night) |
| `#2a2450` | lighthouse gallery rail |
| `#352b62` `#3e3470` | moon halo rings |
| `#fff1cf` | moon disc, lighthouse beam, moon path on the sea |
| `#efdcae` | moon craters |
| `#fff1df` | lighthouse tower |
| `#e2492f` | lighthouse stripes and cap (= `--lm-tomato`) |
| `#ffd36b` | lantern, lantern glow, ship windows, plane cabin lights |
| `#ff6b5c` | ship mast beacon |
| `#18143a` `#231d4c` | ship hull and decks |
| `#8b7cc4` / `#5a4c92` | moonlit clouds at plane height, light / shade |
| `#6a5ca0` / `#4b3f7c` | far clouds, light / shade |
| `#fff4e2` | stars, shooting stars, the "The move." title (= `--lm-cream`) |
| `#7563bd` | stop 5 marker on the globe |
| `#3a4278` | wave line |

## 3. Palette

Mapped 1:1 onto the docs-shell roles. Exact scene colours wherever they pass, three derived tints (marked) where nothing in the scene clears AA.

| Token / role | Current dark | Night dark | Source |
| --- | --- | --- | --- |
| --docs-bg | `#2b1b14` | `#1f1840` | SKY.move[0], top band of the night sky |
| --docs-cream (sidebar, inline TOC) | `#120d2c` | `#1b1640` | lighthouse rock and cloud outlines |
| --docs-elev (cards, inputs, chips) | `#120d2c` | `#2c2354` | SKY.move[2] |
| --docs-sunken (badge, table head, demo chrome) | `#4b3428` | `#120d2c` | --lm-night, the scene outline colour |
| --docs-fg (text) | `#fff6e4` | `#fff4e2` | stars and the "The move." title (= --lm-cream) |
| --docs-muted | `#a39282` | `#b3a8dc` | derived: moonlit cloud #8b7cc4 mixed 35% to white |
| --docs-border | `#fff6e4` | `#8b7cc4` | moonlit cloud, light side |
| --docs-rule (hairlines, dashed rails) | `#f3e2c0` | `#5a4c92` | moonlit cloud, shade side |
| --docs-shadow (hard offset shadow) | `#fff6e4` | `#5a4c92` | moonlit cloud, shade side |
| --docs-link, group labels, kicker | `#f6b43c` | `#ffd36b` | lighthouse lantern and the lit windows |
| --docs-accent (pressed, current mark) | `#f6b43c` | `#ffd36b` | lighthouse lantern |
| --docs-on-accent (new: text on accent) | `#2b1b14` | `#120d2c` | lantern outline (#120d2c on #ffd36b) |
| --docs-focus (3px ring) | `#fff6e4` | `#ffd36b` | lighthouse lantern |
| --docs-hover (wash) | `rgba(246,180,60,.22)` | `rgba(139,124,196,.24)` | derived: moonlit cloud at 24% |
| --docs-overlay | `#120d2c` | `rgba(18,13,44,.8)` | derived: --lm-night at 80% |
| nav current item | `marigold 22% wash` | `#2c2354 + lantern bar` | SKY.move[2] + lantern |
| title text-shadow | `#120d2c` | `#e2492f` | lighthouse stripes (= --lm-tomato) |
| --docs-code-bg | `#120d2c` | `#120d2c` | --lm-night (unchanged) |
| --docs-code-caption (new) | `#4b3428` | `#2a2450` | lighthouse gallery rail |
| --docs-code-fg | `#fff6e4` | `#fff4e2` | stars |
| --docs-code-comment | `#a39282` | `#8b7cc4` | moonlit cloud |
| --docs-code-keyword | `#f6b43c` | `#ffd36b` | lantern |
| --docs-code-string | `#62a64e` | `#8cc06a` | --lm-globe-land (package green) |
| --docs-code-function | `#f2a08a` | `#f2a08a` | --lm-blush (unchanged) |
| --docs-code-number | `#fbd682` | `#fff1cf` | moon disc and beam |
| --docs-code-tag | `#ff7a5c` | `#ff6b5c` | ship mast beacon |
| --docs-code-attr | `#d8901f` | `#d8901f` | --lm-fold (unchanged) |
| --docs-code-property | `#5f97a6` | `#bfe6ee` | --lm-glass |
| --docs-code-punct | `#f3e2c0` | `#b3a8dc` | derived lavender (= muted) |
| --docs-code-literal | `#e8a090` | `#e8a090` | --lm-route-cool (unchanged) |
| --docs-code-class | `#8cc06a` | `#a89bd8` | derived: stop-5 marker #7563bd mixed 35% to white |
| --docs-note | `#bfe6ee` | `#a89bd8` | derived violet (stop-5 marker) |
| --docs-warn | `#ff7a5c` | `#ff6b5c` | ship mast beacon |
| --docs-tip | `#62a64e` | `#8cc06a` | --lm-globe-land |
| copy button idle fill / text | `#fff6e4 / #2b1b14` | `#fff1cf / #120d2c` | moon / outline |
| copy button hover | `#f6b43c` | `#ffd36b` | lantern |
| copy button copied | `#fbd682` | `#8cc06a` | --lm-globe-land |
| copy button error fill / text | `#f3e2c0 / #a8321e` | `#120d2c / #ff6b5c` | night / ship beacon |

How it reads: the page is the top of the night sky, cards sit one band lower (`#2c2354`), and table heads, demo chrome and code sink to the scene's outline colour (`#120d2c`). Borders and hard shadows are the moonlit cloud pair, light side for the edge and shade side for the offset shadow, so the ticket-and-shadow look survives without a cream outline. All warm light is the lighthouse lantern `#ffd36b`: links, kickers, the pressed segment, the current-page bar, and the focus ring. Text is the stars' cream.

Identity:
- **Tomato** stays as the title shadow (the lighthouse stripes are tomato on night) and in the demo chrome dots. Tomato on the page is 4.14:1, so it's large text and decoration only, never body text, same rule as light.
- **Chartreuse** (`#C6F432`) is from the old DIRECTION.md variant B, not an @luismatute/ui token. The package green is `--lm-globe-land #8cc06a`, and it carries the green role here: tip callouts, code strings, the Copied state.
- Paper tickets (`lm-card`, illustrations) stay paper, as SPEC.md already requires.

New aliases the build needs (they don't exist in `mock.css` today): `--docs-on-accent`, `--docs-code-caption`, `--docs-title-shadow`. Everything else is a value change on existing `--docs-*` aliases. No `--lm-*` package token changes, and no new package hex: the derived tints live as docs aliases only, unless Eddie wants them as package tokens later.

## 4. Contrast (WCAG 2.2 AA)

Checked with `node palette.mjs` (WCAG relative luminance). Body text needs 4.5:1 and UI and large text need 3:1. Alpha washes are composited over their real background first (hover on page `#393060`, on sidebar `#362e60`, on elev `#43386f`). **0 fails.**

| Pair | FG | BG | Ratio | Needs | Result |
| --- | --- | --- | --- | --- | --- |
| text on page | `#fff4e2` | `#1f1840` | 15.27:1 | 4.5:1 | pass |
| text on sidebar | `#fff4e2` | `#1b1640` | 15.61:1 | 4.5:1 | pass |
| text on elev | `#fff4e2` | `#2c2354` | 13.07:1 | 4.5:1 | pass |
| text on sunken / table head | `#fff4e2` | `#120d2c` | 17.23:1 | 4.5:1 | pass |
| text on hover wash (page) | `#fff4e2` | `#393060` | 10.93:1 | 4.5:1 | pass |
| text on hover wash (sidebar) | `#fff4e2` | `#362e60` | 11.24:1 | 4.5:1 | pass |
| text on hover wash (elev) | `#fff4e2` | `#43386f` | 9.48:1 | 4.5:1 | pass |
| muted on page | `#b3a8dc` | `#1f1840` | 7.56:1 | 4.5:1 | pass |
| muted on sidebar | `#b3a8dc` | `#1b1640` | 7.73:1 | 4.5:1 | pass |
| muted on elev | `#b3a8dc` | `#2c2354` | 6.47:1 | 4.5:1 | pass |
| muted on sunken | `#b3a8dc` | `#120d2c` | 8.53:1 | 4.5:1 | pass |
| link on page | `#ffd36b` | `#1f1840` | 11.7:1 | 4.5:1 | pass |
| link on sidebar | `#ffd36b` | `#1b1640` | 11.97:1 | 4.5:1 | pass |
| link on elev | `#ffd36b` | `#2c2354` | 10.02:1 | 4.5:1 | pass |
| link on hover wash (page) | `#ffd36b` | `#393060` | 8.37:1 | 4.5:1 | pass |
| on-accent on accent (pressed, search hover) | `#120d2c` | `#ffd36b` | 13.2:1 | 4.5:1 | pass |
| copy idle text on moon | `#120d2c` | `#fff1cf` | 16.73:1 | 4.5:1 | pass |
| copy copied text on green | `#120d2c` | `#8cc06a` | 8.81:1 | 4.5:1 | pass |
| copy error text on night | `#ff6b5c` | `#120d2c` | 6.71:1 | 4.5:1 | pass |
| code caption text on gallery | `#fff4e2` | `#2a2450` | 13.15:1 | 4.5:1 | pass |
| code code fg on code bg | `#fff4e2` | `#120d2c` | 17.23:1 | 4.5:1 | pass |
| code comment on code bg | `#8b7cc4` | `#120d2c` | 5.16:1 | 4.5:1 | pass |
| code keyword on code bg | `#ffd36b` | `#120d2c` | 13.2:1 | 4.5:1 | pass |
| code string on code bg | `#8cc06a` | `#120d2c` | 8.81:1 | 4.5:1 | pass |
| code function on code bg | `#f2a08a` | `#120d2c` | 9.08:1 | 4.5:1 | pass |
| code number on code bg | `#fff1cf` | `#120d2c` | 16.73:1 | 4.5:1 | pass |
| code tag on code bg | `#ff6b5c` | `#120d2c` | 6.71:1 | 4.5:1 | pass |
| code attr on code bg | `#d8901f` | `#120d2c` | 7.08:1 | 4.5:1 | pass |
| code property on code bg | `#bfe6ee` | `#120d2c` | 14.08:1 | 4.5:1 | pass |
| code punct on code bg | `#b3a8dc` | `#120d2c` | 8.53:1 | 4.5:1 | pass |
| code literal on code bg | `#e8a090` | `#120d2c` | 8.81:1 | 4.5:1 | pass |
| code class on code bg | `#a89bd8` | `#120d2c` | 7.45:1 | 4.5:1 | pass |
| note label on elev | `#a89bd8` | `#2c2354` | 5.66:1 | 4.5:1 | pass |
| warning label on elev | `#ff6b5c` | `#2c2354` | 5.09:1 | 4.5:1 | pass |
| tip label on elev | `#8cc06a` | `#2c2354` | 6.68:1 | 4.5:1 | pass |
| border vs page (UI) | `#8b7cc4` | `#1f1840` | 4.57:1 | 3:1 | pass |
| border vs elev (UI) | `#8b7cc4` | `#2c2354` | 3.92:1 | 3:1 | pass |
| border vs sunken (UI) | `#8b7cc4` | `#120d2c` | 5.16:1 | 3:1 | pass |
| border vs sidebar (UI) | `#8b7cc4` | `#1b1640` | 4.68:1 | 3:1 | pass |
| focus ring vs page (UI) | `#ffd36b` | `#1f1840` | 11.7:1 | 3:1 | pass |
| focus ring vs elev (UI) | `#ffd36b` | `#2c2354` | 10.02:1 | 3:1 | pass |
| focus ring vs sunken (UI) | `#ffd36b` | `#120d2c` | 13.2:1 | 3:1 | pass |
| accent fill vs elev (pressed segment, UI) | `#ffd36b` | `#2c2354` | 10.02:1 | 3:1 | pass |
| tomato vs page (large / decorative only) | `#e2492f` | `#1f1840` | 4.14:1 | 3:1 | pass |
| title shadow tomato vs page (decorative) | `#e2492f` | `#1f1840` | 4.14:1 | n/a | decorative |
| rule vs page (decorative) | `#5a4c92` | `#1f1840` | 2.28:1 | n/a | decorative |
| shadow vs page (decorative) | `#5a4c92` | `#1f1840` | 2.28:1 | n/a | decorative |
| paper ticket inside demo (unchanged): ink on paper | `#2b1b14` | `#fff6e4` | 15.4:1 | 4.5:1 | pass |

For comparison, the current dark: text on page 15.40, muted on page 5.51, muted on elev (`#120d2c`) 6.24, link on page 9.07. Both pass. The current dark's problem is the look, not the contrast.

## 5. Render-look-fix loop (what changed after looking)

1. **Nav current item went khaki.** The marigold 22% wash over indigo turns muddy olive-brown. Now the current item is `elev #2c2354` with the lantern inset bar.
2. **Hover wash, same problem.** A warm wash on cool indigo looks dirty. Hover is now moonlit cloud at 24% (`#393060` on page), text 10.93:1.
3. **Hard shadows disappeared.** `#120d2c` shadows on `#1f1840` (1.2:1) read as nothing, so the offset-shadow identity was gone. I tried cloud-shade and cloud-light. Cloud-shade `#5a4c92` keeps a visible offset that still reads as a shadow, distinct from the `#8b7cc4` edge.
4. **Title shadow didn't apply.** The mock's `:root:not([data-theme=light])` rule out-ranked the override. Specificity fixed, and the tomato extrusion shows.
5. **Copy button states collapsed.** The idle override painted over Copied and Error. They're now separate: Copied is green with night text, Error is night with a beacon border and text.
6. **Code caption was brown** (`#4b3428` hair-line) on indigo. Now it's the lighthouse gallery `#2a2450`.

## Reproduce

```sh
# from the repo root
python3 -m http.server 3400 --bind 127.0.0.1 &
node design/dark-night/palette.mjs        # contrast, exits 1 on any fail
node design/dark-night/capture.mjs        # shots/ (light, current dark, night dark at 1280 and 375)
node design/dark-night/render-sheet.mjs   # night-sheet.png, swatches.png
```
