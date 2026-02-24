import React from 'react';

const SurfaceCard = ({ title, headerAction, children }) => {
  return (
    <div className="dashboard-surface">
      <div className="surface-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
        {typeof title === 'string' ? <h3>{title}</h3> : title}
        
        {headerAction && (
          <div className="surface-action">
            {headerAction}
          </div>
        )}
      </div>
      
      <div className="surface-content">
        {children}
      </div>
    </div>
  );
};

export default SurfaceCard;