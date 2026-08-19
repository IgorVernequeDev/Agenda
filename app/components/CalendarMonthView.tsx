import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { EventItem, CATEGORIES, isEventOnDate } from '../types';
import {
  WEEK_DAYS,
  getCalendarGrid,
  formatHeaderTitle,
  CalendarDay,
} from '../utils/dateUtils';

interface CalendarMonthViewProps {
  year: number;
  month: number;
  selectedDate: string;
  events: EventItem[];
  theme: any;
  onSelectDate: (dateString: string, year: number, month: number) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onOpenSettings: () => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  year,
  month,
  selectedDate,
  events,
  theme,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  onOpenSettings,
}) => {
  const days = getCalendarGrid(year, month, selectedDate);

  const handleDayPress = (day: CalendarDay) => {
    onSelectDate(day.dateString, day.year, day.month);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Top Header with Month navigation and Settings button */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevMonth}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navArrow, { color: theme.textPrimary }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          {formatHeaderTitle(year, month)}
        </Text>

        <View style={styles.headerRightActions}>
          <TouchableOpacity
            onPress={onOpenSettings}
            style={styles.settingsButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            {/* Square/Settings icon as shown in Xiaomi HyperOS */}
            <View style={[styles.settingsSquareIcon, { borderColor: theme.textPrimary }]}>
              <View style={[styles.settingsSquareInner, { backgroundColor: theme.textPrimary }]} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onNextMonth}
            style={styles.navButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <Text style={[styles.navArrow, { color: theme.textPrimary }]}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Weekday headers: Dom Seg Ter Qua Qui Sex Sáb */}
      <View style={styles.weekDaysRow}>
        {WEEK_DAYS.map((wDay, idx) => (
          <Text key={idx} style={[styles.weekDayText, { color: theme.textSecondary }]}>
            {wDay}
          </Text>
        ))}
      </View>

      {/* Days Grid */}
      <View style={styles.daysGrid}>
        {days.map((day, index) => {
          // Check matching events including recurring ones
          const dayEvents = events.filter((ev) => isEventOnDate(ev, day.dateString));
          const isSelected = day.isSelected;
          const isCurrentMonth = day.isCurrentMonth;

          return (
            <TouchableOpacity
              key={`${day.dateString}-${index}`}
              style={styles.dayCell}
              onPress={() => handleDayPress(day)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.dayCircle,
                  isSelected && {
                    backgroundColor: theme.accent,
                    shadowColor: theme.accent,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.4,
                    shadowRadius: 4,
                    elevation: 3,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.dayNumberText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isCurrentMonth
                        ? theme.textPrimary
                        : theme.isDarkMode
                        ? '#4A4A4E'
                        : '#C7C7CC',
                      fontWeight: isSelected ? '700' : isCurrentMonth ? '500' : '400',
                    },
                  ]}
                >
                  {day.dayNumber}
                </Text>

                {/* Event dots indicator (up to 3 dots) */}
                {dayEvents.length > 0 && !isSelected && (
                  <View style={styles.eventDotsRow}>
                    {dayEvents.slice(0, 3).map((ev, dotIdx) => {
                      const dotColor = CATEGORIES[ev.category]?.color || theme.accent;
                      return (
                        <View
                          key={dotIdx}
                          style={[styles.eventDot, { backgroundColor: dotColor }]}
                        />
                      );
                    })}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 10,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  navButton: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
  },
  navArrow: {
    fontSize: 26,
    lineHeight: 28,
    fontWeight: '400',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  settingsButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  settingsSquareIcon: {
    width: 16,
    height: 16,
    borderWidth: 1.8,
    borderRadius: 3.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsSquareInner: {
    width: 4,
    height: 4,
    borderRadius: 1,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285%',
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 1.5,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  dayNumberText: {
    fontSize: 16,
    letterSpacing: -0.2,
  },
  eventDotsRow: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2.5,
    gap: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});

export default CalendarMonthView;
