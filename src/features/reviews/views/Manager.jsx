import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, Download, Info } from 'lucide-react';
import { submitReview, selectPerformanceData } from '../../../store/reducers/performanceSlice'; 
import PerformanceRadar from '../../../components/review/PerformanceRadar';

const ManagerReview = ({ activeTab, triggerSnackbar }) => {
  const dispatch = useDispatch();
  
  // 1. Get Real Data from Redux
  const { user } = useSelector(state => state.auth);
  const teamData = useSelector(selectPerformanceData); // This has the calculated averages/bonuses
  const rawReviews = useSelector(state => state.performance.reviews); // This has raw scores for inputs

  // Filter for current manager's direct reports (excluding other managers for simplicity if needed)
  const myTeam = teamData.filter(emp => emp.dept === user?.dept && emp.id !== user?.id);

  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  // State for the 3 categories needed for the Bonus Formula
  const [ratings, setRatings] = useState({ technical: 0, delivery: 0, communication: 0 });
  const [feedback, setFeedback] = useState('');

  const handleSubmit = () => {
    if (!ratings.technical || !ratings.delivery || !ratings.communication) {
      triggerSnackbar('Please rate all categories.', 'error');
      return;
    }

    // 2. Dispatch to Redux (This "connects" the data to the user and stores it)
    dispatch(submitReview({
      targetId: selectedEmployee.id,
      reviewerId: user.id,
      type: 'manager',
      scores: ratings
    }));

    triggerSnackbar(`Review finalized for ${selectedEmployee.name}!`);
    setSelectedEmployee(null); 
    setRatings({ technical: 0, delivery: 0, communication: 0 });
    setFeedback('');
  };

  // Helper to pre-fill form if manager already submitted previously
  const handleSelectEmployee = (member) => {
    setSelectedEmployee(member);
    const existingReview = rawReviews[member.id]?.manager;
    if (existingReview) {
      setRatings(existingReview);
    } else {
      setRatings({ technical: 0, delivery: 0, communication: 0 });
    }
  };

  // --- VIEW: HISTORY ---
  if (activeTab === 'history') {
      return (
        <div className="section-card">
           <div className="section-header"><h3>Team Review History</h3></div>
           <table className="history-table">
             <thead><tr><th>Cycle</th><th>Employee</th><th>Final Score</th><th>Bonus</th><th>Action</th></tr></thead>
             <tbody>
               {myTeam.filter(m => m.status === 'COMPLETED').map(member => (
                 <tr key={member.id}>
                   <td>Q4 2025</td>
                   <td>{member.name}</td>
                   <td><span className="badge-green">{member.finalAvg} / 5</span></td>
                   <td className="font-mono text-emerald-400">${member.bonusAmount}</td>
                   <td><button className="btn-outline" style={{padding:'4px'}}><Download size={14}/></button></td>
                 </tr>
               ))}
               {myTeam.filter(m => m.status === 'COMPLETED').length === 0 && (
                 <tr><td colSpan="5" style={{textAlign:'center', color:'#64748b'}}>No completed reviews yet.</td></tr>
               )}
             </tbody>
           </table>
        </div>
      );
  }

  // --- VIEW: TEAM GRID (Default) ---
  if (!selectedEmployee) {
      return (
        <div className="team-dashboard animate-in fade-in">
           <div className="section-header">
              <h3>Direct Reports</h3>
              <p>Select an employee to finalize their assessment and calculate bonus.</p>
           </div>
           <div className="team-grid">
              {myTeam.map(member => (
                <div key={member.id} className={`team-card ${member.status === 'COMPLETED' ? 'border-emerald-500/30' : ''}`} onClick={() => handleSelectEmployee(member)}>
                   <div className="team-card-header">
                      <div className="avatar-circle">{member.name.charAt(0)}</div>
                      <div>
                        <div className="team-name">{member.name}</div>
                        <div className="team-role">{member.role}</div>
                      </div>
                   </div>
                   <div className="team-card-footer">
                      <span className={`status-badge status-${member.status?.toLowerCase() || 'pending'}`}>
                        {member.status === 'COMPLETED' ? 'Completed' : (member.scores?.self ? 'Ready for Review' : 'Waiting for Self')}
                      </span>
                      {member.status === 'COMPLETED' && (
                        <span className="text-emerald-400 font-mono font-bold text-sm">${member.bonusAmount}</span>
                      )}
                   </div>
                </div>
              ))}
           </div>
        </div>
      );
  }

  // --- VIEW: DETAIL REVIEW FORM ---
  // Prepare data for the Radar Chart (Live Manager Input vs Stored Self/Peer)
  const radarData = {
    self: selectedEmployee.scores?.self, 
    peer: selectedEmployee.scores?.peerAvg,
    manager: ratings 
  };

  return (
    <div className="review-grid animate-drill-down">
        {/* LEFT COLUMN: EVALUATION FORM */}
        <div className="evaluation-form">
            <button className="btn-back" onClick={() => setSelectedEmployee(null)}>
                 <ChevronLeft size={16}/> Back to Team
            </button>

            <div className="section-card">
                <div className="section-header">
                   <h3>Reviewing: <span className="text-indigo-400">{selectedEmployee.name}</span></h3>
                   <p>Scores here will determine the final bonus payout.</p>
                </div>

                {['technical', 'delivery', 'communication'].map((cat) => (
                  <div key={cat} className="rating-group">
                    <div className="flex justify-between mb-2">
                      <label className="capitalize">{cat} Excellence</label>
                      {selectedEmployee.scores?.self && (
                         <span className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">
                           Self-Rating: <strong>{selectedEmployee.scores.self[cat]}</strong>
                         </span>
                      )}
                    </div>
                    <div className="rating-options">
                        {[1,2,3,4,5].map(num => (
                            <button 
                              key={num} 
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
                <div className="section-header"><h3>Manager Feedback</h3></div>
                <div className="form-group">
                    <textarea 
                        className="form-textarea"
                        placeholder={`Write constructive feedback for ${selectedEmployee.name.split(' ')[0]}...`}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                    />
                </div>
            </div>

            <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setSelectedEmployee(null)}>Cancel</button>
                <button className="btn-save" onClick={handleSubmit}>Finalize Review</button>
            </div>
        </div>

        {/* RIGHT COLUMN: 360 RADAR CHART (SIDEBAR) */}
        <div className="review-sidebar">
             <div className="section-card">
                <div className="section-header">
                   <h3>360° Impact Analysis</h3>
                </div>
                
                {/* 3. The Spider Graph Integration */}
                <div className="h-[300px] w-full flex items-center justify-center -ml-4">
                    <PerformanceRadar data={radarData} />
                </div>

                <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-xs space-y-2">
                   <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-slate-300"><div className="w-2 h-2 rounded-full bg-indigo-500"></div> Self (20%)</span>
                      <span className="font-mono text-indigo-400">{selectedEmployee.scores?.self ? 'Submitted' : 'Pending'}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-slate-300"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Peers (30%)</span>
                      <span className="font-mono text-emerald-400">Avg: {selectedEmployee.scores?.peerAvg?.technical || 0}</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="flex items-center gap-2 text-slate-300"><div className="w-2 h-2 rounded-full bg-amber-500"></div> You (50%)</span>
                      <span className="font-mono text-amber-400">Live Input</span>
                   </div>
                </div>

                <div className="insight-note mt-4">
                  <Info size={16} className="shrink-0 mt-1" />
                  <p>Use the graph to identify gaps between self-perception and manager assessment before finalizing.</p>
                </div>
             </div>
        </div>
    </div>
  );
};

export default ManagerReview;