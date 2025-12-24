import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

// Import the Child Views
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import AdminDashboard from './components/AdminDashboard';

const DashboardPage = () => {
  const { user, loading } = useAuth();

  // 1. Loading State
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

  // 2. Safety Check: If no user is found
  if (!user) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Authentication Error</Typography>
        <Typography sx={{ color: 'var(--text-secondary)' }}>Please log in again to access your dashboard.</Typography>
      </Box>
    );
  }

  // 3. The Switch Logic
  switch (user.role?.toLowerCase()) {
    case 'admin':
    case 'hr':
      return <AdminDashboard />;

    case 'manager':
      return <ManagerDashboard />;
    
    case 'employee':
    case 'staff':
      return <EmployeeDashboard />;
      
    default:
      // Fallback for unknown or missing roles
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
            Your account role <strong>({user.role || 'None'})</strong> does not have a dashboard assigned. 
            Please contact IT Support.
          </Typography>
        </Box>
      );
  }
};
export default DashboardPage;