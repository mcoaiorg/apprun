export type ThemeMode = 'light' | 'dark';

export interface City {
  id: string;
  city: string;
  country: string;
  timeZone: string;
}

export interface ClockItem {
  id: string;
  cityId: string;
}

export interface Alarm {
  id: string;
  hour: number;
  minute: number;
  label: string;
  repeatDays: number[];
  enabled: boolean;
  sound: 'default' | 'chime' | 'digital';
  snoozeMinutes: 5 | 10 | 15;
  notificationIds: string[];
}

export interface Settings {
  use24Hour: boolean;
  theme: ThemeMode;
  defaultSnooze: 5 | 10 | 15;
  autoDetectTimezone: boolean;
}
