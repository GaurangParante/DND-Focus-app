import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScreenContainer} from '../components/ScreenContainer';
import {useAppTheme} from '../hooks/useAppTheme';

export const BlockScreen = () => {
  const {theme} = useAppTheme();

  return (
    <ScreenContainer scroll={false}>
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
        <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <Text style={[styles.badge, {color: theme.colors.accent}]}>Focus Mode</Text>
          <Text style={[styles.title, {color: theme.colors.text}]}>This app is blocked during focus time</Text>
          <Text style={[styles.body, {color: theme.colors.textMuted}]}>
            The live blocking screen is a native Android activity launched by the accessibility service and foreground monitor. This preview matches that experience inside the React Native app.
          </Text>
          <PrimaryButton label="Stay Focused" onPress={() => undefined} />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    gap: 12,
  },
  badge: {
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.4,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  body: {
    fontSize: 15,
    lineHeight: 23,
    marginBottom: 12,
  },
});
