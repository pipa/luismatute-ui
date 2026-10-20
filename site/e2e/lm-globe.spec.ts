import { expect, test } from 'playwright/test';
import { pageChecks } from './component-page-checks';

// #18 lm-globe page: the element as it is on main.
test('demo renders and the route map opens and closes', async ({ page }) => {
  await page.goto('/ui/components/lm-globe/?motion=reduce');
  const btn = page.locator('.demo lm-globe').getByRole('button', { name: 'Open route map' });
  await expect(btn).toBeVisible();
  await expect(btn.locator('svg')).toHaveCount(1);
  await btn.click();
  const dialog = page.getByRole('dialog', { name: 'Example route' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lm-leg')).toHaveCount(4);
  await expect(dialog.getByRole('button', { name: 'Close route map' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(btn).toBeFocused();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
});

const fills = (page: import('playwright/test').Page) =>
  page.locator('.demo lm-globe .lm-globe-stage svg').evaluate((svg) => {
    const css = (el: Element | null, prop: 'fill' | 'stroke') =>
      el ? getComputedStyle(el)[prop] : '';
    const g = svg.querySelector(':scope > g');
    return {
      sea: css(g?.querySelector(':scope > circle[r="430"]') ?? null, 'fill'),
      edge: css(g?.querySelector(':scope > circle[r="500"]') ?? null, 'fill'),
      land: css(g?.querySelector(':scope > path[stroke]') ?? null, 'fill'),
      landLine: css(g?.querySelector(':scope > path[stroke]') ?? null, 'stroke'),
      rim: css(svg.querySelector(':scope > circle[stroke]'), 'stroke'),
      hot: css(svg.querySelector('.lm-leg[data-hot="true"]'), 'stroke'),
      pin: css(svg.querySelector('.lm-pin circle'), 'fill'),
    };
  });

// #57: the palette is built into lm-globe now (no docs.css override).
// Computed fills are read from the shapes themselves, so no probe lands on
// an anti-aliased edge (Firefox draws edges about 1px off).
test('night demo uses the built-in night globe palette, land and sea', async ({ page }) => {
  await page.goto('/ui/components/lm-globe/?mode=night&motion=reduce');
  const f = await fills(page);
  expect(f.sea).toBe('rgb(42, 50, 102)');
  expect(f.edge).toBe('rgb(31, 37, 78)');
  expect(f.land).toBe('rgb(36, 64, 47)');
  expect(f.landLine).toBe('rgb(58, 67, 128)');
  expect(f.rim).toBe('rgb(58, 67, 128)');
  expect(f.hot).not.toBe('rgb(58, 67, 128)');
  expect(f.pin).not.toBe('rgb(58, 67, 128)');
});

test('day demo keeps the day globe palette', async ({ page }) => {
  await page.goto('/ui/components/lm-globe/?mode=day&motion=reduce');
  const f = await fills(page);
  expect(f.sea).toBe('rgb(53, 146, 179)');
  expect(f.edge).toBe('rgb(47, 134, 168)');
  expect(f.land).toBe('rgb(140, 192, 106)');
});

for (const mode of ['day', 'night'] as const) {
  test(`dashed route works in ${mode}`, async ({ page }) => {
    await page.goto(`/ui/components/lm-globe/?mode=${mode}&motion=reduce`);
    const legs = await page.locator('.demo lm-globe').evaluate((el) => {
      el.setAttribute('route-style', 'dashed');
      return [...el.querySelectorAll('.lm-leg')].map((l) => {
        const s = getComputedStyle(l);
        return { dash: s.strokeDasharray, cap: s.strokeLinecap, stroke: s.stroke };
      });
    });
    expect(legs).toHaveLength(4);
    const tomato = legs[3]?.stroke;
    for (const leg of legs) {
      expect(leg.dash.replaceAll('px', '')).toMatch(/^13\.64,? 8\.36$/);
      expect(leg.cap).toBe('round');
      expect(leg.stroke).toBe(tomato);
    }
  });

  test(`open map visual baseline (${mode})`, async ({ page }, info) => {
    test.skip(info.project.name !== 'chromium', 'pixel baseline is Chromium');
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto(`/ui/components/lm-globe/?mode=${mode}&motion=reduce`);
    await page.locator('.demo lm-globe').getByRole('button', { name: 'Open route map' }).click();
    const stage = page.getByRole('dialog', { name: 'Example route' }).locator('.lm-globe-stage');
    await expect(stage).toHaveScreenshot(`globe-open-${mode}.png`, { animations: 'disabled' });
  });
}

pageChecks('lm-globe', '<lm-globe');
