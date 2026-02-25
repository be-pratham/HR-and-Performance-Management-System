import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Redux Hook
import { LayoutDashboard, Target, FileText, MessageSquare, Settings, Users, Coins } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get user from Redux
  const { user } = useSelector((state) => state.auth); 

  const allMenuItems = [
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
    },
    { 
      path: '/employees', 
      icon: Users, 
      label: 'Employees', 
      allowedRoles: ['admin'] 
    },
    { 
      path: '/goals', 
      icon: Target, 
      label: 'My Goals', 
      allowedRoles: ['employee', 'manager'] 
    },
    { 
      path: '/reviews', 
      icon: FileText, 
      label: 'Performance', 
      allowedRoles: ['employee', 'manager'] 
    },
    { 
      path: '/feedback', 
      icon: MessageSquare, 
      label: 'Feedback', 
      allowedRoles: ['employee', 'manager'] 
    },
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
    },
    { 
      path: '/bonus', 
      icon: Coins,
      label: 'Bonus',
      allowedRoles: ['admin']
    },
  ];

  // Filter items based on the Redux user role
  const visibleItems = allMenuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    return item.allowedRoles.includes(user?.role?.toLowerCase());
  });

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle"></div>
        <h2>HRMS</h2>
      </div>

      <nav className="sidebar-menu">
        {visibleItems.map((item) => (
          <div key={item.path} 
            className={`menu-item ${
              location.pathname === item.path || location.pathname.startsWith(`${item.path}/`) 
              ? 'active' : ''}`}
            onClick={() => navigate(item.path)}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;