import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { expect, test } from 'playwright/test';

// Every built docs route (site-dist/**/index.html), so new pages are covered automatically.
const root = fileURLToPath(new URL('../../site-dist/', import.meta.url));
function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) return f === 'pagefind' || f.startsWith('_') ? [] : walk(p);
    return f === 'index.html' ? [relative(root, dir)] : [];
  });
}
const routes = walk(root).map((r) => `/ui/${r ? `${r}/` : ''}`).sort();

test('enumerates the docs routes', () => {
  expect(routes.length).toBeGreaterThan(10);
  expect(routes).toContain('/ui/illustrations/svg-kit/');
});

for (const width of [320, 359, 360, 414]) {
  for (const route of routes) {
    test(`${route} @${width}: no sideways scroll, header/nav targets >= 24px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(route);
      const over = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      expect(over.sw, `scrollWidth ${over.sw} > clientWidth ${over.cw}`).toBeLessThanOrEqual(over.cw);
      const small = await page
        .locator('header.head, nav[aria-label="Previous and next page"]')
        .locator('a, button, input, select, [role="button"], [tabindex]:not([tabindex="-1"])')
        .evaluateAll((els) => {
          const vis = els.filter((e) => {
            const s = getComputedStyle(e);
            const r = e.getBoundingClientRect();
            return s.visibility !== 'hidden' && s.display !== 'none' && r.width > 0 && r.height > 0;
          });
          const items = vis.map((e, i) => ({ e, r: e.getBoundingClientRect(), i }));
          const rects = items.map((t) => t.r);
          // WCAG 2.5.8: >= 24x24, or (spacing exception) a 24px circle centred on an
          // undersized target must not intersect another target or its circle.
          return items
            .filter(({ r }) => r.width < 24 || r.height < 24)
            .filter(({ r, i }) => {
              const cx = r.x + r.width / 2;
              const cy = r.y + r.height / 2;
              return rects.some((o, j) => {
                if (j === i) return false;
                const nx = Math.max(o.left, Math.min(cx, o.right));
                const ny = Math.max(o.top, Math.min(cy, o.bottom));
                return Math.hypot(nx - cx, ny - cy) < 12;
              });
            })
            .map(({ e, r }) => ({ el: e.outerHTML.slice(0, 80), w: Math.round(r.width), h: Math.round(r.height) }));
        });
      expect(small).toEqual([]);
    });
  }
}

test('svg-kit lists generic island ids only', async ({ page }) => {
  await page.goto('/ui/illustrations/svg-kit/');
  const ids = await page.locator('[data-kit-item]').evaluateAll((els) => els.map((e) => e.getAttribute('data-kit-item')));
  for (const id of ['island-airport', 'island-campus', 'island-resort', 'island-studio']) expect(ids).toContain(id);
  const text = (await page.locator('main').innerText()) + (await page.locator('[data-kit-item] pre').allTextContents()).join('\n');
  expect(text).not.toMatch(/\b(island-)?(sandals|fluky|aa|bsc)\b/i);
});
