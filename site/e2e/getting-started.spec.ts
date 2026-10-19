import { readFileSync } from 'node:fs';
import { expect, test } from 'playwright/test';

const pkg = JSON.parse(
  readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
);
const pages = [
  ['getting-started/install-from-a-tag', 'Install from a tag'],
  ['getting-started/astro-usage', 'Astro usage'],
  ['getting-started/bare-imports', 'Bare imports'],
  ['changelog', 'Changelog'],
] as const;

for (const [slug, title] of pages) {
  test(`${slug} is a real page, not a stub`, async ({ page }) => {
    const res = await page.goto(`/ui/${slug}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toHaveText(title);
    await expect(page.locator('main')).not.toContainText('Coming soon');
    await expect(page.locator('main')).not.toContainText('being written');
    expect(await page.locator('main h2[id]').count()).toBeGreaterThan(1);
  });
}

test('install snippet uses the package name and current tag', async ({
  page,
}) => {
  await page.goto('/ui/getting-started/install-from-a-tag/');
  await expect(page.locator('main pre').first()).toHaveText(
    `pnpm add github:pipa/luismatute-ui#v${pkg.version}`,
  );
  await expect(page.locator('main')).toContainText(`"${pkg.name}"`);
});

test('sidebar keeps Getting started order, then Changelog', async ({
  page,
}) => {
  await page.goto('/ui/getting-started/astro-usage/');
  const hrefs = await page
    .locator(
      'nav a[href^="/ui/getting-started/"], nav a[href="/ui/changelog/"]',
    )
    .evaluateAll((as) => [...new Set(as.map((a) => a.getAttribute('href')))]);
  expect(hrefs).toEqual([
    '/ui/getting-started/install-from-a-tag/',
    '/ui/getting-started/astro-usage/',
    '/ui/getting-started/bare-imports/',
    '/ui/changelog/',
  ]);
});

test('changelog: dated h2 per version, groups as h3, TOC lists versions only', async ({
  page,
}) => {
  const md = readFileSync(
    new URL('../../CHANGELOG.md', import.meta.url),
    'utf8',
  );
  const heads = [...md.matchAll(/^## (\S+) - (\S+)$/gm)].map((m) => ({
    v: m[1] ?? '',
    d: m[2] ?? '',
  }));
  await page.goto('/ui/changelog/');
  // The h2 text includes the Heading anchor, so compare ids.
  const ids = await page
    .locator('main h2[id]')
    .evaluateAll((hs) => hs.map((h) => h.id));
  expect(ids).toEqual(
    heads.map((h) => `v${h.v}`.replace(/[^a-z0-9]+/gi, '-').toLowerCase()),
  );
  const dates = await page
    .locator('main h2 time')
    .evaluateAll((ts) => ts.map((t) => t.getAttribute('datetime')));
  expect(dates).toEqual(heads.map((h) => h.d));
  expect(await page.locator('main h3[id] a.anchor').count()).toBeGreaterThan(
    heads.length - 1,
  );
  await expect(page.locator('main hr.docs-flight')).toHaveCount(
    heads.length - 1,
  );
  const toc = await page
    .locator('aside.toc a')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(toc).toEqual(ids.map((id) => `#${id}`));
});

test('bare imports lists every package export path', async ({ page }) => {
  await page.goto('/ui/getting-started/bare-imports/');
  const paths = Object.keys(pkg.exports).map((k) => `${pkg.name}${k.slice(1)}`);
  const cells = await page
    .locator('main .api-table tbody td:first-child button.tok-copy')
    .allTextContents();
  expect(cells).toEqual(paths);
});
