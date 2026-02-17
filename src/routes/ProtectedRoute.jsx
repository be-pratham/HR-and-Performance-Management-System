import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ allowedRoles }) => {
  // 1. Grab auth state from Redux
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  // 2. Handle the "Bootstrapping" state
  // If the app is still checking localStorage on refresh, show a loader
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // 3. If not logged in, redirect to login
  // We save the 'from' location so we can redirect them back after they log in
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 4. Role-Based Access Control (RBAC) check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to a neutral page (like dashboard) if they aren't authorized for this specific route
    return <Navigate to="/dashboard" replace />;
  }

  // 5. If all checks pass, render the child routes (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;