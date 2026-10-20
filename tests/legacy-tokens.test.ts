import { describe, expect, it } from 'vitest';
import { sea, sky, themeAliases, themes } from '../src/tokens/tokens.ts';

// #59: old theme ids stay on the JS token objects as deprecated aliases.
describe('deprecated token keys (#59)', () => {
  const pairs = Object.entries(themeAliases) as [keyof typeof themeAliases, string][];

  it.each(pairs)('themes.%s resolves exactly like themes.%s', (old, now) => {
    expect(themes[old]).toBe((themes as Record<string, unknown>)[now]);
  });

  it.each(pairs)('sky.%s equals sky.%s', (old, now) => {
    expect(sky[old]).toBe((sky as Record<string, unknown>)[now]);
  });

  it('sea keeps the old keys that have a sea', () => {
    for (const [old, now] of pairs) {
      if (!(now in sea)) {
        expect(old in sea).toBe(false);
        continue;
      }
      expect((sea as Record<string, unknown>)[old]).toBe((sea as Record<string, unknown>)[now]);
    }
  });

  it('themes.aa is themes.airport', () => {
    expect(themes.aa).toBe(themes.airport);
    expect(themes.aa.label).toBe('Airport sky');
  });

  it('aliases stay out of enumeration (no duplicate CSS or docs entries)', () => {
    for (const obj of [themes, sky, sea]) {
      for (const old of Object.keys(themeAliases)) expect(Object.keys(obj)).not.toContain(old);
    }
  });
});
