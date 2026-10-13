/** Day/night mode. Stored as `lm.ui.theme`, shared by the blog and the main site. */
export declare const THEME_KEY = "lm.ui.theme";
export type ThemeMode = 'day' | 'night';
/** `?mode=`, then the stored choice, then `prefers-color-scheme`. */
export declare function readTheme(search?: string): ThemeMode;
export declare function currentTheme(): ThemeMode;
/** Sets `html[data-mode]` and tells every toggle (`lm-theme` event). */
export declare function applyTheme(mode: ThemeMode): void;
/** User choice: store it, then switch (crossfade with View Transitions unless reduced motion). */
export declare function setTheme(mode: ThemeMode): void;
//# sourceMappingURL=theme.d.ts.map