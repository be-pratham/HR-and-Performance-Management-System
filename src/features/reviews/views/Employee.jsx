import React, { useState } from 'react';
import { Send, Download, Check } from 'lucide-react';

const EmployeeReview = ({ activeTab, triggerSnackbar }) => {
  const [ratings, setRatings] = useState({ technical: 0, delivery: 0 });
  const [textAnswers, setTextAnswers] = useState({ achievements: '', improvements: '' });
  const [status, setStatus] = useState('idle'); // 'idle' | 'draft' | 'submitted'

  const handleSubmit = () => {
    if (ratings.technical === 0 || ratings.delivery === 0) {
      triggerSnackbar("Please complete all ratings.", "error");
      return;
    }
    setStatus('submitted');
    triggerSnackbar("Self-review submitted successfully!");
  };

  if (activeTab === 'history') {
      return (
        <div className="section-card">
           <div className="section-header"><h3>My Review History</h3></div>
           <table className="history-table">
              <thead>
                 <tr><th>Cycle</th><th>Reviewer</th><th>Rating</th><th>Date</th><th>Action</th></tr>
              </thead>
              <tbody>
                 <tr><td>Q3 2025</td><td>James Wilson</td><td><span className="badge-green">Exceeds</span></td><td>Oct 15</td><td><Download size={16}/></td></tr>
              </tbody>
           </table>
        </div>
      );
  }

  return (
    <div className="review-grid">
        {/* FORM SECTION */}
        <div className="evaluation-form">
            <div className="section-card">
                <div className="section-header">
                    <h3>Self Evaluation</h3>
                    <p>Rate your performance based on defined expectations.</p>
                </div>
                
                {/* Ratings */}
                {['technical', 'delivery'].map((cat, idx) => (
                    <div className="rating-group" key={cat}>
                        <label>{cat === 'technical' ? 'Technical Excellence' : 'Delivery & Execution'}</label>
                        <div className="rating-options">
                            {[1,2,3,4,5].map(num => (
                                <button 
                                    key={num}
                                    disabled={status === 'submitted'}
                                    className={`rating-btn ${ratings[cat] === num ? 'selected' : ''}`}
                                    onClick={() => setRatings({...ratings, [cat]: num})}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="section-card">
                <div className="section-header"><h3>Self Reflection</h3></div>
                <div className="form-group">
                    <label>Biggest Achievements</label>
                    <textarea 
                        className="form-textarea"
                        disabled={status === 'submitted'}
                        value={textAnswers.achievements}
                        onChange={(e) => setTextAnswers({...textAnswers, achievements: e.target.value})}
                        placeholder="Describe your wins..."
                    />
                </div>
            </div>

            <div className="modal-actions">
                <button className="btn-cancel" disabled={status === 'submitted'}>Save Draft</button>
                <button className="btn-save" onClick={handleSubmit} disabled={status === 'submitted'}>
                    {status === 'submitted' ? 'Submitted' : 'Submit Review'}
                </button>
            </div>
        </div>

        {/* SIDEBAR SECTION */}
        <div className="review-sidebar">
            <div className="section-card">
                <div className="section-header">
                    <h3>Peer Feedback</h3>
                    <p>Request feedback from colleagues.</p>
                </div>
                <div className="peer-list">
                    <div className="peer-item">
                        <div className="peer-avatar">SJ</div>
                        <div className="peer-info">
                            <div>Sarah J.</div>
                            <div className="sub-text">Product</div>
                        </div>
                        <span className="badge-muted">Pending</span>
                    </div>
                </div>
                <button className="btn-outline" style={{width:'100%', marginTop:16}} onClick={() => triggerSnackbar('Request sent!')}>
                    <Send size={14} style={{marginRight:8}}/> Request
                </button>
            </div>
        </div>
    </div>
  );
};

export default EmployeeReview;