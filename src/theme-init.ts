/*
 * No-flash head script for @luismatute/ui day/night. Serve as an external
 * file in <head> before the stylesheets (CSP script-src 'self'), not deferred:
 *   <script src="/lm-theme-init.js"></script>
 * Order: ?mode=, localStorage['lm.ui.theme'], prefers-color-scheme.
 */
(() => {
  const root = document.documentElement;
  let mode: string | null = null;
  try {
    mode = new URLSearchParams(location.search).get('mode');
    if (mode !== 'night' && mode !== 'day')
      mode = localStorage.getItem('lm.ui.theme');
  } catch {
    mode = null;
  }
  if (mode !== 'night' && mode !== 'day')
    mode = matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day';
  root.dataset.mode = mode;
})();
