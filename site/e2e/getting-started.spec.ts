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

test('changelog kicker is just Changelog', async ({ page }) => {
  await page.goto('/ui/changelog/');
  await expect(page.locator('.crumb')).toHaveText('Changelog');
});

test('getting started pages keep the group / title kicker', async ({
  page,
}) => {
  for (const [slug, title] of pages) {
    if (!slug.startsWith('getting-started/')) continue;
    await page.goto(`/ui/${slug}/`);
    await expect(page.locator('.crumb')).toHaveText(
      `Getting started / ${title}`,
    );
  }
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

for (const mode of ['day', 'night'] as const) {
  test(`${mode}: pages stay within 375px (no sideways scroll)`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.setViewportSize({ width: 375, height: 812 });
    for (const [slug] of pages) {
      await page.goto(`/ui/${slug}/`);
      await expect(page.locator('html')).toHaveAttribute('data-mode', mode);
      const scrollWidth = await page.evaluate(
        () => document.documentElement.scrollWidth,
      );
      expect(scrollWidth, slug).toBeLessThanOrEqual(375);
    }
  });
}

test('bare imports lists every package export path', async ({ page }) => {
  await page.goto('/ui/getting-started/bare-imports/');
  const paths = Object.keys(pkg.exports).map((k) => `${pkg.name}${k.slice(1)}`);
  const cells = await page
    .locator('main .api-table tbody td:first-child button.tok-copy')
    .allTextContents();
  expect(cells).toEqual(paths);
});

// Layout as it renders today. Crumb text is pinned by the kicker specs above;
// here only its place (directly above the h1) is checked. A new kicker design
// is pending Muse.
const layout = [
  {
    slug: 'getting-started/install-from-a-tag',
    callout: { cls: 'callout-note', label: 'Note' },
    prev: null,
    next: '/ui/getting-started/astro-usage/',
  },
  {
    slug: 'getting-started/astro-usage',
    callout: { cls: 'callout-tip', label: 'Tip' },
    prev: '/ui/getting-started/install-from-a-tag/',
    next: '/ui/getting-started/bare-imports/',
  },
  {
    slug: 'getting-started/bare-imports',
    callout: null,
    prev: '/ui/getting-started/astro-usage/',
    next: '/ui/foundations/colour/',
  },
  {
    slug: 'changelog',
    callout: null,
    prev: '/ui/illustrations/svg-kit/',
    next: null,
  },
] as const;

for (const l of layout) {
  test(`${l.slug}: crumb, callout and pager`, async ({ page }) => {
    await page.goto(`/ui/${l.slug}/`);
    const main = page.locator('main');
    // kicker (crumb) sits directly above the h1
    await expect(main.locator('p.crumb + h1')).toHaveCount(1);

    const callouts = main.locator('aside.callout');
    if (l.callout) {
      await expect(callouts).toHaveCount(1);
      const c = callouts.first();
      await expect(c).toHaveClass(new RegExp(`\\b${l.callout.cls}\\b`));
      // <aside> exposes the complementary role; its label is the lead word
      expect(await c.evaluate((el) => el.tagName)).toBe('ASIDE');
      await expect(c.locator('strong').first()).toHaveText(l.callout.label);
      await expect(
        main.getByRole('complementary').filter({ hasText: l.callout.label }),
      ).toHaveCount(1);
    } else {
      await expect(callouts).toHaveCount(0);
    }

    const pager = page.getByRole('navigation', {
      name: 'Previous and next page',
    });
    await expect(pager).toHaveCount(1);
    const prev = pager.locator('a.prev');
    const next = pager.locator('a.next');
    if (l.prev) await expect(prev).toHaveAttribute('href', l.prev);
    else await expect(prev).toHaveCount(0);
    if (l.next) await expect(next).toHaveAttribute('href', l.next);
    else await expect(next).toHaveCount(0);
    for (const a of await pager.locator('a').all()) {
      const href = (await a.getAttribute('href')) ?? '';
      const res = await page.request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });
}
