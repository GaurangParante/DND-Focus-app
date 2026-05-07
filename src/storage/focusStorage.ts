import AsyncStorage from '@react-native-async-storage/async-storage';
import {FocusConfig} from '../types';

const STORAGE_KEY = 'focusshield.config.v1';

export const defaultConfig: FocusConfig = {
  selectedApps: [],
  schedules: [],
  protectionEnabled: false,
  themePreference: 'system',
};

export const loadFocusConfig = async (): Promise<FocusConfig> => {
  const raw = await AsyncStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return defaultConfig;
  }

  try {
    return {
      ...defaultConfig,
      ...JSON.parse(raw),
    };
  } catch {
    return defaultConfig;
  }
};

export const saveFocusConfig = async (config: FocusConfig): Promise<void> => {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(config));
};
