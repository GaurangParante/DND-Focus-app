import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {useAppTheme} from '../hooks/useAppTheme';
import {InstalledApp} from '../types';

export const AppListItem = ({
  app,
  selected,
  onPress,
}: {
  app: InstalledApp;
  selected: boolean;
  onPress: () => void;
}) => {
  const {theme} = useAppTheme();
  const rowStyle = {
    backgroundColor: selected ? theme.colors.backgroundElevated : theme.colors.surface,
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    shadowColor: theme.colors.shadow,
  };
  const checkboxStyle = {
    borderColor: selected ? theme.colors.primary : theme.colors.border,
    backgroundColor: selected ? theme.colors.primary : 'transparent',
  };
  const initial = app.appName.trim().charAt(0).toUpperCase() || 'A';
  const badgeColors = ['#2E9BFF', '#17C6D6', '#FF6476', '#67D44D', '#A855F7'];
  const badgeColor = badgeColors[app.appName.length % badgeColors.length];

  return (
    <Pressable
      onPress={onPress}
      style={({pressed}) => [
        styles.row,
        rowStyle,
        {
          opacity: pressed ? 0.92 : 1,
          transform: [{scale: pressed ? 0.992 : 1}],
        },
      ]}>
      <View style={[styles.iconBadge, {backgroundColor: badgeColor}]}>
        <Text style={styles.iconBadgeText}>{initial}</Text>
      </View>
      <View style={styles.meta}>
        <Text style={[styles.name, {color: theme.colors.text}]} numberOfLines={1}>
          {app.appName}
        </Text>
        <Text style={[styles.packageName, {color: theme.colors.textMuted}]} numberOfLines={1}>
          {app.isSystemApp ? 'System app' : 'Installed app'}  |  {app.packageName}
        </Text>
      </View>
      <View style={[styles.checkbox, checkboxStyle]}>
        {selected ? <Text style={styles.checkMark}>{'\u2713'}</Text> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    borderRadius: 24,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBadgeText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  meta: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
  },
  packageName: {
    fontSize: 12,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkMark: {
    color: '#04131A',
    fontWeight: '900',
  },
});
