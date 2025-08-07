import { BackgroundVideo } from 'backgroundvideo';

// Глобальные функции для демонстрации плагина
window.startBackgroundVideo = async () => {
    try {
        // Example 1: Using assets path (will be transformed to HTTP URL)
        await BackgroundVideo.playVideo({ 
            path: 'assets/video/intro.mp4' 
        });
        console.log('Фоновое видео запущено из assets');
    } catch (error) {
        console.error('Ошибка запуска видео:', error);
    }
};

window.startRemoteVideo = async () => {
    try {
        // Example 2: Using remote HTTP URL
        await BackgroundVideo.playVideo({ 
            path: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' 
        });
        console.log('Фоновое видео запущено с удаленного URL');
    } catch (error) {
        console.error('Ошибка запуска видео:', error);
    }
};

window.startBundleVideo = async () => {
    try {
        // Example 3: Using bundle resource (iOS) or raw resource (Android)
        await BackgroundVideo.playVideo({ 
            path: 'intro' // Will resolve to bundle/raw resource
        });
        console.log('Фоновое видео запущено из bundle ресурсов');
    } catch (error) {
        console.error('Ошибка запуска видео:', error);
    }
};

window.startLocalVideo = async () => {
    try {
        // Example 4: Using local filesystem path
        await BackgroundVideo.playVideo({ 
            path: '/path/to/local/video.mp4' 
        });
        console.log('Фоновое видео запущено с локального пути');
    } catch (error) {
        console.error('Ошибка запуска видео:', error);
    }
};

window.pauseBackgroundVideo = async () => {
    try {
        await BackgroundVideo.pauseVideo();
        console.log('Видео поставлено на паузу');
    } catch (error) {
        console.error('Ошибка паузы видео:', error);
    }
};

window.resumeBackgroundVideo = async () => {
    try {
        await BackgroundVideo.resumeVideo();
        console.log('Воспроизведение возобновлено');
    } catch (error) {
        console.error('Ошибка возобновления видео:', error);
    }
};

window.stopBackgroundVideo = async () => {
    try {
        await BackgroundVideo.stopVideo();
        console.log('Видео остановлено');
    } catch (error) {
        console.error('Ошибка остановки видео:', error);
    }
};

window.setVideoVolume = async () => {
    try {
        const volume = document.getElementById("volumeInput").value;
        await BackgroundVideo.setVolume({ volume: parseFloat(volume) });
        console.log('Громкость установлена:', volume);
    } catch (error) {
        console.error('Ошибка установки громкости:', error);
    }
};
