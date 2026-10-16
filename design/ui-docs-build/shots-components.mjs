// #18 slice 3 stills: Component pages, day/night at 375/768/1280/1920, plus a
// demo keyboard-focus still. Needs `node site/e2e/serve.mjs` (E2E_PORT). Writes outside the repo.
import { chromium } from 'playwright';
import { stillsDir } from './out-dir.mjs';

const out = stillsDir(
  process.argv[2] ?? '/workspace/team/luismatute/stills/ui-18-components',
);
const base = `http://127.0.0.1:${process.env.E2E_PORT ?? 4174}/ui/components/`;
const pages = ['lm-card', 'lm-chip', 'lm-more', 'lm-pause'];
const b = await chromium.launch();
const report = [];
async function open(mode, width, path) {
  const ctx = await b.newContext({
    viewport: { width, height: 900 },
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
  await p.goto(`${base}${path}/?motion=full`);
  await p.evaluate(() => document.fonts.ready);
  return { ctx, p, errors };
}
for (const mode of ['day', 'night']) {
  for (const w of [375, 768, 1280, 1920]) {
    for (const page of pages) {
      const { ctx, p, errors } = await open(mode, w, page);
      await p.screenshot({
        path: `${out}/${mode}-${w}-${page}.png`,
        fullPage: true,
      });
      if (errors.length)
        report.push(`${mode}-${w}-${page} errors=${errors.join('|')}`);
      await ctx.close();
    }
  }
  // Keyboard focus on the lm-more button, then opened with Enter.
  const { ctx, p } = await open(mode, 1280, 'lm-more');
  const btn = p.locator('.demo lm-more button');
  await btn.focus();
  await p.keyboard.press('Shift+Tab');
  await p.keyboard.press('Tab');
  const box = await p.locator('.demo-frame').boundingBox();
  const clip = {
    x: box.x - 8,
    y: box.y - 8,
    width: box.width + 16,
    height: box.height + 16,
  };
  await p.screenshot({ path: `${out}/${mode}-1280-demo-focus.png`, clip });
  await p.keyboard.press('Enter');
  const box2 = await p.locator('.demo-frame').boundingBox();
  await p.screenshot({
    path: `${out}/${mode}-1280-demo-open.png`,
    clip: { ...clip, height: box2.height + 16 },
  });
  report.push(`${mode} log="${await p.locator('.demo-log').textContent()}"`);
  await ctx.close();
}
await b.close();
console.log(report.join('\n'));
