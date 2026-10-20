/** Registers the demoed elements. Without JS the demos show their static markup. */
import { defineLmAvatar } from '../../../dist/components/avatar.js';
import { defineLmCard } from '../../../dist/components/card.js';
import { defineLmFlightPlan } from '../../../dist/components/flight-plan.js';
import { defineLmGlobe } from '../../../dist/components/globe.js';
import { defineLmChip } from '../../../dist/components/chip.js';
import { defineLmMore } from '../../../dist/components/more.js';
import { defineLmMotionToggle } from '../../../dist/components/motion-toggle.js';
import { defineLmPause } from '../../../dist/components/pause.js';
import { defineLmShot } from '../../../dist/components/shot.js';
import { initAvatarPoses } from './avatar-poses';
import { initDemoThemes } from './demo-theme';

export function initDemos(): void {
  defineLmCard();
  defineLmChip();
  defineLmMore();
  defineLmMotionToggle();
  defineLmPause();
  defineLmShot();
  defineLmAvatar();
  defineLmGlobe();
  defineLmFlightPlan();
  initDemoThemes();
  initAvatarPoses();
  // Echo component events into the demo's log so they're visible and announced.
  for (const log of document.querySelectorAll<HTMLElement>('[data-demo-log]')) {
    const type = log.dataset.demoLog ?? '';
    const target =
      // These two dispatch on <html>, not on the element.
      type === 'lm-pause' || type === 'lm-motion'
        ? document.documentElement
        : log.closest('[data-demo-frame]');
    target?.addEventListener(type, (e) => {
      log.textContent = `${type} ${JSON.stringify((e as CustomEvent).detail)}`;
    });
  }
}
