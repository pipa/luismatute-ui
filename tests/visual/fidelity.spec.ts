import { mkdirSync } from 'node:fs';
import { test } from 'playwright/test';

const out = '/tmp/visual';
mkdirSync(out, { recursive: true });

test('playground at 1280', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/index.html?motion=reduce');
  await page.waitForSelector('#art svg');
  await page.screenshot({ path: `${out}/playground-1280.png`, fullPage: true });
});

for (const width of [390, 1280]) {
  test(`demo and live sandals stop at ${width}`, async ({ page }) => {
    const height = width === 390 ? 844 : 800;
    await page.setViewportSize({ width, height });
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/demo.html?motion=reduce');
    await page.waitForSelector('lm-card h2');
    await page.screenshot({
      path: `${out}/demo-${width}.png`,
      fullPage: false,
    });

    await page.goto('https://luismatute.me/?motion=reduce', {
      waitUntil: 'networkidle',
    });
    const frame = page
      .locator('.frame[data-stop="sandals"], #stop-sandals')
      .first();
    await frame.scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `${out}/live-${width}.png`,
      fullPage: false,
    });
    await frame
      .screenshot({ path: `${out}/live-stop-${width}.png` })
      .catch(() => {});
  });
}
