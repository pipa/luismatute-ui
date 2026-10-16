/** Registers the demoed elements. Without JS the demos show their static markup. */
import { defineLmCard } from '../../../dist/components/card.js';
import { defineLmChip } from '../../../dist/components/chip.js';
import { defineLmMore } from '../../../dist/components/more.js';
import { defineLmMotionToggle } from '../../../dist/components/motion-toggle.js';
import { defineLmPause } from '../../../dist/components/pause.js';
import { initDemoThemes } from './demo-theme';

export function initDemos(): void {
  defineLmCard();
  defineLmChip();
  defineLmMore();
  defineLmMotionToggle();
  defineLmPause();
  initDemoThemes();
  // Echo component events into the demo's log so they're visible and announced.
  for (const log of document.querySelectorAll<HTMLElement>('[data-demo-log]')) {
    const type = log.dataset.demoLog ?? '';
    const target =
      type === 'lm-pause'
        ? document.documentElement
        : log.closest('[data-demo-frame]');
    target?.addEventListener(type, (e) => {
      log.textContent = `${type} ${JSON.stringify((e as CustomEvent).detail)}`;
    });
  }
}
