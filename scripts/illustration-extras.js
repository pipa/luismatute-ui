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
