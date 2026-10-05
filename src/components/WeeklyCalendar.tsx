'use client';

import { useState, useEffect } from 'react';
import { Event, WeekDay } from '@/types/calendar';
import { getWeekFromDate, formatTime } from '@/utils/dateUtils';

interface WeeklyCalendarProps {
  events: Event[];
  onEventClick: (event: Event) => void;
  onDayClick: (date: Date) => void;
  currentWeekStart: Date;
}

export default function WeeklyCalendar({ events, onEventClick, onDayClick, currentWeekStart }: WeeklyCalendarProps) {
  const [weekDays, setWeekDays] = useState<WeekDay[]>([]);

  useEffect(() => {
    const week = getWeekFromDate(currentWeekStart);
    
    // Group events by date //
    const eventsByDate: { [key: string]: Event[] } = {};
    events.forEach(event => {
      if (!eventsByDate[event.date]) {
        eventsByDate[event.date] = [];
      }
      eventsByDate[event.date].push(event);
    });

    // Add events to respective days
    const weekWithEvents = week.map(day => {
      const dateStr = day.date.toISOString().split('T')[0];
      return {
        ...day,
        events: eventsByDate[dateStr] || []
      };
    });

    setWeekDays(weekWithEvents);
  }, [events, currentWeekStart]);

  const getEventColor = (color?: string) => {
    const colors = {
      blue: 'bg-blue-100 border-blue-300 text-blue-800',
      green: 'bg-green-100 border-green-300 text-green-800',
      purple: 'bg-purple-100 border-purple-300 text-purple-800',
      pink: 'bg-pink-100 border-pink-300 text-pink-800',
      orange: 'bg-orange-100 border-orange-300 text-orange-800',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover-scale animate-fadeIn">
      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold">This Week</h2>
        <p className="text-blue-100 mt-1 text-sm sm:text-base">
          {weekDays[0]?.date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric' 
          })} - {weekDays[6]?.date.toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
          })}
        </p>
      </div>

      {/* Mobile Layout - Unified Scroll */}
      <div className="sm:hidden overflow-x-auto">
        <div className="flex min-w-[840px]">
          {weekDays.map((day, index) => (
            <div key={index} className="flex-1 border-r border-gray-200 last:border-r-0">
              {/* Day Header */}
              <div className="text-center p-3 border-b border-gray-200 bg-gray-50">
                <div className="text-xs font-medium text-gray-500 mb-1">{day.dayName}</div>
                <div className={`text-sm font-semibold transition-all duration-200 ${
                  day.isToday 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-6 h-6 flex items-center justify-center mx-auto shadow-lg text-xs' 
                    : 'text-gray-900 hover:text-blue-600'
                }`}>
                  {day.dayNumber}
                </div>
              </div>
              
              {/* Day Content */}
              <div 
                className="p-2 cursor-pointer hover:bg-gradient-to-b hover:from-blue-50 hover:to-purple-50 transition-all duration-200 min-h-[300px]"
                onClick={() => onDayClick(day.date)}
              >
                <div className="space-y-1">
                  {day.events.map((event, eventIndex) => (
                    <div
                      key={eventIndex}
                      className={`text-xs p-2 rounded-lg border cursor-pointer hover:shadow-lg transition-all duration-200 animate-slideIn ${getEventColor(event.color)}`}
                      style={{ animationDelay: `${eventIndex * 0.1}s` }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      <div className="text-xs opacity-75">{formatTime(event.time)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Layout - Grid */}
      <div className="hidden sm:block">
        <div className="grid grid-cols-7 gap-0 border-b border-gray-200 bg-gray-50">
          {weekDays.map((day, index) => (
            <div key={index} className="text-center p-3 border-r border-gray-200 last:border-r-0">
              <div className="text-sm font-medium text-gray-500 mb-1">{day.dayName}</div>
              <div className={`text-lg font-semibold transition-all duration-200 ${
                day.isToday 
                  ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto shadow-lg' 
                  : 'text-gray-900 hover:text-blue-600'
              }`}>
                {day.dayNumber}
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0 min-h-[400px]">
          {weekDays.map((day, index) => (
            <div 
              key={index} 
              className="border-r border-gray-200 last:border-r-0 p-2 cursor-pointer hover:bg-gradient-to-b hover:from-blue-50 hover:to-purple-50 transition-all duration-200"
              onClick={() => onDayClick(day.date)}
            >
              <div className="space-y-1">
                {day.events.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    className={`text-xs p-2 rounded-lg border cursor-pointer hover:shadow-lg hover:scale-105 transition-all duration-200 animate-slideIn ${getEventColor(event.color)}`}
                    style={{ animationDelay: `${eventIndex * 0.1}s` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                  >
                    <div className="font-medium truncate">{event.title}</div>
                    <div className="text-xs opacity-75">{formatTime(event.time)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}