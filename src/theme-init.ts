/*
 * No-flash head script for @luismatute/ui day/night. Serve as an external
 * file in <head> before the stylesheets (CSP script-src 'self'), not deferred:
 *   <script src="/lm-theme-init.js" data-lm-theme></script>
 * Order: ?mode=, cookie lm-mode, localStorage['lm.ui.theme'],
 * prefers-color-scheme. Never throws; bad values fall through.
 */
import { readTheme } from './components/theme.ts';

try {
  document.documentElement.dataset.mode = readTheme();
} catch {
  document.documentElement.dataset.mode = 'day';
}
