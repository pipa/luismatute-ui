import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

// #18 TOC and prev/next slice. Spec: design/docs-shell/SPEC.md ("On this
// page", "Pager"); shots component-{375,768,1280,1440}-{light,dark}.png.
const page_ = '/ui/components/lm-motion-toggle/';
const inline = (p: Page) => p.locator('.toc-inline');
const summary = (p: Page) => p.locator('.toc-inline summary');

for (const width of [375, 768]) {
  test(`inline "On this page" at ${width}: closed, opens by keyboard, jumps, closes`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(page_);
    await expect(page.locator('aside.toc')).toBeHidden();
    await expect(summary(page)).toBeVisible();
    await expect(inline(page).getByRole('link')).toHaveCount(0);
    const box = await summary(page).boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    // Sits above the crumb and title, at the top of the content column.
    const crumb = await page.locator('.crumb').boundingBox();
    expect((box?.y ?? 0) + (box?.height ?? 0)).toBeLessThan(crumb?.y ?? 0);
    await summary(page).focus();
    await page.keyboard.press('Enter');
    await expect(inline(page)).toHaveAttribute('open', '');
    const links = inline(page)
      .getByRole('navigation', { name: 'On this page' })
      .getByRole('link');
    await expect(links).toHaveText([
      'Live demo',
      'Usage',
      'Attributes',
      'CSS custom properties',
      'Events',
      'Accessibility',
      'Reduced motion',
    ]);
    await expect(inline(page).locator('a[aria-current="true"]')).toHaveText(
      'Live demo',
    );
    await page.keyboard.press('Tab');
    await expect(links.first()).toBeFocused();
    await links.filter({ hasText: 'Events' }).click();
    await expect(page).toHaveURL(/#events$/);
    await expect(page.locator('#events')).toBeInViewport();
    await summary(page).focus();
    await page.keyboard.press('Space');
    await expect(inline(page)).not.toHaveAttribute('open', '');
  });
}

test('aside and inline TOC hand over at 1180/1181: never both, never neither', async ({
  page,
}) => {
  await page.goto(page_);
  for (const [w, asideOn] of [
    [1180, false],
    [1181, true],
    [1280, true],
    [1440, true],
    [1920, true],
  ] as const) {
    await page.setViewportSize({ width: w, height: 900 });
    await expect(page.locator('aside.toc ul'), `${w}`).toBeVisible({
      visible: asideOn,
    });
    await expect(summary(page), `${w}`).toBeVisible({ visible: !asideOn });
  }
});

for (const mode of ['day', 'night'] as const) {
  test.describe(mode, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });
    test('current section carries the 3px accent bar in the aside (1280)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto(page_);
      const cur = page.locator('.toc a[aria-current="true"]');
      await expect(cur).toHaveText('Live demo');
      const s = await cur.evaluate((e) => ({
        shadow: getComputedStyle(e).boxShadow,
        weight: getComputedStyle(e).fontWeight,
      }));
      expect(s.shadow).toContain(
        mode === 'day' ? 'rgb(246, 180, 60)' : 'rgb(255, 210, 122)',
      );
      expect(s.shadow).toMatch(/inset/);
      expect(s.weight).toBe('700');
    });
    test('axe is clean with the inline TOC open (375)', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 });
      await page.goto(page_);
      await summary(page).click();
      const r = await new AxeBuilder({ page }).include('.toc-inline').analyze();
      expect(r.violations.map((v) => v.id)).toEqual([]);
    });
  });
}

test.describe('JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('the inline TOC still opens and its links work', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(page_);
    await summary(page).click();
    await inline(page).getByRole('link', { name: 'Accessibility' }).click();
    await expect(page).toHaveURL(/#accessibility$/);
  });
});

test('prev/next: every pager link is a real page, in sidebar order', async ({
  page,
}) => {
  // Sidebar order, read from the built site (the index page's sidebar).
  await page.goto('/ui/');
  const sidebar = await page
    .locator('aside.side nav a')
    .evaluateAll((as) => as.map((a) => a.getAttribute('href') ?? ''));
  expect(sidebar.length).toBeGreaterThanOrEqual(19);
  const hrefs = ['/ui/', ...sidebar];
  for (const [i, href] of hrefs.entries()) {
    const res = await page.goto(href);
    expect(res?.status(), href).toBe(200);
    const pager = page.getByRole('navigation', {
      name: 'Previous and next page',
    });
    const prev = pager.locator('a.prev');
    const next = pager.locator('a.next');
    // The index isn't in the sidebar: it links on to the first page, and
    // the first page has no Previous.
    if (i <= 1) await expect(prev).toHaveCount(0);
    else await expect(prev).toHaveAttribute('href', hrefs[i - 1] ?? '');
    if (i >= hrefs.length - 1) await expect(next).toHaveCount(0);
    else await expect(next).toHaveAttribute('href', hrefs[i + 1] ?? '');
    for (const a of await pager.getByRole('link').all()) {
      const target = await a.getAttribute('href');
      const r = await page.request.get(target ?? '');
      expect(r.status(), `${href} -> ${target}`).toBe(200);
    }
  }
});
