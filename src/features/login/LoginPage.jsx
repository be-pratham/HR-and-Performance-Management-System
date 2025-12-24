import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Box, Paper, Typography, TextField, Button, Alert, InputAdornment } from '@mui/material';
import { Lock, Mail } from 'lucide-react';

// Import the CSS file
import './LoginPage.css';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = login(email, password);

    if (result.success) {
      // FIX: Always navigate to /dashboard.
      // The DashboardPage component will detect the role and show the correct view.
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  return (
    <Box className="login-container">
      <Paper elevation={24} className="login-paper">
        
        <Box className="login-header">
          <div className="logo-circle"></div>
          <Typography variant="h4" className="login-title">Navajna HRMS</Typography>
          <Typography variant="body2" className="login-subtitle">Sign in to continue</Typography>
        </Box>

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
          >
            Sign In
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