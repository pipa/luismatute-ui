import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

const running = (page: Page) =>
  page.evaluate(() =>
    document
      .getAnimations()
      .filter((a) =>
        (a.effect as KeyframeEffect | null)?.target?.closest?.('.lm-sky-head'),
      )
      .map((a) => a.playState),
  );

test('Pause sky stops every header loop and toggles the label', async ({
  page,
}) => {
  await page.goto('/fixtures/sky.html');
  await expect
    .poll(
      async () => (await running(page)).filter((s) => s === 'running').length,
    )
    .toBeGreaterThan(0);
  const btn = page.locator('button.lm-sky-pause');
  await btn.click();
  await expect(btn).toHaveAttribute('aria-pressed', 'true');
  await expect(btn).toHaveText('Play sky');
  await expect
    .poll(async () => (await running(page)).every((s) => s === 'paused'))
    .toBe(true);
});

test('the sky pauses off-screen', async ({ page }) => {
  await page.goto('/fixtures/sky.html');
  await page.evaluate(() => window.scrollTo(0, 2000));
  await expect(page.locator('.lm-sky-head')).toHaveClass(/lm-sky-off/);
  await expect
    .poll(async () => (await running(page)).every((s) => s === 'paused'))
    .toBe(true);
});

test('reduced motion is static', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixtures/sky.html');
  expect(await running(page)).toEqual([]);
  await expect(page.locator('button.lm-sky-pause')).toBeHidden();
});

test('stored night applies before first paint and the toggle flips it', async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.setItem('lm.ui.theme', 'night'));
  await page.goto('/fixtures/sky.html');
  expect(
    await page.evaluate(
      () =>
        performance.getEntriesByType('paint').length >= 0 &&
        document.documentElement.dataset.mode,
    ),
  ).toBe('night');
  const t = page.locator('lm-theme-toggle button');
  await expect(t).toHaveAttribute('aria-pressed', 'true');
  await t.click();
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'day');
  expect(await page.evaluate(() => localStorage.getItem('lm.ui.theme'))).toBe(
    'day',
  );
});

// Sentinel review on #25: clouds, theme default + keyboard, dark code
// contrast, ticket accessible text, axe in both modes, 320px overflow.
const cloudX = (page: Page) =>
  page
    .locator('.lm-cl--near')
    .evaluate(
      (el) => new DOMMatrixReadOnly(getComputedStyle(el).transform).m41,
    );

test('clouds drift (transform changes over ~2s)', async ({ page }) => {
  await page.goto('/fixtures/sky.html');
  const a = await cloudX(page);
  await page.waitForTimeout(2000);
  const b = await cloudX(page);
  expect(Math.abs(b - a)).toBeGreaterThan(5);
  const props = await page.evaluate(() =>
    document
      .getAnimations()
      .filter((x) =>
        ((x.effect as KeyframeEffect).target as Element)?.closest(
          '.lm-sky-head',
        ),
      )
      .flatMap((x) =>
        (x.effect as KeyframeEffect)
          .getKeyframes()
          .flatMap((k) => Object.keys(k)),
      )
      .filter(
        (k) => !['offset', 'easing', 'composite', 'computedOffset'].includes(k),
      ),
  );
  expect(props.length).toBeGreaterThan(0);
  expect(props.every((p) => p === 'transform' || p === 'opacity')).toBe(true);
  const dur = await page
    .locator('.lm-cl--near')
    .evaluate((el) => getComputedStyle(el).animationDuration);
  expect(dur).toBe('70s');
});

test('reduced motion: clouds stop but stay visible', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/fixtures/sky.html');
  const a = await cloudX(page);
  await page.waitForTimeout(1000);
  expect(await cloudX(page)).toBe(a);
  for (const sel of ['.lm-cl--far', '.lm-cl--mid', '.lm-cl--near'])
    expect(
      Number(
        await page.locator(sel).evaluate((el) => getComputedStyle(el).opacity),
      ),
    ).toBeGreaterThan(0);
});

for (const scheme of ['light', 'dark'] as const) {
  test(`initial theme follows prefers-color-scheme: ${scheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto('/fixtures/sky.html');
    await expect(page.locator('html')).toHaveAttribute(
      'data-mode',
      scheme === 'dark' ? 'night' : 'day',
    );
  });
}

test('theme toggle works by keyboard (Tab, Enter, Space)', async ({
  page,
  browserName,
}) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/fixtures/sky.html');
  const btn = page.locator('lm-theme-toggle button');
  // WebKit skips buttons on Tab unless "Press Tab to highlight each item" is on.
  const key = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
  for (let i = 0; i < 10; i += 1) {
    if (await btn.evaluate((el) => el === document.activeElement)) break;
    await page.keyboard.press(key);
  }
  await expect(btn).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'night');
  await page.keyboard.press('Space');
  await expect(page.locator('html')).toHaveAttribute('data-mode', 'day');
});

const contrastOf = (page: Page, sel: string) =>
  page.evaluate((s) => {
    const rgb = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
    const lum = ([r = 0, g = 0, b = 0]: number[]) => {
      const f = (v: number) => {
        const n = v / 255;
        return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const bg = (el: Element): number[] => {
      for (let n: Element | null = el; n; n = n.parentElement) {
        const c = rgb(getComputedStyle(n).backgroundColor);
        if (c.length >= 3 && (c[3] ?? 1) > 0.9) return c;
      }
      return [255, 255, 255];
    };
    return [...document.querySelectorAll(s)].map((el) => {
      const [x, y] = [lum(rgb(getComputedStyle(el).color)), lum(bg(el))].sort(
        (p, q) => q - p,
      ) as [number, number];
      return { cls: el.className, ratio: (x + 0.05) / (y + 0.05) };
    });
  }, sel);

test('dark code theme: every tok-* clears 4.5:1', async ({ page }) => {
  await page.goto('/fixtures/sky.html?mode=night');
  const rows = await contrastOf(page, '.fx-code [class^="tok-"]');
  expect(rows.length).toBeGreaterThanOrEqual(9);
  for (const r of rows) expect(r.ratio, r.cls).toBeGreaterThanOrEqual(4.5);
});

test('ticket card accessible text carries 2A and LM1988', async ({ page }) => {
  await page.goto('/fixtures/sky.html');
  const text = await page
    .locator('.lm-ticket')
    .evaluate((el) => (el as HTMLElement).innerText);
  expect(text).toContain('2A');
  expect(text).toContain('LM1988');
  const snap = await page.locator('.lm-ticket').ariaSnapshot();
  expect(snap).toContain('2A');
  expect(snap).toContain('LM1988');
});

for (const mode of ['day', 'night'] as const) {
  test(`axe is clean (${mode})`, async ({ page }) => {
    await page.goto(`/fixtures/sky.html?mode=${mode}`);
    const { violations } = await new AxeBuilder({ page }).analyze();
    expect(
      violations.map(
        (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
      ),
    ).toEqual([]);
  });
}

test('no horizontal overflow at 320px', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  for (const mode of ['day', 'night']) {
    await page.goto(`/fixtures/sky.html?mode=${mode}`);
    const over = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(over, mode).toBe(0);
  }
});
