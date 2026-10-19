import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

// #18 search: design/docs-shell/SPEC.md "Search dialog"; shots
// search-dialog.png and search-empty.png. Run `pnpm build:site` first (it
// writes the Pagefind index to site-dist/pagefind/).
const page_ = '/ui/components/lm-motion-toggle/';
const dialog = (p: Page) => p.getByRole('dialog', { name: 'Search the docs' });
const input = (p: Page) => p.getByRole('combobox', { name: 'Search pages' });
const pill = (p: Page) =>
  p.getByRole('button', { name: 'Search', exact: true });
const options = (p: Page) =>
  p.getByRole('listbox', { name: 'Results' }).getByRole('option');

/** Pagefind requests seen by this page. */
function watchPagefind(page: Page) {
  const seen: string[] = [];
  page.on('request', (r) => {
    if (r.url().includes('/pagefind/')) seen.push(r.url());
  });
  return seen;
}

async function search(page: Page, q: string) {
  await input(page).fill(q);
}

test('pill opens the dialog with focus in the search field', async ({
  page,
}) => {
  await page.goto(page_);
  await expect(dialog(page)).toBeHidden();
  await pill(page).click();
  await expect(dialog(page)).toBeVisible();
  await expect(input(page)).toBeFocused();
  await expect(pill(page)).toHaveAttribute('aria-expanded', 'true');
});

test('"/" opens it, but not while typing in a field', async ({ page }) => {
  await page.goto(page_);
  await page.locator('body').click({ position: { x: 5, y: 300 } });
  await page.keyboard.press('/');
  await expect(dialog(page)).toBeVisible();
  await expect(input(page)).toBeFocused();
  await page.keyboard.type('/x');
  await expect(input(page)).toHaveValue('/x');
});

for (const mod of ['Control', 'Meta'] as const) {
  test(`${mod}+K opens it and ${mod}+K again closes it`, async ({ page }) => {
    await page.goto(page_);
    await page.locator('body').click({ position: { x: 5, y: 300 } });
    await page.keyboard.press(`${mod}+k`);
    await expect(dialog(page)).toBeVisible();
    await expect(input(page)).toBeFocused();
    await page.keyboard.press(`${mod}+k`);
    await expect(dialog(page)).toBeHidden();
  });
}

test('arrows move through results (aria-activedescendant), Enter opens the active one', async ({
  page,
}) => {
  await page.goto(page_);
  await pill(page).click();
  await search(page, 'card');
  await expect(options(page).first()).toBeVisible();
  const n = await options(page).count();
  expect(n).toBeGreaterThan(1);
  await expect(input(page)).toHaveAttribute('aria-expanded', 'true');
  const active = () => input(page).getAttribute('aria-activedescendant');
  const selected = () =>
    options(page).evaluateAll((os) =>
      os
        .filter((o) => o.getAttribute('aria-selected') === 'true')
        .map((o) => o.id),
    );
  await expect.poll(active).toBe('search-hit-0');
  expect(await selected()).toEqual(['search-hit-0']);
  await page.keyboard.press('ArrowDown');
  await expect.poll(active).toBe('search-hit-1');
  expect(await selected()).toEqual(['search-hit-1']);
  await page.keyboard.press('ArrowUp');
  await page.keyboard.press('ArrowUp');
  await expect.poll(active).toBe(`search-hit-${n - 1}`);
  await page.keyboard.press('ArrowDown');
  await expect.poll(active).toBe('search-hit-0');
  // Focus never leaves the input while arrowing.
  await expect(input(page)).toBeFocused();
  const first = options(page).first();
  await expect(first).toContainText('lm-card');
  const href = await first.getAttribute('href');
  expect(href).toBe('/ui/components/lm-card/');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/ui\/components\/lm-card\/$/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('lm-card');
});

test('Escape closes and gives focus back to the pill', async ({ page }) => {
  await page.goto(page_);
  await pill(page).focus();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeVisible();
  await search(page, 'card');
  await expect(options(page).first()).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toBeHidden();
  await expect(pill(page)).toBeFocused();
  await expect(pill(page)).toHaveAttribute('aria-expanded', 'false');
});

test('"/" from the page: Escape puts focus back where it was', async ({
  page,
}) => {
  await page.goto(page_);
  const copy = page.locator('button[data-copy]').first();
  await copy.focus();
  await page.keyboard.press('/');
  await expect(dialog(page)).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog(page)).toBeHidden();
  await expect(copy).toBeFocused();
});

test('close button and Tab stay inside the dialog', async ({ page }) => {
  await page.goto(page_);
  await pill(page).click();
  const close = page.getByRole('button', { name: 'Close search' });
  await page.keyboard.press('Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(input(page)).toBeFocused();
  await page.keyboard.press('Shift+Tab');
  await expect(close).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(dialog(page)).toBeHidden();
  await expect(pill(page)).toBeFocused();
});

test('empty state matches the spec and is announced', async ({ page }) => {
  await page.goto(page_);
  await pill(page).click();
  await search(page, 'zzzzqx');
  const empty = page.locator('[data-search-empty]');
  await expect(empty).toBeVisible();
  await expect(empty.locator('.search-hand')).toHaveText('no flights found');
  await expect(empty).toContainText(
    'Try a component name, a token, or install.',
  );
  expect(
    await empty
      .locator('.search-hand')
      .evaluate((e) => getComputedStyle(e).fontFamily),
  ).toMatch(/Caveat/);
  await expect(page.getByRole('listbox', { name: 'Results' })).toBeHidden();
  await expect(input(page)).toHaveAttribute('aria-expanded', 'false');
  await expect(input(page)).not.toHaveAttribute('aria-activedescendant', /.+/);
  await expect(page.locator('[data-search-status]')).toHaveText('No results');
  // Clearing the field clears the state.
  await search(page, '');
  await expect(empty).toBeHidden();
});

test('pagefind loads only when the dialog opens', async ({ page }) => {
  const seen = watchPagefind(page);
  await page.goto(page_);
  await page.waitForLoadState('networkidle');
  await page.mouse.wheel(0, 600);
  await page.waitForTimeout(300);
  expect(seen).toEqual([]);
  await pill(page).click();
  await expect
    .poll(() => seen.some((u) => u.endsWith('/ui/pagefind/pagefind.js')))
    .toBe(true);
});

test.describe('JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('no search pill and no dialog are shown', async ({ page }) => {
    await page.goto(page_);
    await expect(page.locator('.search-open')).toBeHidden();
    await expect(page.locator('dialog[data-search]')).toBeHidden();
  });
});

for (const mode of ['day', 'night'] as const) {
  test.describe(mode, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });
    for (const width of [375, 1280]) {
      test(`axe is clean with results and with the empty state (${width})`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(page_);
        await expect(pill(page)).toBeVisible();
        const box = await pill(page).boundingBox();
        expect(box?.height).toBeGreaterThanOrEqual(44);
        expect(box?.width).toBeGreaterThanOrEqual(44);
        await pill(page).click();
        await search(page, 'card');
        await expect(options(page).first()).toBeVisible();
        const a = await new AxeBuilder({ page })
          .include('dialog[data-search]')
          .analyze();
        expect(
          a.violations.map(
            (v) => `${v.id}: ${v.nodes.map((x) => x.target).join(', ')}`,
          ),
        ).toEqual([]);
        await search(page, 'zzzzqx');
        await expect(page.locator('[data-search-empty]')).toBeVisible();
        const b = await new AxeBuilder({ page })
          .include('dialog[data-search]')
          .analyze();
        expect(b.violations.map((v) => v.id)).toEqual([]);
        // No sideways scroll in the dialog at phone width.
        const over = await page
          .locator('dialog[data-search]')
          .evaluate((d) => d.scrollWidth > d.clientWidth);
        expect(over).toBe(false);
      });
    }
  });
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('the dialog appears with no transition', async ({ page }) => {
    await page.goto(page_);
    await pill(page).click();
    const t = await dialog(page).evaluate(
      (d) => getComputedStyle(d).transitionDuration,
    );
    expect(t.split(',').every((x) => Number.parseFloat(x) === 0)).toBe(true);
  });
});
