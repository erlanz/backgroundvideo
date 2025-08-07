'use strict';

var core = require('@capacitor/core');

const BackgroundVideo = core.registerPlugin('BackgroundVideo', {
    web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.BackgroundVideoWeb()),
});

class BackgroundVideoWeb extends core.WebPlugin {
    constructor() {
        super(...arguments);
        this.videoElement = null;
    }
    async playVideo(options) {
        console.log('BackgroundVideo: playVideo', options);
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
        this.videoElement.src = options.path;
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

var web = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BackgroundVideoWeb: BackgroundVideoWeb
});

exports.BackgroundVideo = BackgroundVideo;
//# sourceMappingURL=plugin.cjs.js.map
