import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Container
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff,
  LocalHospital as HospitalIcon,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin({
        name: 'Ira Mialik',
        role: 'Secretary',
        avatar: 'https://via.placeholder.com/40'
      });
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: '#f5f5f5',
        backgroundImage: `
          radial-gradient(circle at 25% 25%, rgba(73, 155, 234, 0.1) 0%, transparent 40%),
          radial-gradient(circle at 75% 75%, rgba(129, 199, 132, 0.1) 0%, transparent 40%)
        `
      }}
    >
      {/* Header */}
      <Box
        sx={{
          bgcolor: 'white',
          py: 2,
          px: 4,
          boxShadow: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <HospitalIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Typography variant="h4" color="primary.main" fontWeight="500">
          Clinic Point
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="sm" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderRadius: 2
          }}
        >
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <HospitalIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h5" gutterBottom fontWeight="500">
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your clinic management system
            </Typography>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError('')}
              sx={{ borderRadius: 1 }}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                autoFocus
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                error={!!error}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  bgcolor: 'primary.main',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  }
                }}
              >
                Sign In
              </Button>
            </Box>
          </form>

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              For demo purposes: Username: admin | Password: admin
            </Typography>
          </Box>

          {/* Footer */}
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="text.secondary">
              © {new Date().getFullYear()} Clinic Point. All rights reserved.
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default LoginPage; 