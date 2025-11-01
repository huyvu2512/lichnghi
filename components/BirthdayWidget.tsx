import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext.tsx';
import type { GooglePerson } from '../types.ts';

interface ProcessedPerson extends GooglePerson {
  sortDate: Date;
  displayName: string;
  birthdayString: string;
}

const BirthdayWidget: React.FC = () => {
  const { accessToken } = useAuth();
  const [birthdays, setBirthdays] = useState<ProcessedPerson[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!accessToken) {
      setBirthdays([]);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchBirthdays = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          'https://people.googleapis.com/v1/people/me/connections?personFields=names,birthdays&pageSize=1000',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
           if (response.status === 401 || response.status === 403) {
            setError("Hết hạn, vui lòng đăng nhập lại.");
          } else {
            throw new Error(`Lỗi API: ${response.statusText}`);
          }
          return;
        }
        const data = await response.json();
        const connections: GooglePerson[] = data.connections || [];
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const currentYear = today.getFullYear();

        const upcoming = connections
          .filter(p => 
            p.birthdays && 
            p.birthdays.length > 0 && 
            p.birthdays.some(b => b.date && b.date.month && b.date.day) &&
            p.names &&
            p.names.length > 0 &&
            p.names[0].displayName
          )
          .map(p => {
            const birthday = p.birthdays.find(b => b.date && b.date.month && b.date.day)!.date;
            const { month, day } = birthday;
            
            // Create birthday date for this year and next year to handle comparison correctly
            let birthdayThisYear = new Date(currentYear, month - 1, day);
            
            // If the birthday has passed this year, use next year's date for sorting
            const sortDate = birthdayThisYear < today ? new Date(currentYear + 1, month - 1, day) : birthdayThisYear;

            return {
              ...p,
              sortDate,
              displayName: p.names[0].displayName,
              birthdayString: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`
            };
          })
          .sort((a, b) => a.sortDate.getTime() - b.sortDate.getTime());
        
        setBirthdays(upcoming);

      } catch (err) {
        setError('Không thể tải sinh nhật.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBirthdays();
  }, [accessToken]);
  
  if (!accessToken) {
    return null;
  }
  
  const CakeIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v1a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
      <path fillRule="evenodd" d="M2 10a2 2 0 012-2h12a2 2 0 012 2v5a2 2 0 01-2 2H4a2 2 0 01-2-2v-5zm3 2a1 1 0 011-1h6a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
      <path d="M6 3a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm3.01 0a1 1 0 011-1h.01a1 1 0 110 2h-.01a1 1 0 01-1-1zM11 3a1 1 0 011-1h.01a1 1 0 110 2h-.01a1 1 0 01-1-1z" />
    </svg>
  );

  const renderContent = () => {
    if (loading) {
      return <div className="text-center text-gray-500 py-4">Đang tải danh sách...</div>;
    }
    if (error) {
      return <div className="text-center text-red-500 py-4">{error}</div>;
    }
    if (birthdays.length === 0) {
      return <div className="text-center text-gray-500 py-4">Không tìm thấy sinh nhật nào sắp tới.</div>;
    }
    return (
      <ul className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {birthdays.map(person => (
          <li key={person.resourceName} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <CakeIcon />
              <span className="font-semibold text-sm text-gray-800">{person.displayName}</span>
            </div>
            <span className="text-sm font-medium text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded-full">{person.birthdayString}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="font-bold text-lg text-gray-700 mb-3">Sinh nhật sắp tới</h3>
      {renderContent()}
    </div>
  );
};

export default BirthdayWidget;
