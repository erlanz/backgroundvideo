import { WebPlugin } from '@capacitor/core';
import type { BackgroundVideoPlugin } from './definitions';
export declare class BackgroundVideoWeb extends WebPlugin implements BackgroundVideoPlugin {
    private videoElement;
    playVideo(options: {
        path: string;
    }): Promise<void>;
    pauseVideo(): Promise<void>;
    resumeVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    setVolume(options: {
        volume: number;
    }): Promise<void>;
}
