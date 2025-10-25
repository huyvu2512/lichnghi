import React from 'react';
import RealTimeClock from './RealTimeClock';

interface CalendarHeaderProps {
  currentDate: Date;
  onChangeMonth: (direction: number) => void;
  onGoToToday: () => void;
  saveStatus: 'idle' | 'saved';
}

const CalendarHeader: React.FC<CalendarHeaderProps> = ({ currentDate, onChangeMonth, onGoToToday, saveStatus }) => {
  const monthName = `Tháng ${currentDate.getMonth() + 1}`;
  const year = currentDate.getFullYear();
  
  const today = new Date();
  const todayFormatted = `Hôm nay, ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-3 sm:mb-4 px-2">
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onChangeMonth(-1)} 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Tháng trước"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-40 text-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 capitalize leading-tight">
            {monthName}
          </h2>
          <p className="text-base sm:text-lg text-gray-500 font-medium">
            {year}
          </p>
        </div>
        <button 
          onClick={() => onChangeMonth(1)} 
          className="p-2 rounded-full text-gray-500 hover:bg-gray-200/60 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Tháng sau"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>
      
      <div className="flex items-center space-x-4 mt-3 sm:mt-0">
         <div className="relative w-20 h-5">
            <span className={`absolute inset-0 text-sm text-green-600 font-medium transition-all duration-500 ease-out ${saveStatus === 'saved' ? 'opacity-100 transform-none' : 'opacity-0 -translate-y-2'}`}>
              Đã lưu!
            </span>
        </div>
        <button 
          onClick={onGoToToday} 
          className="flex items-center space-x-3 px-4 py-2 bg-indigo-50/70 rounded-lg hover:bg-indigo-100 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <svg className="w-5 h-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
          </svg>
          <div className="flex flex-col items-start leading-tight">
             <span className="text-sm font-semibold text-indigo-800">{todayFormatted}</span>
             <RealTimeClock />
          </div>
        </button>
      </div>
    </div>
  );
};

export default CalendarHeader;