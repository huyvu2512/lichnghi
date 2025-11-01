import React from 'react';
import WeatherWidget from './WeatherWidget.tsx';
import FootballSchedule from './FootballSchedule.tsx';
import HolidayCountdownWidget from './HolidayCountdownWidget.tsx';
import BirthdayWidget from './BirthdayWidget.tsx';

const Sidebar: React.FC = () => {
  return (
    <aside className="lg:w-80 xl:w-96 flex-shrink-0 space-y-4">
      <HolidayCountdownWidget />
      <BirthdayWidget />
      <WeatherWidget />
      <FootballSchedule />
    </aside>
  );
};

export default Sidebar;