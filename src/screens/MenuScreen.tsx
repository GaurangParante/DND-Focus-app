import React from 'react';
import {StyleSheet, Switch, Text, View} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenContainer} from '../components/ScreenContainer';
import {SectionCard} from '../components/SectionCard';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';

export const MenuScreen = ({navigation}: {navigation: any}) => {
  const {config, setThemePreference} = useFocus();
  const {theme} = useAppTheme();
  const darkModeEnabled = config.themePreference === 'dark';
  const introStyle = {
    backgroundColor: theme.colors.backgroundElevated,
    borderColor: theme.colors.border,
  };

  return (
    <ScreenContainer>
      <View style={[styles.intro, introStyle]}>
        <Text style={[styles.eyebrow, {color: theme.colors.primary}]}>Appearance</Text>
        <Text style={[styles.title, {color: theme.colors.text}]}>Settings</Text>
        <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
          Manage FocusShield appearance and open the rest of your tools from one place.
        </Text>
      </View>

      <SectionCard title="Dark mode" subtitle="Use a quick toggle or choose an exact theme preference.">
        <View style={styles.toggleRow}>
          <View style={styles.toggleCopy}>
            <Text style={[styles.toggleTitle, {color: theme.colors.text}]}>Enable dark mode</Text>
            <Text style={[styles.toggleHint, {color: theme.colors.textMuted}]}>
              This overrides system mode until you switch back.
            </Text>
          </View>
          <Switch
            value={darkModeEnabled}
            onValueChange={value => setThemePreference(value ? 'dark' : 'light')}
          />
        </View>

        <View style={styles.themeRow}>
          <PrimaryButton
            label="System"
            onPress={() => setThemePreference('system')}
            variant={config.themePreference === 'system' ? 'primary' : 'secondary'}
          />
          <PrimaryButton
            label="Light"
            onPress={() => setThemePreference('light')}
            variant={config.themePreference === 'light' ? 'primary' : 'secondary'}
          />
          <PrimaryButton
            label="Dark"
            onPress={() => setThemePreference('dark')}
            variant={config.themePreference === 'dark' ? 'primary' : 'secondary'}
          />
        </View>
      </SectionCard>

      <SectionCard title="More tools" subtitle="Open screens that live outside the bottom tabs.">
        <PrimaryButton label="Choose Apps" onPress={() => navigation.navigate('AppSelection')} />
        <PrimaryButton
          label="Manage Schedules"
          onPress={() => navigation.navigate('Schedules')}
          variant="secondary"
        />
        <PrimaryButton
          label="Permission Setup"
          onPress={() => navigation.navigate('Permissions')}
          variant="secondary"
        />
        <PrimaryButton
          label="Screen Time"
          onPress={() => navigation.navigate('ScreenTime')}
          variant="secondary"
        />
        <PrimaryButton
          label="Block Screen Preview"
          onPress={() => navigation.navigate('BlockPreview')}
          variant="secondary"
        />
      </SectionCard>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  intro: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
    gap: 8,
  },
  eyebrow: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  toggleCopy: {
    flex: 1,
    gap: 4,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  toggleHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  themeRow: {
    gap: 10,
  },
});
