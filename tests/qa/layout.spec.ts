import { expect, test } from 'playwright/test';

function overlaps(
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number },
): boolean {
  return (
    a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top
  );
}

test('globe map outline is unfilled and the dialog is modal', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/demo.html?motion=reduce');
  await page.locator('.lm-globe-btn').click();
  const fill = await page.locator('.lm-globe-stage svg').evaluate((svg) => {
    const outline = [...svg.querySelectorAll('circle')].find(
      (circle) =>
        circle.getAttribute('r') === '500' && circle.hasAttribute('stroke'),
    );
    return {
      svg: getComputedStyle(svg).fill,
      outline: outline ? getComputedStyle(outline).fill : '',
    };
  });
  expect(fill.svg).toBe('none');
  expect(fill.outline).toBe('none');
  const modal = await page.evaluate(() => {
    const dialog = document.querySelector('dialog.lm-globe-overlay');
    const toggle = document.querySelector('lm-motion-toggle button');
    if (!dialog || !toggle) return { modal: false, covered: false };
    const rect = toggle.getBoundingClientRect();
    const top = document.elementFromPoint(
      rect.left + rect.width / 2,
      rect.top + 8,
    );
    return {
      modal: dialog.matches(':modal'),
      covered: top !== toggle && !toggle.contains(top),
    };
  });
  expect(modal.modal).toBe(true);
  expect(modal.covered).toBe(true);
});

test('description stays clear of the close button at 375', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/demo.html?motion=reduce');
  await page.locator('.lm-globe-btn').click();
  const box = await page.evaluate(() => {
    const copy = document.querySelector('.lm-globe-panel p');
    const close = document.querySelector('.lm-globe-close');
    if (!copy || !close) return null;
    const p = copy.getBoundingClientRect();
    const c = close.getBoundingClientRect();
    const pad = Number.parseFloat(getComputedStyle(copy).paddingRight);
    return { right: p.right - pad, left: c.left };
  });
  expect(box).not.toBeNull();
  expect(box?.right ?? 0).toBeLessThanOrEqual((box?.left ?? 0) + 1);
});

test('shot frame is a bordered block', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/demo.html?motion=reduce');
  const frame = page.locator('.lm-shot-frame').first();
  await expect(frame).toBeVisible();
  const style = await frame.evaluate((el) => {
    const computed = getComputedStyle(el);
    return {
      display: computed.display,
      overflow: computed.overflow,
      radius: computed.borderTopLeftRadius,
      border: computed.borderTopWidth,
    };
  });
  expect(style.display).toBe('block');
  expect(style.overflow).toBe('hidden');
  expect(style.border).not.toBe('0px');
  expect(style.radius).not.toBe('0px');
});

for (const width of [320, 375, 768, 1280, 1920]) {
  test(`top bar controls do not overlap at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/demo.html?motion=on');
    const hit = await page.evaluate(() => {
      const globe = document.querySelector('.lm-globe-btn');
      const pause = document.querySelector('lm-pause button');
      const toggle = document.querySelector('lm-motion-toggle button');
      if (!globe || !pause || !toggle) return null;
      const g = globe.getBoundingClientRect();
      const p = pause.getBoundingClientRect();
      const t = toggle.getBoundingClientRect();
      const top = document.elementFromPoint(
        g.left + g.width / 2,
        g.top + g.height / 2,
      );
      return {
        globe: { left: g.left, right: g.right, top: g.top, bottom: g.bottom },
        pause: { left: p.left, right: p.right, top: p.top, bottom: p.bottom },
        toggle: { left: t.left, right: t.right, top: t.top, bottom: t.bottom },
        centerIsGlobe: top === globe || globe.contains(top),
        pauseShown: getComputedStyle(pause).display !== 'none',
      };
    });
    if (!hit) throw new Error('top bar controls missing');
    expect(hit.pauseShown).toBe(true);
    expect(overlaps(hit.globe, hit.pause)).toBe(false);
    expect(overlaps(hit.globe, hit.toggle)).toBe(false);
    expect(hit.centerIsGlobe).toBe(true);
  });
}

test('card copy is 15.62px at 1280 and portrait padding applies on a tall tablet', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/demo.html?motion=reduce');
  const copy = await page
    .locator('lm-card > p:not(.lm-kicker)')
    .first()
    .evaluate((el) => {
      return Number.parseFloat(getComputedStyle(el).fontSize);
    });
  expect(copy).toBeCloseTo(15.62, 1);

  await page.setViewportSize({ width: 768, height: 1024 });
  const portrait = await page.locator('lm-card').evaluate((el) => {
    const style = getComputedStyle(el);
    return {
      pad: style.paddingTop,
      title: getComputedStyle(el.querySelector('h2') as Element).fontSize,
      copy: getComputedStyle(el.querySelector('p:not(.lm-kicker)') as Element)
        .fontSize,
    };
  });
  expect(portrait.pad).toBe('15px');
  expect(portrait.title).toBe('25px');
  expect(portrait.copy).toBe('15.5px');

  await page.setViewportSize({ width: 600, height: 360 });
  const desk = await page.locator('lm-card').evaluate((el) => {
    return getComputedStyle(el).paddingTop;
  });
  expect(desk).toBe('20px');
});

test('more button stays a 33px pill with a 44px hit area', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/demo.html?motion=on');
  const button = page.locator('lm-more button');
  const box = await button.boundingBox();
  if (!box) throw new Error('more button missing');
  expect(box.height).toBeGreaterThan(32);
  expect(box.height).toBeLessThan(36);
  expect(box.width).toBeGreaterThanOrEqual(44);
  await page.mouse.click(box.x + box.width / 2, box.y - 4);
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  const after = await button.boundingBox();
  expect(Math.abs((after?.height ?? 0) - box.height)).toBeLessThan(0.5);
  const slop = await button.evaluate((el) => {
    const pill = el.getBoundingClientRect();
    const hit = el.parentElement?.querySelector('.lm-hit');
    const area = hit?.getBoundingClientRect();
    const above = document.elementFromPoint(
      pill.left + pill.width / 2,
      pill.top - 4,
    );
    const below = document.elementFromPoint(
      pill.left + pill.width / 2,
      pill.bottom + 4,
    );
    const reaches = (node: Element | null) =>
      node === el || el.contains(node) || node === hit;
    return {
      above: reaches(above),
      below: reaches(below),
      hitHeight: area?.height ?? 0,
      hitWidth: area?.width ?? 0,
    };
  });
  expect(slop.hitHeight).toBeGreaterThanOrEqual(44);
  expect(slop.hitWidth).toBeGreaterThanOrEqual(44);
  expect(slop.above).toBe(true);
  expect(slop.below).toBe(true);
});
