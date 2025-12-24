import React from 'react';
import { MoreVertical } from 'lucide-react';
import './ProgressWidget.css'; 

const ProgressWidget = ({ stats }) => {
  // Config for the chart
  const size = 160;
  const strokeWidth = 12;
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Use props if available, otherwise default to 0
  const { total = 0, completed = 0, inProgress = 0, notStarted = 0, overallPercentage = 0 } = stats || {};

  // Calculate segments based on real data counts
  const data = [
    { label: 'Completed', value: (completed / total) * 100 || 0, color: '#10b981' },    // Green
    { label: 'In Progress', value: (inProgress / total) * 100 || 0, color: '#3b82f6' }, // Blue
    { label: 'Not Started', value: (notStarted / total) * 100 || 0, color: '#64748b' }, // Grey
  ];

  let accumulatedPercent = 0;

  const segments = data.map((item, index) => {
    const strokeDasharray = `${(item.value / 100) * circumference} ${circumference}`;
    const rotateAngle = (accumulatedPercent / 100) * 360 - 90;
    accumulatedPercent += item.value;

    return (
      <circle
        key={index}
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke={item.color}
        strokeWidth={strokeWidth}
        strokeDasharray={strokeDasharray}
        strokeLinecap="round" 
        transform={`rotate(${rotateAngle} ${center} ${center})`}
        style={{ transition: 'all 1s ease-out' }} 
      />
    );
  });

  return (
    <div className="widget-card">
      <div className="widget-header">
        <h3>Overall Progress</h3>
        <MoreVertical size={16} className="icon-more" />
      </div>

      <div className="chart-container">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={center} cy={center} r={radius} fill="none" stroke="#1e293b" strokeWidth={strokeWidth} />
          {segments}
        </svg>

        <div className="chart-center-text">
          <span className="chart-value">{Math.round(overallPercentage)}%</span>
          <span className="chart-label">Completion</span>
        </div>
      </div>

      <div className="widget-stats">
        <div className="stat-item">
          <span className="stat-number color-green">{completed}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-item">
          <span className="stat-number color-blue">{inProgress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-item">
          <span className="stat-number" style={{color: '#64748b'}}>{notStarted}</span>
          <span className="stat-label">Not Started</span>
        </div>
        <div className="stat-full">
           <span className="stat-total">Total Goals: {total}</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressWidget;