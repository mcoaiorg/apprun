import AsyncStorage from '@react-native-async-storage/async-storage';

export const STORAGE_KEYS = {
  CLOCKS: '@apprun/clocks',
  ALARMS: '@apprun/alarms',
  SETTINGS: '@apprun/settings',
};

export const saveJson = async (key: string, value: unknown) => {
  await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const loadJson = async <T>(key: string, fallback: T): Promise<T> => {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};
