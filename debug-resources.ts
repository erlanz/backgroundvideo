// 🔍 ДИАГНОСТИКА РЕСУРСОВ BUNDLE

import BackgroundVideo from './src/index';

export class ResourceDebugger {
  async debugResources() {
    try {
      console.log('🔍 Начинаем диагностику ресурсов...');
      
      // Получаем список всех ресурсов
      const resources = await BackgroundVideo.listResources();
      
      console.log('📁 Bundle path:', resources.bundlePath);
      console.log('📋 Все ресурсы:', resources.allResources);
      console.log('🎬 Видео ресурсы:', resources.videoResources);
      
      // Пытаемся найти intro.mp4
      const introVideo = resources.videoResources.find(resource => 
        resource.includes('intro') || resource.includes('Intro')
      );
      
      if (introVideo) {
        console.log('✅ Найден видео файл:', introVideo);
        
        // Пытаемся воспроизвести
        console.log('▶️ Пытаемся воспроизвести видео...');
        await BackgroundVideo.playVideo({ path: 'intro' });
      } else {
        console.log('❌ Видео файл intro.mp4 не найден');
        console.log('💡 Доступные видео файлы:', resources.videoResources);
      }
      
    } catch (error) {
      console.error('❌ Ошибка диагностики:', error);
    }
  }
  
  async testDifferentPaths() {
    console.log('🧪 Тестируем разные пути...');
    
    const testPaths = [
      'intro',
      'intro.mp4',
      'Intro',
      'Intro.mp4',
      'INTRO',
      'INTRO.MP4'
    ];
    
    for (const path of testPaths) {
      try {
        console.log(`🔍 Тестируем путь: "${path}"`);
        await BackgroundVideo.playVideo({ path });
        console.log(`✅ Успешно: "${path}"`);
        break;
      } catch (error) {
        console.log(`❌ Неудачно: "${path}" - ${error}`);
      }
    }
  }
}

// Использование:
/*
const debugger = new ResourceDebugger();
await debugger.debugResources();
await debugger.testDifferentPaths();
*/
