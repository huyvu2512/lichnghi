import React, { useState, useEffect } from 'react';

interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// SVG component for Peach Blossom decoration
const PeachBlossomIcon = () => (
    <svg width="90" height="90" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute top-0 right-0 text-pink-400/60 opacity-70 -mr-5 -mt-3 transform rotate-12">
      <path d="M 60 80 Q 40 40 70 10" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <circle cx="70" cy="10" r="7" fill="#fecdd3" stroke="currentColor" strokeWidth="1"/>
      <circle cx="55" cy="30" r="9" fill="#f9a8d4" stroke="currentColor" strokeWidth="1"/>
      <circle cx="80" cy="35" r="6" fill="#fbcfe8" stroke="currentColor" strokeWidth="1"/>
      <circle cx="45" cy="55" r="8" fill="#f9a8d4" stroke="currentColor" strokeWidth="1"/>
    </svg>
);

// SVG component for Tet Lantern decoration
const LanternIcon = () => (
    <svg width="60" height="60" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="absolute bottom-0 left-0 text-red-400/50 opacity-80 -ml-1 -mb-2 transform -rotate-15">
      <ellipse cx="50" cy="50" rx="28" ry="38" fill="#fca5a5" stroke="currentColor" strokeWidth="1"/>
      <rect x="42" y="10" width="16" height="10" fill="#fcd34d"/>
      <rect x="42" y="80" width="16" height="10" fill="#fcd34d"/>
      <path d="M 46 82 L 42 93 M 54 82 L 58 93" stroke="#fcd34d" strokeWidth="2"/>
    </svg>
);


const HolidayCountdownWidget: React.FC = () => {
    const [countdown, setCountdown] = useState<Countdown | null>(null);
    const [targetDate, setTargetDate] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Initial fetch to get the target date
    useEffect(() => {
        const fetchTargetDate = async () => {
            try {
                const response = await fetch('https://open.oapi.vn/holiday/tet/countdown');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const result = await response.json();
                if (result.code === 'success' && result.data && result.data.date) {
                    const parsedDate = new Date(result.data.date);
                    if (isNaN(parsedDate.getTime())) {
                        throw new Error('Invalid date format from API');
                    }
                    setTargetDate(result.data.date);
                } else {
                    throw new Error('Invalid API response');
                }
            } catch (err) {
                setError('Không thể tải dữ liệu ngày lễ.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchTargetDate();
    }, []);

    // 2. Timer logic that recalculates based on the target date
    useEffect(() => {
        if (!targetDate) return;

        const calculateCountdown = () => {
            const targetTime = new Date(targetDate).getTime();
            const now = new Date().getTime();
            const difference = targetTime - now;

            if (difference <= 0) {
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return false; // Signal to stop interval
            }

            setCountdown({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000)
            });
            return true; // Signal to continue
        };
        
        // Run once immediately to prevent flash of empty content
        calculateCountdown();

        const interval = setInterval(() => {
            if (!calculateCountdown()) {
                clearInterval(interval);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    const formatTime = (time: number) => time.toString().padStart(2, '0');

    const TimeBlock = ({ value, label }: { value: string, label: string }) => (
        <div className="flex flex-col w-16 text-center">
            <span className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent leading-none">
                {value}
            </span>
            <span className="text-xs text-gray-500 uppercase tracking-wider mt-1">{label}</span>
        </div>
    );

    const renderContent = () => {
        if (loading) {
            return <div className="text-center text-gray-500 h-24 flex items-center justify-center">Đang tải...</div>;
        }
        if (error) {
            return <div className="text-center text-red-500 h-24 flex items-center justify-center">{error}</div>;
        }
        if (countdown) {
            if (countdown.days <= 0 && countdown.hours <=0 && countdown.minutes <= 0 && countdown.seconds <= 0) {
                return (
                    <div className="flex flex-col items-center justify-center h-24">
                        <h4 className="text-2xl font-bold text-green-600">Chúc Mừng Năm Mới!</h4>
                        <p className="text-gray-500">Xuân Giáp Thìn 2025</p>
                    </div>
                );
            }
            return (
                <div className="flex justify-center items-start space-x-2 sm:space-x-4 pt-2">
                    <TimeBlock value={countdown.days.toString()} label="Ngày" />
                    <TimeBlock value={formatTime(countdown.hours)} label="Giờ" />
                    <TimeBlock value={formatTime(countdown.minutes)} label="Phút" />
                    <TimeBlock value={formatTime(countdown.seconds)} label="Giây" />
                </div>
            );
        }
        return <div className="text-center text-gray-500 h-24 flex items-center justify-center">Đang tính toán...</div>;
    };

    return (
        <div className="p-0.5 rounded-xl shadow-md bg-gradient-to-br from-pink-400 via-red-400 to-amber-400">
            <div className="bg-white p-5 rounded-[10px] relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <PeachBlossomIcon />
                    <LanternIcon />
                </div>
                <div className="relative z-10">
                    <h3 className="font-bold text-lg text-gray-700 mb-4 text-center">Đếm ngược Tết Nguyên Đán</h3>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default HolidayCountdownWidget;