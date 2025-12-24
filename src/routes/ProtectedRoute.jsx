// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import your specific context

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>; // Or a nice Spinner component
  }

  // 1. Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 2. Check if user has the required role (if specific roles are required)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have permission (e.g., Employee trying to access Admin Settings)
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;