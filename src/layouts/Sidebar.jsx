import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, FileText, MessageSquare, GraduationCap, Settings, Users, ClipboardCheck, Calendar, Clock, DollarSign, Megaphone, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useAuth(); 

  const allMenuItems = [

    // --- Common ---
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
    
    // --- Employee & Manager Specific ---
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
  ];

  const visibleItems = allMenuItems.filter((item) => {
    if (!item.allowedRoles) return true;
    
    return item.allowedRoles.includes(user?.role);
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