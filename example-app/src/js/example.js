import { BackgroundVideo } from 'backgroundvideo';

// Глобальные функции для демонстрации плагина
window.startBackgroundVideo = async () => {
    try {
        // Для демонстрации используем тестовое видео
        // В реальном приложении укажите путь к вашему видеофайлу
        await BackgroundVideo.playVideo({ 
            path: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' 
        });
        console.log('Фоновое видео запущено');
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
