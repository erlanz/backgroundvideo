// ✅ ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ для webpack проектов

// Способ 1: Импорт по умолчанию (рекомендуется)
import BackgroundVideo from 'backgroundvideo';

// Способ 2: Именованный импорт
// import { BackgroundVideo } from 'backgroundvideo';

// Способ 3: Импорт всего модуля
// import * as BackgroundVideoModule from 'backgroundvideo';

export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // ✅ Используйте default import
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

// 🎯 ДЛЯ ВАШЕГО ПРОЕКТА используйте:

/*
// В вашем onboarding.page.ts:
import BackgroundVideo from 'backgroundvideo';

export class OnboardingPage {
  async startVideo() {
    try {
      await BackgroundVideo.playVideo({ path: 'assets/video/intro.mp4' });
    } catch (error) {
      console.error('Ошибка воспроизведения видео:', error);
    }
  }
}
*/ 