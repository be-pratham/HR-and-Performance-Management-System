import React, { useState } from 'react';
import { ChevronLeft, Download } from 'lucide-react';

const MOCK_TEAM = [
  { id: 101, name: "Sarah Chen", role: "Sr. Engineer", status: "submitted" },
  { id: 102, name: "Mike Ross", role: "Legal Associate", status: "draft" },
  { id: 103, name: "Jessica Pearson", role: "Managing Partner", status: "pending" }
];

const ManagerReview = ({ activeTab, triggerSnackbar }) => {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [ratings, setRatings] = useState({ technical: 0, delivery: 0 });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    triggerSnackbar(`Feedback submitted for ${selectedEmployee.name}!`);
    setSelectedEmployee(null); // Go back to grid
    setRatings({ technical: 0, delivery: 0 });
    setFeedback('');
  };

  // --- VIEW: HISTORY ---
  if (activeTab === 'history') {
      return (
        <div className="section-card">
           <div className="section-header"><h3>Team Review History</h3></div>
           <table className="history-table">
              <thead><tr><th>Cycle</th><th>Employee</th><th>Rating</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                 <tr><td>Q3 2025</td><td>Sarah Chen</td><td><span className="badge-green">Exceeds</span></td><td>Oct 15</td><td><Download size={16}/></td></tr>
              </tbody>
           </table>
        </div>
      );
  }

  // --- VIEW: TEAM GRID (Default) ---
  if (!selectedEmployee) {
      return (
        <div className="team-dashboard">
           <div className="section-header">
              <h3>Direct Reports</h3>
              <p>Select an employee to start their performance review.</p>
           </div>
           <div className="team-grid">
              {MOCK_TEAM.map(member => (
                <div key={member.id} className="team-card" onClick={() => setSelectedEmployee(member)}>
                   <div className="team-card-header">
                      <div className="avatar-circle">{member.name.charAt(0)}</div>
                      <div>
                        <div className="team-name">{member.name}</div>
                        <div className="team-role">{member.role}</div>
                      </div>
                   </div>
                   <div className="team-card-footer">
                      <span className={`status-badge status-${member.status}`}>
                        {member.status === 'submitted' ? 'Ready for Review' : 'In Progress'}
                      </span>
                   </div>
                </div>
              ))}
           </div>
        </div>
      );
  }

  // --- VIEW: DETAIL REVIEW FORM ---
  return (
    <div className="review-grid">
        {/* EVALUATION FORM */}
        <div className="evaluation-form">
            <button className="btn-back" onClick={() => setSelectedEmployee(null)}>
                 <ChevronLeft size={16}/> Back to Team
            </button>

            <div className="section-card">
                <div className="section-header">
                    <h3>Reviewing: {selectedEmployee.name}</h3>
                    <p>Provide your assessment of this employee's performance.</p>
                </div>

                <div className="rating-group">
                    <label>Technical Excellence</label>
                    <div className="employee-prev-rating">Employee Self-Rating: <strong>4/5</strong></div>
                    <div className="rating-options">
                        {[1,2,3,4,5].map(num => (
                            <button key={num} className={`rating-btn ${ratings.technical === num ? 'selected' : ''}`} onClick={() => setRatings({...ratings, technical: num})}>
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="section-card">
                <div className="section-header"><h3>Manager Feedback</h3></div>
                <div className="read-only-reflection">
                     <label>Employee's Note:</label>
                     <p>"I successfully delivered the Q3 migration project ahead of schedule..."</p>
                </div>
                <div className="form-group">
                    <label>Your Feedback</label>
                    <textarea 
                        className="form-textarea"
                        placeholder="Write your feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
            </div>

            <div className="modal-actions">
                <button className="btn-cancel">Save Draft</button>
                <button className="btn-save" onClick={handleSubmit}>Submit Review</button>
            </div>
        </div>

        {/* SIDEBAR: EMPLOYEE HISTORY */}
        <div className="review-sidebar">
             <div className="section-card">
                <div className="section-header">
                   <h3>{selectedEmployee.name.split(' ')[0]}'s History</h3>
                </div>
                <div className="history-mini-list">
                   <div className="history-item"><span>Q3 2025</span><span className="badge-green">Exceeds</span></div>
                   <div className="history-item"><span>Q2 2025</span><span className="badge-green">Met</span></div>
                </div>
             </div>
        </div>
    </div>
  );
};

export default ManagerReview;