import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import AirIcon from '@mui/icons-material/Air';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';

export default function LungAgent() {
  const [formData, setFormData] = useState({
    spO2: 95,
    fev1: 68,
    fvc: 82,
    fev1FvcRatio: 0.64,
    respiratoryRate: 18,
    packYears: 15,
    mmrcGrade: 'grade2',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Determine GOLD COPD / Pulmonology Severity
  const getSeverity = () => {
    const fev1Val = Number(formData.fev1);
    const ratio = Number(formData.fev1FvcRatio);
    if (ratio >= 0.70 && fev1Val >= 80) return { stage: 'Normal Pulmonary Function', color: '#10b981', label: 'Normal' };
    if (fev1Val >= 80) return { stage: 'GOLD 1: Mild Airway Obstruction', color: '#10b981', label: 'Mild' };
    if (fev1Val >= 50) return { stage: 'GOLD 2: Moderate Airway Obstruction', color: '#f59e0b', label: 'Moderate' };
    if (fev1Val >= 30) return { stage: 'GOLD 3: Severe Airway Obstruction', color: '#ef4444', label: 'Severe' };
    return { stage: 'GOLD 4: Very Severe Respiratory Impairment', color: '#dc2626', label: 'Critical' };
  };

  const severityInfo = getSeverity();

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Header Banner */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.08) 0%, rgba(14, 165, 233, 0.02) 100%)',
            border: '1px solid rgba(2, 132, 199, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: 'rgba(2, 132, 199, 0.15)',
                  color: '#0284c7',
                  p: 2,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AirIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#0284c7' }}>
                    Pulmonology & Lung Specialist Agent
                  </Typography>
                  <Chip label="Interactive UI Preview" size="small" sx={{ bgcolor: 'rgba(2, 132, 199, 0.2)', color: '#0284c7', fontWeight: 700 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Spirometry (FEV1/FVC) • GOLD COPD Staging • Oxygenation & Airway Obstruction Diagnostics
                </Typography>
              </Box>
            </Stack>

            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ borderColor: 'rgba(2, 132, 199, 0.4)', color: '#0284c7', '&:hover': { borderColor: '#0284c7', bgcolor: 'rgba(2, 132, 199, 0.08)' } }}
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
                  <AirIcon sx={{ color: '#0284c7' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Pulmonary Vitals Intake
                  </Typography>
                </Stack>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="SpO2 Saturation (%)"
                      name="spO2"
                      type="number"
                      value={formData.spO2}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="FEV1 (% predicted)"
                      name="fev1"
                      type="number"
                      value={formData.fev1}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="FVC (% predicted)"
                      name="fvc"
                      type="number"
                      value={formData.fvc}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="FEV1/FVC Ratio"
                      name="fev1FvcRatio"
                      type="number"
                      inputProps={{ step: "0.01" }}
                      value={formData.fev1FvcRatio}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Respiratory Rate (breaths/min)"
                      name="respiratoryRate"
                      type="number"
                      value={formData.respiratoryRate}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Smoking History (Pack-Years)"
                      name="packYears"
                      type="number"
                      value={formData.packYears}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="mMRC Dyspnea Scale"
                      name="mmrcGrade"
                      value={formData.mmrcGrade}
                      onChange={handleChange}
                    >
                      <MenuItem value="grade0">Grade 0: Breathless only with strenuous exercise</MenuItem>
                      <MenuItem value="grade1">Grade 1: Short of breath when hurrying on level ground</MenuItem>
                      <MenuItem value="grade2">Grade 2: Walks slower than peers due to breathlessness</MenuItem>
                      <MenuItem value="grade3">Grade 3: Stops for breath after walking 100 meters</MenuItem>
                      <MenuItem value="grade4">Grade 4: Too breathless to leave house or dress</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<SpeedIcon />}
                  sx={{
                    mt: 3,
                    py: 1.5,
                    bgcolor: '#0284c7',
                    '&:hover': { bgcolor: '#0369a1' },
                  }}
                >
                  Evaluate Respiratory & Spirometry Status
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Agent Output */}
          <Grid item xs={12} lg={7}>
            <Stack spacing={3}>
              {/* Severity Gauge Card */}
              <Card variant="outlined" sx={{ borderRadius: '20px', border: `1px solid ${severityInfo.color}40` }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Pulmonology Agent Assessment
                    </Typography>
                    <Chip label={severityInfo.stage} sx={{ bgcolor: `${severityInfo.color}20`, color: severityInfo.color, fontWeight: 800 }} />
                  </Stack>

                  <Box sx={{ my: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">FEV1 Airway Capacity</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: severityInfo.color }}>{formData.fev1}%</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={formData.fev1}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': { bgcolor: severityInfo.color, borderRadius: 6 },
                      }}
                    />
                  </Box>

                  <Alert severity={formData.spO2 < 92 ? 'error' : formData.fev1 < 70 ? 'warning' : 'success'} sx={{ borderRadius: '12px' }}>
                    {formData.spO2 < 92
                      ? `⚠️ Hypoxia alert (SpO2 ${formData.spO2}%). Immediate supplemental oxygen therapy and arterial blood gas evaluation indicated.`
                      : formData.fev1 < 70
                      ? `Airway obstruction present (FEV1 ${formData.fev1}% predicted, FEV1/FVC ${formData.fev1FvcRatio}). Inhaled bronchodilator regimen recommended.`
                      : 'Oxygenation and ventilatory parameters within normal baseline limits.'}
                  </Alert>
                </CardContent>
              </Card>

              {/* Respiratory Meds & Rehab Cards */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <LocalPharmacyIcon sx={{ color: '#0284c7' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Inhaler & Inhaled Therapy
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • <strong>Tiotropium (LAMA):</strong> 18 mcg inhalation once daily.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • <strong>Salbutamol (SABA):</strong> 100 mcg rescue inhaler PRN.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Budasonide/Formoterol:</strong> Maintenance combination for persistent symptoms.
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
                          Pulmonary Rehab Protocol
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • Pursed-lip breathing &amp; diaphragmatic breathing exercises.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • Smoking cessation support program.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Annual Pneumococcal &amp; Influenza vaccination.
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Agent Reasoning Box */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', bgcolor: 'rgba(2, 132, 199, 0.03)', borderColor: 'rgba(2, 132, 199, 0.15)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ color: '#0284c7' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#0284c7' }}>
                    Agent Clinical Reasoning
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Pulmonology CDSS analyzed spirometry metrics: FEV1 {formData.fev1}%, FVC {formData.fvc}%, and FEV1/FVC ratio {formData.fev1FvcRatio}. Ratio &lt; 0.70 confirms obstructive ventilatory defect. FEV1 score of {formData.fev1}% stratifies case into GOLD Category 2 (Moderate COPD). Oxygen saturation of {formData.spO2}% is satisfactory on room air.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
