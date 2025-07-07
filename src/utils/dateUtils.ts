import { WeekDay } from '@/types/calendar';

export function getCurrentWeek(): WeekDay[] {
  return getWeekFromDate(new Date());
}

export function getWeekFromDate(referenceDate: Date): WeekDay[] {
  const today = new Date();
  const startOfWeek = new Date(referenceDate);
  startOfWeek.setDate(referenceDate.getDate() - referenceDate.getDay());

  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    week.push({
      date,
      dayName: dayNames[date.getDay()],
      dayNumber: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
      events: []
    });
  }

  return week;
}

export function getNextWeek(currentWeekStart: Date): Date {
  const nextWeek = new Date(currentWeekStart);
  nextWeek.setDate(currentWeekStart.getDate() + 7);
  return nextWeek;
}

export function getPreviousWeek(currentWeekStart: Date): Date {
  const previousWeek = new Date(currentWeekStart);
  previousWeek.setDate(currentWeekStart.getDate() - 7);
  return previousWeek;
}

export function getWeekDateRange(weekStart: Date): { start: Date, end: Date } {
  const start = new Date(weekStart);
  const end = new Date(weekStart);
  end.setDate(weekStart.getDate() + 6);
  return { start, end };
}

export function isDateInWeek(date: string, weekStart: Date): boolean {
  const eventDate = new Date(date);
  const { start, end } = getWeekDateRange(weekStart);
  return eventDate >= start && eventDate <= end;
}

export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}