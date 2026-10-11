export const MOTION_KEY = 'lm.ui.motion';

export type MotionMode = 'reduce' | 'full';

export function readMotionPreference(
  search = globalThis.location?.search ?? '',
): MotionMode {
  const qs = new URLSearchParams(search).get('motion');
  if (qs === 'reduce') return 'reduce';
  if (qs === 'on') return 'full';
  let stored: string | null = null;
  try {
    stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
  } catch {
    stored = null;
  }
  if (stored === 'reduce' || stored === 'full') return stored;
  const reduce =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;
  return reduce ? 'reduce' : 'full';
}

export function writeMotionPreference(mode: MotionMode): void {
  try {
    globalThis.localStorage?.setItem(MOTION_KEY, mode);
  } catch {
    /* private mode */
  }
}

export function applyMotionPreference(mode?: MotionMode): MotionMode {
  const next = mode ?? readMotionPreference();
  const root = document.documentElement;
  root.dataset.motion = next;
  root.classList.toggle('is-static', next === 'reduce');
  root.classList.toggle('is-motion', next === 'full');
  root.dispatchEvent(
    new CustomEvent('lm-motion', { detail: { motion: next } }),
  );
  bindMotionMedia();
  return next;
}

function explicitMotionChoice(
  search = globalThis.location?.search ?? '',
): boolean {
  const qs = new URLSearchParams(search).get('motion');
  if (qs === 'reduce' || qs === 'on') return true;
  try {
    const stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
    return stored === 'reduce' || stored === 'full';
  } catch {
    return false;
  }
}

let motionMediaBound = false;

/** Follow later OS changes when the page has not stored its own choice. */
export function bindMotionMedia(): void {
  if (motionMediaBound) return;
  const mq = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!mq?.addEventListener) return;
  motionMediaBound = true;
  mq.addEventListener('change', () => {
    if (explicitMotionChoice()) return;
    const root = document.documentElement;
    if (root.dataset.motion === 'reduce' || root.dataset.motion === 'full') {
      applyMotionPreference();
      return;
    }
    root.dispatchEvent(
      new CustomEvent('lm-motion', {
        detail: { motion: mq.matches ? 'reduce' : 'full' },
      }),
    );
  });
}

export function motionReduced(): boolean {
  const mode = document.documentElement.dataset.motion;
  if (mode === 'reduce') return true;
  if (mode === 'full') return false;
  return (
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}
