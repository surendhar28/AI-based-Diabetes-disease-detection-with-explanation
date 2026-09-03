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
import TiltCard3D from '../components/TiltCard3D.jsx';

export default function Dashboard() {
  const agents = [
    {
      id: 'diabetes',
      title: 'Diabetes Specialist Agent',
      subtitle: 'Glycemic Risk, XGBoost ML & Gemini AI Reasoning',
      icon: <BloodtypeIcon sx={{ fontSize: 36 }} />,
      color: '#14b8a6',
      bgGrad: 'linear-gradient(135deg, rgba(20, 184, 166, 0.14) 0%, rgba(13, 148, 136, 0.04) 100%)',
      border: 'rgba(20, 184, 166, 0.35)',
      status: 'ONLINE & OPERATIONAL',
      statusColor: 'success',
      to: '/intake',
      actionLabel: 'Enter Diabetes Agent Workspace',
      isFullyFunctional: true,
      features: [
        '97.1% Accuracy XGBoost Risk Engine',
        'Fasting Glucose & HbA1c Threshold Triggers',
        '200k+ Indian Pharma Brand Composition Lookup',
        'Tier 1 Gemini 2.5 AI Clinical Explanation Generator',
      ],
    },
    {
      id: 'heart',
      title: 'Cardiology (Heart) Agent',
      subtitle: '10-Yr ASCVD Risk, Troponin-I & Coronary CDSS',
      icon: <FavoriteIcon sx={{ fontSize: 36 }} />,
      color: '#f43f5e',
      bgGrad: 'linear-gradient(135deg, rgba(244, 63, 94, 0.14) 0%, rgba(225, 29, 72, 0.04) 100%)',
      border: 'rgba(244, 63, 94, 0.35)',
      status: 'INTERACTIVE 3D WORKSPACE',
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
      bgGrad: 'linear-gradient(135deg, rgba(245, 158, 11, 0.14) 0%, rgba(217, 119, 6, 0.04) 100%)',
      border: 'rgba(245, 158, 11, 0.35)',
      status: 'INTERACTIVE 3D WORKSPACE',
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
      bgGrad: 'linear-gradient(135deg, rgba(2, 132, 199, 0.14) 0%, rgba(14, 165, 233, 0.04) 100%)',
      border: 'rgba(2, 132, 199, 0.35)',
      status: 'INTERACTIVE 3D WORKSPACE',
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
    <Stack spacing={4} sx={{ perspective: '1200px' }}>
      {/* Top Hero Banner */}
      <TiltCard3D color="#14b8a6">
        <Paper
          className="animated-hero"
          variant="outlined"
          sx={{
            p: { xs: 3.5, md: 5 },
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '28px',
            border: '1px solid rgba(20, 184, 166, 0.3)',
          }}
        >
          <Grid container spacing={4} alignItems="center" sx={{ transformStyle: 'preserve-3d' }}>
            <Grid item xs={12} md={8} sx={{ transform: 'translateZ(20px)' }}>
              <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
                <Chip 
                  icon={<AutoAwesomeIcon />} 
                  label="Multi-Agent AI CDSS Platform" 
                  color="primary" 
                  variant="outlined"
                  sx={{ fontWeight: 800 }}
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
                  mt: 2,
                  fontWeight: 500,
                }}
              >
                Select a specialized clinical agent below. The <strong>Diabetes Specialist Agent</strong> is fully operational with our ML prediction pipeline, Tier 1 Gemini 2.5 AI clinical reasoning, and 200k+ Indian pharma brand lookup.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' }, transform: 'translateZ(25px)' }}>
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
                  borderRadius: '14px',
                  fontWeight: 800,
                  boxShadow: '0 8px 25px rgba(20, 184, 166, 0.4)',
                  width: { xs: '100%', md: 'auto' }
                }}
              >
                Launch Diabetes Agent
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </TiltCard3D>

      {/* 4 Agent Selection Cards Grid */}
      <Box>
        <Typography variant="h5" sx={{ fontWeight: 850, mb: 3, letterSpacing: '-0.01em' }}>
          3D Interactive Specialist Agent Workspaces
        </Typography>

        <Grid container spacing={3.5}>
          {agents.map((agent) => (
            <Grid item xs={12} md={6} key={agent.id}>
              <TiltCard3D color={agent.color} sx={{ height: '100%' }}>
                <Card
                  variant="outlined"
                  sx={{
                    borderRadius: '24px',
                    background: agent.bgGrad,
                    border: `1px solid ${agent.border}`,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <CardContent sx={{ p: { xs: 3.5, sm: 4 }, transformStyle: 'preserve-3d' }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2.5, transform: 'translateZ(20px)' }}>
                      <Box
                        sx={{
                          bgcolor: `${agent.color}25`,
                          color: agent.color,
                          p: 1.75,
                          borderRadius: '16px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: `0 8px 20px ${agent.color}30`,
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

                    <Typography variant="h5" sx={{ fontWeight: 850, mb: 0.5, color: agent.color, transform: 'translateZ(25px)' }}>
                      {agent.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500, transform: 'translateZ(15px)' }}>
                      {agent.subtitle}
                    </Typography>

                    <Divider sx={{ my: 2, borderColor: `${agent.color}20` }} />

                    <Stack spacing={1.5} sx={{ mb: 3.5, transform: 'translateZ(15px)' }}>
                      {agent.features.map((feat, idx) => (
                        <Stack key={idx} direction="row" spacing={1.25} alignItems="center">
                          <CheckCircleIcon sx={{ fontSize: 18, color: agent.color }} />
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: '0.875rem' }}>
                            {feat}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>

                    <Box sx={{ transform: 'translateZ(25px)' }}>
                      <Button
                        component={Link}
                        to={agent.to}
                        variant={agent.isFullyFunctional ? 'contained' : 'outlined'}
                        fullWidth
                        size="large"
                        endIcon={<ArrowForwardIcon />}
                        sx={{
                          py: 1.6,
                          borderRadius: '14px',
                          bgcolor: agent.isFullyFunctional ? agent.color : 'transparent',
                          borderColor: agent.color,
                          color: agent.isFullyFunctional ? '#080c0f' : agent.color,
                          fontWeight: 800,
                          fontSize: '0.95rem',
                          boxShadow: agent.isFullyFunctional ? `0 8px 25px ${agent.color}40` : 'none',
                        }}
                      >
                        {agent.actionLabel}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </TiltCard3D>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Decision Support Pipeline Diagram */}
      <TiltCard3D color="#14b8a6">
        <Box className="glass-panel" sx={{ p: { xs: 3.5, md: 4 }, borderRadius: '24px' }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 800, letterSpacing: '-0.01em' }}>
            Multi-Agent Orchestration &amp; Clinical Routing Pipeline
          </Typography>
          
          <Box className="pipeline-wrapper">
            <Box className="pipeline-node">
              <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                Patient Intake
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Vitals &amp; Symptoms Input
              </Typography>
            </Box>

            <Box className="pipeline-connector">
              <svg viewBox="0 0 100 24">
                <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
                <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: '#14b8a6' }} />
                <polygon points="92,8 100,12 92,16" fill="#14b8a6" />
              </svg>
            </Box>

            <Box className="pipeline-node active-hub">
              <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                General Medicine
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Primary Symptom Router
              </Typography>
            </Box>

            <Box className="pipeline-connector">
              <svg viewBox="0 0 100 24">
                <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
                <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: '#7c3aed' }} />
                <polygon points="92,8 100,12 92,16" fill="#7c3aed" />
              </svg>
            </Box>

            <Box className="pipeline-node">
              <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                Agent Router
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Diabetes / Organ Specialist
              </Typography>
            </Box>

            <Box className="pipeline-connector">
              <svg viewBox="0 0 100 24">
                <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
                <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: '#14b8a6' }} />
                <polygon points="92,8 100,12 92,16" fill="#14b8a6" />
              </svg>
            </Box>

            <Box className="pipeline-node active-hub" style={{ animationDelay: '0.5s' }}>
              <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                Diabetes Agent
              </Typography>
              <Typography variant="caption" color="text.secondary">
                XGBoost + Gemini 2.5 AI
              </Typography>
            </Box>

            <Box className="pipeline-connector">
              <svg viewBox="0 0 100 24">
                <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
                <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: '#10b981' }} />
                <polygon points="92,8 100,12 92,16" fill="#10b981" />
              </svg>
            </Box>

            <Box className="pipeline-node">
              <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 800, mb: 0.5 }}>
                Clinical CDSS Report
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Diagnosis, Meds &amp; Diet
              </Typography>
            </Box>
          </Box>
        </Box>
      </TiltCard3D>
    </Stack>
  );
}
