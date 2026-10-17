// #18 slice 5 stills: lm-shot and lm-avatar pages, day/night at 375/768/1280/1920,
// plus the pose picker with keyboard focus. Needs `node site/e2e/serve.mjs` (E2E_PORT).
// Writes outside the repo.
import { chromium } from 'playwright';
import { stillsDir } from './out-dir.mjs';

const out = stillsDir(
  process.argv[2] ?? '/workspace/team/luismatute/stills/ui-18-s4',
);
const base = `http://127.0.0.1:${process.env.E2E_PORT ?? 4174}/ui/components/`;
const pages = ['lm-shot', 'lm-avatar'];
const b = await chromium.launch();
const report = [];
async function open(mode, width, path) {
  const ctx = await b.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
  });
  await ctx.addCookies([
    { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
  ]);
  const p = await ctx.newPage();
  const errors = [];
  p.on('pageerror', (e) => errors.push(e.message));
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  await p.goto(`${base}${path}/?motion=full`);
  await p.evaluate(() => document.fonts.ready);
  // Load the lazy screenshots before a full-page capture.
  await p.evaluate(async () => {
    const imgs = [...document.querySelectorAll('img')];
    for (const i of imgs) i.loading = 'eager';
    await Promise.all(imgs.map((i) => i.decode().catch(() => {})));
  });
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
  // Pose picker: keyboard focus on "sleep" after choosing it with Enter.
  const { ctx, p } = await open(mode, 1280, 'lm-avatar');
  const sleep = p.getByRole('button', { name: 'sleep', exact: true });
  await sleep.focus();
  await p.keyboard.press('Shift+Tab');
  await p.keyboard.press('Tab');
  await p.keyboard.press('Enter');
  await p.waitForTimeout(900);
  const box = await p.locator('.demo-frame').boundingBox();
  await p.screenshot({
    path: `${out}/${mode}-1280-avatar-sleep-focus.png`,
    clip: {
      x: box.x - 8,
      y: box.y - 8,
      width: box.width + 16,
      height: box.height + 16,
    },
  });
  // The same frame flipped to the other theme.
  await p.getByRole('button', { name: /Night preview for this demo/ }).click();
  await p.screenshot({
    path: `${out}/${mode}-1280-avatar-flipped.png`,
    clip: {
      x: box.x - 8,
      y: box.y - 8,
      width: box.width + 16,
      height: box.height + 16,
    },
  });
  await ctx.close();
}
await b.close();
console.log(report.join('\n') || 'no page errors');
