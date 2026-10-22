# Changelog

## 0.2.2 - 2026-10-22

### Added

- **Seat-line motion tokens** for the boarding-pass seat-line draw (luismatute.me #12, #70): `--lm-dur-seat-line` (`1.45s`), `--lm-dur-seat-line-delay` (`0.15s`), `--lm-ease-seat-line` (`cubic-bezier(0.5, 0.06, 0.24, 1)`). They replace the site's `--seat-line-*` bridge tokens and are listed on Foundations → Motion tokens.

## 0.2.1 - 2026-10-15

### Added

- Shared `lm-mode` cookie (`day`, `night` or `auto`, `Domain=.luismatute.me`), so the day/night choice carries across subdomains. `theme-init` reads `?mode=`, then the cookie, then storage, then `prefers-color-scheme`; bad values fall through (#26).

## 0.2.0 - 2026-10-13

### Added (blog Direction B, luismatute.me #55/#56; shared with the main site)

- **Night tokens.** `html[data-mode="night"]` overrides the same names (`--lm-paper`, `--lm-card`, `--lm-sand`, `--lm-ink`, `--lm-ink-soft`, `--lm-tomato-d`, `--lm-white`, `--lm-link`, `--lm-lagoon`, `--lm-rule-route`, `--lm-shadow-ink`, `--lm-sky-text`, `--lm-pill-*`), so components don't branch. Theme-stable: `--lm-ink-fixed`, `--lm-sky-day-1..4`, `--lm-sky-night-1..4`, `--lm-moon`, `--lm-star`, `--lm-dune-day/night`, `--lm-tag-paper/ink`.
- **Code tokens** `--lm-code-{bg,text,keyword,string,function,tag,attr,number,comment,punct}`: the blog's shipped day theme and the dark-sand night theme from CONTRAST.md. Night tag `#f2a7d6`, attr `#f6c66b` and number `#c9dc7a` were not in CONTRAST.md; all clear 4.5:1 on `#33261c` (unit tested).
- **Motion tokens**, all in `src/tokens/tokens.ts`: `--lm-ease-glide`, `--lm-dur-{fast,pop,fade,theme,glare,glare-delay,twinkle-1..3}`, `--lm-sky-{far,mid,near}`.
- **`lm-theme-toggle`** (`./components/theme-toggle`): 44px icon pill, `aria-label="Night"` + `aria-pressed`, stores `lm.ui.theme`, dispatches `lm-theme`, View Transitions unless reduced motion. `theme.ts` exports `readTheme`, `setTheme`, `applyTheme`, `THEME_KEY`.
- **`theme-init.js`**: the blocking no-flash head script (`?mode=`, `lm.ui.theme`, `prefers-color-scheme`). Serve it as an external file for `script-src 'self'`.
- **`lm-sky-header`** (`./components/sky-header`): M1 Cruise sky (bands, stars, sun/moon, three cloud strips, dunes). Off-screen pause via IntersectionObserver (`.lm-sky-off`), `button.lm-sky-pause` follows the `lm-pause` contract (`html.paused`, `lm-pause` event, "Pause sky"/"Play sky"), `compact` is the still post strip. `skyLayersHtml()` and `landEdge` server-render the layers; import them from the DOM-free `@luismatute/ui/sky-art` subpath in SSR (Astro).
- **`sky.css`**: sky header, pills, porthole stills, ticket-stub card (`.lm-stubs`, `.lm-ticket`), porthole cover (`.lm-cover`), F1 Wheels down footer (`.lm-land`, `landEdge`). Only transform and opacity animate; everything is static under `prefers-reduced-motion`.

## 0.1.2 - 2026-10-11

### Fixed

- Globe stage keeps `fill="none"` on the outer SVG and the stroked outline, so the route map is the map instead of a black disc (#2).
- `.lm-shot-frame` is `display: block`, so the border, radius, shadow and clip apply (#3).
- Illustration motion runs only when `html[data-motion="full"]` is set, and every `defineLmX()` calls `applyMotionPreference()`. That gate does not cover `lm-avatar`. Idle blinks, glances and small poses keep running in Info (`data-motion="calm"`) and in Flight. They stop for `prefers-reduced-motion`, the pause control, or an explicit reduce/off choice (`?motion=reduce`, `?motion=off`, `motion="off"`, or `motion="reduce"`). `motion="idle"` is the default. A saved `lm.ui.motion` value of `reduce` from an older build is read as Info. With JavaScript off, server-rendered art rests: palms and windsocks upright, windmill blades at 45°, sun rays at full length. `lm-avatar` and `lm-shot` include a no-JavaScript fallback (#4).
- Component subpaths register through explicit `defineLmX()` calls, and `package.json` `sideEffects` covers `./dist/components/*.js`. The package root no longer registers elements on import (#5).
- Pause and the mini globe share a wrapping top-bar cluster. The open route is a modal `<dialog>` (#6).
- Avatar beard, nose highlight and beach lenses use tokens. `--lm-skin-amber` remains as an alias of `--lm-avatar-amber`. The avatar keeps motion and pause listeners across a DOM move. Motion toggle and pause hosts no longer expose `aria-pressed` without a role. Flight plan upgrades a pre-upgrade `stops` property and keeps children when the JSON is invalid. Globe copy clears the close button, clip ids are unique per instance, and route geometry is built with `createElementNS` (#7).
- `lm-card` uses `--lm-font-size-copy` (and the portrait copy size) (#10).
- Portrait card, chip, pass, route and stage-title rules follow width under 560px or an aspect under 1.15. Motion-toggle labels still swap at 640px (#11).
- The More pill stays about 33px tall. Its `::before` hit slop reaches at least 44px without growing the pill (#12).
- Illustration animations are scoped under `:where(.lm-art)`. `.lm-shots--two` is the prefixed two-up grid; `.lm-shots.two` still works (#13).

### Notes

- The hot route leg fades in with an opacity animation (`lm-globe-reveal`) instead of a stroke-dashoffset draw, so motion stays on transform and opacity.
- `--lm-skin-highlight` defaults to `#e1ad84`, the nostril colour Luis signed off. Muse’s later `#e2a17a` swatch is not the painted default.
- `scripts/gen-illustrations.mjs` hoists `style` attributes onto `lm-ix-*` classes, so a later regen does not put inline styles back. Branch protection on `main`, and aligning `packageManager` to pnpm 12 and Node 24, stay deferred (#20).
- Docs pages still contain inline module scripts. Illustration `style` attributes are gone.
