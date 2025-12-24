import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sun, Calendar, Clock, BookOpen, Check, FileText, Bell, X, User, 
  ChevronDown, LogOut, Timer, ChevronLeft, ChevronRight // Added Chevron icons
} from 'lucide-react';
import { Button, Snackbar, Alert } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import { useAttendance } from '../../../context/AttendanceContext'; 
import './DashboardStyles.css';

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { markAttendance, isClockedIn } = useAttendance(); 
  
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric' 
  });

  // --- Attendance Timer Logic ---
  const isWorking = isClockedIn(user.id);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval;
    if (isWorking) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    } else {
      setElapsedTime(0);
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  // --- Mock Data ---

  const stats = [
    { id: 1, label: "Pending Reviews", value: "3", icon: FileText, color: "blue" },
    { id: 2, label: "Learning Completed", value: "12 hrs", icon: BookOpen, color: "purple" },
    { id: 3, label: "Leave Remaining", value: "8 Days", icon: Calendar, color: "orange" }
  ];

  const dashboardAnnouncements = [
    { 
      id: 101, 
      title: "Q4 Town Hall Meeting", 
      category: "Events", 
      date: "2025-12-15", 
      author: "Management", 
      day: "15", month: "DEC",
      priority: "High",
      content: "Join us for the quarterly all-hands meeting. We will discuss Q4 results, celebrate wins, and outline the roadmap for the upcoming year." 
    },
    { 
      id: 102, 
      title: "Office Holiday Party", 
      category: "Social", 
      date: "2025-12-20", 
      author: "HR Team", 
      day: "20", month: "DEC",
      priority: "Normal",
      content: "Don't forget to RSVP for the annual holiday gathering! There will be food, drinks, music, and a secret santa gift exchange." 
    },
    { 
      id: 103, 
      title: "Performance Review Cycle", 
      category: "HR", 
      date: "2025-10-25", 
      author: "Diana Prince", 
      day: "25", month: "OCT",
      priority: "High",
      content: "The annual performance review cycle for 2025 will begin on November 1st. Please ensure all your goals are updated in the system before this date..." 
    },
    { 
      id: 104, 
      title: "New Attendance Policy", 
      category: "Policy", 
      date: "2025-10-20", 
      author: "Admin Team", 
      day: "20", month: "OCT",
      priority: "Normal",
      content: "Starting next month, we are updating our hybrid work policy to allow for more flexibility on Fridays. Please read the attached document for full details..." 
    },
  ];

  // --- Pagination Logic for Announcements ---
  const [announcementPage, setAnnouncementPage] = useState(1);
  const ITEMS_PER_PAGE = 2;
  
  const totalPages = Math.ceil(dashboardAnnouncements.length / ITEMS_PER_PAGE);
  const startIndex = (announcementPage - 1) * ITEMS_PER_PAGE;
  const currentAnnouncements = dashboardAnnouncements.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrevPage = () => {
    setAnnouncementPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setAnnouncementPage(prev => Math.min(prev + 1, totalPages));
  };

  // --- Task Logic ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review Pull Request #402", time: "10:00 AM", completed: true },
    { id: 2, text: "Team Sync with Design", time: "11:30 AM", completed: false },
    { id: 3, text: "Update Q4 Goal Progress", time: "2:00 PM", completed: false },
    { id: 4, text: "Submit Expense Report", time: "4:00 PM", completed: false },
  ]);

  const reviewers = [
    "Manager (Auto-assign)", "Rajesh R.", "Sarah Chen", "Mike Ross", "Jessica Pearson"
  ];

  // --- UI State ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewerMenuOpen, setIsReviewerMenuOpen] = useState(false);
  const [activeTask, setActiveTask] = useState(null); 
  const [formData, setFormData] = useState({ title: '', description: '', reviewer: 'Manager (Auto-assign)' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '' });

  // --- Handlers ---
  const handleTaskClick = (task) => {
    if (task.completed) {
      setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: false } : t));
    } else {
      setActiveTask(task);
      setFormData({ 
        title: task.text, 
        description: ``,
        reviewer: 'Manager (Auto-assign)'
      });
      setIsModalOpen(true);
      setIsReviewerMenuOpen(false);
    }
  };

  const handleSubmitReview = () => {
    if (activeTask) {
        setTasks(tasks.map(t => t.id === activeTask.id ? { ...t, completed: true } : t));
    }
    
    setIsModalOpen(false);
    setSnackbar({ open: true, message: 'Item sent for review successfully!' });
    setActiveTask(null);
  };

  // Button style for pagination controls
  const paginationBtnStyle = {
    background: 'none',
    border: 'none',
    color: 'var(--text-secondary)', // Assuming you have this CSS var, or use #94a3b8
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '4px',
    transition: 'background-color 0.2s'
  };

  return (
    <div className="dashboard-container">
      {/* 1. SHARED HEADER */}
      <div className="dashboard-header">
        <div>
           <h1 className="dashboard-title">
             Good morning, {user?.name.split(' ')[0] || 'Employee'}
           </h1>
           <div className="dashboard-subtitle">Here is what's happening today</div>
         </div>
         
         <div className="header-actions">
            {/* ATTENDANCE WIDGET */}
            <div className={`attendance-pill ${isWorking ? 'active' : ''}`}>
               {isWorking && (
                 <div className="timer-display">
                    <Timer size={16} className="timer-icon spinning" />
                    <span>{formatTime(elapsedTime)}</span>
                 </div>
               )}
               
               <Button 
                  variant="contained" 
                  size="small"
                  onClick={() => markAttendance(user)}
                  color={isWorking ? "error" : "success"}
                  startIcon={isWorking ? <LogOut size={16}/> : <Clock size={16}/>}
                  sx={{ 
                    borderRadius: '20px', 
                    textTransform: 'none', 
                    fontWeight: 600,
                    boxShadow: 'none'
                  }}
               >
                  {isWorking ? "Clock Out" : "Mark Attendance"}
               </Button>
            </div>

            <div className="header-date-pill">
               <Sun size={18} className="sun-icon" />
               <span>{today}</span>
            </div>
         </div>
      </div>

      {/* 2. SHARED STATS GRID */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div key={stat.id} className={`stat-card ${stat.color}`}>
            <div className="stat-icon-wrapper">
              <stat.icon size={24} />
            </div>
            <div className="stat-card-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* 3. WIDGET LAYOUT */}
      <div className="dashboard-split-layout">
        
        {/* Left Column: Announcements (Paginated) */}
        <div className="dashboard-surface">
            <div className="surface-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3>Company Announcements</h3>
                    <Bell size={20} color="var(--text-secondary)" />
                </div>
                
                {/* Pagination Controls */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button 
                        onClick={handlePrevPage} 
                        disabled={announcementPage === 1}
                        style={{ ...paginationBtnStyle, opacity: announcementPage === 1 ? 0.3 : 1, cursor: announcementPage === 1 ? 'default' : 'pointer' }}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button 
                        onClick={handleNextPage} 
                        disabled={announcementPage === totalPages}
                        style={{ ...paginationBtnStyle, opacity: announcementPage === totalPages ? 0.3 : 1, cursor: announcementPage === totalPages ? 'default' : 'pointer' }}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            </div>

            <div className="announcement-list">
                {currentAnnouncements.map((item) => (
                  <div 
                    key={item.id} 
                    className="announcement-item"
                    onClick={() => navigate(`/announcements/${item.id}`, { state: { announcement: item } })}
                    style={{ cursor: 'pointer' }}
                  >
                      <div className="announce-date-box">
                        <span className="day">{item.day}</span>
                        <span className="month">{item.month}</span>
                      </div>
                      <div className="announce-content">
                        <h4>{item.title}</h4>
                        <p>{item.content.substring(0, 50)}...</p>
                      </div>
                  </div>
                ))}
            </div>
        </div>

        {/* Right Column: My Day */}
        <div className="dashboard-surface">
            <div className="surface-title">
                <h3>My Day</h3>
                <Clock size={20} color="var(--text-secondary)" />
            </div>
            <div className="task-list">
                {tasks.map(task => (
                    <div 
                        key={task.id} 
                        className={`task-item ${task.completed ? 'completed' : ''}`} 
                        onClick={() => handleTaskClick(task)} 
                    >
                        <div className="task-checkbox">
                            {task.completed && <Check size={14} color="white" strokeWidth={3} />}
                        </div>
                        <span className="task-text">{task.text}</span>
                        <span className="task-time">{task.time}</span>
                    </div>
                ))}
            </div>
            <Button variant="outlined" fullWidth sx={{ mt: 3 }} onClick={() => {
                setActiveTask(null);
                setFormData({ title: '', description: '', reviewer: 'Manager (Auto-assign)' });
                setIsModalOpen(true);
            }}>
                Submit New Item
            </Button>
        </div>
      </div>

      {/* 4. CUSTOM MODAL STRUCTURE */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Submit for Review</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label>Title <span className="required">*</span></label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="modal-input"
                  placeholder="Enter task title..."
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea 
                    className="modal-input modal-textarea" 
                    rows="4"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="form-group">
                <label>Reviewer</label>
                <div className="custom-select-container">
                    <button 
                        className={`dropdown-trigger-btn ${isReviewerMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsReviewerMenuOpen(!isReviewerMenuOpen)}
                    >
                        <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                            <User size={16} color="#94a3b8"/>
                            <span>{formData.reviewer}</span>
                        </div>
                        <ChevronDown size={16} className={`chevron ${isReviewerMenuOpen ? 'rotate' : ''}`} />
                    </button>
                    
                    {isReviewerMenuOpen && (
                        <div className="reviewer-dropdown-menu">
                            {reviewers.map((person, index) => (
                                <div key={index} className="reviewer-option" onClick={() => {
                                    setFormData({ ...formData, reviewer: person });
                                    setIsReviewerMenuOpen(false);
                                }}>
                                    {person}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="submit-btn" onClick={handleSubmitReview}>Submit Review</button>
            </div>
          </div>
        </div>
      )}

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity="success" variant="filled">{snackbar.message}</Alert>
      </Snackbar>

    </div>
  );
};

export default EmployeeDashboard;