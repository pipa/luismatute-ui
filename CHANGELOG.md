# Changelog

## 0.1.2

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
