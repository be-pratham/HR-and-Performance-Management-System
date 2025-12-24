import React, { useState, useEffect } from 'react';
import { Heart, MessageSquare, Send, Save, Lock, Plus, X, Check } from 'lucide-react';
import './FeedbackPage.css';
import '../../components/ui/modal.css'; 

const FeedbackPage = () => {
  // --- STATE ---
  const [showKudosModal, setShowKudosModal] = useState(false);
  const [snackbar, setSnackbar] = useState({ show: false, message: '' });
  
  // Private Note State
  const [privateNote, setPrivateNote] = useState('');

  // Feed Data State
  const [feed, setFeed] = useState([
    {
      id: 1,
      sender: "Sarah Jenkins",
      senderInitials: "SJ",
      receiver: "Pratham",
      message: "Huge thanks for debugging that production issue late last night. You're a lifesaver!",
      tags: ["Teamwork", "Dedication"],
      time: "2 hours ago",
      likes: 4,
      likedByMe: false
    },
    {
      id: 2,
      sender: "Mike Ross",
      senderInitials: "MR",
      receiver: "Design Team",
      message: "The new UI kit looks absolutely stunning. Great work on the consistency.",
      tags: ["Innovation", "Quality"],
      time: "5 hours ago",
      likes: 12,
      likedByMe: true
    }
  ]);

  // Form State for Kudos
  const [kudosForm, setKudosForm] = useState({ receiver: '', message: '', tag: 'Teamwork' });

  // --- EFFECTS ---
  useEffect(() => {
    // Load note from local storage
    const savedNote = localStorage.getItem('navajna_private_note');
    if (savedNote) setPrivateNote(savedNote);
  }, []);

  // --- HANDLERS ---
  const handleSaveNote = () => {
    localStorage.setItem('navajna_private_note', privateNote);
    triggerSnackbar("Private note saved!");
  };

  const handleLike = (id) => {
    setFeed(feed.map(item => {
      if (item.id === id) {
        return {
          ...item,
          likes: item.likedByMe ? item.likes - 1 : item.likes + 1,
          likedByMe: !item.likedByMe
        };
      }
      return item;
    }));
  };

  const handleSubmitKudos = () => {
    if (!kudosForm.receiver || !kudosForm.message) return;

    const newPost = {
      id: Date.now(),
      sender: "Pratham", // Current User
      senderInitials: "PB",
      receiver: kudosForm.receiver,
      message: kudosForm.message,
      tags: [kudosForm.tag],
      time: "Just now",
      likes: 0,
      likedByMe: false
    };

    setFeed([newPost, ...feed]);
    setShowKudosModal(false);
    setKudosForm({ receiver: '', message: '', tag: 'Teamwork' });
    triggerSnackbar("Kudos sent successfully!");
  };

  const handleRequestFeedback = () => {
    triggerSnackbar("Feedback request sent to your team.");
  };

  const triggerSnackbar = (msg) => {
    setSnackbar({ show: true, message: msg });
    setTimeout(() => setSnackbar({ show: false, message: '' }), 3000);
  };

  return (
    <div className="feedback-container">
      <div className="page-header">
         <div className="header-text">
            <h1>Feedback & Recognition</h1>
            <p>Celebrate wins and track personal growth</p>
         </div>
      </div>

      <div className="feedback-grid">
        {/* LEFT COLUMN: The Feed */}
        <div className="feed-section">
          <div className="feed-header">
            <h3>Latest Activity</h3>
            <span style={{color: '#94a3b8', fontSize: '0.9rem'}}>Showing all team updates</span>
          </div>

          <div className="feed-list">
            {feed.map(item => (
              <div key={item.id} className="kudos-card">
                <div className="kudos-avatar">{item.senderInitials}</div>
                <div className="kudos-content">
                  <div className="kudos-meta">
                    <div className="kudos-author">
                      {item.sender} <span>recognized</span> {item.receiver}
                    </div>
                    <span className="kudos-time">{item.time}</span>
                  </div>
                  
                  <p className="kudos-message">{item.message}</p>
                  
                  <div className="kudos-tags">
                    {item.tags.map(tag => (
                      <span key={tag} className={`tag ${tag}`}>{tag}</span>
                    ))}
                  </div>

                  <div className="kudos-actions">
                    <button 
                      className={`action-btn ${item.likedByMe ? 'liked' : ''}`}
                      onClick={() => handleLike(item.id)}
                    >
                      <Heart size={16} fill={item.likedByMe ? "currentColor" : "none"} /> 
                      {item.likes}
                    </button>
                    <button className="action-btn">
                      <MessageSquare size={16} /> Comment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Actions & Notes */}
        <div className="feedback-sidebar">
          
          <div className="quick-actions">
            <button className="btn-large btn-kudos" onClick={() => setShowKudosModal(true)}>
               <Heart size={20} /> Give Kudos
            </button>
            <button className="btn-large btn-request" onClick={handleRequestFeedback}>
               <Send size={20} /> Request Feedback
            </button>
          </div>

          <div className="notes-widget">
            <div className="notes-header">
               <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                 <Lock size={14} color="#94a3b8"/>
                 <h4>Private Notes</h4>
               </div>
               <button 
                 className="icon-btn" 
                 onClick={handleSaveNote}
                 title="Save Note"
               >
                 <Save size={16} />
               </button>
            </div>
            <textarea 
              className="notes-area" 
              placeholder="Jot down notes about your performance, wins, or things to discuss in your next 1:1..."
              value={privateNote}
              onChange={(e) => setPrivateNote(e.target.value)}
            />
            <div style={{fontSize: '0.75rem', color: '#64748b', textAlign: 'right'}}>
              Visible only to you
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL: Give Kudos --- */}
      {showKudosModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Give Kudos</h2>
              <X className="icon-btn" onClick={() => setShowKudosModal(false)} />
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>To (Colleague's Name)</label>
                <input 
                  className="form-input" 
                  placeholder="e.g. Sarah Jenkins"
                  value={kudosForm.receiver}
                  onChange={e => setKudosForm({...kudosForm, receiver: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Select a Value</label>
                <div className="tag-selector">
                  {['Teamwork', 'Leadership', 'Innovation', 'Dedication'].map(tag => (
                    <button 
                      key={tag}
                      className={`tag-chip ${kudosForm.tag === tag ? 'selected' : ''}`}
                      onClick={() => setKudosForm({...kudosForm, tag: tag})}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Message</label>
                <textarea 
                  className="form-textarea" 
                  placeholder="What did they do well?"
                  value={kudosForm.message}
                  onChange={e => setKudosForm({...kudosForm, message: e.target.value})}
                />
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowKudosModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmitKudos}>Send Kudos</button>
            </div>
          </div>
        </div>
      )}

      {/* --- SNACKBAR --- */}
      <div className={`snackbar ${snackbar.show ? 'show' : ''}`}>
        <Check size={18} /> <span>{snackbar.message}</span>
      </div>
    </div>
  );
};

export default FeedbackPage;