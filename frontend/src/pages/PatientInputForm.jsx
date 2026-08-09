import React, { useContext, useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import BiotechIcon from '@mui/icons-material/Biotech';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import RestoreIcon from '@mui/icons-material/Restore';
import { AppStateContext } from '../App.jsx';
import { predictDiabetes, predictGeneral, saveCase } from '../services/api.js';

const initialForm = {
  patient_email: '',
  symptoms: 'fatigue, excessive thirst, frequent urination, blurred vision',
  age: 52,
  gender: 'male',
  glucose: 184,
  hba1c_level: 7.2,
  hypertension: 1,
  heart_disease: 0,
  smoking_history: 'former',
  blood_pressure: 82,
  skin_thickness: 32,
  insulin: 160,
  bmi: 33.4,
  diabetes_pedigree_function: 0.62,
  pregnancies: 0,
  food_preference: 'veg',
};

const loadingMessages = [
  'Ingesting symptom records and vital signs...',
  'Running General Symptom Classifier Agent...',
  'Evaluating clinical triggers and thresholds...',
  'Executing XGBoost Diabetes risk model...',
  'Synthesizing diagnostic and medication warnings...',
  'Structuring clinical recommendation report...'
];

export default function PatientInputForm() {
  const { setCaseResult } = useContext(AppStateContext);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setLoadingMsgIdx((prev) => (prev + 1) % loadingMessages.length);
      }, 1500);
    } else {
      setLoadingMsgIdx(0);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const update = (field) => (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));

  const resetForm = () => setForm(initialForm);

  async function submit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const labs = {
        glucose: Number(form.glucose),
        hba1c_level: Number(form.hba1c_level),
        hypertension: Number(form.hypertension),
        heart_disease: Number(form.heart_disease),
        smoking_history: form.smoking_history,
        blood_pressure: Number(form.blood_pressure),
        skin_thickness: Number(form.skin_thickness),
        insulin: Number(form.insulin),
        bmi: Number(form.bmi),
        diabetes_pedigree_function: Number(form.diabetes_pedigree_function),
        pregnancies: Number(form.pregnancies),
      };
      const general = await predictGeneral({
        symptoms: form.symptoms,
        age: Number(form.age),
        gender: form.gender,
        food_preference: form.food_preference,
        labs,
      });
      let diabetes = null;
      if (general.diabetes_triggered) {
        diabetes = await predictDiabetes({
          ...labs,
          age: Number(form.age),
          gender: form.gender,
          food_preference: form.food_preference,
        });
      }

      // Save case report to DB
      await saveCase({
        patient_email: form.patient_email,
        symptoms: form.symptoms,
        labs,
        general_prediction: general,
        diabetes_prediction: diabetes,
      });

      setCaseResult({ general, diabetes, input: { ...form, ...labs } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Unable to complete assessment. Check that the FastAPI server is running.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ position: 'relative' }}>
      <Stack spacing={3} component="form" onSubmit={submit}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Typography variant="h4" sx={{ fontWeight: 850, mb: 1 }}>Patient Intake Portal</Typography>
            <Typography color="text.secondary">Capture symptoms and lab values for clinical agent screening.</Typography>
          </div>
          <Button 
            variant="outlined" 
            color="primary" 
            startIcon={<RestoreIcon />}
            onClick={resetForm}
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          >
            Reset Form
          </Button>
        </Box>

        <Card variant="outlined" sx={{ overflow: 'visible', position: 'relative' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" color="primary.main" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
              <BiotechIcon />
              1. Symptom Narrative
            </Typography>
            <TextField 
              label="Describe Symptoms, Vitals, and History" 
              multiline 
              minRows={3} 
              fullWidth
              placeholder="e.g. Patient presents with persistent fatigue, dry mouth, excessive urination at night, and occasional blurry vision..."
              value={form.symptoms} 
              onChange={update('symptoms')} 
              required 
            />
          </CardContent>
        </Card>

        <Grid container spacing={3}>
          <Grid item xs={12} md={5}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary.main" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonOutlineIcon />
                  2. Demographics & History
                </Typography>
                <Stack spacing={2.5}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Patient Email Address"
                    placeholder="patient@example.com"
                    value={form.patient_email}
                    onChange={update('patient_email')}
                    required
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField fullWidth type="number" label="Age" value={form.age} onChange={update('age')} required inputProps={{ min: 0 }} />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField select fullWidth label="Gender" value={form.gender} onChange={update('gender')}>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField select fullWidth label="Food Preference" value={form.food_preference} onChange={update('food_preference')}>
                    <MenuItem value="veg">Vegetarian</MenuItem>
                    <MenuItem value="non-veg">Non-Vegetarian</MenuItem>
                  </TextField>

                  <TextField select fullWidth label="Smoking History" value={form.smoking_history} onChange={update('smoking_history')}>
                    <MenuItem value="never">Never Smoked</MenuItem>
                    <MenuItem value="former">Former Smoker</MenuItem>
                    <MenuItem value="current">Current Smoker</MenuItem>
                    <MenuItem value="not current">Not Current Smoker</MenuItem>
                    <MenuItem value="ever">Ever Smoked</MenuItem>
                    <MenuItem value="no info">No Information</MenuItem>
                  </TextField>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField select fullWidth label="Hypertension" value={form.hypertension} onChange={update('hypertension')}>
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField select fullWidth label="Heart Disease" value={form.heart_disease} onChange={update('heart_disease')}>
                        <MenuItem value={0}>No</MenuItem>
                        <MenuItem value={1}>Yes</MenuItem>
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField fullWidth type="number" label="Pregnancies (if applicable)" value={form.pregnancies} onChange={update('pregnancies')} required inputProps={{ min: 0 }} />
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" color="primary.main" sx={{ mb: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AnalyticsIcon />
                  3. Laboratory Measurements
                </Typography>
                <Grid container spacing={2}>
                  {[
                    ['glucose', 'Glucose (mg/dL)'],
                    ['hba1c_level', 'HbA1c Level (%)'],
                    ['blood_pressure', 'Diastolic BP (mmHg)'],
                    ['skin_thickness', 'Skin Thickness (mm)'],
                    ['insulin', 'Insulin (mu U/ml)'],
                    ['bmi', 'BMI (kg/m²)'],
                    ['diabetes_pedigree_function', 'Diabetes Pedigree Function'],
                  ].map(([field, label]) => (
                    <Grid item xs={12} sm={6} key={field}>
                      <TextField 
                        fullWidth 
                        type="number" 
                        label={label} 
                        value={form[field]} 
                        onChange={update(field)} 
                        required 
                        inputProps={{ step: field === 'diabetes_pedigree_function' || field === 'hba1c_level' || field === 'bmi' ? 0.01 : 1, min: 0 }}
                      />
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', gap: 2, pt: 1 }}>
          <Button 
            type="submit" 
            variant="contained" 
            size="large" 
            disabled={loading} 
            startIcon={<SendIcon />}
            sx={{ flexGrow: 1, py: 2, borderRadius: '12px' }}
          >
            Run Clinical Diagnostics
          </Button>
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={resetForm}
            sx={{ display: { xs: 'inline-flex', sm: 'none' }, borderRadius: '12px' }}
          >
            Reset
          </Button>
        </Box>
      </Stack>

      {loading && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: (theme) => theme.palette.mode === 'light' ? 'rgba(255,255,255,0.85)' : 'rgba(8,12,15,0.92)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(6px)',
            p: 4,
          }}
        >
          <Box className="scanner-overlay" />
          <CircularProgress color="primary" size={70} thickness={4} sx={{ mb: 4 }} />
          <Typography variant="h5" sx={{ mb: 1.5, fontWeight: 800, letterSpacing: '-0.02em' }}>
            Running Agent Diagnostics
          </Typography>
          <Typography variant="body1" color="primary.main" align="center" sx={{ fontWeight: 600, height: 24 }}>
            {loadingMessages[loadingMsgIdx]}
          </Typography>
          <Typography variant="caption" color="text.secondary" align="center" sx={{ maxWidth: 380, mt: 3 }}>
            Our symptom classifiers, routing switches, and XGBoost predictors are calculating probabilities and screening guidelines...
          </Typography>
        </Box>
      )}

      <Snackbar open={Boolean(error)} autoHideDuration={8000} onClose={() => setError('')}>
        <Alert severity="error" variant="filled" onClose={() => setError('')} sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
}
