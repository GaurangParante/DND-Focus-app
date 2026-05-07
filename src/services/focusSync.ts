import {nativeModules} from '../native/FocusShieldNative';
import {FocusConfig} from '../types';

export const syncNativeBlockingConfig = async (config: FocusConfig): Promise<void> => {
  await nativeModules.focusShield.syncBlockingConfig(JSON.stringify(config));
};
