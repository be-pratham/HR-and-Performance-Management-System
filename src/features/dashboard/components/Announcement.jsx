import React, { useState } from 'react';
import { Bell, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AnnouncementWidget = ({ announcements }) => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const ITEMS_PER_PAGE = 2;
  const totalPages = Math.ceil(announcements.length / ITEMS_PER_PAGE);
  
  const currentItems = announcements.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div className="dashboard-surface">
      <div className="surface-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>Company Announcements <Bell size={20} /></h3>
        <div className="pagination-controls">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}><ChevronLeft /></button>
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}><ChevronRight /></button>
        </div>
      </div>
      <div className="announcement-list">
        {currentItems.map(item => (
          <div key={item.id} className="announcement-item" onClick={() => navigate(`/announcements/${item.id}`)}>
             <div className="announce-date-box"><span>{item.day}</span><span>{item.month}</span></div>
             <div className="announce-content"><h4>{item.title}</h4><p>{item.content.substring(0, 50)}...</p></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementWidget;