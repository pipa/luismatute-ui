import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

// Component pages slice 5 (#18): lm-shot and lm-avatar.
const pages = ['lm-shot', 'lm-avatar'] as const;
const at = (p: string, q = '') => `/ui/components/${p}/${q}`;
const sections = [
  'Live demo',
  'Usage',
  'Attributes',
  'CSS custom properties',
  'Events',
  'Accessibility',
  'Reduced motion',
];

async function axe(page: Page, include?: string) {
  const b = new AxeBuilder({ page });
  if (include) b.include(include);
  const r = await b.analyze();
  return r.violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
  );
}

test('both pages exist, are in the nav and have every section heading', async ({
  page,
}) => {
  for (const p of pages) {
    const res = await page.goto(at(p));
    expect(res?.status(), p).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(p);
    await expect(page.locator('main')).not.toContainText('Coming soon');
    for (const s of sections)
      await expect(
        page.getByRole('heading', { level: 2, name: new RegExp(`^${s}`) }),
        `${p}: ${s}`,
      ).toBeVisible();
    await expect(
      page.locator(`nav a[aria-current="page"][href="${at(p)}"]:visible`),
    ).toBeVisible();
    await expect(
      page.getByRole('figure', { name: /^Live demo/ }),
    ).toBeVisible();
  }
});

test('lm-shot demo renders two framed, linked screenshots', async ({
  page,
}) => {
  await page.goto(at('lm-shot'));
  const shots = page.locator('.demo lm-shot');
  await expect(shots).toHaveCount(2);
  for (const i of [0, 1]) {
    const shot = shots.nth(i);
    await expect(shot.locator('.lm-shot-frame .lm-shot-chrome')).toBeVisible();
    await expect(shot.locator('.lm-shot-dots')).toHaveAttribute(
      'aria-hidden',
      'true',
    );
    const img = shot.locator('.lm-shot-frame img');
    await expect(img).toBeVisible();
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() => img.evaluate((e) => (e as HTMLImageElement).naturalWidth))
      .toBe(600);
    const link = shot.getByRole('link');
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', /noopener/);
    await expect(link).toHaveAccessibleName(/\(opens in a new tab\)/);
    await expect(shot.locator('.lm-shot-cap')).toHaveText(/, 20\d\d$/);
  }
  // The frame comes from components.css (base.css): the 2.5px ink border
  // (browsers snap it to 2px at 1x).
  expect(
    await shots
      .first()
      .locator('.lm-shot-frame')
      .evaluate((e) => getComputedStyle(e).borderTopWidth),
  ).toMatch(/^2(\.5)?px$/);
  // Each shot frames its image once, never twice.
  await expect(page.locator('.demo .lm-shot-frame')).toHaveCount(2);
});

test('lm-avatar demo renders, and the pose picker works from the keyboard', async ({
  page,
}) => {
  await page.goto(at('lm-avatar', '?motion=full'));
  const avatar = page.getByRole('img', { name: 'Luis waving from the plane' });
  await expect(avatar).toBeVisible();
  await expect(avatar).toHaveClass(/ex-wave/);
  // Upgraded: the element reuses the server-rendered svg rather than adding one.
  await expect(
    page.locator('.demo lm-avatar').first().locator('svg'),
  ).toHaveCount(1);
  await expect(page.locator('.demo lm-avatar .lm-note')).toHaveText(
    'new docs!',
  );
  const picker = page.getByRole('group', { name: 'Pose' });
  await expect(picker).toBeVisible();
  const sleep = picker.getByRole('button', { name: 'sleep' });
  await sleep.focus();
  await page.keyboard.press('Enter');
  await expect(sleep).toHaveAttribute('aria-pressed', 'true');
  await expect(picker.getByRole('button', { name: 'wave' })).toHaveAttribute(
    'aria-pressed',
    'false',
  );
  await expect(page.locator('.demo lm-avatar').first()).toHaveAttribute(
    'pose',
    'sleep',
  );
  await expect(avatar).toHaveClass(/ex-sleep/);
  await expect(avatar).not.toHaveClass(/ex-wave/);
  const none = picker.getByRole('button', { name: 'none' });
  await none.focus();
  await page.keyboard.press('Space');
  await expect(avatar).not.toHaveClass(/ex-(wave|sleep)/);
  for (const b of await picker.getByRole('button').all())
    expect((await b.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test('lm-avatar waves, and the demo pause control stops the wave', async ({
  page,
}) => {
  await page.goto(at('lm-avatar', '?motion=full'));
  const hand = page.locator('.demo lm-avatar').first().locator('.lu-hand');
  const state = () =>
    hand.evaluate((e) => ({
      name: getComputedStyle(e).animationName,
      play: getComputedStyle(e).animationPlayState,
    }));
  await expect.poll(async () => (await state()).name).toBe('lm-avatar-wave');
  expect((await state()).play).toBe('running');
  await page.getByRole('button', { name: 'Pause animation' }).click();
  await expect(page.locator('.demo-log')).toHaveText(
    'lm-pause {"paused":true}',
  );
  await expect.poll(async () => (await state()).play).toBe('paused');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('lm-avatar holds still: no wave, no idle, pause hidden', async ({
    page,
  }) => {
    await page.goto(at('lm-avatar'));
    const el = page.locator('.demo lm-avatar').first();
    await expect(el.locator('svg')).toBeVisible();
    expect(
      await el
        .locator('.lu-hand')
        .evaluate((e) => getComputedStyle(e).animationName),
    ).toBe('none');
    await page.waitForTimeout(700);
    const head = await el
      .locator('.lu-head')
      .evaluate((e) => (e as SVGGElement).style.transform);
    expect(head).toMatch(/^translate\(0px(, ?0px)?\) rotate\(0deg\)$/);
    await expect(page.locator('.demo lm-pause button')).toBeHidden();
  });
});

test.describe('JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('both demos still show the screenshots, links and portraits', async ({
    page,
  }) => {
    await page.goto(at('lm-shot'));
    await expect(page.locator('.demo img')).toHaveCount(2);
    for (const img of await page.locator('.demo img').all())
      await expect(img).toBeVisible();
    await expect(page.locator('.demo a[target="_blank"]')).toHaveCount(2);
    await page.goto(at('lm-avatar'));
    await expect(
      page.getByRole('img', { name: 'Luis waving from the plane' }),
    ).toBeVisible();
    await expect(page.getByRole('group', { name: 'Pose' })).toBeHidden();
  });
});

for (const mode of ['day', 'night'] as const) {
  test.describe(mode, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });
    for (const p of pages) {
      test(`axe finds nothing on ${p} (1280, motion on)`, async ({ page }) => {
        await page.goto(at(p, '?motion=full'));
        await expect(page.locator('html')).toHaveAttribute(
          'data-mode',
          mode === 'night' ? 'night' : /.*/,
        );
        expect(await axe(page)).toEqual([]);
      });
      test(`axe is clean on ${p} with the frame flipped to the other theme`, async ({
        page,
      }) => {
        await page.goto(at(p, '?motion=full'));
        await page
          .getByRole('button', { name: /Night preview for this demo/ })
          .click();
        expect(await axe(page, '.demo')).toEqual([]);
      });
      test(`${p} has no horizontal overflow at 375`, async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 900 });
        await page.goto(at(p, '?motion=full'));
        const bad = await page.evaluate(() => {
          const de = document.documentElement;
          const out: string[] = [];
          if (de.scrollWidth > de.clientWidth)
            out.push(`page ${de.scrollWidth}>${de.clientWidth}`);
          for (const el of document.querySelectorAll<HTMLElement>(
            '.demo-frame, .demo-stage, .tok-wrap',
          ))
            if (el.scrollWidth > el.clientWidth)
              out.push(`${el.className} ${el.scrollWidth}>${el.clientWidth}`);
          return out;
        });
        expect(bad).toEqual([]);
      });
    }
  });
}

// ---- Muse's calls on #43 ----
const INK_FIXED = 'rgb(43, 27, 20)';

/** Computed stroke of every avatar outline (stroke attr starting var(--lm-ink)). */
async function outlineStrokes(page: Page, scope: string) {
  return page
    .locator(scope)
    .evaluateAll((svgs) =>
      svgs.flatMap((svg) =>
        [...svg.querySelectorAll('[stroke^="var(--lm-ink"]')].map(
          (el) => getComputedStyle(el).stroke,
        ),
      ),
    );
}

test.describe('avatar outlines at night use --lm-ink-fixed', () => {
  test('night page', async ({ context, page }) => {
    await context.addCookies([
      { name: 'lm-mode', value: 'night', domain: '127.0.0.1', path: '/' },
    ]);
    await page.goto(at('lm-avatar', '?motion=full'));
    await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
    const strokes = await outlineStrokes(page, '.demo lm-avatar svg');
    expect(strokes.length).toBeGreaterThanOrEqual(50);
    expect([...new Set(strokes)]).toEqual([INK_FIXED]);
  });
  test('day page with the demo frame flipped to night', async ({ page }) => {
    await page.goto(at('lm-avatar', '?motion=full'));
    await page
      .getByRole('button', { name: /Night preview for this demo/ })
      .click();
    await expect(page.locator('.demo-frame')).toHaveAttribute(
      'data-theme',
      'night',
    );
    const strokes = await outlineStrokes(page, '.demo lm-avatar svg');
    expect([...new Set(strokes)]).toEqual([INK_FIXED]);
  });
});

test('shots stack below 480px with a 16px gap, and sit side by side from 480px', async ({
  page,
}) => {
  const boxes = async () => {
    const shots = page.locator('.demo lm-shot');
    const a = await shots.nth(0).boundingBox();
    const b = await shots.nth(1).boundingBox();
    const grid = await page.locator('.demo .lm-shots').boundingBox();
    if (!a || !b || !grid) throw new Error('missing shot boxes');
    return { a, b, grid };
  };
  await page.setViewportSize({ width: 375, height: 900 });
  await page.goto(at('lm-shot'));
  let { a, b, grid } = await boxes();
  expect(Math.round(a.x)).toBe(Math.round(b.x));
  expect(Math.round(a.width)).toBe(Math.round(grid.width));
  expect(Math.round(b.width)).toBe(Math.round(grid.width));
  expect(Math.round(b.y - (a.y + a.height))).toBe(16);
  await page.setViewportSize({ width: 479, height: 900 });
  ({ a, b } = await boxes());
  expect(b.y).toBeGreaterThan(a.y + a.height);
  for (const w of [480, 768]) {
    await page.setViewportSize({ width: w, height: 900 });
    ({ a, b } = await boxes());
    expect(Math.round(a.y), `${w}`).toBe(Math.round(b.y));
    expect(b.x, `${w}`).toBeGreaterThan(a.x + a.width);
  }
});

for (const mode of ['day', 'night'] as const) {
  test(`pose pills: aria-pressed follows the selection; pressed pill is marigold with a 1px fixed-ink border (${mode})`, async ({
    context,
    page,
  }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.goto(at('lm-avatar', '?motion=full'));
    const picker = page.getByRole('group', { name: 'Pose' });
    const pills = picker.getByRole('button');
    await expect(pills).toHaveCount(9);
    for (const pill of await pills.all())
      await expect(pill).toHaveAttribute('aria-pressed', /^(true|false)$/);
    for (const name of ['beach', 'wink', 'none', 'wave']) {
      await picker.getByRole('button', { name, exact: true }).click();
      const states = await pills.evaluateAll((bs) =>
        bs.map((b) => [b.textContent?.trim(), b.getAttribute('aria-pressed')]),
      );
      expect(
        states.filter(([, p]) => p === 'true').map(([n]) => n),
        name,
      ).toEqual([name]);
      expect(states.every(([, p]) => p === 'true' || p === 'false')).toBe(true);
      const pressed = picker.locator('[aria-pressed="true"]');
      const s = await pressed.evaluate((e) => {
        const c = getComputedStyle(e);
        return {
          bw: c.borderTopWidth,
          bs: c.borderTopStyle,
          bc: c.borderTopColor,
          bg: c.backgroundColor,
          fg: c.color,
        };
      });
      expect(s).toEqual({
        bw: '1px',
        bs: 'solid',
        bc: INK_FIXED,
        bg: 'rgb(246, 180, 60)',
        fg: INK_FIXED,
      });
    }
  });
}
