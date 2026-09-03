import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AssignmentIcon from '@mui/icons-material/Assignment';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { AppStateContext } from '../App.jsx';
import { downloadReportAsFile, triggerPrintReport } from '../utils/reportExporter.js';
import { getCases, getCaseDetails } from '../services/api.js';

const sampleDiabetesReport = {
  diagnosis: 'Type 2 Diabetes',
  risk_probability: 0.84,
  severity: 'severe',
  model_used: 'XGBoost Classifier (97.10% Accuracy)',
  model_metrics: {
    accuracy: 0.971,
    roc_auc: 0.9732,
    precision: 1.0,
    recall: 0.6712,
    f1_score: 0.8033,
    confusion_matrix: [[21864, 0], [695, 1419]],
  },
  medications: {
    first_line_therapy: 'Metformin Hydrochloride 500mg Extended Release',
    reasoning: 'ADA guidelines recommend Metformin ER as initial pharmacotherapy for glycemic control in Type 2 Diabetes.',
    commercial_brands: [
      { id: 1, name: 'Glycomet SR 500mg', manufacturer: 'USV Ltd', price_inr: 34.50, packaging: 'Strip of 15 tablets', active_composition: 'Metformin (500mg)' },
      { id: 2, name: 'Glyciphage SR 500mg', manufacturer: 'Franco-Indian Pharmaceuticals', price_inr: 31.20, packaging: 'Strip of 10 tablets', active_composition: 'Metformin (500mg)' },
      { id: 3, name: 'Obimet 500mg', manufacturer: 'Abbott Healthcare', price_inr: 28.00, packaging: 'Strip of 10 tablets', active_composition: 'Metformin (500mg)' },
    ],
    dosage_warnings: [
      'Take with or immediately after meals to minimize gastrointestinal discomfort.',
      'Monitor eGFR annually; discontinue if eGFR drops below 30 mL/min/1.73m².',
      'Avoid heavy alcohol consumption due to risk of lactic acidosis.'
    ]
  },
  diet: {
    strategy: 'Low Glycemic Index & Calorie-Restricted Meal Plan',
    daily_calorie_target: '1,800 kcal / day',
    macro_split: [
      { name: 'Carbohydrates (Low GI)', percentage: '45%' },
      { name: 'Lean Protein', percentage: '30%' },
      { name: 'Healthy Fats', percentage: '25%' },
    ],
    meals: [
      { time: 'Breakfast (8:00 AM)', items: 'Steel-cut oats with cinnamon, 2 boiled egg whites, green tea.' },
      { time: 'Lunch (1:00 PM)', items: 'Brown rice / Ragi roti, dal tadka, mixed vegetable salad, curd.' },
      { time: 'Snack (5:00 PM)', items: 'Handful of roasted almonds and walnuts, black coffee.' },
      { time: 'Dinner (8:00 PM)', items: 'Grilled tofu / chicken with steamed broccoli and quinoa.' }
    ],
    foods_to_avoid: ['Refined sugar & sweetened beverages', 'White bread & polished rice', 'Fried snacks & trans fats']
  },
  explanation: {
    ai_provider: 'Tier 1 Google Gemini 2.5 AI (Clinical Engine)',
    clinical_summary: 'Patient exhibits elevated fasting blood glucose (184 mg/dL) and HbA1c (7.2%), exceeding standard diagnostic thresholds for Type 2 Diabetes. Prompt glycemic intervention with Metformin ER and a low GI dietary protocol is recommended.',
    evidence_base: [
      'ADA Standards of Care in Diabetes (2026): Glycemic targets and pharmacotherapy guidelines.',
      'CDC National Diabetes Statistics & Clinical Diagnostic Criteria.',
      'WHO Guidelines on T2D Management in Primary Healthcare.'
    ]
  },
  alternative_medicine: [
    { name: 'Cinnamomum Verum (Cinnamon)', benefit: 'Enhances insulin receptor sensitivity', evidence_score: 0.85, research_summary: 'Meta-analyses show moderate reductions in fasting blood glucose with 1-2g daily cinnamon intake.' },
    { name: 'Fenugreek (Trigonella foenum-graecum)', benefit: 'Delays glucose absorption in gut', evidence_score: 0.82, research_summary: 'High soluble fiber content improves postprandial glycemic response.' },
    { name: 'Gymnema Sylvestre (Gurmar)', benefit: 'Reduces sweet taste sensation & glucose uptake', evidence_score: 0.78, research_summary: 'Clinical studies report reduced sugar cravings and HbA1c support.' }
  ]
};

export default function DiabetesReport() {
  const { caseResult, setCaseResult, mode, currentUser } = useContext(AppStateContext);
  const isPatient = currentUser?.role === 'patient';
  const [tab, setTab] = useState(isPatient ? 1 : 0);
  const [fetchingCase, setFetchingCase] = useState(false);

  // Auto-fetch latest case from database if caseResult is null
  useEffect(() => {
    async function autoLoadCase() {
      if (!caseResult) {
        setFetchingCase(true);
        try {
          const cases = await getCases();
          if (cases && cases.length > 0) {
            const latestDetails = await getCaseDetails(cases[0].id);
            setCaseResult({
              general: latestDetails.general_prediction,
              diabetes: latestDetails.diabetes_prediction || sampleDiabetesReport,
              input: { ...latestDetails.labs, symptoms: latestDetails.symptoms, patient_name: latestDetails.patient_name, patient_email: latestDetails.patient_email }
            });
          }
        } catch (err) {
          console.log('No historical case found, ready for sample load', err);
        } finally {
          setFetchingCase(false);
        }
      }
    }
    autoLoadCase();
  }, [caseResult, setCaseResult]);

  useEffect(() => {
    if (isPatient && (tab === 0 || tab === 3)) {
      setTab(1);
    }
  }, [isPatient, tab]);

  const loadDemoReport = () => {
    setCaseResult({
      general: { diabetes_triggered: true, trigger_reasons: ['Blood glucose >= 126 mg/dL'] },
      diabetes: sampleDiabetesReport,
      input: {
        patient_name: 'John Doe',
        patient_email: 'john.doe@example.com',
        symptoms: 'fatigue, excessive thirst, frequent urination',
        glucose: 184,
        hba1c_level: 7.2,
        age: 52,
        gender: 'male',
        bmi: 33.4,
        blood_pressure: 82,
        smoking_history: 'former',
        hypertension: 1,
        heart_disease: 0
      }
    });
  };

  const report = caseResult?.diabetes || (fetchingCase ? null : null);
  const matrix = report?.model_metrics?.confusion_matrix || [[0, 0], [0, 0]];

  if (fetchingCase) {
    return (
      <Box sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress color="primary" size={50} sx={{ mb: 2 }} />
        <Typography variant="body1" color="text.secondary">
          Loading clinical report records...
        </Typography>
      </Box>
    );
  }

  if (!report) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Card variant="outlined" sx={{ maxWidth: 600, mx: 'auto', p: 4, borderRadius: '24px' }}>
          <Alert severity="info" variant="outlined" sx={{ mb: 3, borderRadius: '14px', textAlign: 'left' }}>
            No active patient case selected. Complete a new assessment or load a demonstration clinical report.
          </Alert>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button component={Link} to="/intake" variant="contained" color="primary" size="large" sx={{ borderRadius: '12px', px: 3.5, fontWeight: 800 }}>
              New Intake Screening
            </Button>
            <Button variant="outlined" color="secondary" size="large" startIcon={<PlayArrowIcon />} onClick={loadDemoReport} sx={{ borderRadius: '12px', px: 3.5, fontWeight: 800 }}>
              Load Sample Report
            </Button>
          </Stack>
        </Card>
      </Box>
    );
  }

  const getMacroColor = (macro) => {
    const l = macro.toLowerCase();
    if (l.includes('carb')) return 'error';
    if (l.includes('protein')) return 'success';
    return 'primary';
  };

  const headerCard = isPatient ? (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: '24px',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(15,118,110,0.08) 100%)' 
          : 'linear-gradient(135deg, rgba(16,185,129,0.12) 0%, rgba(15,118,110,0.12) 100%)',
        borderColor: mode === 'light' ? 'rgba(16,185,129,0.3)' : 'rgba(20,184,166,0.3)'
      }}
    >
      <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Personalized Care Guidelines" color="success" sx={{ fontWeight: 800 }} />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 850, mb: 1, letterSpacing: '-0.02em' }}>
          My Medication &amp; Diet Plan
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 550, mt: 1 }}>
          View daily meals, low-glycemic dietary plans, and prescription guidelines compiled from your clinical history.
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Card 
      variant="outlined" 
      sx={{ 
        borderRadius: '24px',
        background: mode === 'light' 
          ? 'linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(15,118,110,0.08) 100%)' 
          : 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(15,118,110,0.12) 100%)',
        borderColor: mode === 'light' ? 'rgba(124,58,237,0.3)' : 'rgba(20,184,166,0.3)'
      }}
    >
      <CardContent sx={{ p: { xs: 3.5, md: 4.5 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip size="small" label="Primary Diagnosis" color="secondary" sx={{ fontWeight: 800 }} />
              <Chip size="small" label={report.severity} color="warning" sx={{ fontWeight: 800 }} />
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 850, mb: 1, letterSpacing: '-0.02em' }}>
              {report.diagnosis}
            </Typography>
            <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 550 }}>
              Diagnostic Model: {report.model_used}
            </Typography>
          </Grid>
          <Grid item xs={12} md={5}>
            <Box 
              className="glass-panel" 
              sx={{ 
                p: 2.5, 
                borderRadius: '16px',
                background: mode === 'light' ? 'rgba(255,255,255,0.75)' : 'rgba(15,23,30,0.75)'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 750 }} color="text.secondary">
                  XGBoost Risk Score
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: 900 }} color="secondary.main">
                  {Math.round(report.risk_probability * 100)}%
                </Typography>
              </Stack>
              <LinearProgress 
                variant="determinate" 
                value={report.risk_probability * 100} 
                color="secondary"
                sx={{ height: 10, borderRadius: 99, mb: 0.5 }} 
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Stack spacing={4}>
      {/* Top Header & Download Action Bar */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
        <div>
          <Typography variant="h4" sx={{ fontWeight: 850 }}>
            Specialist Clinical Report
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Generated by Autonomous Diabetes CDSS Agent with Gemini 2.5 AI Reasoning
          </Typography>
        </div>

        <Stack direction="row" spacing={1.5} className="no-print">
          <Button
            variant="contained"
            color="primary"
            startIcon={<PrintIcon />}
            onClick={triggerPrintReport}
            sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 800, boxShadow: '0 4px 14px rgba(20, 184, 166, 0.3)' }}
          >
            Download PDF / Print Report
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<DownloadIcon />}
            onClick={() => downloadReportAsFile(caseResult, currentUser)}
            sx={{ borderRadius: '12px', px: 3, py: 1.2, fontWeight: 800 }}
          >
            Export Report (.txt)
          </Button>
        </Stack>
      </Box>

      {headerCard}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="no-print">
        <Tabs 
          value={tab} 
          onChange={(_, value) => setTab(value)} 
          variant="scrollable" 
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 800,
              fontSize: '0.95rem',
              minHeight: 48,
              mr: 2,
              transition: 'color 0.2s',
            }
          }}
        >
          {!isPatient && <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label="Diagnosis Detail" value={0} />}
          <Tab icon={<LocalHospitalIcon fontSize="small" />} iconPosition="start" label="Medications & Brand Lookup" value={1} />
          <Tab icon={<RestaurantMenuIcon fontSize="small" />} iconPosition="start" label="Glycemic Diet Plan" value={2} />
          {!isPatient && <Tab icon={<InfoIcon fontSize="small" />} iconPosition="start" label="Alternative Medicine" value={3} />}
        </Tabs>
      </Box>

      {/* Tab 0: Diagnosis Detail */}
      {(!isPatient && tab === 0) && (
        <Grid container spacing={3.5}>
          <Grid item xs={12} md={7}>
            <Card variant="outlined" sx={{ height: '100%', borderRadius: '20px' }}>
              <CardContent sx={{ p: 3.5 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <AutoAwesomeIcon color="primary" />
                  Dual-Tier AI Clinical Explanation &amp; Reasoning
                </Typography>
                
                <Box sx={{ p: 2, mb: 2.5, borderRadius: '12px', bgcolor: 'primary.main', color: '#ffffff' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                    Primary AI Engine: {report.explanation.ai_provider || 'Tier 1 Google Gemini 2.5 AI'}
                  </Typography>
                </Box>

                <Typography variant="body1" paragraph sx={{ lineHeight: 1.7, fontWeight: 500 }}>
                  {report.explanation.clinical_summary || report.explanation.summary}
                </Typography>

                <Divider sx={{ my: 2.5 }} />

                <Typography variant="subtitle2" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', mb: 1.5 }}>
                  Verified Guideline Proofs &amp; Evidence Base
                </Typography>
                <List disablePadding>
                  {report.explanation.evidence_base?.map((cite, idx) => (
                    <ListItem key={idx} sx={{ px: 0, py: 0.75 }}>
                      <ListItemIcon sx={{ minWidth: 32 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText 
                        primary={cite} 
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3.5}>
              <Card variant="outlined" sx={{ borderRadius: '20px' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Model Performance Metrics</Typography>
                  <Grid container spacing={2}>
                    {[
                      ['Accuracy', `${Math.round(report.model_metrics.accuracy * 100)}%`],
                      ['ROC-AUC Score', report.model_metrics.roc_auc.toFixed(4)],
                      ['Precision', `${Math.round(report.model_metrics.precision * 100)}%`],
                      ['Recall', `${Math.round(report.model_metrics.recall * 100)}%`],
                    ].map(([label, val]) => (
                      <Grid item xs={6} key={label}>
                        <Box sx={{ p: 2, borderRadius: '12px', bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 750 }}>{label}</Typography>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 900 }}>{val}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ borderRadius: '20px' }}>
                <CardContent sx={{ p: 3.5 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Confusion Matrix Breakdown</Typography>
                  <Box className="matrix-grid">
                    <Box className="matrix-cell">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>TRUE NEGATIVE</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'success.main' }}>{matrix[0][0]}</Typography>
                    </Box>
                    <Box className="matrix-cell">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>FALSE POSITIVE</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'error.main' }}>{matrix[0][1]}</Typography>
                    </Box>
                    <Box className="matrix-cell">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>FALSE NEGATIVE</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'warning.main' }}>{matrix[1][0]}</Typography>
                    </Box>
                    <Box className="matrix-cell">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>TRUE POSITIVE</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>{matrix[1][1]}</Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Stack>
          </Grid>
        </Grid>
      )}

      {/* Tab 1: Medication & Indian Brand Lookup */}
      {tab === 1 && (
        <Stack spacing={3.5}>
          <Card variant="outlined" sx={{ borderRadius: '20px' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
                First-Line Pharmacotherapy Strategy
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 850, mb: 2 }}>
                {report.medications.first_line_therapy}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                {report.medications.reasoning}
              </Typography>
            </CardContent>
          </Card>

          {/* 200k+ Commercial Brands Database Table */}
          <Card variant="outlined" sx={{ borderRadius: '20px' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 850, mb: 0.5 }}>
                Commercial Indian Pharma Brands (200,000+ Database Lookup)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3, fontWeight: 500 }}>
                Matched brand formulations and active chemical compositions from Indian pharmaceutical registries.
              </Typography>

              <Grid container spacing={2.5}>
                {report.medications.commercial_brands?.map((brand) => (
                  <Grid item xs={12} md={6} key={brand.id || brand.name}>
                    <Paper 
                      variant="outlined" 
                      sx={{ 
                        p: 2.5, 
                        borderRadius: '16px',
                        borderColor: 'primary.main',
                        background: mode === 'light' ? 'rgba(15,118,110,0.03)' : 'rgba(20,184,166,0.03)'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1 }}>
                        <Typography variant="h6" color="primary.main" sx={{ fontWeight: 850 }}>
                          {brand.name}
                        </Typography>
                        <Chip label={`₹${brand.price_inr}`} color="success" size="small" sx={{ fontWeight: 900 }} />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, display: 'block', mb: 1 }}>
                        Mfg: {brand.manufacturer} | Packaging: {brand.packaging}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Active Composition: {brand.active_composition}
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* Warnings & Contraindications */}
          <Card variant="outlined" sx={{ borderRadius: '20px', borderColor: 'warning.main', bgcolor: mode === 'light' ? 'rgba(245,158,11,0.04)' : 'rgba(245,158,11,0.02)' }}>
            <CardContent sx={{ p: 3.5 }}>
              <Typography variant="h6" color="warning.main" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <WarningAmberIcon />
                Dosage Warnings &amp; Precautions
              </Typography>
              <List disablePadding>
                {report.medications.dosage_warnings?.map((warn, idx) => (
                  <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <WarningAmberIcon color="warning" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={warn} primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Stack>
      )}

      {/* Tab 2: Glycemic Diet Plan */}
      {tab === 2 && (
        <Card variant="outlined" sx={{ borderRadius: '20px' }}>
          <CardContent sx={{ p: { xs: 3, md: 4 } }}>
            <Typography variant="h6" color="primary.main" sx={{ fontWeight: 850, mb: 1 }}>
              Glycemic Index Meal Plan Strategy
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 850, mb: 3 }}>
              {report.diet.strategy}
            </Typography>

            <Grid container spacing={2.5} sx={{ mb: 4 }}>
              {report.diet.macro_split?.map((macro) => (
                <Grid item xs={12} sm={4} key={macro.name}>
                  <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: mode === 'light' ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.03)' }}>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>{macro.name}</Typography>
                    <Typography variant="h5" color={`${getMacroColor(macro.name)}.main`} sx={{ fontWeight: 900 }}>{macro.percentage}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Typography variant="h6" sx={{ fontWeight: 800, mb: 2 }}>Daily Structured Meal Schedule</Typography>
            <Grid container spacing={2.5}>
              {report.diet.meals?.map((meal) => (
                <Grid item xs={12} sm={6} md={3} key={meal.time}>
                  <Paper variant="outlined" sx={{ p: 2.5, borderRadius: '16px', height: '100%' }}>
                    <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
                      {meal.time}
                    </Typography>
                    <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.6, fontWeight: 500 }}>
                      {meal.items}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3.5, p: 3, borderRadius: '16px', bgcolor: 'rgba(239, 68, 68, 0.06)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <Typography variant="subtitle2" color="error" sx={{ fontWeight: 800, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                ❌ Critical Foods to Avoid
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600 }}>
                {report.diet.foods_to_avoid?.join(', ')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Alternative Medicine & Lifestyle */}
      {(!isPatient && tab === 3) && (
        <Stack spacing={4}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 850, mb: 1 }}>Evidence-Scored Adjunct Care</Typography>
            <Typography color="text.secondary">Adjunct alternative therapies and positive lifestyle changes paired with research confidence indices.</Typography>
          </div>

          <Grid container spacing={3}>
            {report.alternative_medicine?.map((item) => (
              <Grid item xs={12} md={4} key={item.name}>
                <Card variant="outlined" sx={{ borderRadius: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 850, mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 550, minHeight: 40 }}>
                      {item.benefit}
                    </Typography>
                    <Box sx={{ mb: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800 }}>RESEARCH EVIDENCE</Typography>
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 900 }}>{Math.round(item.evidence_score * 100)}%</Typography>
                      </Stack>
                      <LinearProgress 
                        variant="determinate" 
                        value={item.evidence_score * 100} 
                        sx={{ height: 6, borderRadius: 3 }} 
                      />
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', lineHeight: 1.4 }}>
                      {item.research_summary}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Stack>
      )}
    </Stack>
  );
}
