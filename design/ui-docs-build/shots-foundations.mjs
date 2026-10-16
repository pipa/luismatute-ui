// #18 slice 3 stills: Foundations pages, day/night at 375/768/1280/1920, plus a
// token copy-focus still. Needs `node site/e2e/serve.mjs` (E2E_PORT). Writes outside the repo.
import { chromium } from 'playwright';
import { stillsDir } from './out-dir.mjs';

const out = stillsDir(
  process.argv[2] ?? '/workspace/team/luismatute/stills/ui-18-foundations',
);
const base = `http://127.0.0.1:${process.env.E2E_PORT ?? 4174}/ui/foundations/`;
const pages = ['colour', 'type', 'spacing', 'radius', 'motion-tokens'];
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
  await p.goto(base + path + '/');
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
  const { ctx, p } = await open(mode, 1280, 'colour');
  const btn = p.getByRole('button', { name: 'Copy var(--lm-marigold)' });
  await btn.focus();
  await p.keyboard.press('Tab');
  await p.keyboard.press('Shift+Tab');
  const box = await btn.boundingBox();
  const clip = {
    x: Math.max(0, box.x - 260),
    y: Math.max(0, box.y - 140),
    width: 760,
    height: 260,
  };
  await p.screenshot({ path: `${out}/${mode}-1280-copy-focus.png`, clip });
  await p.keyboard.press('Enter');
  await p.waitForSelector('button.tok-copy[data-copied]');
  const live = await p.locator('#copy-live').textContent();
  await p.screenshot({ path: `${out}/${mode}-1280-copied.png`, clip });
  report.push(`${mode} copy live="${live}"`);
  await ctx.close();
}
await b.close();
console.log(report.join('\n'));
