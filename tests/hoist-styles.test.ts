import { describe, expect, it } from 'vitest';
import { hoistInlineStyles } from '../scripts/hoist-styles.mjs';

describe('illustration style hoist', () => {
  it('replaces style attributes with the existing lm-ix hash', () => {
    const { svg, rules } = hoistInlineStyles(
      '<g class="sway" style="--t:3.4s;--dx:10px"><path style="animation-delay:-.3s"/></g>',
    );
    expect(svg).not.toContain('style=');
    expect(svg).toContain('class="sway lm-ix-9594eb" >');
    expect(svg).toContain('class="lm-ix-d9b48d" />');
    expect(rules.get('lm-ix-9594eb')).toBe('--t:3.4s;--dx:10px');
    expect(rules.get('lm-ix-d9b48d')).toBe('animation-delay:-.3s');
  });
});
