// Stills for #18 slice 2 (code blocks). Needs `node site/e2e/serve.mjs <port>` running.
import { chromium } from 'playwright';
import { stillsDir } from './out-dir.mjs';

const out = stillsDir(
  process.argv[2] ?? '/workspace/team/luismatute/stills/ui-18-code',
);
const base = `http://127.0.0.1:${process.env.E2E_PORT ?? 4174}/ui/components/lm-card/`;
const b = await chromium.launch();
const report = [];
async function open(mode, width, height = 900) {
  const ctx = await b.newContext({
    viewport: { width, height },
    reducedMotion: 'reduce',
  });
  await ctx.grantPermissions(['clipboard-read', 'clipboard-write']);
  await ctx.addCookies([
    { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
  ]);
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(base);
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p, errors };
}
for (const mode of ['day', 'night']) {
  for (const w of [375, 768, 1280, 1920]) {
    const { ctx, p, errors } = await open(mode, w);
    await p.screenshot({ path: `${out}/${mode}-${w}.png`, fullPage: true });
    report.push(`${mode}-${w} errors=${errors.length}`);
    await ctx.close();
  }
  {
    const { ctx, p } = await open(mode, 1280);
    const btn = p.getByRole('button', { name: 'Copy HTML snippet' });
    for (let i = 0; i < 60; i++) {
      await p.keyboard.press('Tab');
      if (await btn.evaluate((e) => e === document.activeElement)) break;
    }
    const ring = await btn.evaluate((e) => {
      const s = getComputedStyle(e);
      return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
    });
    const box = await btn.boundingBox();
    const clip = {
      x: 220,
      y: Math.max(0, box.y - 120),
      width: 840,
      height: 300,
    };
    await p.screenshot({ path: `${out}/${mode}-1280-copy-focus.png`, clip });
    await p.keyboard.press('Enter');
    await p.waitForSelector('button[data-copied]');
    const live = await p.locator('#copy-live').textContent();
    await p.screenshot({ path: `${out}/${mode}-1280-copied.png`, clip });
    report.push(`${mode} focus ring=${ring}; copied live="${live}"`);
    await ctx.close();
  }
}
await b.close();
console.log(report.join('\n'));
