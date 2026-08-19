import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';

import {
  EventItem,
  AppSettings,
  TabType,
} from './types';
import {
  loadStoredEvents,
  saveStoredEvents,
  loadStoredSettings,
  saveStoredSettings,
  DEFAULT_SETTINGS,
} from './storage';
import { getTheme } from './Styles';
import { CalendarMonthView } from './components/CalendarMonthView';
import { CalendarYearView } from './components/CalendarYearView';
import { AgendaCard } from './components/AgendaCard';
import { TodayWidget } from './components/TodayWidget';
import { NewEventModal } from './components/NewEventModal';
import { SettingsModal } from './components/SettingsModal';
import { formatDateToISO } from './utils/dateUtils';

export default function App() {
  const now = new Date();
  const todayISO = formatDateToISO(now.getFullYear(), now.getMonth(), now.getDate());

  // Calendar View Date
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(todayISO);

  // Navigation and Modals
  const [activeTab, setActiveTab] = useState<TabType>('mes');
  const [isNewEventModalOpen, setIsNewEventModalOpen] = useState<boolean>(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState<boolean>(false);

  // App Data & Settings
  const [events, setEvents] = useState<EventItem[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isReady, setIsReady] = useState<boolean>(false);

  // Load Initial Data
  useEffect(() => {
    async function init() {
      const [loadedEvents, loadedSettings] = await Promise.all([
        loadStoredEvents(),
        loadStoredSettings(),
      ]);
      setEvents(loadedEvents);
      setSettings(loadedSettings);
      setIsReady(true);
    }
    init();
  }, []);

  // Save changes to storage
  const handleUpdateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    saveStoredSettings(updated);
  };

  const handleAddEvent = (eventData: Omit<EventItem, 'id' | 'createdAt'>) => {
    const newEvent: EventItem = {
      ...eventData,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 6),
      isCompleted: false,
      completedDates: [],
      createdAt: Date.now(),
    };
    const updated = [newEvent, ...events];
    setEvents(updated);
    saveStoredEvents(updated);
    setSelectedDate(newEvent.date);
  };

  const handleDeleteEvent = (id: string) => {
    const updated = events.filter((e) => e.id !== id);
    setEvents(updated);
    saveStoredEvents(updated);
  };

  // Toggle Completed / Pending (Per date for recurring events)
  const handleToggleComplete = (id: string, dateString: string) => {
    const updated = events.map((ev) => {
      if (ev.id !== id) return ev;

      if (ev.recurrence && ev.recurrence !== 'none') {
        const completedDates = ev.completedDates || [];
        const isDone = completedDates.includes(dateString);
        return {
          ...ev,
          completedDates: isDone
            ? completedDates.filter((d) => d !== dateString)
            : [...completedDates, dateString],
        };
      }

      return {
        ...ev,
        isCompleted: !ev.isCompleted,
      };
    });

    setEvents(updated);
    saveStoredEvents(updated);
  };

  // Month navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleSelectDate = (dateString: string, year: number, month: number) => {
    setSelectedDate(dateString);
    setCurrentYear(year);
    setCurrentMonth(month);
  };

  const handleSelectMonthFromYear = (monthIndex: number) => {
    setCurrentMonth(monthIndex);
    setActiveTab('mes');
  };

  const handleSelectToday = (todayStr: string) => {
    const [y, m] = todayStr.split('-').map(Number);
    setSelectedDate(todayStr);
    setCurrentYear(y);
    setCurrentMonth(m - 1);
  };

  const theme = getTheme(settings.isDarkMode, settings.accentColor);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={[styles.rootContainer, { backgroundColor: theme.bg }]}
        edges={['top', 'left', 'right', 'bottom']}
      >
        <ExpoStatusBar style={settings.isDarkMode ? 'light' : 'dark'} />
        <StatusBar barStyle={settings.isDarkMode ? 'light-content' : 'dark-content'} />

        {/* Main Content Area */}
        <View style={styles.mainContent}>
          {activeTab === 'ano' ? (
            <CalendarYearView
              year={currentYear}
              selectedDate={selectedDate}
              events={events}
              theme={theme}
              onSelectMonth={handleSelectMonthFromYear}
              onPrevYear={() => setCurrentYear((y) => y - 1)}
              onNextYear={() => setCurrentYear((y) => y + 1)}
            />
          ) : (
            <View style={styles.monthViewWrapper}>
              {/* Month Calendar Grid */}
              <CalendarMonthView
                year={currentYear}
                month={currentMonth}
                selectedDate={selectedDate}
                events={events}
                theme={theme}
                onSelectDate={handleSelectDate}
                onPrevMonth={handlePrevMonth}
                onNextMonth={handleNextMonth}
                onOpenSettings={() => setIsSettingsModalOpen(true)}
              />

              {/* Today Widget with Scrollable Annotations (Requested Format) */}
              <TodayWidget
                events={events}
                theme={theme}
                onSelectToday={handleSelectToday}
                onToggleComplete={handleToggleComplete}
                onAddNewEvent={() => setIsNewEventModalOpen(true)}
              />

              {/* Agenda Card (Events for Selected Day) */}
              <AgendaCard
                selectedDate={selectedDate}
                events={events}
                theme={theme}
                onDeleteEvent={handleDeleteEvent}
                onToggleComplete={handleToggleComplete}
              />

              {/* Floating Action Button (Blue +) */}
              <TouchableOpacity
                onPress={() => setIsNewEventModalOpen(true)}
                style={[styles.fab, { backgroundColor: theme.accent }]}
                activeOpacity={0.85}
              >
                <Text style={styles.fabIcon}>+</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Bottom Navigation Bar */}
        <View
          style={[
            styles.bottomNav,
            {
              backgroundColor: theme.bg,
              borderTopColor: theme.border,
            },
          ]}
        >
          {/* Aba: Ano */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('ano')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navTabText,
                {
                  color: activeTab === 'ano' ? theme.accent : theme.textSecondary,
                  fontWeight: activeTab === 'ano' ? '700' : '500',
                },
              ]}
            >
              Ano
            </Text>
            {activeTab === 'ano' && (
              <View style={[styles.navActiveIndicator, { backgroundColor: theme.accent }]} />
            )}
          </TouchableOpacity>

          {/* Aba: Mês */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setActiveTab('mes')}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navTabText,
                {
                  color: activeTab === 'mes' ? theme.accent : theme.textSecondary,
                  fontWeight: activeTab === 'mes' ? '700' : '500',
                },
              ]}
            >
              Mês
            </Text>
            {activeTab === 'mes' && (
              <View style={[styles.navActiveIndicator, { backgroundColor: theme.accent }]} />
            )}
          </TouchableOpacity>

          {/* Aba: Configurações */}
          <TouchableOpacity
            style={styles.navTab}
            onPress={() => setIsSettingsModalOpen(true)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.navTabText,
                {
                  color: isSettingsModalOpen ? theme.accent : theme.textSecondary,
                  fontWeight: isSettingsModalOpen ? '700' : '500',
                },
              ]}
            >
              Configurações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal: Novo Evento */}
        <NewEventModal
          visible={isNewEventModalOpen}
          selectedDate={selectedDate}
          theme={theme}
          onClose={() => setIsNewEventModalOpen(false)}
          onSave={handleAddEvent}
        />

        {/* Modal: Configurações */}
        <SettingsModal
          visible={isSettingsModalOpen}
          events={events}
          settings={settings}
          theme={theme}
          onClose={() => setIsSettingsModalOpen(false)}
          onUpdateSettings={handleUpdateSettings}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  mainContent: {
    flex: 1,
  },
  monthViewWrapper: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    right: 22,
    bottom: 24,
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 10,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 32,
    color: '#FFFFFF',
    lineHeight: 34,
    fontWeight: '300',
    textAlign: 'center',
    marginTop: -2,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 56,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    paddingTop: 4,
  },
  navTabText: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
  navActiveIndicator: {
    width: 22,
    height: 2.5,
    borderRadius: 1.5,
    marginTop: 4,
  },
});