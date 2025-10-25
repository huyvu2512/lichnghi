import React from 'react';
import WeatherWidget from './WeatherWidget.tsx';
import FootballSchedule from './FootballSchedule.tsx';
import HolidayCountdownWidget from './HolidayCountdownWidget.tsx';

const Sidebar: React.FC = () => {
  return (
    <aside className="lg:w-80 xl:w-96 flex-shrink-0 space-y-6">
      <WeatherWidget />
      <FootballSchedule />
      <HolidayCountdownWidget />
    </aside>
  );
};

export default Sidebar;