import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Edit2, RotateCcw, Clock } from 'lucide-react';
import './GoalCard.css';

const GoalCard = ({ data, defaultExpanded = false, onUpdateProgress, onEdit, onHistory }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="goal-card">
      {/* Header */}
      <div className="goal-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="goal-title-section">
            <h3>{data.title}</h3>
            {/* Show category tag for debugging visibility */}
            <span style={{fontSize: '0.7rem', color: '#64748b', marginLeft: '10px'}}>
              {data.category} • {data.priority}
            </span>
        </div>
        
        <div className="goal-meta-section">
            <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${data.progress}%` }}></div>
            </div>
            <span className="percentage">{Math.round(data.progress)}%</span>
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>

      {/* Expanded Body */}
      {isExpanded && (
        <div className="goal-body">
            <p className="goal-description">{data.description}</p>
            
            {/* Footer Actions */}
            <div className="goal-footer">
                <div className="footer-icons">
                    {/* EDIT BUTTON */}
                    <div className="icon-wrapper" onClick={() => onEdit(data)} title="Edit Details">
                      <Edit2 size={18} />
                    </div>
                    {/* HISTORY BUTTON */}
                    <div className="icon-wrapper" onClick={() => onHistory(data)} title="View History">
                      <Clock size={18} />
                    </div>
                </div>
                {/* UPDATE PROGRESS BUTTON */}
                <button className="btn-outline" onClick={() => onUpdateProgress(data)}>
                  Update Progress / Tasks
                </button>
            </div>
        </div>
      )}
    </div>
  );
};

export default GoalCard;