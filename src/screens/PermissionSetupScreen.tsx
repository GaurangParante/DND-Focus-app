import React from 'react';
import {Alert, StyleSheet, Text, View} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenContainer} from '../components/ScreenContainer';
import {SectionCard} from '../components/SectionCard';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';
import {nativeModules} from '../native/FocusShieldNative';

export const PermissionSetupScreen = () => {
  const {permissions, refreshPermissions} = useFocus();
  const {theme} = useAppTheme();
  const usageAccessMissing = !permissions?.usageAccess;
  const accessibilityMissing = !permissions?.accessibility;

  const openSettings = async (action: () => Promise<void>, label: string) => {
    try {
      await action();
    } catch (error) {
      const message = error instanceof Error ? error.message : `Unable to open ${label}.`;
      Alert.alert('Settings Error', message);
    }
  };

  return (
    <ScreenContainer>
      <View
        style={[
          styles.intro,
          {
            backgroundColor: theme.colors.backgroundElevated,
            borderColor: theme.colors.border,
          },
        ]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Permission setup</Text>
        <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
          FocusShield works fully offline, but Android still requires a few manual system permissions so the native monitoring stack can run reliably in the background.
        </Text>
      </View>

      <SectionCard
        title="1. Usage access"
        subtitle="Needed for UsageStatsManager so the foreground service can confirm which app is currently open.">
        <View style={styles.statusLine}>
          <Text
            style={[
              styles.statusText,
              {color: usageAccessMissing ? theme.colors.danger : theme.colors.success},
            ]}>
            Status: {permissions?.usageAccess ? 'Enabled' : 'Missing'}
          </Text>
        </View>
        <PrimaryButton
          label="Open Usage Access Settings"
          onPress={() => openSettings(nativeModules.focusShield.openUsageAccessSettings, 'usage access settings')}
        />
      </SectionCard>

      <SectionCard
        title="2. Accessibility service"
        subtitle="Needed for instant foreground app detection and fast redirection when a blocked app opens.">
        <View style={styles.statusLine}>
          <Text
            style={[
              styles.statusText,
              {color: accessibilityMissing ? theme.colors.danger : theme.colors.success},
            ]}>
            Status: {permissions?.accessibility ? 'Enabled' : 'Missing'}
          </Text>
        </View>
        <PrimaryButton
          label="Open Accessibility Settings"
          onPress={() => openSettings(nativeModules.focusShield.openAccessibilitySettings, 'accessibility settings')}
        />
      </SectionCard>

      <SectionCard
        title="3. Optional overlay and battery optimization"
        subtitle="Overlay is optional for some OEMs. Ignoring battery optimizations helps the service stay alive longer on aggressive background managers.">
        <Text style={[styles.statusText, {color: theme.colors.text}]}>
          Overlay: {permissions?.overlay ? 'Enabled' : 'Not enabled'}
        </Text>
        <Text style={[styles.statusText, {color: theme.colors.text}]}>
          Battery optimization ignored: {permissions?.ignoringBatteryOptimizations ? 'Yes' : 'No'}
        </Text>
        <PrimaryButton
          label="Open Overlay Settings"
          onPress={() => openSettings(nativeModules.focusShield.openOverlaySettings, 'overlay settings')}
          variant="secondary"
        />
        <PrimaryButton
          label="Open Battery Settings"
          onPress={() => openSettings(nativeModules.focusShield.openBatteryOptimizationSettings, 'battery settings')}
          variant="secondary"
        />
      </SectionCard>

      <PrimaryButton label="Refresh Permission Status" onPress={refreshPermissions} />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  intro: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 22,
    gap: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  statusLine: {
    paddingBottom: 4,
  },
  statusText: {
    fontSize: 14,
    lineHeight: 20,
  },
});
