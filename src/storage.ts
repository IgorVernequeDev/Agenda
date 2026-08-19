import { EventItem, AppSettings } from './types';

let AsyncStorage: any = null;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (e) {
  AsyncStorage = null;
}

const EVENTS_KEY = '@agenda_events_clean_v3';
const SETTINGS_KEY = '@agenda_settings_v3';

export const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: true,
  accentColor: '#007AFF',
};

export const INITIAL_EVENTS: EventItem[] = [];

// In-memory fallback
let memoryEvents: EventItem[] = [];
let memorySettings: AppSettings = { ...DEFAULT_SETTINGS };

export async function loadStoredEvents(): Promise<EventItem[]> {
  try {
    if (AsyncStorage) {
      const raw = await AsyncStorage.getItem(EVENTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          memoryEvents = parsed;
          return parsed;
        }
      }
    }
  } catch (error) {
    // Fallback gracefully without throwing
  }
  return memoryEvents;
}

export async function saveStoredEvents(events: EventItem[]): Promise<void> {
  memoryEvents = events;
  try {
    if (AsyncStorage) {
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
    }
  } catch (error) {
    // Fallback gracefully
  }
}

export async function clearAllStoredEvents(): Promise<void> {
  memoryEvents = [];
  try {
    if (AsyncStorage) {
      await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify([]));
    }
  } catch (error) {
    // Fallback gracefully
  }
}

export async function loadStoredSettings(): Promise<AppSettings> {
  try {
    if (AsyncStorage) {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      if (raw) {
        memorySettings = { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
        return memorySettings;
      }
    }
  } catch (error) {
    // Fallback gracefully
  }
  return memorySettings;
}

export async function saveStoredSettings(settings: AppSettings): Promise<void> {
  memorySettings = settings;
  try {
    if (AsyncStorage) {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }
  } catch (error) {
    // Fallback gracefully
  }
}
