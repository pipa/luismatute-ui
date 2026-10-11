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
  expect(await page.locator('html').getAttribute('data-motion')).toBe('reduce');
  const motion = await page.evaluate(() => {
    const hand = getComputedStyle(
      document.querySelector('.lu-hand') as Element,
    );
    const zz = getComputedStyle(document.querySelector('.zz text') as Element);
    return {
      hand: hand.animationName,
      zz: zz.animationName,
      zzState: zz.animationPlayState,
    };
  });
  expect(motion.hand).toBe('none');
  expect(motion.zz === 'none' || motion.zzState === 'paused').toBe(true);
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
      .animationName,
  }));
  expect(names.plain).toBe('none');
  expect(names.flag).toBe('none');
  expect(names.spin).toBe('none');
  expect(names.art).toBe('none');
});

test('avatar idles in Info while illustrations stay still', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.clock.install();
  await page.goto('/fixtures/calm-idle.html?motion=calm');
  await page.waitForSelector('lm-avatar svg');
  await page.evaluate(() => {
    const svg = document.querySelector('lm-avatar svg');
    if (!svg) return;
    const win = window as Window & { __blinks?: number };
    win.__blinks = 0;
    const add = svg.classList.add.bind(svg.classList);
    svg.classList.add = (...tokens: string[]) => {
      if (tokens.includes('blink')) win.__blinks = (win.__blinks ?? 0) + 1;
      add(...tokens);
    };
  });
  await page.clock.fastForward(7000);
  const idle = await page.evaluate(() => {
    const win = window as Window & { __blinks?: number };
    const rays = getComputedStyle(document.querySelector('#rays') as Element);
    const mill = getComputedStyle(document.querySelector('#mill') as Element);
    return {
      blinks: win.__blinks ?? 0,
      motion: document.documentElement.dataset.motion ?? null,
      rays: rays.animationName,
      mill: mill.animationName,
      pauseShown:
        getComputedStyle(document.querySelector('lm-pause button') as Element)
          .display !== 'none',
    };
  });
  expect(idle.motion).toBe('calm');
  expect(idle.blinks).toBeGreaterThan(0);
  expect(idle.rays).toBe('none');
  expect(idle.mill).toBe('none');
  expect(idle.pauseShown).toBe(true);

  await page.locator('lm-pause button').click();
  await page.evaluate(() => {
    (window as Window & { __blinks?: number }).__blinks = 0;
  });
  await page.clock.fastForward(7000);
  const paused = await page.evaluate(() => {
    return {
      blinks: (window as Window & { __blinks?: number }).__blinks ?? 0,
      paused: document.documentElement.classList.contains('paused'),
    };
  });
  expect(paused.paused).toBe(true);
  expect(paused.blinks).toBe(0);
});

test('OS reduced motion stops the avatar in Info', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.clock.install();
  await page.goto('/fixtures/calm-idle.html?motion=calm');
  await page.waitForSelector('lm-avatar svg');
  await page.evaluate(() => {
    const svg = document.querySelector('lm-avatar svg');
    if (!svg) return;
    const win = window as Window & { __blinks?: number };
    win.__blinks = 0;
    const add = svg.classList.add.bind(svg.classList);
    svg.classList.add = (...tokens: string[]) => {
      if (tokens.includes('blink')) win.__blinks = (win.__blinks ?? 0) + 1;
      add(...tokens);
    };
  });
  await page.clock.fastForward(7000);
  const idle = await page.evaluate(() => {
    const win = window as Window & { __blinks?: number };
    return {
      blinks: win.__blinks ?? 0,
      motion: document.documentElement.dataset.motion ?? null,
      rays: getComputedStyle(document.querySelector('#rays') as Element)
        .animationName,
    };
  });
  expect(idle.motion).toBe('calm');
  expect(idle.blinks).toBe(0);
  expect(idle.rays).toBe('none');
});

test('data-motion=full runs illustration motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await page.goto('/fixtures/still-art.html');
  await page.evaluate(() => {
    document.documentElement.dataset.motion = 'full';
  });
  const name = await page.locator('#rays .rays').evaluate((el) => {
    return getComputedStyle(el).animationName;
  });
  expect(name).toContain('lm-spin');
  const mill = await page.locator('#mill .spin').evaluate((el) => {
    return getComputedStyle(el).animationName;
  });
  expect(mill).toContain('lm-spin');
});
