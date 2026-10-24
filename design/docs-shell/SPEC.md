# Docs shell · Muse spec for Pixel

Design for [#18](https://github.com/pipa/luismatute-ui/issues/18). Visual shell only. Pixel builds this later in custom Astro with Pagefind, served at `luismatute.me/ui`.

The mock is the source of truth for spacing and states: `design/docs-shell/mock/`.

## Ban list

No gradients. No glow. No glassmorphism. No generic SaaS docs chrome. No emoji icons. No `<select>` anywhere in the shell. No new hues. No inline scripts or styles.

Animate **transform and opacity only**. Honour `prefers-reduced-motion` and `html[data-motion="reduce"]`.

## Tokens and type

Use **only** `@luismatute/ui` tokens (`dist/tokens.css`, `src/tokens/tokens.ts`).

| Role | Face | Token |
| --- | --- | --- |
| Display titles | Bricolage Display, weight 800, stretch 75% | `--lm-font-display` |
| Body and UI | Bricolage | `--lm-font-text` |
| Chrome, kickers, code, version | IBM Plex Mono | `--lm-font-mono` |
| Hand accent only | Caveat | `--lm-font-hand` |

Do not introduce Martian Grotesk. The package does not ship it.

Caveat is a **small accent** only: the “wheels up” mark in the top bar (14px / `--lm-font-size-meta`), the search empty line, and the 404 line. Never for body, nav, or tables.

### Colour roles (no new hex)

The docs have two themes, **Day** and **Night**, set on `html[data-mode]` (`day` | `night`). There is no Auto option (Luis dropped it on Oct 19). Shipped values live in `site/src/styles/docs.css` as `--lm-docs-*` aliases over package tokens.

Day (`:root`, and `html[data-mode="day"]`):

| Role | Alias | Value |
| --- | --- | --- |
| Page | `--lm-docs-page` | `--lm-paper` `#fff6e4` |
| Text | `--lm-docs-ink` | `--lm-ink` `#2b1b14` |
| Muted text | `--lm-docs-ink-soft` | `--lm-ink-soft` |
| Rules, borders | `--lm-docs-rule` | `--lm-ink` |
| Sidebar | `--lm-docs-side` | `--lm-sand` `#f3e2c0` |
| Top bar | `--lm-docs-head` | `--lm-stage` `#fbd682` |
| Links, focus ring | `--lm-docs-link`, `--lm-docs-focus` | `#1f7e7a` |
| Current page, pressed | `--lm-docs-active-bg` / `--lm-docs-active-ink` | `--lm-marigold` / `--lm-ink` |
| Inline TOC | `--lm-docs-toc-bg` | `--lm-cream` `#fff4e2` |
| Search hit / url line | `--lm-docs-hit` / `--lm-docs-crumb` | `--lm-hover` / `--lm-tomato-d` |
| Hard shadow colour | `--lm-docs-shadow` | `--lm-ink` |
| Overlay | `--lm-docs-backdrop` | `rgb(18 13 44 / 0.55)` |

Night (`html[data-mode="night"]`): the site's indigo night sky, never the package's brown paper.

| Role | Alias | Value |
| --- | --- | --- |
| Page | `--lm-docs-page` | `--lm-sky-night-1` `#120d2c` |
| Text | `--lm-docs-ink` | `--lm-moon` `#fff1cf` |
| Muted text | `--lm-docs-ink-soft` | `#d9cfee` |
| Rules, borders | `--lm-docs-rule` | `#7466bd` |
| Sidebar, inline TOC | `--lm-docs-side`, `--lm-docs-toc-bg` | `--lm-sky-night-2` `#1b1640` |
| Top bar | `--lm-docs-head` | `--lm-sky-night-3` `#241d52` |
| Current page, search hit | `--lm-docs-active-bg`, `--lm-docs-hit` | `--lm-sky-night-4` `#2e2563` |
| Links, accent, focus, url line, active text | `--lm-docs-link` etc. | `#ffd27a` |
| Hard shadow colour | `--lm-docs-shadow` | `#05030f` |

Do **not** remap `--lm-paper` / `--lm-ink` on `html` in the docs CSS. Cards and illustrations stay paper tickets in both themes. Remap only the `--lm-docs-*` aliases.

Tomato `#e2492f` on paper is 3.74:1 — large text / chrome only. Lagoon `#1f7f7a` on paper is 4.47:1 — not body text. Leaf `#62a64e` on paper is 2.76:1 — not text. Ink-soft on ink is 1.85:1 — never muted-on-dark.

### Semantic aliases

```css
:root { /* day values */ }
html[data-mode="night"] { /* night values */ }
```

There is no `prefers-color-scheme` block in the CSS. The OS preference is only read by `theme-init.js` when nothing is saved (see below), and it always resolves to `day` or `night`. The mock (`mock/`, `--docs-*` names, Light/Dark/Auto) predates this and is kept as a historical reference only.

## Theme control and first paint

Two-button segmented control: **Day** and **Night**. **No `<select>`.** There is no Auto button.

```html
<fieldset class="theme-switch" hidden data-theme-switch>
  <legend class="sr">Theme</legend>
  <button type="button" data-mode-set="day" aria-pressed="false">Day</button>
  <button type="button" data-mode-set="night" aria-pressed="false">Night</button>
</fieldset>
```

A fieldset is the group; `aria-pressed` marks the current mode. The group stays `hidden` until `site/src/scripts/theme-switch.ts` runs, so a no-JS page shows no dead control (the saved mode still applies through `theme-init.js`).

| Part | Value |
| --- | --- |
| Height | 40px buttons inside a 44px-min hit row |
| Each button min-width | 44px (40px allowed below 768 if the label still fits) |
| Radius | `--lm-radius-pill` |
| Border | `--lm-border-line` (2.5px) `--docs-border` |
| Shadow | `3px 3px 0 var(--docs-shadow)` |
| Idle fill | `--docs-elev` |
| Hover | `--docs-hover` |
| `aria-pressed="true"` | `--lm-marigold` fill, `--lm-ink-fixed` text |
| Type | Bricolage 13px / `--lm-font-size-small`, weight 600 |

Storage: the shared cookie `lm-mode` (`day` | `night`, one year, `Path=/`, `SameSite=Lax`, `Domain=.luismatute.me` when on that domain, `Secure` on https), so the choice carries across luismatute.me, the blog and `/ui/`. It is mirrored in `localStorage['lm.ui.theme']` for older visits. Clicking a button saves that mode; there is no way to go back to "follow the OS" from the docs control.

### No flash of the wrong theme (CSP)

`theme-init.js` (built from `src/theme-init.ts`) is an **external, render-blocking** script in `<head>` **before any stylesheet**. No `defer`. No `async`. No inline script — the site CSP is `script-src 'self'` and would reject a boot snippet.

```html
<head>
  <script src="/ui/_astro/theme-init.[hash].js" data-lm-theme data-cookie-domain=".luismatute.me"></script>
  <link rel="stylesheet" href="…" />
  …
</head>
```

It always sets `html[data-mode]` to `day` or `night`, reading in this order (bad values fall through):

1. `?mode=` query (`day` | `night`; `light` / `dark` are accepted as aliases).
2. The `lm-mode` cookie. A legacy `auto` value set by another site resolves through `prefers-color-scheme`.
3. `localStorage['lm.ui.theme']`.
4. `prefers-color-scheme` (`dark` → `night`, otherwise `day`).

A saved Night theme must **never** flash Day on load. If `theme-init.js` is deferred, async, inline, or placed after CSS, Night users on a light OS will paint paper first. That fails this spec.

Docs `data-mode` is only `day` | `night`. Scene themes (`hero`, `move`, …) stay on the **demo stage** (`data-theme` there), never on `html`.

## Layout grid

Content measure: **68ch** for prose, lede, callouts, flight rule. Demo, tables, code, token rows, and pager may use the full content column.

| Viewport | Top bar | Nav | Content | TOC | Page pad |
| --- | --- | --- | --- | --- | --- |
| 1440 | 64px sticky | 248px sticky | 1fr, pad 40px | 220px sticky | 40px |
| 1280 | 64 | 220 | 1fr, pad 28 | 200 | 28 |
| 1024 | 64 | 220 | 1fr, pad 24 | **inline collapse** | 24 |
| 768 | 64 | 200 | 1fr, pad 20 | inline collapse | 20 |
| 375 | **112** two rows | **drawer 280** | 1fr, pad 16 | inline collapse | 16 |
| 320 | same as 375 | drawer `min(280px, 86vw)` | pad 16 | inline | 16 |

Breakpoints (max-width):

| Query | What changes |
| --- | --- |
| ≤1439 | Nav 220, TOC 200, pad 28 |
| ≤1279 | Pad 24 |
| ≤1180 | TOC aside hides. Inline “On this page” appears at the **top of the content column**. |
| ≤1023 | Nav 200, pad 20, title uses `--lm-font-size-pass-port`. Hide “wheels up”, the site link, and the Search label (magnifier stays, 44×44). Wordmark stays one line. |
| ≤767 | Nav becomes a left drawer. Menu button shows. Top bar wraps to two rows (112px). Site link hides. Search label hides; magnifier stays. |

Grid:

```
.docs-body { grid-template-columns: var(--docs-nav-w) minmax(0,1fr) var(--docs-toc-w); }
/* ≤1180 */ grid-template-columns: var(--docs-nav-w) minmax(0,1fr);
/* ≤767 */  grid-template-columns: minmax(0,1fr);
```

Main column padding: `32px var(--docs-pad) 80px` (20px / 64px on phone).

Issue #18 asks for 320px. Keep 16px pad and 44px targets; do not shrink type below the token scale.

## Top bar

Sticky, `z-index: var(--lm-z-topbar)` (45). Background `--docs-bg`. Bottom edge: **2.5px dashed** `--docs-border` (ticket perforation). No second fill, no blur.

Order (keyboard and visual, LTR):

1. Skip link (`.lm-skip` from `base.css`)
2. Menu button (≤767 only)
3. Wordmark → `/ui/` (`home.html` in the mock)
4. Caveat “wheels up”
5. Version badge (from `package.json`; mock shows `v0.1.2`)
6. Search trigger
7. Theme Day / Night
8. GitHub → `https://github.com/pipa/luismatute-ui`
9. luismatute.me → `https://luismatute.me`

| Part | Spec |
| --- | --- |
| Wordmark name | Display 20px (`--lm-font-size-globe-title`), weight 800, stretch 75% |
| Slash | Mono 14px, muted |
| `UI` | Mono 14px, bold, uppercase, tracking 0.1em |
| Version | Pill, sand/night fill, 2px border, mono 12px, tracking 0.06em, min-height 28px, pad 0 10 |
| Search | Pill, elev fill, 2.5px border, `3px 3px 0` shadow, min-height 44, pad 0 12 0 14. Hover: marigold + ink text |
| ⌘K | 22px min-height, 2px border, radius 8, mono 10.5px. Non-Mac may show `Ctrl+K` |
| Ext links | Bold 13px, `--docs-link`, underline offset 3px, min-height 44. Hover: `--docs-hover` + `--docs-fg` |

Menu button: 44×44, radius 8, elev fill, 3px shadow, three 18×2 bars in `--docs-fg`. `aria-expanded`, `aria-controls="docs-nav"`.

## Sidebar

Groups: **Getting started**, **Tokens** (issue #18 “Foundations”), **Components**, **Illustrations**, **Changelog**.

| State | Spec |
| --- | --- |
| Group label | Mono 12px, uppercase, tracking 0.12em, `--docs-link`, margin 0 0 8 |
| Link | min-height 44, pad 0 10 0 12, radius 8, weight 600, 14px |
| Hover | `--docs-hover` |
| Current | `--docs-sunken` fill, `inset 4px 0 0 var(--docs-accent)`, weight 700, `aria-current="page"` |
| Focus | 3px `--docs-focus`, offset 3px |

Rail: cream/night, **2.5px dashed** right border. Pad 20 16 32. Sticky under the top bar. Height `100dvh - topbar`.

Phone drawer: `translateX(-100%)` → `0` in `--lm-duration-copy` / `--lm-ease-out`. Width `min(280px, 86vw)`. Backdrop `--docs-overlay`. Close 44×44 circle. Escape and backdrop click close. Focus trap while open. `aria-hidden="true"` when closed on phone. Restore focus to the menu button.

## On this page

≥1181: sticky aside, pad 24 16 32 0. Label: muted mono kicker. Links 13px, pad 6 0. Current: `inset 3px 0 0 marigold`, pad-left 10.

&lt;1181: native `<details>`/`<summary>` “On this page” (works without JS), 44px tall, radius 8, **dashed** 2.5px border, cream fill, 4px shadow. Panel hidden until open. `<summary>` keeps the shell focus ring and hides the default marker. Chevron rotates 45° → 225° via **transform only**.

## Component page

1. Kicker `Components · Card` — tomato-d / marigold, mono 12px uppercase.
2. Title `lm-card` — display `--lm-font-size-pass` (34–46), tomato text-shadow by Day (`--lm-shadow-text`). At Night, shadow colour is `--lm-night` (no glow).
3. One-line lede — `--lm-font-size-lead` (18–21), muted, 68ch.
4. Live demo frame.
5. Dotted flight-path `hr.docs-flight` — 2px dotted `--docs-rule`, width `min(68ch, 100%)`, margin 32 0.
6. Props table.
7. CSS-variables table + click-to-copy tokens.
8. Accessibility notes (callouts).
9. Code snippets.
10. Prev / next pager.

Headings are deep-linkable (`id` on the section or heading).

### Live demo

| Part | Spec |
| --- | --- |
| Frame | 1px ink/paper border (`--lm-border-hairline`), radius 12 (`--lm-radius-skip`), `--lm-shadow-card` (6px 7px 0). Night remaps shadow to paper. |
| Chrome | 48px min, sand/night, 2px bottom border, three 7px dots (marigold / paper / tomato) matching `lm-shot` |
| Label | Mono 10.5px uppercase tracking 0.06em |
| Toggles | Pills, 36px min, 2px ink border, white idle, marigold when `aria-pressed="true"` |
| Paper / Ink | Toggles `data-surface` on the stage. Stage pad 24. Paper = `--lm-paper`. Ink = `--lm-ink`. |
| Reduce motion | Sets a local still class on the stage. Does not have to write `lm.ui.motion` unless Pixel wants one control for the whole site. |

### Tables

Wrap: 2.5px border, radius 14, elev fill, horizontal scroll if needed. Th: sand/night, mono 12px uppercase, pad 10 12. Td: 14px, pad 10 12, dashed row rules. Last row: no rule. Code in cells: Plex Mono 13px.

### Pager

Two tickets. Min 220×44, pad 12 16, radius 14, 2.5px border, shot shadow. Next aligns end on ≥768. Kicker muted mono; title 14.5px bold.

## Code block (dark theme on both pages)

Issue #18: dark code matching the palette. Block fill is the dark code panel in both themes (`--lm-docs-c-bg`: `--lm-sky-night-2` by Day, `--lm-code-bg` at Night), so the block still reads as a separate ticket.

| Part | Spec |
| --- | --- |
| Radius | 14 |
| Border | 2.5px `--docs-border` |
| Shadow | `--lm-shadow-shot` / paper at Night |
| Caption | 44px, `--lm-hair-line` `#4b3428`, paper type, dashed sand bottom |
| Filename | Mono 12px uppercase tracking 0.06em |
| Pre | pad 16 18, 13px / 1.55 Plex Mono, paper text |

### Prism tokens (AA on ink and on night)

| Role | Token | Hex | on ink | on night |
| --- | --- | --- | --- | --- |
| Text | paper | `#fff6e4` | 15.40 | 17.46 |
| Comment | wheel | `#a39282` | 5.51 | 6.24 |
| Keyword | marigold | `#f6b43c` | 9.07 | 10.28 |
| String | leaf | `#62a64e` | 5.58 | 6.33 |
| Function | blush | `#f2a08a` | 8.01 | 9.08 |
| Number | stage | `#fbd682` | 11.85 | 13.44 |
| Tag | beacon | `#ff7a5c` | 6.45 | 7.32 |
| Attr | fold | `#d8901f` | 6.25 | 7.08 |
| Property | cockpit | `#5f97a6` | 5.09 | 5.77 |
| Punctuation | sand | `#f3e2c0` | 12.96 | 14.69 |
| Literal | route-cool | `#e8a090` | 7.77 | 8.81 |
| Class | globe-land | `#8cc06a` | 7.77 | 8.81 |

Do not use steel or tomato for code; they miss 4.5:1 on ink.

### Copy button (on the code caption)

Paper fill, paper border, ink text, radius 8, min 72×32, 13px semibold.

| State | Fill | Text | Border | Announce |
| --- | --- | --- | --- | --- |
| Idle | paper | ink / “Copy” | paper | — |
| Hover | marigold | ink / “Copy” | paper | — |
| Focus | idle + 3px paper/ink ring offset 3 | Copy | paper | — |
| Copied | stage `#fbd682` | ink / “Copied” | paper | `aria-live="polite"` → `Copied` |
| Error | sand | tomato-d / “Could not copy” | tomato-d | live → `Could not copy` |

Live region is visually hidden (`.docs-live`). One region per page. Reset the label after 1.6s (copied) or 2.2s (error).

## Click-to-copy tokens

Row of chips, gap 12.

| Part | Spec |
| --- | --- |
| Chip | min-height 44, pad 6 10, pill, 2px border, `3px 3px 0` shadow, elev fill |
| Swatch | 28×28, radius 8, 2px **ink** border (the real colour must show) |
| Name | Mono 13px bold |
| Value | Mono 10.5px muted |
| Hover | `--docs-hover` |
| Copied | marigold fill, ink text, live “Copied” |

Copy the **CSS variable** (`--lm-ink`), not only the hex.

## Search dialog (Pagefind)

`role="dialog"` `aria-modal="true"` labelled by a visually hidden heading. Overlay `--docs-overlay`. Panel: width `min(100%, 640px)`, max-height `min(72vh, 720px)`, radius 22, 3px border, `--lm-shadow-panel`, pad 16. Opens at 12vh from the top.

| Part | Spec |
| --- | --- |
| Input | 44px, radius 12, 2.5px border, elev fill |
| Close | 44×44 circle, close shadow |
| Hit | pad 12, radius 14. Title 14.5 bold. Excerpt 13 muted. Crumb mono 10.5 link colour |
| Keyboard highlight | `.is-active`: `--docs-hover` + 2px `--docs-border`. `aria-selected="true"` |
| Empty | Caveat 27px “no flights found”, muted 17px line under it |

Shortcut hint (⌘K on Apple platforms, Ctrl K elsewhere) shows only under `(hover: hover) and (pointer: fine)`, never by width. Without JS the search pill is hidden.

Keys: ⌘K / Ctrl+K toggle. Escape closes. ArrowUp/ArrowDown move highlight. Enter follows the active hit. Tab traps inside the panel. Restore focus to the search trigger.

Pixel: bind the input to Pagefind. The mock filters three static rows so the layout can be drawn.

## Focus, links, callouts, 404

**Focus:** 3px solid `--docs-focus`, offset 3px, on every control. Never `outline: none` without a replacement.

**Links:** `--docs-link`, bold, underline offset 3px. Hover: `--docs-hover` wash and `--docs-fg` text.

**Callouts** (note, warning, tip): max 68ch, pad 14 16, radius 14, 2.5px `--docs-border`, elev fill. Shadow `4px 4px 0` in the kind colour (not a glow):

| Kind | Day kind colour | Night kind colour | Label contrast |
| --- | --- | --- | --- |
| note | plum `#4a3570` | glass `#bfe6ee` | 9.61 / 12.42 |
| warning | tomato-d `#a8321e` | beacon `#ff7a5c` | 6.23 / 6.45 |
| tip | stitch `#16625e` | leaf `#62a64e` | 6.64 / 5.58 |

Label: mono 12px uppercase tracking 0.12em.

**404:** same chrome. Kicker “Gate closed”. Display `404`. Caveat “this flight was cancelled”. Lede + link `Back to /ui/`.

## Motion

Allowed transitions: `transform`, `opacity`. Durations from the package: `--lm-duration-copy` (0.28s) and `--lm-ease-out` for drawer and dialog. Hover lift on home cards: `translate(-2px, -2px)`. Pressed chrome may use the package press shadows (`translate(2px, 2px)`).

Under reduced motion, duration becomes 0.01ms.

## Keyboard order

Skip → (menu) → wordmark → search → Day → Night → GitHub → site → sidebar → (inline TOC) → main → (aside TOC) → pager. Open dialogs and the drawer take the next tab stop and trap until closed.

## Files

| File | Role |
| --- | --- |
| `mock/theme.js` | Mock-only theme boot (Light/Dark/Auto, superseded by `src/theme-init.ts`) |
| `mock/mock.css` | Shell |
| `mock/mock.js` | Toggle, drawer, search, copy, demo, shot query |
| `mock/index.html` | Component page |
| `mock/home.html` | Home |
| `mock/404.html` | 404 |

Head order is mandatory: `theme.js`, then `tokens.css`, `fonts.css`, `base.css`, `mock.css`. Body: `mock.js` then the components module.

Shot helpers: `?shot=search`, `?shot=search-empty`, `?shot=drawer`. Theme stills set `lm.ui.theme` before navigation so `theme.js` applies without a flash.

## A11y checklist

- [ ] WCAG 2.2 AA on every text and border pair listed above
- [ ] Visible focus on every control; no `outline: none` without a 3px ring
- [ ] 44×44 targets (`--lm-target`) for menu, search, theme, close, nav links, token chips
- [ ] Theme buttons use `aria-pressed`; the group is a `<fieldset>` with a visually hidden `<legend>`
- [ ] No `<select>`
- [ ] Skip link works
- [ ] Current page: `aria-current="page"` plus the marigold inset
- [ ] Drawer: `aria-expanded`, `aria-controls`, `aria-hidden` when closed on phone, focus trap, Escape
- [ ] Search: dialog name, focus trap, Escape, arrow highlight, `aria-selected`
- [ ] Copy + token copy announce through one polite live region
- [ ] Reduced motion: no transform travel
- [ ] Colour is not the only current-page cue (inset + weight)
- [ ] Saved Night never flashes Day (blocking `theme-init.js` before CSS)
- [ ] Base path `/ui/` on every in-site link in the real build

## Demo content

Mocks use generic content only, never a real biography.

- Stops: "Stop A" to "Stop E". Companies: "Example Co.", "Sample Studio". Years: 2015–2018, 2018–2021, 2021–now.
- Default globe route: US East Coast to Iberia.
- Stamp illustration label: "DESTINATION · ARRIVALS". The city part is a configurable attribute (suggested name: `city`), set in uppercase in the existing stamp type and colour. Only the text changes; the stamp geometry stays as it is.
