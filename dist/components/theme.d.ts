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
export declare const THEME_KEY = "lm.ui.theme";
export declare const THEME_COOKIE = "lm-mode";
export declare const THEME_COOKIE_DOMAIN = ".luismatute.me";
export declare const THEME_COOKIE_MAX_AGE = 31536000;
export type ThemeMode = 'day' | 'night';
export type ThemeChoice = ThemeMode | 'auto';
export interface ThemeCookieConfig {
    domain: string | null;
    secure: boolean;
}
/** The `lm-mode` cookie, or null when absent or not day/night/auto. */
export declare function readThemeCookie(cookie?: string): ThemeChoice | null;
/** Cookie attributes from `script[data-lm-theme]`, defaults otherwise. */
export declare function themeCookieConfig(script?: Element | null, loc?: {
    hostname: string;
    protocol: string;
} | undefined): ThemeCookieConfig;
/** The Set-Cookie string `document.cookie` gets for a choice. */
export declare function themeCookieString(choice: ThemeChoice, config?: ThemeCookieConfig): string;
/** `?mode=`, then the cookie, then the stored choice, then `prefers-color-scheme`. */
export declare function readTheme(search?: string): ThemeMode;
export declare function currentTheme(): ThemeMode;
/** Sets `html[data-mode]` and tells every toggle (`lm-theme` event). */
export declare function applyTheme(mode: ThemeMode): void;
/** Persist a choice: the shared cookie plus the local mirror. */
export declare function saveTheme(choice: ThemeChoice): void;
/** User choice: store it, then switch (crossfade with View Transitions unless reduced motion). */
export declare function setTheme(choice: ThemeChoice): void;
//# sourceMappingURL=theme.d.ts.map