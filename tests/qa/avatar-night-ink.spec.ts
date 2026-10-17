import { expect, test } from 'playwright/test';

// Muse (#43): the avatar's linework is --lm-ink-fixed, so it stays dark ink at
// night on every page that renders it, including the older demos.
const INK_FIXED = 'rgb(43, 27, 20)';
const pages = [
  '/demo.html',
  '/avatar-only.html',
  '/index.html',
  '/fixtures/avatar-poses.html',
  '/fixtures/calm-idle.html',
];

for (const path of pages) {
  test(`night avatar outlines resolve to --lm-ink-fixed on ${path}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${path}?motion=reduce`);
    await page.waitForSelector('lm-avatar svg.lu');
    await page.evaluate(() => {
      document.documentElement.dataset.mode = 'night';
    });
    const strokes = await page
      .locator('lm-avatar svg.lu')
      .evaluateAll((svgs) =>
        svgs.flatMap((svg) =>
          [...svg.querySelectorAll('[stroke^="var(--lm-ink"]')].map(
            (el) => getComputedStyle(el).stroke,
          ),
        ),
      );
    expect(strokes.length).toBeGreaterThanOrEqual(25);
    expect([...new Set(strokes)]).toEqual([INK_FIXED]);
    // Night really is on: the page ink token turned cream.
    expect(
      await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue('--lm-ink')
          .trim(),
      ),
    ).toBe('#fff6e4');
  });
}
