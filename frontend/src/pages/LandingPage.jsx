import React, { useState, useContext } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
  Chip,
  Dialog,
  IconButton,
  Divider,
  Tooltip,
} from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import ShieldIcon from '@mui/icons-material/Shield';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import CloseIcon from '@mui/icons-material/Close';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import { AppStateContext } from '../App.jsx';
import Hero3DCanvas from '../components/Hero3DCanvas.jsx';
import Hologram3DCore from '../components/Hologram3DCore.jsx';
import TiltCard3D from '../components/TiltCard3D.jsx';
import Login from './Login.jsx';

export default function LandingPage({ onAuthSuccess }) {
  const { mode, toggleMode } = useContext(AppStateContext);
  const [openAuth, setOpenAuth] = useState(false);
  const [initialRole, setInitialRole] = useState('doctor');

  const isLight = mode === 'light';

  const handleOpenAuth = (role = 'doctor') => {
    setInitialRole(role);
    setOpenAuth(true);
  };

  const agents = [
    {
      id: 'diabetes',
      title: 'Diabetes Specialist Agent',
      icon: <BloodtypeIcon sx={{ fontSize: 36 }} />,
      color: isLight ? '#0f766e' : '#14b8a6',
      status: 'ONLINE & OPERATIONAL',
      statusColor: 'success',
      desc: 'Powered by a 97.1% accuracy XGBoost ML pipeline, automated fasting glucose triggers, 200k+ Indian commercial drug lookup, and Gemini 2.5 AI clinical reasoning.',
      highlights: ['97.1% XGBoost Accuracy', 'Fasting Glucose & HbA1c Triggers', 'Gemini 2.5 AI Clinical Explanations', 'Glycemic Index Diet Planner'],
    },
    {
      id: 'heart',
      title: 'Cardiology (Heart) Agent',
      icon: <FavoriteIcon sx={{ fontSize: 36 }} />,
      color: '#f43f5e',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      desc: 'Calculates 10-Year Framingham / ASCVD MACE cardiovascular risk, analyzes Serum Troponin-I & ECG markers, and provides DASH diet guidelines.',
      highlights: ['10-Yr ASCVD Risk Scoring', 'Troponin-I & ECG Biomarker Screening', 'Statin & Antihypertensive Advisor', 'Heart-Healthy DASH Protocol'],
    },
    {
      id: 'kidney',
      title: 'Nephrology (Kidney) Agent',
      icon: <WaterDropIcon sx={{ fontSize: 36 }} />,
      color: '#f59e0b',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      desc: 'Utilizes CKD-EPI 2021 equations to compute eGFR, stratifies Chronic Kidney Disease Stages 1 through 5, and provides renal protective drug warnings.',
      highlights: ['eGFR CKD-EPI 2021 Engine', 'Stages 1-5 CKD Severity Staging', 'Serum Creatinine & UACR Monitoring', 'Renal Drug Dosage Adjustments'],
    },
    {
      id: 'lung',
      title: 'Pulmonology (Lung) Agent',
      icon: <AirIcon sx={{ fontSize: 36 }} />,
      color: '#0284c7',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      desc: 'Evaluates GOLD COPD 1-4 spirometry staging (FEV1/FVC ratio), detects SpO2 oxygenation hypoxia, and recommends inhaled bronchodilator therapy.',
      highlights: ['GOLD COPD 1-4 Spirometry Staging', 'FEV1 / FVC Airway Obstruction Gauge', 'SpO2 Saturation Hypoxia Alert', 'LAMA/LABA Inhaler Regimens'],
    },
  ];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
        position: 'relative',
        transition: 'background-color 0.3s ease, color 0.3s ease',
      }}
    >
      {/* 3D WebGL Background Canvas */}
      <Hero3DCanvas mode={mode} />

      {/* Top Glassmorphic Navbar */}
      <Box
        className="glass-panel"
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          borderBottom: '1px solid',
          borderColor: isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.08)',
          background: isLight ? 'rgba(255, 255, 255, 0.85)' : 'rgba(8, 12, 15, 0.85)',
          backdropFilter: 'blur(16px)',
          py: 2,
        }}
      >
        <Container maxWidth="xl">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: isLight ? 'rgba(15, 118, 110, 0.1)' : 'rgba(20, 184, 166, 0.15)',
                  color: 'primary.main',
                  p: 1.2,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MedicalServicesIcon fontSize="medium" />
              </Box>
              <Typography
                variant="h6"
                className="text-gradient-primary"
                sx={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.25rem' }}
              >
                Agentic Healthcare 3D
              </Typography>
            </Stack>

            <Stack direction="row" spacing={2} alignItems="center">
              {/* 3D Mode Active Badge */}
              <Chip
                icon={<ViewInArIcon sx={{ fontSize: '16px !important' }} />}
                label="3D Interactive Experience"
                color="primary"
                variant="outlined"
                size="small"
                sx={{ fontWeight: 750, display: { xs: 'none', md: 'inline-flex' } }}
              />

              {/* Light / Dark Mode Toggle */}
              <Tooltip title={isLight ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                <IconButton
                  onClick={toggleMode}
                  color="primary"
                  aria-label="toggle light dark theme"
                  sx={{
                    border: '1px solid',
                    borderColor: isLight ? 'rgba(15, 118, 110, 0.25)' : 'rgba(20, 184, 166, 0.3)',
                    p: 1,
                    transition: 'transform 0.4s ease',
                    '&:hover': {
                      transform: 'rotate(45deg)',
                    },
                  }}
                >
                  {isLight ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>

              <Button
                variant="text"
                onClick={() => handleOpenAuth('patient')}
                sx={{ color: 'text.secondary', fontWeight: 650, display: { xs: 'none', sm: 'inline-flex' } }}
              >
                Patient Portal
              </Button>
              <Button
                variant="contained"
                onClick={() => handleOpenAuth('doctor')}
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: '10px',
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                }}
              >
                Sign In / Access Portal
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 3D Hero Section */}
      <Container maxWidth="xl" sx={{ pt: { xs: 5, md: 8 }, pb: 8, position: 'relative', zIndex: 1 }}>
        <Grid container spacing={6} alignItems="center">
          <Grid item xs={12} lg={6.5}>
            <Stack spacing={3}>
              <Box>
                <Chip
                  icon={<AutoAwesomeIcon />}
                  label="3D Multi-Agent AI Healthcare CDSS"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontWeight: 700,
                    px: 1,
                    py: 2,
                    borderRadius: '20px',
                    boxShadow: isLight ? '0 4px 14px rgba(15,118,110,0.12)' : '0 4px 20px rgba(20,184,166,0.25)',
                  }}
                />
              </Box>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  letterSpacing: '-0.03em',
                  lineHeight: 1.12,
                  fontSize: { xs: '2.4rem', sm: '3.4rem', md: '3.8rem' },
                }}
              >
                Autonomous 3D Multi-Agent <br />
                <span className="text-gradient-primary">Clinical Intelligence</span>
              </Typography>

              <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, lineHeight: 1.6, maxWidth: 650 }}>
                Screen early symptoms, trigger specialized organ disease agents, and generate instant clinical explanations backed by <strong>XGBoost ML (97.1% Accuracy)</strong>, <strong>Google Gemini 2.5 AI</strong>, and <strong>200,000+ Indian Commercial Medicines</strong>.
              </Typography>

              {/* 3D Interactive Stats Cards */}
              <Grid container spacing={2} sx={{ pt: 1 }}>
                <Grid item xs={6} sm={3}>
                  <TiltCard3D color="#14b8a6">
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: isLight ? '#ffffff' : 'rgba(15, 23, 30, 0.75)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'primary.main' }}>97.1%</Typography>
                      <Typography variant="caption" color="text.secondary">ML Diagnostic Accuracy</Typography>
                    </Paper>
                  </TiltCard3D>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TiltCard3D color="#a78bfa">
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: isLight ? '#ffffff' : 'rgba(15, 23, 30, 0.75)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: 'secondary.main' }}>4 Agents</Typography>
                      <Typography variant="caption" color="text.secondary">Specialist AI Systems</Typography>
                    </Paper>
                  </TiltCard3D>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TiltCard3D color="#f59e0b">
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: isLight ? '#ffffff' : 'rgba(15, 23, 30, 0.75)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#f59e0b' }}>200k+</Typography>
                      <Typography variant="caption" color="text.secondary">Indian Pharma Brands</Typography>
                    </Paper>
                  </TiltCard3D>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <TiltCard3D color="#f43f5e">
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: isLight ? '#ffffff' : 'rgba(15, 23, 30, 0.75)',
                        borderColor: isLight ? '#e2e8f0' : 'rgba(255,255,255,0.08)',
                      }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: '#f43f5e' }}>Gemini 2.5</Typography>
                      <Typography variant="caption" color="text.secondary">Tier 1 AI Engine</Typography>
                    </Paper>
                  </TiltCard3D>
                </Grid>
              </Grid>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => handleOpenAuth('doctor')}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    px: 4,
                    py: 1.75,
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    fontWeight: 750,
                    boxShadow: isLight ? '0 8px 20px rgba(15,118,110,0.25)' : '0 8px 25px rgba(20,184,166,0.35)',
                  }}
                >
                  Doctor Sign In &amp; CDSS
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => handleOpenAuth('patient')}
                  sx={{
                    px: 4,
                    py: 1.75,
                    fontSize: '1.05rem',
                    borderRadius: '12px',
                    borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.2)',
                    color: 'text.primary',
                    '&:hover': { borderColor: 'primary.main', bgcolor: isLight ? 'rgba(15, 118, 110, 0.08)' : 'rgba(20, 184, 166, 0.08)' },
                  }}
                >
                  Patient Care Portal
                </Button>
              </Stack>
            </Stack>
          </Grid>

          {/* Right Column: Interactive 3D Hologram Core */}
          <Grid item xs={12} lg={5.5}>
            <Hologram3DCore mode={mode} />
          </Grid>
        </Grid>
      </Container>

      {/* Section: 4 Specialized Healthcare Agents with 3D Mouse Tilt */}
      <Box
        sx={{
          py: 9,
          bgcolor: isLight ? 'rgba(248, 250, 252, 0.7)' : 'rgba(15, 23, 30, 0.65)',
          borderTop: '1px solid',
          borderBottom: '1px solid',
          borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.05)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={2} alignItems="center" textAlign="center" sx={{ mb: 6 }}>
            <Chip label="Interactive 3D Cards" color="primary" variant="outlined" sx={{ fontWeight: 750 }} />
            <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: '-0.02em' }}>
              4 Specialist Autonomous <span className="text-gradient-primary">Healthcare AI Agents</span>
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700 }}>
              Hover over each card below to experience 3D perspective depth and interactive lighting tilt.
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            {agents.map((agent) => (
              <Grid item xs={12} md={6} key={agent.id}>
                <TiltCard3D color={agent.color}>
                  <Card
                    variant="outlined"
                    sx={{
                      borderRadius: '24px',
                      bgcolor: isLight ? '#ffffff' : '#0f171e',
                      border: `1px solid ${agent.color}35`,
                      boxShadow: isLight
                        ? `0 10px 30px ${agent.color}15`
                        : `0 12px 40px ${agent.color}20`,
                      p: 1,
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    <CardContent sx={{ p: 3, transformStyle: 'preserve-3d' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2.5, transformStyle: 'preserve-3d' }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ transform: 'translateZ(25px)' }}>
                          <Box
                            sx={{
                              bgcolor: `${agent.color}20`,
                              color: agent.color,
                              p: 1.5,
                              borderRadius: '16px',
                              boxShadow: `0 0 20px ${agent.color}40`,
                            }}
                          >
                            {agent.icon}
                          </Box>
                          <Typography variant="h5" sx={{ fontWeight: 850, color: agent.color }}>
                            {agent.title}
                          </Typography>
                        </Stack>
                        <Chip
                          label={agent.status}
                          color={agent.statusColor}
                          size="small"
                          sx={{ fontWeight: 800, transform: 'translateZ(20px)' }}
                        />
                      </Stack>

                      <Typography variant="body2" color="text.secondary" paragraph sx={{ lineHeight: 1.6, transform: 'translateZ(15px)' }}>
                        {agent.desc}
                      </Typography>

                      <Divider sx={{ my: 2, borderColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }} />

                      <Grid container spacing={1.25} sx={{ transform: 'translateZ(20px)' }}>
                        {agent.highlights.map((h, i) => (
                          <Grid item xs={12} sm={6} key={i}>
                            <Stack direction="row" spacing={1} alignItems="center">
                              <CheckCircleIcon sx={{ fontSize: 16, color: agent.color }} />
                              <Typography variant="caption" sx={{ fontWeight: 650, color: 'text.primary' }}>
                                {h}
                              </Typography>
                            </Stack>
                          </Grid>
                        ))}
                      </Grid>
                    </CardContent>
                  </Card>
                </TiltCard3D>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* 3D Call to Action Banner */}
      <Container maxWidth="xl" sx={{ py: 10, position: 'relative', zIndex: 1 }}>
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: '32px',
            background: isLight 
              ? 'linear-gradient(135deg, rgba(15, 118, 110, 0.08) 0%, rgba(109, 40, 217, 0.08) 100%)'
              : 'linear-gradient(135deg, rgba(20, 184, 166, 0.15) 0%, rgba(124, 58, 237, 0.15) 100%)',
            border: '1px solid',
            borderColor: isLight ? 'rgba(15, 118, 110, 0.25)' : 'rgba(20, 184, 166, 0.3)',
            textAlign: 'center',
            boxShadow: isLight ? '0 15px 40px rgba(15,118,110,0.1)' : '0 20px 50px rgba(0,0,0,0.4)',
          }}
        >
          <Typography variant="h3" sx={{ fontWeight: 900, mb: 2 }}>
            Experience 3D AI-Driven CDSS Today
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto', mb: 4, fontWeight: 400 }}>
            Sign in as a clinician to run real-time patient assessments or log in as a patient to view personalized care plans.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              onClick={() => handleOpenAuth('doctor')}
              sx={{ px: 5, py: 1.75, fontSize: '1.05rem', borderRadius: '12px', fontWeight: 800 }}
            >
              Sign In as Doctor
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => handleOpenAuth('patient')}
              sx={{ px: 5, py: 1.75, fontSize: '1.05rem', borderRadius: '12px', borderColor: isLight ? '#cbd5e1' : 'rgba(255,255,255,0.3)', color: 'text.primary', fontWeight: 700 }}
            >
              Sign In as Patient
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Auth Dialog / Modal */}
      <Dialog
        open={openAuth}
        onClose={() => setOpenAuth(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            bgcolor: isLight ? '#ffffff' : '#0f171e',
            backgroundImage: 'none',
            border: '1px solid',
            borderColor: isLight ? 'rgba(15, 118, 110, 0.2)' : 'rgba(20, 184, 166, 0.3)',
          },
        }}
      >
        <Box sx={{ position: 'relative', p: 1 }}>
          <IconButton
            onClick={() => setOpenAuth(false)}
            sx={{ position: 'absolute', right: 12, top: 12, color: 'text.secondary', zIndex: 10 }}
          >
            <CloseIcon />
          </IconButton>
          <Login onAuthSuccess={onAuthSuccess} initialRole={initialRole} />
        </Box>
      </Dialog>
    </Box>
  );
}
