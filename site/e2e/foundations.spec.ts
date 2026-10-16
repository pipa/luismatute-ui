import { expect, test } from 'playwright/test';

const pages = ['colour', 'type', 'spacing', 'radius', 'motion-tokens'];

test('every foundations page renders tokens as copy buttons', async ({
  page,
}) => {
  for (const p of pages) {
    await page.goto(`/ui/foundations/${p}/`);
    await expect(page.locator('h1')).toBeVisible();
    expect(await page.locator('button.tok-copy').count(), p).toBeGreaterThan(4);
    await expect(page.locator('code.tok')).toHaveCount(0);
  }
});

test('token copy works by keyboard (Enter and Space) and announces', async ({
  page,
  context,
  browserName,
}) => {
  if (browserName === 'chromium')
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await page.goto('/ui/foundations/spacing/');
  const name = page.getByRole('button', { name: 'Copy var(--lm-space-8)' });
  const value = page.getByRole('button', {
    name: 'Copy value of --lm-space-8',
  });
  await name.focus();
  await page.keyboard.press('Enter');
  const live = page.locator('#copy-live');
  await expect(live).toHaveText(
    /Copied var\(--lm-space-8\)|Text selected, press/,
  );
  if (browserName === 'chromium') {
    await expect(name).toHaveAttribute('data-copied', '');
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      'var(--lm-space-8)',
    );
  }
  await page.keyboard.press('Tab');
  await expect(value).toBeFocused();
  await page.keyboard.press('Space');
  await expect(live).toHaveText(/Copied 8px|Text selected, press/);
  if (browserName === 'chromium')
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      '8px',
    );
});

test('swatch labels have AA contrast on their swatch', async ({ page }) => {
  await page.goto('/ui/foundations/colour/');
  const worst = await page.evaluate(() => {
    const rgb = (s: string) =>
      (s.match(/[\d.]+/g) ?? []).map(Number).slice(0, 3);
    const lum = (c: number[]) => {
      const f = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return (
        0.2126 * f(c[0] ?? 0) + 0.7152 * f(c[1] ?? 0) + 0.0722 * f(c[2] ?? 0)
      );
    };
    let min = 99;
    for (const li of document.querySelectorAll<HTMLElement>('.swatch')) {
      const s = getComputedStyle(li);
      const bg = rgb(s.boxShadow); // inset shadow carries the swatch colour
      const fg = rgb(s.color);
      const [a, b] = [lum(fg), lum(bg)].sort((x, y) => y - x) as [
        number,
        number,
      ];
      // Alpha swatches blend over the base; only check opaque shadows here.
      if (!/rgba\([^)]*,\s*0?\.\d+\)/.test(s.boxShadow))
        min = Math.min(min, (a + 0.05) / (b + 0.05));
    }
    return min;
  });
  expect(worst).toBeGreaterThanOrEqual(4.5);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('easing demos jump instead of animating', async ({ page }) => {
    await page.goto('/ui/foundations/motion-tokens/');
    const dur = await page
      .locator('.pv-dot')
      .first()
      .evaluate((d) => getComputedStyle(d).transitionDuration);
    expect(dur).toBe('0s');
  });
});

test.describe('with JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('tokens stay readable as code', async ({ page }) => {
    await page.goto('/ui/foundations/colour/');
    await expect(page.locator('code.tok').first()).toHaveText('--lm-ink');
    await expect(page.locator('button.tok-copy')).toHaveCount(0);
  });
});

for (const mode of ['day', 'night']) {
  test(`swatch names use the label colour and values aren't clipped (${mode})`, async ({
    page,
    context,
  }) => {
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    for (const js of [true, false]) {
      if (!js) await page.route('**/*.js', (r) => r.abort());
      await page.goto('/ui/foundations/colour/');
      const problems = await page.evaluate(() =>
        [...document.querySelectorAll<HTMLElement>('.swatch')].flatMap((li) => {
          const [name, value] = li.querySelectorAll<HTMLElement>('.tok');
          if (!name || !value) return ['missing tokens'];
          const out: string[] = [];
          const label = getComputedStyle(li).color;
          for (const el of [
            name,
            value,
            ...name.querySelectorAll<HTMLElement>('*'),
          ]) {
            const c = getComputedStyle(el);
            if (c.color !== label || c.webkitTextFillColor !== label)
              out.push(
                `${name.textContent} colour ${c.color}/${c.webkitTextFillColor} != ${label}`,
              );
          }
          const L = li.getBoundingClientRect();
          const V = value.getBoundingClientRect();
          if (
            value.scrollHeight > value.clientHeight ||
            V.bottom > L.bottom ||
            V.top < L.top
          )
            out.push(
              `${name.textContent} value clipped ${value.scrollHeight}/${value.clientHeight}`,
            );
          // The line box (line-height) must fit inside the value element's content.
          const lh = Number.parseFloat(getComputedStyle(value).lineHeight);
          if (lh > value.clientHeight)
            out.push(
              `${name.textContent} line box ${lh} > ${value.clientHeight}`,
            );
          return out;
        }),
      );
      expect(problems, js ? 'with JS' : 'without JS').toEqual([]);
    }
  });
}
