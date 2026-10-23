import { expect, test } from 'playwright/test';
import { inlineIllustration } from '../../src/illustrations/index.ts';

// #59/#62: the stamp label shows once and fills the ring without clipping; the
// year only appears with `date`; the studio island sign reads "Demo Studio".

const stampLabelCases: Array<string | undefined> = [
  undefined,
  'Lisbon',
  'Llanfairpwllgwyngyll',
  'WMWMWMWMWMWMWMWMWM',
];

for (const width of [375, 1280]) {
  for (const city of stampLabelCases) {
    test(`stamp label once, not clipped @${width} (${city ?? 'default'})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/ui/');
      const svg = inlineIllustration('stamp', 'stp-e2e', city ? { city } : {});
      await page.evaluate((html) => {
        const host = document.createElement('div');
        host.id = 'stamp-host';
        host.style.cssText = 'width:min(320px,90vw)';
        host.innerHTML = html;
        document.body.prepend(host);
      }, svg);
      const tp = page.locator('#stamp-host textPath');
      const text = (await tp.textContent()) ?? '';
      expect(text.match(/ARRIVALS/g)).toHaveLength(1);
      expect(text).toContain(
        `${(city ?? 'Destination').toUpperCase()} · ARRIVALS`,
      );
      const m = await page.evaluate(() => {
        const t = document.querySelector('#stamp-host text') as SVGTextElement;
        const n = t.getNumberOfChars();
        let rendered = 0;
        for (let i = 0; i < n; i++) {
          try {
            const p = t.getStartPositionOfChar(i);
            if (Number.isFinite(p.x)) rendered++;
          } catch {
            /* glyph off the path */
          }
        }
        const s = t.getStartPositionOfChar(0);
        const e = t.getEndPositionOfChar(n - 1);
        const turn = 2 * Math.PI;
        // Clockwise arc from the first glyph's start to the last glyph's end, as a share of the ring.
        const cover =
          ((Math.atan2(e.y, e.x) - Math.atan2(s.y, s.x) + turn) % turn) / turn;
        return { n, rendered, cover };
      });
      expect(m.rendered).toBe(m.n);
      // Fills the ring (spaced out, not one short run) but stops before the seam (no clipping/overlap).
      expect(m.cover).toBeGreaterThan(0.9);
      expect(m.cover).toBeLessThan(1);
      await expect(
        page.locator('#stamp-host svg text[font-size="46"]'),
      ).toHaveCount(0);
      // #62: long names tighten and shrink (>=9px) instead of squashing glyphs.
      const label = page.locator('#stamp-host text').first();
      expect(await label.getAttribute('lengthAdjust')).toBe('spacing');
      const size = Number(await label.getAttribute('font-size'));
      expect(size).toBeGreaterThanOrEqual(9);
      if (city === undefined || city === 'Lisbon') {
        expect(size).toBe(22);
        expect(await label.getAttribute('letter-spacing')).toBe('3');
      }
      if (process.env.STAMP_PROOF_DIR) {
        const name = `${test.info().project.name}-${width}-${city ?? 'default'}.png`;
        await page
          .locator('#stamp-host')
          .screenshot({ path: `${process.env.STAMP_PROOF_DIR}/${name}` });
      }
    });
  }
}

test('stamp shows the year only when date is set', async ({ page }) => {
  await page.goto('/ui/');
  await page.evaluate(
    (html) => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="dated">${html}</div>`,
      );
    },
    inlineIllustration('stamp', 'stp-d', { city: 'Lisbon', date: '2026' }),
  );
  await expect(page.locator('#dated text[font-size="46"]')).toHaveText('2026');
});

test('studio island sign reads Demo Studio', async ({ page }) => {
  await page.goto('/ui/');
  await page.evaluate(
    (html) => {
      document.body.insertAdjacentHTML(
        'afterbegin',
        `<div id="isl">${html}</div>`,
      );
    },
    inlineIllustration('island-studio', 'isl-e2e'),
  );
  const sign = page.locator('#isl text');
  await expect(sign.filter({ hasText: /^Demo$/ })).toHaveCount(1);
  await expect(sign.filter({ hasText: /^Studio$/ })).toHaveCount(1);
  await expect(page.locator('#isl')).not.toContainText('Factory');
});
