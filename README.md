# @luismatute/ui

Design system for Luis Matute’s sites, extracted from the approved “Wheels up” page (`concept-c-takeoff.html` at `concept-c-v2`). Version 0.1.2.

Code is MIT. The self-hosted fonts stay under the SIL Open Font License; see `dist/fonts/OFL-*.txt`.

`dist/` is committed so a git install does not need a build. There is no `prepare` script: pnpm git installs skip dev dependencies, so a prepare build would fail.

```bash
pnpm add github:pipa/luismatute-ui#v0.1.2
```

## Use in Astro

Import the styles once in the layout. Each component subpath calls `defineLmX()` and `package.json` lists `./dist/components/*.js` in `sideEffects`, so a bare import registers that element:

```astro
<script>
  import '@luismatute/ui/components/card';
</script>
```

The recommended pattern is still the explicit call, which stays obvious in review and works even if a bundler is configured to drop side effects:

```astro
---
import '@luismatute/ui/tokens.css';
import '@luismatute/ui/fonts.css';
import '@luismatute/ui/base.css';
---
<html data-theme="sandals">
  <body>
    <lm-card variant="stop"><h2>Front-end developer, Sandals Resorts</h2></lm-card>
    <script>
      import { defineLmCard } from '@luismatute/ui/components/card';
      defineLmCard();
    </script>
  </body>
</html>
```

```astro
<script>
  import { defineLmUi } from '@luismatute/ui/components';
  defineLmUi();
</script>
```

## Use in HTML

The CSS files live under `dist/`. A plain `<link>` does not follow the package `exports` map, so point at `dist/` directly.

```html
<link rel="stylesheet" href="./node_modules/@luismatute/ui/dist/tokens.css" />
<link rel="stylesheet" href="./node_modules/@luismatute/ui/dist/fonts.css" />
<link rel="stylesheet" href="./node_modules/@luismatute/ui/dist/base.css" />
<script type="module">
  import { defineLmUi } from '@luismatute/ui/components';
  defineLmUi();
</script>
<lm-motion-toggle></lm-motion-toggle>
```

Import `@luismatute/ui` if you also want the token object and `inlineIllustration`. That root import does not register any element. Per-element entries (`@luismatute/ui/components/card`, and the rest) do: importing the module registers that element, and calling `defineLmCard()` (and the matching function for each element) does the same thing in a way a bundler will not drop.

## Theming

Set `data-theme` on any ancestor. Names are the scene ids from the source file: `hero`, `high`, `aa`, `sandals`, `bsc`, `fluky`, `move`, `booking`. Each theme sets the sky bands, sun, rays, title colour and, where the file has a sea, the sea bands.

Skin and beard follow `--lm-skin`, `--lm-skin-d`, `--lm-skin-blush`, `--lm-skin-hair`, `--lm-skin-fade`, `--lm-skin-beard`, `--lm-avatar-amber` (aliased as `--lm-skin-amber` so older overrides and the pilot’s glasses keep working), `--lm-skin-tort`, `--lm-skin-lip`, `--lm-beard-line`, `--lm-skin-highlight`, `--lm-lens-tint` and `--lm-lens-tint-opacity`.

`lm-motion-toggle` stores `calm` or `full` under `lm.ui.motion` and sets `data-motion` on `<html>`. “Just the info” is `calm`: the Info layout, with decorative motion off and the avatar idle left running. “Full flight” is `full`. The visible label switches between “Just the info” / “Full flight” (and the short “Info” / “Flight” labels below 640px). The control uses `data-pressed` for styling. `?motion=calm` and `?motion=info` select Info. `?motion=on` forces full motion, including when the OS prefers reduced motion. `?motion=reduce` and `?motion=off` are explicit off: illustrations rest and the avatar idle stops. A saved `reduce` from an older build is read as `calm`, because that value was the Info click. `writeMotionPreference('reduce')` stores `off`, which still reads back as explicit reduce. Every `defineLmX()` calls `applyMotionPreference()`, which follows the query, then the saved choice, then `prefers-reduced-motion`.

Illustration motion (rays, windmill, propeller, palm, windsock, and the rest of `.lm-art` except the avatar) runs only under `html[data-motion="full"]`. With JavaScript off, nothing sets that attribute, so server-rendered art rests on a neutral frame: palms and windsocks upright, windmill blades at 45°, sun rays at the full length they were drawn. `lm-avatar` is outside that gate. Its idle loop (blinks, glances, small poses) runs in Info (`calm`) and in Flight (`full`). It stops for `prefers-reduced-motion: reduce`, the pause control (`html.paused`), `data-motion="reduce"`, the `static` attribute, or `motion="off"` / `motion="reduce"` on the element. `motion="idle"` is the default when the attribute is omitted: the avatar ignores a layout-only `calm` state and still follows those stop conditions. The pause control stays available in Info so that idle loop can be stopped. Under `prefers-reduced-motion: reduce`, `base.css` pauses every animation and transition on the page unless the visitor has chosen `data-motion="full"`. In Info, that same pause applies to everything except `lm-avatar`.

`lm-avatar` and `lm-shot` can render without JavaScript. Put a static `<svg class="lm-art">` inside `<lm-avatar>` (a `<noscript>` wrapper is enough on the demo) and a framed `<a><img>` inside `<lm-shot>`. With JavaScript, the components upgrade that markup.

Illustration motion classes (`.wave`, `.flag`, `.spin`, `.tick`, and the rest) apply only under `:where(.lm-art)`, which `inlineIllustration` adds. The old class names still work on that art. The two-up shot grid accepts `.lm-shots--two` and the previous `.lm-shots.two`.

The globe route opens in a modal `<dialog>`. Put `lm-pause` and `lm-globe` in a normal-flow cluster (the demo uses `.lm-topbar-end`) so the pause control does not cover the mini globe.

Tailwind v4 can load the theme with `@import "@luismatute/ui/theme.css";`.

## Add a token

1. Add the value in `src/tokens/tokens.ts`.
2. If it is a new group, emit it from `src/tokens/render.ts` (`--lm-*` and, when it should be a Tailwind colour or font, the `@theme` line).
3. Use `var(--lm-…)` in `src/styles/base.css`. Do not add a raw colour, size or easing there.
4. `pnpm build` rewrites `dist/tokens.css`, `dist/theme.css` and `dist/tokens.json`.

## Illustrations

SVG files live in `dist/illustrations/`. `inlineIllustration(name, prefix)` from `@luismatute/ui/illustrations` returns the markup and prefixes clip-path ids. Fills use the token variables, so they follow `data-theme`.

Colours that the source mixes at draw time (`mix` / `dk`) stay as hex. They do not track later token overrides.

## Release

1. Bump `version` in `package.json`.
2. `pnpm build` and commit `dist/`.
3. Tag `vX.Y.Z` on that commit and push the tag.

Consumers install `github:pipa/luismatute-ui#vX.Y.Z`.

## Develop

Node 22 and pnpm 10.33.4. `pnpm install`, then `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build:docs`, `pnpm test:e2e`. The playground is `docs-dist/index.html` and the stop demo is `docs-dist/demo.html`. `pnpm test:e2e` runs the QA specs in Chromium, Firefox and WebKit against `docs-dist`. `pnpm visual` screenshots the demo and https://luismatute.me at 390 and 1280 and stays out of CI. The docs script is `build:docs` because `pnpm docs` is the package-homepage command.

`pnpm check` runs the whole local gate: lint, typecheck, unit tests, both builds, `check:site` (the `/ui` docs site in `site/`: types, tests, build, e2e) and `pnpm test:e2e`. GitHub Actions is off on this repo, so run it before asking for review.

### Stills

Design stills (render-look-fix screenshots) live outside the repo in `/workspace/team/luismatute/stills/<name>/`. The scripts in `design/ui-docs-build/` refuse to write inside the repo; the stills already committed under `design/ui-docs-build/stills*` stay as history.

### Ports (`E2E_PORT`)

Every Playwright config starts its own static server and never reuses one that is already running (`reuseExistingServer: false`), so a stray server on the port fails fast instead of serving the wrong files. `E2E_PORT` sets the port:

| Suite | Config | Default |
|---|---|---|
| `pnpm test:e2e` (QA) | `playwright.qa.config.ts` | 4173 |
| `pnpm visual` | `playwright.config.ts` | 4173 |
| `pnpm test:site:e2e` (docs site, also in `check:site`) | `site/playwright.config.ts` | 4174 |

The suites run one after another, so one `E2E_PORT` serves them all. The box is shared by Luis's bots, so use a port from your own range: Pixel 3100-3109, Kernel 3200-3209, Sentinel 3300-3309 (Eddie 3000s, Muse 3400s). For example `E2E_PORT=3104 pnpm check`.

Shipped components and illustration SVGs do not use inline `style` attributes. A few components still set transform origins through the CSSOM (`element.style`), which a strict `style-src-attr` policy allows. The docs pages still load with inline module scripts. `scripts/gen-illustrations.mjs` does not yet emit the hashed `lm-ix-*` motion classes; the files in `src/illustrations/` are the source of truth until that generator is extended.
