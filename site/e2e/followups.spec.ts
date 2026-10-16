import { expect, test } from 'playwright/test';

const url = '/ui/components/lm-card/';

test('anchor jump clears the sticky header', async ({ page }) => {
  // #usage is high on the page, so the jump is never capped by the end of the
  // document (#custom-properties is, at 1280, which hid a missing scroll-margin).
  for (const width of [1280, 375]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto(`${url}#usage`);
    await page.waitForFunction(() => window.scrollY > 0);
    const m = await page.evaluate(() => {
      const head = document.querySelector('.head')?.getBoundingClientRect();
      const h = document.getElementById('usage')?.getBoundingClientRect();
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return {
        gap: h && head ? h.top - head.bottom : -999,
        capped: window.scrollY >= max - 1,
      };
    });
    expect(m.capped, `jump not capped by page end at ${width}`).toBe(false);
    // The heading lands below the header with breathing room (scroll-margin adds 16px).
    expect(m.gap, `heading clears header at ${width}`).toBeGreaterThanOrEqual(
      8,
    );
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
  expect(selected).toContain('<lm-card variant="stop">');
  await expect(page.locator('#copy-live')).toHaveText(
    /Code selected, press (⌘C|Ctrl\+C)\./,
  );
});
