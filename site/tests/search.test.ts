// @vitest-environment happy-dom
import { describe, expect, it } from 'vitest';
import pkg from '../../package.json';
import {
  excerptNodes,
  isApple,
  isTypingTarget,
  renderHits,
  shortcutOf,
  step,
} from '../src/scripts/search';
import docsCss from '../src/styles/docs.css?raw';

// #18 search: design/docs-shell/SPEC.md "Search dialog".
const key = (
  k: string,
  mods: Partial<Record<'metaKey' | 'ctrlKey' | 'altKey', boolean>> = {},
  target: EventTarget | null = document.body,
) => ({
  key: k,
  metaKey: false,
  ctrlKey: false,
  altKey: false,
  target,
  ...mods,
});

describe('shortcuts', () => {
  it('Cmd/Ctrl+K toggles, "/" opens', () => {
    expect(shortcutOf(key('k', { metaKey: true }))).toBe('toggle');
    expect(shortcutOf(key('K', { ctrlKey: true }))).toBe('toggle');
    expect(shortcutOf(key('/'))).toBe('open');
  });
  it('ignores "/" in text fields and plain or Alt-modified k', () => {
    const input = document.createElement('input');
    const area = document.createElement('textarea');
    expect(shortcutOf(key('/', {}, input))).toBeNull();
    expect(shortcutOf(key('/', {}, area))).toBeNull();
    expect(shortcutOf(key('k'))).toBeNull();
    expect(shortcutOf(key('k', { ctrlKey: true, altKey: true }))).toBeNull();
    expect(isTypingTarget(document.body)).toBe(false);
    expect(isTypingTarget(null)).toBe(false);
  });
  it('shows ⌘ on Apple platforms only', () => {
    expect(isApple({ platform: 'MacIntel', userAgent: '' })).toBe(true);
    expect(isApple({ platform: '', userAgent: 'iPhone' })).toBe(true);
    expect(isApple({ platform: 'Linux x86_64', userAgent: 'X11' })).toBe(false);
  });
});

describe('arrow stepping', () => {
  it('wraps both ways and starts at the right end', () => {
    expect(step(-1, 3, 1)).toBe(0);
    expect(step(-1, 3, -1)).toBe(2);
    expect(step(2, 3, 1)).toBe(0);
    expect(step(0, 3, -1)).toBe(2);
    expect(step(0, 0, 1)).toBe(-1);
  });
});

describe('results', () => {
  it('keeps <mark> from Pagefind excerpts and turns any other markup into text', () => {
    const nodes = excerptNodes(
      document,
      'a <mark>card</mark> &lt;b&gt; <img src=x onerror=alert(1)><script>x()</script>',
    );
    const p = document.createElement('p');
    p.append(...nodes);
    expect(p.querySelectorAll('mark')).toHaveLength(1);
    expect(p.querySelector('img, script, b')).toBeNull();
    expect(p.textContent).toContain('a card <b>');
  });
  it('renders role="option" links with ids, title, excerpt and url', () => {
    const list = document.createElement('div');
    const opts = renderHits(list, [
      {
        url: '/ui/components/lm-card/',
        title: 'lm-card',
        excerpt: 'A <mark>card</mark>',
      },
      { url: '/ui/foundations/colour/', title: 'Colour', excerpt: 'x' },
    ]);
    expect(opts.map((o) => o.id)).toEqual(['search-hit-0', 'search-hit-1']);
    for (const o of opts) {
      expect(o.getAttribute('role')).toBe('option');
      expect(o.getAttribute('aria-selected')).toBe('false');
      expect(o.tabIndex).toBe(-1);
    }
    expect(opts[0]?.querySelector('.search-title')?.textContent).toBe(
      'lm-card',
    );
    expect(opts[0]?.querySelector('.search-crumb')?.textContent).toBe(
      '/ui/components/lm-card/',
    );
    expect(list.querySelector('[style]')).toBeNull();
  });
});

describe('build and styles', () => {
  it('the site build indexes site-dist with Pagefind', () => {
    expect(pkg.scripts['build:site']).toMatch(
      /astro build --root site && pagefind --site site-dist$/,
    );
    expect(pkg.scripts['check:site']).toContain('pnpm build:site');
  });
  it('the dialog only transitions opacity and transform, on the docs motion tokens', () => {
    const open =
      docsCss.match(/\n\.search-dialog\[open\] \{([^}]*)\}/)?.[1] ?? '';
    const props = [
      ...open.matchAll(/(\w[\w-]*) var\(--lm-docs-drawer-in\)/g),
    ].map((m) => m[1]);
    expect(props).toEqual(['opacity', 'transform']);
  });
  it('the repeated 4px hard shadow is one token', () => {
    expect(docsCss).toContain(
      '--lm-docs-shadow-hard: 4px 4px 0 var(--lm-docs-shadow);',
    );
    expect(docsCss.match(/4px 4px 0 var\(--lm-docs-shadow\)/g)).toHaveLength(1);
  });
});
