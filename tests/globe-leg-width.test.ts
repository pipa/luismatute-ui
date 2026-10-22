import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { LEG_WIDTH, LEG_WIDTH_HOT } from '../src/components/globe-route.ts';

// #73 (Sentinel gap from #72): pin the hot-leg stroke width as a literal.
const css = readFileSync('src/styles/base.css', 'utf8');
const rule = (selector: string) => {
  const esc = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = css.match(new RegExp(`(?:^|\\n)${esc}\\s*\\{([^}]*)\\}`));
  if (!m?.[1]) throw new Error(`rule not found: ${selector}`);
  return m[1];
};
const width = (body: string) => body.match(/stroke-width:\s*([\d.]+)\s*;/)?.[1];

describe('globe leg stroke widths (#73)', () => {
  it('hot leg is 5.5 and the rest are 4', () => {
    expect(LEG_WIDTH_HOT).toBe(5.5);
    expect(LEG_WIDTH).toBe(4);
  });

  it('base.css draws the hot leg at 5.5', () => {
    expect(width(rule('lm-globe .lm-leg[data-hot="true"]'))).toBe('5.5');
    expect(Number(width(rule('lm-globe .lm-leg[data-hot="true"]')))).toBe(
      LEG_WIDTH_HOT,
    );
  });

  it('base.css draws the other legs at 4, non-scaling', () => {
    const body = rule('lm-globe .lm-leg');
    expect(width(body)).toBe('4');
    expect(Number(width(body))).toBe(LEG_WIDTH);
    expect(body).toMatch(/vector-effect:\s*non-scaling-stroke/);
  });
});
