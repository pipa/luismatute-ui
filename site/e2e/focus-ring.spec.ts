import { expect, test } from 'playwright/test';

// WCAG 2.4.11: the focus ring on every sidebar nav link must be fully visible,
// not clipped by the sidebar's scroll container, in day and night.
for (const mode of ['day', 'night'] as const) {
  test(`sidebar nav focus ring is not clipped (${mode})`, async ({
    page,
    context,
  }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await context.addCookies([
      { name: 'lm-mode', value: mode, domain: '127.0.0.1', path: '/' },
    ]);
    await page.goto('/ui/components/lm-card/');
    await expect(page.locator('html')).toHaveAttribute('data-mode', mode);

    const links = page.locator('aside.side nav a');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
    for (let i = 0; i < count; i++) {
      const link = links.nth(i);
      // Keyboard focus, so :focus-visible applies as it does for real users.
      for (
        let t = 0;
        t < 40 && !(await link.evaluate((a) => a === document.activeElement));
        t++
      )
        await page.keyboard.press('Tab');
      await expect(link).toBeFocused();
      const box = await link.evaluate((a) => {
        const s = getComputedStyle(a);
        const o =
          Number.parseFloat(s.outlineWidth) +
          Number.parseFloat(s.outlineOffset);
        const scroller = a.closest('nav') as HTMLElement;
        const r = a.getBoundingClientRect();
        const n = scroller.getBoundingClientRect();
        // clientRect: inside borders, excluding scrollbars.
        const left = n.left + scroller.clientLeft;
        const top = n.top + scroller.clientTop;
        const right = left + scroller.clientWidth;
        const bottom = top + scroller.clientHeight;
        return {
          label: a.textContent?.trim(),
          style: s.outlineStyle,
          o,
          clipped: {
            left: r.left - o < left,
            right: r.right + o > right,
            top: r.top - o < top,
            bottom: r.bottom + o > bottom,
          },
        };
      });
      expect(box.style, `${box.label} has an outline`).not.toBe('none');
      expect(box.o, `${box.label} ring size`).toBeGreaterThan(0);
      expect(box.clipped, `${box.label} ring clipped`).toEqual({
        left: false,
        right: false,
        top: false,
        bottom: false,
      });
    }
  });
}
