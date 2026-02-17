import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../store/reducers/authSlice'; // Path to your new slice
import { Box, Paper, Typography, TextField, Button, Alert, InputAdornment, CircularProgress } from '@mui/material';
import { Lock, Mail } from 'lucide-react';

// Import the CSS file
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 1. Hook into Redux state
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // 2. Clear previous errors when the user starts typing again
  useEffect(() => {
    if (error) {
      dispatch(clearError());
    }
  }, [email, password, dispatch]);

  // 3. Redirect if already authenticated (e.g., on page refresh)
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 4. Dispatch the async thunk
    try {
      await dispatch(loginUser({ email, password })).unwrap();
      // If unwrap succeeds, the useEffect above will handle navigation, 
      // or you can navigate here:
      navigate('/dashboard');
    } catch (err) {
      // Errors are handled by the slice and accessible via useSelector
      console.error("Login failed: ", err);
    }
  };

  return (
    <Box className="login-container">
      <Paper elevation={24} className="login-paper">
        
        <Box className="login-header">
          <div className="logo-circle"></div>
          <Typography variant="h4" className="login-title">Welcome to HRMS</Typography>
          <Typography variant="body2" className="login-subtitle">Sign in to continue</Typography>
        </Box>

        {/* 5. Display Redux error */}
        {error && (
          <Alert severity="error" className="login-alert">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Address"
            variant="outlined"
            margin="normal"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Mail size={20} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            margin="normal"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock size={20} color="#94a3b8" />
                </InputAdornment>
              ),
            }}
          />

          <Button 
            fullWidth 
            type="submit" 
            variant="contained" 
            size="large" 
            className="login-button"
            disabled={loading} // 6. Disable button while loading
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign In'}
          </Button>

          {/* Helper Text for Demo */}
          <Box className="login-helper-box">
            <Typography variant="caption" className="login-helper-text">
              <strong className="highlight">Manager:</strong> manager@gmail.com / manager
            </Typography>
            <Typography variant="caption" className="login-helper-text">
              <strong className="highlight">Employee:</strong> employee@gmail.com / employee
            </Typography>
            <Typography variant="caption" className="login-helper-text">
              <strong className="highlight">Admin:</strong> admin@gmail.com / admin
            </Typography>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default LoginPage;