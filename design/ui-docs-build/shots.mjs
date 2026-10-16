import { chromium } from 'playwright';

const out = '/workspace/team/luismatute/stills/ui-18-shell';
const base = 'http://127.0.0.1:3101/ui/';
const b = await chromium.launch();
async function page(mode, width, opts = {}) {
  const ctx = await b.newContext({
    viewport: { width, height: 900 },
    reducedMotion: 'reduce',
    ...opts,
  });
  await ctx.addCookies([
    { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
  ]);
  const p = await ctx.newPage();
  const errors = [];
  p.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  return { ctx, p, errors };
}
const report = [];
for (const mode of ['day', 'night']) {
  for (const w of [375, 768, 1280, 1920]) {
    const { ctx, p, errors } = await page(mode, w);
    await p.goto(base);
    await p.evaluate(() => document.fonts.ready);
    const bg = await p.evaluate(() => [
      document.documentElement.dataset.mode,
      getComputedStyle(document.documentElement).backgroundColor,
    ]);
    await p.screenshot({ path: `${out}/${mode}-${w}.png`, fullPage: true });
    report.push(
      `${mode}-${w} mode=${bg[0]} bg=${bg[1]} errors=${errors.length}`,
    );
    await ctx.close();
  }
  {
    // drawer open at 375 on a page with a current item
    const { ctx, p } = await page(mode, 375);
    await p.goto(base + 'components/lm-card/');
    await p.evaluate(() => document.fonts.ready);
    await p.keyboard.press('Tab');
    await p.keyboard.press('Tab'); // skip link, menu button
    await p.keyboard.press('Enter');
    const open = await p.evaluate(() =>
      document.getElementById('drawer').matches(':popover-open'),
    );
    const focusInDrawer = await p.evaluate(() =>
      document.activeElement?.getAttribute('aria-label'),
    );
    await p.screenshot({ path: `${out}/${mode}-375-drawer.png` });
    await p.keyboard.press('Escape');
    const closed = await p.evaluate(
      () => !document.getElementById('drawer').matches(':popover-open'),
    );
    report.push(
      `${mode}-375-drawer open=${open} active=${focusInDrawer} escCloses=${closed}`,
    );
    await ctx.close();
  }
  {
    // keyboard focus on a nav item at 1280
    const { ctx, p } = await page(mode, 1280);
    await p.goto(base + 'components/lm-card/');
    await p.evaluate(() => document.fonts.ready);
    let label = '';
    for (let i = 0; i < 12; i++) {
      await p.keyboard.press('Tab');
      label = await p.evaluate(() =>
        document.activeElement?.textContent?.trim(),
      );
      if (label === 'Colour') break;
    }
    const ring = await p.evaluate(() => {
      const s = getComputedStyle(document.activeElement);
      return `${s.outlineStyle} ${s.outlineWidth} ${s.outlineColor}`;
    });
    await p.screenshot({ path: `${out}/${mode}-1280-focus.png` });
    const fits = await p.evaluate(() => {
      const a = document.activeElement;
      const n = a.closest('nav').getBoundingClientRect();
      const r = a.getBoundingClientRect();
      const s = getComputedStyle(a);
      const o =
        Number.parseFloat(s.outlineWidth) + Number.parseFloat(s.outlineOffset);
      return r.left - o >= n.left && r.right + o <= n.right;
    });
    report.push(
      `${mode}-1280-focus on=${label} ring=${ring} ringInsideScroller=${fits}`,
    );
    await ctx.close();
  }
}
await b.close();
console.log(report.join('\n'));
