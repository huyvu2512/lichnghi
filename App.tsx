import React, { useState, useCallback } from 'react';
import CalendarHeader from './components/CalendarHeader.tsx';
import CalendarGrid from './components/CalendarGrid.tsx';
import Sidebar from './components/Sidebar.tsx';
import ScrollToTopButton from './components/ScrollToTopButton.tsx';
import { useCalendarData } from './hooks/useCalendarData.ts';
import Logo from './components/Logo.tsx';
import Footer from './components/Footer.tsx';

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
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex-grow">
        <header className="text-center mb-8 flex items-center justify-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-lg shadow-md flex items-center justify-center">
                <Logo className="w-8 h-8 text-indigo-600" />
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
      <Footer />
    </div>
  );
}

export default App;