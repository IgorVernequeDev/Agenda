export const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export const MONTH_NAMES_SHORT = [
  'Jan',
  'Fev',
  'Mar',
  'Abr',
  'Mai',
  'Jun',
  'Jul',
  'Ago',
  'Set',
  'Out',
  'Nov',
  'Dez',
];

export const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export const WEEK_DAYS_SHORT_PT = [
  'Dom',
  'Seg',
  'Ter',
  'Qua',
  'Qui',
  'Sex',
  'Sáb',
];

export const WEEK_DAYS_FULL_PT = [
  'Domingo',
  'Segunda-Feira',
  'Terça-Feira',
  'Quarta-Feira',
  'Quinta-Feira',
  'Sexta-Feira',
  'Sábado',
];

export interface CalendarDay {
  dateString: string; // YYYY-MM-DD
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  year: number;
  month: number;
}

export function formatDateToISO(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

export function parseISODate(dateString: string): { year: number; month: number; day: number } {
  const [y, m, d] = dateString.split('-').map(Number);
  return { year: y, month: m - 1, day: d };
}

export function formatHeaderTitle(year: number, month: number): string {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function formatAgendaDate(dateString: string): string {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = WEEK_DAYS_SHORT_PT[dateObj.getDay()];
  const formattedDay = String(d).padStart(2, '0');
  const formattedMonth = String(m).padStart(2, '0');
  return `${dayOfWeek}, ${formattedDay}/${formattedMonth}/${y}`;
}

export function formatWidgetHeader(dateString: string): string {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-').map(Number);
  const dateObj = new Date(y, m - 1, d);
  const dayOfWeek = WEEK_DAYS_FULL_PT[dateObj.getDay()];
  const formattedDay = String(d).padStart(2, '0');
  const formattedMonth = String(m).padStart(2, '0');
  return `${formattedDay}/${formattedMonth} - ${dayOfWeek}`;
}

export function formatDisplayDate(dateString: string): string {
  if (!dateString) return '';
  const [y, m, d] = dateString.split('-').map(Number);
  const formattedDay = String(d).padStart(2, '0');
  const formattedMonth = String(m).padStart(2, '0');
  return `${formattedDay}/${formattedMonth}/${y}`;
}

export function parseDisplayDate(displayDate: string): string | null {
  const parts = displayDate.split('/');
  if (parts.length !== 3) return null;
  const [d, m, y] = parts.map(Number);
  if (!d || !m || !y || isNaN(d) || isNaN(m) || isNaN(y)) return null;
  return formatDateToISO(y, m - 1, d);
}

export function getCalendarGrid(year: number, month: number, selectedDate: string): CalendarDay[] {
  const days: CalendarDay[] = [];
  const todayISO = new Date().toISOString().split('T')[0];

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const dayNum = daysInPrevMonth - i;
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const dateStr = formatDateToISO(prevYear, prevMonth, dayNum);
    days.push({
      dateString: dateStr,
      dayNumber: dayNum,
      isCurrentMonth: false,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      year: prevYear,
      month: prevMonth,
    });
  }

  // Current month days
  for (let d = 1; d <= daysInCurrentMonth; d++) {
    const dateStr = formatDateToISO(year, month, d);
    days.push({
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: true,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      year,
      month,
    });
  }

  // Next month leading days
  const totalCells = days.length > 35 ? 42 : 35;
  const remainingCells = totalCells - days.length;
  for (let d = 1; d <= remainingCells; d++) {
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    const dateStr = formatDateToISO(nextYear, nextMonth, d);
    days.push({
      dateString: dateStr,
      dayNumber: d,
      isCurrentMonth: false,
      isToday: dateStr === todayISO,
      isSelected: dateStr === selectedDate,
      year: nextYear,
      month: nextMonth,
    });
  }

  return days;
}
