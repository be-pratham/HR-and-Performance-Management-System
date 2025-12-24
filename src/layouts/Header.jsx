import React, { useState } from 'react';
import { Search, Bell, ChevronDown, LogOut, Settings, Trash2, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import Auth Context
import './Header.css';

const Header = ({ onSearch }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth(); // 2. Get logout function and user data

  const initialNotifications = [
    { id: 1, text: "New goal assigned by HR", time: "2m ago" },
    { id: 2, text: "Meeting starting in 15 mins", time: "1h ago" }
  ];

  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const [notifications, setNotifications] = useState(initialNotifications);
  const [hasUnread, setHasUnread] = useState(true);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const toggleProfile = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const markAllRead = (e) => {
    e.stopPropagation(); 
    setHasUnread(false);
  };

  const clearNotifications = (e) => {
    e.stopPropagation();
    setNotifications([]); 
    setHasUnread(false); 
  };

  // 3. The Logout Handler
  const handleLogout = () => {
    logout();             // Clear auth state
    navigate('/login');   // Redirect to login page
  };

  return (
    <div className="header-container">
      <div className="search-bar">
        <Search size={18} className="search-icon" />
        <input 
          type="text" 
          placeholder="Search goals, employees..." 
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="header-actions">
        
        <div className="action-wrapper">
          <button className="icon-btn" onClick={toggleNotifications}>
            <Bell size={20} />
            {hasUnread && <span className="notification-dot"></span>}
          </button>
          
          {/* Notification Dropdown */}
          {showNotifications && (
            <div className="dropdown-menu notifications-dropdown">
              <div className="dropdown-header">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <div className="header-tools">
                    <button 
                      className="tool-btn" 
                      title="Mark all as read" 
                      onClick={markAllRead}
                    >
                      <CheckCheck size={14} />
                    </button>
                    <button 
                      className="tool-btn danger" 
                      title="Clear notifications" 
                      onClick={clearNotifications}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              <div className="notification-list">
                {notifications.length > 0 ? (
                  notifications.map(note => (
                    <div key={note.id} className="dropdown-item notification-item">
                      <p>{note.text}</p>
                      <span className="time">{note.time}</span>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* User Profile Section */}
        <div className="action-wrapper">
          <div className="user-profile" onClick={toggleProfile}>
            <div className="avatar">
                {/* Show first initial of user name or 'U' */}
                {user?.name ? user.name.charAt(0) : 'U'}
            </div>
            <div className="user-info">
              {/* 4. Display Real User Data */}
              <span className="name">{user?.name || 'User'}</span>
              <span className="role">{user?.role || 'Employee'}</span>
            </div>
            <ChevronDown size={16} className={`chevron ${showProfileMenu ? 'rotate' : ''}`} />
          </div>

          {showProfileMenu && (
            <div className="dropdown-menu profile-dropdown">
              <div 
                className="dropdown-item" 
                onClick={() => {
                  navigate('/settings');
                  setShowProfileMenu(false);
                }}
              >
                <Settings size={16} /> <span>Settings</span>
              </div>
              <div className="dropdown-divider"></div>
              
              {/* 5. Attach the Logout Handler here */}
              <div className="dropdown-item danger" onClick={handleLogout}>
                <LogOut size={16} /> <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;