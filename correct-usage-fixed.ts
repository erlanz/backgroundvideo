// ✅ ПРАВИЛЬНОЕ ИСПОЛЬЗОВАНИЕ (ИСПРАВЛЕННОЕ)

import BackgroundVideo from 'backgroundvideo';

export class OnboardingPage {
  constructor() {}

  ngOnInit() {
    this.startVideo();
  }

  async startVideo() {
    try {
      // ✅ Метод 1: Отдельное окно (рекомендуется)
      await BackgroundVideo.playVideo({ 
        path: 'intro',
        useWindow: true // Видео в отдельном окне, не мешает UI
      });
      console.log('✅ Видео запущено в отдельном окне!');
    } catch (error) {
      console.error('❌ Ошибка воспроизведения видео:', error);
    }
  }

  async startVideoInLayer() {
    try {
      // ✅ Метод 2: Слой в основном окне (альтернатива)
      await BackgroundVideo.playVideo({ 
        path: 'intro',
        useWindow: false // Видео как слой в основном окне
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

// 📋 ОБЯЗАТЕЛЬНЫЙ CSS для правильного отображения:

/*
// В вашем .scss файле:

.onboarding-page {
  --background: transparent;
  position: relative;
  z-index: 1;
}

.overlay-content {
  position: relative;
  z-index: 10; // Высокий z-index для контента
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.95); // Полупрозрачный фон
  border-radius: 16px;
  margin: 2rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

ion-button {
  position: relative;
  z-index: 20; // Самый высокий z-index для кнопок
  --background: #007bff;
  --color: white;
}

h1 {
  position: relative;
  z-index: 15;
  color: #333;
  font-weight: bold;
}
*/
