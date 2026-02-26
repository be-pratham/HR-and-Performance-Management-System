import React from 'react';

const SurfaceCard = ({ title, headerAction, children, className, ...props }) => {
  return (
    // We combine your default class with any new classes passed from the parent
    <div className={`dashboard-surface ${className || ''}`} {...props}>
      <div 
        className="surface-title" 
        style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%',
          marginBottom: '1rem' 
        }}
      >
        {typeof title === 'string' ? <h3 style={{ margin: 0 }}>{title}</h3> : title}
        
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