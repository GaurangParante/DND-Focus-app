import {NativeModules} from 'react-native';
import {InstalledApp, PermissionStatus, ScreenTimeApp} from '../types';

type InstalledAppsModuleShape = {
  getInstalledApps(): Promise<InstalledApp[]>;
};

type FocusShieldModuleShape = {
  getPermissionStatus(): Promise<PermissionStatus>;
  getTodayScreenTime(): Promise<ScreenTimeApp[]>;
  openUsageAccessSettings(): Promise<void>;
  openAccessibilitySettings(): Promise<void>;
  openOverlaySettings(): Promise<void>;
  openBatteryOptimizationSettings(): Promise<void>;
  syncBlockingConfig(configJson: string): Promise<void>;
  startProtection(): Promise<void>;
  stopProtection(): Promise<void>;
  getCurrentForegroundApp(): Promise<string | null>;
};

const {InstalledAppsModule, FocusShieldModule} = NativeModules as {
  InstalledAppsModule: InstalledAppsModuleShape;
  FocusShieldModule: FocusShieldModuleShape;
};

export const nativeModules = {
  installedApps:
    InstalledAppsModule ??
    ({
      getInstalledApps: async () => [],
    } satisfies InstalledAppsModuleShape),
  focusShield:
    FocusShieldModule ??
    ({
      getPermissionStatus: async () => ({
        usageAccess: false,
        accessibility: false,
        overlay: false,
        ignoringBatteryOptimizations: false,
      }),
      getTodayScreenTime: async () => [],
      openUsageAccessSettings: async () => undefined,
      openAccessibilitySettings: async () => undefined,
      openOverlaySettings: async () => undefined,
      openBatteryOptimizationSettings: async () => undefined,
      syncBlockingConfig: async () => undefined,
      startProtection: async () => undefined,
      stopProtection: async () => undefined,
      getCurrentForegroundApp: async () => null,
    } satisfies FocusShieldModuleShape),
};
