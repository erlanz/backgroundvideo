import { registerPlugin } from '@capacitor/core';
const BackgroundVideo = registerPlugin('BackgroundVideo', {
    web: () => import('./web').then((m) => new m.BackgroundVideoWeb()),
});
// Enhanced wrapper that handles assets path transformation
class BackgroundVideoWrapper {
    constructor() {
        this.plugin = BackgroundVideo;
    }
    async playVideo(options) {
        let { path } = options;
        // Transform assets/ paths to HTTP URLs for Capacitor web server
        if (path.startsWith('assets/')) {
            const origin = window.location.origin;
            path = `${origin}/${path}`;
        }
        return this.plugin.playVideo({ path });
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
}
// Create and export an instance
const BackgroundVideoInstance = new BackgroundVideoWrapper();
export * from './definitions';
export { BackgroundVideoInstance as BackgroundVideo };
//# sourceMappingURL=index.js.map