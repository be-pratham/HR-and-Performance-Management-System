import React from 'react';

const StatCard = ({ icon: Icon, label, value, color, variant = "standard" }) => {
  if (variant === "compact") {
    return (
      <div className={`stat-card-compact ${color}`}>
        <div className="stat-icon-wrapper-sm">
          <Icon size={20} />
        </div>
        <div className="stat-stack">
          <div className="stat-val-sm">{value}</div>
          <div className="stat-label-sm">{label}</div>
        </div>
      </div>
    );
  }

  // Standard Variant
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-icon-wrapper">
        <Icon size={24} />
      </div>
      <div className="stat-card-content">
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
      </div>
    </div>
  );
};

export default StatCard;