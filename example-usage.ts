import { BackgroundVideo } from './src/index';

// ✅ ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ в Angular/Ionic компоненте
export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // Теперь это будет работать правильно!
      await BackgroundVideo.playVideo({ path: 'assets/video/intro.mp4' });
      console.log('✅ Видео успешно запущено!');
    } catch (error) {
      console.error('❌ Ошибка воспроизведения видео:', error);
    }
  }

  async stopVideo() {
    try {
      await BackgroundVideo.stopVideo();
      console.log('✅ Видео остановлено');
    } catch (error) {
      console.error('❌ Ошибка остановки видео:', error);
    }
  }

  async pauseVideo() {
    try {
      await BackgroundVideo.pauseVideo();
      console.log('✅ Видео поставлено на паузу');
    } catch (error) {
      console.error('❌ Ошибка паузы видео:', error);
    }
  }

  async resumeVideo() {
    try {
      await BackgroundVideo.resumeVideo();
      console.log('✅ Видео возобновлено');
    } catch (error) {
      console.error('❌ Ошибка возобновления видео:', error);
    }
  }

  async setVolume(volume: number) {
    try {
      await BackgroundVideo.setVolume({ volume });
      console.log(`✅ Громкость установлена: ${volume}`);
    } catch (error) {
      console.error('❌ Ошибка установки громкости:', error);
    }
  }
}

// Пример использования в template:
/*
<ion-content>
  <ion-button (click)="startVideo()">Запустить видео</ion-button>
  <ion-button (click)="pauseVideo()">Пауза</ion-button>
  <ion-button (click)="resumeVideo()">Возобновить</ion-button>
  <ion-button (click)="stopVideo()">Остановить</ion-button>
  <ion-button (click)="setVolume(0.5)">Громкость 50%</ion-button>
</ion-content>
*/ 