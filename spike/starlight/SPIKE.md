# Spike: can Astro Starlight meet a hash-free CSP?

**Recommendation: custom Astro plus Pagefind.** Starlight 0.42.6 cannot meet issue #18's rule (no inline scripts, no `style` attributes, no `<style>` blocks, so `script-src 'self'; style-src 'self'` works with no hashes and no `'unsafe-inline'`) through supported configuration. A post-build rewriter can clear the static HTML, and search then works if `/ui/*` also allows `'wasm-unsafe-eval'`. That rewriter, plus theme overrides, is ongoing cost. A small custom Astro site has the same wasm requirement and none of the Starlight inlines.

`'wasm-unsafe-eval'` is a required allowance for search, on either route, because both use Pagefind 1.5.2. Scope it to `/ui/*` only. The rest of luismatute.me should not get it. Do not widen it to `'unsafe-eval'`. Policy (b) below does not include `'unsafe-eval'`, and search still works.

This spike does not change the package or `docs/`. The site is `spike/starlight/`.

## Versions

| Package | Version |
| --- | --- |
| astro | 7.3.8 |
| @astrojs/starlight | 0.42.6 |
| pagefind | 1.5.2 |
| playwright | 1.64.0 |

Browsers: Chromium (Chrome headless shell 156), Firefox 157, WebKit 27.2. Served at `http://127.0.0.1/.../ui/` with the CSP on the HTTP header, not a `<meta>` tag.

## What stock Starlight emits

Build: `SPIKE_VARIANT=stock`, `base: '/ui'`, Pagefind on, TOC on (`h2`–`h3`), Expressive Code copy buttons on (the default). Three HTML files: home, card, 404.

Scan of every emitted HTML file: **26 inline scripts, 0 `<style>` blocks, 240 `style` attributes.**

On the home page (a content page), 10 inline scripts and 134 style attributes:

| Inline item on a content page | Count | Where it comes from | Removed? |
| --- | --- | --- | --- |
| Classic theme-flash script (`window.StarlightThemeProvider = ...`) | 1 | `ThemeProvider.astro`, `is:inline`, on purpose to avoid a theme flash | Yes. Override loads `/ui/csp/theme-provider.js` as a blocking classic script |
| `StarlightThemeProvider.updatePickers()` | 2 | `ThemeSelect.astro`, `is:inline`, header and mobile menu | Yes. Dropped. The theme module calls `updatePickers` when it loads |
| Search shortcut script (`shortcut.style.display = ''`) | 1 | `Search.astro`, `is:inline`, so the Ctrl/⌘ hint does not flash | Yes. Post-build extracts it and switches the `<kbd>` from `style="display: none"` to the `hidden` attribute |
| Sidebar open-state script | 1 | `SidebarPersister.astro`, `is:inline`, before the sidebar tree | Yes. Post-build extracts it to a blocking classic script in the same place |
| Sidebar scroll-restore script | 1 | `SidebarPersister.astro`, second `is:inline` | Yes. Same post-build |
| ThemeSelect module body | 1 | Astro inlines JS chunks smaller than `assetsInlineLimit` (4kb) | Yes. `vite.build.assetsInlineLimit: 0` emits `<script type="module" src>` |
| LanguageSelect module body | 1 | Same inlining | Yes. Same setting |
| Sidebar pane module (`sl-sidebar-pane` / popover) | 1 | `PageFrame.astro`, same inlining | Yes. Same setting |
| Sidebar persist module | 1 | `Page.astro` script, same inlining | Yes. Same setting |
| Expressive Code token colors (`style="--0:#7FDBCA;--1:#8844AE"`) | 90 | Expressive Code's multi-theme highlighter. Each token span carries CSS variables. No option emits classes instead | Yes, only by a post-build that turns each declaration into a class in `/ui/_astro/csp/inline.css` |
| `--depth` on TOC items | 28 | `TableOfContentsList.astro` `define:vars`. Astro always prints `define:vars` as a `style` attribute | Yes. Same post-build |
| `--sl-icon-size` on icons | 12 | `Icon.astro` `define:vars` | Yes. Same post-build |
| `--sl-select-width: 6.25em` | 2 | `Select.astro` `style` attribute, header and mobile theme select | Yes. Same post-build |
| `display: none` on the search `<kbd>` | 1 | `Search.astro` | Yes. Becomes `hidden`, because a class would stay after the script cleared an inline style |
| `padding:0` on the search `<dialog>` | 1 | `Search.astro` | Yes. Same post-build class |
| `<style>` blocks | 0 | Bundled CSS was already over the 4kb auto-inline limit, and Expressive Code's `emitExternalStylesheet` default wrote `/_astro/ec.*.css` plus `/_astro/ec.*.js` for the copy button | Locked with `build.inlineStylesheets: 'never'` so a smaller sheet cannot regress |

Copy buttons were already an external module. The CSP problem with code blocks is the token `style` attributes, not the copy script.

`inlineStylesheets: 'never'` plus `assetsInlineLimit: 0` plus the two overrides, before the post-build: **7 inline scripts left (the `is:inline` ones), 0 style blocks, 240 style attributes.** After `node scripts/externalise.mjs dist-external`: **0, 0, 0** across all three HTML files.

## What does not meet the rule

| Attempt | Result | Cost |
| --- | --- | --- |
| `build.inlineStylesheets: 'never'` | Guarantees project CSS is a `<link>`. This fixture already had 0 `<style>` blocks under `'auto'` | None, other than an extra request for small sheets |
| `vite.build.assetsInlineLimit: 0` | Stops Astro from pasting small component modules into `<script type="module">` without `src` | One request per small module |
| ThemeProvider / ThemeSelect overrides | Removes the theme-flash script and the two `updatePickers()` scripts | An override to keep in sync with Starlight. The flash script is now a blocking extra request, so a slow network can still flash the wrong theme. The select icon updates when the module loads rather than during parse |
| Expressive Code options | No switch for class-based token colors. `expressiveCode: false` drops the copy button and falls through to Shiki, which also uses inline styles (Astro's own CSP docs say Shiki is incompatible) | Losing the copy button, or keeping the attributes |
| `security.csp` (Astro 7, tried as `SPIKE_VARIANT=csp` on the stock page) | Does not remove anything. The build warns that highlighting inline styles are incompatible. The home page meta policy has **12 `sha256-` script hashes** and **2 style hashes** (one is the empty-string hash). The HTML still has 26 inline scripts and 240 style attributes. Hashes are what issue #18 says not to do | Hash churn on every Starlight upgrade, and style attributes are still blocked by a hash-free `style-src` |
| Post-build rewriter | Clears every remaining inline script and style attribute in this fixture | A build step we own. It must keep sidebar scripts parser-blocking (not `type="module"`). It must be re-run on every build. A future Starlight inline that sets `element.style` expecting to override a class will break if we only move the attribute |

## Browser results

Policies, on the HTTP header:

- (a) `script-src 'self'; style-src 'self'`
- (b) `script-src 'self' 'wasm-unsafe-eval'; style-src 'self'`

The page under test is the externalised Starlight build (overrides + `inlineStylesheets: 'never'` + `assetsInlineLimit: 0` + post-build). Static HTML has no inline scripts, no style attributes, and no style blocks. Theme (light and dark), the TOC link to `#install`, and the Expressive Code copy button (copied feedback) worked on all three engines under both policies.

Search is the difference. The Pagefind field opens under both policies. Results come back only under (b).

| Build | Policy | Chromium messages | Firefox messages | WebKit messages | Search |
| --- | --- | --- | --- | --- | --- |
| Starlight, externalised | (a) no wasm | 5 | 3 | 7 | No. 0 hits |
| Starlight, externalised | (b) `'wasm-unsafe-eval'` | 0 | 0 | 2 | Yes. 3 hits for `boarding-pass-demo` |
| Custom Astro + Pagefind | (a) | 5 | 3 | 6 | No. 0 hits |
| Custom Astro + Pagefind | (b) | 0 | 0 | 1 | Yes. 2 hits for `sandals-stop-card` |

The wasm messages are repeated attempts of one failure: `WebAssembly.instantiate` / `WebAssembly.Module` inside Pagefind (`pagefind/wasm.*.pagefind`, then `instantiate`). Chromium's text says `'unsafe-eval'` is missing. Allowing `'wasm-unsafe-eval'` and not `'unsafe-eval'` cleared them, and search returned hits. Firefox logged 3 of the same compile error. WebKit logged the compile error plus a couple of unhandled-rejection wrappers around it.

WebKit's leftover messages are not Starlight and not Pagefind. A fixture that is only `<select>` plus `style-src 'self'` logs one "Refused to apply a stylesheet" error per `<select>`. Starlight renders two theme selects (header and mobile), so 2. The custom page has one theme select, so 1. The select still changes `data-theme`. Removing it means replacing the native select. It happens under both policies.

No `worker-src` violation. Pagefind 1.5.2 does `new Worker(sameOrigin + 'pagefind-worker.js')`, which `'self'` covers. This build did not need `blob:`.

Pagefind's UI also assigns `element.style.paddingRight` while measuring the search field, and the Expressive Code copy fallback assigns `element.style` if `navigator.clipboard` throws. In these three engines, a CSSOM write from an external script was **not** reported as a `style-src` violation (checked with a same-origin script that sets `document.body.style`). Copy used the clipboard path here, including a manual Chromium recheck on the custom page that read `boarding-pass-demo` back from the clipboard. The automated Chromium custom check raced the async write and recorded a false miss; Firefox and WebKit recorded the feedback in that run.

## Custom Astro is the same wasm story

`spike/starlight/custom-site/` is Astro 7.3.8 with no Starlight, `inlineStylesheets: 'never'`, `assetsInlineLimit: 0`, Prism for one sample code page (class names such as `token tag`, zero style attributes), and Pagefind's default UI loaded with `<script src>`. Scan: **0 inline scripts, 0 style blocks, 0 style attributes** on 3 HTML files.

Policy (a) fails search the same way. Policy (b) returns hits. Same engine, same allowance.

## Exact config

Starlight spike (`spike/starlight/astro.config.mjs`). The served build is `SPIKE_VARIANT=external`, then `node scripts/externalise.mjs dist-external`.

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

const variant = process.env.SPIKE_VARIANT ?? 'stock';
const externalise = variant === 'external';

/** @type {import('@astrojs/starlight').StarlightUserConfig['components']} */
const externalComponents = {
  ThemeProvider: './src/components/ThemeProvider.astro',
  ThemeSelect: './src/components/ThemeSelect.astro',
};

export default defineConfig({
  site: 'https://luismatute.me',
  base: '/ui',
  outDir: `./dist-${variant}`,
  build: {
    inlineStylesheets: externalise ? 'never' : 'auto',
  },
  vite: {
    build: {
      assetsInlineLimit: externalise ? 0 : 4096,
    },
  },
  security:
    variant === 'csp'
      ? {
          csp: {
            scriptDirective: {
              resources: ["'self'", "'wasm-unsafe-eval'"],
            },
            styleDirective: {
              resources: ["'self'"],
            },
          },
        }
      : undefined,
  integrations: [
    starlight({
      title: 'CSP spike',
      description: 'Minimal Starlight site for the inline-script CSP investigation.',
      pagefind: true,
      tableOfContents: { minHeadingLevel: 2, maxHeadingLevel: 3 },
      expressiveCode: true,
      components: externalise ? externalComponents : {},
    }),
  ],
});
```

`SPIKE_VARIANT=csp` is the hashing attempt only. It was not what we served to the browsers.

Custom site (`spike/starlight/astro.custom.mjs`), then `pagefind --site dist-custom`:

```js
import { defineConfig } from 'astro/config';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('./custom-site/', import.meta.url));

export default defineConfig({
  site: 'https://luismatute.me',
  base: '/ui',
  root,
  srcDir: fileURLToPath(new URL('./custom-site/src/', import.meta.url)),
  publicDir: fileURLToPath(new URL('./custom-site/public/', import.meta.url)),
  outDir: fileURLToPath(new URL('./dist-custom/', import.meta.url)),
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
  markdown: {
    syntaxHighlight: 'prism',
  },
});
```

Header to send for `/ui/*` only:

```
Content-Security-Policy: script-src 'self' 'wasm-unsafe-eval'; style-src 'self'
```

Footgun: with `base: '/ui'`, Astro 7.3.8 sets `import.meta.env.BASE_URL` to `/ui` with no trailing slash. Concatenating `csp/theme-provider.js` produced `/uicsp/theme-provider.js`. The override inserts the slash. `<script src={expression}>` in an Astro template is also bundled into an empty module. External scripts in the custom layout use `is:inline` and a literal `src="/ui/..."`.

## Recommendation

Build the docs as custom Astro plus Pagefind, not as Starlight with overrides.

Starlight's theme flash, search shortcut, and sidebar restore are inline on purpose. Expressive Code's dual theme is a `style` attribute per token. `define:vars` for icons and the TOC is a `style` attribute per element. Astro will also inline small scripts unless `assetsInlineLimit` is 0. Overrides cover two of the scripts. Everything else needs a rewriter we would maintain, and WebKit will still log a style-src error for each theme `<select>`. Astro's CSP hashing leaves the inline markup in place, which is the thing issue #18 forbids.

Custom Astro can ship external CSS, external scripts, a class-based highlighter (Prism, or our own), a copy button that uses the clipboard and the `hidden` attribute, and a theme script that only sets `data-theme`. Pagefind still needs `'wasm-unsafe-eval'` on `/ui/*`, and a native `<select>` still makes WebKit log one style-src error. That is the whole allowance. It is the same wasm cost as Starlight, without the overrides or the rewriter.
