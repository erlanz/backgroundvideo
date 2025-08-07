// ✅ ПРИМЕР ИСПОЛЬЗОВАНИЯ с bundle ресурсами

import BackgroundVideo from 'backgroundvideo';

export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // ✅ Используем имя ресурса без расширения
      // iOS: ищет intro.mp4 в Bundle
      // Android: ищет intro.mp4 в res/raw/
      await BackgroundVideo.playVideo({ path: 'intro' });
      console.log('✅ Видео успешно запущено из bundle ресурсов!');
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

// 🎯 КАК ЭТО РАБОТАЕТ:

/*
iOS:
- Плагин получает 'intro'
- Ищет Bundle.main.url(forResource: "intro", withExtension: "mp4")
- Находит intro.mp4 в bundle
- Создает AVPlayer с URL

Android:
- Плагин получает 'intro'
- Ищет ресурс в res/raw/intro.mp4
- Создает URI: android.resource://package.name/raw/intro
- Устанавливает VideoView с URI

Использование:
await BackgroundVideo.playVideo({ path: 'intro' });
*/
