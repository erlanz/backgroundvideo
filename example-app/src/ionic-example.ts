import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackgroundVideo } from 'backgroundvideo';

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="onboarding-page" style="--background: transparent;">
      <div class="overlay-content">
        <h1>Welcome to Our App</h1>
        <p>Experience smooth background video playback</p>
        
        <div class="video-controls">
          <ion-button (click)="playAssetsVideo()" color="primary">
            🎯 Play Assets Video
          </ion-button>
          
          <ion-button (click)="playRemoteVideo()" color="secondary">
            🌐 Play Remote Video
          </ion-button>
          
          <ion-button (click)="playBundleVideo()" color="tertiary">
            📦 Play Bundle Video
          </ion-button>
          
          <ion-button (click)="playLocalVideo()" color="success">
            💾 Play Local Video
          </ion-button>
        </div>
        
        <div class="playback-controls">
          <ion-button (click)="pauseVideo()" fill="outline">
            ⏸️ Pause
          </ion-button>
          
          <ion-button (click)="resumeVideo()" fill="outline">
            ▶️ Resume
          </ion-button>
          
          <ion-button (click)="stopVideo()" fill="outline" color="danger">
            ⏹️ Stop
          </ion-button>
        </div>
        
        <div class="volume-control">
          <ion-label>Volume: {{ volume }}</ion-label>
          <ion-range 
            [(ngModel)]="volume" 
            min="0" 
            max="1" 
            step="0.1"
            (ionChange)="setVolume()">
          </ion-range>
        </div>
      </div>
    </ion-content>
  `,
  styles: [`
    .onboarding-page {
      --background: transparent;
    }
    
    .overlay-content {
      position: relative;
      z-index: 1;
      text-align: center;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 16px;
      margin: 2rem;
      backdrop-filter: blur(10px);
    }
    
    .video-controls {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 2rem 0;
    }
    
    .playback-controls {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin: 1rem 0;
    }
    
    .volume-control {
      margin-top: 2rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 8px;
    }
    
    ion-range {
      margin-top: 8px;
    }
  `]
})
export class OnboardingPage implements OnInit, OnDestroy {
  volume = 0.5;

  async ngOnInit() {
    // Auto-play assets video on page load
    await this.playAssetsVideo();
  }

  ngOnDestroy() {
    // Clean up video when leaving the page
    this.stopVideo();
  }

  /**
   * Example 1: Play video from assets folder
   * This will be automatically transformed to: http://localhost/assets/video/intro.mp4
   */
  async playAssetsVideo() {
    try {
      await BackgroundVideo.playVideo({ 
        path: 'assets/video/intro.mp4' 
      });
      console.log('✅ Assets video started');
    } catch (error) {
      console.error('❌ Error playing assets video:', error);
    }
  }

  /**
   * Example 2: Play video from remote HTTP URL
   */
  async playRemoteVideo() {
    try {
      await BackgroundVideo.playVideo({ 
        path: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' 
      });
      console.log('✅ Remote video started');
    } catch (error) {
      console.error('❌ Error playing remote video:', error);
    }
  }

  /**
   * Example 3: Play video from bundle resources
   * iOS: Bundle.main.url(forResource: "intro", withExtension: "mp4")
   * Android: android.resource://package.name/raw/intro
   */
  async playBundleVideo() {
    try {
      await BackgroundVideo.playVideo({ 
        path: 'intro' // Will resolve to bundle/raw resource
      });
      console.log('✅ Bundle video started');
    } catch (error) {
      console.error('❌ Error playing bundle video:', error);
    }
  }

  /**
   * Example 4: Play video from local filesystem path
   */
  async playLocalVideo() {
    try {
      await BackgroundVideo.playVideo({ 
        path: '/path/to/local/video.mp4' 
      });
      console.log('✅ Local video started');
    } catch (error) {
      console.error('❌ Error playing local video:', error);
    }
  }

  async pauseVideo() {
    try {
      await BackgroundVideo.pauseVideo();
      console.log('⏸️ Video paused');
    } catch (error) {
      console.error('❌ Error pausing video:', error);
    }
  }

  async resumeVideo() {
    try {
      await BackgroundVideo.resumeVideo();
      console.log('▶️ Video resumed');
    } catch (error) {
      console.error('❌ Error resuming video:', error);
    }
  }

  async stopVideo() {
    try {
      await BackgroundVideo.stopVideo();
      console.log('⏹️ Video stopped');
    } catch (error) {
      console.error('❌ Error stopping video:', error);
    }
  }

  async setVolume() {
    try {
      await BackgroundVideo.setVolume({ volume: this.volume });
      console.log(`🔊 Volume set to: ${this.volume}`);
    } catch (error) {
      console.error('❌ Error setting volume:', error);
    }
  }
}

/**
 * Usage in your app.module.ts:
 * 
 * import { OnboardingPage } from './pages/onboarding/onboarding.page';
 * 
 * @NgModule({
 *   declarations: [OnboardingPage],
 *   imports: [IonicModule, CommonModule, FormsModule],
 *   // ...
 * })
 * export class AppModule { }
 * 
 * Usage in routing:
 * 
 * const routes: Routes = [
 *   { path: 'onboarding', component: OnboardingPage },
 *   // ...
 * ];
 */ 