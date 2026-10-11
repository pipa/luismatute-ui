import { expect, test } from 'playwright/test';

test.use({ javaScriptEnabled: false });

test('avatar and shot render without JavaScript', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/demo.html');
  await expect(page.locator('lm-avatar svg')).toBeVisible();
  await expect(page.locator('.lm-shot-frame img').first()).toBeVisible();
});

test('OS reduced motion pauses art with JavaScript off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixtures/motion.html');
  const state = await page.locator('.lm-art .wave').evaluate((el) => {
    return getComputedStyle(el).animationPlayState;
  });
  expect(state).toBe('paused');
  const plain = await page.locator('p.wave').evaluate((el) => {
    return getComputedStyle(el).animationName;
  });
  expect(plain).toBe('none');
});
