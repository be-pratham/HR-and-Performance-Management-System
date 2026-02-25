import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'; // Added Redux hooks
import { User, Users, AlertCircle, Check } from 'lucide-react';
import { loginByEmail } from '../../store/reducers/authSlice'; // Import your logic
import EmployeeReview from './views/Employee';
import ManagerReview from './views/Manager';
import './ReviewsPage.css';

const ReviewPage = () => {
  const dispatch = useDispatch();
  
  // Connect to real Redux State
  const { user } = useSelector(state => state.auth);
  const allEmployees = useSelector(state => state.employees.list);
  
  const [viewContext, setViewContext] = useState('personal'); 
  const [activeTab, setActiveTab] = useState('current'); 
  const [snackbar, setSnackbar] = useState({ show: false, message: '', type: 'success' });

  const isManager = user?.role?.toLowerCase() === 'manager';

  const triggerSnackbar = (message, type = 'success') => {
    setSnackbar({ show: true, message, type });
    setTimeout(() => setSnackbar(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <div className="reviews-container">
      
      {/* DEV TOGGLE: Now actually updates Redux Store */}
      <div className="dev-rbac-toggle">
          <span>🔧 Simulating: <strong>{user?.name || 'Guest'}</strong></span>
          <button 
            className={!isManager ? 'active' : ''} 
            onClick={() => {
              dispatch(loginByEmail({ email: 'alice@company.com', allEmployees }));
              setViewContext('personal');
            }}
          >
            Employee
          </button>
          <button 
            className={isManager ? 'active' : ''} 
            onClick={() => dispatch(loginByEmail({ email: 'bob@company.com', allEmployees }))}
          >
            Manager
          </button>
      </div>

      <div className="page-header">
        <div className="header-left">
            <h1>Performance Reviews</h1>
            <p>Q4 2025 Performance Cycle</p>
        </div>
        
        {isManager && (
           <div className="context-switcher">
              <button className={viewContext === 'personal' ? 'active' : ''} onClick={() => setViewContext('personal')}>
                 <User size={16} /> My Performance
              </button>
              <button className={viewContext === 'team' ? 'active' : ''} onClick={() => setViewContext('team')}>
                 <Users size={16} /> Team Performance
              </button>
           </div>
        )}
      </div>

      <div className="page-tabs">
        <span className={`tab ${activeTab === 'current' ? 'active' : ''}`} onClick={() => setActiveTab('current')}>
            {viewContext === 'team' ? 'Team Overview' : 'Current Review'}
        </span>
        <span className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
            Past Reviews
        </span>
      </div>

      <div className="content-area">
          {viewContext === 'personal' ? (
              <EmployeeReview activeTab={activeTab} triggerSnackbar={triggerSnackbar} />
          ) : (
              <ManagerReview activeTab={activeTab} triggerSnackbar={triggerSnackbar} />
          )}
      </div>

      <div className={`snackbar ${snackbar.show ? 'show' : ''} ${snackbar.type}`}>
        {snackbar.type === 'error' ? <AlertCircle size={18} /> : <Check size={18} />}
        <span>{snackbar.message}</span>
      </div>
    </div>
  );
};

export default ReviewPage;