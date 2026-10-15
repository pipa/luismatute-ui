/**
 * Day/night mode, shared by luismatute.me and blog.luismatute.me.
 *
 * The choice lives in a cookie (`lm-mode=day|night|auto`) scoped to the parent
 * domain so it carries across subdomains, mirrored in `localStorage` under
 * `lm.ui.theme` for older visits. Read order: `?mode=`, cookie, storage,
 * `prefers-color-scheme`. Bad values are ignored, never thrown on.
 *
 * Cookie attributes come from the theme-init script tag, so tests can point
 * them at another domain without touching CSP or inline code:
 *   <script src="theme-init.js" data-lm-theme
 *           data-cookie-domain=".luismatute.me" data-cookie-secure="auto">
 * Domain is only sent when the page is on that domain (else host-only);
 * Secure defaults to "auto" (set on https only, as http drops Secure cookies).
 */
export const THEME_KEY = 'lm.ui.theme';
export const THEME_COOKIE = 'lm-mode';
export const THEME_COOKIE_DOMAIN = '.luismatute.me';
export const THEME_COOKIE_MAX_AGE = 31536000;

export type ThemeMode = 'day' | 'night';
export type ThemeChoice = ThemeMode | 'auto';

export interface ThemeCookieConfig {
  domain: string | null;
  secure: boolean;
}

function parse(value: string | null | undefined): ThemeMode | null {
  if (value === 'night' || value === 'dark') return 'night';
  if (value === 'day' || value === 'light') return 'day';
  return null;
}

function parseChoice(value: string | null | undefined): ThemeChoice | null {
  return value === 'auto' ? 'auto' : parse(value);
}

/** The `lm-mode` cookie, or null when absent or not day/night/auto. */
export function readThemeCookie(
  cookie = globalThis.document?.cookie ?? '',
): ThemeChoice | null {
  try {
    for (const part of String(cookie).split(';')) {
      const eq = part.indexOf('=');
      if (eq < 0 || part.slice(0, eq).trim() !== THEME_COOKIE) continue;
      const v = part.slice(eq + 1).trim();
      if (v === 'day' || v === 'night' || v === 'auto') return v;
      return null;
    }
  } catch {
    /* fall through */
  }
  return null;
}

function hostMatches(host: string, domain: string): boolean {
  const bare = domain.replace(/^\./, '').toLowerCase();
  const h = host.toLowerCase();
  return bare !== '' && (h === bare || h.endsWith(`.${bare}`));
}

/** Cookie attributes from `script[data-lm-theme]`, defaults otherwise. */
export function themeCookieConfig(
  script: Element | null = globalThis.document?.querySelector(
    'script[data-lm-theme]',
  ) ?? null,
  loc: { hostname: string; protocol: string } | undefined = globalThis.location,
): ThemeCookieConfig {
  const host = loc?.hostname ?? '';
  const wanted =
    script?.getAttribute('data-cookie-domain')?.trim() || THEME_COOKIE_DOMAIN;
  const secureAttr = script?.getAttribute('data-cookie-secure') ?? 'auto';
  return {
    domain: hostMatches(host, wanted) ? wanted : null,
    secure:
      secureAttr === 'true' ||
      (secureAttr !== 'false' && loc?.protocol === 'https:'),
  };
}

/** The Set-Cookie string `document.cookie` gets for a choice. */
export function themeCookieString(
  choice: ThemeChoice,
  config: ThemeCookieConfig = themeCookieConfig(),
): string {
  let s = `${THEME_COOKIE}=${choice}; Path=/; Max-Age=${THEME_COOKIE_MAX_AGE}; SameSite=Lax`;
  if (config.domain) s += `; Domain=${config.domain}`;
  if (config.secure) s += '; Secure';
  return s;
}

function system(): ThemeMode {
  return globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
    ? 'night'
    : 'day';
}

/** `?mode=`, then the cookie, then the stored choice, then `prefers-color-scheme`. */
export function readTheme(
  search = globalThis.location?.search ?? '',
): ThemeMode {
  let query: ThemeMode | null = null;
  try {
    query = parse(new URLSearchParams(search).get('mode'));
  } catch {
    query = null;
  }
  if (query) return query;
  const cookie = readThemeCookie();
  if (cookie) return cookie === 'auto' ? system() : cookie;
  let stored: string | null = null;
  try {
    stored = globalThis.localStorage?.getItem(THEME_KEY) ?? null;
  } catch {
    stored = null;
  }
  return parse(stored) ?? system();
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

/** Persist a choice: the shared cookie plus the local mirror. */
export function saveTheme(choice: ThemeChoice): void {
  if (!parseChoice(choice)) return;
  try {
    document.cookie = themeCookieString(choice);
  } catch {
    /* cookies off */
  }
  try {
    if (choice === 'auto') globalThis.localStorage?.removeItem(THEME_KEY);
    else globalThis.localStorage?.setItem(THEME_KEY, choice);
  } catch {
    /* private mode */
  }
}

/** User choice: store it, then switch (crossfade with View Transitions unless reduced motion). */
export function setTheme(choice: ThemeChoice): void {
  saveTheme(choice);
  const mode = choice === 'auto' ? system() : choice;
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
