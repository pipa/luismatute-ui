/**
 * Day/Night toggle scoped to one demo frame. Sets data-theme on the frame
 * only; components.css maps the theme to the token values. Starts from the
 * page mode, so the first press always shows the other theme.
 */
export type Theme = 'day' | 'night';

export function pageTheme(root: HTMLElement = document.documentElement): Theme {
  return root.dataset.mode === 'night' ? 'night' : 'day';
}

export function setFrameTheme(
  frame: HTMLElement,
  button: HTMLButtonElement,
  theme: Theme,
): void {
  frame.dataset.theme = theme;
  button.setAttribute('aria-pressed', String(theme === 'night'));
}

export function initDemoThemes(root: ParentNode = document): number {
  const buttons = [
    ...root.querySelectorAll<HTMLButtonElement>('[data-demo-theme]'),
  ];
  for (const button of buttons) {
    const frame = button.closest<HTMLElement>('[data-demo-frame]');
    if (!frame) continue;
    setFrameTheme(frame, button, pageTheme());
    button.hidden = false;
    button.addEventListener('click', () => {
      setFrameTheme(
        frame,
        button,
        frame.dataset.theme === 'night' ? 'day' : 'night',
      );
    });
  }
  return buttons.length;
}
