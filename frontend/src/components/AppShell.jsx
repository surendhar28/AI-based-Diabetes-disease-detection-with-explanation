import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
  Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { AppStateContext } from '../App.jsx';

export default function AppShell({ children }) {
  const { pathname } = useLocation();
  const { mode, toggleMode, currentUser, logout } = useContext(AppStateContext);

  const nav = currentUser?.role === 'doctor'
    ? [
        { label: 'Agent Hub', to: '/', icon: <DashboardIcon fontSize="small" /> },
        { label: 'Diabetes Agent', to: '/intake', icon: <BloodtypeIcon fontSize="small" /> },
        { label: 'Heart Agent', to: '/heart', icon: <FavoriteIcon fontSize="small" /> },
        { label: 'Kidney Agent', to: '/kidney', icon: <WaterDropIcon fontSize="small" /> },
        { label: 'Lung Agent', to: '/lung', icon: <AirIcon fontSize="small" /> },
        { label: 'Records', to: '/records', icon: <HistoryIcon fontSize="small" /> },
      ]
    : [
        { label: 'My Recommendations', to: '/', icon: <HistoryIcon fontSize="small" /> },
      ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', pb: { xs: 8, sm: 0 } }}>
      <AppBar
        position="sticky"
        elevation={0}
        className="glass-panel"
        sx={{
          borderBottom: '1px solid',
          borderColor: mode === 'light' ? 'rgba(0, 0, 0, 0.06)' : 'rgba(255, 255, 255, 0.06)',
          background: mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 30, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ gap: 2, justifyContent: 'space-between' }}>
            <Stack direction="row" alignItems="center" spacing={1.5} component={Link} to="/" sx={{ textDecoration: 'none' }}>
              <Box
                sx={{
                  bgcolor: mode === 'light' ? 'rgba(15, 118, 110, 0.1)' : 'rgba(20, 184, 166, 0.15)',
                  color: 'primary.main',
                  p: 1,
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(15deg) scale(1.1)',
                  }
                }}
              >
                <MedicalServicesIcon />
              </Box>
              <Typography
                variant="h6"
                className="text-gradient-primary"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: '1.05rem', sm: '1.25rem' },
                  letterSpacing: '-0.02em',
                }}
              >
                Multi-Agent CDSS Portal
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.75} sx={{ display: { xs: 'none', lg: 'flex' } }}>
              {nav.map((item) => {
                const isActive = pathname === item.to || (item.to === '/intake' && (pathname === '/results' || pathname === '/diabetes-report'));
                return (
                  <Button
                    key={item.to}
                    component={Link}
                    to={item.to}
                    startIcon={item.icon}
                    variant={isActive ? 'contained' : 'text'}
                    color={isActive ? 'primary' : 'inherit'}
                    size="small"
                    sx={{
                      px: 1.75,
                      py: 0.85,
                      borderRadius: '8px',
                      fontSize: '0.85rem',
                      fontWeight: 650,
                      color: isActive 
                        ? (mode === 'light' ? '#ffffff' : '#080c0f') 
                        : (mode === 'light' ? '#4b5563' : '#9ca3af'),
                      '&:hover': {
                        bgcolor: isActive 
                          ? 'primary.dark' 
                          : (mode === 'light' ? 'rgba(15, 118, 110, 0.08)' : 'rgba(20, 184, 166, 0.1)'),
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Stack>

            <Stack direction="row" spacing={1.5} alignItems="center">
              {currentUser && (
                <Chip
                  icon={<AccountCircleIcon />}
                  label={
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>
                      {currentUser.full_name} ({currentUser.role === 'doctor' ? 'Doctor' : 'Patient'})
                    </Typography>
                  }
                  color={currentUser.role === 'doctor' ? 'secondary' : 'default'}
                  variant="outlined"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                />
              )}

              <Tooltip title={mode === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                <IconButton 
                  onClick={toggleMode} 
                  color="primary" 
                  aria-label="toggle theme"
                  sx={{
                    border: '1px solid',
                    borderColor: mode === 'light' ? 'rgba(15, 118, 110, 0.2)' : 'rgba(20, 184, 166, 0.3)',
                    p: 1,
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'rotate(45deg)',
                    }
                  }}
                >
                  {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>

              {currentUser && (
                <Tooltip title="Log Out">
                  <IconButton
                    onClick={logout}
                    color="error"
                    aria-label="log out"
                    sx={{
                      border: '1px solid',
                      borderColor: 'error.light',
                      p: 1,
                      '&:hover': {
                        bgcolor: 'error.light',
                        color: '#ffffff',
                      }
                    }}
                  >
                    <LogoutIcon />
                  </IconButton>
                </Tooltip>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: { xs: 3, md: 5 } }}>
        {children}
      </Container>

      {/* Mobile navigation bottom bar */}
      <Box
        className="glass-panel"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: { xs: 'flex', lg: 'none' },
          borderTop: '1px solid',
          borderColor: mode === 'light' ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
          justifyContent: 'space-around',
          py: 1,
          zIndex: 100,
          background: mode === 'light' ? 'rgba(255, 255, 255, 0.85)' : 'rgba(15, 23, 30, 0.85)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {nav.map((item) => {
          const isActive = pathname === item.to || (item.to === '/intake' && (pathname === '/results' || pathname === '/diabetes-report'));
          return (
            <Tooltip key={item.to} title={item.label}>
              <IconButton 
                component={Link} 
                to={item.to} 
                color={isActive ? 'primary' : 'default'}
                sx={{
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.15)',
                  }
                }}
              >
                {item.icon}
              </IconButton>
            </Tooltip>
          );
        })}
      </Box>
    </Box>
  );
}
