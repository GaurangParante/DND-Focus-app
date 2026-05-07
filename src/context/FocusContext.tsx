import React, {createContext, useContext, useEffect, useMemo, useState} from 'react';
import {syncNativeBlockingConfig} from '../services/focusSync';
import {loadFocusConfig, saveFocusConfig} from '../storage/focusStorage';
import {nativeModules} from '../native/FocusShieldNative';
import {FocusConfig, FocusSchedule, InstalledApp, PermissionStatus} from '../types';

type FocusContextValue = {
  config: FocusConfig;
  installedApps: InstalledApp[];
  permissions: PermissionStatus | null;
  isLoaded: boolean;
  isRefreshingApps: boolean;
  refreshInstalledApps: () => Promise<void>;
  refreshPermissions: () => Promise<void>;
  setSelectedApps: (packageNames: string[]) => Promise<void>;
  setProtectionEnabled: (enabled: boolean) => Promise<void>;
  setThemePreference: (themePreference: FocusConfig['themePreference']) => Promise<void>;
  upsertSchedule: (schedule: FocusSchedule) => Promise<void>;
  deleteSchedule: (scheduleId: string) => Promise<void>;
};

const FocusContext = createContext<FocusContextValue | undefined>(undefined);

const defaultPermissions: PermissionStatus = {
  usageAccess: false,
  accessibility: false,
  overlay: false,
  ignoringBatteryOptimizations: false,
};

export const FocusProvider = ({children}: {children: React.ReactNode}) => {
  const [config, setConfig] = useState<FocusConfig>({
    selectedApps: [],
    schedules: [],
    protectionEnabled: false,
    themePreference: 'system',
  });
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [permissions, setPermissions] = useState<PermissionStatus | null>(defaultPermissions);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRefreshingApps, setIsRefreshingApps] = useState(false);

  const persistConfig = async (nextConfig: FocusConfig) => {
    setConfig(nextConfig);
    await saveFocusConfig(nextConfig);
    await syncNativeBlockingConfig(nextConfig);
  };

  const refreshInstalledApps = async () => {
    setIsRefreshingApps(true);
    try {
      const apps = await nativeModules.installedApps.getInstalledApps();
      setInstalledApps(apps);
    } finally {
      setIsRefreshingApps(false);
    }
  };

  const refreshPermissions = async () => {
    const nextPermissions = await nativeModules.focusShield.getPermissionStatus();
    setPermissions(nextPermissions);
  };

  useEffect(() => {
    const bootstrap = async () => {
      const storedConfig = await loadFocusConfig();
      setConfig(storedConfig);
      await Promise.all([
        syncNativeBlockingConfig(storedConfig),
        refreshInstalledApps(),
        refreshPermissions(),
      ]);
      setIsLoaded(true);
    };

    bootstrap().catch(() => {
      setIsLoaded(true);
    });
  }, []);

  const value = useMemo<FocusContextValue>(
    () => ({
      config,
      installedApps,
      permissions,
      isLoaded,
      isRefreshingApps,
      refreshInstalledApps,
      refreshPermissions,
      setSelectedApps: async packageNames => {
        await persistConfig({
          ...config,
          selectedApps: packageNames,
        });
      },
      setProtectionEnabled: async enabled => {
        const currentPermissions =
          permissions ?? {
            usageAccess: false,
            accessibility: false,
            overlay: false,
            ignoringBatteryOptimizations: false,
          };
        const nextConfig = {
          ...config,
          protectionEnabled: enabled,
        };

        await persistConfig(nextConfig);
        if (enabled && currentPermissions.usageAccess && currentPermissions.accessibility) {
          await nativeModules.focusShield.startProtection();
        } else {
          await nativeModules.focusShield.stopProtection();
        }
        await refreshPermissions();
      },
      setThemePreference: async themePreference => {
        await persistConfig({
          ...config,
          themePreference,
        });
      },
      upsertSchedule: async schedule => {
        const schedules = config.schedules.some(item => item.id === schedule.id)
          ? config.schedules.map(item => (item.id === schedule.id ? schedule : item))
          : [...config.schedules, schedule];

        await persistConfig({
          ...config,
          schedules,
        });
      },
      deleteSchedule: async scheduleId => {
        await persistConfig({
          ...config,
          schedules: config.schedules.filter(schedule => schedule.id !== scheduleId),
        });
      },
    }),
    [config, installedApps, permissions, isLoaded, isRefreshingApps],
  );

  return <FocusContext.Provider value={value}>{children}</FocusContext.Provider>;
};

export const useFocus = () => {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used inside FocusProvider');
  }
  return context;
};
