import React, { useState, useEffect } from 'react';
import { Timer, LogOut, Clock } from 'lucide-react';
import { Button } from '@mui/material';
import { useAttendance } from '../../../context/AttendanceContext';

const AttendancePill = ({ user }) => {
  const { markAttendance, isClockedIn } = useAttendance();
  const isWorking = isClockedIn(user?.id);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isWorking) {
      interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const formatTime = (s) => {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  };

  return (
    <div className={`attendance-pill ${isWorking ? 'active' : ''}`}>
      {isWorking && (
        <div className="timer-display">
          <Timer size={16} className="timer-icon spinning" />
          <span>{formatTime(elapsedTime)}</span>
        </div>
      )}
      <Button 
        variant="contained" size="small"
        onClick={() => markAttendance(user)}
        color={isWorking ? "error" : "success"}
        startIcon={isWorking ? <LogOut size={16}/> : <Clock size={16}/>}
      >
        {isWorking ? "Clock Out" : "Mark Attendance"}
      </Button>
    </div>
  );
};

export default AttendancePill;