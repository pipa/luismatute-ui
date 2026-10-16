import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

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
    // JS-off runs are day-only in effect: theme-init needs JS to read lm-mode.
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

/**
 * WCAG contrast of every swatch name and value against its effective
 * background: walk up from the text, compositing semi-transparent
 * background-colors until an opaque one is reached.
 */
async function worstSwatchContrast(page: Page) {
  return page.evaluate(() => {
    type C = [number, number, number, number];
    const parse = (s: string): C => {
      const n = (s.match(/[\d.]+/g) ?? []).map(Number);
      return [n[0] ?? 0, n[1] ?? 0, n[2] ?? 0, n[3] ?? 1];
    };
    const over = (top: C, under: C): C => {
      const a = top[3];
      return [0, 1, 2]
        .map((i) => (top[i] as number) * a + (under[i] as number) * (1 - a))
        .concat(1) as C;
    };
    const effectiveBg = (el: Element | null): C => {
      const layers: C[] = [];
      for (let e = el; e; e = e.parentElement) {
        const c = parse(getComputedStyle(e).backgroundColor);
        if (
          /transparent/.test(getComputedStyle(e).backgroundColor) ||
          c[3] === 0
        )
          continue;
        layers.push(c);
        if (c[3] >= 1) break;
      }
      return layers.reduceRight<C>(
        (acc, c) => over(c, acc),
        [255, 255, 255, 1],
      );
    };
    const lum = (c: C) => {
      const f = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]);
    };
    const results: { text: string; ratio: number }[] = [];
    for (const el of document.querySelectorAll<HTMLElement>('.swatch .tok')) {
      const fg = over(parse(getComputedStyle(el).color), effectiveBg(el));
      const bg = effectiveBg(el);
      const [hi, lo] = [lum(fg), lum(bg)].sort((x, y) => y - x) as [
        number,
        number,
      ];
      results.push({
        text: el.textContent ?? '',
        ratio: (hi + 0.05) / (lo + 0.05),
      });
    }
    return results;
  });
}

test.describe('JS off (day only: theme-init needs JS)', () => {
  test.use({ javaScriptEnabled: false });
  test('every swatch name and value is >= 4.5:1 against its effective background', async ({
    page,
  }) => {
    await page.goto('/ui/foundations/colour/');
    const results = await worstSwatchContrast(page);
    expect(results.length).toBeGreaterThan(200);
    expect(
      results
        .filter((r) => r.ratio < 4.5)
        .map((r) => `${r.text} ${r.ratio.toFixed(2)}`),
    ).toEqual([]);
  });
});

for (const mode of ['day', 'night']) {
  test.describe(`${mode}`, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });

    test('swatch text contrast with JS on', async ({ page }) => {
      await page.goto('/ui/foundations/colour/');
      const results = await worstSwatchContrast(page);
      expect(
        results
          .filter((r) => r.ratio < 4.5)
          .map((r) => `${r.text} ${r.ratio.toFixed(2)}`),
      ).toEqual([]);
    });

    for (const width of [375, 1280]) {
      test(`axe colour-contrast has no hits on Colour at ${width}`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto('/ui/foundations/colour/');
        const r = await new AxeBuilder({ page })
          .withRules(['color-contrast'])
          .analyze();
        expect(
          r.violations.flatMap((v) => v.nodes.map((n) => n.target.join(' '))),
        ).toEqual([]);
      });
    }

    test('no horizontal overflow at 375 on any Foundations page (code panels exempt)', async ({
      page,
    }) => {
      await page.setViewportSize({ width: 375, height: 900 });
      for (const p of pages) {
        await page.goto(`/ui/foundations/${p}/`);
        const bad = await page.evaluate(() => {
          const de = document.documentElement;
          const out: string[] = [];
          if (de.scrollWidth > de.clientWidth)
            out.push(`page ${de.scrollWidth}>${de.clientWidth}`);
          // Only code panels may scroll sideways.
          const scrollers = '.code, pre';
          for (const el of document.querySelectorAll<HTMLElement>('main *')) {
            if (el.closest(scrollers)) continue;
            const r = el.getBoundingClientRect();
            if (r.width && r.right > de.clientWidth + 0.5)
              out.push(
                `${el.tagName.toLowerCase()}.${el.className} right=${Math.round(r.right)}`,
              );
          }
          return out.slice(0, 10);
        });
        expect(bad, p).toEqual([]);
      }
    });
  });
}
