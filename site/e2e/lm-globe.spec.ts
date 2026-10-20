import { expect, test } from 'playwright/test';
import { pageChecks } from './component-page-checks';

// #18 lm-globe page: the element as it is on main.
test('demo renders and the route map opens and closes', async ({ page }) => {
  await page.goto('/ui/components/lm-globe/?motion=reduce');
  const btn = page.locator('.demo lm-globe').getByRole('button', { name: 'Open route map' });
  await expect(btn).toBeVisible();
  await expect(btn.locator('svg')).toHaveCount(1);
  await btn.click();
  const dialog = page.getByRole('dialog', { name: 'Honduras to Amsterdam' });
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('.lm-leg')).toHaveCount(4);
  await expect(dialog.getByRole('button', { name: 'Close route map' })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  await expect(btn).toBeFocused();
  await expect(btn).toHaveAttribute('aria-expanded', 'false');
});

test('night demo uses the night globe palette', async ({ page }) => {
  await page.goto('/ui/components/lm-globe/?mode=night');
  const sea = await page
    .locator('.demo lm-globe')
    .evaluate((el) => getComputedStyle(el).getPropertyValue('--lm-globe-ocean').trim());
  expect(sea.toLowerCase()).toBe('#2a3266');
});

pageChecks('lm-globe', '<lm-globe');
