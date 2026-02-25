import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, BookOpen, Check, FileText, Bell, X, User, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import DashboardHeader from '../components/DashboardHeader';
import DatePill from '../components/DatePill';
import StatCard from '../components/Statcard';
import SurfaceCard from '../components/SurfaceCard';
import AttendancePill from '../components/AttendancePill'

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const stats = [
    { id: 1, label: "Pending Reviews", value: "3", icon: FileText, color: "blue" },
    { id: 2, label: "Learning Completed", value: "12 hrs", icon: BookOpen, color: "purple" },
    { id: 3, label: "Leave Remaining", value: "8 Days", icon: Calendar, color: "orange" }
  ];

  const dashboardAnnouncements = [
    { id: 101, title: "Q4 Town Hall Meeting", day: "15", month: "DEC", content: "Join us for the quarterly all-hands meeting..." },
    { id: 102, title: "Office Holiday Party", day: "20", month: "DEC", content: "Don't forget to RSVP for the annual holiday gathering..." },
  ];

  const [tasks, setTasks] = useState([
    { id: 1, text: "Review Pull Request #402", time: "10:00 AM", completed: true },
    { id: 2, text: "Team Sync with Design", time: "11:30 AM", completed: false },
  ]);

  const [announcementPage, setAnnouncementPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); 
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  const currentAnnouncements = dashboardAnnouncements.slice((announcementPage - 1) * 2, announcementPage * 2);

  const handleTaskClick = (task) => {
    if (task.completed) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: false } : t));
    } else {
      setActiveTask(task); setIsModalOpen(true);
    }
  };

  return (
    <div className="dashboard-container">
      
      <DashboardHeader 
        title={`Good morning, ${user?.name.split(' ')[0] || 'Employee'}`}
        subtitle="Here is what's happening today"
        rightContent={
          <>
            <AttendancePill user={user} />
            <DatePill />
          </>
        }
      />

      <div className="stats-grid">
        {stats.map((stat) => <StatCard key={stat.id} {...stat} />)}
      </div>

      <div className="dashboard-split-layout">
        
        {/* Left Column: Announcements */}
        <SurfaceCard 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    Company Announcements <Bell size={20} color="var(--text-secondary)" />
                </div>
            }
            headerAction={
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setAnnouncementPage(p => Math.max(p - 1, 1))} disabled={announcementPage === 1}><ChevronLeft size={20} /></button>
                    <button onClick={() => setAnnouncementPage(p => Math.min(p + 1, 2))} disabled={announcementPage === 2}><ChevronRight size={20} /></button>
                </div>
            }
        >
          <div className="announcement-list">
            {currentAnnouncements.map((item) => (
              <div key={item.id} className="announcement-item" onClick={() => navigate(`/announcements/${item.id}`)} style={{ cursor: 'pointer' }}>
                  <div className="announce-date-box"><span className="day">{item.day}</span><span className="month">{item.month}</span></div>
                  <div className="announce-content"><h4>{item.title}</h4><p>{item.content}</p></div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Right Column: My Day */}
        <SurfaceCard 
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'space-between', width: '100%' }}>
                    <h3>My Day</h3><Clock size={20} color="var(--text-secondary)" />
                </div>
            }>
          <div className="task-list">
            {tasks.map(task => (
                <div key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`} onClick={() => handleTaskClick(task)}>
                    <div className="task-checkbox">{task.completed && <Check size={14} color="white" strokeWidth={3} />}</div>
                    <span className="task-text">{task.text}</span>
                    <span className="task-time">{task.time}</span>
                </div>
            ))}
          </div>
          <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => setIsModalOpen(true)}>Submit New Item</Button>
        </SurfaceCard>
      </div>
    </div>
  );
};
export default EmployeeDashboard;