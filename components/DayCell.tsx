import React from 'react';
import TimeSlot from './TimeSlot.tsx';
import type { DayData } from '../types.ts';

interface DayCellProps {
  day: number;
  dayKey: string;
  dayData: DayData;
  onUpdateDay: (dayKey: string, part: 'morning' | 'evening', value: boolean) => void;
  isToday: boolean;
  isPast: boolean;
}

const DayCell: React.FC<DayCellProps> = ({ day, dayKey, dayData, onUpdateDay, isToday, isPast }) => {
  const cellClasses = [
    "relative border-r border-b border-gray-200/80 p-1.5 min-h-[92px] flex flex-col group transition-colors duration-200",
    isPast ? "bg-gray-50/60 text-gray-400 pointer-events-none opacity-70" : "bg-white hover:bg-indigo-50/50",
  ].join(' ');

  const dayNumberClasses = [
    "absolute top-1.5 right-1.5 text-xs sm:text-sm font-semibold flex items-center justify-center transition-all duration-200",
    isToday ? 'bg-indigo-600 text-white rounded-full h-6 w-6' : 'text-gray-500 group-hover:text-indigo-600',
    isPast ? '!text-gray-400' : ''
  ].join(' ');
  
  return (
    <div className={cellClasses}>
      <span className={dayNumberClasses}>
        {day}
      </span>
      <div className="flex flex-col justify-end flex-grow mt-5 space-y-1">
        <TimeSlot 
          label="Sáng - Trưa"
          isChecked={dayData.morning || false}
          onUpdate={() => onUpdateDay(dayKey, 'morning', !dayData.morning)}
          color="amber"
        />
        <TimeSlot 
          label="Chiều - Tối"
          isChecked={dayData.evening || false}
          onUpdate={() => onUpdateDay(dayKey, 'evening', !dayData.evening)}
          color="indigo"
        />
      </div>
    </div>
  );
};

export default DayCell;