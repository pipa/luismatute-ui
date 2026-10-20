import { expect, test } from 'playwright/test';
import { pageChecks } from './component-page-checks';

// #18 lm-flight-plan page.
test('demo renders an ordered list of stop links', async ({ page }) => {
  await page.goto('/ui/components/lm-flight-plan/');
  const plan = page.locator('.demo lm-flight-plan');
  await expect(plan.locator('ol > li')).toHaveCount(3);
  const first = plan.getByRole('link').first();
  await expect(first).toHaveClass(/lm-plan-jump/);
  await expect(first.locator('.lm-yr')).toHaveText('1987–2011');
  await expect(first.locator('.lm-name')).toHaveText('Honduras');
});

pageChecks('lm-flight-plan', '<lm-flight-plan>');
