import { useState, useCallback, useRef, useEffect } from 'react';
import type { CalendarData } from '../types.ts';
import { useAuth } from '../contexts/AuthContext.tsx';

export const useCalendarData = () => {
  const { currentUser } = useAuth();
  const [calendarData, setCalendarData] = useState<CalendarData>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const timeoutRef = useRef<number | null>(null);

  const getStorageKey = useCallback(() => {
    // Use user's email for a unique key, or 'guest' if not logged in.
    const userId = currentUser ? currentUser.email : 'guest';
    return `${userId}_calendarData`;
  }, [currentUser]);

  // Effect to reload data when the user logs in or out
  useEffect(() => {
    const CALENDAR_DATA_KEY = getStorageKey();
    try {
      const saved = localStorage.getItem(CALENDAR_DATA_KEY);
      setCalendarData(saved ? JSON.parse(saved) : {});
    } catch (error) {
      console.error("Error parsing calendar data from localStorage", error);
      setCalendarData({});
    }
  }, [currentUser, getStorageKey]);

  const updateDayData = useCallback((dayKey: string, part: 'morning' | 'evening', value: boolean) => {
    setCalendarData(prevData => {
      const CALENDAR_DATA_KEY = getStorageKey();
      const newData = { ...prevData };
      if (!newData[dayKey]) {
        newData[dayKey] = {};
      }
      const dayUpdate = { ...newData[dayKey], [part]: value };
      newData[dayKey] = dayUpdate;
      
      localStorage.setItem(CALENDAR_DATA_KEY, JSON.stringify(newData));
      
      // Update save status
      setSaveStatus('saved');
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = window.setTimeout(() => {
        setSaveStatus('idle');
      }, 2000);

      return newData;
    });
  }, [getStorageKey]);

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { calendarData, updateDayData, saveStatus };
};