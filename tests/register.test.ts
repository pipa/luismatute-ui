import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const entries: Array<[string, string]> = [
  ['card', 'defineLmCard'],
  ['chip', 'defineLmChip'],
  ['more', 'defineLmMore'],
  ['motion-toggle', 'defineLmMotionToggle'],
  ['pause', 'defineLmPause'],
  ['shot', 'defineLmShot'],
  ['avatar', 'defineLmAvatar'],
  ['globe', 'defineLmGlobe'],
  ['flight-plan', 'defineLmFlightPlan'],
  ['theme-toggle', 'defineLmThemeToggle'],
  ['sky-header', 'defineLmSkyHeader'],
  ['index', 'defineLmUi'],
];

describe('element registration', () => {
  it('does not register elements from the root entry', async () => {
    const root = readFileSync('src/index.ts', 'utf8');
    expect(root).not.toContain('defineLmUi()');
    const barrel = readFileSync('src/components/index.ts', 'utf8');
    expect(barrel).not.toMatch(/^defineLmUi\(\);/m);
    await import('../src/index.ts');
    expect(customElements.get('lm-card')).toBeUndefined();
    expect(customElements.get('lm-avatar')).toBeUndefined();
  });

  it('registers from each subpath entry and marks those files as side effects', async () => {
    const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as {
      sideEffects: string[];
    };
    expect(pkg.sideEffects).toContain('./dist/components/*.js');
    expect(pkg.sideEffects).not.toContain('./dist/index.js');
    for (const [file, fn] of entries) {
      const source = readFileSync(`src/components/entries/${file}.ts`, 'utf8');
      expect(source).toContain(`${fn}()`);
    }
    await import('../src/components/entries/card.ts');
    expect(customElements.get('lm-card')).toBeTruthy();
    await import('../src/components/entries/avatar.ts');
    expect(customElements.get('lm-avatar')).toBeTruthy();
  });

  it('applies the motion preference from every defineLmX', () => {
    const files = [
      'card',
      'chip',
      'more',
      'motion-toggle',
      'pause',
      'shot',
      'avatar',
      'globe',
      'flight-plan',
    ];
    for (const file of files) {
      const source = readFileSync(`src/components/${file}.ts`, 'utf8');
      const body = source.slice(source.indexOf('export function defineLm'));
      expect(body).toContain('applyMotionPreference()');
    }
    document.documentElement.removeAttribute('data-motion');
    return import('../src/components/card.ts').then(({ defineLmCard }) => {
      defineLmCard();
      expect(document.documentElement.dataset.motion).toBe('full');
    });
  });
});
