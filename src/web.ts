import { WebPlugin } from '@capacitor/core';

import type { BackgroundVideoPlugin } from './definitions';

export class BackgroundVideoWeb extends WebPlugin implements BackgroundVideoPlugin {
  private videoElement: HTMLVideoElement | null = null;

  async playVideo(options: { path: string }): Promise<void> {
    console.log('BackgroundVideo: playVideo', options);
    
    // Создаем видео элемент если его нет
    if (!this.videoElement) {
      this.videoElement = document.createElement('video');
      this.videoElement.style.position = 'fixed';
      this.videoElement.style.top = '0';
      this.videoElement.style.left = '0';
      this.videoElement.style.width = '100%';
      this.videoElement.style.height = '100%';
      this.videoElement.style.objectFit = 'cover';
      this.videoElement.style.zIndex = '-1';
      this.videoElement.loop = true;
      this.videoElement.muted = true;
      document.body.appendChild(this.videoElement);
    }

    this.videoElement.src = options.path;
    await this.videoElement.play();
  }

  async pauseVideo(): Promise<void> {
    console.log('BackgroundVideo: pauseVideo');
    if (this.videoElement) {
      this.videoElement.pause();
    }
  }

  async resumeVideo(): Promise<void> {
    console.log('BackgroundVideo: resumeVideo');
    if (this.videoElement) {
      await this.videoElement.play();
    }
  }

  async stopVideo(): Promise<void> {
    console.log('BackgroundVideo: stopVideo');
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.remove();
      this.videoElement = null;
    }
  }

  async setVolume(options: { volume: number }): Promise<void> {
    console.log('BackgroundVideo: setVolume', options);
    if (this.videoElement) {
      this.videoElement.volume = Math.max(0, Math.min(1, options.volume));
    }
  }
}
