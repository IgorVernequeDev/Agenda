import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { MONTH_NAMES_SHORT, WEEK_DAYS_SHORT_PT } from '../utils/dateUtils';
import { EventItem } from '../types';

interface CalendarYearViewProps {
  year: number;
  selectedDate: string;
  events: EventItem[];
  theme: any;
  onSelectMonth: (monthIndex: number) => void;
  onPrevYear: () => void;
  onNextYear: () => void;
}

export const CalendarYearView: React.FC<CalendarYearViewProps> = ({
  year,
  selectedDate,
  events,
  theme,
  onSelectMonth,
  onPrevYear,
  onNextYear,
}) => {
  const months = Array.from({ length: 12 }, (_, i) => i);

  // Group events by YYYY-MM
  const eventsByMonth = React.useMemo(() => {
    const map: Record<string, number> = {};
    events.forEach((ev) => {
      const ym = ev.date.substring(0, 7);
      map[ym] = (map[ym] || 0) + 1;
    });
    return map;
  }, [events]);

  const renderMiniMonth = (monthIndex: number) => {
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, monthIndex, 1).getDay(); // 0 is Sunday
    const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
    const monthEventsCount = eventsByMonth[monthKey] || 0;

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) {
      cells.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(d);
    }

    return (
      <TouchableOpacity
        key={monthIndex}
        style={[styles.miniMonthCard, { backgroundColor: theme.cardBg }]}
        onPress={() => onSelectMonth(monthIndex)}
        activeOpacity={0.75}
      >
        {/* Mini month header */}
        <View style={styles.miniMonthHeader}>
          <Text style={[styles.miniMonthTitle, { color: theme.textPrimary }]}>
            {MONTH_NAMES_SHORT[monthIndex]}
          </Text>
          {monthEventsCount > 0 && (
            <View style={[styles.miniEventsCountBadge, { backgroundColor: theme.accent }]}>
              <Text style={styles.miniEventsCountText}>{monthEventsCount}</Text>
            </View>
          )}
        </View>

        {/* Mini weekday header */}
        <View style={styles.miniWeekDaysRow}>
          {WEEK_DAYS_SHORT_PT.map((w, idx) => (
            <Text key={idx} style={[styles.miniWeekDayText, { color: theme.textMuted }]}>
              {w[0]}
            </Text>
          ))}
        </View>

        {/* Mini days grid */}
        <View style={styles.miniDaysGrid}>
          {cells.map((dayNum, idx) => {
            if (dayNum === null) {
              return <View key={idx} style={styles.miniDayCell} />;
            }
            const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            const isSelected = dateStr === selectedDate;

            return (
              <View
                key={idx}
                style={[
                  styles.miniDayCell,
                  isSelected && {
                    backgroundColor: theme.accent,
                    borderRadius: 8,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.miniDayText,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : theme.textPrimary,
                      fontWeight: isSelected ? '700' : '400',
                    },
                  ]}
                >
                  {dayNum}
                </Text>
              </View>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      {/* Year header navigation */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onPrevYear}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navArrow, { color: theme.textPrimary }]}>‹</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{year}</Text>

        <TouchableOpacity
          onPress={onNextYear}
          style={styles.navButton}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.7}
        >
          <Text style={[styles.navArrow, { color: theme.textPrimary }]}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 12 Months Grid */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.monthsGrid}>
          {months.map((m) => renderMiniMonth(m))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
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
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  monthsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  miniMonthCard: {
    width: '48%',
    borderRadius: 16,
    padding: 12,
    marginBottom: 8,
  },
  miniMonthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  miniMonthTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  miniEventsCountBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  miniEventsCountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  miniWeekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  miniWeekDayText: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 9,
    fontWeight: '600',
  },
  miniDaysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  miniDayCell: {
    width: '14.28%',
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniDayText: {
    fontSize: 9,
  },
});

export default CalendarYearView;
