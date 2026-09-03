import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Card, CardContent, Grid, LinearProgress, Stack, Typography, Box, CircularProgress } from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AppStateContext } from '../App.jsx';
import { getCases, getCaseDetails } from '../services/api.js';

const sampleGeneralPrediction = {
  predictions: [
    { disease: 'Diabetes Mellitus', probability: 0.84 },
    { disease: 'Essential Hypertension', probability: 0.42 },
    { disease: 'Hyperlipidemia', probability: 0.28 },
  ],
  diabetes_triggered: true,
  trigger_reasons: ['Fasting blood glucose >= 126 mg/dL', 'Symptom probability >= 60%'],
};

const CustomTooltip = ({ active, payload, themeMode }) => {
  if (active && payload && payload.length) {
    return (
      <Box 
        className="glass-panel" 
        sx={{ 
          p: 2, 
          borderRadius: '10px', 
          boxShadow: '0 8px 30px rgba(0,0,0,0.15)',
          background: themeMode === 'light' ? 'rgba(255,255,255,0.95)' : 'rgba(15,23,30,0.95)',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>
          {payload[0].payload.disease}
        </Typography>
        <Typography variant="body2" color="primary.main" sx={{ fontWeight: 800 }}>
          Probability: {payload[0].value}%
        </Typography>
      </Box>
    );
  }
  return null;
};

export default function ResultsPage() {
  const { caseResult, setCaseResult, mode } = useContext(AppStateContext);
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    async function autoLoad() {
      if (!caseResult) {
        setFetching(true);
        try {
          const cases = await getCases();
          if (cases && cases.length > 0) {
            const details = await getCaseDetails(cases[0].id);
            setCaseResult({
              general: details.general_prediction || sampleGeneralPrediction,
              diabetes: details.diabetes_prediction,
              input: { ...details.labs, symptoms: details.symptoms, patient_name: details.patient_name, patient_email: details.patient_email }
            });
          }
        } catch (err) {
          console.log('No historical case found for results', err);
        } finally {
          setFetching(false);
        }
      }
    }
    autoLoad();
  }, [caseResult, setCaseResult]);

  const loadDemo = () => {
    setCaseResult({
      general: sampleGeneralPrediction,
      diabetes: null,
      input: {
        patient_name: 'John Doe',
        patient_email: 'john.doe@example.com',
        symptoms: 'fatigue, excessive thirst, frequent urination',
        glucose: 184,
        hba1c_level: 7.2,
        age: 52,
        gender: 'male',
      }
    });
  };

  if (fetching) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress color="primary" size={50} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Fetching assessment results...
        </Typography>
      </Box>
    );
  }

  if (!caseResult || !caseResult.general) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: '24px' }}>
          <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: '14px', textAlign: 'left' }}>
            No assessment completed yet. Fill out the patient intake form or view demonstration results.
          </Alert>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} to="/intake" variant="contained" color="primary" size="large" sx={{ borderRadius: '12px', px: 3.5, fontWeight: 800 }}>
              Go to Intake Form
            </Button>
            <Button variant="outlined" color="secondary" size="large" startIcon={<PlayArrowIcon />} onClick={loadDemo} sx={{ borderRadius: '12px', px: 3.5, fontWeight: 800 }}>
              Load Sample Results
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  const diseaseData = caseResult.general.predictions.map((item) => ({
    disease: item.disease,
    probability: Math.round(item.probability * 100),
  }));

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 850, mb: 1 }}>Diagnostic Assessment Results</Typography>
        <Typography color="text.secondary">Differential disease probabilities calculated by the symptom classifier agent.</Typography>
      </div>

      <Grid container spacing={3}>
        {caseResult.general.predictions.map((item) => {
          const isHighest = item.probability === Math.max(...caseResult.general.predictions.map(p => p.probability));
          return (
            <Grid item xs={12} md={4} key={item.disease}>
              <Card 
                variant="outlined" 
                sx={{ 
                  height: '100%',
                  borderColor: isHighest ? 'primary.main' : 'divider',
                  borderRadius: '20px',
                  boxShadow: isHighest 
                    ? (mode === 'light' ? '0 10px 25px rgba(15,118,110,0.15)' : '0 12px 30px rgba(20,184,166,0.25)') 
                    : 'none',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {isHighest && (
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: 0, 
                      left: 0, 
                      right: 0, 
                      height: 4, 
                      bgcolor: 'primary.main' 
                    }} 
                  />
                )}
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography color="text.secondary" variant="caption" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {isHighest ? 'Primary Candidate' : 'Differential Diagnosis'}
                    </Typography>
                    <HealthAndSafetyIcon color={isHighest ? 'primary' : 'disabled'} />
                  </Stack>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{item.disease}</Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={item.probability * 100} 
                    color={isHighest ? 'primary' : 'inherit'}
                    sx={{ 
                      my: 1.5, 
                      height: 10, 
                      borderRadius: 99,
                      bgcolor: mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)',
                    }} 
                  />
                  <Typography variant="body2" sx={{ fontWeight: 700, mt: 1 }}>
                    {Math.round(item.probability * 100)}% Probability
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Differential Risk Visualization Card */}
      <Card variant="outlined" sx={{ borderRadius: '24px' }}>
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 750 }}>Differential Risk Visualization</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={diseaseData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={mode === 'light' ? '#0f766e' : '#14b8a6'} stopOpacity={1}/>
                  <stop offset="100%" stopColor={mode === 'light' ? '#7c3aed' : '#a78bfa'} stopOpacity={0.25}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={mode === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)'} />
              <XAxis dataKey="disease" stroke={mode === 'light' ? '#4b5563' : '#9ca3af'} tick={{ fontSize: 12, fontWeight: 600 }} />
              <YAxis domain={[0, 100]} stroke={mode === 'light' ? '#4b5563' : '#9ca3af'} tick={{ fontSize: 12, fontWeight: 600 }} />
              <Tooltip content={<CustomTooltip themeMode={mode} />} cursor={{ fill: mode === 'light' ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.02)' }} />
              <Bar dataKey="probability" fill="url(#chartGradient)" radius={[8, 8, 0, 0]} barSize={55} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {caseResult.general.diabetes_triggered ? (
        <Card 
          variant="outlined" 
          sx={{ 
            borderColor: 'warning.main',
            background: mode === 'light' ? 'rgba(245,158,11,0.05)' : 'rgba(245,158,11,0.04)',
            borderWidth: '1.5px',
            borderRadius: '20px'
          }}
        >
          <CardContent sx={{ p: 3.5 }}>
            <Grid container spacing={3} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} md={8}>
                <Typography variant="h6" color="warning.main" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  ⚠️ Diabetes Specialist Agent Activated
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Trigger reasons: {caseResult.general.trigger_reasons?.join('; ')}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
                <Button 
                  component={Link} 
                  to="/diabetes-report" 
                  variant="contained" 
                  color="secondary"
                  size="large"
                  startIcon={<AssessmentIcon />}
                  endIcon={<ArrowForwardIcon />}
                  sx={{ 
                    borderRadius: '12px',
                    px: 3.5,
                    py: 1.5,
                    fontWeight: 800,
                    boxShadow: '0 8px 25px rgba(124, 58, 237, 0.35)'
                  }}
                >
                  View Specialist Report
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ) : (
        <Alert 
          severity="success" 
          icon={<CheckCircleOutlineIcon fontSize="inherit" />}
          sx={{ 
            borderRadius: '16px', 
            p: 2.5,
            border: '1px solid',
            borderColor: 'success.light',
            bgcolor: mode === 'light' ? 'rgba(16,185,129,0.05)' : 'rgba(16,185,129,0.03)'
          }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 0.5 }}>Diabetes Screen Negative</Typography>
          The specialist agent was not activated for this assessment as blood glucose, HbA1c, and XGBoost risk signals remained below trigger thresholds.
        </Alert>
      )}
    </Stack>
  );
}
