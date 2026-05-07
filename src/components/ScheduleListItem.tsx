import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {AppGlyph} from './AppGlyph';
import {useAppTheme} from '../hooks/useAppTheme';
import {FocusSchedule} from '../types';
import {minutesToLabel} from '../utils/time';

export const ScheduleListItem = ({
  schedule,
  onEdit,
  onDelete,
}: {
  schedule: FocusSchedule;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const {theme} = useAppTheme();
  const cardStyle = {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
    shadowColor: theme.colors.shadow,
  };
  const badgeWrapStyle = schedule.enabled
    ? {backgroundColor: 'rgba(66,211,146,0.14)'}
    : {backgroundColor: theme.colors.surfaceMuted};
  const badgeTextStyle = schedule.enabled
    ? {color: theme.colors.success}
    : {color: theme.colors.textMuted};

  return (
    <View style={[styles.card, cardStyle]}>
      <View style={styles.header}>
        <View style={styles.info}>
          <Text style={[styles.label, {color: theme.colors.text}]}>{schedule.label}</Text>
          <View style={styles.timeRow}>
            <AppGlyph name="dot" />
            <Text style={[styles.time, {color: theme.colors.textMuted}]}>
              {minutesToLabel(schedule.startMinutes)} to {minutesToLabel(schedule.endMinutes)}
            </Text>
          </View>
        </View>
        <View style={[styles.badgeWrap, badgeWrapStyle]}>
          <Text style={[styles.badge, badgeTextStyle]}>
            {schedule.enabled ? 'Active' : 'Paused'}
          </Text>
        </View>
      </View>
      <View style={styles.actions}>
        <Pressable
          onPress={onEdit}
          style={[styles.actionButton, {backgroundColor: theme.colors.surfaceMuted}]}>
          <Text style={[styles.actionText, {color: theme.colors.primary}]}>Edit</Text>
        </Pressable>
        <Pressable
          onPress={onDelete}
          style={[styles.actionButton, {backgroundColor: theme.colors.surfaceMuted}]}>
          <Text style={[styles.actionText, {color: theme.colors.danger}]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 18,
    gap: 14,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 1,
    shadowRadius: 18,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    alignItems: 'flex-start',
  },
  info: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
  },
  time: {
    fontSize: 13,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  badgeWrap: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  badge: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
    borderRadius: 18,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
