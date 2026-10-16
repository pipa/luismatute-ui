import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import CodeBlock from '../src/components/CodeBlock.astro';
import Heading from '../src/components/Heading.astro';
import { highlight } from '../src/lib/highlight';

const doc = (html: string) =>
  new new Window().DOMParser().parseFromString(html, 'text/html');

describe('highlight', () => {
  it('emits Prism classes and no style attributes', () => {
    const out = highlight('<lm-card tone="marigold"></lm-card>', 'html');
    expect(out).toMatch(/class="token tag"/);
    expect(out).toMatch(/class="token attr-value"/);
    expect(out).not.toMatch(/style=/);
    expect(highlight('a { color: red; }', 'css')).toMatch(/token selector/);
  });
});

describe('<CodeBlock>', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(CodeBlock, {
    props: { lang: 'html', filename: 'card.html', code: '\n<p>Hi</p>\n' },
  });
  const d = doc(html);
  it('renders the bar, language label, filename and trimmed code', () => {
    expect(d.querySelector('.code-lang')?.textContent).toBe('HTML');
    expect(d.querySelector('.code-file')?.textContent).toBe('card.html');
    expect(d.querySelector('pre')?.textContent).toBe('<p>Hi</p>');
  });
  it('has a real, hidden-until-JS copy button named with the language', () => {
    const b = d.querySelector('button.copy');
    expect(b?.getAttribute('type')).toBe('button');
    expect(b?.hasAttribute('hidden')).toBe(true);
    expect(b?.getAttribute('aria-label')).toBe('Copy HTML snippet');
  });
  it('lets keyboard users scroll the code (focusable, named pre)', () => {
    const pre = d.querySelector('pre');
    expect(pre?.getAttribute('tabindex')).toBe('0');
    expect(pre?.getAttribute('aria-label')).toBe('HTML example, card.html');
    expect(d.querySelector('[style]')).toBeNull();
  });
});

describe('<Heading>', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    props: { id: 'usage', level: 3 },
    slots: { default: 'Usage' },
  });
  const d = doc(html);
  it('renders an id and a named deep link', () => {
    const h = d.querySelector('h3#usage');
    expect(h).not.toBeNull();
    const a = h?.querySelector('a.anchor');
    expect(a?.getAttribute('href')).toBe('#usage');
    expect(a?.getAttribute('aria-label')).toBe('Link to Usage');
  });
});

describe('code CSS', () => {
  const css = readFileSync(
    new URL('../src/styles/docs.css', import.meta.url),
    'utf8',
  );
  it('uses the copy-pop motion token and zeroes it for reduced motion', () => {
    expect(css).toMatch(/--lm-docs-pop: var\(--lm-duration-copy-pop\)/);
    expect(css).toMatch(
      /prefers-reduced-motion: reduce\)\s*\{\s*:root\s*\{\s*--lm-docs-pop: 0s/,
    );
  });
  it('keyframes only touch transform and opacity', () => {
    const kf = css.match(/@keyframes lm-docs-pop \{([\s\S]*?)\n\}/)?.[1] ?? '';
    const props = [...kf.matchAll(/([a-z-]+):/g)].map((m) => m[1]);
    expect(new Set(props)).toEqual(new Set(['transform', 'opacity']));
  });
});
