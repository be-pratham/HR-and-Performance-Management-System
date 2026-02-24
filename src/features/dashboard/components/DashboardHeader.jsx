import React from 'react';

const DashboardHeader = ({ title, subtitle, rightContent }) => {
  return (
    <div className="dashboard-header">
      <div>
        <h1 className="dashboard-title">{title}</h1>
        {subtitle && <div className="dashboard-subtitle">{subtitle}</div>}
      </div>
      
      {rightContent && (
        <div className="header-actions">
          {rightContent}
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;