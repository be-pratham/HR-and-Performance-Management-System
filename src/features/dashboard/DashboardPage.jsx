import React from 'react';
import { useSelector } from 'react-redux'; // 1. Use Redux hooks
import { Box, CircularProgress, Typography } from '@mui/material';

// Import the Child Views
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

const DashboardPage = () => {
  // 2. Grab auth state from Redux
  const { user, loading } = useSelector((state) => state.auth);

  // 3. Loading State
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '60vh',
        gap: 2 
      }}>
        <CircularProgress sx={{ color: 'var(--brand-blue)' }} />
        <Typography sx={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</Typography>
      </Box>
    );
  }

  // 4. Clean Switch Logic
  // We no longer need the "if (!user)" block here because 
  // ProtectedRoute handles that. If we are here, user exists.
  
  const userRole = user?.role?.toLowerCase();

  switch (userRole) {
    case 'admin':
    case 'hr':
      return <AdminDashboard />;

    case 'manager':
      return <ManagerDashboard />;
    
    case 'employee':
    case 'staff':
      return <EmployeeDashboard />;
      
    default:
      return (
        <Box sx={{ 
          p: 6, 
          m: 4, 
          backgroundColor: 'var(--bg-card)', 
          borderRadius: '16px', 
          border: '1px solid var(--border-subtle)',
          textAlign: 'center' 
        }}>
          <Typography variant="h5" sx={{ color: 'var(--text-primary)', mb: 2 }}>
            Access Restricted
          </Typography>
          <Typography sx={{ color: 'var(--text-secondary)' }}>
            Your account role <strong>({user?.role || 'None'})</strong> does not have a dashboard assigned. 
          </Typography>
        </Box>
      );
  }
};

export default DashboardPage;