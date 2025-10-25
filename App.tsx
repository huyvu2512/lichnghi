import React, { useState, useCallback } from 'react';
import CalendarHeader from './components/CalendarHeader';
import CalendarGrid from './components/CalendarGrid';
import Sidebar from './components/Sidebar';
import ScrollToTopButton from './components/ScrollToTopButton';
import { useCalendarData } from './hooks/useCalendarData';

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const { calendarData, updateDayData, saveStatus } = useCalendarData();

  const handleChangeMonth = useCallback((direction: number) => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  }, []);

  const handleGoToToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <header className="text-center mb-8 flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                <svg className="w-8 h-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h18M-4.5 12h22.5" />
                </svg>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold">
                <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Lịch Nghỉ -{' '}
                </span>
                <a 
                  href="https://beacons.ai/huyvu2512" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 text-purple-600 hover:text-amber-500"
                >
                  Huy Vũ
                </a>
            </h1>
        </header>

        <main className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <CalendarHeader 
              currentDate={currentDate}
              onChangeMonth={handleChangeMonth}
              onGoToToday={handleGoToToday}
              saveStatus={saveStatus}
            />
            <CalendarGrid 
              currentDate={currentDate}
              calendarData={calendarData}
              onUpdateDay={updateDayData}
            />
          </div>
          <Sidebar />
        </main>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default App;