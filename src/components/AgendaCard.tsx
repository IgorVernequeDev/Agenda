import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {
  EventItem,
  CATEGORIES,
  isEventOnDate,
  isEventCompletedOnDate,
} from '../types';
import { formatAgendaDate } from '../utils/dateUtils';

interface AgendaCardProps {
  selectedDate: string;
  events: EventItem[];
  theme: any;
  onDeleteEvent: (id: string) => void;
  onToggleComplete: (id: string, dateString: string) => void;
}

export const AgendaCard: React.FC<AgendaCardProps> = ({
  selectedDate,
  events,
  theme,
  onDeleteEvent,
  onToggleComplete,
}) => {
  // Filter events for selected date (including recurring events) and sort:
  // 1. Pending (false) first, Done (true) last
  // 2. Chronological ascending time (08:00 -> 09:00 -> 11:00 -> 14:00)
  const sortedDayEvents = useMemo(() => {
    const list = events.filter((ev) => isEventOnDate(ev, selectedDate));
    return list.sort((a, b) => {
      const aDone = isEventCompletedOnDate(a, selectedDate);
      const bDone = isEventCompletedOnDate(b, selectedDate);

      // 1. Pending always before Done
      if (aDone !== bDone) {
        return aDone ? 1 : -1;
      }

      // 2. All-day events top of their group
      if (a.isAllDay && !b.isAllDay) return -1;
      if (!a.isAllDay && b.isAllDay) return 1;

      // 3. Chronological sorting by start time
      const timeA = a.startTime || '00:00';
      const timeB = b.startTime || '00:00';
      return timeA.localeCompare(timeB);
    });
  }, [events, selectedDate]);

  const pendingCount = sortedDayEvents.filter(
    (e) => !isEventCompletedOnDate(e, selectedDate)
  ).length;
  const completedCount = sortedDayEvents.filter((e) =>
    isEventCompletedOnDate(e, selectedDate)
  ).length;

  const confirmDelete = (event: EventItem) => {
    Alert.alert(
      'Excluir Evento',
      `Deseja realmente remover o evento "${event.title}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => onDeleteEvent(event.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
      {/* Card Header: Agenda | Qua, 19/08/2026 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Agenda</Text>
          {sortedDayEvents.length > 0 && (
            <View style={styles.headerStats}>
              {pendingCount > 0 && (
                <View style={styles.statChipPending}>
                  <View style={styles.statDotPending} />
                  <Text style={styles.statTextPending}>
                    {pendingCount} pendente{pendingCount > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
              {completedCount > 0 && (
                <View style={styles.statChipDone}>
                  <View style={styles.statDotDone} />
                  <Text style={styles.statTextDone}>
                    {completedCount} feito{completedCount > 1 ? 's' : ''}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        <Text style={[styles.dateText, { color: theme.textSecondary }]}>
          {formatAgendaDate(selectedDate)}
        </Text>
      </View>

      {/* Events list or empty message */}
      <ScrollView
        style={styles.eventsScroll}
        contentContainerStyle={styles.eventsContent}
        showsVerticalScrollIndicator={false}
      >
        {sortedDayEvents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.textMuted }]}>
              Não há eventos para este dia
            </Text>
          </View>
        ) : (
          sortedDayEvents.map((item) => {
            const category = CATEGORIES[item.category] || CATEGORIES.comuns;
            const isDone = isEventCompletedOnDate(item, selectedDate);

            return (
              <View
                key={item.id}
                style={[
                  styles.eventItemCard,
                  {
                    backgroundColor: theme.cardSecondaryBg,
                    borderLeftColor: isDone ? '#30D158' : category.color,
                    opacity: isDone ? 0.7 : 1,
                  },
                ]}
              >
                {/* Status Toggle Button (Green when Done / Red when Pending) */}
                <TouchableOpacity
                  onPress={() => onToggleComplete(item.id, selectedDate)}
                  style={[
                    styles.statusCheckButton,
                    isDone
                      ? styles.statusCheckButtonDone
                      : styles.statusCheckButtonPending,
                  ]}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {isDone ? (
                    <Text style={styles.checkIconDone}>✓</Text>
                  ) : (
                    <View style={styles.pendingDotInner} />
                  )}
                </TouchableOpacity>

                <View style={styles.eventMain}>
                  {/* Category Pill, Time, Recurrence and Status Tag */}
                  <View style={styles.eventMetaRow}>
                    <View
                      style={[
                        styles.categoryBadge,
                        { backgroundColor: category.badgeBg },
                      ]}
                    >
                      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
                      <Text
                        style={[
                          styles.categoryLabel,
                          { color: category.color },
                        ]}
                      >
                        {category.label}
                      </Text>
                    </View>

                    {/* Time */}
                    <Text style={[styles.eventTimeText, { color: theme.textSecondary }]}>
                      {item.isAllDay
                        ? 'Dia inteiro'
                        : `${item.startTime || '00:00'} - ${item.endTime || '23:59'}`}
                    </Text>

                    {/* Recurrence Badge if any */}
                    {item.recurrence && item.recurrence !== 'none' && (
                      <View style={styles.recurrenceBadge}>
                        <Text style={styles.recurrenceBadgeText}>
                          {item.recurrence === 'daily'
                            ? '🔁 Diário'
                            : item.recurrence === 'weekly'
                            ? '📅 Semanal'
                            : '🗓️ Mensal'}
                        </Text>
                      </View>
                    )}

                    {/* Status Badge */}
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isDone
                            ? 'rgba(48, 209, 88, 0.15)'
                            : 'rgba(255, 69, 58, 0.15)',
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusBadgeText,
                          { color: isDone ? '#30D158' : '#FF453A' },
                        ]}
                      >
                        {isDone ? 'Feito' : 'Pendente'}
                      </Text>
                    </View>
                  </View>

                  {/* Title */}
                  <Text
                    style={[
                      styles.eventTitle,
                      {
                        color: isDone ? theme.textSecondary : theme.textPrimary,
                        textDecorationLine: isDone ? 'line-through' : 'none',
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  {/* Description if any */}
                  {!!item.description && (
                    <Text
                      style={[
                        styles.eventDescription,
                        { color: theme.textSecondary },
                      ]}
                      numberOfLines={2}
                    >
                      {item.description}
                    </Text>
                  )}
                </View>

                {/* Delete Button */}
                <TouchableOpacity
                  onPress={() => confirmDelete(item)}
                  style={styles.deleteButton}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.deleteIconText}>✕</Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  headerLeft: {
    flexDirection: 'column',
    gap: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  headerStats: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  statChipPending: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 69, 58, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  statDotPending: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#FF453A',
  },
  statTextPending: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF453A',
  },
  statChipDone: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(48, 209, 88, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  statDotDone: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#30D158',
  },
  statTextDone: {
    fontSize: 10,
    fontWeight: '600',
    color: '#30D158',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
  },
  eventsScroll: {
    flex: 1,
  },
  eventsContent: {
    paddingBottom: 70,
  },
  emptyContainer: {
    paddingVertical: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 15,
    fontWeight: '400',
    textAlign: 'center',
  },
  eventItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  statusCheckButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  statusCheckButtonPending: {
    borderWidth: 2,
    borderColor: '#FF453A',
    backgroundColor: 'rgba(255, 69, 58, 0.1)',
  },
  statusCheckButtonDone: {
    backgroundColor: '#30D158',
  },
  pendingDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF453A',
  },
  checkIconDone: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  eventMain: {
    flex: 1,
    paddingRight: 8,
  },
  eventMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 4,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 3,
  },
  categoryEmoji: {
    fontSize: 11,
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  eventTimeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  recurrenceBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  recurrenceBadgeText: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  eventDescription: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: 2,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 12,
    opacity: 0.6,
  },
  deleteIconText: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
  },
});

export default AgendaCard;
