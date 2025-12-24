import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';

// Layouts
import Header from '../layouts/Header';
import Sidebar from '../layouts/Sidebar';
import ProtectedRoute from './ProtectedRoute';
import { ROLES } from './navigation';

// Features
import LoginPage from '../features/login/LoginPage';
import DashboardPage from '../features/dashboard/DashboardPage';
import TeamApprovals from '../features/approvals/TeamApprovals';
import GoalPage from '../features/goals/GoalPage';
import FeedbackPage from '../features/feedback/FeedbackPage';
import LearningPage from '../features/learning/LearningPage';
import SettingsPage from '../features/settings/SettingsPage';
import LeavePage from '../features/leaves/LeavePage';
import ReviewsPage from '../features/reviews/ReviewsPage';
import EmployeesPage from '../features/employees/EmployeeList';
import AttendancePage from '../features/attendance/AttendancePage';
import AnnouncementsPage from '../features/announcements/AnnouncementPage';
import AnnouncementViewPage from '../features/announcements/ViewAnnouncement';
import PolicyPage from '../features/policy/policy';

// 404 Component (Styled for Dark Mode)
const NotFound = () => (
  <div style={{ textAlign: 'center', marginTop: '50px', color: '#fff' }}>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <a href="/dashboard" style={{ color: '#90caf9' }}>Go to Dashboard</a>
  </div>
);

// --- FIX IS HERE: MainLayout Styles for DARK MODE ---
const MainLayout = () => (
  // 1. Set the outer container to a dark color to match your app theme
  <div className="app-container" style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#0b1120', color: '#ffffff' }}>
    
    {/* Sidebar */}
    <div style={{ flexShrink: 0 }}> 
      <Sidebar />
    </div>

    {/* Right Side: Header + Main Content */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      
      {/* HEADER WRAPPER: Removed 'backgroundColor: #ffffff' */}
      <div style={{ flexShrink: 0, zIndex: 10 }}>
        <Header />
      </div>

      {/* MAIN CONTENT: Removed 'backgroundColor: #f5f5f5' */}
      {/* Added explicit text color so text doesn't disappear on dark bg */}
      <main style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<MainLayout />}>
        {/* Common Routes */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN, ROLES.MANAGER, ROLES.EMPLOYEE]} />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />  
          <Route path="/settings" element={<SettingsPage />} /> 
          <Route path="/announcements/:id" element={<AnnouncementViewPage />} />    
        </Route>

        {/* Manager & Employee Only */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.EMPLOYEE, ROLES.MANAGER]} />}>
          <Route path="/leavepage" element={<LeavePage />} />
          <Route path="/reviews" element={<ReviewsPage />} /> 
          <Route path="/goals" element={<GoalPage />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/learning" element={<LearningPage />} />  
        </Route>
        {/* Manager Only */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.MANAGER]} />}>
          <Route path="/approvals" element={<TeamApprovals />} />
        </Route>
        {/* Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/announcements" element={<AnnouncementsPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/policies" element={<PolicyPage />} />
        </Route>

        {/*Need to update as pages are made*/}
        <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
          <Route path="/compensation" element={<SettingsPage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;