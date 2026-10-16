/**
 * Copy buttons for docs code blocks. Progressive: buttons ship `hidden` and
 * only appear once this runs. Real <button>s, so Enter and Space work.
 */
export const COPIED_MS = 2000;

/** "⌘C" on Apple platforms, "Ctrl+C" elsewhere. */
export function copyShortcut(platform?: string): string {
  const nav = globalThis.navigator as
    | (Navigator & { userAgentData?: { platform?: string } })
    | undefined;
  const p = platform ?? nav?.userAgentData?.platform ?? nav?.platform ?? '';
  return /mac|iphone|ipad|ipod|ios/i.test(p) ? '⌘C' : 'Ctrl+C';
}

export interface CopyDeps {
  platform?: string;
  writeText?: (text: string) => Promise<void>;
  live?: HTMLElement | null;
}

function selectCode(pre: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(pre);
  const sel = window.getSelection();
  sel?.removeAllRanges();
  sel?.addRange(range);
}

export async function copyFrom(
  button: HTMLButtonElement,
  deps: CopyDeps = {},
): Promise<boolean> {
  const block = button.closest('.code');
  const pre = block?.querySelector('pre');
  const label = button.querySelector('.copy-t');
  const live = deps.live ?? document.getElementById('copy-live');
  if (!pre || !label) return false;
  const write =
    deps.writeText ?? ((t: string) => navigator.clipboard.writeText(t));
  const timer = Number(button.dataset.timer ?? 0);
  if (timer) clearTimeout(timer);
  let ok = true;
  try {
    await write(pre.textContent ?? '');
    button.setAttribute('data-copied', '');
    label.textContent = 'Copied';
    if (live) live.textContent = 'Copied to clipboard';
  } catch {
    ok = false;
    selectCode(pre);
    const keys = copyShortcut(deps.platform);
    label.textContent = `Press ${keys}`;
    if (live) live.textContent = `Copy failed. Code selected, press ${keys}.`;
  }
  button.dataset.timer = String(
    window.setTimeout(() => {
      button.removeAttribute('data-copied');
      label.textContent = 'Copy';
      if (live) live.textContent = '';
      delete button.dataset.timer;
    }, COPIED_MS),
  );
  return ok;
}

export function initCopy(
  root: ParentNode = document,
  deps: CopyDeps = {},
): number {
  const buttons = root.querySelectorAll<HTMLButtonElement>('button[data-copy]');
  for (const b of buttons) {
    b.hidden = false;
    b.addEventListener('click', () => void copyFrom(b, deps));
  }
  return buttons.length;
}
