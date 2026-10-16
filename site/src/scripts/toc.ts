/**
 * Marks the "On this page" link for the section being read with
 * aria-current="true". Without JS the list is plain in-page links.
 */
export function pickCurrent(
  ids: string[],
  tops: Map<string, number>,
  offset: number,
): string | undefined {
  let current = ids[0];
  for (const id of ids) {
    const top = tops.get(id);
    if (top !== undefined && top - offset <= 0) current = id;
  }
  return current;
}

export function initToc(
  doc: Document = document,
  offset = 96,
): (() => void) | undefined {
  const links = [
    ...doc.querySelectorAll<HTMLAnchorElement>('.toc a[href^="#"]'),
  ];
  if (links.length === 0) return undefined;
  const ids = links.map((a) => decodeURIComponent(a.hash.slice(1)));
  const update = () => {
    const tops = new Map<string, number>();
    for (const id of ids) {
      const el = doc.getElementById(id);
      if (el) tops.set(id, el.getBoundingClientRect().top);
    }
    const atEnd =
      window.innerHeight + window.scrollY >=
      doc.documentElement.scrollHeight - 2;
    const cur = atEnd ? ids[ids.length - 1] : pickCurrent(ids, tops, offset);
    for (const a of links) {
      if (a.hash.slice(1) === cur) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    }
  };
  let raf = 0;
  const onScroll = () => {
    if (!raf)
      raf = requestAnimationFrame(() => {
        raf = 0;
        update();
      });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('hashchange', update);
  update();
  return update;
}
