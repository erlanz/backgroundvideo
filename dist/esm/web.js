import { WebPlugin } from '@capacitor/core';
export class BackgroundVideoWeb extends WebPlugin {
    constructor() {
        super(...arguments);
        this.videoElement = null;
    }
    async playVideo(options) {
        console.log('BackgroundVideo: playVideo', options);
        let { path } = options;
        // Transform assets/ paths to HTTP URLs for consistency with native
        if (path.startsWith('assets/')) {
            const origin = window.location.origin;
            path = `${origin}/${path}`;
            console.log('BackgroundVideo: Transformed assets path to:', path);
        }
        // Создаем видео элемент если его нет
        if (!this.videoElement) {
            this.videoElement = document.createElement('video');
            this.videoElement.style.position = 'fixed';
            this.videoElement.style.top = '0';
            this.videoElement.style.left = '0';
            this.videoElement.style.width = '100%';
            this.videoElement.style.height = '100%';
            this.videoElement.style.objectFit = 'cover';
            this.videoElement.style.zIndex = '-1';
            this.videoElement.loop = true;
            this.videoElement.muted = true;
            document.body.appendChild(this.videoElement);
        }
        this.videoElement.src = path;
        await this.videoElement.play();
    }
    async pauseVideo() {
        console.log('BackgroundVideo: pauseVideo');
        if (this.videoElement) {
            this.videoElement.pause();
        }
    }
    async resumeVideo() {
        console.log('BackgroundVideo: resumeVideo');
        if (this.videoElement) {
            await this.videoElement.play();
        }
    }
    async stopVideo() {
        console.log('BackgroundVideo: stopVideo');
        if (this.videoElement) {
            this.videoElement.pause();
            this.videoElement.remove();
            this.videoElement = null;
        }
    }
    async setVolume(options) {
        console.log('BackgroundVideo: setVolume', options);
        if (this.videoElement) {
            this.videoElement.volume = Math.max(0, Math.min(1, options.volume));
        }
    }
}
//# sourceMappingURL=web.js.map