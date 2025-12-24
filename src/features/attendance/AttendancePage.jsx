import React, { useState } from 'react';
import { Search, Clock, MapPin, Home, Calendar, Filter } from 'lucide-react';

// Mock Data: "checkout" is null if they are still working
const MOCK_ATTENDANCE = [
  { id: 1, name: "Alice Johnson", date: "2023-10-27", login: "09:00 AM", checkout: "06:00 PM", status: "Present", mode: "WFO", department: "Engineering" },
  { id: 2, name: "Bob Smith",     date: "2023-10-27", login: "09:15 AM", checkout: null,       status: "Active",  mode: "WFH", department: "Design" },
  { id: 3, name: "Charlie Davis", date: "2023-10-27", login: null,       checkout: null,       status: "Absent",  mode: "-",   department: "Marketing" },
  { id: 4, name: "Diana Prince",  date: "2023-10-27", login: "08:45 AM", checkout: "05:45 PM", status: "Present", mode: "WFO", department: "HR" },
  { id: 5, name: "Evan Wright",   date: "2023-10-27", login: "10:00 AM", checkout: null,       status: "Active",  mode: "WFO", department: "Engineering" },
  { id: 6, name: "Fiona Gallagher", date: "2023-10-27", login: "09:30 AM", checkout: "06:30 PM", status: "Present", mode: "WFH", department: "Sales" },
];

const AttendancePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState('All'); // All, WFO, WFH, Absent

  // --- Filtering Logic ---
  const filteredData = MOCK_ATTENDANCE.filter(record => {
    const matchesSearch = record.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterMode === 'All' 
      ? true 
      : filterMode === 'Absent' 
        ? record.status === 'Absent'
        : record.mode === filterMode;

    return matchesSearch && matchesFilter;
  });

  // --- Styles ---
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', overflow: 'hidden' };
  const badgeStyle = (type) => {
    const colors = {
      WFO: { bg: 'rgba(59, 130, 246, 0.2)', text: '#60a5fa' }, // Blue
      WFH: { bg: 'rgba(168, 85, 247, 0.2)', text: '#c084fc' }, // Purple
      Present: { bg: 'rgba(16, 185, 129, 0.2)', text: '#34d399' }, // Green
      Active:  { bg: 'rgba(234, 179, 8, 0.2)',  text: '#facc15' }, // Yellow
      Absent:  { bg: 'rgba(239, 68, 68, 0.2)',  text: '#f87171' }, // Red
      '-':     { bg: 'rgba(148, 163, 184, 0.1)', text: '#94a3b8' } // Grey
    };
    const style = colors[type] || colors['-'];
    return {
      padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
      backgroundColor: style.bg, color: style.text, display: 'inline-flex', alignItems: 'center', gap: '5px'
    };
  };

  return (
    <div style={{ padding: '20px', color: '#fff', minHeight: '100%' }}>
      
      {/* --- Page Header --- */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Calendar size={28} color="#3b82f6" /> Daily Attendance
        </h1>
        <p style={{ color: '#94a3b8', marginTop: '5px' }}>
          Real-time tracking of employee check-ins and work modes for {new Date().toLocaleDateString()}.
        </p>
      </div>

      {/* --- Controls Bar --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        
        {/* Search */}
        <div style={{ position: 'relative', width: '300px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }} />
          <input 
            type="text" 
            placeholder="Search employee..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', padding: '10px 10px 10px 40px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
          />
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: '10px', backgroundColor: '#1e293b', padding: '5px', borderRadius: '8px', border: '1px solid #334155' }}>
          {['All', 'WFO', 'WFH', 'Absent'].map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                backgroundColor: filterMode === mode ? '#3b82f6' : 'transparent',
                color: filterMode === mode ? '#fff' : '#94a3b8',
                transition: 'all 0.2s'
              }}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* --- Attendance Table --- */}
      <div style={cardStyle}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead style={{ backgroundColor: '#0f172a', borderBottom: '1px solid #334155' }}>
            <tr>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Employee</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Login Time</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Logout Time</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Work Mode</th>
              <th style={{ padding: '16px', color: '#94a3b8', fontWeight: '600' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <tr key={row.id} style={{ borderBottom: '1px solid #334155' }}>
                  
                  {/* Name Column */}
                  <td style={{ padding: '16px' }}>
                    <div style={{ fontWeight: '500' }}>{row.name}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{row.department}</div>
                  </td>

                  {/* Login Time */}
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: row.login ? '#e2e8f0' : '#64748b' }}>
                    {row.login || '-'}
                  </td>

                  {/* Logout Time */}
                  <td style={{ padding: '16px', fontFamily: 'monospace', color: row.checkout ? '#e2e8f0' : '#64748b' }}>
                    {row.checkout || '-'}
                  </td>

                  {/* Work Mode Badge */}
                  <td style={{ padding: '16px' }}>
                    <span style={badgeStyle(row.mode)}>
                      {row.mode === 'WFO' && <MapPin size={12} />}
                      {row.mode === 'WFH' && <Home size={12} />}
                      {row.mode}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '16px' }}>
                    <span style={badgeStyle(row.status)}>
                      {row.status === 'Active' && <Clock size={12} />}
                      {row.status}
                    </span>
                  </td>

                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>
                  No attendance records found for this filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AttendancePage;