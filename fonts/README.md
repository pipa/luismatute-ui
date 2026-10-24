# Fonts

All faces are SIL OFL 1.1 (licences next to the files). Rebuild them from the upstream
sources with `python3 scripts/build-fonts.py` (needs `fonttools` and `brotli`). It downloads
the files from google/fonts at a pinned commit, sets the axis ranges below, and keeps
`U+0020-007E, U+00A0-017F, U+2010-2027, U+2030-203A, U+20AC, U+2190-2193, U+2122`.
`tests/fonts-coverage.test.ts` checks the cmaps.

| File | Upstream | Axes shipped |
|---|---|---|
| BricolageGrotesque-Display | Bricolage Grotesque [opsz,wdth,wght] | opsz 96, wght 600–800, wdth 75–100 |
| BricolageGrotesque-Text | Bricolage Grotesque [opsz,wdth,wght] | opsz 14, wdth 100, wght 400–700 |
| Caveat-SemiBold | Caveat [wght] | static, wght 600 |
| IBMPlexMono-Regular/Medium/SemiBold | IBM Plex Mono 2.3 | static |
| Anybody-var | Anybody [wdth,wght] | wdth 75–150, wght 500–900 |
| BigShouldersStencil-var | Big Shoulders Stencil [opsz,wght] | opsz 72, wght 600–900 |
| Fraunces-var / Fraunces-Italic-var | Fraunces [SOFT,WONK,opsz,wght] | SOFT 100, WONK 0, opsz 9–144, wght 300–800 |

These are the same pinned values as the v0.1 files, matched glyph by glyph, so ASCII text
renders the same as before.

Bricolage upstream has no circumflex or breve on C G S E O I. The build adds `Ĉĉ Ĝĝ Ŝŝ Ĕĕ Ŏŏ Ĭĭ`
as composites of the font's own base letter and combining mark. Each mark sits where the
font puts it on the matching A accent, at every axis location.

Latin Extended-A letters that upstream doesn't draw, so they still fall back:

- Bricolage (both): `¤ Ĥ ĥ Ĵ ĵ ĸ Ŀ ŀ ŉ Ţ ţ Ŧ ŧ ſ`
- Big Shoulders Stencil: `Ĳ ĳ ŉ ſ`
- Anybody, Fraunces (both): `ŉ ſ`
- Caveat: `ſ`

`ŉ` is deprecated in Unicode and `ſ` is archaic.
