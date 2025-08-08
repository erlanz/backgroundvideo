var capacitorBackgroundVideo = (function (exports, core) {
    'use strict';

    // Also export as a class for better compatibility
    let BackgroundVideoWrapper$1 = class BackgroundVideoWrapper {
        async playVideo(_options) {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
        async pauseVideo() {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
        async resumeVideo() {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
        async stopVideo() {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
        async setVolume(_options) {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
        async listResources() {
            throw new Error('BackgroundVideoWrapper must be instantiated');
        }
    };

    const BackgroundVideo = core.registerPlugin('BackgroundVideo', {
        web: () => Promise.resolve().then(function () { return web; }).then((m) => new m.BackgroundVideoWeb()),
    });
    // Enhanced wrapper that handles assets path transformation
    class BackgroundVideoWrapper {
        constructor() {
            this.plugin = BackgroundVideo;
        }
        async playVideo(options) {
            let { path, useWindow = true } = options;
            // Transform assets/ paths to HTTP URLs for Capacitor web server
            if (path.startsWith('assets/')) {
                const origin = window.location.origin;
                path = `${origin}/${path}`;
            }
            return this.plugin.playVideo({ path, useWindow });
        }
        async pauseVideo() {
            return this.plugin.pauseVideo();
        }
        async resumeVideo() {
            return this.plugin.resumeVideo();
        }
        async stopVideo() {
            return this.plugin.stopVideo();
        }
        async setVolume(options) {
            return this.plugin.setVolume(options);
        }
        async listResources() {
            return this.plugin.listResources();
        }
    }
    // Create and export an instance
    const BackgroundVideoInstance = new BackgroundVideoWrapper();

    class BackgroundVideoWeb extends core.WebPlugin {
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
        async listResources() {
            console.log('BackgroundVideo: listResources (web)');
            // В веб-версии возвращаем пустые данные
            return {
                bundlePath: 'web',
                allResources: [],
                videoResources: []
            };
        }
    }

    var web = /*#__PURE__*/Object.freeze({
        __proto__: null,
        BackgroundVideoWeb: BackgroundVideoWeb
    });

    exports.BackgroundVideo = BackgroundVideoInstance;
    exports.BackgroundVideoWrapper = BackgroundVideoWrapper$1;
    exports.default = BackgroundVideoInstance;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, capacitorExports);
//# sourceMappingURL=plugin.js.map
