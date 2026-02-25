import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, CircularProgress } from '@mui/material';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#0b1120">
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize roles to lowercase to prevent "Manager" vs "manager" mismatches
  const userRole = user.role?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

  if (allowedRoles && !normalizedAllowedRoles.includes(userRole)) {
    // If they are an Admin trying to access an Employee page, send them to Admin Dashboard
    // If they are an Employee trying to access Admin page, send them to Employee Dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;