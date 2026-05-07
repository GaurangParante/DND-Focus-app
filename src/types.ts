export type InstalledApp = {
  appName: string;
  packageName: string;
  iconBase64: string;
  isSystemApp: boolean;
};

export type FocusSchedule = {
  id: string;
  label: string;
  startMinutes: number;
  endMinutes: number;
  enabled: boolean;
};

export type PermissionStatus = {
  usageAccess: boolean;
  accessibility: boolean;
  overlay: boolean;
  ignoringBatteryOptimizations: boolean;
};

export type FocusConfig = {
  selectedApps: string[];
  schedules: FocusSchedule[];
  protectionEnabled: boolean;
  themePreference: 'system' | 'light' | 'dark';
};

export type ScreenTimeApp = {
  packageName: string;
  appName: string;
  totalTimeVisibleMs: number;
  lastTimeUsed: number;
};
