export interface DayData {
  morning?: boolean;
  evening?: boolean;
}

export interface CalendarData {
  [key: string]: DayData;
}

// Types for Football Schedule
export interface Competition {
  id: number;
  name: string;
  emblem: string;
}

export interface Team {
  id: number;
  name: string;
  shortName: string;
  crest: string;
}

export interface Match {
  id: number;
  competition: Competition;
  homeTeam: Team;
  awayTeam: Team;
  utcDate: string;
}

// Type for User
export interface User {
  name: string;
  email: string;
  picture: string;
}