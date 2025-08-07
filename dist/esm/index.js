import { registerPlugin } from '@capacitor/core';
const BackgroundVideo = registerPlugin('BackgroundVideo', {
    web: () => import('./web').then((m) => new m.BackgroundVideoWeb()),
});
export * from './definitions';
export { BackgroundVideo };
//# sourceMappingURL=index.js.map