import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { AttendanceProvider } from './context/AttendanceContext';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AttendanceProvider>
        <AppRoutes />
      </AttendanceProvider>
    </AuthProvider>
  );
}

export default App;