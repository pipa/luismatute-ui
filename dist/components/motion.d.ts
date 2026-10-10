export declare const MOTION_KEY = "lm.ui.motion";
export type MotionMode = 'reduce' | 'full';
export declare function readMotionPreference(search?: string): MotionMode;
export declare function writeMotionPreference(mode: MotionMode): void;
export declare function applyMotionPreference(mode?: MotionMode): MotionMode;
export declare function motionReduced(): boolean;
//# sourceMappingURL=motion.d.ts.map