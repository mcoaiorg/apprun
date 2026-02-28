import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { v4 as uuidv4 } from 'uuid';

import { Alarm, City, ClockItem, Settings } from '@/types';
import { CITIES } from '@/data/cities';
import { defaultSettings } from '@/utils/time';
import { loadJson, saveJson, STORAGE_KEYS } from '@/utils/storage';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowAlert: true,
  }),
});

interface AppContextValue {
  clocks: ClockItem[];
  alarms: Alarm[];
  settings: Settings;
  cities: City[];
  addClock: (cityId: string) => void;
  removeClock: (clockId: string) => void;
  reorderClocks: (data: ClockItem[]) => void;
  setSettings: (next: Partial<Settings>) => void;
  addAlarm: (partial?: Partial<Alarm>) => Promise<void>;
  updateAlarm: (id: string, next: Partial<Alarm>) => Promise<void>;
  removeAlarm: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider = ({ children }: React.PropsWithChildren) => {
  const [clocks, setClocks] = useState<ClockItem[]>([]);
  const [alarms, setAlarms] = useState<Alarm[]>([]);
  const [settings, setSettingsState] = useState<Settings>(defaultSettings);

  useEffect(() => {
    (async () => {
      const [savedClocks, savedAlarms, savedSettings] = await Promise.all([
        loadJson<ClockItem[]>(STORAGE_KEYS.CLOCKS, []),
        loadJson<Alarm[]>(STORAGE_KEYS.ALARMS, []),
        loadJson<Settings>(STORAGE_KEYS.SETTINGS, defaultSettings),
      ]);
      setClocks(savedClocks);
      setAlarms(savedAlarms);
      setSettingsState(savedSettings);
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const persistClocks = async (next: ClockItem[]) => {
    setClocks(next);
    await saveJson(STORAGE_KEYS.CLOCKS, next);
  };

  const persistAlarms = async (next: Alarm[]) => {
    setAlarms(next);
    await saveJson(STORAGE_KEYS.ALARMS, next);
  };

  const addClock = (cityId: string) => {
    if (clocks.some((c) => c.cityId === cityId)) return;
    persistClocks([...clocks, { id: uuidv4(), cityId }]);
  };

  const removeClock = (clockId: string) => {
    persistClocks(clocks.filter((c) => c.id !== clockId));
  };

  const reorderClocks = (data: ClockItem[]) => {
    persistClocks(data);
  };

  const setSettings = (next: Partial<Settings>) => {
    const merged = { ...settings, ...next };
    setSettingsState(merged);
    saveJson(STORAGE_KEYS.SETTINGS, merged);
  };

  const scheduleAlarmNotifications = async (alarm: Alarm): Promise<string[]> => {
    const ids: string[] = [];
    const weekdays = alarm.repeatDays.length ? alarm.repeatDays : [new Date().getDay()];

    for (const weekday of weekdays) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: alarm.label || 'Alarm',
          body: `It's ${alarm.hour.toString().padStart(2, '0')}:${alarm.minute.toString().padStart(2, '0')}`,
          sound: 'default',
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
          weekday: weekday === 0 ? 1 : weekday + 1,
          hour: alarm.hour,
          minute: alarm.minute,
        },
      });
      ids.push(id);
    }
    return ids;
  };

  const cancelNotifications = async (ids: string[]) => {
    await Promise.all(ids.map((id) => Notifications.cancelScheduledNotificationAsync(id)));
  };

  const addAlarm = async (partial?: Partial<Alarm>) => {
    const base: Alarm = {
      id: uuidv4(),
      hour: 7,
      minute: 0,
      label: 'Alarm',
      repeatDays: [],
      enabled: true,
      sound: 'default',
      snoozeMinutes: settings.defaultSnooze,
      notificationIds: [],
      ...partial,
    };
    if (base.enabled) {
      base.notificationIds = await scheduleAlarmNotifications(base);
    }
    await persistAlarms([...alarms, base]);
  };

  const updateAlarm = async (id: string, next: Partial<Alarm>) => {
    const target = alarms.find((alarm) => alarm.id === id);
    if (!target) return;
    await cancelNotifications(target.notificationIds);
    const merged = { ...target, ...next, notificationIds: [] };
    if (merged.enabled) {
      merged.notificationIds = await scheduleAlarmNotifications(merged);
    }
    await persistAlarms(alarms.map((alarm) => (alarm.id === id ? merged : alarm)));
  };

  const removeAlarm = async (id: string) => {
    const target = alarms.find((alarm) => alarm.id === id);
    if (!target) return;
    await cancelNotifications(target.notificationIds);
    await persistAlarms(alarms.filter((alarm) => alarm.id !== id));
  };

  const value = useMemo(
    () => ({
      clocks,
      alarms,
      settings,
      cities: CITIES,
      addClock,
      removeClock,
      reorderClocks,
      setSettings,
      addAlarm,
      updateAlarm,
      removeAlarm,
    }),
    [clocks, alarms, settings],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
