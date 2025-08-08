// ✅ ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ (ИСПРАВЛЕННОЕ)

import BackgroundVideo from 'backgroundvideo';

export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // ✅ Используем отдельное окно для лучшей видимости
      await BackgroundVideo.playVideo({ 
        path: 'intro',
        useWindow: true // По умолчанию true, но можно явно указать
      });
      console.log('✅ Видео запущено в отдельном окне!');
    } catch (error) {
      console.error('❌ Ошибка воспроизведения видео:', error);
    }
  }

  async startVideoInLayer() {
    try {
      // Альтернативный способ - добавление на root view controller
      await BackgroundVideo.playVideo({ 
        path: 'intro',
        useWindow: false
      });
      console.log('✅ Видео запущено в слое!');
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
}

// 🎯 ДЛЯ ВАШЕГО ПРОЕКТА используйте:

/*
import BackgroundVideo from 'backgroundvideo';

export class OnboardingPage {
  async startVideo() {
    try {
      // Рекомендуется использовать отдельное окно
      await BackgroundVideo.playVideo({ 
        path: 'intro',
        useWindow: true 
      });
    } catch (error) {
      console.error('Ошибка воспроизведения видео:', error);
    }
  }
}
*/

// 📋 CSS для правильного отображения:

/*
.onboarding-page {
  --background: transparent;
}

.overlay-content {
  position: relative;
  z-index: 1; // Важно! Должен быть больше 0
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.9); // Полупрозрачный фон
  border-radius: 16px;
  margin: 2rem;
}
*/
