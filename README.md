# FocusShield

Offline Android focus mode and app blocker built with React Native CLI and native Kotlin services. This project uses Metro and runs with `npx react-native run-android`. It does not use Expo.

## Stack

- React Native CLI `0.85.3`
- React Navigation
- AsyncStorage
- Kotlin native modules
- Android `UsageStatsManager`
- Android `AccessibilityService`
- Android foreground service

## Implemented Features

- Fetches installed launchable apps with icon, app name, and package name
- Multi-select app blocking list
- Multiple local schedules with overnight support
- Foreground service that keeps monitoring active
- Accessibility service for immediate foreground app detection
- Usage stats fallback polling for current foreground app
- Native block screen activity
- Local persistence with AsyncStorage plus native shared-preference sync
- Permission setup flow for usage access, accessibility, overlay, and battery optimization

## Project Structure

```text
src/
  components/
  context/
  native/
  navigation/
  screens/
  services/
  storage/
  utils/
android/
  app/src/main/java/com/focusshield/
  app/src/main/res/
```

## Install Commands

If you need to recreate dependencies from scratch:

```sh
npm install
npm install @react-navigation/native @react-navigation/native-stack
npm install @react-native-async-storage/async-storage@2.2.0
npm install @react-native-community/datetimepicker
npm install react-native-gesture-handler react-native-screens react-native-safe-area-context
```

## Environment Requirements

- Node.js `20.19.4+`
- JDK `17`
- Android Studio with SDK + emulator or a connected Android device
- Android SDK platform tools available in your shell

Note: the current workspace was built successfully with Gradle, but the local Node version shown during install was `20.15.0`, which is below the React Native `0.85.3` recommended minimum. Upgrading Node is strongly recommended before regular development.

## Run The App

Start Metro:

```sh
npx react-native start
```

In a second terminal:

```sh
npx react-native run-android
```

You can also build directly with Gradle:

```sh
cd android
./gradlew assembleDebug
```

On Windows PowerShell:

```powershell
cd android
.\gradlew.bat assembleDebug
```

## Android Permissions Required

Configured in `android/app/src/main/AndroidManifest.xml`:

- `android.permission.FOREGROUND_SERVICE`
- `android.permission.PACKAGE_USAGE_STATS`
- `android.permission.SYSTEM_ALERT_WINDOW`
- `android.permission.RECEIVE_BOOT_COMPLETED`

Also included:

- Accessibility service declaration and XML config
- Foreground service declaration
- Native block activity
- Boot receiver for restarting protection after reboot or app update

## Required User Setup

The app cannot silently grant protected Android permissions. After install:

1. Open `Permission Setup` inside the app.
2. Enable `Usage Access`.
3. Enable the `FocusShield App Blocking` accessibility service.
4. Optionally enable overlay permission on OEMs that aggressively restrict background flows.
5. Optionally exclude the app from battery optimization.

## Blocking Flow

1. User selects installed apps.
2. User creates one or more focus schedules.
3. React Native stores config in AsyncStorage.
4. The same config is synced into native shared preferences.
5. When protection is enabled, the foreground service starts.
6. Accessibility events and usage stats checks detect the active foreground package.
7. If the app package is selected and the current time matches an active schedule, FocusShield sends the user home and launches the native block screen.

## Native Android Files

Key native implementation files:

- [FocusShieldModule.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/FocusShieldModule.kt)
- [InstalledAppsModule.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/InstalledAppsModule.kt)
- [FocusAccessibilityService.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/FocusAccessibilityService.kt)
- [FocusShieldForegroundService.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/FocusShieldForegroundService.kt)
- [UsageStatsHelper.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/UsageStatsHelper.kt)
- [BlockActivity.kt](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/java/com/focusshield/BlockActivity.kt)
- [AndroidManifest.xml](/d:/wamp/www/personal/DND-Focus-app/android/app/src/main/AndroidManifest.xml)

## Main React Native Files

- [App.tsx](/d:/wamp/www/personal/DND-Focus-app/App.tsx)
- [FocusContext.tsx](/d:/wamp/www/personal/DND-Focus-app/src/context/FocusContext.tsx)
- [AppNavigator.tsx](/d:/wamp/www/personal/DND-Focus-app/src/navigation/AppNavigator.tsx)
- [HomeScreen.tsx](/d:/wamp/www/personal/DND-Focus-app/src/screens/HomeScreen.tsx)
- [AppSelectionScreen.tsx](/d:/wamp/www/personal/DND-Focus-app/src/screens/AppSelectionScreen.tsx)
- [ScheduleScreen.tsx](/d:/wamp/www/personal/DND-Focus-app/src/screens/ScheduleScreen.tsx)
- [PermissionSetupScreen.tsx](/d:/wamp/www/personal/DND-Focus-app/src/screens/PermissionSetupScreen.tsx)

## Debug Tips

- Metro issues:
  - Run `npx react-native start --reset-cache`
- Android build issues:
  - Run `cd android && .\gradlew.bat clean`
  - Then rerun `npx react-native run-android`
- Check the monitoring service and accessibility logs:
  - `adb logcat | findstr FocusShield`
- Verify usage stats permission manually:
  - Open Android Settings > Apps > Special app access > Usage access
- Verify accessibility manually:
  - Open Android Settings > Accessibility > Installed services > FocusShield App Blocking

## Verification Done

- `npx tsc --noEmit`
- `cd android && .\gradlew.bat assembleDebug`

## Important Limitation

Modern Android does not provide a perfect public API for force-closing or permanently disabling third-party apps. This implementation uses the practical pattern allowed to normal apps:

- detect the foreground app
- redirect to home
- show a blocking screen

That is the reliable non-root approach for an offline focus blocker built with React Native CLI and native Android code.
