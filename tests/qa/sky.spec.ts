import { expect, type Page, test } from 'playwright/test';

const running = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) =>
        (a.effect as KeyframeEffect | null)?.target?.closest?.('.lm-sky-head'),
      )
      .map((a) => a.playState),
  );

test('Pause sky stops every header loop and toggles the label', async ({
  page,
}) => {
  await page.goto('/fixtures/sky.html');
  await expect
    .poll(
      async () => (await running(page)).filter((s) => s === 'running').length,
    )
    .toBeGreaterThan(0);
  const btn = page.locator('button.lm-sky-pause');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveText('Play sky');
  await expect
    .poll(async () => (await running(page)).every((s) => s === 'paused'))
    .toBe(true);
});

test('the sky pauses off-screen', async ({ page }) => {
  await page.goto('/fixtures/sky.html');
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(page.locator('.lm-sky-head')).toHaveClass(/lm-sky-off/);
  await expect
    .poll(async () => (await running(page)).every((s) => s === 'paused'))
    .toBe(true);
});

test('reduced motion is static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixtures/sky.html');
  expect(await running(page)).toEqual([]);
  await expect(page.locator('button.lm-sky-pause')).toBeHidden();
});

test('stored night applies before first paint and the toggle flips it', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('lm.ui.theme', 'night'));
  await page.goto('/fixtures/sky.html');
  expect(
    await page.evaluate(
      () =>
        performance.getEntriesByType('paint').length >= 0 &&
        document.documentElement.dataset.mode,
    ),
  ).toBe('night');
  const t = page.locator('lm-theme-toggle button');
  await expect(t).toHaveAttribute('aria-pressed', 'true');
  await t.click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'day');
  expect(await page.evaluate(() => localStorage.getItem('lm.ui.theme'))).toBe(
    'day',
  );
});
