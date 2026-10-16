/**
 * Click-to-copy for token names and values on the Foundations pages.
 * Progressive: tokens ship as plain <code>; this upgrades each one to a real
 * <button> (Enter/Space) that copies its data-copy-text, shares the slice 2
 * live region and timer, and falls back to selecting the text.
 */
import { COPIED_MS, type CopyDeps, copyShortcut } from './copy';

function select(el: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(el);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

export async function copyToken(
  button: HTMLButtonElement,
  deps: CopyDeps = {},
): Promise<boolean> {
  const text = button.dataset.copyText ?? '';
  const live = deps.live ?? document.getElementById('copy-live');
  const write =
    deps.writeText ?? ((t: string) => navigator.clipboard.writeText(t));
  const timer = Number(button.dataset.timer ?? 0);
  if (timer) clearTimeout(timer);
  let ok = true;
  try {
    await write(text);
    button.setAttribute('data-copied', '');
    if (live) live.textContent = `Copied ${text}`;
  } catch {
    ok = false;
    select(button);
    if (live)
      live.textContent = `Copy failed. Text selected, press ${copyShortcut(deps.platform)}.`;
  }
  button.dataset.timer = String(
    window.setTimeout(() => {
      button.removeAttribute('data-copied');
      if (live) live.textContent = '';
      delete button.dataset.timer;
    }, COPIED_MS),
  );
  return ok;
}

export function initTokenCopy(
  root: ParentNode = document,
  deps: CopyDeps = {},
): number {
  const codes = [
    ...root.querySelectorAll<HTMLElement>('code.tok[data-copy-text]'),
  ];
  for (const code of codes) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tok tok-copy';
    b.dataset.copyText = code.dataset.copyText ?? '';
    b.setAttribute(
      'aria-label',
      code.dataset.copyLabel ?? `Copy ${b.dataset.copyText}`,
    );
    b.append(...code.childNodes);
    code.replaceWith(b);
    b.addEventListener('click', () => void copyToken(b, deps));
  }
  return codes.length;
}
