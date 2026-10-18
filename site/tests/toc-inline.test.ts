import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { Window } from 'happy-dom';
import { describe, expect, it, vi } from 'vitest';
import Docs from '../src/layouts/Docs.astro';
import { initToc } from '../src/scripts/toc';
import docsCss from '../src/styles/docs.css?raw';

// #18 TOC slice: the inline "On this page" for screens without the aside
// (design/docs-shell/SPEC.md "On this page"; shots component-375/768-*.png).
const parse = (html: string) =>
  new new Window().DOMParser().parseFromString(html, 'text/html');
const toc = [
  { id: 'demo', label: 'Live demo' },
  { id: 'events', label: 'Events' },
];

describe('<Docs> inline "On this page"', async () => {
  const container = await AstroContainer.create();
  const render = (t: typeof toc) =>
    container.renderToString(Docs, {
      props: {
        title: 'x',
        description: 'y',
        slug: 'components/lm-card',
        toc: t,
      },
    });
  const d = parse(await render(toc));

  it('is a <details> disclosure at the top of the article, closed by default', () => {
    const el = d.querySelector('article > details.toc-inline');
    expect(el).not.toBeNull();
    expect(el?.hasAttribute('open')).toBe(false);
    expect(d.querySelector('article')?.firstElementChild).toBe(el);
    expect(el?.querySelector(':scope > summary')?.textContent?.trim()).toBe(
      'On this page',
    );
  });
  it('lists the same in-page links as the aside, in a named nav', () => {
    const inline = [...d.querySelectorAll('.toc-inline nav a')];
    const aside = [...d.querySelectorAll('aside.toc a')];
    expect(inline.map((a) => a.getAttribute('href'))).toEqual([
      '#demo',
      '#events',
    ]);
    expect(inline.map((a) => a.textContent)).toEqual(
      aside.map((a) => a.textContent),
    );
    expect(d.querySelector('.toc-inline nav')?.getAttribute('aria-label')).toBe(
      'On this page',
    );
  });
  it('is left out on pages with no sections', async () => {
    expect(parse(await render([])).querySelector('.toc-inline')).toBeNull();
  });
});

describe('initToc marks both lists', () => {
  it('sets aria-current on the same section in the aside and inline', () => {
    const w = new Window();
    const doc = w.document as unknown as Document;
    doc.body.innerHTML = `
      <details class="toc-inline"><nav><ul>
        <li><a href="#demo">Live demo</a></li><li><a href="#events">Events</a></li>
      </ul></nav></details>
      <h2 id="demo">Live demo</h2><h2 id="events">Events</h2>
      <aside class="toc"><ul>
        <li><a href="#demo">Live demo</a></li><li><a href="#events">Events</a></li>
      </ul></aside>`;
    // happy-dom has no layout (every top is 0): not at the end, and an offset
    // below 0 means no heading has passed it yet, so the first section is current.
    Object.defineProperty(doc.documentElement, 'scrollHeight', {
      value: 10_000,
    });
    vi.stubGlobal('window', w);
    try {
      initToc(doc, -1);
    } finally {
      vi.unstubAllGlobals();
    }
    const cur = [...doc.querySelectorAll('a[aria-current="true"]')];
    expect(cur.map((a) => a.closest('.toc, .toc-inline')?.className)).toEqual([
      'toc-inline',
      'toc',
    ]);
    expect(cur.every((a) => a.getAttribute('href') === '#demo')).toBe(true);
  });
});

describe('docs.css for the inline TOC', () => {
  const block = (sel: string) =>
    docsCss.match(
      new RegExp(`\\n${sel.replace(/[.[\]"()*:]/g, '\\$&')} \\{([^}]*)\\}`),
    )?.[1] ?? '';
  it('is hidden by default and shown exactly where the aside hides', () => {
    expect(block('.toc-inline')).toContain('display: none');
    const media =
      docsCss.match(/@media \(max-width: 1180px\) \{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(media).toMatch(/\.toc \{\s*display: none;/);
    expect(media).toMatch(/\.toc-inline \{\s*display: block;/);
  });
  it('the chevron only transitions transform, on a motion token', () => {
    const chev = block('.toc-inline summary::after');
    expect(chev).toMatch(/transition: transform var\(--lm-docs-feedback\)/);
    expect(chev).not.toMatch(/transition:[^;]*(margin|top|width|height|all)/);
  });
  it('the current link gets the 3px accent bar and bold weight', () => {
    expect(docsCss).toMatch(
      /\.toc a\[aria-current="true"\],\n\.toc-inline a\[aria-current="true"\] \{[^}]*box-shadow: inset 3px 0 0 var\(--lm-docs-accent\);/,
    );
  });
});
