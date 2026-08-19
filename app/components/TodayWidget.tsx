import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  EventItem,
  CATEGORIES,
  isEventOnDate,
  isEventCompletedOnDate,
} from '../types';
import { formatWidgetHeader, formatDateToISO } from '../utils/dateUtils';

interface TodayWidgetProps {
  events: EventItem[];
  theme: any;
  onSelectToday: (dateString: string) => void;
  onToggleComplete: (id: string, dateString: string) => void;
  onAddNewEvent: () => void;
}

export const TodayWidget: React.FC<TodayWidgetProps> = ({
  events,
  theme,
  onSelectToday,
  onToggleComplete,
  onAddNewEvent,
}) => {
  const now = new Date();
  const todayISO = formatDateToISO(now.getFullYear(), now.getMonth(), now.getDate());

  // Filter and sort today's events (including recurring daily/weekly/monthly)
  const todayEvents = useMemo(() => {
    const list = events.filter((ev) => isEventOnDate(ev, todayISO));
    return list.sort((a, b) => {
      const aDone = isEventCompletedOnDate(a, todayISO);
      const bDone = isEventCompletedOnDate(b, todayISO);
      // Pending first, Done last
      if (aDone !== bDone) return aDone ? 1 : -1;

      // All day first
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;

      // Chronological time
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  }, [events, todayISO]);

  return (
    <View
      style={[
        styles.widgetContainer,
        {
          backgroundColor: theme.cardBg,
          borderColor: theme.border,
        },
      ]}
    >
      {/* Widget Header: 18/08 - Terça Feira */}
      <TouchableOpacity
        onPress={() => onSelectToday(todayISO)}
        activeOpacity={0.75}
        style={styles.headerRow}
      >
        <View style={styles.headerLeft}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
            {formatWidgetHeader(todayISO)}
          </Text>
        </View>

        <TouchableOpacity
          onPress={onAddNewEvent}
          style={[styles.addBtn, { backgroundColor: theme.cardSecondaryBg }]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.addBtnText, { color: theme.accent }]}>+ Novo</Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.border }]} />

      {/* Scrollable list of annotations (ai vai baixando e aparece as outras) */}
      <ScrollView
        style={styles.scrollList}
        contentContainerStyle={styles.scrollContent}
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={true}
      >
        {todayEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Nenhuma anotação para hoje
            </Text>
          </View>
        ) : (
          todayEvents.map((item) => {
            const isDone = isEventCompletedOnDate(item, todayISO);
            const category = CATEGORIES[item.category] || CATEGORIES.comuns;

            return (
              <View
                key={item.id}
                style={[
                  styles.annotationRow,
                  {
                    backgroundColor: theme.cardSecondaryBg,
                  },
                ]}
              >
                {/* Dash indicator "-" */}
                <Text style={[styles.dashText, { color: theme.textMuted }]}>-</Text>

                {/* Red (pending) / Green (done) Status Button */}
                <TouchableOpacity
                  onPress={() => onToggleComplete(item.id, todayISO)}
                  style={[
                    styles.statusBtn,
                    isDone ? styles.statusBtnDone : styles.statusBtnPending,
                  ]}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {isDone ? (
                    <Text style={styles.checkTextDone}>✓</Text>
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                </TouchableOpacity>

                {/* Time badge */}
                <Text style={[styles.timeText, { color: theme.textSecondary }]}>
                  {item.isAllDay ? 'Dia todo' : item.startTime || '00:00'}
                </Text>

                {/* Recurrence icon if any */}
                {item.recurrence && item.recurrence !== 'none' && (
                  <Text style={styles.recurrenceIcon}>
                    {item.recurrence === 'daily'
                      ? '🔁'
                      : item.recurrence === 'weekly'
                      ? '📅'
                      : '🗓️'}
                  </Text>
                )}

                {/* Title */}
                <Text
                  style={[
                    styles.titleText,
                    {
                      color: isDone ? theme.textMuted : theme.textPrimary,
                      textDecorationLine: isDone ? 'line-through' : 'none',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {item.title}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  addBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: '100%',
  },
  scrollList: {
    maxHeight: 145,
  },
  scrollContent: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 13,
    fontWeight: '500',
  },
  annotationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginBottom: 5,
    gap: 8,
  },
  dashText: {
    fontSize: 15,
    fontWeight: '700',
  },
  statusBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBtnPending: {
    borderWidth: 1.8,
    borderColor: '#FF453A',
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
  },
  statusBtnDone: {
    backgroundColor: '#30D158',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF453A',
  },
  checkTextDone: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  timeText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 42,
  },
  recurrenceIcon: {
    fontSize: 11,
  },
  titleText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
});

export default TodayWidget;
