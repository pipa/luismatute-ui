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
    return getComputedStyle(el).animationName;
  });
  expect(state).toBe('none');
  const plain = await page.locator('p.wave').evaluate((el) => {
    return getComputedStyle(el).animationName;
  });
  expect(plain).toBe('none');
});

test('server-rendered art rests with JavaScript off and no motion preference', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/fixtures/still-art.html');
  const pose = await page.evaluate(() => {
    const rotation = (transform: string) => {
      if (transform === 'none') return 0;
      const named = transform.match(/rotate\(([-\d.]+)deg\)/);
      if (named?.[1]) return Number(named[1]);
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (!matrix?.[1]) return Number.NaN;
      const [a, b] = matrix[1]
        .split(',')
        .map((part) => Number.parseFloat(part));
      return (Math.atan2(b ?? 0, a ?? 0) * 180) / Math.PI;
    };
    const styleOf = (selector: string) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const style = getComputedStyle(el);
      return {
        name: style.animationName,
        state: style.animationPlayState,
        transform: style.transform,
        angle: rotation(style.transform),
      };
    };
    const running = [...document.querySelectorAll('*')].filter((el) => {
      for (const pseudo of ['', '::before', '::after']) {
        const style = pseudo
          ? getComputedStyle(el, pseudo)
          : getComputedStyle(el);
        if (
          style.animationName !== 'none' &&
          style.animationPlayState === 'running'
        )
          return true;
      }
      return false;
    }).length;
    const rays = document.querySelector(
      '#rays .rays',
    ) as SVGGraphicsElement | null;
    const svg = rays?.ownerSVGElement ?? null;
    const raysBox = rays?.getBoundingClientRect();
    const svgBox = svg?.getBoundingClientRect();
    return {
      running,
      motion: document.documentElement.dataset.motion ?? null,
      rays: styleOf('#rays .rays'),
      palm: styleOf('#palm .sway'),
      sock: styleOf('#sock .sway'),
      mill: styleOf('#mill .spin'),
      prop: styleOf('#plane .sp'),
      raysWidth: raysBox?.width ?? 0,
      svgWidth: svgBox?.width ?? 0,
      raysHeight: raysBox?.height ?? 0,
      svgHeight: svgBox?.height ?? 0,
    };
  });
  expect(pose.motion).toBeNull();
  expect(pose.running).toBe(0);
  for (const part of [pose.rays, pose.palm, pose.sock, pose.mill, pose.prop]) {
    expect(part?.name).toBe('none');
  }
  expect(Math.abs(pose.palm?.angle ?? 99)).toBeLessThan(0.5);
  expect(Math.abs(pose.sock?.angle ?? 99)).toBeLessThan(0.5);
  expect(Math.abs((pose.mill?.angle ?? 0) - 45)).toBeLessThan(0.5);
  expect(pose.rays?.transform).toBe('none');
  expect(pose.raysWidth).toBeGreaterThan(pose.svgWidth * 0.9);
  expect(pose.raysHeight).toBeGreaterThan(pose.svgHeight * 0.9);
});
