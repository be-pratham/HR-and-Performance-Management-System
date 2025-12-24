import React, { useState } from 'react';
import { Avatar } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Added icons
import HighlightOffIcon from '@mui/icons-material/HighlightOff'; // Added icons

import './LeavePage.css';

// --- MOCK DATA ---
const INITIAL_REQUESTS = [
  { id: 1, employee: 'Sarah Chen', role: 'Sr. Engineer', type: 'Sick Leave', startDate: '2025-01-10', endDate: '2025-01-11', reason: 'Coming down with the flu, need rest.', status: 'Approved', avatar: 'S' },
  { id: 2, employee: 'Rajesh Ramasamy', role: 'Product Manager', type: 'Casual Leave', startDate: '2025-01-15', endDate: '2025-01-16', reason: 'Personal errands and bank work.', status: 'Pending', avatar: 'R' },
  { id: 3, employee: 'You', role: 'Developer', type: 'Vacation', startDate: '2025-02-01', endDate: '2025-02-05', reason: 'Family trip to the mountains.', status: 'Pending', avatar: 'Y' },
  { id: 4, employee: 'Mike Ross', role: 'Legal Associate', type: 'Unpaid Leave', startDate: '2025-02-10', endDate: '2025-02-12', reason: 'Moving apartments.', status: 'Pending', avatar: 'M' },
];

const LeavePage = () => {
  const [role, setRole] = useState('employee'); // 'employee' or 'manager'
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    type: 'Sick Leave',
    startDate: '',
    endDate: '',
    reason: ''
  });

  const handleSubmit = () => {
    const newRequest = {
      id: Date.now(),
      employee: 'You',
      role: 'Developer',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      status: 'Pending',
      avatar: 'Y'
    };
    setRequests([newRequest, ...requests]);
    setIsModalOpen(false);
    setFormData({ type: 'Sick Leave', startDate: '', endDate: '', reason: '' });
  };

  const handleAction = (id, action) => {
    setRequests(requests.map(req => 
      req.id === id ? { ...req, status: action === 'approve' ? 'Approved' : 'Rejected' } : req
    ));
  };

  const visibleRequests = role === 'employee' 
    ? requests.filter(r => r.employee === 'You') 
    : requests;

  return (
    <div className="approvals-container">
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', marginBottom: '32px' }}>
        <div>
            <h1 className="page-title">
                {role === 'manager' ? 'Leave Approvals' : 'My Leave Requests'}
            </h1>
            <div className="page-subtitle">
                {role === 'manager' ? 'Review and manage time-off requests from your team.' : 'Track your leave status and history.'}
            </div>
        </div>
        
        {role === 'employee' && (
            <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
                <AddIcon fontSize="small" /> New Request
            </button>
        )}
      </div>

      {/* --- CARD GRID --- */}
      <div className="requests-grid">
        {visibleRequests.map((req) => (
            <div key={req.id} className="request-card">
                {/* Header */}
                <div className="card-header">
                    <div className="user-info">
                        <Avatar sx={{ bgcolor: '#3b82f6', width: 40, height: 40, fontSize: '1rem', fontWeight: 'bold' }}>{req.avatar}</Avatar>
                        <div>
                            <h3 className="card-name">{req.employee}</h3>
                            <p className="card-role">{req.role} • {req.type}</p>
                        </div>
                    </div>
                    {/* Status Chip */}
                    <span className={`status-chip chip-${req.status.toLowerCase()}`}>
                        {req.status}
                    </span>
                </div>

                {/* Details */}
                <div className="card-details">
                    <div className="detail-item">
                        <CalendarTodayIcon sx={{ fontSize: 18, color: '#3b82f6' }} />
                        <span>{req.startDate} — {req.endDate}</span>
                    </div>
                    <div className="detail-item" style={{ alignItems: 'flex-start' }}>
                        <DescriptionOutlinedIcon sx={{ fontSize: 18, color: '#94a3b8', mt: 0.3 }} />
                        <span style={{ lineHeight: '1.4' }}>"{req.reason}"</span>
                    </div>
                </div>

                {/* Footer / Actions */}
                {role === 'manager' && req.status === 'Pending' ? (
                    <div className="card-actions">
                        <button className="btn btn-primary" onClick={() => handleAction(req.id, 'approve')}>
                           <CheckCircleOutlineIcon fontSize="small" /> Approve
                        </button>
                        <button className="btn btn-danger" onClick={() => handleAction(req.id, 'reject')}>
                            <HighlightOffIcon fontSize="small" /> Reject
                        </button>
                    </div>
                ) : (
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', marginTop: 'auto' }}>
                         <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                            {req.status === 'Pending' ? 'Waiting for review...' : `Request ${req.status}`}
                         </span>
                    </div>
                )}
            </div>
        ))}
      </div>

      {/* --- CUSTOM MODAL --- */}
      {isModalOpen && (
        <div className="modal-overlay">
            <div className="modal-content-dark">
                <div className="modal-header">
                    <h2 className="modal-title">Request Time Off</h2>
                    <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="modal-body">
                    <div className="form-group">
                        <label className="form-label">Leave Type</label>
                        <select 
                            className="dark-input"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option>Sick Leave</option>
                            <option>Casual Leave</option>
                            <option>Vacation</option>
                            <option>Unpaid Leave</option>
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div className="form-group">
                            <label className="form-label">Start Date</label>
                            <input 
                                type="date" 
                                className="dark-input"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})} 
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">End Date</label>
                            <input 
                                type="date" 
                                className="dark-input" 
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Reason</label>
                        <textarea 
                            className="dark-input" 
                            rows="3" 
                            placeholder="Why are you taking leave?"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        ></textarea>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                        Cancel
                    </button>
                    <button className="btn btn-primary" onClick={handleSubmit}>
                        Submit Request
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default LeavePage;