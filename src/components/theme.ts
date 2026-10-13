/** Day/night mode. Stored as `lm.ui.theme`, shared by the blog and the main site. */
export const THEME_KEY = 'lm.ui.theme';

export type ThemeMode = 'day' | 'night';

function parse(value: string | null | undefined): ThemeMode | null {
  if (value === 'night' || value === 'dark') return 'night';
  if (value === 'day' || value === 'light') return 'day';
  return null;
}

/** `?mode=`, then the stored choice, then `prefers-color-scheme`. */
export function readTheme(
  search = globalThis.location?.search ?? '',
): ThemeMode {
  const query = parse(new URLSearchParams(search).get('mode'));
  if (query) return query;
  let stored: string | null = null;
  try {
    stored = globalThis.localStorage?.getItem(THEME_KEY) ?? null;
  } catch {
    stored = null;
  }
  const saved = parse(stored);
  if (saved) return saved;
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'night'
    : 'day';
}

export function currentTheme(): ThemeMode {
  if (typeof document === 'undefined') return 'day';
  return document.documentElement.dataset.mode === 'night' ? 'night' : 'day';
}

/** Sets `html[data-mode]` and tells every toggle (`lm-theme` event). */
export function applyTheme(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.dataset.mode = mode;
  root.dispatchEvent(new CustomEvent('lm-theme', { detail: { mode } }));
}

/** User choice: store it, then switch (crossfade with View Transitions unless reduced motion). */
export function setTheme(mode: ThemeMode): void {
  try {
    globalThis.localStorage?.setItem(THEME_KEY, mode);
  } catch {
    /* private mode */
  }
  const reduce =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;
  const doc = document as Document & {
    startViewTransition?: (cb: () => void) => unknown;
  };
  if (!reduce && typeof doc.startViewTransition === 'function')
    doc.startViewTransition(() => applyTheme(mode));
  else applyTheme(mode);
}
