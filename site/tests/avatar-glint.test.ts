import { describe, expect, it } from 'vitest';
import { avatar } from '../../src/illustrations/svg/avatar.ts';

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
