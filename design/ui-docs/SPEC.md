# luismatute.me/ui docs shell: SPEC (Muse, pipa/luismatute-ui #18, 14 Oct 2026)

Design art only. Pixel builds it in Astro; `docs-shell.css` is the reference, not production CSS.
Mock: `index.html` (day), `night.html` (`html[data-mode="night"]`, same as the existing `--lm` night switch). Rebuild both with `python3 gen.py`.

## Rules
- CSP: no inline `<script>`/`<style>`/`style=""`. CSS and JS are external files. The phone drawer uses the Popover API (`popovertarget`), so it opens and closes with no JS.
- Base `/ui/`: every href/src in the mock is relative (`./docs-shell.css`, `./components/lm-chip/`). In Astro use `import.meta.env.BASE_URL` (`base: '/ui/'`); never a root-absolute `/foo`.
- Use the existing `@luismatute/ui` tokens where they exist (ink, paper, marigold, sky night ramp, moon, radii, borders, `--lm-duration-copy` 0.28s, `--lm-duration-copy-pop` 0.7s). New docs-only tokens are listed below. Use them as `--lm-docs-*` in the build.
- Banned: gradients on surfaces, glow, glassmorphism, pill-everything, emoji icons, fade-up on every block, the brown night page (Luis rejected it: night is indigo here).

## Layout (px)
| Part | Value |
|---|---|
| Header | 64 tall, sticky top 0, 2.5 bottom rule, padding 0 24 |
| Sidebar | 272 wide, nav sticky under header, padding 24 16 40, 2.5 right rule |
| Content | padding 48 48 96; measure 720; at >=1600 left padding 72 |
| On this page (TOC) | 216 wide (260 at >=1600), sticky, padding-top 48, 2 left rule |
| Breakpoints | >1180: 3 columns. 861-1180: sidebar + content (TOC hidden). <=860: 1 column, sidebar becomes drawer, content padding 32 20 72. <=400: version chip hidden |
| Drawer | min(320px, 86vw), full height, left edge, 2.5 right rule, 8px 0 0 hard shadow, backdrop rgb(18 13 44 / .55) |
| Tap targets | 44 min (menu, search, copy via an invisible 4px hit inset over the 36px button) |
| Nav item | min-height 36, padding 6 12, radius 8, 15px/1.3 weight 500. Hover: 2px ink border. Current: marigold fill (night #2e2563 + #ffd27a text), 2px ink border, 3px 3px 0 shadow, weight 700 |
| Nav group label | IBM Plex Mono 500 12px, tracking .06em, uppercase, ink-soft, gap 22 between groups |
| Pager | 2 columns, gap 16, 2.5 border, radius 14, 3px 3px 0 shadow; 1 column <=860 |

## Type
| Role | Face | Size / line-height | Weight | Tracking |
|---|---|---|---|---|
| H1 | Bricolage Display | clamp(36px, 2.2vw+28px, 56px) / 1.02 | 800 | -0.02em |
| Lede | Bricolage | 20 / 1.5 ink-soft, margin-bottom 40 | 400 | 0 |
| H2 | Bricolage Display | 28 / 1.15, margin 56 0 16, 16 padding-top + 2px top rule | 700 | -0.01em |
| H3 | Bricolage | 20 / 1.3, margin 32 0 10 | 700 | 0 |
| Body | Bricolage | 17 / 1.6 | 400 | 0 |
| Small / TOC | Bricolage | 14 | 400 (700 current) | 0 |
| Kicker / crumb / labels | IBM Plex Mono | 12 / 1.4 uppercase | 500 | .06em |
| Code | IBM Plex Mono | 14.5 / 1.65, tab-size 2 | 400 | 0 |
| Inline code | IBM Plex Mono | .88em, padding 2 6, radius 5, 1.5 border rule colour, side bg, nowrap | 400 | 0 |
Deep links: each h2/h3 has a trailing `#` anchor, opacity 0, shown on heading hover or anchor focus (140ms linear opacity).

## Colour
| Token | Day | Night |
|---|---|---|
| page | #fff6e4 (paper) | #120d2c (sky 0) |
| sidebar / drawer | #f3e2c0 (sand) | #1b1640 (sky 1) |
| header | #fbd682 (stage) | #241d52 (sky 2) |
| ink | #2b1b14 | #fff1cf (moon) |
| ink-soft | #5b4536 | #d9cfee |
| rule | #2b1b14 | #7466bd (3.9:1 non-text) |
| link | #1f7e7a | #ffd27a (warm) |
| accent / current nav | #f6b43c fill, #2b1b14 text | #2e2563 fill, #ffd27a text |
| focus ring | 3px solid #1f7e7a, offset 3 | 3px solid #ffd27a, offset 3 |
| hard shadow | #2b1b14 | #05030f |

Code theme (dark in both modes, as the issue asks): bg day #1b1640 / night #0b0820 (so it still reads as a sunken panel on the #120d2c page); bar day #241d52 / night #1b1640; bar rule #3d3478. Text #fff1cf, comment #b8acdf italic, keyword #ffb59f, string #8fe0d4, function #ffd27a, tag #f6b43c, attr #e6c9ff, punct #d9cfee. Lang label Plex Mono 12 uppercase #ffd27a; filename 13 #b8acdf.

## Code block
2.5px border (day #2b1b14, night #3d3478), radius 14, hard shadow 6px 7px 0, margin 24 0 32. Bar 48 tall, padding 0 6 0 16, gap 12, 2px bottom rule. Pre padding 18 20 20, horizontal scroll (no wrap).

## Copy button
36 tall (44 hit area), min-width 88, padding 0 12, gap 8, 2px border, radius 10, Plex Mono 500 13. 16px icon (two rects; check on copy).
| State | Fill | Text / border | Other |
|---|---|---|---|
| Idle | transparent | #fff1cf / #fff1cf | label "Copy" |
| Hover (only in `@media (hover:hover)`) | #fff1cf | #1b1640 | colour transition `--lm-duration-copy` 0.28s cubic-bezier(0.16,1,0.3,1) |
| Active | same as hover | | scale 0.96, 140ms |
| Focus-visible | idle | | 3px solid #ffd27a ring, offset 2 |
| Copied (2000ms, then idle) | #f6b43c | #2b1b14 / #f6b43c | label "Copied", check icon pops: scale .6 to 1, opacity 0 to 1 by 35%, `--lm-duration-copy-pop` 0.7s cubic-bezier(0.34,1.56,0.64,1). aria-live="polite" region says "Copied to clipboard" |
Keyboard: real `<button type="button">`, Enter and Space. `aria-label="Copy HTML snippet"` (language in the label). Clipboard failure shows "Press Ctrl+C" in the label and selects the code (Pixel).

## Motion
Drawer in: translateX(-100%) to 0, 320ms cubic-bezier(0.16,1,0.3,1) via `@starting-style`. Out: 180ms cubic-bezier(0.7,0,0.84,0). Only transform and opacity animate (colour transitions on the copy button are feedback, not layout).
`prefers-reduced-motion: reduce`: all of these durations go to 0s, so the copy states and the drawer switch instantly. The label change still announces.

## Contrast (WCAG 2.1, computed)
| Pair | FG | BG | Ratio |
|---|---|---|---|
| day ink/page | #2b1b14 | #fff6e4 | 15.40 |
| day ink-soft/page | #5b4536 | #fff6e4 | 8.32 |
| day ink/side | #2b1b14 | #f3e2c0 | 12.96 |
| day ink-soft/side | #5b4536 | #f3e2c0 | 7.00 |
| day link/page | #1f7e7a | #fff6e4 | 4.52 |
| day ink/head | #2b1b14 | #fbd682 | 11.85 |
| day active ink/marigold | #2b1b14 | #f6b43c | 9.07 |
| day focus ring/page | #1f7e7a | #fff6e4 | 4.52 |
| night moon/page | #fff1cf | #120d2c | 16.73 |
| night soft/page | #d9cfee | #120d2c | 12.60 |
| night moon/side | #fff1cf | #1b1640 | 15.17 |
| night soft/side | #d9cfee | #1b1640 | 11.42 |
| night warm link/page | #ffd27a | #120d2c | 13.18 |
| night warm/active | #ffd27a | #2e2563 | 9.45 |
| night moon/head | #fff1cf | #241d52 | 13.65 |
| night rule/page (non-text) | #7466bd | #120d2c | 3.91 |
| day code text | #fff1cf | #1b1640 | 15.17 |
| day code comment | #b8acdf | #1b1640 | 8.10 |
| day code keyword | #ffb59f | #1b1640 | 10.01 |
| day code string | #8fe0d4 | #1b1640 | 11.16 |
| day code fn | #ffd27a | #1b1640 | 11.94 |
| day code tag | #f6b43c | #1b1640 | 9.32 |
| day code attr | #e6c9ff | #1b1640 | 11.46 |
| day code punct | #d9cfee | #1b1640 | 11.42 |
| night code text | #fff1cf | #0b0820 | 17.51 |
| night code comment | #b8acdf | #0b0820 | 9.35 |
| night code keyword | #ffb59f | #0b0820 | 11.56 |
| night code string | #8fe0d4 | #0b0820 | 12.88 |
| night code fn | #ffd27a | #0b0820 | 13.79 |
| night code tag | #f6b43c | #0b0820 | 10.76 |
| night code attr | #e6c9ff | #0b0820 | 13.24 |
| night code punct | #d9cfee | #0b0820 | 13.19 |
| day bar lang label | #ffd27a | #241d52 | 10.75 |
| day bar file | #b8acdf | #241d52 | 7.29 |
| day bar copy idle | #fff1cf | #241d52 | 13.65 |
| day bar copy hover | #1b1640 | #fff1cf | 15.17 |
| day bar copied | #2b1b14 | #f6b43c | 9.07 |
| day bar focus ring | #ffd27a | #241d52 | 10.75 |
| night bar lang label | #ffd27a | #1b1640 | 11.94 |
| night bar file | #b8acdf | #1b1640 | 8.10 |
| night bar copy idle | #fff1cf | #1b1640 | 15.17 |
| night bar copy hover | #1b1640 | #fff1cf | 15.17 |
| night bar copied | #2b1b14 | #f6b43c | 9.07 |
| night bar focus ring | #ffd27a | #1b1640 | 11.94 |

All text pairs >= 4.5:1 (lowest: day link #1f7e7a on paper, 4.52). Non-text rules and focus rings >= 3:1.

## Stills
`stills/{day,night}-{375,768,1280,1920}.png` (full page) plus `-375-drawer.png` (drawer open). Contact sheet: `contact-sheet.png`.
