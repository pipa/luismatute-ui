/**
 * Docs search over the Pagefind index that `pnpm build:site` writes to
 * site-dist/pagefind/ (served at /ui/pagefind/). Our own dialog on the Pagefind
 * JS API, not Pagefind's default UI, so nothing injects inline styles.
 * pagefind.js (and its WebAssembly) loads only when the dialog first opens.
 *
 * Keys: the header pill, "/" (outside text fields) and Cmd/Ctrl+K open it;
 * Cmd/Ctrl+K again or Escape closes it and focus goes back where it was.
 * ArrowUp/ArrowDown move through the results (aria-activedescendant on the
 * combobox input), Enter opens the active one.
 */

export interface Hit {
  url: string;
  title: string;
  excerpt: string;
  /** Set on a heading-level hit (#49): the title of the page it sits in. */
  page?: string;
}

export interface PagefindSub {
  url: string;
  title: string;
  excerpt: string;
}
export interface PagefindData {
  url: string;
  excerpt: string;
  meta: { title?: string };
  sub_results?: PagefindSub[];
}
interface Pagefind {
  options(o: Record<string, unknown>): Promise<void>;
  init(): Promise<void>;
  search(q: string): Promise<{
    results: { data(): Promise<PagefindData> }[];
  } | null>;
}

export const MAX_HITS = 8;
/** Heading-level hits shown under one page (#49). */
export const MAX_SUBS = 3;

/**
 * Pagefind page results to a flat option list (#49): each page, then up to
 * MAX_SUBS of its sub_results that point at a heading anchor. Pagefind's
 * sub_result for the text above the first heading has the bare page URL; that
 * one is already the page hit, so it is dropped. Capped at MAX_HITS overall.
 */
export function toHits(data: PagefindData[], max = MAX_HITS): Hit[] {
  const out: Hit[] = [];
  for (const d of data) {
    if (out.length >= max) break;
    const title = d.meta.title ?? d.url;
    out.push({ url: d.url, title, excerpt: d.excerpt });
    const subs = (d.sub_results ?? [])
      .filter((s) => s.url.includes('#') && s.url.split('#')[0] === d.url)
      .slice(0, MAX_SUBS);
    for (const s of subs) {
      if (out.length >= max) break;
      out.push({ url: s.url, title: s.title, excerpt: s.excerpt, page: title });
    }
  }
  return out;
}

/** True when a key press belongs to a text field, not to a page shortcut. */
export function isTypingTarget(el: EventTarget | null): boolean {
  if (!el || !(el as Element).tagName) return false;
  const e = el as HTMLElement;
  return (
    /^(INPUT|TEXTAREA|SELECT)$/.test(e.tagName) || e.isContentEditable === true
  );
}

/** Which page shortcut a keydown is, if any. */
export function shortcutOf(
  e: Pick<KeyboardEvent, 'key' | 'metaKey' | 'ctrlKey' | 'altKey' | 'target'>,
): 'toggle' | 'open' | null {
  if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k')
    return 'toggle';
  if (
    e.key === '/' &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.altKey &&
    !isTypingTarget(e.target)
  )
    return 'open';
  return null;
}

/** Next active index for an arrow key, wrapping; -1 when there is nothing. */
export function step(active: number, count: number, dir: 1 | -1): number {
  if (count <= 0) return -1;
  if (active < 0) return dir === 1 ? 0 : count - 1;
  return (active + dir + count) % count;
}

export function isApple(
  nav: Pick<Navigator, 'platform' | 'userAgent'>,
): boolean {
  return /Mac|iPhone|iPad|iPod/.test(nav.platform || nav.userAgent);
}

/**
 * Pagefind excerpts are text with <mark> around the matched words. Rebuild
 * them as text nodes and <mark> elements so nothing else from the index is
 * ever parsed as markup.
 */
export function excerptNodes(doc: Document, excerpt: string): Node[] {
  const out: Node[] = [];
  const parsed = new DOMParser().parseFromString(
    `<p>${excerpt}</p>`,
    'text/html',
  ).body.firstElementChild;
  for (const n of parsed?.childNodes ?? []) {
    if (n.nodeName === 'MARK') {
      const m = doc.createElement('mark');
      m.textContent = n.textContent;
      out.push(m);
    } else out.push(doc.createTextNode(n.textContent ?? ''));
  }
  return out;
}

/** Renders hits as role="option" links into the listbox; returns them. */
export function renderHits(
  list: HTMLElement,
  hits: Hit[],
): HTMLAnchorElement[] {
  const doc = list.ownerDocument;
  const opts = hits.map((hit, i) => {
    const a = doc.createElement('a');
    a.className = hit.page ? 'search-hit search-hit-sub' : 'search-hit';
    if (hit.page) a.dataset.searchSub = '';
    a.id = `search-hit-${i}`;
    a.href = hit.url;
    a.tabIndex = -1;
    a.setAttribute('role', 'option');
    a.setAttribute('aria-selected', 'false');
    const title = doc.createElement('span');
    title.className = 'search-title';
    title.textContent = hit.title;
    const excerpt = doc.createElement('span');
    excerpt.className = 'search-excerpt';
    excerpt.append(...excerptNodes(doc, hit.excerpt));
    const crumb = doc.createElement('span');
    crumb.className = 'search-crumb';
    crumb.textContent = hit.url;
    a.append(title, excerpt, crumb);
    return a;
  });
  list.replaceChildren(...opts);
  return opts;
}

let pagefind: Promise<Pagefind> | undefined;
function loadPagefind(base: string): Promise<Pagefind> {
  pagefind ??= (async () => {
    const url = `${base}pagefind/pagefind.js`;
    const api = (await import(/* @vite-ignore */ url)) as Pagefind;
    await api.options({ baseUrl: base, excerptLength: 16 });
    await api.init();
    return api;
  })();
  // A failed load (offline, dev server without an index) can be retried.
  pagefind.catch(() => {
    pagefind = undefined;
  });
  return pagefind;
}

export function initSearch(
  doc: Document = document,
  base: string = import.meta.env.BASE_URL,
): boolean {
  const dialog = doc.querySelector<HTMLDialogElement>('dialog[data-search]');
  const input = dialog?.querySelector<HTMLInputElement>('.search-input');
  const list = dialog?.querySelector<HTMLElement>('[role="listbox"]');
  const empty = dialog?.querySelector<HTMLElement>('[data-search-empty]');
  const hint = dialog?.querySelector<HTMLElement>('[data-search-empty-hint]');
  const status = dialog?.querySelector<HTMLElement>('[data-search-status]');
  const close = dialog?.querySelector<HTMLButtonElement>('[data-search-close]');
  const triggers = [
    ...doc.querySelectorAll<HTMLButtonElement>('[data-search-open]'),
  ];
  if (!dialog || !input || !list || !empty || !hint || !status || !close)
    return false;
  const hintText = hint.textContent ?? '';

  const apple = isApple(navigator);
  for (const t of triggers) {
    const kbd = t.querySelector('[data-search-kbd]');
    if (kbd) kbd.textContent = apple ? '⌘K' : 'Ctrl K';
    t.setAttribute('aria-label', 'Search');
    t.hidden = false;
    t.addEventListener('click', () => open());
  }

  let returnTo: HTMLElement | null = null;
  let opts: HTMLAnchorElement[] = [];
  let active = -1;
  let seq = 0;
  let timer = 0;

  const setActive = (i: number) => {
    active = i;
    for (const [j, o] of opts.entries()) {
      o.setAttribute('aria-selected', String(j === i));
      o.classList.toggle('is-active', j === i);
    }
    const cur = opts[i];
    if (cur) {
      input.setAttribute('aria-activedescendant', cur.id);
      cur.scrollIntoView({ block: 'nearest' });
    } else input.removeAttribute('aria-activedescendant');
  };

  const show = (hits: Hit[] | null, message = hintText) => {
    opts = hits ? renderHits(list, hits) : [];
    if (!hits) list.replaceChildren();
    list.hidden = opts.length === 0;
    input.setAttribute('aria-expanded', String(opts.length > 0));
    const none = hits !== null && hits.length === 0;
    empty.hidden = !none;
    hint.textContent = message;
    setActive(opts.length ? 0 : -1);
    status.textContent = none
      ? 'No results'
      : hits
        ? `${hits.length} result${hits.length === 1 ? '' : 's'}`
        : '';
  };

  const run = async (q: string) => {
    const mine = ++seq;
    if (!q.trim()) return show(null);
    try {
      const api = await loadPagefind(base);
      const res = await api.search(q);
      const data = await Promise.all(
        (res?.results ?? []).slice(0, MAX_HITS).map((r) => r.data()),
      );
      if (mine !== seq) return;
      show(toHits(data));
    } catch {
      if (mine === seq) show([], 'Search is not available right now.');
    }
  };

  function open() {
    if (dialog?.open || !input) return;
    returnTo = doc.activeElement as HTMLElement | null;
    dialog?.showModal();
    for (const t of triggers) t.setAttribute('aria-expanded', 'true');
    input.focus();
    input.select();
    // Start loading the index as the dialog opens, not on page load.
    loadPagefind(base).catch(() => {});
    if (input.value.trim()) void run(input.value);
  }
  const shut = () => {
    if (dialog.open) dialog.close();
  };

  dialog.addEventListener('close', () => {
    for (const t of triggers) t.setAttribute('aria-expanded', 'false');
    const back = returnTo?.isConnected ? returnTo : triggers[0];
    back?.focus();
    returnTo = null;
  });
  // Click on the backdrop (the dialog box itself, outside the panel).
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) shut();
  });
  close.addEventListener('click', shut);

  input.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(() => void run(input.value), 120);
  });
  input.addEventListener('keydown', (e) => {
    // A search field would eat the first Escape to clear itself; close instead.
    if (e.key === 'Escape') {
      e.preventDefault();
      shut();
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(step(active, opts.length, e.key === 'ArrowDown' ? 1 : -1));
    } else if (e.key === 'Enter') {
      const cur = opts[active];
      if (cur) {
        e.preventDefault();
        cur.click();
      }
    }
  });
  // Keep Tab inside the dialog: the input and the close button.
  dialog.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    const first = input;
    const last = close;
    if (e.shiftKey && doc.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && doc.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  doc.addEventListener('keydown', (e) => {
    const s = shortcutOf(e);
    if (!s) return;
    if (s === 'toggle') {
      e.preventDefault();
      if (dialog.open) shut();
      else open();
    } else if (!dialog.open) {
      e.preventDefault();
      open();
    }
  });
  return true;
}
