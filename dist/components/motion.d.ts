export declare const MOTION_KEY = "lm.ui.motion";
/**
 * `full` is Flight: illustrations and the avatar both move.
 * `calm` is Info: the still layout, with the avatar idle left running.
 * `reduce` is explicit off: illustrations and the avatar idle both stop.
 */
export type MotionMode = 'reduce' | 'calm' | 'full';
export declare function readMotionPreference(search?: string): MotionMode;
export declare function writeMotionPreference(mode: MotionMode): void;
export declare function applyMotionPreference(mode?: MotionMode): MotionMode;
/**
 * Follow later OS changes. A stored or query choice keeps its mode.
 * The `lm-motion` event still fires so the avatar can re-read the OS in Info.
 */
export declare function bindMotionMedia(): void;
/** True when the avatar idle should stop. Info (`calm`) follows the OS only. */
export declare function motionReduced(): boolean;
//# sourceMappingURL=motion.d.ts.map