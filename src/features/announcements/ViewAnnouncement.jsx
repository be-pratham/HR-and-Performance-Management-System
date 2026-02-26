import React, { useEffect } from 'react'; // Added useEffect
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Added
import { ArrowLeft, Calendar, User } from 'lucide-react';
import { markAsRead } from './announcementsSlice'; // Added

const AnnouncementViewPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { announcement } = location.state || {};

  // 1. Mark as read when the user views the announcement
  useEffect(() => {
    if (announcement && !announcement.read) {
      dispatch(markAsRead(announcement.id));
    }
  }, [dispatch, announcement]);

  if (!announcement) {
    return (
      <div style={{ padding: '50px', textAlign: 'center', color: '#fff' }}>
        <h2>Announcement not found</h2>
        <button onClick={() => navigate('/announcements')} style={{ color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer', marginTop: '10px' }}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', color: '#fff', maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', marginBottom: '20px', fontSize: '14px' }}
      >
        <ArrowLeft size={18} /> Back 
      </button>

      <div style={{ backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', overflow: 'hidden' }}>
        <div style={{ padding: '30px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
             <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '99px', backgroundColor: announcement.priority === 'High' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.2)', color: announcement.priority === 'High' ? '#f87171' : '#60a5fa', fontWeight: '500' }}>
                {announcement.priority} Priority
             </span>
             <span style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '99px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: '500' }}>
                {announcement.category}
             </span>
          </div>
          
          <h1 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '15px', lineHeight: '1.3' }}>{announcement.title}</h1>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#94a3b8', fontSize: '14px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {announcement.date}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {announcement.author}</span>
          </div>
        </div>

        <div style={{ padding: '40px', fontSize: '16px', lineHeight: '1.8', color: '#e2e8f0' }}>
          <div style={{ whiteSpace: 'pre-wrap' }}>
            {announcement.content}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementViewPage;