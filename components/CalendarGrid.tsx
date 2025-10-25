import React from 'react';
import DayCell from './DayCell';
import type { CalendarData, DayData } from '../types';

interface CalendarGridProps {
  currentDate: Date;
  calendarData: CalendarData;
  // FIX: Corrected the type of 'value' from 'string | boolean' to 'boolean' to match the implementation.
  onUpdateDay: (dayKey: string, part: keyof DayData, value: boolean) => void;
}

const CalendarGrid: React.FC<CalendarGridProps> = ({ currentDate, calendarData, onUpdateDay }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // (0=Sun, 1=Mon, ...). We want Monday to be the first day.
  const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

  const blanks = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    blanks.push(<div key={`blank-${i}`} className="border-r border-b border-gray-200/80 bg-gray-50/50"></div>);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize today's date to midnight for accurate comparison

  const days = [];
  for (let day = 1; day <= daysInMonth; day++) {
    const dayKey = `${year}-${month + 1}-${day}`;
    const dayData = calendarData[dayKey] || {};
    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0); // Normalize for comparison

    const isToday = date.getTime() === today.getTime();
    const isPast = date.getTime() < today.getTime();
    
    days.push(
      <DayCell 
        key={dayKey}
        day={day}
        dayKey={dayKey}
        dayData={dayData}
        onUpdateDay={onUpdateDay}
        isToday={isToday}
        isPast={isPast}
      />
    );
  }

  return (
    <div className="grid grid-cols-7 border-t border-l border-gray-200/80 rounded-lg overflow-hidden">
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-semibold text-xs sm:text-sm text-gray-500 py-1.5 border-r border-b border-gray-200/80 bg-gray-50/50">
          {day}
        </div>
      ))}
      {blanks}
      {days}
    </div>
  );
};

export default CalendarGrid;
