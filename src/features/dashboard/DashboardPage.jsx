import React, { Suspense, lazy } from 'react';
import { useSelector } from 'react-redux';
import { Box, CircularProgress, Typography } from '@mui/material';
import './DashboardStyles.css';


// Lazy load the child views
const AdminDashboard = lazy(() => import('./views/AdminDashboard'));
const ManagerDashboard = lazy(() => import('./views/ManagerDashboard'));
const EmployeeDashboard = lazy(() => import('./views/EmployeeDashboard'));

const DashboardPage = () => {
  const { user, loading } = useSelector((state) => state.auth);

  // Fallback UI for when the component is downloading or auth is checking
  const LoadingScreen = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', gap: 2 }}>
      <CircularProgress sx={{ color: 'var(--brand-blue)' }} />
      <Typography sx={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</Typography>
    </Box>
  );

  if (loading) return <LoadingScreen />;

  const userRole = user?.role?.toLowerCase();

  return (
    <Suspense fallback={<LoadingScreen />}>
      {(() => {
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
              <Box sx={{ p: 6, m: 4, backgroundColor: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <Typography variant="h5" sx={{ color: 'var(--text-primary)', mb: 2 }}>Access Restricted</Typography>
                <Typography sx={{ color: 'var(--text-secondary)' }}>
                  Your account role <strong>({user?.role || 'None'})</strong> does not have a dashboard assigned. 
                </Typography>
              </Box>
            );
        }
      })()}
    </Suspense>
  );
};

export default DashboardPage;