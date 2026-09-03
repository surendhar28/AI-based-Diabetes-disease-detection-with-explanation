import React, { useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
  Tab,
  Tabs,
  InputAdornment,
  IconButton,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { loginUser, registerUser } from '../services/api.js';

export default function Login({ onAuthSuccess, initialRole = 'doctor' }) {
  const [tab, setTab] = useState(0); // 0 = Login, 1 = Register
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(initialRole);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (tab === 0) {
        // Login
        const response = await loginUser({ email, password });
        onAuthSuccess(response.access_token);
      } else {
        // Register
        if (password.length < 8) {
          setError('Password must be at least 8 characters long.');
          setLoading(false);
          return;
        }
        const response = await registerUser({
          email,
          password,
          full_name: fullName,
          role,
        });
        onAuthSuccess(response.access_token);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 2 }}>
      <Stack spacing={3} alignItems="center">
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              bgcolor: 'primary.main',
              color: 'background.default',
              p: 1.2,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: (theme) => `0 4px 20px ${theme.palette.primary.main}40`,
            }}
          >
            <MedicalServicesIcon fontSize="medium" />
          </Box>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 900,
              letterSpacing: '-0.02em',
              background: (theme) =>
                theme.palette.mode === 'light'
                  ? 'linear-gradient(135deg, #0f766e 0%, #7c3aed 100%)'
                  : 'linear-gradient(135deg, #14b8a6 0%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Agentic Healthcare
          </Typography>
        </Stack>

        <Card
          className="glass-panel"
          variant="outlined"
          sx={{
            width: '100%',
            borderRadius: '24px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
          }}
        >
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tab}
              onChange={handleTabChange}
              variant="fullWidth"
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab label="Sign In" sx={{ fontWeight: 700, py: 1.75 }} />
              <Tab label="Register" sx={{ fontWeight: 700, py: 1.75 }} />
            </Tabs>
          </Box>

          <CardContent sx={{ p: 3 }}>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2.5 }}>
              {tab === 0
                ? 'Sign in to access your clinical portal'
                : 'Create a new clinical or patient account'}
            </Typography>

            {error && (
              <Alert severity="error" variant="filled" sx={{ mb: 2.5, borderRadius: '10px' }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Stack spacing={2.25}>
                {tab === 1 && (
                  <TextField
                    fullWidth
                    label="Full Name"
                    variant="outlined"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonOutlineIcon color="action" />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MailOutlineIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockOutlinedIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {tab === 1 && (
                  <FormControl component="fieldset">
                    <FormLabel component="legend" sx={{ fontWeight: 600, fontSize: '0.85rem', mb: 0.5 }}>
                      Select User Role
                    </FormLabel>
                    <RadioGroup
                      row
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <FormControlLabel
                        value="doctor"
                        control={<Radio size="small" />}
                        label={<Typography variant="body2" sx={{ fontWeight: 650 }}>Doctor</Typography>}
                      />
                      <FormControlLabel
                        value="patient"
                        control={<Radio size="small" />}
                        label={<Typography variant="body2" sx={{ fontWeight: 650 }}>Patient</Typography>}
                      />
                    </RadioGroup>
                  </FormControl>
                )}

                <Button
                  fullWidth
                  variant="contained"
                  type="submit"
                  size="large"
                  disabled={loading}
                  sx={{
                    py: 1.5,
                    borderRadius: '10px',
                    fontSize: '1rem',
                  }}
                >
                  {loading ? 'Processing...' : tab === 0 ? 'Sign In' : 'Create Account'}
                </Button>
              </Stack>
            </form>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
}
