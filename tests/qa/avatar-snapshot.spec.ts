import { expect, test } from 'playwright/test';

const POSES = [
  '',
  'wow',
  'wave',
  'read',
  'beach',
  'grad',
  'sleep',
  'wink',
  'eek',
] as const;

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/fixtures/avatar-poses.html?motion=reduce');
  await page.waitForSelector('lm-avatar svg.lu');
});

test('lm-avatar DOM stays on the v0.1.2 portrait for every pose', async ({
  page,
}) => {
  const shots = await page.evaluate((poses) => {
    const nodes = [...document.querySelectorAll('lm-avatar')];
    return poses.map((pose, i) => {
      const avatar = nodes[i];
      const svg = avatar?.querySelector('svg');
      return {
        pose: pose || 'idle',
        className: svg?.getAttribute('class') ?? '',
        markup: svg?.outerHTML ?? '',
      };
    });
  }, POSES);
  for (const shot of shots) {
    expect(shot.markup, shot.pose).toBeTruthy();
    expect(shot.markup, shot.pose).toContain('lu-wave');
    expect(shot.markup, shot.pose).toContain('lu-shades');
    expect(shot.markup, shot.pose).not.toContain('lu-glasses');
    expect(shot.markup, shot.pose).toContain('var(--lm-skin-highlight)');
    expect(shot.className, shot.pose).toContain('lu');
    if (shot.pose !== 'idle')
      expect(shot.className).toContain(`ex-${shot.pose}`);
    expect(shot.markup).toMatchSnapshot(`avatar-${shot.pose}.svg`);
  }
});

test('lm-avatar pixels stay on the v0.1.2 portrait for every pose', async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== 'chromium', 'pixel baseline is Chromium');
  const avatars = page.locator('lm-avatar');
  await expect(avatars).toHaveCount(POSES.length);
  for (let i = 0; i < POSES.length; i++) {
    const pose = POSES[i] || 'idle';
    await expect(avatars.nth(i)).toHaveScreenshot(`avatar-${pose}.png`, {
      animations: 'disabled',
    });
  }
});
