import { readFileSync } from 'node:fs';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import SideNav from '../src/components/SideNav.astro';
import Docs from '../src/layouts/Docs.astro';
import { allItems, hrefFor, nav, neighbours, slugOf } from '../src/lib/nav';

// Rendered in node (Astro SSR); parsed with happy-dom for queries.
const doc = (html: string) =>
  new new Window().DOMParser().parseFromString(html, 'text/html');

describe('nav data', () => {
  it('has the five groups and every page from #18', () => {
    expect(nav.map((g) => g.label)).toEqual([
      'Getting started',
      'Foundations',
      'Components',
      'Illustrations',
      'Changelog',
    ]);
    expect(nav[2]?.items).toHaveLength(9);
    expect(new Set(allItems.map((i) => i.slug)).size).toBe(allItems.length);
  });
  it('builds hrefs under the /ui/ base with a trailing slash', () => {
    expect(hrefFor('/ui/', '')).toBe('/ui/');
    expect(hrefFor('/ui', 'foundations/colour')).toBe(
      '/ui/foundations/colour/',
    );
    expect(slugOf('/ui/', '/ui/components/lm-card/')).toBe(
      'components/lm-card',
    );
    expect(slugOf('/ui/', '/ui')).toBe('');
    expect(slugOf('/ui/', '/cv/')).toBeNull();
  });
  it('walks prev/next in sidebar order', () => {
    expect(neighbours('').next?.slug).toBe(allItems[0]?.slug);
    const n = neighbours('components/lm-card');
    expect(n.prev?.slug).toBe('foundations/motion-tokens');
    expect(n.next?.slug).toBe('components/lm-chip');
    expect(neighbours('changelog').next).toBeUndefined();
  });
});

describe('<SideNav>', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(SideNav, {
    props: { current: 'components/lm-card', label: 'Docs', base: '/ui/' },
  });
  const d = doc(html);

  it('is a labelled nav landmark with labelled lists', () => {
    const navEl = d.querySelector('nav');
    expect(navEl?.getAttribute('aria-label')).toBe('Docs');
    for (const ul of d.querySelectorAll('ul')) {
      const id = ul.getAttribute('aria-labelledby') ?? '';
      expect(d.getElementById(id)?.textContent?.trim()).toBeTruthy();
    }
  });
  it('marks exactly one current page', () => {
    const cur = d.querySelectorAll('[aria-current="page"]');
    expect(cur).toHaveLength(1);
    expect(cur[0]?.getAttribute('href')).toBe('/ui/components/lm-card/');
  });
  it('uses real links only (keyboard reachable, no root-absolute hrefs outside /ui/)', () => {
    const links = [...d.querySelectorAll('a')];
    expect(links).toHaveLength(allItems.length);
    for (const a of links)
      expect(a.getAttribute('href')).toMatch(/^\/ui\/.+\/$/);
    expect(d.querySelector('[tabindex]')).toBeNull();
  });
});

describe('<Docs> layout', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Docs, {
    props: {
      title: 'lm-card',
      description: 'Card.',
      slug: 'components/lm-card',
    },
  });
  const d = doc(html);

  it('loads the theme-init script externally with the shared cookie domain', () => {
    const s = d.querySelector('script[data-lm-theme]');
    expect(s?.getAttribute('src')).toMatch(/theme-init/);
    expect(s?.getAttribute('data-cookie-domain')).toBe('.luismatute.me');
  });
  it('has no inline style attributes or inline scripts', () => {
    expect(d.querySelector('[style]')).toBeNull();
    for (const s of d.querySelectorAll('script'))
      expect(s.textContent?.trim()).toBe('');
  });
  it('has a skip link, one main, and uniquely named navs', () => {
    expect(d.querySelector('a.skip')?.getAttribute('href')).toBe('#main');
    expect(d.querySelectorAll('main#main')).toHaveLength(1);
    const names = [...d.querySelectorAll('nav')].map((n) =>
      n.getAttribute('aria-label'),
    );
    expect(new Set(names).size).toBe(names.length);
  });
  it('opens and closes the phone drawer with the Popover API (no JS)', () => {
    const open = d.querySelector('.head .menu');
    expect(open?.getAttribute('popovertarget')).toBe('drawer');
    expect(open?.getAttribute('aria-label')).toBe('Open navigation');
    expect(d.getElementById('drawer')?.hasAttribute('popover')).toBe(true);
    const close = d.querySelector('#drawer .menu');
    expect(close?.getAttribute('popovertargetaction')).toBe('hide');
  });
  it('shows the package version and the group crumb', () => {
    const pkg = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    );
    expect(d.querySelector('.ver')?.textContent).toBe(`v${pkg.version}`);
    expect(d.querySelector('.crumb')?.textContent).toBe('Components / lm-card');
  });
});

describe('docs.css', () => {
  const css = readFileSync(
    new URL('../src/styles/docs.css', import.meta.url),
    'utf8',
  );
  it('uses the indigo night page, not the brown paper', () => {
    expect(css).toMatch(/--lm-docs-page: var\(--lm-sky-night-1\)/);
    expect(css).not.toMatch(/#1d1510/i);
  });
  it('only transitions transform and opacity (plus discrete popover display/overlay)', () => {
    for (const m of css.matchAll(/transition:\s*([^;]+);/g)) {
      const props = (m[1] ?? '')
        .split(',')
        .map((p) => p.trim().split(/\s+/)[0]);
      for (const p of props)
        expect(['transform', 'opacity', 'overlay', 'display']).toContain(p);
    }
  });
  it('leaves room in the sidebar scroller for the whole focus ring (WCAG 2.4.11)', () => {
    const ring = css.match(
      /:focus-visible \{[^}]*outline: (\d+)px[^}]*outline-offset: (\d+)px/,
    );
    const need = Number(ring?.[1]) + Number(ring?.[2]);
    const nav = css.match(/\.side > nav \{([^}]*)\}/)?.[1] ?? '';
    const pad = Number(nav.match(/padding: \d+px (\d+)px/)?.[1]);
    expect(need).toBeGreaterThan(0);
    expect(pad).toBeGreaterThanOrEqual(need);
    expect(nav).toMatch(new RegExp(`margin-inline: -${pad}px`));
  });
  it('zeroes the motion under prefers-reduced-motion', () => {
    const block =
      css.match(/prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\n\}/)?.[1] ??
      '';
    for (const t of ['drawer-in', 'drawer-out', 'feedback'])
      expect(block).toMatch(new RegExp(`--lm-docs-${t}: 0s`));
  });
});
