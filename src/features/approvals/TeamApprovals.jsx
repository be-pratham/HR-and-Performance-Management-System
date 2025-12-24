import React, { useState } from 'react';
import { Box, Typography, Button, Paper, Avatar, Chip, Tabs, Tab, Divider, TextField, Snackbar, Alert, IconButton} from '@mui/material';
import { CheckCircle, XCircle, FileText, Target, Calendar, Clock, X, User } from 'lucide-react';
import './TeamApprovals.css';

// --- MOCK DATA ---
const INITIAL_GOALS = [
  { id: 1, name: "Alice Johnson", role: "Frontend Dev", type: "Goal Setting", date: "Oct 24, 2025", items: 4, status: "Pending" },
  { id: 2, name: "Charlie Davis", role: "Designer", type: "Goal Setting", date: "Oct 25, 2025", items: 3, status: "Pending" },
];

const INITIAL_REVIEWS = [
  { 
    id: 3, 
    name: "Bob Smith", 
    role: "Backend Dev", 
    type: "Year-End Review", 
    date: "Oct 20, 2025", 
    rating: 4.5, 
    selfReview: "I successfully migrated the auth system and reduced latency by 20%. I believe I am ready for a Senior role.",
    status: "Pending Manager Sign-off" 
  },
];

const TeamApprovals = () => {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState(0);
  const [goals, setGoals] = useState(INITIAL_GOALS);
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);

  // Modals & Popups
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  // Rejection State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedRejectId, setSelectedRejectId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  // Review Detail State
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  // --- HANDLERS ---

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // 1. APPROVE ACTION
  const handleApprove = (id) => {
    // Remove item from list
    setGoals(prev => prev.filter(g => g.id !== id));
    
    // Show Snackbar
    setSnackbar({ 
      open: true, 
      message: 'Goal request approved successfully!', 
      severity: 'success' 
    });
  };

  // 2. REJECT ACTIONS
  const handleRejectClick = (id) => {
    setSelectedRejectId(id);
    setRejectReason(""); // Reset input
    setRejectModalOpen(true);
  };

  const submitRejection = () => {
    if (!rejectReason.trim()) return; // Prevent empty reasons

    // Remove item from list
    setGoals(prev => prev.filter(g => g.id !== selectedRejectId));
    
    // Close & Notify
    setRejectModalOpen(false);
    setSnackbar({ 
      open: true, 
      message: 'Request rejected. Employee has been notified.', 
      severity: 'info' 
    });
  };

  // 3. REVIEW DETAILS ACTION
  const handleReviewClick = (review) => {
    setSelectedReview(review);
    setReviewModalOpen(true);
  };

  const closeSnack = () => setSnackbar({ ...snackbar, open: false });

  return (
    <Box className="approvals-container">
      
      {/* HEADER */}
      <Box className="approvals-header">
        <div>
          <Typography variant="h4" className="page-title">Approvals & Requests</Typography>
          <Typography variant="body2" className="page-subtitle">Review and take action on your team's submissions.</Typography>
        </div>
      </Box>

      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: '#334155', mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          className="custom-tabs"
          TabIndicatorProps={{ style: { backgroundColor: '#3b82f6' } }}
        >
          <Tab label={`Goal Requests (${goals.length})`} className="custom-tab" />
          <Tab label={`Performance Reviews (${reviews.length})`} className="custom-tab" />
        </Tabs>
      </Box>

      {/* --- CONTENT: GOAL REQUESTS --- */}
      {activeTab === 0 && (
        <div className="requests-grid">
          {goals.map((req) => (
            <Paper key={req.id} className="request-card">
              <div className="card-header">
                <div className="user-info">
                  <Avatar sx={{ bgcolor: '#3b82f6' }}>{req.name[0]}</Avatar>
                  <div>
                    <Typography variant="h6" className="card-name">{req.name}</Typography>
                    <Typography variant="caption" className="card-role">{req.role}</Typography>
                  </div>
                </div>
                <Chip label="Goals" size="small" className="chip-type-goals" icon={<Target size={14} />} />
              </div>

              <Divider sx={{ borderColor: '#334155', my: 2 }} />

              <div className="card-details">
                <div className="detail-item">
                  <FileText size={16} />
                  <span>{req.items} Objectives Drafted</span>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Submitted: {req.date}</span>
                </div>
              </div>

              <div className="card-actions">
                <Button 
                  variant="outlined" 
                  className="btn-reject" 
                  startIcon={<XCircle size={18} />}
                  onClick={() => handleRejectClick(req.id)}
                >
                  Reject
                </Button>
                <Button 
                  variant="contained" 
                  className="btn-approve" 
                  startIcon={<CheckCircle size={18} />}
                  onClick={() => handleApprove(req.id)}
                >
                  Approve
                </Button>
              </div>
            </Paper>
          ))}
          {goals.length === 0 && <p className="empty-state">No pending goal requests.</p>}
        </div>
      )}

      {/* --- CONTENT: REVIEW REQUESTS --- */}
      {activeTab === 1 && (
        <div className="requests-grid">
          {reviews.map((req) => (
            <Paper key={req.id} className="request-card">
              <div className="card-header">
                <div className="user-info">
                  <Avatar sx={{ bgcolor: '#8b5cf6' }}>{req.name[0]}</Avatar>
                  <div>
                    <Typography variant="h6" className="card-name">{req.name}</Typography>
                    <Typography variant="caption" className="card-role">{req.role}</Typography>
                  </div>
                </div>
                <Chip label="Review" size="small" className="chip-type-review" icon={<Clock size={14} />} />
              </div>

              <Divider sx={{ borderColor: '#334155', my: 2 }} />

              <div className="card-details">
                <div className="detail-item">
                  <Typography sx={{color:'#f8fafc', fontWeight:'bold'}}>Self Rating: {req.rating}/5</Typography>
                </div>
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>Submitted: {req.date}</span>
                </div>
              </div>

              <div className="card-actions">
                <Button 
                  variant="outlined" 
                  className="btn-view"
                  fullWidth
                  onClick={() => handleReviewClick(req)}
                >
                  Review Submission
                </Button>
              </div>
            </Paper>
          ))}
           {reviews.length === 0 && <p className="empty-state">No pending reviews.</p>}
        </div>
      )}

      {/* --- MODAL 1: REJECT REASON --- */}
      {rejectModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content-dark">
            <div className="modal-header">
              <Typography variant="h6">Reject Request</Typography>
              <IconButton onClick={() => setRejectModalOpen(false)} sx={{ color: '#94a3b8' }}>
                <X size={20} />
              </IconButton>
            </div>
            <div className="modal-body">
              <Typography variant="body2" sx={{ color: '#cbd5e1', mb: 2 }}>
                Please provide a reason so the employee can make corrections.
              </Typography>
              <TextField 
                fullWidth 
                multiline 
                rows={4} 
                variant="outlined" 
                placeholder="Ex: The objectives are too vague..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="dark-input"
              />
            </div>
            <div className="modal-footer">
              <Button onClick={() => setRejectModalOpen(false)} className="btn-text">Cancel</Button>
              <Button 
                variant="contained" 
                color="error" 
                onClick={submitRejection}
                disabled={!rejectReason.trim()}
              >
                Reject Goal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 2: EMPLOYEE DETAILS --- */}
      {reviewModalOpen && selectedReview && (
        <div className="modal-overlay">
          <div className="modal-content-dark">
            <div className="modal-header">
              <Typography variant="h6">Employee Review Details</Typography>
              <IconButton onClick={() => setReviewModalOpen(false)} sx={{ color: '#94a3b8' }}>
                <X size={20} />
              </IconButton>
            </div>
            <div className="modal-body">
              
              <div className="review-profile-section">
                <Avatar sx={{ width: 56, height: 56, bgcolor: '#8b5cf6' }}>{selectedReview.name[0]}</Avatar>
                <div>
                  <Typography variant="h6">{selectedReview.name}</Typography>
                  <Typography variant="body2" sx={{color: '#94a3b8'}}>{selectedReview.role}</Typography>
                </div>
              </div>

              <Divider sx={{ borderColor: '#334155', my: 2 }} />

              <Typography variant="subtitle2" sx={{ color: '#94a3b8', mb: 1 }}>SELF REVIEW:</Typography>
              <Paper sx={{ p: 2, bgcolor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0', fontSize: '0.9rem' }}>
                "{selectedReview.selfReview}"
              </Paper>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>SELF RATING:</Typography>
                 <Chip label={`${selectedReview.rating} / 5.0`} color="info" />
              </Box>
            </div>
            <div className="modal-footer">
              <Button onClick={() => setReviewModalOpen(false)} className="btn-text">Close</Button>
            </div>
          </div>
        </div>
      )}

      {/* --- SNACKBAR --- */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnack} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default TeamApprovals;