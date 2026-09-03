import React from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Stack,
  Typography,
  Divider,
} from '@mui/material';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import AirIcon from '@mui/icons-material/Air';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import MetricCard from '../components/MetricCard.jsx';

export default function Dashboard() {
  const agents = [
    {
      id: 'diabetes',
      title: 'Diabetes Specialist Agent',
      subtitle: 'Glycemic Risk, XGBoost ML & Clinical Reasoning',
      icon: <BloodtypeIcon sx={{ fontSize: 36 }} />,
      color: '#14b8a6',
      bgGrad: 'linear-gradient(135deg, rgba(20, 184, 166, 0.12) 0%, rgba(13, 148, 136, 0.03) 100%)',
      border: 'rgba(20, 184, 166, 0.3)',
      status: 'ONLINE & OPERATIONAL',
      statusColor: 'success',
      to: '/intake',
      actionLabel: 'Enter Diabetes Agent Workspace',
      isFullyFunctional: true,
      features: [
        '97.1% Accuracy XGBoost Risk Engine',
        'Fasting Glucose & HbA1c Threshold Triggers',
        '200k+ Indian Pharma Brand Composition Lookup',
        'Groq LLaMA-3.3 Clinical Explanation Generator',
      ],
    },
    {
      id: 'heart',
      title: 'Cardiology (Heart) Agent',
      subtitle: '10-Yr ASCVD Risk, Troponin-I & Coronary CDSS',
      icon: <FavoriteIcon sx={{ fontSize: 36 }} />,
      color: '#f43f5e',
      bgGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.12) 0%, rgba(225, 29, 72, 0.03) 100%)',
      border: 'rgba(244, 63, 94, 0.3)',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      to: '/heart',
      actionLabel: 'Enter Heart Agent Workspace',
      isFullyFunctional: false,
      features: [
        'Framingham & ASCVD 10-Yr MACE Risk Calculator',
        'Troponin-I & ECG Biomarker Analysis',
        'Statin & Antihypertensive Dosage Advisor',
        'Low-Sodium DASH Dietary Protocol',
      ],
    },
    {
      id: 'kidney',
      title: 'Nephrology (Kidney) Agent',
      subtitle: 'CKD Staging, eGFR CKD-EPI & Albuminuria CDSS',
      icon: <WaterDropIcon sx={{ fontSize: 36 }} />,
      color: '#f59e0b',
      bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(217, 119, 6, 0.03) 100%)',
      border: 'rgba(245, 158, 11, 0.3)',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      to: '/kidney',
      actionLabel: 'Enter Kidney Agent Workspace',
      isFullyFunctional: false,
      features: [
        'CKD-EPI 2021 eGFR Calculation Engine',
        'Stages 1-5 CKD Severity Stratification',
        'Serum Creatinine & UACR Ratio Monitoring',
        'Renal Protective & ACEi Regimen Advisor',
      ],
    },
    {
      id: 'lung',
      title: 'Pulmonology (Lung) Agent',
      subtitle: 'GOLD COPD Staging, FEV1/FVC & Spirometry CDSS',
      icon: <AirIcon sx={{ fontSize: 36 }} />,
      color: '#0284c7',
      bgGrad: 'linear-gradient(135deg, rgba(2, 132, 199, 0.12) 0%, rgba(14, 165, 233, 0.03) 100%)',
      border: 'rgba(2, 132, 199, 0.3)',
      status: 'INTERACTIVE UI PREVIEW',
      statusColor: 'warning',
      to: '/lung',
      actionLabel: 'Enter Lung Agent Workspace',
      isFullyFunctional: false,
      features: [
        'GOLD COPD 1-4 Spirometry Staging',
        'FEV1 / FVC Ratio Airway Obstruction Gauge',
        'SpO2 Hypoxia Warning & Oxygen Saturation',
        'Inhaled Bronchodilator & LAMA/LABA Regimens',
      ],
    },
  ];

  return (
    <Stack spacing={4}>
      {/* Top Hero Banner */}
      <Paper
        className="animated-hero"
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(20, 184, 166, 0.2)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip 
                icon={<AutoAwesomeIcon />} 
                label="Multi-Agent AI CDSS Platform" 
                color="primary" 
                variant="outlined"
                sx={{ fontWeight: 700 }}
              />
            </Stack>
            <Typography 
              variant="h3" 
              gutterBottom 
              sx={{ 
                fontWeight: 900, 
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' }
              }}
            >
              4 Specialist Autonomous <span className="text-gradient-primary">Healthcare AI Agents</span>
            </Typography>
            <Typography 
              variant="body1"
              color="text.secondary" 
              sx={{ 
                maxWidth: 760, 
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6,
                mt: 2
              }}
            >
              Select a specialized clinical agent below. The <strong>Diabetes Specialist Agent</strong> is fully powered by our end-to-end ML prediction pipeline, Groq LLM clinical reasoning, and SQLite database. Explore interactive agent UI previews for Cardiology, Nephrology, and Pulmonology.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              component={Link} 
              to="/intake" 
              variant="contained" 
              size="large" 
              endIcon={<ArrowForwardIcon />}
              sx={{ 
                px: 4, 
                py: 2, 
                fontSize: '1.05rem', 
                borderRadius: '12px',
                width: { xs: '100%', md: 'auto' }
              }}
            >
              Launch Diabetes Agent
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* 4 Agent Selection Cards Grid */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 800, mb: 3, letterSpacing: '-0.01em' }}>
          Specialized Agent Workspaces
        </Typography>

        <Grid container spacing={3}>
          {agents.map((agent) => (
            <Grid item xs={12} md={6} key={agent.id}>
              <Card
                variant="outlined"
                sx={{
                  borderRadius: '20px',
                  background: agent.bgGrad,
                  border: `1px solid ${agent.border}`,
                  transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: `0 12px 32px ${agent.color}25`,
                    borderColor: agent.color,
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5 }}>
                    <Box
                      sx={{
                        bgcolor: `${agent.color}20`,
                        color: agent.color,
                        p: 1.75,
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {agent.icon}
                    </Box>
                    <Chip
                      label={agent.status}
                      color={agent.statusColor}
                      size="small"
                      sx={{ fontWeight: 800, fontSize: '0.75rem' }}
                    />
                  </Stack>

                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 0.5, color: agent.color }}>
                    {agent.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                    {agent.subtitle}
                  </Typography>

                  <Divider sx={{ my: 2, borderColor: `${agent.color}20` }} />

                  <Stack spacing={1.25} sx={{ mb: 3 }}>
                    {agent.features.map((feat, idx) => (
                      <Stack key={idx} direction="row" spacing={1.25} alignItems="center">
                        <CheckCircleIcon sx={{ fontSize: 18, color: agent.color }} />
                        <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                          {feat}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Button
                    component={Link}
                    to={agent.to}
                    variant={agent.isFullyFunctional ? 'contained' : 'outlined'}
                    fullWidth
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                      py: 1.5,
                      borderRadius: '12px',
                      bgcolor: agent.isFullyFunctional ? agent.color : 'transparent',
                      borderColor: agent.color,
                      color: agent.isFullyFunctional ? '#080c0f' : agent.color,
                      fontWeight: 700,
                      '&:hover': {
                        bgcolor: agent.isFullyFunctional ? agent.color : `${agent.color}15`,
                        borderColor: agent.color,
                        filter: 'brightness(1.1)',
                      },
                    }}
                  >
                    {agent.actionLabel}
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Decision Support Pipeline Diagram */}
      <Box className="glass-panel" sx={{ p: { xs: 3, md: 4 }, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Multi-Agent Orchestration & Clinical Routing Pipeline
        </Typography>
        
        <Box className="pipeline-wrapper">
          <Box className="pipeline-node">
            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Patient Intake
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vitals & Symptoms Input
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
              </defs>
              <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
              <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: 'url(#connectorGradient1)' }} />
              <polygon points="92,8 100,12 92,16" fill="#0d9488" />
            </svg>
          </Box>

          <Box className="pipeline-node active-hub">
            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              General Medicine
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Primary Symptom Router
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0d9488" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
              </defs>
              <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
              <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: 'url(#connectorGradient2)' }} />
              <polygon points="92,8 100,12 92,16" fill="#7c3aed" />
            </svg>
          </Box>

          <Box className="pipeline-node">
            <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Agent Router
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Diabetes / Organ Specialist
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
              <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: 'url(#connectorGradient3)' }} />
              <polygon points="92,8 100,12 92,16" fill="#14b8a6" />
            </svg>
          </Box>

          <Box className="pipeline-node active-hub" style={{ animationDelay: '0.5s' }}>
            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Diabetes Agent
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Full XGBoost + LLM System
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
              <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
              <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: 'url(#connectorGradient4)' }} />
              <polygon points="92,8 100,12 92,16" fill="#10b981" />
            </svg>
          </Box>

          <Box className="pipeline-node">
            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Clinical CDSS Report
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Diagnosis, Meds &amp; Diet
            </Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}
