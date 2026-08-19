export type CategoryType = 'ponto' | 'critico' | 'reunioes' | 'comuns' | 'programacao';

export type RecurrenceType = 'none' | 'daily' | 'weekly' | 'monthly';

export interface CategoryInfo {
  id: CategoryType;
  label: string;
  emoji: string;
  color: string;
  badgeBg: string;
}

export interface EventItem {
  id: string;
  title: string;
  description?: string;
  date: string; // Format: YYYY-MM-DD
  category: CategoryType;
  isAllDay: boolean;
  startTime?: string; // Format: HH:MM
  endTime?: string; // Format: HH:MM
  isCompleted?: boolean;
  recurrence?: RecurrenceType;
  completedDates?: string[]; // YYYY-MM-DD dates where recurring event was done
  createdAt: number;
}

export interface AppSettings {
  isDarkMode: boolean;
  accentColor: string;
}

export const CATEGORIES: Record<CategoryType, CategoryInfo> = {
  ponto: {
    id: 'ponto',
    label: 'Ponto',
    emoji: '‼️',
    color: '#FF453A',
    badgeBg: 'rgba(255, 69, 58, 0.15)',
  },
  critico: {
    id: 'critico',
    label: 'Crítico',
    emoji: '☢️',
    color: '#FFD60A',
    badgeBg: 'rgba(255, 214, 10, 0.15)',
  },
  reunioes: {
    id: 'reunioes',
    label: 'Reuniões',
    emoji: '⚠️',
    color: '#30D158',
    badgeBg: 'rgba(48, 209, 88, 0.15)',
  },
  comuns: {
    id: 'comuns',
    label: 'Comuns',
    emoji: '🕒',
    color: '#0A84FF',
    badgeBg: 'rgba(10, 132, 255, 0.15)',
  },
  programacao: {
    id: 'programacao',
    label: 'Programação',
    emoji: '🅿️',
    color: '#8E8E93',
    badgeBg: 'rgba(142, 142, 147, 0.15)',
  },
};

export const RECURRENCE_OPTIONS: { id: RecurrenceType; label: string; icon: string }[] = [
  { id: 'none', label: 'Não repete', icon: '⛔' },
  { id: 'daily', label: 'Diariamente', icon: '🔁' },
  { id: 'weekly', label: 'Semanalmente', icon: '📅' },
  { id: 'monthly', label: 'Mensalmente', icon: '🗓️' },
];

export const ACCENT_COLORS = [
  '#F97316', // Orange
  '#007AFF', // Blue (Default)
  '#22C55E', // Green
  '#EF4444', // Red
  '#F43F5E', // Pink
  '#A855F7', // Purple
  '#F59E0B', // Amber / Gold
  '#71717A', // Gray
];

export type TabType = 'ano' | 'mes' | 'configuracoes';

export function isEventOnDate(event: EventItem, dateString: string): boolean {
  if (!event.recurrence || event.recurrence === 'none') {
    return event.date === dateString;
  }

  // Recurring events only trigger on or after their start date
  if (dateString < event.date) {
    return false;
  }

  if (event.recurrence === 'daily') {
    return true;
  }

  const [ey, em, ed] = event.date.split('-').map(Number);
  const [ty, tm, td] = dateString.split('-').map(Number);

  if (event.recurrence === 'monthly') {
    return td === ed;
  }

  if (event.recurrence === 'weekly') {
    const eventDayOfWeek = new Date(ey, em - 1, ed).getDay();
    const targetDayOfWeek = new Date(ty, tm - 1, td).getDay();
    return eventDayOfWeek === targetDayOfWeek;
  }

  return false;
}

export function isEventCompletedOnDate(event: EventItem, dateString: string): boolean {
  if (event.recurrence && event.recurrence !== 'none') {
    return (event.completedDates || []).includes(dateString);
  }
  return !!event.isCompleted;
}
