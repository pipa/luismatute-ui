import { expect, test } from 'playwright/test';

const page_ = '/ui/components/lm-card/';

test('copy button works by keyboard and announces Copied', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto(page_);
  const button = page.getByRole('button', { name: 'Copy HTML snippet' });
  await expect(button).toBeVisible();
  await button.focus();
  await expect(button).toBeFocused();
  await page.keyboard.press('Enter');
  const live = page.locator('#copy-live');
  // Clipboard is permission-gated per engine; either success or the documented fallback.
  await expect(button).toHaveText(/Copied|Press Ctrl\+C/);
  const text = (await button.textContent())?.trim();
  if (text === 'Copied') {
    await expect(button).toHaveAttribute('data-copied', '');
    await expect(live).toHaveText('Copied to clipboard');
  } else {
    await expect(live).toHaveText(/press Ctrl\+C/);
  }
  if (browserName === 'chromium') {
    expect(text).toBe('Copied');
    const clip = await page.evaluate(() => navigator.clipboard.readText());
    expect(clip).toContain('<lm-card tone="marigold" tilt>');
  }
  await expect(button).toHaveText('Copy', { timeout: 4000 });
  // Space works too.
  await page.keyboard.press('Space');
  await expect(button).toHaveText(/Copied|Press Ctrl\+C/);
});

test('every copy button is keyboard reachable in order', async ({ page }) => {
  await page.goto(page_);
  const names: string[] = [];
  for (let i = 0; i < 80 && names.length < 3; i++) {
    await page.keyboard.press('Tab');
    const n = await page.evaluate(() => {
      const a = document.activeElement;
      return a?.matches('button[data-copy]')
        ? a.getAttribute('aria-label')
        : null;
    });
    if (n) names.push(n);
  }
  expect(names).toEqual([
    'Copy HTML snippet',
    'Copy Astro snippet',
    'Copy CSS snippet',
  ]);
});

test.describe('with JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('copy buttons stay hidden and the code stays readable', async ({
    page,
  }) => {
    await page.goto(page_);
    await expect(page.locator('button[data-copy]').first()).toBeHidden();
    await expect(page.locator('pre').first()).toContainText(
      '<lm-card tone="marigold" tilt>',
    );
    await expect(page.locator('.toc a[aria-current]')).toHaveCount(0);
  });
});

test('on this page marks the section being read', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto(page_);
  await expect(page.locator('.toc a[aria-current="true"]')).toHaveText('Usage');
  await page.locator('#custom-properties').scrollIntoViewIfNeeded();
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect(page.locator('.toc a[aria-current="true"]')).toHaveText(
    'CSS custom properties',
  );
  await expect(page.locator('.toc a[aria-current="true"]')).toHaveCount(1);
});
