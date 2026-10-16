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
  it('keeps --lm-white for surfaces (the book)', () => {
    expect(avatar).toMatch(
      /<rect width="34" height="26" x="118" y="168" fill="var\(--lm-white\)"/,
    );
  });
});
