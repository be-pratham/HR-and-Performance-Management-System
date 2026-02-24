import React from 'react';
import { Sun } from 'lucide-react';

const DatePill = ({ date }) => {
  const displayDate = date || new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="header-date-pill">
      <Sun size={18} className="sun-icon" />
      <span>{displayDate}</span>
    </div>
  );
};

export default DatePill;