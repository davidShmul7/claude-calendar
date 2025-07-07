export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description?: string;
  color?: string;
}

export interface WeekDay {
  date: Date;
  dayName: string;
  dayNumber: number;
  isToday: boolean;
  events: Event[];
}