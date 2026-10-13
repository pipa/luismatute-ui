import { defineLmAvatar } from './avatar.ts';
import { defineLmCard } from './card.ts';
import { defineLmChip } from './chip.ts';
import { defineLmFlightPlan } from './flight-plan.ts';
import { defineLmGlobe } from './globe.ts';
import { defineLmMore } from './more.ts';
import { applyMotionPreference } from './motion.ts';
import { defineLmMotionToggle } from './motion-toggle.ts';
import { defineLmPause } from './pause.ts';
import { defineLmShot } from './shot.ts';
import { defineLmSkyHeader } from './sky-header.ts';
import { defineLmThemeToggle } from './theme-toggle.ts';

export { defineLmAvatar, LmAvatar } from './avatar.ts';
export { defineLmCard, LmCard } from './card.ts';
export { defineLmChip, LmChip } from './chip.ts';
export type { FlightStop } from './flight-plan.ts';
export { defineLmFlightPlan, LmFlightPlan } from './flight-plan.ts';
export { defineLmGlobe, LmGlobe } from './globe.ts';
export type { GlobeRoute, GlobeStop } from './globe-route.ts';
export { defaultRoute, parseRoute } from './globe-route.ts';
export { defineLmMore, LmMore } from './more.ts';
export type { MotionMode } from './motion.ts';
export {
  applyMotionPreference,
  bindMotionMedia,
  MOTION_KEY,
  readMotionPreference,
  writeMotionPreference,
} from './motion.ts';
export { defineLmMotionToggle, LmMotionToggle } from './motion-toggle.ts';
export { defineLmPause, LmPause } from './pause.ts';
export { defineLmShot, LmShot } from './shot.ts';
export {
  defineLmSkyHeader,
  LmSkyHeader,
  landEdge,
  skyLayersHtml,
} from './sky-header.ts';
export type { ThemeMode } from './theme.ts';
export {
  applyTheme,
  currentTheme,
  readTheme,
  setTheme,
  THEME_KEY,
} from './theme.ts';
export { defineLmThemeToggle, LmThemeToggle } from './theme-toggle.ts';

export function defineLmUi(): void {
  defineLmCard();
  defineLmChip();
  defineLmMore();
  defineLmMotionToggle();
  defineLmPause();
  defineLmShot();
  defineLmAvatar();
  defineLmGlobe();
  defineLmFlightPlan();
  defineLmThemeToggle();
  defineLmSkyHeader();
  if (typeof document !== 'undefined') applyMotionPreference();
}
