import AxeBuilder from '@axe-core/playwright';
import { expect, type Page, test } from 'playwright/test';

const url = '/ui/components/lm-motion-toggle/?motion=full';

/** Text, icon ring and focus ring contrast of the demo toggle, as rendered. */
async function measure(page: Page) {
  return page.evaluate(() => {
    const parse = (c: string) => (c.match(/[\d.]+/g) ?? []).map(Number);
    const lum = (c: number[]) => {
      const f = (v: number) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      };
      return (
        0.2126 * f(c[0] ?? 0) + 0.7152 * f(c[1] ?? 0) + 0.0722 * f(c[2] ?? 0)
      );
    };
    const ratio = (a: string, b: string) => {
      const [hi, lo] = [lum(parse(a)), lum(parse(b))].sort((x, y) => y - x) as [
        number,
        number,
      ];
      return Math.round(((hi + 0.05) / (lo + 0.05)) * 100) / 100;
    };
    const b = document.querySelector(
      '.demo lm-motion-toggle button',
    ) as HTMLElement;
    const s = getComputedStyle(b);
    const icon = getComputedStyle(b.querySelector('.lm-mt-i') as Element);
    const frame = getComputedStyle(b.closest('.demo-frame') as Element);
    return {
      pressed: b.dataset.pressed,
      text: ratio(s.color, s.backgroundColor),
      icon: ratio(icon.borderTopColor, s.backgroundColor),
      focus:
        s.outlineStyle === 'none'
          ? null
          : ratio(s.outlineColor, frame.backgroundColor),
    };
  });
}

for (const mode of ['day', 'night'] as const) {
  test.describe(`lm-motion-toggle contrast (${mode})`, () => {
    test.beforeEach(async ({ context }) => {
      await context.addCookies([
        { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
      ]);
    });

    test('every state passes AA: default, hover, focus, pressed', async ({
      page,
    }) => {
      await page.goto(url);
      const button = page.locator('.demo lm-motion-toggle button');
      await expect(button).toHaveAttribute('data-pressed', 'false');
      const results: Record<string, Awaited<ReturnType<typeof measure>>> = {};
      results.default = await measure(page);
      await button.hover();
      results.hover = await measure(page);
      await page.mouse.move(0, 0);
      await page.locator('.demo-bar code').evaluate((c) => {
        c.setAttribute('tabindex', '-1');
        (c as HTMLElement).focus();
      });
      await page.keyboard.press('Tab'); // frame Day/Night toggle
      await page.keyboard.press('Tab'); // lm-motion-toggle
      await expect(button).toBeFocused();
      results.focus = await measure(page);
      await page.keyboard.press('Enter');
      await expect(button).toHaveAttribute('data-pressed', 'true');
      results.pressed = await measure(page);

      for (const [state, r] of Object.entries(results)) {
        expect(r.text, `${mode} ${state} text`).toBeGreaterThanOrEqual(4.5);
        expect(r.icon, `${mode} ${state} icon ring`).toBeGreaterThanOrEqual(3);
      }
      expect(results.focus?.focus, `${mode} focus ring`).toBeGreaterThanOrEqual(
        3,
      );
      expect(results.pressed?.pressed).toBe('true');
    });

    for (const pressed of [false, true]) {
      test(`axe is clean on the docs page (${pressed ? 'pressed' : 'unpressed'})`, async ({
        page,
      }) => {
        await page.goto(url);
        if (pressed) {
          await page.locator('.demo lm-motion-toggle button').focus();
          await page.keyboard.press('Enter');
          await expect(
            page.locator('.demo lm-motion-toggle button'),
          ).toHaveAttribute('data-pressed', 'true');
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
  });
}
