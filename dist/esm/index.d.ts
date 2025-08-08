import type { BackgroundVideoPlugin } from './definitions';
declare class BackgroundVideoWrapper implements BackgroundVideoPlugin {
    private plugin;
    playVideo(options: {
        path: string;
        useWindow?: boolean;
    }): Promise<void>;
    pauseVideo(): Promise<void>;
    resumeVideo(): Promise<void>;
    stopVideo(): Promise<void>;
    setVolume(options: {
        volume: number;
    }): Promise<void>;
    listResources(): Promise<{
        bundlePath: string;
        allResources: string[];
        videoResources: string[];
    }>;
}
declare const BackgroundVideoInstance: BackgroundVideoWrapper;
export * from './definitions';
export { BackgroundVideoInstance as BackgroundVideo };
export default BackgroundVideoInstance;
