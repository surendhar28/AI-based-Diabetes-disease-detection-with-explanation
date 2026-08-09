import React, { createContext, useMemo, useState, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Box, CircularProgress } from '@mui/material';
import AppShell from './components/AppShell.jsx';
import Dashboard from './pages/Dashboard.jsx';
import PatientInputForm from './pages/PatientInputForm.jsx';
import ResultsPage from './pages/ResultsPage.jsx';
import DiabetesReport from './pages/DiabetesReport.jsx';
import Login from './pages/Login.jsx';
import PatientRecords from './pages/PatientRecords.jsx';
import { getCurrentUser } from './services/api.js';

export const AppStateContext = createContext(null);

export default function App() {
  const [mode, setMode] = useState(localStorage.getItem('theme_mode') || 'dark');
  const [caseResult, setCaseResult] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(!!localStorage.getItem('health_token'));
  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('health_token');
      if (token) {
        try {
          const user = await getCurrentUser();
          setCurrentUser(user);
        } catch (err) {
          console.error('Failed to load user profile:', err);
          localStorage.removeItem('health_token');
        }
      }
      setLoadingUser(false);
    }
    loadUser();
  }, []);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === 'light' ? '#0f766e' : '#14b8a6',
            light: '#2dd4bf',
            dark: '#115e59',
          },
          secondary: {
            main: mode === 'light' ? '#6d28d9' : '#a78bfa',
            light: '#c084fc',
            dark: '#5b21b6',
          },
          warning: {
            main: '#f59e0b',
          },
          error: {
            main: '#ef4444',
          },
          success: {
            main: '#10b981',
          },
          background: {
            default: mode === 'light' ? '#f3f4f6' : '#080c0f',
            paper: mode === 'light' ? '#ffffff' : '#0f171e',
          },
          text: {
            primary: mode === 'light' ? '#1f2937' : '#f3f4f6',
            secondary: mode === 'light' ? '#6b7280' : '#9ca3af',
          },
        },
        shape: { borderRadius: 12 },
        typography: {
          fontFamily: ['Outfit', 'Inter', 'Segoe UI', 'sans-serif'].join(','),
          h4: { fontWeight: 800, letterSpacing: '-0.02em' },
          h5: { fontWeight: 700, letterSpacing: '-0.01em' },
          h6: { fontWeight: 650, letterSpacing: '0em' },
          subtitle1: { fontWeight: 600 },
          button: { textTransform: 'none', fontWeight: 600 },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                padding: '8px 16px',
                transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: mode === 'light' 
                    ? '0 4px 12px rgba(15, 118, 110, 0.15)' 
                    : '0 4px 16px rgba(20, 184, 166, 0.25)',
                },
              },
              containedPrimary: {
                background: mode === 'light' 
                  ? 'linear-gradient(135deg, #0f766e 0%, #0d9488 100%)' 
                  : 'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)',
                color: mode === 'light' ? '#ffffff' : '#080c0f',
              },
              containedSecondary: {
                background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                color: '#ffffff',
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                borderRadius: '16px',
                border: mode === 'light' ? '1px solid #e5e7eb' : '1px solid #1e293b',
                background: mode === 'light' ? '#ffffff' : '#0f171e',
                boxShadow: mode === 'light' 
                  ? '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.02)' 
                  : '0 4px 20px rgba(0,0,0,0.4)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              },
            },
          },
          MuiTextField: {
            styleOverrides: {
              root: {
                '& .MuiOutlinedInput-root': {
                  borderRadius: '10px',
                  transition: 'all 0.2s',
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: mode === 'light' ? '#0f766e' : '#14b8a6',
                  },
                },
              },
            },
          },
        },
      }),
    [mode],
  );

  const value = useMemo(
    () => ({
      mode,
      toggleMode: () => {
        const next = mode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme_mode', next);
        setMode(next);
      },
      caseResult,
      setCaseResult: (result) => {
        setCaseResult(result);
        if (currentUser?.role === 'doctor') {
          navigate('/results');
        } else {
          navigate('/diabetes-report');
        }
      },
      currentUser,
      setCurrentUser,
      logout: () => {
        localStorage.removeItem('health_token');
        setCurrentUser(null);
        setCaseResult(null);
        navigate('/');
      }
    }),
    [mode, caseResult, currentUser, navigate],
  );

  if (loadingUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: mode === 'light' ? '#f3f4f6' : '#080c0f' }}>
          <CircularProgress color="primary" />
        </Box>
      </ThemeProvider>
    );
  }

  if (!currentUser) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Login
          onAuthSuccess={async (token) => {
            localStorage.setItem('health_token', token);
            try {
              const user = await getCurrentUser();
              setCurrentUser(user);
            } catch (err) {
              console.error('Failed to login:', err);
            }
          }}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppStateContext.Provider value={value}>
        <AppShell>
          <Routes>
            {currentUser.role === 'doctor' ? (
              <>
                <Route path="/" element={<Dashboard />} />
                <Route path="/intake" element={<PatientInputForm />} />
                <Route path="/results" element={<ResultsPage />} />
                <Route path="/diabetes-report" element={<DiabetesReport />} />
                <Route path="/records" element={<PatientRecords />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            ) : (
              <>
                <Route path="/" element={<PatientRecords />} />
                <Route path="/diabetes-report" element={<DiabetesReport />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </AppShell>
      </AppStateContext.Provider>
    </ThemeProvider>
  );
}
