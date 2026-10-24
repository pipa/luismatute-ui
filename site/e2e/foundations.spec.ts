import AxeBuilder from '@axe-core/playwright';
import { type BrowserContext, expect, type Page, test } from 'playwright/test';

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

declare global {
  interface Window {
    __copied?: string[];
  }
}

/**
 * Strict clipboard check on every engine (#82). Chromium grants clipboard
 * permissions and reads the real clipboard back. Playwright can't grant them
 * in Firefox or WebKit, so there an init script wraps
 * navigator.clipboard.writeText to record the exact argument (and resolve).
 */
async function strictClipboard(
  page: Page,
  context: BrowserContext,
  browserName: string,
): Promise<() => Promise<string | undefined>> {
  if (browserName === 'chromium') {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    return () => page.evaluate(() => navigator.clipboard.readText());
  }
  await page.addInitScript(() => {
    window.__copied = [];
    const clip = navigator.clipboard ?? ({} as Clipboard);
    Object.defineProperty(clip, 'writeText', {
      configurable: true,
      value: async (t: string) => {
        window.__copied?.push(String(t));
      },
    });
    if (!navigator.clipboard)
      Object.defineProperty(navigator, 'clipboard', { value: clip });
  });
  return () => page.evaluate(() => window.__copied?.at(-1));
}

test('token copy works by keyboard (Enter and Space), copies the exact token and announces', async ({
  page,
  context,
  browserName,
}) => {
  const clipboard = await strictClipboard(page, context, browserName);
  await page.goto('/ui/foundations/spacing/');
  const name = page.getByRole('button', { name: 'Copy var(--lm-space-8)' });
  const value = page.getByRole('button', {
    name: 'Copy value of --lm-space-8',
  });
  const live = page.locator('#copy-live');
  await name.focus();
  await page.keyboard.press('Enter');
  await expect(live).toHaveText('Copied var(--lm-space-8)');
  await expect(name).toHaveAttribute('data-copied', '');
  expect(await clipboard()).toBe('var(--lm-space-8)');
  await page.keyboard.press('Tab');
  await expect(value).toBeFocused();
  await page.keyboard.press('Space');
  await expect(live).toHaveText('Copied 8px');
  await expect(value).toHaveAttribute('data-copied', '');
  expect(await clipboard()).toBe('8px');
});

test('token copy falls back to selecting the text when the clipboard rejects', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const clip = navigator.clipboard ?? ({} as Clipboard);
    Object.defineProperty(clip, 'writeText', {
      configurable: true,
      value: () =>
        Promise.reject(new DOMException('denied', 'NotAllowedError')),
    });
    if (!navigator.clipboard)
      Object.defineProperty(navigator, 'clipboard', { value: clip });
  });
  await page.goto('/ui/foundations/spacing/');
  const name = page.getByRole('button', { name: 'Copy var(--lm-space-8)' });
  await name.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('#copy-live')).toHaveText(
    /^Copy failed\. Text selected, press (Ctrl\+C|⌘C)\.$/,
  );
  await expect(name).not.toHaveAttribute('data-copied', '');
  // The fallback selects the copyable value (data-copy-text), not the
  // button's visible label (#85).
  expect(await page.evaluate(() => String(window.getSelection()))).toBe(
    'var(--lm-space-8)',
  );
  await expect(name).toHaveText('--lm-space-8');
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

test.describe('token tables at 375 (two-line rows)', () => {
  test.use({ viewport: { width: 375, height: 900 } });
  for (const p of ['type', 'spacing', 'radius', 'motion-tokens', 'colour']) {
    test(`${p}: names on one line when they fit, value and preview share a line`, async ({
      page,
    }) => {
      await page.goto(`/ui/foundations/${p}/`);
      const problems = await page.evaluate(() => {
        const out: string[] = [];
        for (const tr of document.querySelectorAll<HTMLElement>(
          '.tok-table tbody tr',
        )) {
          const cells = tr.querySelectorAll<HTMLElement>('td');
          const nameCell = cells[0] as HTMLElement;
          const name = nameCell.querySelector<HTMLElement>(
            '.tok',
          ) as HTMLElement;
          const label = name.textContent ?? '';
          // Would the name fit on one line in the row? Measure it unwrapped.
          const probe = name.cloneNode(true) as HTMLElement;
          probe.style.cssText =
            'position:absolute;visibility:hidden;white-space:nowrap;width:auto;max-width:none';
          name.parentElement?.append(probe);
          const natural = probe.getBoundingClientRect().width;
          probe.remove();
          const lh = Number.parseFloat(getComputedStyle(name).lineHeight);
          const textH =
            name.getBoundingClientRect().height -
            Number.parseFloat(getComputedStyle(name).paddingTop) -
            Number.parseFloat(getComputedStyle(name).paddingBottom);
          if (natural <= tr.clientWidth && textH > lh * 1.5)
            out.push(`${label} wraps (${Math.round(textH)}px, lh ${lh})`);
          // Name spans the row, on its own line above the rest.
          const n = nameCell.getBoundingClientRect();
          const rest = [...cells]
            .slice(1)
            .map((c) => c.getBoundingClientRect());
          if (rest.some((r) => r.top < n.bottom - 1))
            out.push(`${label} not on its own line`);
          // Value and preview share line 2.
          if (rest.length === 2) {
            // Muse: they share line 2 when they fit; otherwise the preview drops
            // to line 3 at full size (checked by the 375 table fit spec).
            const [v, pv] = rest as [DOMRect, DOMRect];
            const fits = v.width + 8 + pv.width <= tr.clientWidth;
            const sameLine =
              Math.abs(v.top + v.height / 2 - (pv.top + pv.height / 2)) <=
              Math.max(v.height, pv.height) / 2;
            if (fits && !sameLine)
              out.push(`${label} value/preview on different lines`);
            if (!fits && pv.top < v.bottom - 1)
              out.push(`${label} preview should drop below value`);
          }
        }
        return out.slice(0, 10);
      });
      expect(problems).toEqual([]);
    });
  }
  test('tables keep table semantics for assistive tech', async ({ page }) => {
    await page.goto('/ui/foundations/spacing/');
    const table = page.getByRole('table', { name: 'Spacing scale' });
    await expect(table.getByRole('columnheader')).toHaveCount(3);
    await expect(table.getByRole('row').nth(1).getByRole('cell')).toHaveCount(
      3,
    );
  });
});

for (const mode of ['day', 'night']) {
  for (const js of [true, false]) {
    test.describe(`375 table fit (${mode}, JS ${js ? 'on' : 'off: day-only, theme-init needs JS'})`, () => {
      test.use({
        viewport: { width: 375, height: 900 },
        javaScriptEnabled: js,
      });
      test.beforeEach(async ({ context }) => {
        await context.addCookies([
          { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
        ]);
      });
      test('no .tok-wrap scrolls sideways; previews keep full token size, unclipped', async ({
        page,
      }) => {
        for (const p of pages) {
          await page.goto(`/ui/foundations/${p}/`);
          const bad = await page.evaluate(() => {
            const out: string[] = [];
            for (const w of document.querySelectorAll<HTMLElement>('.tok-wrap'))
              if (w.scrollWidth > w.clientWidth)
                out.push(`.tok-wrap ${w.scrollWidth}>${w.clientWidth}`);
            for (const pv of document.querySelectorAll<HTMLElement>(
              '.pv-type',
            )) {
              const name = pv.className.match(/fs-(lm-font-size-[\w-]+)/)?.[1];
              const probe = document.createElement('span');
              probe.style.fontSize = `var(--${name})`;
              pv.parentElement?.append(probe);
              const want = getComputedStyle(probe).fontSize;
              probe.remove();
              const got = getComputedStyle(pv).fontSize;
              if (got !== want)
                out.push(`${name} preview ${got} != token ${want}`);
              const cell = pv.closest('td') as HTMLElement;
              for (const el of [pv, cell]) {
                const cs = getComputedStyle(el);
                if (cs.overflowX !== 'visible' || cs.overflowY !== 'visible')
                  out.push(`${name} overflow ${cs.overflow}`);
              }
              if (cell.scrollWidth > cell.clientWidth)
                out.push(
                  `${name} cell clipped ${cell.scrollWidth}>${cell.clientWidth}`,
                );
              const r = pv.getBoundingClientRect();
              const wrap = (
                pv.closest('.tok-wrap') as HTMLElement
              ).getBoundingClientRect();
              if (r.right > wrap.right || r.left < wrap.left)
                out.push(`${name} preview outside wrapper`);
            }
            return out.slice(0, 10);
          });
          expect(bad, p).toEqual([]);
        }
      });
    });
  }
}
