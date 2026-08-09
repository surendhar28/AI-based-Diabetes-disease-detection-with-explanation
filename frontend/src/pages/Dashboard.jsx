import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Grid, Paper, Stack, Typography } from '@mui/material';
import BiotechIcon from '@mui/icons-material/Biotech';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import MedicationIcon from '@mui/icons-material/Medication';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import MetricCard from '../components/MetricCard.jsx';

export default function Dashboard() {
  return (
    <Stack spacing={4}>
      <Paper
        className="animated-hero"
        variant="outlined"
        sx={{
          p: { xs: 3, md: 5 },
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
          border: '1px solid rgba(20, 184, 166, 0.15)',
        }}
      >
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={8}>
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
              Agent-Based Clinical Intelligence for{' '}
              <span className="text-gradient-primary">General Medicine</span>
            </Typography>
            <Typography 
              variant="body1"
              color="text.secondary" 
              sx={{ 
                maxWidth: 720, 
                fontSize: { xs: '1rem', md: '1.125rem' },
                lineHeight: 1.6,
                mt: 2
              }}
            >
              Screen symptoms, activate the specialized diabetes CDSS agent when risk signals emerge, and produce complete structured reports across clinical diagnosis, medication safety, diets, and evidence-scored alternative care.
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
              Start Assessment
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            label="General Medicine Agent" 
            value="Top 3 Predictor" 
            helper="Identifies most probable conditions from clinical symptom texts" 
            icon={<HealthAndSafetyIcon fontSize="medium" />}
            activeColor="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            label="Diabetes Trigger" 
            value="Risk Thresh > 0.60" 
            helper="Triggers specialist analysis when glucose exceeds limits or XGBoost signals high risk" 
            icon={<BiotechIcon fontSize="medium" />}
            activeColor="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            label="Medication Engine" 
            value="Clinical Rules" 
            helper="Generates dosage regimens, drug-safety warnings, and monitoring indicators" 
            icon={<MedicationIcon fontSize="medium" />}
            activeColor="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard 
            label="Diet Advisory" 
            value="Indian Foods KB" 
            helper="Assembles tailored vegetarian and non-vegetarian plans mapped to target calories" 
            icon={<RestaurantIcon fontSize="medium" />}
            activeColor="success"
          />
        </Grid>
      </Grid>

      <Box className="glass-panel" sx={{ p: { xs: 3, md: 4 }, borderRadius: '20px' }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700, letterSpacing: '-0.01em' }}>
          Decision Support Pipeline & Multi-Agent Routing
        </Typography>
        
        <Box className="pipeline-wrapper">
          <Box className="pipeline-node">
            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Patient Intake
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Symptoms & Labs Intake
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
              Symptom Classifier Agent
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
              Trigger Router
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Risk & Threshold Evaluator
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#a78bfa" />
                </linearGradient>
              </defs>
              <path d="M 0 12 L 100 12" className="pipeline-flow-path" />
              <path d="M 0 12 L 100 12" className="pipeline-flow-path-active" style={{ stroke: 'url(#connectorGradient3)' }} />
              <polygon points="92,8 100,12 92,16" fill="#a78bfa" />
            </svg>
          </Box>

          <Box className="pipeline-node active-hub" style={{ animationDelay: '0.5s' }}>
            <Typography variant="subtitle2" color="secondary.main" sx={{ fontWeight: 700, mb: 0.5 }}>
              Diabetes Expert
            </Typography>
            <Typography variant="caption" color="text.secondary">
              XGBoost Specialist Agent
            </Typography>
          </Box>

          <Box className="pipeline-connector">
            <svg viewBox="0 0 100 24">
              <defs>
                <linearGradient id="connectorGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#a78bfa" />
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
              Clinical Report
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Structured Diagnosis & Diet
            </Typography>
          </Box>
        </Box>
      </Box>
    </Stack>
  );
}

