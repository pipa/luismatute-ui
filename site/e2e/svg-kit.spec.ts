import { readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';

const url = '/ui/illustrations/svg-kit/';
const distDir = fileURLToPath(new URL('../../dist/illustrations/', import.meta.url));
// Old #59 file names: two map to generic ids, two have none yet (#63) and stay hidden.
const renamed = ['island-sandals', 'island-fluky'];
const hidden = ['island-aa', 'island-bsc'];
const distSvgs = readdirSync(distDir).filter((f) => f.endsWith('.svg')).map((f) => f.slice(0, -4));
const expected = distSvgs.filter((n) => !hidden.includes(n)).length;
const oldIds = /\b(sandals|fluky|booking|bsc|aa)\b/i;

test('every kit item renders, one per non-deprecated dist SVG', async ({ page }) => {
  await page.goto(url);
  const items = page.locator('[data-kit-item]');
  await expect(items).toHaveCount(expected);
  expect(expected).toBe(distSvgs.length - hidden.length);
  for (const item of await items.all()) {
    await expect(item.locator('.kit-art svg')).toBeVisible();
    await expect(item.locator('.kit-name')).not.toBeEmpty();
  }
  const ids = await items.evaluateAll((els) => els.map((e) => e.getAttribute('data-kit-item')));
  expect(ids).toContain('island-resort');
  expect(ids).toContain('island-studio');
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
  const snippets = await page.locator('[data-kit-item] pre').allTextContents();
  expect(snippets).toHaveLength(expected);
  for (const s of snippets) {
    expect(s).not.toMatch(oldIds);
    expect(s).toContain("from '@luismatute/ui/illustrations'");
  }
});

test('copy works, or falls back gracefully', async ({ page, context, browserName }) => {
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
    await context.addCookies([{ name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' }]);
    await page.goto(url);
    await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
    const r = await new AxeBuilder({ page }).analyze();
    expect(r.violations).toEqual([]);
  });
}

test('no horizontal overflow at 320', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto(url);
  const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(over).toBeLessThanOrEqual(0);
});
