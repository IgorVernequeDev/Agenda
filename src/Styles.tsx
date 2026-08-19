import { StyleSheet } from 'react-native';

export function getTheme(isDarkMode: boolean, accentColor: string) {
  return {
    bg: isDarkMode ? '#121214' : '#F2F2F7',
    cardBg: isDarkMode ? '#1C1C1E' : '#FFFFFF',
    cardSecondaryBg: isDarkMode ? '#242426' : '#E5E5EA',
    inputBg: isDarkMode ? '#2C2C2E' : '#E9E9EB',
    textPrimary: isDarkMode ? '#FFFFFF' : '#000000',
    textSecondary: isDarkMode ? '#8E8E93' : '#6C6C70',
    textMuted: isDarkMode ? '#555558' : '#AEAEB2',
    border: isDarkMode ? '#2C2C30' : '#E5E5EA',
    accent: accentColor,
    isDarkMode,
  };
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  navArrow: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  settingsIconButton: {
    padding: 6,
    borderRadius: 8,
  },
  calendarContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '500',
    color: '#8E8E93',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.285%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3,
  },
  dayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
  },
  dayTextMuted: {
    color: '#48484A',
  },
  dayTextSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  eventDotsContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 2,
    gap: 2,
  },
  eventDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  agendaCard: {
    flex: 1,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 80,
  },
  agendaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  agendaTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  agendaDateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  emptyAgendaContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyAgendaText: {
    fontSize: 15,
    color: '#636366',
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 28,
    color: '#FFFFFF',
    lineHeight: 30,
    fontWeight: '400',
    textAlign: 'center',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 60,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingBottom: 4,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  navTabText: {
    fontSize: 13,
    fontWeight: '500',
  },
  navActiveIndicator: {
    width: 24,
    height: 3,
    borderRadius: 1.5,
    marginTop: 4,
  },
});

export default styles;
