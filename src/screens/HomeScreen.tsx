import React from 'react';
import {Pressable, StyleSheet, Switch, Text, View} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AppHeader} from '../components/AppHeader';
import {ScreenContainer} from '../components/ScreenContainer';
import {SectionCard} from '../components/SectionCard';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';
import {RootStackParamList} from '../navigation/AppNavigator';
import {getActiveSchedules} from '../utils/time';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export const HomeScreen = ({navigation}: Props) => {
  const {config, permissions, setProtectionEnabled} = useFocus();
  const {theme} = useAppTheme();
  const activeSchedules = getActiveSchedules(config.schedules);
  const permissionsReady = Boolean(permissions?.usageAccess && permissions?.accessibility);
  const usageAccessMissing = !permissions?.usageAccess;
  const accessibilityMissing = !permissions?.accessibility;
  const heroCardStyle = {
    backgroundColor: theme.colors.backgroundElevated,
    borderColor: theme.colors.backgroundTint,
    shadowColor: theme.colors.shadow,
  };

  return (
    <ScreenContainer activeTab="Home">
      <AppHeader />
      <View style={[styles.hero, heroCardStyle]}>
        <Text style={[styles.kicker, {color: theme.colors.primary}]}>TODAY</Text>
        <Text style={[styles.title, {color: theme.colors.text}]}>
          Focus mode{' '}
          <Text style={{color: config.protectionEnabled ? theme.colors.primary : theme.colors.text}}>
            {config.protectionEnabled ? 'is active' : 'is resting'}
          </Text>
        </Text>
        <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
          {permissionsReady
            ? 'Your selected apps stay protected during active focus windows.'
            : 'Finish permission setup so blocking works reliably in the background.'}
        </Text>
        <View style={styles.heroStats}>
          <View style={[styles.heroPill, {backgroundColor: theme.colors.surfaceMuted}]}>
            <Text style={[styles.heroPillValue, {color: theme.colors.text}]}>
              {config.selectedApps.length}
            </Text>
            <Text style={[styles.heroPillLabel, {color: theme.colors.textMuted}]}>Blocked apps</Text>
          </View>
          <View style={[styles.heroPill, {backgroundColor: theme.colors.surfaceMuted}]}>
            <Text style={[styles.heroPillValue, {color: theme.colors.text}]}>
              {config.schedules.length}
            </Text>
            <Text style={[styles.heroPillLabel, {color: theme.colors.textMuted}]}>Schedules</Text>
          </View>
        </View>
      </View>

      <SectionCard
        title={config.protectionEnabled ? 'Protection enabled' : 'Protection disabled'}
        subtitle="Starts or stops the Android foreground service and applies your local schedules.">
        <View style={[styles.statusRow, {backgroundColor: theme.colors.surfaceMuted}]}>
          <View style={styles.statusCopy}>
            <Text style={[styles.statusLabel, {color: theme.colors.text}]}>Focus mode</Text>
            <Text style={[styles.statusHint, {color: theme.colors.textMuted}]}>
              {permissionsReady
                ? 'Ready to block selected apps during active schedules.'
                : 'Enable the required Android permissions before relying on blocking.'}
            </Text>
          </View>
          <Switch
            value={config.protectionEnabled}
            onValueChange={setProtectionEnabled}
            thumbColor="#F8FAFC"
            trackColor={{false: '#6B7280', true: theme.colors.primary}}
          />
        </View>
      </SectionCard>

      <SectionCard title="Today" subtitle="A snapshot of what is armed right now.">
        <View style={styles.usageHeader}>
          <View />
          <Pressable onPress={() => navigation.navigate('ScreenTime')}>
            <Text style={[styles.usageLink, {color: theme.colors.primary}]}>View usage</Text>
          </Pressable>
        </View>
        <View style={styles.metricRow}>
          <View style={[styles.metricCard, {backgroundColor: theme.colors.surfaceMuted}]}>
            <Text style={[styles.metricNumber, {color: theme.colors.text}]}>
              {config.selectedApps.length}
            </Text>
            <Text style={[styles.metricLabel, {color: theme.colors.textMuted}]}>Blocked apps</Text>
          </View>
          <View style={[styles.metricCard, {backgroundColor: theme.colors.surfaceMuted}]}>
            <Text style={[styles.metricNumber, {color: theme.colors.text}]}>
              {config.schedules.length}
            </Text>
            <Text style={[styles.metricLabel, {color: theme.colors.textMuted}]}>Schedules</Text>
          </View>
        </View>
        <Text style={[styles.activeText, {color: theme.colors.textMuted}]}>
          {activeSchedules.length > 0
            ? `${activeSchedules.length} focus schedule(s) are active right now.`
            : 'No schedule is active at the moment.'}
        </Text>
      </SectionCard>

      <Pressable onPress={() => navigation.navigate('Permissions')} style={styles.inlineLink}>
        <Text style={styles.inlineLinkText}>
          <Text style={{color: usageAccessMissing ? theme.colors.danger : theme.colors.success}}>
            Usage access: {permissions?.usageAccess ? 'enabled' : 'missing'}
          </Text>
          <Text style={{color: theme.colors.textMuted}}> | </Text>
          <Text
            style={{color: accessibilityMissing ? theme.colors.danger : theme.colors.success}}>
            Accessibility: {permissions?.accessibility ? 'enabled' : 'missing'}
          </Text>
        </Text>
      </Pressable>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    shadowOffset: {
      width: 0,
      height: 18,
    },
    shadowOpacity: 1,
    shadowRadius: 28,
    elevation: 8,
  },
  kicker: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },
  title: {
    fontSize: 31,
    fontWeight: '800',
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  heroPill: {
    flex: 1,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 4,
  },
  heroPillValue: {
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  heroPillLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  statusCopy: {
    flex: 1,
    gap: 4,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  metricRow: {
    flexDirection: 'row',
    gap: 12,
  },
  usageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  usageLink: {
    fontSize: 13,
    fontWeight: '700',
  },
  metricCard: {
    flex: 1,
    borderRadius: 22,
    padding: 18,
    gap: 6,
  },
  metricNumber: {
    fontSize: 28,
    fontWeight: '800',
  },
  metricLabel: {
    fontSize: 13,
  },
  activeText: {
    fontSize: 13,
    lineHeight: 18,
  },
  inlineLink: {
    paddingBottom: 18,
  },
  inlineLinkText: {
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
