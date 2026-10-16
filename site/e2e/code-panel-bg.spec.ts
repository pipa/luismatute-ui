import { expect, test } from 'playwright/test';

// #39: the night docs code panel takes its background from --lm-code-bg.
// By day the docs panel stays dark (sky-night-2) because the docs syntax
// colours are light; on the day --lm-code-bg (#f3e2c0) they would be 1.1 to 1.6:1.
const bgs =
  (mode: string) =>
  async ({ page }: { page: import('playwright/test').Page }) => {
    await page.goto(`/ui/components/lm-card/?mode=${mode}`);
    return page.evaluate(() => {
      const probe = document.createElement('div');
      probe.className = 'code-bg-probe';
      document.body.append(probe);
      probe.style.setProperty('background', 'var(--lm-code-bg)');
      const want = getComputedStyle(probe).backgroundColor;
      probe.style.setProperty('background', 'var(--lm-sky-night-2)');
      const sky = getComputedStyle(probe).backgroundColor;
      probe.remove();
      const got = getComputedStyle(
        document.querySelector('.code') as Element,
      ).backgroundColor;
      return { got, want, sky };
    });
  };

test('night: docs code panel background equals --lm-code-bg', async ({
  page,
}) => {
  const { got, want } = await bgs('night')({ page });
  expect(got).toBe(want);
  expect(got).toBe('rgb(25, 19, 56)');
});

test('day: docs code panel stays on the dark sky panel, not the light --lm-code-bg', async ({
  page,
}) => {
  const { got, want, sky } = await bgs('day')({ page });
  expect(got).toBe(sky);
  expect(got).not.toBe(want);
});
