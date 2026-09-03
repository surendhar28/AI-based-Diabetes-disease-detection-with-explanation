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
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import ShieldIcon from '@mui/icons-material/Shield';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';

export default function KidneyAgent() {
  const [formData, setFormData] = useState({
    creatinine: 1.4,
    eGFR: 52,
    bun: 28,
    uacr: 140, // Urine Albumin-to-Creatinine Ratio (mg/g)
    systolicBP: 135,
    potassium: 4.8,
    diabetesHistory: 'yes',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Determine CKD Stage based on eGFR
  const getCKDStage = (egfr) => {
    const val = Number(egfr);
    if (val >= 90) return { stage: 'CKD Stage 1 (Normal / High eGFR)', color: '#10b981', severity: 'Low' };
    if (val >= 60) return { stage: 'CKD Stage 2 (Mildly Decreased)', color: '#10b981', severity: 'Mild' };
    if (val >= 45) return { stage: 'CKD Stage 3a (Mild to Moderate)', color: '#f59e0b', severity: 'Moderate' };
    if (val >= 30) return { stage: 'CKD Stage 3b (Moderate to Severe)', color: '#f59e0b', severity: 'Moderate-High' };
    if (val >= 15) return { stage: 'CKD Stage 4 (Severely Decreased)', color: '#ef4444', severity: 'High' };
    return { stage: 'CKD Stage 5 (Kidney Failure / ESRD)', color: '#dc2626', severity: 'Critical' };
  };

  const ckdInfo = getCKDStage(formData.eGFR);

  return (
    <Container maxWidth="xl">
      <Stack spacing={4}>
        {/* Header Banner */}
        <Paper
          variant="outlined"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(217, 119, 6, 0.02) 100%)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
            <Stack direction="row" spacing={2.5} alignItems="center">
              <Box
                sx={{
                  bgcolor: 'rgba(245, 158, 11, 0.15)',
                  color: '#f59e0b',
                  p: 2,
                  borderRadius: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WaterDropIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 0.5 }}>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.02em', color: '#f59e0b' }}>
                    Nephrology & Kidney Specialist Agent
                  </Typography>
                  <Chip label="Interactive UI Preview" size="small" sx={{ bgcolor: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', fontWeight: 700 }} />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  CKD Staging (CKD-EPI 2021) • Albuminuria & eGFR Decline Trajectory • Renal Dosage Adjustments
                </Typography>
              </Box>
            </Stack>

            <Button
              component={Link}
              to="/"
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              sx={{ borderColor: 'rgba(245, 158, 11, 0.4)', color: '#f59e0b', '&:hover': { borderColor: '#f59e0b', bgcolor: 'rgba(245, 158, 11, 0.08)' } }}
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
                  <WaterDropIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Renal Biomarkers Intake
                  </Typography>
                </Stack>

                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Serum Creatinine (mg/dL)"
                      name="creatinine"
                      type="number"
                      inputProps={{ step: "0.1" }}
                      value={formData.creatinine}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="eGFR (mL/min/1.73m²)"
                      name="eGFR"
                      type="number"
                      value={formData.eGFR}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Blood Urea Nitrogen (BUN)"
                      name="bun"
                      type="number"
                      value={formData.bun}
                      onChange={handleChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Urine Albumin (UACR mg/g)"
                      name="uacr"
                      type="number"
                      value={formData.uacr}
                      onChange={handleChange}
                    />
                  </Grid>
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
                      label="Serum Potassium (mEq/L)"
                      name="potassium"
                      type="number"
                      inputProps={{ step: "0.1" }}
                      value={formData.potassium}
                      onChange={handleChange}
                    />
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
                    bgcolor: '#f59e0b',
                    color: '#080c0f',
                    '&:hover': { bgcolor: '#d97706', color: '#ffffff' },
                  }}
                >
                  Calculate Renal Function & CKD Stage
                </Button>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Column: Agent Results */}
          <Grid item xs={12} lg={7}>
            <Stack spacing={3}>
              {/* CKD Stage Gauge Card */}
              <Card variant="outlined" sx={{ borderRadius: '20px', border: `1px solid ${ckdInfo.color}40` }}>
                <CardContent sx={{ p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Nephrology Agent Assessment
                    </Typography>
                    <Chip label={ckdInfo.stage} sx={{ bgcolor: `${ckdInfo.color}20`, color: ckdInfo.color, fontWeight: 800 }} />
                  </Stack>

                  <Box sx={{ my: 2 }}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">eGFR Reserve Percentage</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 800, color: ckdInfo.color }}>{formData.eGFR} mL/min</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={Math.min(Math.max((formData.eGFR / 120) * 100, 5), 100)}
                      sx={{
                        height: 12,
                        borderRadius: 6,
                        bgcolor: 'rgba(255,255,255,0.08)',
                        '& .MuiLinearProgress-bar': { bgcolor: ckdInfo.color, borderRadius: 6 },
                      }}
                    />
                  </Box>

                  <Alert severity={formData.eGFR < 60 ? 'warning' : 'success'} sx={{ borderRadius: '12px' }}>
                    {formData.eGFR < 60
                      ? `Moderate reduction in renal filtration (eGFR ${formData.eGFR}). Monitor renal clearance before prescribing nephrotoxic drugs.`
                      : 'Renal filtration function within normal reference range. Maintain hydration and periodic urine microalbumin screening.'}
                  </Alert>
                </CardContent>
              </Card>

              {/* Renal Meds & Diet Cards */}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card variant="outlined" sx={{ borderRadius: '16px', height: '100%' }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                        <LocalPharmacyIcon sx={{ color: '#f59e0b' }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          Renal Drug Guidance
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • <strong>ACE Inhibitor (Ramipril 2.5mg):</strong> Antiproteinuric renal protection.
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • ⚠️ <strong>NSAID Contraindication:</strong> Avoid Ibuprofen &amp; Naproxen to prevent acute renal injury.
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • <strong>Metformin Dose Reduction:</strong> Reduce dose when eGFR &lt; 45 mL/min.
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
                          Renal Diet Protocol
                        </Typography>
                      </Stack>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • Controlled dietary protein intake (0.8 g/kg body weight/day).
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        • Low-phosphorus foods (avoid dark colas &amp; processed cheeses).
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        • Serum potassium monitoring ({formData.potassium} mEq/L within safety limit).
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Agent Reasoning Box */}
              <Paper variant="outlined" sx={{ p: 3, borderRadius: '16px', bgcolor: 'rgba(245, 158, 11, 0.03)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <AutoAwesomeIcon sx={{ color: '#f59e0b' }} />
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                    Agent Clinical Reasoning
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  Nephrology CDSS parsed lab metrics: eGFR {formData.eGFR} mL/min/1.73m², Serum Creatinine {formData.creatinine} mg/dL, and UACR {formData.uacr} mg/g. Microalbuminuria (140 mg/g) indicates diabetic nephropathy risk. Agent triggers renal protective protocol with SGLT2i/ACEi recommendation to delay CKD progression.
                </Typography>
              </Paper>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}
