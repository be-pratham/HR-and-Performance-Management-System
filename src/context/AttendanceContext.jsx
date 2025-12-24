import React, { createContext, useContext, useState, useEffect } from 'react';

const AttendanceContext = createContext();

export const useAttendance = () => useContext(AttendanceContext);

export const AttendanceProvider = ({ children }) => {
  // 1. Initialize State from LocalStorage (or use dummy data for demo)
  const [records, setRecords] = useState(() => {
    const saved = localStorage.getItem('attendanceRecords');
    return saved ? JSON.parse(saved) : [
      // Dummy data so Admin sees something immediately
      { id: 1, userId: 101, name: "Pratham Bhardwaj", date: new Date().toLocaleDateString(), checkIn: "09:00 AM", checkOut: "06:00 PM", status: "Present" },
      { id: 2, userId: 102, name: "John Cena", date: new Date().toLocaleDateString(), checkIn: "09:15 AM", checkOut: null, status: "Active" }
    ];
  });

  // 2. Sync with LocalStorage whenever records change
  useEffect(() => {
    localStorage.setItem('attendanceRecords', JSON.stringify(records));
  }, [records]);

  // 3. Main Action: Toggle Attendance (Clock In / Clock Out)
  const markAttendance = (user) => {
    const today = new Date().toLocaleDateString();
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setRecords(prevRecords => {
      // Find if this user already has a record for TODAY
      const existingRecordIndex = prevRecords.findIndex(r => r.userId === user.id && r.date === today);

      if (existingRecordIndex > -1) {
        const currentRecord = prevRecords[existingRecordIndex];
        // Clock out logic
        if (!currentRecord.checkOut) {
          const updatedRecords = [...prevRecords];
          updatedRecords[existingRecordIndex] = {
            ...currentRecord,
            checkOut: now,
            status: "Present" // Shift completed
          };
          return updatedRecords;
        }
        // If already checked out, do nothing (or add logic for multiple shifts if needed)
        return prevRecords;
      } else {
        // No record for today -> Create 'Clock In' record
        const newRecord = {
          id: Date.now(),
          userId: user.id,
          name: user.name || "Employee",
          role: user.role || "Staff",
          date: today,
          checkIn: now,
          checkOut: null,
          status: "Active" // Currently working
        };
        // Add new record to the top of the list
        return [newRecord, ...prevRecords];
      }
    });
  };

  // 4. Helper: Check if specific user is currently clocked in today
  const isClockedIn = (userId) => {
    const today = new Date().toLocaleDateString();
    const record = records.find(r => r.userId === userId && r.date === today);
    // Returns true if record exists AND checkOut is still null
    return record && !record.checkOut;
  };

  // 5. Helper: Get text status for UI (e.g., "Clocked In at 9:00 AM" or "Not Started")
  const getTodayStatus = (userId) => {
    const today = new Date().toLocaleDateString();
    const record = records.find(r => r.userId === userId && r.date === today);
    
    if (!record) return "Not Started";
    if (!record.checkOut) return `Clocked In at ${record.checkIn}`;
    return "Completed";
  };

  return (
    <AttendanceContext.Provider value={{ records, markAttendance, isClockedIn, getTodayStatus }}>
      {children}
    </AttendanceContext.Provider>
  );
};