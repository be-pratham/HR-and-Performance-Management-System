import React, { useState } from 'react';
import { Play, Clock, Award, ShieldAlert, Search, BookOpen } from 'lucide-react';
import './LearningPage.css';

const LearningPage = () => {
  const [filter, setFilter] = useState('All');
  
  // Helper function for priority colors
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444'; 
      case 'Medium': return '#f98416ff'; 
      case 'Low': return '#4ade80';   
      default: return '#94a3b8';
    }
  };

  // Mock Data: In Progress
  const continueLearning = [
    {
      id: 1,
      title: "Advanced React Patterns",
      author: "Kent C. Dodds",
      progress: 65,
      totalTime: "4h 30m",
      image: "linear-gradient(135deg, #61dafb 0%, #282c34 100%)"
    },
    {
      id: 2,
      title: "AWS Solutions Architect Prep",
      author: "Amazon Web Services",
      progress: 30,
      totalTime: "12h 15m",
      image: "linear-gradient(135deg, #ff9900 0%, #232f3e 100%)"
    },
    {
      id: 3,
      title: "Effective Leadership 101",
      author: "Simon Sinek",
      progress: 85,
      totalTime: "2h 45m",
      image: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)"
    }
  ];

  // Mock Data: Assigned
  const assigned = [
    {
      id: 101,
      title: "2025 Data Security Compliance",
      due: "Due in 3 days",
      duration: "45 mins",
      priority: "High"
    },
    {
      id: 102,
      title: "Optimising Workplace Productivity",
      due: "Due: Dec 31, 2025",
      duration: "1h 30m",
      priority: "Medium"
    },
    {
      id: 103,
      title: "Corporate Dinner Etiquettes",
      due: "Due: Dec 31, 2025",
      duration: "30m",
      priority: "Low"
    }
  ];

  // Mock Data: Catalog
  const catalog = [
    { id: 201, title: "Figma for Developers", category: "Design", duration: "3h", rating: 4.8, icon: "🎨" },
    { id: 202, title: "Docker & Kubernetes", category: "DevOps", duration: "6h", rating: 4.9, icon: "🐳" },
    { id: 203, title: "Public Speaking Mastery", category: "Soft Skills", duration: "2h", rating: 4.7, icon: "🎤" },
    { id: 204, title: "Financial Planning", category: "Finance", duration: "1h", rating: 4.5, icon: "💰" },
  ];

  const filteredCatalog = filter === 'All' ? catalog : catalog.filter(c => c.category === filter);

  return (
    <div className="learning-container">
      {/* Header */}
      <div className="page-header">
        <div className="header-text">
            <h1>Learning & Development</h1>
            <p>Expand your skills and track mandatory training.</p>
        </div>
      </div>

      {/* 1. Continue Learning */}
      <div className="hero-section">
        <h3>Continue Learning</h3>
        <div className="continue-grid">
            {continueLearning.map(course => (
                <div key={course.id} className="course-card-active">
                    <div className="course-thumbnail" style={{background: course.image}}>
                        <div className="play-overlay">
                            <button className="play-btn"><Play size={20} fill="black" /></button>
                        </div>
                    </div>
                    <div className="course-info">
                        <div className="course-title">{course.title}</div>
                        <div className="course-author">{course.author}</div>
                        <div className="progress-row">
                            <div className="progress-text">
                                <span>{course.progress}% Complete</span>
                                <span>{course.totalTime} left</span>
                            </div>
                            <div className="progress-track">
                                <div className="progress-fill" style={{width: `${course.progress}%`}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* 2. Split Section: Assigned & Catalog */}
      <div className="feedback-grid" style={{gridTemplateColumns: '1fr 2fr'}}>
         
         {/* Left: Assigned */}
         <div className="assigned-section">
            <div className="section-header-row">
                <h3>Assigned to You</h3>
            </div>
            <div className="assigned-list">
                {assigned.map(item => {
                    const priorityColor = getPriorityColor(item.priority);
                    
                    return (
                        <div key={item.id} className="assigned-item">
                            <div className="assigned-left">
                                <div className="assigned-icon">
                                    {/* Applied color to the icon */}
                                    <ShieldAlert size={20} color={priorityColor} />
                                </div>
                                <div className="assigned-details">
                                    <h4>{item.title}</h4>
                                    {/* Applied color to text and displayed priority */}
                                    <p style={{ color: priorityColor, fontWeight: 500 }}>
                                        {item.duration} • {item.priority} Priority
                                    </p>
                                </div>
                            </div>
                            <span className="badge-due">{item.due}</span>
                        </div>
                    );
                })}
            </div>
         </div>

         {/* Right: Catalog */}
         <div className="catalog-section">
            <div className="section-header-row">
                <h3>Browse Catalog</h3>
                <div style={{position:'relative'}}>
                    <Search size={16} style={{position:'absolute', left:10, top:10, color:'#94a3b8'}} />
                    <input 
                        type="text" 
                        placeholder="Search courses..." 
                        style={{
                            background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', 
                            padding:'8px 8px 8px 32px', borderRadius:'20px', color:'white', outline:'none', fontSize:'0.85rem'
                        }} 
                    />
                </div>
            </div>

            <div className="catalog-filters">
                {['All', 'Design', 'DevOps', 'Soft Skills'].map(f => (
                    <button 
                        key={f} 
                        className={`filter-btn ${filter === f ? 'active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="continue-grid" style={{gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))'}}>
                {filteredCatalog.map(item => (
                    <div key={item.id} className="catalog-card">
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                             <div className="catalog-icon">{item.icon}</div>
                             <button className="icon-btn"><BookOpen size={18}/></button>
                        </div>
                        <div>
                             <h4 style={{margin:'0 0 4px 0', fontSize:'0.95rem'}}>{item.title}</h4>
                             <span style={{fontSize:'0.75rem', color:'#94a3b8'}}>{item.category}</span>
                        </div>
                        <div className="catalog-meta">
                            <span style={{display:'flex', alignItems:'center', gap:4}}><Clock size={12}/> {item.duration}</span>
                            <span style={{color:'#fbbf24'}}>★ {item.rating}</span>
                        </div>
                    </div>
                ))}
            </div>
         </div>

      </div>
    </div>
  );
};

export default LearningPage;