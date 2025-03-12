import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Login from '../components/auth/Login';
import Register from '../components/auth/Register';
import { useAuth } from '../context/AuthContext';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {isLogin ? (
        <Login onSwitchToRegister={handleSwitchToRegister} />
      ) : (
        <Register onSwitchToLogin={handleSwitchToLogin} />
      )}
    </Box>
  );
};

export default AuthPage;
