import { WebPlugin } from '@capacitor/core';

import type { BackgroundVideoPlugin } from './definitions';

export class BackgroundVideoWeb extends WebPlugin implements BackgroundVideoPlugin {
  async echo(options: { value: string }): Promise<{ value: string }> {
    console.log('ECHO', options);
    return options;
  }
}
