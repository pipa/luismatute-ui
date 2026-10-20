import { expect, type Page, test } from 'playwright/test';

// #49: heading-level search results (Pagefind sub_results). Run
// `pnpm build:site` first. On #48 the dialog showed one option per page, so a
// match under a heading had no option linking to that heading's anchor.
const page_ = '/ui/getting-started/';
const pill = (p: Page) => p.locator('button.search-open[data-search-open]');
const input = (p: Page) => p.getByRole('combobox', { name: 'Search the docs' });
const options = (p: Page) =>
  p.getByRole('listbox', { name: 'Results' }).getByRole('option');
const active = (p: Page) =>
  input(p).evaluate((e) => e.getAttribute('aria-activedescendant'));

async function search(p: Page, q: string) {
  await input(p).fill(q);
}

test('a heading match gets its own option linking to the anchor', async ({
  page,
}) => {
  await page.goto(page_);
  await pill(page).click();
  await search(page, 'reduced motion');
  const sub = options(page).filter({
    has: page.locator('xpath=self::*[contains(@href, "#reduced-motion")]'),
  });
  await expect(sub.first()).toBeVisible();
  const hrefs = await options(page).evaluateAll((os) =>
    os.map((o) => o.getAttribute('href') ?? ''),
  );
  // Each sub-result follows its page's own option.
  for (const [i, h] of hrefs.entries()) {
    if (!h.includes('#')) continue;
    const base = h.split('#')[0];
    expect(hrefs.slice(0, i)).toContain(base);
  }
  expect(hrefs.length).toBeLessThanOrEqual(8);
});

test('arrow keys reach a sub-result and Enter lands on its heading', async ({
  page,
}) => {
  await page.goto(page_);
  await pill(page).click();
  await search(page, 'reduced motion');
  await expect(options(page).first()).toBeVisible();
  const hrefs = await options(page).evaluateAll((os) =>
    os.map((o) => o.getAttribute('href') ?? ''),
  );
  const idx = hrefs.findIndex((h) => h.includes('#'));
  expect(idx).toBeGreaterThan(0);
  for (let i = 0; i < idx; i++) await page.keyboard.press('ArrowDown');
  await expect.poll(() => active(page)).toBe(`search-hit-${idx}`);
  await expect(options(page).nth(idx)).toHaveAttribute('aria-selected', 'true');
  await expect(input(page)).toBeFocused();
  await page.keyboard.press('Enter');
  const [path, hash] = (hrefs[idx] ?? '').split('#');
  await expect(page).toHaveURL(new RegExp(`${path}#${hash}$`));
  await expect(page.locator(`[id="${hash}"]`)).toBeVisible();
});
