const base = document.querySelector('link[rel="stylesheet"][href*="site.css"]')?.getAttribute('href') ?? '/ui/site.css';
const root = base.replace(/site\.css$/, '');

window.addEventListener('DOMContentLoaded', () => {
  const start = () => {
    if (typeof window.PagefindUI !== 'function') return;
    new window.PagefindUI({
      element: '#search',
      baseUrl: root,
      bundlePath: `${root}pagefind/`,
      showImages: false,
    });
  };
  if ('requestIdleCallback' in window) requestIdleCallback(start);
  else setTimeout(start, 1);
});
