import React from 'react';

interface TimeSlotProps {
  label: string;
  isChecked: boolean;
  onUpdate: () => void;
  color: 'amber' | 'indigo';
}

const TimeSlot: React.FC<TimeSlotProps> = ({ label, isChecked, onUpdate, color }) => {
  const colorClasses = {
    amber: {
      bg: 'bg-amber-400',
      text: 'text-amber-800',
      ring: 'ring-amber-300',
    },
    indigo: {
      bg: 'bg-indigo-500',
      text: 'text-white',
      ring: 'ring-indigo-300',
    }
  };
  
  const baseClasses = "w-full text-center p-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all duration-200 focus:outline-none focus:ring-2";
  const selectedClasses = isChecked ? `${colorClasses[color].bg} ${colorClasses[color].text} shadow-sm` : 'bg-gray-100/80 text-gray-600 hover:bg-gray-200/70';

  return (
    <button 
      onClick={onUpdate} 
      className={`${baseClasses} ${selectedClasses} focus:${colorClasses[color].ring}`}
      aria-pressed={isChecked}
    >
      <span>{label}</span>
    </button>
  );
};

export default TimeSlot;
