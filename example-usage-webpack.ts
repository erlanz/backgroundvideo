// ✅ ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ с webpack

// Способ 1: Импорт по умолчанию
import BackgroundVideo from 'backgroundvideo';

// Способ 2: Именованный импорт
import { BackgroundVideo as BackgroundVideoNamed } from 'backgroundvideo';

// Способ 3: Импорт всех экспортов
import * as BackgroundVideoModule from 'backgroundvideo';

export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // Способ 1: Использование default export
      await BackgroundVideo.playVideo({ path: 'assets/video/intro.mp4' });
      console.log('✅ Видео успешно запущено! (default import)');
      
      // Способ 2: Использование именованного импорта
      // await BackgroundVideoNamed.playVideo({ path: 'assets/video/intro.mp4' });
      
      // Способ 3: Использование модуля
      // await BackgroundVideoModule.BackgroundVideo.playVideo({ path: 'assets/video/intro.mp4' });
      
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

// Пример использования в вашем проекте:
/*
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