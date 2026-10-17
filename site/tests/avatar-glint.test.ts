import { describe, expect, it } from 'vitest';
import { avatar } from '../../src/illustrations/svg/avatar.ts';
import { islandAa } from '../../src/illustrations/svg/island-aa.ts';
import { islandSandals } from '../../src/illustrations/svg/island-sandals.ts';
import { plane } from '../../src/illustrations/svg/plane.ts';

describe('avatar glints (#39)', () => {
  it('eye highlights, glints and lens glare use --lm-glint, not --lm-white', () => {
    const glints =
      avatar.match(/<(circle|path)\b[^>]*var\(--lm-glint\)[^>]*>/g) ?? [];
    expect(glints.length).toBe(8);
    // Eye highlights are the two r=1.2 circles.
    expect(avatar).toMatch(
      /<circle cx="86\.3" cy="111\.4" r="1\.2" fill="var\(--lm-glint\)"\/>/,
    );
    expect(avatar).toMatch(
      /<circle cx="116\.3" cy="111\.4" r="1\.2" fill="var\(--lm-glint\)"\/>/,
    );
    expect(avatar).not.toMatch(/<(circle|path)\b[^>]*var\(--lm-white\)/);
  });
  it('the lu-book rect uses --lm-glint so it stays paper at night', () => {
    expect(avatar).toMatch(
      /<g class="lu-book"><rect\b[^>]*fill="var\(--lm-glint\)"/,
    );
    expect(avatar).not.toContain('var(--lm-white)');
  });
});

describe('plane and island highlights (#41)', () => {
  it.each([
    ['plane', plane, 11],
    ['island-aa', islandAa, 5],
    ['island-sandals', islandSandals, 2],
  ])(
    '%s: highlights use --lm-glint, no --lm-white stroke or fill',
    (_n, svg, count) => {
      expect(svg).not.toMatch(/stroke="var\(--lm-white\)"/);
      expect(svg).not.toContain('var(--lm-white)');
      expect(svg.match(/var\(--lm-glint\)/g)?.length).toBe(count);
    },
  );
});
