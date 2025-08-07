export interface BackgroundVideoPlugin {
  playVideo(options: { path: string }): Promise<void>;
  pauseVideo(): Promise<void>;
  resumeVideo(): Promise<void>;
  stopVideo(): Promise<void>;
  setVolume(options: { volume: number }): Promise<void>;
}

// Export the wrapper type for better TypeScript support
export type BackgroundVideo = BackgroundVideoPlugin;
