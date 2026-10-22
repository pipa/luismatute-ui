import { describe, expect, it } from 'vitest';
import { renderTokensCss } from '../src/tokens/render.ts';
import { easing, motion } from '../src/tokens/tokens.ts';

// Seat-line draw (luismatute.me #12, ui #70). Values must match the site's
// former bridge tokens in src/styles/travel/tokens-bridge.css exactly.
describe('seat-line motion tokens', () => {
  it('has the exact TS values', () => {
    expect(motion.seatLine).toBe('1.45s');
    expect(motion.seatLineDelay).toBe('0.15s');
    expect(easing.seatLine).toBe('cubic-bezier(0.5, 0.06, 0.24, 1)');
  });
  it('renders them into tokens.css :root', () => {
    const css = renderTokensCss();
    const root = css.slice(0, css.indexOf('html[data-mode="night"]'));
    expect(root).toContain('--lm-dur-seat-line: 1.45s;');
    expect(root).toContain('--lm-dur-seat-line-delay: 0.15s;');
    expect(root).toContain(
      '--lm-ease-seat-line: cubic-bezier(0.5, 0.06, 0.24, 1);',
    );
  });
});
