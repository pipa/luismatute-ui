import AxeBuilder from '@axe-core/playwright';
import { expect, test } from 'playwright/test';

const wcag = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

// #18 docs header controls and 404 (design/docs-shell SPEC.md "Top bar", "404").
test.describe('docs header', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('search pill opens the Pagefind dialog', async ({ page }) => {
    await page.goto('/ui/');
    const pill = page.locator('.head [data-search-open]');
    await expect(pill).toBeVisible();
    await pill.click();
    await expect(page.locator('dialog#search')).toHaveJSProperty('open', true);
    await expect(page.locator('#search-input')).toBeFocused();
  });

  test('theme is Day/Night only and writes the lm-mode cookie', async ({
    page,
    context,
  }) => {
    await page.goto('/ui/?motion=reduce');
    const group = page.getByRole('group', { name: 'Theme' });
    await expect(group.getByRole('button')).toHaveText(['Day', 'Night']);
    const night = group.getByRole('button', { name: 'Night' });
    const day = group.getByRole('button', { name: 'Day' });
    await night.click();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
    await expect(night).toHaveAttribute('aria-pressed', 'true');
    await expect(day).toHaveAttribute('aria-pressed', 'false');
    const c = (await context.cookies()).find((x) => x.name === 'lm-mode');
    expect(c?.value).toBe('night');
    // Persists across pages via the cookie.
    await page.goto('/ui/changelog/');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
    await expect(
      page
        .getByRole('group', { name: 'Theme' })
        .getByRole('button', { name: 'Night' }),
    ).toHaveAttribute('aria-pressed', 'true');
    // Keyboard: Tab reaches Day, Space selects it.
    await page.getByRole('button', { name: 'Day' }).focus();
    await page.keyboard.press('Space');
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'day');
  });

  test('GitHub and site links', async ({ page }) => {
    await page.goto('/ui/');
    await expect(
      page.locator('.head').getByRole('link', { name: 'GitHub' }),
    ).toHaveAttribute('href', 'https://github.com/pipa/luismatute-ui');
    await expect(
      page.locator('.head').getByRole('link', { name: 'luismatute.me' }),
    ).toHaveAttribute('href', 'https://luismatute.me');
  });

  test('375: header fits without sideways scroll', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/ui/');
    await expect(page.getByRole('group', { name: 'Theme' })).toBeVisible();
    const over = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    );
    expect(over).toBeLessThanOrEqual(0);
  });
});

test.describe('404', () => {
  test('renders the gate-closed page and links home', async ({ page }) => {
    await page.goto('/ui/404.html');
    await expect(page.locator('h1')).toHaveText('404');
    await expect(page.getByText('Gate closed')).toBeVisible();
    await expect(page.getByText('this flight was cancelled')).toBeVisible();
    await expect(page.locator('.pager')).toHaveCount(0);
    await expect(page.locator('[data-pagefind-body]')).toHaveCount(0);
    await page.getByRole('link', { name: 'Back to /ui/' }).click();
    await expect(page).toHaveURL(/\/ui\/$/);
  });

  for (const mode of ['day', 'night'] as const) {
    test(`axe clean (${mode})`, async ({ page }) => {
      await page.goto(`/ui/404.html?mode=${mode}`);
      const r = await new AxeBuilder({ page }).withTags(wcag).analyze();
      expect(r.violations).toEqual([]);
    });
  }
});

test.describe('docs header (keyboard, reload, axe)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  for (const how of ['Enter', 'ControlOrMeta+k'] as const) {
    test(`search opens with ${how}, Esc returns focus to the pill`, async ({
      page,
    }) => {
      await page.goto('/ui/');
      const pill = page.locator('.head [data-search-open]');
      const dialog = page.locator('dialog#search');
      await pill.focus();
      await page.keyboard.press(how);
      await expect(dialog).toHaveJSProperty('open', true);
      await expect(page.locator('#search-input')).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveJSProperty('open', false);
      await expect(pill).toBeFocused();
    });
  }

  test('Night survives a reload and the active segment is marigold', async ({
    page,
  }) => {
    await page.goto('/ui/?motion=reduce');
    const night = () =>
      page
        .getByRole('group', { name: 'Theme' })
        .getByRole('button', { name: 'Night' });
    await night().click();
    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
    await expect(night()).toHaveAttribute('aria-pressed', 'true');
    await expect(night()).toHaveCSS('background-color', 'rgb(246, 180, 60)');
    await expect(
      page
        .getByRole('group', { name: 'Theme' })
        .getByRole('button', { name: 'Day' }),
    ).not.toHaveCSS('background-color', 'rgb(246, 180, 60)');
  });

  for (const mode of ['day', 'night'] as const) {
    test(`header axe clean, WCAG 2.2 AA (${mode})`, async ({ page }) => {
      await page.goto(`/ui/?mode=${mode}`);
      await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
      const r = await new AxeBuilder({ page })
        .include('.head')
        .withTags(wcag)
        .analyze();
      expect(r.violations).toEqual([]);
    });
  }
});

test('unknown URL returns 404 with the 404 page', async ({ page }) => {
  const res = await page.goto('/ui/no-such-page/');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toHaveText('404');
  await expect(page.getByText('Gate closed')).toBeVisible();
  await expect(
    page.getByRole('link', { name: 'Back to /ui/' }),
  ).toHaveAttribute('href', '/ui/');
});
