import {FocusSchedule} from '../types';

export const minutesToLabel = (minutes: number): string => {
  const normalized = ((minutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(normalized / 60);
  const minute = normalized % 60;
  const suffix = hour24 >= 12 ? 'PM' : 'AM';
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return `${hour12}:${minute.toString().padStart(2, '0')} ${suffix}`;
};

export const dateToMinutes = (value: Date): number => value.getHours() * 60 + value.getMinutes();

export const isScheduleActive = (schedule: FocusSchedule, nowMinutes: number): boolean => {
  if (!schedule.enabled) {
    return false;
  }

  if (schedule.startMinutes === schedule.endMinutes) {
    return true;
  }

  if (schedule.startMinutes < schedule.endMinutes) {
    return nowMinutes >= schedule.startMinutes && nowMinutes < schedule.endMinutes;
  }

  return nowMinutes >= schedule.startMinutes || nowMinutes < schedule.endMinutes;
};

export const getCurrentMinutes = (): number => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

export const getActiveSchedules = (schedules: FocusSchedule[], nowMinutes = getCurrentMinutes()) =>
  schedules.filter(schedule => isScheduleActive(schedule, nowMinutes));
