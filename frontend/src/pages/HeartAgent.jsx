import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';

export default function HeartAgent() {
  const [formData, setFormData] = useState({
    systolicBP: 138,
    diastolicBP: 88,
    totalCholesterol: 215,
    hdlCholesterol: 42,
    ldlCholesterol: 135,
    troponin: 0.02,
    restingHR: 78,
    chestPainType: 'atypical',
    smokingStatus: 'former',
    diabetesHistory: 'yes',
  });

  const [analyzed, setAnalyzed] = useState(true);

  // Simple ASCVD Risk calculation formula simulation for UI
  const calculateRisk = () => {
    let score = 5;
    if (formData.systolicBP > 140) score += 6;
    if (formData.totalCholesterol > 200) score += 5;
    if (formData.hdlCholesterol < 40) score += 4;
    if (formData.smokingStatus === 'current') score += 8;
    if (formData.diabetesHistory === 'yes') score += 7;
    if (formData.troponin > 0.04) score += 15;
    return Math.min(Math.max(score, 2), 98);
  };

  const riskScore = calculateRisk();
  const riskCategory = riskScore < 10 ? 'Low Risk' : riskScore < 20 ? 'Moderate Risk' : 'High Risk';
  const riskColor = riskScore < 10 ? '#10b981' : riskScore < 20 ? '#f59e0b' : '#ef4444';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Header Banner */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(244, 63, 94, 0.08) 0%, rgba(225, 29, 72, 0.02) 100%)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: 'rgba(244, 63, 94, 0.15)',
                  color: '#f43f5e',
                  p: 2,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <FavoriteIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#f43f5e' }}>
                    Cardiology & Heart Specialist Agent
                  </Typography>
                  <Chip label="Interactive UI Preview" size="small" sx={{ bgcolor: 'rgba(244, 63, 94, 0.2)', color: '#f43f5e', fontWeight: 700 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  10-Year ASCVD Risk Scoring • ECG Biomarker Analysis • Coronary Artery Disease Screening
                </Typography>
              </Box>
            </Stack>

            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ borderColor: 'rgba(244, 63, 94, 0.4)', color: '#f43f5e', '&:hover': { borderColor: '#f43f5e', bgcolor: 'rgba(244, 63, 94, 0.08)' } }}
            >
              Back to Agent Hub
            </Button>
          </Stack>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column: Vitals Input */}
          <Grid item xs={12} lg={5}>
            <Card variant="outlined" sx={{ borderRadius: '20px' }}>
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 3 }}>
                  <MonitorHeartIcon sx={{ color: '#f43f5e' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Cardiovascular Vitals Intake
                  </Typography>
                </Stack>

                <Grid container spacing= {2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Systolic BP (mmHg)"
                      name="systolicBP"
                      type="number"
                      value={formData.systolicBP}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Diastolic BP (mmHg)"
                      name="diastolicBP"
                      type="number"
                      value={formData.diastolicBP}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Total Cholesterol (mg/dL)"
                      name="totalCholesterol"
                      type="number"
                      value={formData.totalCholesterol}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="HDL Cholesterol (mg/dL)"
                      name="hdlCholesterol"
                      type="number"
                      value={formData.hdlCholesterol}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="LDL Cholesterol (mg/dL)"
                      name="ldlCholesterol"
                      type="number"
                      value={formData.ldlCholesterol}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Serum Troponin-I (ng/mL)"
                      name="troponin"
                      type="number"
                      inputProps={{ step: "0.01" }}
                      value={formData.troponin}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Resting Heart Rate (bpm)"
                      name="restingHR"
                      type="number"
                      value={formData.restingHR}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Chest Pain Type"
                      name="chestPainType"
                      value={formData.chestPainType}
                      onChange={handleChange}
                    >
                      <MenuItem value="none">Asymptomatic / None</MenuItem>
                      <MenuItem value="atypical">Atypical Angina</MenuItem>
                      <MenuItem value="typical">Typical Angina</MenuItem>
                      <MenuItem value="nonanginal">Non-Anginal Pain</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Smoking Status"
                      name="smokingStatus"
                      value={formData.smokingStatus}
                      onChange={handleChange}
                    >
                      <MenuItem value="never">Never Smoked</MenuItem>
                      <MenuItem value="former">Former Smoker</MenuItem>
                      <MenuItem value="current">Current Smoker</MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Diabetes History"
                      name="diabetesHistory"
                      value={formData.diabetesHistory}
                      onChange={handleChange}
                    >
                      <MenuItem value="no">No History</MenuItem>
                      <MenuItem value="yes">Diagnosed Diabetes</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={() => setAnalyzed(true)}
                  startIcon={<SpeedIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    bgcolor: '#f43f5e',
                    '&:hover': { bgcolor: '#e11d48' },
                  }}
                >
                  Evaluate Cardiovascular Risk
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Agent Output & Diagnostic Reports */}
          <Grid item xs={12} lg={7}>
            <Stack spacing={3}>
              {/* Risk Gauge Card */}
              <Card variant="outlined" sx={{ borderRadius: '20px', border: `1px solid ${riskColor}40` }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Cardiology Agent Assessment
                    </Typography>
                    <Chip label={riskCategory} sx={{ bgcolor: `${riskColor}20`, color: riskColor, fontWeight: 800 }} />
                  </Stack>

                  <Box sx={{ my: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">10-Year ASCVD Event Probability</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: riskColor }}>{riskScore}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={riskScore}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': { bgcolor: riskColor, borderRadius: 6 },
                      }}
                    />
                  </Box>

                  <Alert severity={riskScore > 15 ? 'warning' : 'success'} sx={{ borderRadius: '12px' }}>
                    {riskScore > 15
                      ? 'Elevated cardiovascular risk detected. Recommended LDL target < 70 mg/dL with high-intensity statin therapy.'
                      : 'Cardiovascular risk within acceptable range. Routine lipid and blood pressure screening advised every 12 months.'}
                  </Alert>
                </CardContent>
              </Card>

              {/* Medication & Care Plan Tabs */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <LocalPharmacyIcon sx={{ color: '#f43f5e' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Cardiology Pharma Guidance
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • <strong>Atorvastatin 20mg:</strong> Daily bedtime dose for plaque stabilization.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • <strong>Amlodipine 5mg:</strong> BP target &lt; 130/80 mmHg.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Aspirin 75mg:</strong> Primary prevention based on risk profile.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <RestaurantIcon sx={{ color: '#10b981' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Heart-Healthy DASH Diet
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • Sodium restriction &lt; 2,000 mg/day (DASH Protocol).
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • High omega-3 fatty acids (Walnuts, Flaxseed, Salmon).
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Aerobic exercise 150 mins/week moderate intensity.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Agent Reasoning Box */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', bgcolor: 'rgba(244, 63, 94, 0.03)', borderColor: 'rgba(244, 63, 94, 0.15)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ color: '#f43f5e' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f43f5e' }}>
                    Agent Clinical Reasoning
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Cardiology CDSS evaluated patient parameters: BP {formData.systolicBP}/{formData.diastolicBP} mmHg, Total Cholesterol {formData.totalCholesterol} mg/dL, and Troponin {formData.troponin} ng/mL. Troponin remains below the acute myocardial infarction threshold (&lt; 0.04 ng/mL). Framingham-derived ASCVD index indicates elevated 10-year major adverse cardiac event (MACE) likelihood requiring aggressive lipid management.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
