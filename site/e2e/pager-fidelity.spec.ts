import { expect, type Page, test } from 'playwright/test';

// #18 prev/next fidelity: design/docs-shell/SPEC.md "Pager" (two tickets,
// min 220x44, pad 12 16, radius 14, 2.5px border; kicker muted mono; title
// 14.5px bold; two-up from 768) and Muse's #44 condition on the TOC summary.
const page_ = '/ui/components/lm-motion-toggle/';

async function tickets(page: Page) {
  const pager = page.getByRole('navigation', {
    name: 'Previous and next page',
  });
  await pager.scrollIntoViewIfNeeded();
  const prev = await pager.locator('a.prev').boundingBox();
  const next = await pager.locator('a.next').boundingBox();
  if (!prev || !next) throw new Error('missing pager tickets');
  return { prev, next };
}
const align = (page: Page) =>
  page.locator('.pager a.next').evaluate((e) => getComputedStyle(e).textAlign);

for (const width of [768, 800, 860, 1280, 1440, 1920]) {
  test(`pager is two-up at ${width}, Next aligned end`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(page_);
    const { prev, next } = await tickets(page);
    expect(Math.round(prev.y)).toBe(Math.round(next.y));
    expect(next.x).toBeGreaterThan(prev.x + prev.width);
    expect(await align(page)).toMatch(/^(right|end)$/);
  });
}

for (const width of [375, 767]) {
  test(`pager stacks at ${width}, Next under Previous, left aligned`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(page_);
    const { prev, next } = await tickets(page);
    expect(Math.round(prev.x)).toBe(Math.round(next.x));
    expect(next.y).toBeGreaterThan(prev.y + prev.height);
    expect(await align(page)).toMatch(/^(left|start)$/);
  });
}

test('index at 375: the lone Next ticket has no empty row above it', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/ui/');
  const pager = await page.locator('.pager').boundingBox();
  const next = await page.locator('.pager a.next').boundingBox();
  expect(Math.round(next?.y ?? -1)).toBe(Math.round(pager?.y ?? -2));
});

for (const width of [375, 768, 1280]) {
  test(`ticket metrics match the spec at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(page_);
    const s = await page.locator('.pager a.prev').evaluate((e) => {
      const c = getComputedStyle(e);
      const k = getComputedStyle(e.querySelector('small') as Element);
      const t = getComputedStyle(e.querySelector('strong') as Element);
      const r = e.getBoundingClientRect();
      return {
        pad: c.padding,
        radius: c.borderTopLeftRadius,
        border: c.borderTopWidth,
        h: r.height,
        w: r.width,
        title: t.fontSize,
        titleWeight: t.fontWeight,
        kickerFont: k.fontFamily,
        kickerTracking: k.letterSpacing,
      };
    });
    expect(s.title).toBe('14.5px');
    expect(s.titleWeight).toBe('700');
    expect(s.pad).toBe('12px 16px');
    expect(s.radius).toBe('14px');
    expect(s.border).toMatch(/^2(\.5)?px$/);
    expect(s.h).toBeGreaterThanOrEqual(44);
    expect(s.w).toBeGreaterThanOrEqual(220);
    expect(s.kickerFont).toMatch(/IBM Plex Mono/);
    expect(s.kickerTracking).toBe('1.2px');
  });
}

// --lm-docs-focus: #1f7e7a by day, #ffd27a at night.
const FOCUS = {
  day: 'rgb(31, 126, 122)',
  night: 'rgb(255, 210, 122)',
} as const;
for (const mode of ['day', 'night'] as const) {
  test(`TOC summary shows the shell focus ring from the keyboard (${mode})`, async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(page_);
    const summary = page.locator('.toc-inline summary');
    const focused = () => summary.evaluate((e) => e === document.activeElement);
    // Tab from the top: skip link, menu, wordmark, then the summary.
    for (let i = 0; i < 8 && !(await focused()); i++)
      await page.keyboard.press('Tab');
    // WebKit's default Tab skips links and summaries; focusing after a key
    // press still counts as keyboard focus (:focus-visible).
    if (!(await focused())) await summary.focus();
    const ring = await summary.evaluate((e) => {
      const c = getComputedStyle(e);
      return {
        visible: e.matches(':focus-visible'),
        style: c.outlineStyle,
        width: c.outlineWidth,
        offset: c.outlineOffset,
        color: c.outlineColor,
      };
    });
    expect(ring).toEqual({
      visible: true,
      style: 'solid',
      width: '3px',
      offset: '3px',
      color: FOCUS[mode],
    });
  });
}
