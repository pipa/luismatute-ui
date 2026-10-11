import { expect, test } from 'playwright/test';

test('OS reduced motion stops the avatar without a toggle', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/avatar-only.html');
  await page.waitForSelector('lm-avatar .lu-head');
  const sample = () =>
    page.locator('.lu-head').evaluate((el) => getComputedStyle(el).transform);
  const first = await sample();
  await page.waitForTimeout(700);
  const second = await sample();
  expect(second).toBe(first);
  expect(
    await page
      .locator('lm-avatar svg')
      .evaluate((el) => el.classList.contains('blink')),
  ).toBe(false);
  expect(await page.locator('html').getAttribute('data-motion')).toBeNull();
  const motion = await page.evaluate(() => ({
    hand: getComputedStyle(document.querySelector('.lu-hand') as Element)
      .animationName,
    zz: getComputedStyle(document.querySelector('.zz text') as Element)
      .animationPlayState,
  }));
  expect(motion.hand).toBe('none');
  expect(motion.zz).toBe('paused');
});

test('unscoped classes stay still and OS reduce pauses art', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixtures/motion.html');
  const names = await page.evaluate(() => ({
    plain: getComputedStyle(document.querySelector('p.wave') as Element)
      .animationName,
    flag: getComputedStyle(document.querySelector('.flag') as Element)
      .animationName,
    spin: getComputedStyle(document.querySelector('.spin') as Element)
      .animationName,
    art: getComputedStyle(document.querySelector('.lm-art .wave') as Element)
      .animationPlayState,
  }));
  expect(names.plain).toBe('none');
  expect(names.flag).toBe('none');
  expect(names.spin).toBe('none');
  expect(names.art).toBe('paused');
});
