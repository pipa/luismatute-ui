# Luis Matute logo

Marks for luismatute.me. They share the Wheels up palette and the display face already in this repo. No new hues. The reference favicon in `reference/` is for the redraw only and is not shipped.

**01 Shield** is the mark. The others are alternates.

## Grid

Construction units are the SVG user units of the 2016 favicon, a 48×48 grid. The shield is two open strokes of one weight. View boxes hug the ink, with a little pad, and do not include clear space. A favicon tile is the mark, not a mark floating in a margin.

1. **Shield** (`01-shield`). Two filled ribbons, weight 6.6. The width is the offset between the rails, so along both strokes it stays within 3% of 6.6 (the body measures within 1%). The L is the left side: it curves down into the bottom point and turns up a short way. The M is the chevron: the left arm starts lower, dips to a V, rises to the top-right corner, then curves down the right side and stops short of the L. The counter is one open shield-shaped space.

   The upturn and the right arm end on parallel chamfers, both at 36° to the horizontal. The gap between those two faces is 0.6 × the stroke, 3.96 units. The top-left terminal and the peak facet are the same angle, 22°. The inner arm starts on a square end.

   Centerlines, before the end trim:

   - L: `(7.2, 6.2)` curve to `(21.2, 42.2)`, line through `(23.4, 43.0)` to `(27.2, 39.2)`, curve to `(30.6, 33.6)`.
   - M: `(15.0, 11.6)` curve to `(23.6, 20.2)`, line to `(25.4, 21.4)` to `(31.2, 15.6)`, curve to `(40.2, 5.6)`, line to `(41.2, 4.6)` to `(40.4, 12)`, curve to `(35.2, 33.2)`.

   `favicon.svg` is the same drawing at weight 8.15, with its own gap of 0.6 × 8.15 = 4.89 so the opening survives at 16px. Use it at 16 and 32. `mark.svg` is the 6.6 weight, for 180 and up.

2. **Shield line** (`01b-shield-monoline`). The same centerlines as one stroke. Round cap, round join, stroke 3.5. That is the avatar’s line weight: option 02 is stroke 7 on an 84-wide view box, and 3.5 / 42 matches 7 / 84.

3. **Monoline** (`02-monoline`, `0 0 84 58`). Stroke 7, round cap, round join. L centerline `(12,10) (12,46) (28,46)`. M centerline `(36,46) (46,10) (56,30) (66,10) (76,46)`.

4. **Departure** (`03-departure`). Stem width 10. The foot is a constant-width bar at 12°, from `(15, 44)` along 28 units. The M is an even stroke of width 9. `favicon.svg` drops the lift: the foot is horizontal, so 16px reads as an L and an M.

5. **Wordmark.** Outlines of Bricolage Grotesque 96pt ExtraBold (`fonts/BricolageGrotesque-Display.woff2`, wght 800, wdth 100). Word at scale 0.08, cap height 52.8. Extra pair kerning, in font units, on top of the font’s own kerning: Lu −8, ui −24, is −14, s/space −70, space/M −40, Ma −40, at −16, tu −36, ut −20, te −10. `favicon.svg` is LM at scale 0.12.

6. **Stamp** (`05-stamp`). The shield inside a double ring. “LUIS MATUTE” follows the top of the ring and “AMS” sits at the bottom. The letters are Martian Mono (wght 580, wdth 100) converted to outlines, including the A, so the ring does not depend on a live font. Spacing is the mono advance, one slot per letter, with the word space as one empty slot. The type is a tool for the stamp, not a new brand colour. `favicon.svg` is the shield alone, the same bolder cut as 01.

7. **Tomato** (`06-shield-tomato`). The shield from 01. The M is tomato `#e2492f`, the L is ink. `mark-mono.svg` is the whole mark in one colour.

## Lockup

The mark’s ink height is the wordmark’s cap height times 1.4. Cap height in the lockup is 40.92 (Bricolage at scale 0.062). The mark’s centroid sits on the cap centre, y = −20.46, so a pointed shield is not stood on the baseline. The gap before the name is 15 units.

The wordmark lockup is LM at that same height, a tomato rule 2.2 units wide, then the name. 01’s lockup is the one to use.

## Colour

From `src/tokens/tokens.ts`. There is no chalk token. Paper is the light ground.

- Ink `#2b1b14` on every mark.
- Paper `#fff6e4` for light grounds.
- Tomato `#e2492f` on the wordmark rule, and on the M of option 06.

`mark-mono.svg` and `lockup-mono.svg` use `currentColor`. The comparison sheet’s dark ground is `#111412`, a review ground, not a logo colour.

## Clear space

One quarter of the ink height, on every side, measured from the ink. It is not baked into the view box.

## Minimum size

Long side of the ink.

- Shield: 16px, using `favicon.svg`.
- Shield line, Monoline: 16px. No separate cut.
- Departure: the full mark wants about 24px before the valley fills. Use `favicon.svg` at 16 and 32.
- Wordmark: about 120px wide. Use the LM favicon at 16 and 32.
- Stamp: about 180px before the ring type holds. Use the shield favicon at 16 and 32.
- Tomato: 16px, using `favicon.svg`. The tomato M is still readable there.

`favicon-16.png`, `favicon-32.png` and `mark-180.png` are square, transparent, and the mark’s long side is the named size.

## Recommendation

Use **01 Shield**.

It is the 2016 favicon redrawn as what it actually is: an open shield of two even strokes. The ends are parallel chamfers with a gap of 0.6 × the stroke, and the two top terminals share one angle. It reads at 16px on the bolder cut, and it locks up next to the name at 1.4× the cap. This is the mark Luis is most likely to pick.

Keep **01b Shield line** as the bridge to the avatar stroke, and **06 Tomato** when the M should carry the tomato. Monoline, Departure, Wordmark, and the Stamp are the other alternates. The stamp is for the social card, not for the favicon.
