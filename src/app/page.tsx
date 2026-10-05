'use client';

import { useState, useEffect } from 'react';
import WeeklyCalendar from '@/components/WeeklyCalendar';
import EventModal from '@/components/EventModal';
import { Event } from '@/types/calendar';
import { getNextWeek, getPreviousWeek, isDateInWeek } from '@/utils/dateUtils';

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [editingEvent, setEditingEvent] = useState<Event | undefined>();
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(() => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    return startOfWeek;
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendar-events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendar-events', JSON.stringify(events));
  }, [events]);

  const handleSaveEvent = (eventData: Omit<Event, 'id'>) => {
    if (editingEvent) {
      setEvents(events.map(event => 
        event.id === editingEvent.id 
          ? { ...eventData, id: editingEvent.id }
          : event
      ));
      setEditingEvent(undefined);
    } else {
      const newEvent: Event = {
        ...eventData,
        id: Date.now().toString()
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleCreateEvent = () => {
    setSelectedDate(new Date());
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handlePreviousWeek = () => {
    setCurrentWeekStart(getPreviousWeek(currentWeekStart));
  };

  const handleNextWeek = () => {
    setCurrentWeekStart(getNextWeek(currentWeekStart));
  };

  const handleToday = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    setCurrentWeekStart(startOfWeek);
  };

  const getEventsForCurrentWeek = () => {
    return events.filter(event => isDateInWeek(event.date, currentWeekStart));
  };

  const eventsThisWeek = getEventsForCurrentWeek();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            My Calendar
          </h1>
          <p className="text-gray-600 text-lg">
            Organize your schedule with style ✨
          </p>
        </div>

        <div className="mb-6 flex justify-between items-center animate-slideIn">
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500 bg-white/70 backdrop-blur-sm px-3 py-1 rounded-full">
              {eventsThisWeek.length} {eventsThisWeek.length === 1 ? 'event' : 'events'} this week
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousWeek}
                className="p-2 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 hover:scale-105"
                title="Previous Week"
              >
                ←
              </button>
              <button
                onClick={handleToday}
                className="px-3 py-1 text-sm rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 hover:scale-105"
                title="Go to Today"
              >
                Today
              </button>
              <button
                onClick={handleNextWeek}
                className="p-2 rounded-lg bg-white/70 backdrop-blur-sm hover:bg-white/90 transition-all duration-200 hover:scale-105"
                title="Next Week"
              >
                →
              </button>
            </div>
          </div>
          <button
            onClick={handleCreateEvent}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 hover:scale-105"
          >
            <span className="text-lg">+</span>
            New Event
          </button>
        </div>

        <WeeklyCalendar
          events={events}
          onEventClick={handleEventClick}
          onDayClick={handleDayClick}
          currentWeekStart={currentWeekStart}
        />

        <EventModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveEvent}
          selectedDate={selectedDate}
          editingEvent={editingEvent}
        />
      </div>
    </div>
  );
}
