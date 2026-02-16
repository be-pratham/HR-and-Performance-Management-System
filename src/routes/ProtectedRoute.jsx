// src/components/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User is logged in but doesn't have permission (e.g., Employee trying to access Admin Settings)
    return <Navigate to="/unauthorized" replace />;
  }
  // 3. If all checks pass, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;