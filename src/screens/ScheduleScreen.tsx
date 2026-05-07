import React, {useMemo, useState} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import {AppHeader} from '../components/AppHeader';
import {PrimaryButton} from '../components/PrimaryButton';
import {ScheduleListItem} from '../components/ScheduleListItem';
import {ScreenContainer} from '../components/ScreenContainer';
import {useFocus} from '../context/FocusContext';
import {useAppTheme} from '../hooks/useAppTheme';
import {FocusSchedule} from '../types';
import {dateToMinutes, minutesToLabel} from '../utils/time';

const createDraft = (schedule?: FocusSchedule) => ({
  id: schedule?.id ?? `${Date.now()}`,
  label: schedule?.label ?? 'Focus Session',
  startMinutes: schedule?.startMinutes ?? 13 * 60,
  endMinutes: schedule?.endMinutes ?? 17 * 60,
  enabled: schedule?.enabled ?? true,
});

const minutesToDate = (minutes: number) => {
  const date = new Date();
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
};

export const ScheduleScreen = () => {
  const {config, upsertSchedule, deleteSchedule} = useFocus();
  const {theme} = useAppTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draft, setDraft] = useState(createDraft());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const sortedSchedules = useMemo(
    () => [...config.schedules].sort((a, b) => a.startMinutes - b.startMinutes),
    [config.schedules],
  );

  const openModal = (schedule?: FocusSchedule) => {
    setDraft(createDraft(schedule));
    setShowStartPicker(false);
    setShowEndPicker(false);
    setIsModalVisible(true);
  };

  const saveDraft = async () => {
    await upsertSchedule(draft);
    setIsModalVisible(false);
  };

  const handleStartTimeChange = (_: unknown, value?: Date) => {
    if (Platform.OS === 'android') {
      setShowStartPicker(false);
    }
    if (value) {
      setDraft(current => ({...current, startMinutes: dateToMinutes(value)}));
    }
  };

  const handleEndTimeChange = (_: unknown, value?: Date) => {
    if (Platform.OS === 'android') {
      setShowEndPicker(false);
    }
    if (value) {
      setDraft(current => ({...current, endMinutes: dateToMinutes(value)}));
    }
  };

  return (
    <ScreenContainer activeTab="Schedules">
      <AppHeader showBack />
      <View
        style={[
          styles.intro,
          {
            backgroundColor: theme.colors.backgroundElevated,
            borderColor: theme.colors.backgroundElevated,
          },
        ]}>
        <Text style={[styles.title, {color: theme.colors.text}]}>Focus schedules</Text>
        <Text style={[styles.subtitle, {color: theme.colors.textMuted}]}>
          Add multiple time windows. Overnight schedules are supported automatically when the end time is earlier than the start time.
        </Text>
      </View>
      <PrimaryButton label="+  Add schedule" onPress={() => openModal()} />

      <View style={styles.list}>
        {sortedSchedules.map(schedule => (
          <ScheduleListItem
            key={schedule.id}
            schedule={schedule}
            onEdit={() => openModal(schedule)}
            onDelete={() => deleteSchedule(schedule.id)}
          />
        ))}
        {sortedSchedules.length === 0 ? (
          <Text style={[styles.emptyState, {color: theme.colors.textMuted}]}>
            No schedules saved yet. Add one to begin blocking during focus time.
          </Text>
        ) : null}
      </View>

      <Modal visible={isModalVisible} animationType="slide" transparent onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, {backgroundColor: theme.colors.surface}]}>
            <Text style={[styles.modalTitle, {color: theme.colors.text}]}>Edit schedule</Text>
            <TextInput
              value={draft.label}
              onChangeText={value => setDraft(current => ({...current, label: value}))}
              style={[
                styles.input,
                {
                  backgroundColor: theme.colors.surfaceMuted,
                  borderColor: theme.colors.border,
                  color: theme.colors.text,
                },
              ]}
              placeholder="Schedule label"
              placeholderTextColor={theme.colors.textMuted}
            />

            <View style={styles.timeRow}>
              <View style={styles.timeColumn}>
                <Text style={[styles.timeLabel, {color: theme.colors.textMuted}]}>Start</Text>
                <Pressable
                  onPress={() => setShowStartPicker(true)}
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}>
                  <Text style={[styles.timeButtonText, {color: theme.colors.text}]}>
                    {minutesToLabel(draft.startMinutes)}
                  </Text>
                </Pressable>
                {showStartPicker ? (
                  <DateTimePicker
                    value={minutesToDate(draft.startMinutes)}
                    mode="time"
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={handleStartTimeChange}
                  />
                ) : null}
              </View>
              <View style={styles.timeColumn}>
                <Text style={[styles.timeLabel, {color: theme.colors.textMuted}]}>End</Text>
                <Pressable
                  onPress={() => setShowEndPicker(true)}
                  style={[
                    styles.timeButton,
                    {
                      backgroundColor: theme.colors.surfaceMuted,
                      borderColor: theme.colors.border,
                    },
                  ]}>
                  <Text style={[styles.timeButtonText, {color: theme.colors.text}]}>
                    {minutesToLabel(draft.endMinutes)}
                  </Text>
                </Pressable>
                {showEndPicker ? (
                  <DateTimePicker
                    value={minutesToDate(draft.endMinutes)}
                    mode="time"
                    display={Platform.OS === 'android' ? 'default' : 'spinner'}
                    onChange={handleEndTimeChange}
                  />
                ) : null}
              </View>
            </View>

            <View style={styles.switchRow}>
              <Text style={[styles.switchLabel, {color: theme.colors.text}]}>Enabled</Text>
              <Switch
                value={draft.enabled}
                onValueChange={value => setDraft(current => ({...current, enabled: value}))}
              />
            </View>

            <View style={styles.modalActions}>
              <Pressable onPress={() => setIsModalVisible(false)}>
                <Text style={[styles.actionText, {color: theme.colors.textMuted}]}>Cancel</Text>
              </Pressable>
              <Pressable onPress={saveDraft}>
                <Text style={[styles.actionText, {color: theme.colors.primary}]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
  intro: {
    borderRadius: 30,
    borderWidth: 1,
    padding: 24,
    gap: 10,
  },
  list: {
    gap: 12,
    paddingBottom: 24,
  },
  emptyState: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    paddingVertical: 24,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    gap: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    minHeight: 52,
    paddingHorizontal: 16,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeColumn: {
    flex: 1,
    gap: 6,
  },
  timeButton: {
    minHeight: 52,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  timeButtonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  timeLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 20,
    paddingTop: 8,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
