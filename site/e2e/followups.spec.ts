import { expect, test } from 'playwright/test';

const url = '/ui/components/lm-card/';

test('anchor jump clears the sticky header', async ({ page }) => {
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`${url}#custom-properties`);
    await page.waitForFunction(() => window.scrollY > 0);
    const gap = await page.evaluate(() => {
      const head = document.querySelector('.head')?.getBoundingClientRect();
      const h = document
        .getElementById('custom-properties')
        ?.getBoundingClientRect();
      return h && head ? h.top - head.bottom : -999;
    });
    expect(gap, `heading below header at ${width}`).toBeGreaterThanOrEqual(0);
  }
});

test('blocked clipboard falls back to selecting the code', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: () =>
          Promise.reject(new DOMException('blocked', 'NotAllowedError')),
      },
    });
  });
  await page.goto(url);
  const button = page.getByRole('button', { name: 'Copy HTML snippet' });
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveText(/^Press (⌘C|Ctrl\+C)$/);
  await expect(button).not.toHaveAttribute('data-copied', '');
  const selected = await page.evaluate(
    () => window.getSelection()?.toString() ?? '',
  );
  expect(selected).toContain('<lm-card tone="marigold" tilt>');
  await expect(page.locator('#copy-live')).toHaveText(
    /Code selected, press (⌘C|Ctrl\+C)\./,
  );
});
