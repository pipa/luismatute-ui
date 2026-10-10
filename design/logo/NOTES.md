# Luis Matute logo

Six marks for luismatute.me. They share the Wheels up palette and the display face already in this repo. No new hues. The reference favicon in `reference/` is for the redraw only and is not shipped.

## Grid

Construction units are the SVG user units. Coordinates sit on a 2-unit grid unless a stroke offset forces a decimal. Strokes are one weight per mark. Peaks use a short miter so they do not grow horns. View boxes hug the ink, with a couple of units of pad, and do not include clear space. That way a favicon tile is the mark, not a mark floating in a margin.

1. **Shield** (`0 0 64 72`). Two filled polygons. The L is the left stem plus the whole pointed base, and the base’s right shoulder rises toward the M. The M is the upper-right mass: a diagonal left arm, a top that climbs to the right peak, and a notch that opens downward between the body and the right leg. Same two-piece construction as the 2016 favicon, with straight edges.
2. **Monoline** (`0 0 84 58`). Stroke 7, round cap, round join, matching the avatar line. L centerline `(12,10) (12,46) (28,46)`. M centerline `(36,46) (46,10) (56,30) (66,10) (76,46)`. Peak spacing is 10 so the valley stays open at 16px.
3. **Departure** (`6 -7 86 60`). Stem width 10. The foot is a constant-width bar (half-width 5) on centerline `(16,45)` to `(40,34)`, blunt at the end, not a taper. The M is an even stroke of width 9 on `(50,50) (58,10) (68,32) (78,10) (86,50)`. `favicon.svg` is the compact cut used at 16 and 32.
4. **Wordmark.** Outlines of Bricolage Grotesque 96pt ExtraBold (the display face: `fonts/BricolageGrotesque-Display.woff2`, wght 800, wdth 100). Word at scale 0.08, cap height 52.8. Extra pair kerning, in font units, on top of the font’s own kerning: Lu −8, ui −24, is −14, s/space −70, space/M −40, Ma −40, at −16, tu −36, ut −20, te −10. The space stays a word space. `favicon.svg` is LM at scale 0.12. The lockup is LM, a 2.5 unit tomato rule, then the name, at scale 0.07.
5. **Ligature** (`4 4 74 52`). Stem and shared foot are weight 12. The M is the same weight, centerline `(26,44) (36,10) (48,30) (60,10) (70,44)`, miter limited so the peaks sit with the stem. One foot, and the counter is as wide as the strokes.
6. **Crest** (`0 0 96 76`). Shield `M 4 4 H 92 V 30 L 48 72 L 4 30 Z`. L and M are cut out (`fill-rule="evenodd"`). The M is an even stroke of width 8 so the counters read at 180px. `favicon.svg` is the same shield with a bolder L only. The full M does not survive at 16px.

## Colour

From `src/tokens/tokens.ts`. There is no chalk token. Paper is the light ground.

- Ink `#2b1b14` on every mark.
- Paper `#fff6e4` for light grounds.
- Tomato `#e2492f` only as the rule in the wordmark lockup.

`mark-mono.svg` (and `lockup-mono.svg`) use `currentColor`. The comparison sheet’s dark ground is `#111412`, a review ground, not a logo colour.

## Clear space

One quarter of the ink height, on every side, measured from the ink. It is not baked into the view box.

## Minimum size

Long side of the ink.

- Shield, Monoline, Ligature: 16px. No separate cut.
- Departure: the full mark wants about 24px before the valley fills. Use `favicon.svg` at 16 and 32.
- Wordmark: about 120px wide. Use the LM favicon at 16 and 32.
- Crest: the full shield wants about 32px. Use `favicon.svg` (L only) at 16 and 32.

`favicon-16.png`, `favicon-32.png` and `mark-180.png` are square, transparent, and the mark’s long side is the named size.

## Recommendation

Use **05 Ligature**.

It is the one that still reads as L and M at 16px with no simplified cut, the counter stays open, and the weight is the same heavy flat ink as the Wheels up page. It works alone, and it locks up next to the name at cap height.

Keep **01 Shield** as the heritage redraw of the 2016 favicon. It is the right mark when the old site should still be recognisable. It is a worse everyday mark: the M’s notch is the first thing to disappear at 16px.

The other four are alternates, not recolours. Monoline is the avatar’s line, drawn as letters. Departure is the monoline idea with the foot lifting off. Wordmark is the name itself. Crest is a new shield with the letters cut out, and it needs the favicon cut below 32px.
