import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

const pages = ['lm-card', 'lm-chip', 'lm-more', 'lm-pause', 'lm-motion-toggle'];
const at = (p: string, q = '') => `/ui/components/${p}/${q}`;

test('each component page has a live demo with the real component styles', async ({
  page,
}) => {
  for (const p of pages) {
    await page.goto(at(p));
    await expect(
      page.getByRole('figure', { name: /^Live demo/ }),
    ).toBeVisible();
  }
  await page.goto(at('lm-card'));
  const card = page.locator('.demo lm-card').first();
  await expect(card).toHaveAttribute('variant', 'stop');
  // From components.css (base.css): thick ink border and card radius.
  expect(await card.evaluate((c) => getComputedStyle(c).borderTopWidth)).toBe(
    '3px',
  );
  expect(
    await card.evaluate((c) => getComputedStyle(c).borderTopLeftRadius),
  ).toBe('20px');
});

test('docs prose styles do not leak into demos', async ({ page }) => {
  await page.goto(at('lm-card'));
  const h2 = page.locator('.demo lm-card h2').first();
  const s = await h2.evaluate((e) => ({
    border: getComputedStyle(e).borderTopStyle,
    pad: getComputedStyle(e).paddingTop,
  }));
  expect(s).toEqual({ border: 'none', pad: '0px' });
});

test('lm-chip featured adds a readable badge', async ({ page }) => {
  await page.goto(at('lm-chip'));
  await expect(page.locator('.demo lm-chip[variant="featured"] b')).toHaveText(
    'Featured',
  );
});

test('lm-more toggles from the keyboard and logs lm-toggle', async ({
  page,
}) => {
  await page.goto(at('lm-more', '?motion=full'));
  const button = page.locator('.demo lm-more button');
  const panel = page.locator('.demo .lm-more-body');
  await expect(button).toHaveAttribute('aria-expanded', 'false');
  await expect(panel).toBeHidden();
  await button.focus();
  await page.keyboard.press('Enter');
  await expect(button).toHaveAttribute('aria-expanded', 'true');
  await expect(panel).toBeVisible();
  await expect(page.locator('.demo-log')).toHaveText('lm-toggle {"open":true}');
  await page.keyboard.press('Space');
  await expect(panel).toBeHidden();
  await expect(page.locator('.demo-log')).toHaveText(
    'lm-toggle {"open":false}',
  );
});

test('lm-pause toggles with Space, marks the page paused and logs', async ({
  page,
}) => {
  await page.goto(at('lm-pause', '?motion=full'));
  const button = page.getByRole('button', { name: 'Pause animation' });
  await button.focus();
  await page.keyboard.press('Space');
  await expect(button).toHaveAttribute('aria-pressed', 'true');
  expect(
    await page.evaluate(() =>
      document.documentElement.classList.contains('paused'),
    ),
  ).toBe(true);
  await expect(page.locator('.demo-log')).toHaveText(
    'lm-pause {"paused":true}',
  );
  expect((await button.boundingBox())?.height).toBeGreaterThanOrEqual(44);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('lm-more shows its content with no button; lm-pause hides', async ({
    page,
  }) => {
    await page.goto(at('lm-more'));
    await expect(page.locator('.demo .lm-more-body')).toBeVisible();
    await expect(page.locator('.demo lm-more button')).toBeHidden();
    await page.goto(at('lm-pause'));
    await expect(page.locator('.demo lm-pause button')).toBeHidden();
  });
});

async function overflow(page: Page) {
  return page.evaluate(() => {
    const de = document.documentElement;
    const out: string[] = [];
    if (de.scrollWidth > de.clientWidth)
      out.push(`page ${de.scrollWidth}>${de.clientWidth}`);
    for (const w of document.querySelectorAll<HTMLElement>(
      '.tok-wrap, .demo-frame',
    ))
      if (w.scrollWidth > w.clientWidth)
        out.push(`${w.className} ${w.scrollWidth}>${w.clientWidth}`);
    for (const el of document.querySelectorAll<HTMLElement>('main *')) {
      if (el.closest('.code, pre')) continue;
      const r = el.getBoundingClientRect();
      if (r.width && r.right > de.clientWidth + 0.5)
        out.push(
          `${el.tagName.toLowerCase()}.${el.className} right=${Math.round(r.right)}`,
        );
    }
    return out.slice(0, 10);
  });
}

for (const mode of ['day', 'night']) {
  test.describe(mode, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });
    for (const p of pages) {
      test(`axe finds nothing on ${p} (1280, motion on)`, async ({ page }) => {
        await page.goto(at(p, '?motion=full'));
        if (p === 'lm-more') {
          await page.locator('.demo lm-more button').focus();
          await page.keyboard.press('Enter');
        }
        const r = await new AxeBuilder({ page }).analyze();
        expect(
          r.violations.map(
            (v) =>
              `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          ),
        ).toEqual([]);
      });
    }
    for (const js of [true, false]) {
      test.describe(`375, JS ${js ? 'on' : 'off (day-only: theme-init needs JS)'}`, () => {
        test.use({
          viewport: { width: 375, height: 900 },
          javaScriptEnabled: js,
        });
        test('no horizontal overflow outside code panels', async ({ page }) => {
          for (const p of pages) {
            await page.goto(at(p, '?motion=full'));
            expect(await overflow(page), p).toEqual([]);
          }
        });
      });
    }
  });
}

test.describe('JS off', () => {
  test.use({ javaScriptEnabled: false });
  test('demos keep their content readable', async ({ page }) => {
    await page.goto(at('lm-more'));
    await expect(page.locator('.demo lm-more p')).toBeVisible();
  });
});

const rgb = (hex: string) =>
  `rgb(${[1, 3, 5].map((i) => Number.parseInt(hex.slice(i, i + 2), 16)).join(', ')})`;

for (const mode of ['day', 'night'] as const) {
  test.describe(`demo frame (${mode} page)`, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });

    test('frame matches the spec: 1px border, 12px radius, 24px padding, page paper', async ({
      page,
    }) => {
      await page.goto(at('lm-card'));
      const f = await page.locator('.demo-frame').evaluate((el) => {
        const s = getComputedStyle(el);
        const st = getComputedStyle(el.querySelector('.demo-stage') as Element);
        const bar = (
          el.querySelector('.demo-bar') as HTMLElement
        ).getBoundingClientRect().height;
        return {
          bw: s.borderTopWidth,
          r: s.borderTopLeftRadius,
          bg: s.backgroundColor,
          pad: st.paddingTop,
          bar,
        };
      });
      expect(f).toMatchObject({
        bw: '1px',
        r: '12px',
        bg: rgb(mode === 'day' ? '#fff6e4' : '#120d2c'),
        pad: '24px',
      });
      expect(f.bar).toBeGreaterThanOrEqual(32);
      await page.setViewportSize({ width: 375, height: 900 });
      expect(
        await page
          .locator('.demo-stage')
          .evaluate((e) => getComputedStyle(e).paddingTop),
      ).toBe('16px');
    });

    test('Day/Night toggle flips only its frame, by keyboard, with aria-pressed', async ({
      page,
    }) => {
      await page.goto(at('lm-card'));
      const frame = page.locator('.demo-frame');
      const toggle = page.getByRole('button', {
        name: /Night preview for this demo/,
      });
      await expect(toggle).toHaveAttribute(
        'aria-pressed',
        String(mode === 'night'),
      );
      await toggle.focus();
      await page.keyboard.press('Enter');
      const other = mode === 'day' ? 'night' : 'day';
      await expect(frame).toHaveAttribute('data-theme', other);
      await expect(toggle).toHaveAttribute(
        'aria-pressed',
        String(other === 'night'),
      );
      expect(
        await frame.evaluate((e) => getComputedStyle(e).backgroundColor),
      ).toBe(rgb(other === 'day' ? '#fff6e4' : '#120d2c'));
      // The page itself keeps its mode.
      expect(
        await page.evaluate(
          () => document.documentElement.dataset.mode ?? 'day',
        ),
      ).toBe(mode);
      await page.keyboard.press('Space');
      await expect(frame).toHaveAttribute('data-theme', mode);
    });

    for (const p of pages) {
      test(`axe is clean on ${p} with the frame toggled to the other theme`, async ({
        page,
      }) => {
        await page.goto(at(p, '?motion=full'));
        await page
          .getByRole('button', { name: /Night preview for this demo/ })
          .click();
        if (p === 'lm-more') {
          await page.locator('.demo lm-more button').focus();
          await page.keyboard.press('Enter');
        }
        const r = await new AxeBuilder({ page }).include('.demo').analyze();
        expect(
          r.violations.map(
            (v) =>
              `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`,
          ),
        ).toEqual([]);
      });
    }

    test('every interactive demo control is reachable by Tab with a visible 3:1 focus ring, both frame themes', async ({
      page,
    }) => {
      for (const p of ['lm-more', 'lm-pause']) {
        for (const flip of [false, true]) {
          await page.goto(at(p, '?motion=full'));
          if (flip)
            await page
              .getByRole('button', { name: /Night preview for this demo/ })
              .click();
          const controls = page.locator('.demo-frame button:visible');
          // Wait for the demo to render before counting (WebKit flake, #39).
          await expect(controls.nth(1)).toBeVisible();
          const n = await controls.count();
          expect(n, p).toBeGreaterThanOrEqual(2);
          await page
            .locator('.demo-frame')
            .evaluate(() =>
              (document.activeElement as HTMLElement | null)?.blur(),
            );
          await page.locator('.demo-bar code').evaluate((c) => {
            c.setAttribute('tabindex', '-1');
            (c as HTMLElement).focus();
          });
          for (let i = 0; i < n; i++) {
            await page.keyboard.press('Tab');
            const ring = await page.evaluate(() => {
              const el = document.activeElement as HTMLElement;
              const s = getComputedStyle(el);
              const frame = el.closest('.demo-frame') as HTMLElement;
              const parse = (c: string) =>
                (c.match(/[\d.]+/g) ?? []).map(Number);
              const lum = (c: number[]) => {
                const f = (v: number) => {
                  const x = v / 255;
                  return x <= 0.03928
                    ? x / 12.92
                    : ((x + 0.055) / 1.055) ** 2.4;
                };
                return (
                  0.2126 * f(c[0] ?? 0) +
                  0.7152 * f(c[1] ?? 0) +
                  0.0722 * f(c[2] ?? 0)
                );
              };
              const [a, b] = [
                lum(parse(s.outlineColor)),
                lum(parse(getComputedStyle(frame).backgroundColor)),
              ].sort((x, y) => y - x) as [number, number];
              return {
                inFrame: !!frame,
                style: s.outlineStyle,
                width: Number.parseFloat(s.outlineWidth),
                ratio: (a + 0.05) / (b + 0.05),
                name: el.textContent,
              };
            });
            expect(ring.inFrame, `${p} tab ${i}`).toBe(true);
            expect(ring.style, `${p} ${ring.name}`).not.toBe('none');
            expect(ring.width, `${p} ${ring.name}`).toBeGreaterThanOrEqual(2);
            expect(
              ring.ratio,
              `${p} ${ring.name} flip=${flip}`,
            ).toBeGreaterThanOrEqual(3);
          }
        }
      }
    });
  });
}

test('demo frames never overflow at 375', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  for (const p of pages) {
    await page.goto(at(p, '?motion=full'));
    const bad = await page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>('.demo-frame, .demo-stage')]
        .filter(
          (f) =>
            f.scrollWidth > f.clientWidth ||
            f.getBoundingClientRect().right >
              document.documentElement.clientWidth,
        )
        .map((f) => `${f.className} ${f.scrollWidth}>${f.clientWidth}`),
    );
    expect(bad, p).toEqual([]);
  }
});
