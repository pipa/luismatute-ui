export declare const MOTION_KEY = "lm.ui.motion";
export type MotionMode = 'reduce' | 'full';
export declare function readMotionPreference(search?: string): MotionMode;
export declare function writeMotionPreference(mode: MotionMode): void;
export declare function applyMotionPreference(mode?: MotionMode): MotionMode;
/** Follow later OS changes when the page has not stored its own choice. */
export declare function bindMotionMedia(): void;
export declare function motionReduced(): boolean;
//# sourceMappingURL=motion.d.ts.map