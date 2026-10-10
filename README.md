# @luismatute/ui

Design system for Luis Matute’s sites, extracted from the approved “Wheels up” page (`concept-c-takeoff.html` at `concept-c-v2`). Version 0.1.0.

Code is MIT. The self-hosted fonts stay under the SIL Open Font License; see `dist/fonts/OFL-*.txt`.

`dist/` is committed so a git install does not need a build. There is no `prepare` script: pnpm git installs skip dev dependencies, so a prepare build would fail.

```bash
pnpm add github:pipa/luismatute-ui#v0.1.0
```

## Use in Astro

Import the styles once in the layout. Register the elements in a client script. No runtime dependencies.

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
      import '@luismatute/ui/components';
    </script>
  </body>
</html>
```

## Use in HTML

```html
<link rel="stylesheet" href="./node_modules/@luismatute/ui/tokens.css" />
<link rel="stylesheet" href="./node_modules/@luismatute/ui/fonts.css" />
<link rel="stylesheet" href="./node_modules/@luismatute/ui/base.css" />
<script type="module">
  import '@luismatute/ui/components';
</script>
<lm-motion-toggle></lm-motion-toggle>
```

Import `@luismatute/ui` if you also want the token object and `inlineIllustration`. Per-element entries (`@luismatute/ui/components/card`, and the rest) register that element only.

## Theming

Set `data-theme` on any ancestor. Names are the scene ids from the source file: `hero`, `high`, `aa`, `sandals`, `bsc`, `fluky`, `move`, `booking`. Each theme sets the sky bands, sun, rays, title colour and, where the file has a sea, the sea bands.

Skin and beard follow `--lm-skin`, `--lm-skin-d`, `--lm-skin-blush`, `--lm-skin-hair`, `--lm-skin-fade`, `--lm-skin-beard`, `--lm-skin-amber`, `--lm-skin-tort`, `--lm-skin-lip`.

`lm-motion-toggle` stores `reduce` or `full` under `lm.ui.motion`, sets `data-motion` on `<html>`, and follows `prefers-reduced-motion`. `?motion=reduce` forces the still page. `?motion=on` forces motion.

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

Node 22. `pnpm install`, then `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm build:docs`. The playground is `docs-dist/index.html` and the stop demo is `docs-dist/demo.html`. `pnpm visual` screenshots the demo and https://luismatute.me at 390 and 1280 (Playwright is not part of CI). The docs script is `build:docs` because `pnpm docs` is the package-homepage command.
