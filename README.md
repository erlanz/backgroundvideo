# BackgroundVideo

Capacitor плагин для воспроизведения фонового видео на экране онбординга с использованием нативных средств iOS и Android.

## Описание

Этот плагин позволяет воспроизводить локальные видеофайлы в качестве фона приложения, используя аппаратное ускорение на уровне платформы. Видео размещается под WebView, что обеспечивает плавное воспроизведение без фризов интерфейса.

### Особенности

- **Аппаратное ускорение**: Использует AVPlayerLayer на iOS и VideoView на Android
- **Фоновое воспроизведение**: Видео размещается под WebView приложения
- **Автоматическое зацикливание**: Видео автоматически повторяется
- **Управление воспроизведением**: Методы для паузы, возобновления и остановки
- **Управление громкостью**: Возможность настройки громкости

## Установка

```bash
npm install backgroundvideo
npx cap sync
```

## Использование

### Импорт плагина

```typescript
import { BackgroundVideo } from 'backgroundvideo';
```

### Основные методы

#### Воспроизведение видео

```typescript
// Запуск фонового видео
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

// Остановка и удаление видео
await BackgroundVideo.stopVideo();
```

#### Управление громкостью

```typescript
// Установка громкости (0.0 - 1.0)
await BackgroundVideo.setVolume({ volume: 0.5 });
```

### Пример использования в Ionic приложении

```typescript
import { Component, OnInit } from '@angular/core';
import { BackgroundVideo } from 'backgroundvideo';

@Component({
  selector: 'app-onboarding',
  template: `
    <ion-content class="onboarding-page" style="--background: transparent;">
      <div class="overlay-content">
        <h1>Добро пожаловать</h1>
        <ion-button (click)="startVideo()">Начать</ion-button>
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
    }
  `]
})
export class OnboardingPage implements OnInit {
  
  async ngOnInit() {
    // Запускаем фоновое видео при загрузке страницы
    await this.startVideo();
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
    await BackgroundVideo.stopVideo();
  }
}
```

## Подготовка видеофайлов

### iOS
Добавьте видеофайл в проект Xcode:
1. Откройте проект в Xcode
2. Перетащите видеофайл в проект
3. Убедитесь, что файл добавлен в "Copy Bundle Resources"
4. Используйте путь: `Bundle.main.path(forResource: "video_name", ofType: "mp4")`

### Android
Поместите видеофайл в `android/app/src/main/res/raw/`:
1. Создайте папку `raw` если её нет
2. Поместите видеофайл в эту папку
3. Используйте путь: `android.resource://your.package.name/raw/video_name`

## API

### BackgroundVideoPlugin

#### playVideo(options: { path: string })

Запускает воспроизведение фонового видео.

| Param | Type | Description |
|-------|------|-------------|
| **options** | `{ path: string }` | Опции воспроизведения |
| **options.path** | `string` | Путь к видеофайлу |

#### pauseVideo()

Ставит видео на паузу.

#### resumeVideo()

Возобновляет воспроизведение видео.

#### stopVideo()

Останавливает видео и удаляет его с экрана.

#### setVolume(options: { volume: number })

Устанавливает громкость видео.

| Param | Type | Description |
|-------|------|-------------|
| **options** | `{ volume: number }` | Опции громкости |
| **options.volume** | `number` | Громкость (0.0 - 1.0) |

## Требования

- Capacitor 7+
- iOS 14+
- Android SDK 33+

## Лицензия

MIT
