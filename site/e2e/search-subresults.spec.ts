import { expect, type Page, test } from 'playwright/test';

// #49: heading-level search results (Pagefind sub_results). Run
// `pnpm build:site` first. On #48 the dialog showed one option per page, so a
// match under a heading had no option linking to that heading's anchor.
const page_ = '/ui/getting-started/';
const pill = (p: Page) => p.locator('button.search-open[data-search-open]');
const input = (p: Page) => p.getByRole('combobox', { name: 'Search pages' });
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

test('at most 2 heading options per page, named "<heading>, in <page>"', async ({
  page,
}) => {
  await page.goto(page_);
  await pill(page).click();
  for (const q of ['reduced motion', 'usage', 'attributes']) {
    await search(page, q);
    await expect(options(page).first()).toBeVisible();
    const rows = await options(page).evaluateAll((os) =>
      os.map((o) => ({
        href: o.getAttribute('href') ?? '',
        label: o.getAttribute('aria-label'),
        heading: o.querySelector('.search-title')?.textContent ?? '',
        sub: o.classList.contains('search-hit-sub'),
        parent: o.parentElement?.getAttribute('role'),
      })),
    );
    const titles = new Map(
      rows.filter((r) => !r.sub).map((r) => [r.href, r.heading]),
    );
    const per = new Map<string, number>();
    for (const r of rows) {
      expect(r.parent).toBe('listbox');
      if (!r.href.includes('#')) {
        expect(r.label).toBeNull();
        continue;
      }
      const base = r.href.split('#')[0] ?? '';
      per.set(base, (per.get(base) ?? 0) + 1);
      expect(r.sub).toBe(true);
      expect(r.label).toBe(`${r.heading}, in ${titles.get(base)}`);
    }
    for (const n of per.values()) expect(n).toBeLessThanOrEqual(2);
  }
  // Accessible name, not just the attribute.
  await search(page, 'reduced motion');
  const sub = page.locator('[data-search-sub]').first();
  await expect(sub).toBeVisible();
  const name = await sub.getAttribute('aria-label');
  expect(name).toMatch(/^.+, in .+$/);
  await expect(
    page.getByRole('option', { name: name ?? '', exact: true }),
  ).toHaveCount(1);
});

// #68: the exact accessible name of one known sub-result, so a changed
// separator or a dropped page title fails here, not only in the unit test.
test('a known sub-result is named "Install, in Install from a tag"', async ({
  page,
}) => {
  await page.goto(page_);
  await pill(page).click();
  await search(page, 'install');
  const opt = page.getByRole('option', {
    name: 'Install, in Install from a tag',
    exact: true,
  });
  await expect(opt).toHaveCount(1);
  await expect(opt).toHaveAttribute(
    'href',
    '/ui/getting-started/install-from-a-tag/#install',
  );
  await expect(opt.locator('.search-title')).toHaveText('Install');
});
