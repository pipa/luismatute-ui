import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

/** Shared #18 component-page checks: snippet copy, axe day+night, 375 fit. */
export function pageChecks(slug: string, snippet: string): void {
  const url = `/ui/components/${slug}/`;

  test('demo snippet copies', async ({ page, context, browserName }) => {
    if (browserName === 'chromium')
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto(url);
    const button = page.locator('.demo').getByRole('button', { name: 'Copy HTML snippet' });
    await button.click();
    await expect(button).toHaveText(/Copied|Press Ctrl\+C/);
    if (browserName === 'chromium') {
      const clip = await page.evaluate(() => navigator.clipboard.readText());
      expect(clip).toContain(snippet);
    }
  });

  for (const mode of ['day', 'night'] as const) {
    test(`axe clean (${mode})`, async ({ page }) => {
      await page.goto(`${url}?mode=${mode}&motion=reduce`);
      await page.locator('.demo-stage :defined').first().waitFor();
      const r = await new AxeBuilder({ page }).analyze();
      expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`)).toEqual([]);
    });
  }

  test('no horizontal scroll at 375', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto(url);
    expect(await overflow(page)).toBeLessThanOrEqual(0);
  });
}

export const overflow = (page: Page) =>
  page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
