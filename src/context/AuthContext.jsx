import React, { createContext, useContext, useState, useEffect } from 'react';

// FIX: Added 'export' here so other files can import { AuthContext }
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // 1. INITIALIZE STATE FROM LOCAL STORAGE
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Error parsing user from local storage", error);
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  // MOCK LOGIN FUNCTION
  const login = (email, password) => {
    setLoading(true);

    // Simulate API delay
    let userData = null;

    if (email === 'manager@gmail.com' && password === 'manager') {
      userData = { 
        id: 1, 
        name: 'Pratham Bhardwaj', 
        email, 
        role: 'manager',
        avatar: 'P'
      };
    } else if (email === 'employee@gmail.com' && password === 'employee') {
      userData = { 
        id: 2, 
        name: 'Alice Johnson', 
        email, 
        role: 'employee',
        avatar: 'A'
      };
    } else if (email === 'admin@gmail.com' && password === 'admin') {
      userData = { 
        id: 3, 
        name: 'Super Admin', 
        email, 
        role: 'admin',
        avatar: 'S'
      };
    }

    if (userData) {
      setUser(userData);
      // 2. SAVE TO LOCAL STORAGE
      localStorage.setItem('user', JSON.stringify(userData));
      setLoading(false);
      return { success: true, role: userData.role };
    } else {
      setLoading(false);
      return { success: false, message: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    // 3. REMOVE FROM LOCAL STORAGE
    localStorage.removeItem('user');
  };

  // Helper to check specific roles
  const hasRole = (allowedRoles) => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);