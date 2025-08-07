import { registerPlugin } from '@capacitor/core';

import type { BackgroundVideoPlugin } from './definitions';

const BackgroundVideo = registerPlugin<BackgroundVideoPlugin>('BackgroundVideo', {
  web: () => import('./web').then((m) => new m.BackgroundVideoWeb()),
});

export * from './definitions';
export { BackgroundVideo };
