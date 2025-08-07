# Инструкция по использованию BackgroundVideo плагина

## Установка

1. Установите плагин в вашем проекте:
```bash
npm install backgroundvideo
```

2. Синхронизируйте с нативными платформами:
```bash
npx cap sync
```

## Подготовка видеофайлов

### Для iOS
1. Откройте ваш проект в Xcode
2. Перетащите видеофайл в проект
3. Убедитесь, что файл добавлен в "Copy Bundle Resources"
4. Получите путь к файлу:
```swift
let path = Bundle.main.path(forResource: "video_name", ofType: "mp4")
```

### Для Android
1. Создайте папку `android/app/src/main/res/raw/` если её нет
2. Поместите видеофайл в эту папку
3. Используйте путь: `android.resource://your.package.name/raw/video_name`

## Использование в коде

### Импорт плагина
```typescript
import { BackgroundVideo } from 'backgroundvideo';
```

### Основные методы

#### Запуск фонового видео
```typescript
await BackgroundVideo.playVideo({ 
  path: '/path/to/your/video.mp4' 
});
```

#### Управление воспроизведением
```typescript
// Пауза
await BackgroundVideo.pauseVideo();

// Возобновление
await BackgroundVideo.resumeVideo();

// Остановка
await BackgroundVideo.stopVideo();
```

#### Управление громкостью
```typescript
// Установка громкости (0.0 - 1.0)
await BackgroundVideo.setVolume({ volume: 0.5 });
```

## Пример для Ionic/Angular

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { BackgroundVideo } from 'backgroundvideo';

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="onboarding-page" style="--background: transparent;">
      <div class="overlay-content">
        <h1>Добро пожаловать</h1>
        <ion-button (click)="startVideo()">Начать</ion-button>
        <ion-button (click)="stopVideo()">Остановить</ion-button>
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
      border-radius: 12px;
      margin: 20px;
    }
  `]
})
export class OnboardingPage implements OnInit, OnDestroy {
  
  async ngOnInit() {
    await this.startVideo();
  }

  async ngOnDestroy() {
    await this.stopVideo();
  }

  async startVideo() {
    try {
      await BackgroundVideo.playVideo({ 
        path: 'assets/onboarding.mp4' 
      });
    } catch (error) {
      console.error('Ошибка воспроизведения видео:', error);
    }
  }

  async stopVideo() {
    try {
      await BackgroundVideo.stopVideo();
    } catch (error) {
      console.error('Ошибка остановки видео:', error);
    }
  }
}
```

## Пример для React

```typescript
import React, { useEffect } from 'react';
import { BackgroundVideo } from 'backgroundvideo';

const OnboardingPage: React.FC = () => {
  useEffect(() => {
    startVideo();
    return () => {
      stopVideo();
    };
  }, []);

  const startVideo = async () => {
    try {
      await BackgroundVideo.playVideo({ 
        path: 'assets/onboarding.mp4' 
      });
    } catch (error) {
      console.error('Ошибка воспроизведения видео:', error);
    }
  };

  const stopVideo = async () => {
    try {
      await BackgroundVideo.stopVideo();
    } catch (error) {
      console.error('Ошибка остановки видео:', error);
    }
  };

  return (
    <div className="onboarding-page" style={{ background: 'transparent' }}>
      <div className="overlay-content">
        <h1>Добро пожаловать</h1>
        <button onClick={startVideo}>Начать</button>
        <button onClick={stopVideo}>Остановить</button>
      </div>
    </div>
  );
};

export default OnboardingPage;
```

## Важные замечания

1. **Прозрачность фона**: Убедитесь, что фон вашего контента прозрачен, чтобы видео было видно:
   ```css
   ion-content {
     --background: transparent;
   }
   ```

2. **Формат видео**: Рекомендуется использовать MP4 с кодеком H.264 для лучшей совместимости.

3. **Размер файла**: Учитывайте размер видеофайла при добавлении в приложение.

4. **Производительность**: Плагин использует аппаратное ускорение, но большие видеофайлы могут влиять на производительность.

## Тестирование

Для тестирования плагина используйте пример приложение:

```bash
cd example-app
npm run build
npx cap sync
npx cap run ios    # для iOS
npx cap run android # для Android
```

## Устранение неполадок

1. **Видео не воспроизводится**: Проверьте правильность пути к файлу
2. **Видео не видно**: Убедитесь, что фон контента прозрачен
3. **Ошибки компиляции**: Проверьте, что все зависимости установлены
4. **Проблемы с производительностью**: Оптимизируйте размер и качество видеофайла 