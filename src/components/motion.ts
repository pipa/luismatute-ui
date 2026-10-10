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
  return next;
}

export function motionReduced(): boolean {
  return document.documentElement.dataset.motion === 'reduce';
}
