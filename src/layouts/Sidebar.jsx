import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Target, FileText, MessageSquare, GraduationCap, Settings, Users, ClipboardCheck, Calendar, Clock, DollarSign, Megaphone, Book } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; 
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user } = useAuth(); 

  // Defined based on AppRoutes.js structure
  const allMenuItems = [
    // --- Common ---
    { 
      path: '/dashboard', 
      icon: LayoutDashboard, 
      label: 'Dashboard',
      // No roles defined = visible to everyone
    },

    // --- Admin & Manager Only ---
    // { 
    //   path: '/approvals', 
    //   icon: ClipboardCheck, 
    //   label: 'Team Approvals', 
    //   allowedRoles: ['manager'] 
    // },

    // --- Admin Specific (Routes defined at bottom of AppRoutes) ---
    { 
      path: '/employees', 
      icon: Users, 
      label: 'Employees', 
      allowedRoles: ['admin'] 
    },
    // { 
    //   path: '/attendance', 
    //   icon: Clock, 
    //   label: 'Attendance', 
    //   allowedRoles: ['admin'] 
    // },
    // { 
    //   path: '/compensation', 
    //   icon: DollarSign, 
    //   label: 'Compensation', 
    //   allowedRoles: ['admin'] 
    // },
    // { 
    //   path: '/announcements', 
    //   icon: Megaphone, 
    //   label: 'Announcements', 
    //   allowedRoles: ['admin'] 
    // },
    // { 
    //   path: '/policies', 
    //   icon: Book, 
    //   label: 'Policies', 
    //   allowedRoles: ['admin'] 
    // },

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
    // { 
    //   path: '/leavepage', 
    //   icon: Calendar, 
    //   label: 'Leaves', 
    //   allowedRoles: ['employee', 'manager'] 
    // },
    { 
      path: '/feedback', 
      icon: MessageSquare, 
      label: 'Feedback', 
      allowedRoles: ['employee', 'manager'] 
    },
    // { 
    //   path: '/learning', 
    //   icon: GraduationCap, 
    //   label: 'Learning', 
    //   allowedRoles: ['employee', 'manager'] 
    // },

    // --- Common Settings ---
    { 
      path: '/settings', 
      icon: Settings, 
      label: 'Settings',
      // Visible to all roles per AppRoutes
    },
  ];

  // Filter items based on the user's role
  const visibleItems = allMenuItems.filter((item) => {
    // If no specific roles defined, show to everyone
    if (!item.allowedRoles) return true;
    
    // Check if user's role is included in the allowed list
    return item.allowedRoles.includes(user?.role);
  });

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-circle"></div>
        {/* Updated Title */}
        <h2>Navajna PMS</h2>
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