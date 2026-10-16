// #30 stills: the copied-state fade at 0.14s and with reduced motion, day and night at 1280.
// Needs `node site/e2e/serve.mjs` running (E2E_PORT). Writes outside the repo only.
import { chromium } from 'playwright';
import { stillsDir } from './out-dir.mjs';

const out = stillsDir(
  process.argv[2] ?? '/workspace/team/luismatute/stills/ui-30',
);
const url = `http://127.0.0.1:${process.env.E2E_PORT ?? 4174}/ui/components/lm-card/`;
const b = await chromium.launch();
const report = [];
for (const mode of ['day', 'night']) {
  for (const reduced of [false, true]) {
    const ctx = await b.newContext({
      viewport: { width: 1280, height: 900 },
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
    await ctx.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    const p = await ctx.newPage();
    await p.goto(url);
    await p.evaluate(() => document.fonts.ready);
    const btn = p.getByRole('button', { name: 'Copy HTML snippet' });
    const box = await btn.boundingBox();
    const clip = {
      x: 220,
      y: Math.max(0, box.y - 120),
      width: 840,
      height: 300,
    };
    await btn.click();
    await p.mouse.move(0, 0); // no hover fill in the frame
    await p.waitForSelector('button[data-copied]');
    // Freeze every running animation/transition on the button at 140ms.
    const state = await p.evaluate(() => {
      const el = document.querySelector('button[data-copied]');
      const anims = el.getAnimations({ subtree: true });
      for (const a of anims) {
        a.pause();
        a.currentTime = 140;
      }
      return {
        anims: anims.map((a) => a.transitionProperty ?? a.animationName),
        overlay: getComputedStyle(el, '::after').opacity,
      };
    });
    const name = reduced
      ? `${mode}-1280-copied-reduced.png`
      : `${mode}-1280-copied-140ms.png`;
    await p.screenshot({ path: `${out}/${name}`, clip });
    report.push(
      `${name} running=[${state.anims.join(',')}] overlayOpacity=${state.overlay}`,
    );
    await ctx.close();
  }
}
await b.close();
console.log(report.join('\n'));
