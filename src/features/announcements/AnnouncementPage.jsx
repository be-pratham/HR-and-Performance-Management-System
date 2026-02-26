import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'; // Added
import { Megaphone, Plus, X, Calendar, User, ChevronRight } from 'lucide-react';
// Import your actions
import { setAnnouncements, addAnnouncement } from './announcementsSlice'; 

const INITIAL_DATA = [
  { id: 101, title: "Q4 Town Hall Meeting", category: "Events", date: "2025-12-15", author: "Management", priority: "High", content: "Join us for the quarterly all-hands meeting.", read: false },
  { id: 102, title: "Office Holiday Party", category: "Social", date: "2025-12-20", author: "HR Team", priority: "Normal", content: "Don't forget to RSVP!", read: false },
];

const AnnouncementsPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // 1. Pull data from Redux instead of local useState
  const announcements = useSelector((state) => state.announcements.list);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', category: 'General', priority: 'Normal', content: '' });

  // 2. Initialize store with data if list is empty
  useEffect(() => {
    if (announcements.length === 0) {
      dispatch(setAnnouncements(INITIAL_DATA));
    }
  }, [dispatch, announcements.length]);

  const handleViewAnnouncement = (announcement) => {
    navigate(`/announcements/${announcement.id}`, { state: { announcement } });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newAnnouncement = {
      id: Date.now(), // Use timestamp for unique ID
      date: new Date().toISOString().split('T')[0],
      author: "You (Admin)",
      read: false, // Ensure unreadCount tracks this
      ...formData
    };

    // 3. Dispatch action to Redux
    dispatch(addAnnouncement(newAnnouncement));
    
    setIsModalOpen(false);
    setFormData({ title: '', category: 'General', priority: 'Normal', content: '' });
  };

  // Styles (unchanged)
  const cardStyle = { backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155', padding: '20px', cursor: 'pointer', marginBottom: '16px' };
  const inputStyle = { width: '100%', padding: '10px', marginTop: '5px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff' };

  return (
    <div style={{ padding: '20px', color: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Megaphone size={28} color="#f59e0b" /> Company Announcements
          </h1>
          {/* Visualizing the unread count from Redux */}
          <p style={{ color: '#94a3b8', marginTop: '5px' }}>You have {announcements.filter(a => !a.read).length} unread updates.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} style={{ backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Plus size={18} /> Post Announcement
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {announcements.map((item) => (
          <div key={item.id} style={{...cardStyle, borderLeft: item.read ? '1px solid #334155' : '4px solid #3b82f6'}} onClick={() => handleViewAnnouncement(item)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', padding: '2px 8px', borderRadius: '4px', backgroundColor: item.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: item.priority === 'High' ? '#f87171' : '#60a5fa' }}>{item.priority}</span>
                  {!item.read && <span style={{ fontSize: '10px', backgroundColor: '#3b82f6', color: 'white', padding: '2px 6px', borderRadius: '4px' }}>NEW</span>}
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: item.read ? '400' : '600', marginBottom: '6px' }}>{item.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} /> {item.date}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={14} /> {item.author}</span>
                </p>
              </div>
              <ChevronRight color="#475569" />
            </div>
          </div>
        ))}
      </div>

      {/* Modal remains the same as your provided code */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: '#1e293b', width: '500px', padding: '24px', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>New Announcement</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={24} /></button>
            </div>
            <form onSubmit={handleSubmit}>
              <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Title</label>
              <input required style={inputStyle} value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Category</label>
                  <select style={inputStyle} value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                    <option>General</option><option>HR</option><option>Policy</option><option>Events</option><option>Social</option>
                  </select>
                </div>
                <div>
                  <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Priority</label>
                  <select style={inputStyle} value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
                    <option>Normal</option><option>High</option>
                  </select>
                </div>
              </div>
              <label style={{ color: '#94a3b8', fontSize: '0.9rem' }}>Content</label>
              <textarea required rows="6" style={{ ...inputStyle, resize: 'none' }} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
              <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#3b82f6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Post Announcement</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;A