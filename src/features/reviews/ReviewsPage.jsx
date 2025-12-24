import React, { useState } from 'react';
import { User, Users, AlertCircle, Check } from 'lucide-react';
import EmployeeReview from './views/Employee';
import ManagerReview from './views/Manager';
import './ReviewsPage.css';

const ReviewPage = () => {
  // --- STATE ---
  const [userRole, setUserRole] = useState('manager'); // 'employee' | 'manager'
  const [viewContext, setViewContext] = useState('personal'); // 'personal' | 'team'
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'history'
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

  // --- HANDLERS ---
  const triggerSnackbar = (message, type = 'success') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
  };

  // --- RENDER ---
  return (
    <div className="reviews-container">
      
      {/* 0. DEV TOGGLE (Simulate RBAC) */}
      <div className="dev-rbac-toggle">
         <span>🔧 Simulating: </span>
         <button className={userRole === 'employee' ? 'active' : ''} onClick={() => { setUserRole('employee'); setViewContext('personal'); }}>Employee</button>
         <button className={userRole === 'manager' ? 'active' : ''} onClick={() => setUserRole('manager')}>Manager</button>
      </div>

      {/* 1. HEADER & CONTEXT SWITCHER */}
      <div className="page-header">
        <div className="header-left">
            <h1>Performance Reviews</h1>
            <p>Q4 2025 Performance Cycle</p>
        </div>
        
        {/* Only Managers see the switcher */}
        {userRole === 'manager' && (
           <div className="context-switcher">
              <button 
                className={viewContext === 'personal' ? 'active' : ''} 
                onClick={() => setViewContext('personal')}
              >
                 <User size={16} /> My Performance
              </button>
              <button 
                className={viewContext === 'team' ? 'active' : ''} 
                onClick={() => setViewContext('team')}
              >
                 <Users size={16} /> Team Performance
              </button>
           </div>
        )}
      </div>

      {/* 2. TABS */}
      <div className="page-tabs">
        <span className={`tab ${activeTab === 'current' ? 'active' : ''}`} onClick={() => setActiveTab('current')}>
            {viewContext === 'team' ? 'Team Overview' : 'Current Review'}
        </span>
        <span className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Past Reviews
        </span>
      </div>

      {/* 3. MAIN CONTENT (RBAC ROUTING) */}
      <div className="content-area">
          {viewContext === 'personal' ? (
              <EmployeeReview 
                  activeTab={activeTab} 
                  triggerSnackbar={triggerSnackbar} 
              />
          ) : (
              <ManagerReview 
                  activeTab={activeTab} 
                  triggerSnackbar={triggerSnackbar} 
              />
          )}
      </div>

      {/* GLOBAL SNACKBAR */}
      <div className={`snackbar ${snackbar.show ? 'show' : ''} ${snackbar.type}`}>
        {snackbar.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
        <span>{snackbar.message}</span>
      </div>

    </div>
  );
};

export default ReviewPage;