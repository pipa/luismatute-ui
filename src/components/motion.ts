export const MOTION_KEY = 'lm.ui.motion';

/**
 * `full` is Flight: illustrations and the avatar both move.
 * `calm` is Info: the still layout, with the avatar idle left running.
 * `reduce` is explicit off: illustrations and the avatar idle both stop.
 */
export type MotionMode = 'reduce' | 'calm' | 'full';

function modeFromQuery(value: string | null): MotionMode | null {
  if (value === 'reduce' || value === 'off') return 'reduce';
  if (value === 'calm' || value === 'info') return 'calm';
  if (value === 'on' || value === 'full') return 'full';
  return null;
}

function modeFromStorage(value: string | null): MotionMode | null {
  if (value === 'off') return 'reduce';
  // Older builds stored the Info click as "reduce". That is layout-only calm.
  if (value === 'reduce' || value === 'calm' || value === 'info') return 'calm';
  if (value === 'full' || value === 'on') return 'full';
  return null;
}

export function readMotionPreference(
  search = globalThis.location?.search ?? '',
): MotionMode {
  const query = modeFromQuery(new URLSearchParams(search).get('motion'));
  if (query) return query;
  let stored: string | null = null;
  try {
    stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
  } catch {
    stored = null;
  }
  const saved = modeFromStorage(stored);
  if (saved) return saved;
  const reduce =
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ??
    false;
  return reduce ? 'reduce' : 'full';
}

export function writeMotionPreference(mode: MotionMode): void {
  // "off" is explicit reduce. A stored "reduce" stays reserved for legacy Info.
  const stored = mode === 'reduce' ? 'off' : mode;
  try {
    globalThis.localStorage?.setItem(MOTION_KEY, stored);
  } catch {
    /* private mode */
  }
}

export function applyMotionPreference(mode?: MotionMode): MotionMode {
  if (typeof document === 'undefined') return mode ?? 'full';
  const next = mode ?? readMotionPreference();
  const root = document.documentElement;
  root.dataset.motion = next;
  root.classList.toggle('is-static', next === 'reduce' || next === 'calm');
  root.classList.toggle('is-calm', next === 'calm');
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
  if (modeFromQuery(qs)) return true;
  try {
    const stored = globalThis.localStorage?.getItem(MOTION_KEY) ?? null;
    return modeFromStorage(stored) !== null;
  } catch {
    return false;
  }
}

let motionMediaBound = false;

/**
 * Follow later OS changes. A stored or query choice keeps its mode.
 * The `lm-motion` event still fires so the avatar can re-read the OS in Info.
 */
export function bindMotionMedia(): void {
  if (motionMediaBound) return;
  const mq = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!mq?.addEventListener) return;
  motionMediaBound = true;
  mq.addEventListener('change', () => {
    const root = document.documentElement;
    if (explicitMotionChoice()) {
      // Keep calm/full/reduce in place. The avatar re-reads the OS from this event.
      root.dispatchEvent(
        new CustomEvent('lm-motion', {
          detail: { motion: root.dataset.motion },
        }),
      );
      return;
    }
    if (
      root.dataset.motion === 'reduce' ||
      root.dataset.motion === 'calm' ||
      root.dataset.motion === 'full'
    ) {
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

/** True when the avatar idle should stop. Info (`calm`) follows the OS only. */
export function motionReduced(): boolean {
  const mode = document.documentElement.dataset.motion;
  if (mode === 'reduce') return true;
  if (mode === 'full') return false;
  return (
    globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  );
}
