# Changelog

## 0.1.2

### Fixed

- Globe stage keeps `fill="none"` on the outer SVG and the stroked outline, so the route map is the map instead of a black disc (#2).
- `.lm-shot-frame` is `display: block`, so the border, radius, shadow and clip apply (#3).
- `prefers-reduced-motion: reduce` pauses CSS motion and the avatar loops when no motion toggle has set `data-motion`. `lm-avatar` and `lm-shot` include a no-JavaScript fallback (#4).
- Component subpaths register through explicit `defineLmX()` calls, and `package.json` `sideEffects` covers `./dist/components/*.js`. The package root no longer registers elements on import (#5).
- Pause and the mini globe share a wrapping top-bar cluster. The open route is a modal `<dialog>` (#6).
- Avatar beard, nose highlight and beach lenses use tokens. `--lm-skin-amber` remains as an alias of `--lm-avatar-amber`. The avatar keeps motion and pause listeners across a DOM move. Motion toggle and pause hosts no longer expose `aria-pressed` without a role. Flight plan upgrades a pre-upgrade `stops` property and keeps children when the JSON is invalid. Globe copy clears the close button, clip ids are unique per instance, and route geometry is built with `createElementNS` (#7).
- `lm-card` uses `--lm-font-size-copy` (and the portrait copy size) (#10).
- Portrait card, chip, pass, route and stage-title rules follow width under 560px or an aspect under 1.15. Motion-toggle labels still swap at 640px (#11).
- The More pill is no longer forced to the 44px target. A `::before` hit slop extends the click area (#12).
- Illustration animations are scoped under `:where(.lm-art)`. `.lm-shots--two` is the prefixed two-up grid; `.lm-shots.two` still works (#13).

### Notes

- The hot route leg fades in with an opacity animation (`lm-globe-reveal`) instead of a stroke-dashoffset draw, so motion stays on transform and opacity.
- `--lm-skin-highlight` defaults to `#e1ad84`, the nostril colour Luis signed off. Muse’s later `#e2a17a` swatch is not the painted default.
- Deferred: branch protection on `main` (needs a repo admin). Aligning `packageManager` to pnpm 12 and Node 24 (this repo, the lockfile and CI are pnpm 10.33.4 and Node 22).
- Docs pages still contain inline module scripts. Illustration `style` attributes are gone.
