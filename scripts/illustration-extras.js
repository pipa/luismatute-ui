function controlTower() {
  return `${rect(-16, -170, 32, 170, C.cream, ol(4))}${rect(-16, -120, 32, 8, C.tomato)}${rect(-16, -120, 32, 8, 'none', ol(3))}${path('M-34 -170L34 -170L26 -214L-26 -214Z', C.tomato, ol(4))}${rect(-24, -206, 48, 22, '#2d5560', ol(3))}${line('M-8 -206V-184M8 -206V-184', C.cream, 2)}${rect(-30, -224, 60, 10, '#eadfc8', ol(3.5))}${line('M0 -224V-252', INK, 3)}${anim('bcn', circ(0, -254, 5, '#ff3b2b', ol(2)))}`;
}
function hangar() {
  return `${path('M0 0L0 -60Q90 -130 180 -60L180 0Z', C.lagoon, ol(4))}${path('M20 -76Q90 -118 160 -76', 'none', ol(3, '#16625e'))}${rect(18, -46, 144, 46, '#2d5560', ol(3))}${line('M54 -46V0M90 -46V0M126 -46V0', '#204a54', 3)}`;
}
function windsock() {
  return `${line('M0 0V-110', INK, 4)}${anim('sway', `${path('M2 -108L58 -100L58 -84L2 -78Z', C.tomato, ol(3))}${rect(20, -104, 12, 22, C.cream)}`, 'transform-origin:2px -94px;--t:1.2s;--a:-6deg;--b:5deg')}`;
}
function nightTower() {
  return `<g class="beam" style="transform-origin:0px -118px">${path('M0 -118L330 -168L330 -64Z', '#fff1cf', ' opacity=".2"')}</g>${path('M-70 6Q-60 -20 -30 -24Q-6 -34 22 -26Q58 -20 74 6Z', '#1b1640', ol(3, '#120d2c'))}${poly(
    [
      [-20, -22],
      [20, -22],
      [13, -104],
      [-13, -104],
    ],
    '#fff1df',
    ol(3, '#120d2c'),
  )}${poly(
    [
      [-18.4, -40],
      [18.4, -40],
      [16.8, -58],
      [-16.8, -58],
    ],
    C.tomato,
  )}${poly(
    [
      [-15.2, -76],
      [15.2, -76],
      [13.7, -94],
      [-13.7, -94],
    ],
    C.tomato,
  )}${rr(-19, -110, 38, 8, 3, '#2a2450', ol(2.5, '#120d2c'))}${rect(-11, -130, 22, 20, '#ffd36b', ol(2.5, '#120d2c'))}${path('M-15 -130L0 -146L15 -130Z', C.tomato, ol(2.5, '#120d2c'))}${anim('tw', circ(0, -120, 22, '#ffd36b', ' opacity=".28"'), '--t:1.8s')}`;
}
function gullMark() {
  return `<g class="flap">${line('M-12 0Q-6 -7 0 0Q6 -7 12 0', INK, 2.6)}</g>`;
}
function sunMark() {
  return sunDisc(0, 0, 48, 'var(--lm-sun)', [
    'var(--lm-sun-2)',
    'var(--lm-sun-3)',
  ]);
}
function raysMark() {
  const R = 100;
  const n = 16;
  let d = '';
  for (let i = 0; i < n; i++) {
    const a0 = (i / n) * Math.PI * 2;
    const a1 = a0 + Math.PI / n;
    d += `M0 0L${N(Math.cos(a0) * R)} ${N(Math.sin(a0) * R)}L${N(Math.cos(a1) * R)} ${N(Math.sin(a1) * R)}Z`;
  }
  return `<g class="rays"><path d="${d}" fill="var(--lm-rays)" opacity="0.2"/></g>`;
}
function skyMark() {
  const cols = [1, 2, 3, 4, 5, 6, 7, 8].map((i) => `var(--lm-sky-${i})`);
  return bands(0, 1200, 0, 640, cols, 0.72);
}
function seaMark() {
  const cols = [1, 2, 3, 4].map((i) => `var(--lm-sea-${i})`);
  return (
    bands(0, 1200, 0, 420, cols, 1.3) + rect(0, 0, 1200, 3, 'var(--lm-foam)')
  );
}
function wavesMark() {
  const W = 1200;
  const Hs = 280;
  const U = 1;
  const swell = (y0, per, amp, fill, seed) => {
    let d = `M${N(-per)} ${N(Hs + 40)}L${N(-per)} ${N(y0)}`;
    let fm = '';
    const n = 3;
    for (let x = -per, i = 0; x < W + 2 * per; x += per / n, i++) {
      const p = per / n;
      const a = amp * [1, 0.78, 0.9][(i + seed) % n];
      const cx = x + p * 0.6;
      d += `C${N(x + p * 0.24)} ${N(y0)} ${N(x + p * 0.38)} ${N(y0 - a)} ${N(cx)} ${N(y0 - a)}C${N(x + p * 0.74)} ${N(y0 - a)} ${N(x + p * 0.8)} ${N(y0 - a * 0.3)} ${N(x + p)} ${N(y0)}`;
      fm += line(
        `M${N(x + p * 0.4)} ${N(y0 - a * 0.6)}Q${N(x + p * 0.47)} ${N(y0 - a * 0.93)} ${N(cx)} ${N(y0 - a * 0.94)}`,
        '#fffaf0',
        N(Math.max(3, 4.5 * U)),
      );
      fm +=
        circ(x + p * 0.8, y0 - a * 0.12, Math.max(2.4, 3.6 * U), '#fffaf0') +
        circ(
          x + p * 0.9,
          y0 + a * 0.18,
          Math.max(1.8, 2.6 * U),
          '#fffaf0',
          ' opacity=".8"',
        );
    }
    d += `L${N(W + 2 * per)} ${N(Hs + 40)}Z`;
    return path(d, fill, ol(3.5)) + fm;
  };
  const per = 420;
  return (
    swell(150, per * 0.8, 16, 'var(--lm-sea-3)', 1) +
    swell(200, per, 22, 'var(--lm-sea-4)', 0)
  );
}
function houseMark() {
  const h = house(24, 300, 160, 250, 'neck', C.cream);
  return `${h.fill}<path d="${h.line}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`;
}

/** Approved v0.1.2 portrait. Overrides the pre-#8 `luisSVG` from the page.
 *  SVGO is not run on this markup: `removeHiddenElems` would drop the
 *  `opacity="0"` wave arm and beach shades.
 */
function luisSVG(id) {
  const inner = "<defs><clipPath id=\"__id__lw__id__\"><rect width=\"152\" height=\"192\" x=\"24\" y=\"24\" rx=\"70\"/></clipPath></defs><rect width=\"184\" height=\"224\" x=\"15\" y=\"18\" fill=\"var(--lm-porthole)\" rx=\"88\"/><rect width=\"184\" height=\"224\" x=\"8\" y=\"8\" fill=\"var(--lm-cream)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"5\" rx=\"88\"/><rect width=\"166\" height=\"206\" x=\"17\" y=\"17\" fill=\"var(--lm-frame)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" rx=\"79\"/><g clip-path=\"url(#__id__lw__id__)\"><rect width=\"200\" height=\"240\" fill=\"var(--lm-cabin)\"/><rect width=\"200\" height=\"4\" y=\"150\" fill=\"var(--lm-rail)\"/><g class=\"lu-seat\"><path fill=\"var(--lm-lagoon)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m42 240 3-128q3-40 55-44 52 4 55 44l3 128Z\"/><rect width=\"60\" height=\"34\" x=\"70\" y=\"79\" fill=\"var(--lm-cream)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" rx=\"14\"/><path stroke=\"var(--lm-stitch)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M58 150h84\"/></g><g class=\"lu-torso\"><path fill=\"var(--lm-marigold)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M24 240q2-36 38-46 20-6 38-5 18-1 38 5 36 10 38 46Z\"/><path fill=\"var(--lm-cream)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M84 190q16 24 32 0Z\"/><path fill=\"var(--lm-fold)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"m81 189 15 35-28-19Z\"/><path fill=\"var(--lm-fold)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"m119 189-15 35 28-19Z\"/><circle cx=\"100\" cy=\"232\" r=\"2.6\" fill=\"var(--lm-ink)\"/><g class=\"lu-wave\" opacity=\"0\"><path fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M151.3 172L157 103A6 6 0 0 1 169 103L166.8 172Z\"/><path fill=\"var(--lm-marigold)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M141 212C143 196 145 180 147.5 165Q159 161 170.5 166C171.5 182 173 199 175 214L153 224Z\"/><g class=\"lu-hand\"><path class=\"lu-finger\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M156.3 90.4L151.9 74A2.7 2.7 0 0 0 146.7 75.4L151.1 91.8Z\"/><path class=\"lu-finger\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M160.7 89L157.3 69.3A2.7 2.7 0 0 0 151.9 70.3L155.4 90Z\"/><path class=\"lu-finger\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M165.4 88.6L163.8 69.7A2.7 2.7 0 0 0 158.4 70.2L160 89.1Z\"/><path class=\"lu-finger\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M170.3 90.2L170.5 75.2A2.7 2.7 0 0 0 165.1 75.1L164.9 90.1Z\"/><path class=\"lu-thumb\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M157.9 99.1L151.7 91.2A3.1 3.1 0 0 0 146.9 95L153 102.9Z\"/><path fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M150.6 91.6C149.9 86.6 169.7 83.8 170.4 88.8L171.8 98.7C172.8 105.6 168.2 108.8 163.2 109.5C158.3 110.2 153 108.4 152 101.5Z\"/></g></g></g><rect width=\"24\" height=\"42\" x=\"88\" y=\"150\" fill=\"var(--lm-skin-d)\"/><g class=\"lu-head\"><g class=\"lu-bun\"><circle cx=\"100\" cy=\"60\" r=\"14.5\" fill=\"var(--lm-skin-hair)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\"/><path stroke=\"var(--lm-hair-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.2\" d=\"M91 56q9-7 18 0\"/><path stroke=\"var(--lm-hair-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M93 63q7-4 14 0\"/><rect width=\"22\" height=\"7\" x=\"89\" y=\"70\" fill=\"var(--lm-tomato)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" rx=\"3.5\"/></g><g class=\"lu-ears\"><ellipse cx=\"63\" cy=\"122\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" rx=\"8.5\" ry=\"12\"/><ellipse cx=\"137\" cy=\"122\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" rx=\"8.5\" ry=\"12\"/><path stroke=\"var(--lm-skin-d)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\" d=\"M62 116q-5 6 1 12\"/><path stroke=\"var(--lm-skin-d)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.4\" d=\"M138 116q5 6-1 12\"/></g><ellipse cx=\"100\" cy=\"118\" fill=\"var(--lm-skin)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" rx=\"37\" ry=\"45\"/><path fill=\"var(--lm-sideburn)\" d=\"M63.5 116Q62 99 68 90l8 3q-6 10-5.5 23Z\"/><path fill=\"var(--lm-sideburn)\" d=\"M136.5 116q1.5-17-4.5-26l-8 3q6 10 5.5 23Z\"/><g class=\"lu-hair\"><path fill=\"var(--lm-skin-hair)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M64 104q-2-35 36-37 38 2 36 37-6-17-20-21-16-4-32 0-14 4-20 21\"/><path fill=\"var(--lm-sideburn)\" d=\"M70.6 81.5L80.5 84Q75.5 90 73.5 97Q72 102 70 107H65.3V105Q63.9 92.8 70.6 81.5Z\"/><path fill=\"var(--lm-sideburn)\" d=\"M129.4 81.5L119.5 84Q124.5 90 126.5 97Q128 102 130 107H134.7V105Q136.1 92.8 129.4 81.5Z\"/><path fill=\"var(--lm-skin-fade)\" d=\"M66.3 90.6L75.6 92.6Q74.2 94.6 73.5 97Q72 102 70 107H65.3V105Q64.5 97.9 66.3 90.6Z\"/><path fill=\"var(--lm-skin-fade)\" d=\"M133.7 90.6L124.4 92.6Q125.8 94.6 126.5 97Q128 102 130 107H134.7V105Q135.5 97.9 133.7 90.6Z\"/><path stroke=\"var(--lm-hair-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M82 77q13-6 28-3\"/></g><g class=\"lu-beard\"><path fill=\"var(--lm-skin-beard)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M63 106c-2 36 9 65 37 72 28-7 39-36 37-72h-6c0 18-5 28-13 31-8-6-28-6-36 0-8-3-13-13-13-31Z\"/><path stroke=\"var(--lm-beard-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"M86 162q14 8 28 0\"/></g><g class=\"lu-face\"><ellipse cx=\"75\" cy=\"128\" fill=\"var(--lm-skin-blush)\" opacity=\".55\" rx=\"7\" ry=\"4\"/><ellipse cx=\"125\" cy=\"128\" fill=\"var(--lm-skin-blush)\" opacity=\".55\" rx=\"7\" ry=\"4\"/><g class=\"lu-nose\"><path fill=\"var(--lm-skin-d)\" d=\"M100 111q-5 14-7 19 7 5 14 0-2-5-7-19\"/><circle cx=\"97\" cy=\"128\" r=\"1.6\" fill=\"var(--lm-skin-highlight)\"/></g><path fill=\"var(--lm-skin-hair)\" d=\"M83 138q8-9 17-6 9-3 17 6-9 4-17 1-8 3-17-1\"/><path fill=\"var(--lm-skin)\" d=\"M83.1 149.9A3.5 3.5 0 0 1 89.9 148.3C90.9 152.1 90.7 157.8 88.8 158.3C86.9 158.8 84.1 153.8 83.1 149.9Z\"/><path fill=\"var(--lm-skin)\" d=\"M110.1 148.3A3.5 3.5 0 0 1 116.9 149.9C115.9 153.8 113.1 158.8 111.2 158.3C109.3 157.8 109.1 152.1 110.1 148.3Z\"/><g class=\"ms\"><path fill=\"var(--lm-skin-lip)\" stroke=\"var(--lm-lip-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M88 144.5q12 13.5 24 0-12 5-24 0\"/><path fill=\"var(--lm-teeth)\" d=\"M90.5 145.6q9.5 4 19 0l-.9 2.4q-8.6 3.4-17.2 0Z\"/></g><g class=\"mo\"><ellipse cx=\"100\" cy=\"148\" fill=\"var(--lm-skin-lip)\" stroke=\"var(--lm-lip-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" rx=\"6\" ry=\"7.4\"/><ellipse cx=\"100\" cy=\"151.5\" fill=\"var(--lm-mouth)\" rx=\"3.6\" ry=\"2.4\"/></g><g class=\"mw\"><path fill=\"var(--lm-skin-lip)\" stroke=\"var(--lm-lip-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M85 143q15 19 30 0-15 6-30 0\"/><path fill=\"var(--lm-teeth)\" d=\"M88 144.2q12 5 24 0l-1.4 3.4q-10.6 4.4-21.2 0Z\"/><ellipse cx=\"100\" cy=\"155\" fill=\"var(--lm-mouth)\" rx=\"4.5\" ry=\"2.2\"/></g><g class=\"eo l\"><ellipse cx=\"85\" cy=\"113\" fill=\"var(--lm-skin-hair)\" rx=\"3.4\" ry=\"4.3\"/><circle cx=\"86.3\" cy=\"111.4\" r=\"1.2\" fill=\"var(--lm-white)\"/></g><g class=\"eo r\"><ellipse cx=\"115\" cy=\"113\" fill=\"var(--lm-skin-hair)\" rx=\"3.4\" ry=\"4.3\"/><circle cx=\"116.3\" cy=\"111.4\" r=\"1.2\" fill=\"var(--lm-white)\"/></g><g class=\"ec l\"><path stroke=\"var(--lm-skin-hair)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.6\" d=\"M80 113q5 4.5 10 0\"/></g><g class=\"ec r\"><path stroke=\"var(--lm-skin-hair)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.6\" d=\"M110 113q5 4.5 10 0\"/></g><circle cx=\"85\" cy=\"113\" r=\"12.5\" fill=\"rgba(255,255,255,.14)\"/><circle cx=\"115\" cy=\"113\" r=\"12.5\" fill=\"rgba(255,255,255,.14)\"/><g class=\"lu-shades\" opacity=\"0\"><circle cx=\"85\" cy=\"113\" r=\"12.5\" fill=\"var(--lm-lens-tint)\" opacity=\"var(--lm-lens-tint-opacity)\"/><circle cx=\"115\" cy=\"113\" r=\"12.5\" fill=\"var(--lm-lens-tint)\" opacity=\"var(--lm-lens-tint-opacity)\"/><path stroke=\"var(--lm-white)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M79.5 116.5 86.5 109.5\" opacity=\".9\"/><path stroke=\"var(--lm-white)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M109.5 116.5 116.5 109.5\" opacity=\".9\"/></g><circle cx=\"85\" cy=\"113\" r=\"12.5\" stroke=\"var(--lm-skin-tort)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4.6\"/><circle cx=\"115\" cy=\"113\" r=\"12.5\" stroke=\"var(--lm-skin-tort)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4.6\"/><circle cx=\"85\" cy=\"113\" r=\"12.5\" stroke=\"var(--lm-scratch)\" stroke-dasharray=\"1.4 3.6 3.2 5.4 0.8 4.2 2.2 6\" stroke-linecap=\"round\" stroke-width=\"2.4\"/><circle cx=\"115\" cy=\"113\" r=\"12.5\" stroke=\"var(--lm-scratch)\" stroke-dasharray=\"2.6 4.8 1 3.8 3.6 6.2 1.4 4\" stroke-dashoffset=\"7\" stroke-linecap=\"round\" stroke-width=\"2.4\"/><path stroke=\"var(--lm-skin-tort)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3.6\" d=\"M97.5 112q2.5-3.5 5 0\"/><path stroke=\"var(--lm-skin-tort)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m72.5 110-8.5-4\"/><path stroke=\"var(--lm-skin-tort)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"m127.5 110 8.5-4\"/><g class=\"lu-glint\"><path stroke=\"var(--lm-white)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M78 106q3-3 7-3\" opacity=\".75\"/><path stroke=\"var(--lm-white)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M108 106q3-3 7-3\" opacity=\".75\"/></g><g class=\"brw\"><path stroke=\"var(--lm-skin-hair)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4.8\" d=\"M75 96q10-5.5 19-1\"/><path stroke=\"var(--lm-skin-hair)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"4.8\" d=\"M106 95q9-4.5 19 1\"/></g><g class=\"lu-cap\"><path fill=\"var(--lm-cap)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" d=\"M72 78h56l-28-20Z\"/><rect width=\"56\" height=\"8\" x=\"72\" y=\"78\" fill=\"var(--lm-cap)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"/><circle cx=\"100\" cy=\"90\" r=\"3\" fill=\"var(--lm-marigold)\"/></g><g class=\"lu-book\"><rect width=\"34\" height=\"26\" x=\"118\" y=\"168\" fill=\"var(--lm-white)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.5\" rx=\"4\"/><path stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"1.8\" d=\"M124 174h22m-22 6h22m-22 6h16\"/></g></g></g><g fill=\"var(--lm-ink)\" class=\"zz\" font-family=\"Bricolage Display, sans-serif\" font-weight=\"800\"><text x=\"146\" y=\"92\" font-size=\"18\">z</text><text x=\"156\" y=\"74\" font-size=\"22\">z</text><text x=\"166\" y=\"54\" font-size=\"26\">z</text></g><path fill=\"var(--lm-white)\" d=\"m38 74 36-36h14L42 84Z\" opacity=\".2\"/><path fill=\"var(--lm-white)\" d=\"m42 104 64-64h10l-70 74Z\" opacity=\".12\"/><g class=\"shade\"><rect width=\"164\" height=\"232\" x=\"18\" y=\"-210\" fill=\"var(--lm-shade)\"/><path stroke=\"var(--lm-shade-line)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" d=\"M18-20h164M18-2h164\"/><rect width=\"24\" height=\"9\" x=\"88\" y=\"12\" fill=\"var(--lm-shade-pull)\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2.2\" rx=\"4.5\"/></g></g><rect width=\"152\" height=\"192\" x=\"24\" y=\"24\" stroke=\"var(--lm-ink)\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"3\" rx=\"70\"/>";
  return inner.replaceAll('__id__', id);
}
