import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventItem, AppSettings } from './types';

const EVENTS_KEY = '@agenda_events_clean_v3';
const SETTINGS_KEY = '@agenda_settings_v3';

export const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: true,
  accentColor: '#007AFF',
};

// Start with clean empty array (no demo/mock notes)
export const INITIAL_EVENTS: EventItem[] = [];

export async function loadStoredEvents(): Promise<EventItem[]> {
  try {
    const raw = await AsyncStorage.getItem(EVENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(INITIAL_EVENTS));
    return INITIAL_EVENTS;
  } catch (error) {
    console.warn('Erro ao carregar eventos:', error);
    return INITIAL_EVENTS;
  }
}

export async function saveStoredEvents(events: EventItem[]): Promise<void> {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  } catch (error) {
    console.warn('Erro ao salvar eventos:', error);
  }
}

export async function clearAllStoredEvents(): Promise<void> {
  try {
    await AsyncStorage.setItem(EVENTS_KEY, JSON.stringify([]));
  } catch (error) {
    console.warn('Erro ao limpar eventos:', error);
  }
}

export async function loadStoredSettings(): Promise<AppSettings> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
    return DEFAULT_SETTINGS;
  } catch (error) {
    console.warn('Erro ao carregar configurações:', error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveStoredSettings(settings: AppSettings): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.warn('Erro ao salvar configurações:', error);
  }
}
