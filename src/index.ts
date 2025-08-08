import { registerPlugin } from '@capacitor/core';

import type { BackgroundVideoPlugin } from './definitions';

const BackgroundVideo = registerPlugin<BackgroundVideoPlugin>('BackgroundVideo', {
  web: () => import('./web').then((m) => new m.BackgroundVideoWeb()),
});

// Enhanced wrapper that handles assets path transformation
class BackgroundVideoWrapper implements BackgroundVideoPlugin {
  private plugin = BackgroundVideo;

  async playVideo(options: { path: string; useWindow?: boolean; fullscreen?: boolean }): Promise<void> {
    let { path, useWindow = false, fullscreen } = options; // по умолчанию слой внутри основного окна
    
    // Transform assets/ paths to HTTP URLs for Capacitor web server
    if (path.startsWith('assets/')) {
      const origin = window.location.origin;
      path = `${origin}/${path}`;
    }
    
    return this.plugin.playVideo({ path, useWindow, fullscreen });
  }

  async pauseVideo(): Promise<void> {
    return this.plugin.pauseVideo();
  }

  async resumeVideo(): Promise<void> {
    return this.plugin.resumeVideo();
  }

  async stopVideo(): Promise<void> {
    return this.plugin.stopVideo();
  }

  async setVolume(options: { volume: number }): Promise<void> {
    return this.plugin.setVolume(options);
  }

  async listResources(): Promise<{
    bundlePath: string;
    allResources: string[];
    videoResources: string[];
  }> {
    return this.plugin.listResources();
  }
}

// Create and export an instance
const BackgroundVideoInstance = new BackgroundVideoWrapper();

// Export everything
export * from './definitions';
export { BackgroundVideoInstance as BackgroundVideo };

// Also export as default for better compatibility
export default BackgroundVideoInstance;
