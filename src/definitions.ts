export interface BackgroundVideoPlugin {
  playVideo(options: { path: string; useWindow?: boolean; fullscreen?: boolean }): Promise<void>;
  pauseVideo(): Promise<void>;
  resumeVideo(): Promise<void>;
  stopVideo(): Promise<void>;
  setVolume(options: { volume: number }): Promise<void>;
  listResources(): Promise<{
    bundlePath: string;
    allResources: string[];
    videoResources: string[];
  }>;
}

// Export the wrapper type for better TypeScript support
export type BackgroundVideo = BackgroundVideoPlugin;

// Also export as a class for better compatibility
export class BackgroundVideoWrapper implements BackgroundVideoPlugin {
  async playVideo(_options: { path: string; useWindow?: boolean; fullscreen?: boolean }): Promise<void> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
  
  async pauseVideo(): Promise<void> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
  
  async resumeVideo(): Promise<void> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
  
  async stopVideo(): Promise<void> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
  
  async setVolume(_options: { volume: number }): Promise<void> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
  
  async listResources(): Promise<{
    bundlePath: string;
    allResources: string[];
    videoResources: string[];
  }> {
    throw new Error('BackgroundVideoWrapper must be instantiated');
  }
}
