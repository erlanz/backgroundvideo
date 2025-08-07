export interface BackgroundVideoPlugin {
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
export declare type BackgroundVideo = BackgroundVideoPlugin;
export declare class BackgroundVideoWrapper implements BackgroundVideoPlugin {
    playVideo(_options: {
        path: string;
    }): Promise<void>;
    pauseVideo(): Promise<void>;
    resumeVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    setVolume(_options: {
        volume: number;
    }): Promise<void>;
}
