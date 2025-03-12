import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

const Login: React.FC<LoginProps> = ({ onSwitchToRegister }) => {
  const { login, loading, error } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [twoFactorError, setTwoFactorError] = useState('');

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset errors
    setEmailError('');
    setPasswordError('');
    setTwoFactorError('');

    // Validate inputs
    let isValid = true;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    }

    if (!password) {
      setPasswordError('Password is required');
      isValid = false;
    }

    if (!twoFactorCode) {
      setTwoFactorError('Two-factor authentication code is required');
      isValid = false;
    } else if (twoFactorCode.length !== 6 || !/^\d+$/.test(twoFactorCode)) {
      setTwoFactorError('Two-factor code must be 6 digits');
      isValid = false;
    }

    if (isValid) {
      await login(email, password, twoFactorCode);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}>
        <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
          Sign in to your account
        </Typography>

        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!passwordError}
            helperText={passwordError}
            disabled={loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <TextField
            margin="normal"
            required
            fullWidth
            name="twoFactorCode"
            label="Two-Factor Authentication Code"
            type="text"
            id="twoFactorCode"
            value={twoFactorCode}
            onChange={(e) => setTwoFactorCode(e.target.value)}
            error={!!twoFactorError}
            helperText={twoFactorError || 'For demo, use code: 123456'}
            disabled={loading}
            inputProps={{ maxLength: 6 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={onSwitchToRegister}
              underline="hover">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
