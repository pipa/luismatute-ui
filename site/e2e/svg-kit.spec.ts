import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';

const url = '/ui/illustrations/svg-kit/';
const distDir = fileURLToPath(
  new URL('../../dist/illustrations/', import.meta.url),
);
// Old #59 file names: two map to generic JS ids, two also ship as generic files and stay hidden.
const renamed = ['island-sandals', 'island-fluky'];
const hidden = ['island-aa', 'island-bsc'];
const generic = [
  'island-resort',
  'island-studio',
  'island-airport',
  'island-campus',
];
const distSvgs = readdirSync(distDir)
  .filter((f) => f.endsWith('.svg'))
  .map((f) => f.slice(0, -4));
const expected = distSvgs.filter((n) => !hidden.includes(n)).length;
const oldIds = /\b(sandals|fluky|booking|bsc|aa)\b/i;

test('every kit item renders, one per non-deprecated dist SVG', async ({
  page,
}) => {
  await page.goto(url);
  const items = page.locator('[data-kit-item]');
  await expect(items).toHaveCount(expected);
  expect(expected).toBe(distSvgs.length - hidden.length);
  expect(expected).toBe(29);
  for (const item of await items.all()) {
    await expect(item.locator('.kit-art svg')).toBeVisible();
    await expect(item.locator('.kit-name')).not.toBeEmpty();
  }
  const ids = await items.evaluateAll((els) =>
    els.map((e) => e.getAttribute('data-kit-item')),
  );
  for (const g of generic) expect(ids).toContain(g);
  for (const r of [...renamed, ...hidden]) expect(ids).not.toContain(r);
  await expect(page.locator('main')).not.toContainText('Coming soon');
});

test('no old ids in page text, labels or snippets', async ({ page }) => {
  await page.goto(url);
  const text = await page.locator('main').innerText();
  expect(text).not.toMatch(oldIds);
  const labels = await page
    .locator('[data-kit-item] [aria-label]')
    .evaluateAll((els) => els.map((e) => e.getAttribute('aria-label') ?? ''));
  for (const l of labels) expect(l).not.toMatch(oldIds);
  const snippets = await page
    .locator('[data-kit-item] pre.kit-full')
    .allTextContents();
  expect(snippets).toHaveLength(expected);
  for (const s of snippets) {
    expect(s).not.toMatch(oldIds);
    expect(s).toContain("from '@luismatute/ui/illustrations'");
  }
});

test('copy works, or falls back gracefully', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(url);
  for (const id of ['palm', 'island-resort']) {
    const button = page.locator(`[data-kit-item="${id}"] button[data-copy]`);
    await expect(button).toBeVisible();
    await button.click();
    await expect(button).toHaveText(/Copied|Press (Ctrl\+C|⌘C)/);
    if (browserName === 'chromium') {
      await expect(button).toHaveText('Copied');
      const clip = await page.evaluate(() => navigator.clipboard.readText());
      expect(clip).toContain(`inlineIllustration('${id}')`);
      expect(clip).not.toMatch(oldIds);
    }
  }
});

for (const mode of ['day', 'night'] as const) {
  test(`axe clean in ${mode}`, async ({ page, context }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.goto(url);
    await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
    const r = await new AxeBuilder({ page }).analyze();
    expect(r.violations).toEqual([]);
  });
}

test('no horizontal overflow at 320', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(url);
  const over = await page.evaluate(
    () => document.documentElement.scrollWidth - window.innerWidth,
  );
  expect(over).toBeLessThanOrEqual(0);
});

test('airport and campus tiles show a plain import path', async ({ page }) => {
  await page.goto(url);
  for (const id of ['island-airport', 'island-campus'])
    await expect(page.locator(`[data-kit-item="${id}"] .kit-path`)).toHaveText(
      `import url from '@luismatute/ui/illustrations/${id}.svg';`,
    );
});

for (const [w, cols] of [
  [320, 1],
  [768, 2],
  [1280, 3],
] as const) {
  test(`${cols} column(s) at ${w}, path not clipped`, async ({ page }) => {
    await page.setViewportSize({ width: w, height: 900 });
    await page.goto(url);
    const tracks = await page
      .locator('[data-kit-grid]')
      .evaluate(
        (g) => getComputedStyle(g).gridTemplateColumns.split(' ').length,
      );
    expect(tracks).toBe(cols);
    const clipped = await page
      .locator('.kit-path code')
      .evaluateAll(
        (els) =>
          els.filter(
            (e) =>
              e.scrollWidth > e.clientWidth + 1 ||
              e.getBoundingClientRect().right >
                e.closest('li')!.getBoundingClientRect().right,
          ).length,
      );
    expect(clipped).toBe(0);
    // Name and Copy share one row on every tile, without overlapping or leaving the tile.
    const broken = await page.locator('.kit-row').evaluateAll(
      (rows) =>
        rows.filter((r) => {
          const n = r.querySelector('.kit-name code')!.getBoundingClientRect();
          const b = r.querySelector('button')!.getBoundingClientRect();
          const li = r.closest('li')!.getBoundingClientRect();
          return (
            n.right > b.left ||
            b.right > li.right ||
            Math.abs(n.top + n.height / 2 - (b.top + b.height / 2)) > 8
          );
        }).length,
    );
    expect(broken).toBe(0);
  });
}

for (const [mode, bg, border] of [
  ['day', 'rgb(207, 230, 242)', null],
  ['night', 'rgb(42, 50, 102)', 'rgb(58, 67, 128)'],
] as const) {
  test(`tile background in ${mode}`, async ({ page, context }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.goto(url);
    const s = await page.locator('[data-kit-item="palm"]').evaluate((e) => {
      const c = getComputedStyle(e);
      return {
        bg: c.backgroundColor,
        bc: c.borderTopColor,
        bw: c.borderTopWidth,
      };
    });
    expect(s.bg).toBe(bg);
    if (border) expect(s).toMatchObject({ bc: border, bw: '2px' });
  });
}
