import React, { useContext, useState, useEffect } from 'react';
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
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
import { AppStateContext } from '../App.jsx';

export default function DiabetesReport() {
  const { caseResult, mode, currentUser } = useContext(AppStateContext);
  const isPatient = currentUser?.role === 'patient';
  const [tab, setTab] = useState(isPatient ? 1 : 0);
  const report = caseResult?.diabetes;

  useEffect(() => {
    if (isPatient && (tab === 0 || tab === 3)) {
      setTab(1);
    }
  }, [isPatient, tab]);

  const matrix = report?.model_metrics?.confusion_matrix || [[0, 0], [0, 0]];

  if (!report) {
    return (
      <Box sx={{ py: 6, textAlign: 'center' }}>
        <Alert severity="info" variant="outlined" sx={{ maxWidth: 500, mx: 'auto', borderRadius: '12px' }}>
          No diabetes report is currently available. Start with the patient intake form.
        </Alert>
      </Box>
    );
  }

  // Calculate macro color variables
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
        background: mode === 'light' 
          ? 'linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(15,118,110,0.06) 100%)' 
          : 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(15,118,110,0.1) 100%)',
        borderColor: mode === 'light' ? 'rgba(16,185,129,0.2)' : 'rgba(20,184,166,0.2)'
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
          <Chip size="small" label="Personalized Care Guidelines" color="success" sx={{ fontWeight: 700 }} />
        </Stack>
        <Typography variant="h4" sx={{ fontWeight: 850, mb: 1, letterSpacing: '-0.02em' }}>
          My Medication & Diet Plan
        </Typography>
        <Typography color="text.secondary" variant="body1" sx={{ fontWeight: 550, mt: 1 }}>
          View daily meals and prescription guidelines compiled from your clinical assessment history.
        </Typography>
      </CardContent>
    </Card>
  ) : (
    <Card 
      variant="outlined" 
      sx={{ 
        background: mode === 'light' 
          ? 'linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(15,118,110,0.06) 100%)' 
          : 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(15,118,110,0.1) 100%)',
        borderColor: mode === 'light' ? 'rgba(124,58,237,0.2)' : 'rgba(20,184,166,0.2)'
      }}
    >
      <CardContent sx={{ p: { xs: 3, md: 4 } }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={7}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Chip size="small" label="Primary Diagnosis" color="secondary" sx={{ fontWeight: 700 }} />
              <Chip size="small" label={report.severity} color="warning" sx={{ fontWeight: 700 }} />
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
                borderRadius: '12px',
                background: mode === 'light' ? 'rgba(255,255,255,0.7)' : 'rgba(15,23,30,0.6)'
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }} color="text.secondary">
                  Model Risk Assessment
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 800 }} color="secondary.main">
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
      {headerCard}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tab} 
          onChange={(_, value) => setTab(value)} 
          variant="scrollable" 
          scrollButtons="auto"
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontWeight: 700,
              fontSize: '0.95rem',
              minHeight: 48,
              mr: 2,
              transition: 'color 0.2s',
            }
          }}
        >
          {!isPatient && <Tab icon={<AssignmentIcon fontSize="small" />} iconPosition="start" label="Diagnosis Detail" value={0} />}
          <Tab icon={<LocalHospitalIcon fontSize="small" />} iconPosition="start" label="Medication Advice" value={1} />
          <Tab icon={<RestaurantMenuIcon fontSize="small" />} iconPosition="start" label="Diet Plan" value={2} />
          {!isPatient && <Tab icon={<AutoAwesomeIcon fontSize="small" />} iconPosition="start" label="Adjunct Care" value={3} />}
        </Tabs>
      </Box>

      {/* Tab 0: Diagnosis Detail */}
      {tab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <InfoIcon color="primary" />
                  Clinical Classification
                </Typography>
                <Typography variant="body1" color="text.primary" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Based on the patient's age, BMI, glucose profile, and family diabetes pedigree score, the classifier identifies a classification of <strong>{report.diagnosis}</strong>. Alert severity is flagged as {report.severity}.
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Classification</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800 }}>{report.diagnosis}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase' }}>Alert Status</Typography>
                    <Chip color="warning" size="small" label={report.severity} sx={{ fontWeight: 700 }} />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                  XGBoost Evaluation Metrics
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2.5 }}>
                  Underlying clinical dataset confusion matrix scores:
                </Typography>
                <Box className="matrix-grid">
                  <Box className="matrix-cell">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TRUE NEGATIVE</Typography>
                    <Typography variant="h5" color="primary.main" sx={{ fontWeight: 800 }}>{matrix[0][0]}</Typography>
                  </Box>
                  <Box className="matrix-cell">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>FALSE POSITIVE</Typography>
                    <Typography variant="h5" color="error.main" sx={{ fontWeight: 800 }}>{matrix[0][1]}</Typography>
                  </Box>
                  <Box className="matrix-cell">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>FALSE NEGATIVE</Typography>
                    <Typography variant="h5" color="warning.main" sx={{ fontWeight: 800 }}>{matrix[1][0]}</Typography>
                  </Box>
                  <Box className="matrix-cell">
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TRUE POSITIVE</Typography>
                    <Typography variant="h5" color="success.main" sx={{ fontWeight: 800 }}>{matrix[1][1]}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {report.genai_explanation && (
            <Grid item xs={12}>
              <Card 
                variant="outlined" 
                sx={{ 
                  borderLeft: '4px solid', 
                  borderLeftColor: 'secondary.main',
                  background: mode === 'light' ? 'rgba(124, 58, 237, 0.01)' : 'rgba(124, 58, 237, 0.02)'
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <AutoAwesomeIcon color="secondary" />
                    AI Clinical Insights & Explanation
                  </Typography>
                  
                  {/* Summary Box */}
                  <Box 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: '12px', 
                      bgcolor: mode === 'light' ? 'rgba(124, 58, 237, 0.04)' : 'rgba(124, 58, 237, 0.08)', 
                      border: '1px solid',
                      borderColor: mode === 'light' ? 'rgba(124, 58, 237, 0.15)' : 'rgba(124, 58, 237, 0.3)',
                      mb: 3 
                    }}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'secondary.main', mb: 0.5, display: 'block', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
                      Clinical Summary
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 650, lineHeight: 1.5, color: 'text.primary' }}>
                      {report.genai_explanation.summary}
                    </Typography>
                  </Box>

                  {/* Detailed Analysis */}
                  <Typography variant="body1" sx={{ lineHeight: 1.7, mb: 4, color: 'text.secondary', fontWeight: 500 }}>
                    {report.genai_explanation.detailed_analysis}
                  </Typography>

                  <Divider sx={{ mb: 3 }} />

                  {/* Verified Proofs Section */}
                  <Typography variant="subtitle1" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon color="success" fontSize="small" />
                    Verified Medical Evidence & Guideline Proofs
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    The following clinical criteria and guidelines from established health authorities justify this diagnostic classification based on the patient's submitted physiological metrics.
                  </Typography>

                  <Grid container spacing={2.5}>
                    {report.genai_explanation.verifies_proof.map((proof, idx) => {
                      const scorePercent = Math.round(proof.relevance_score * 100);
                      const getScoreColor = (score) => {
                        if (score >= 0.90) return 'success';
                        if (score >= 0.70) return 'warning';
                        return 'primary';
                      };
                      
                      return (
                        <Grid item xs={12} md={6} key={idx}>
                          <Paper 
                            variant="outlined" 
                            sx={{ 
                              p: 2.5, 
                              height: '100%', 
                              borderRadius: '12px',
                              bgcolor: 'background.paper',
                              borderLeft: '4px solid',
                              borderLeftColor: `${getScoreColor(proof.relevance_score)}.main`,
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.05)',
                              }
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1.5} sx={{ mb: 1.5 }}>
                              <Paper 
                                variant="outlined"
                                sx={{ 
                                  px: 1,
                                  py: 0.25,
                                  borderColor: 'divider',
                                  borderRadius: '6px',
                                  bgcolor: 'background.default'
                                }}
                              >
                                <Typography variant="caption" sx={{ fontWeight: 800, color: 'text.secondary' }}>
                                  {proof.source}
                                </Typography>
                              </Paper>
                              <Chip 
                                label={`${scorePercent}% Relevant`} 
                                size="small" 
                                color={getScoreColor(proof.relevance_score)}
                                sx={{ 
                                  fontWeight: 800, 
                                  borderRadius: '6px',
                                  fontSize: '0.75rem',
                                  height: '24px'
                                }} 
                              />
                            </Stack>
                            <Typography variant="body2" sx={{ fontWeight: 700, mb: 1.5, color: 'text.primary', lineHeight: 1.5 }}>
                              {proof.fact}
                            </Typography>
                            {proof.clinical_notes && (
                              <Box sx={{ pt: 1, borderTop: '1px dashed', borderColor: 'divider' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic', fontWeight: 550 }}>
                                  Clinical Application: {proof.clinical_notes}
                                </Typography>
                              </Box>
                            )}
                          </Paper>
                        </Grid>
                      );
                    })}
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Tab 1: Medication */}
      {tab === 1 && (
        <Grid container spacing={3}>
          {report.medication.map((item) => (
            <Grid item xs={12} md={6} key={item.medication}>
              <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(15, 118, 110, 0.15)' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h5" color="primary.main" sx={{ fontWeight: 850, mb: 0.5 }}>
                    {item.medication}
                  </Typography>
                  <Typography variant="subtitle2" color="secondary" sx={{ mb: 2.5, fontWeight: 700 }}>
                    Dosage: {item.dosage}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', mb: 1, letterSpacing: '0.05em' }}>
                    Contraindications & Warnings
                  </Typography>
                  <List dense disablePadding sx={{ mb: 3 }}>
                    {item.warnings.map((warning, idx) => (
                      <ListItem key={idx} disableGutters sx={{ alignItems: 'flex-start', py: 0.75 }}>
                        <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
                          <WarningAmberIcon fontSize="small" color="warning" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={warning} 
                          primaryTypographyProps={{ variant: 'body2', sx: { fontWeight: 550, lineHeight: 1.4 } }} 
                        />
                      </ListItem>
                    ))}
                  </List>

                  {item.brands && item.brands.length > 0 && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', mb: 1.5, letterSpacing: '0.05em' }}>
                        Commercial Indian Brand Options
                      </Typography>
                      <Stack spacing={1.5}>
                        {item.brands.map((brand) => (
                          <Paper
                            variant="outlined"
                            key={brand.name}
                            sx={{
                              p: 2,
                              borderRadius: '8px',
                              bgcolor: 'background.default',
                              borderColor: 'divider',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              },
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                              <div>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                  {brand.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                                  {brand.manufacturer}
                                </Typography>
                              </div>
                              <Chip
                                label={`₹${brand.price.toFixed(2)}`}
                                size="small"
                                color="secondary"
                                sx={{ fontWeight: 800, borderRadius: '4px' }}
                              />
                            </Stack>
                            <Stack direction="row" gap={1} flexWrap="wrap">
                              <Chip 
                                label={brand.pack_size} 
                                size="small" 
                                variant="outlined" 
                                sx={{ fontSize: '0.7rem', height: '20px', borderRadius: '4px' }} 
                              />
                              <Chip 
                                label={brand.composition} 
                                size="small" 
                                sx={{ fontSize: '0.7rem', height: '20px', borderRadius: '4px', bgcolor: 'rgba(15,118,110,0.08)', color: 'primary.main', fontWeight: 600 }} 
                              />
                            </Stack>
                          </Paper>
                        ))}
                      </Stack>
                    </>
                  )}

                  {item.alternatives && item.alternatives.length > 0 && (
                    <>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 700, textTransform: 'uppercase', mt: 3, mb: 1.5, letterSpacing: '0.05em' }}>
                        Holistic & Herb Adjuncts
                      </Typography>
                      <Stack spacing={1.5}>
                        {item.alternatives.map((alt) => (
                          <Paper
                            variant="outlined"
                            key={alt.name}
                            sx={{
                              p: 2,
                              borderRadius: '8px',
                              bgcolor: 'background.default',
                              borderColor: 'divider',
                              borderLeft: '4px solid',
                              borderLeftColor: 'success.main',
                              transition: 'transform 0.2s, box-shadow 0.2s',
                              '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                              },
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
                              <div>
                                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: 'text.primary' }}>
                                  {alt.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, mb: 1, fontWeight: 550 }}>
                                  {alt.benefit}
                                </Typography>
                              </div>
                              <Chip
                                label={`Evidence ${Math.round(alt.evidence_score * 100)}%`}
                                size="small"
                                color="success"
                                variant="outlined"
                                sx={{ fontWeight: 700, borderRadius: '4px' }}
                              />
                            </Stack>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontStyle: 'italic' }}>
                              Research: {alt.research_summary}
                            </Typography>
                          </Paper>
                        ))}
                      </Stack>
                    </>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Tab 2: Diet */}
      {tab === 2 && (
        <Card variant="outlined">
          <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
            <Grid container spacing={4} sx={{ mb: 4 }}>
              <Grid item xs={12} md={4}>
                <Box 
                  className="glass-panel" 
                  sx={{ 
                    p: 3, 
                    borderRadius: '16px', 
                    textAlign: 'center',
                    border: '1.5px solid rgba(16, 185, 129, 0.2) !important',
                    bgcolor: mode === 'light' ? 'rgba(16,185,129,0.04)' : 'rgba(16,185,129,0.02)'
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase' }}>
                    Target Caloric Ingest
                  </Typography>
                  <Typography variant="h3" color="success.main" sx={{ fontWeight: 900, my: 1 }}>
                    {report.diet.calories}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    kcal / per day
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={8}>
                <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 700, textTransform: 'uppercase', color: 'text.secondary' }}>
                  Macronutrient Configuration
                </Typography>
                <Stack spacing={2}>
                  {Object.entries(report.diet.macro_breakdown).map(([key, value]) => {
                    const parsedValue = parseInt(value) || 30; // extraction fallback
                    return (
                      <Box key={key}>
                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700 }}>{key}</Typography>
                          <Typography variant="body2" sx={{ fontWeight: 700 }} color={`${getMacroColor(key)}.main`}>{value}</Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={parsedValue} 
                          color={getMacroColor(key)} 
                          sx={{ height: 8, borderRadius: 4 }} 
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>Meal Recommendations</Typography>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {report.diet.meals.map((meal) => (
                <Grid item xs={12} sm={6} md={3} key={meal.time}>
                  <Card variant="outlined" sx={{ height: '100%', '&:hover': { transform: 'translateY(-2px)' } }}>
                    <CardContent sx={{ p: 2.5 }}>
                      <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 700, mb: 1 }}>
                        {meal.time}
                      </Typography>
                      <Typography variant="body2" color="text.primary" sx={{ lineHeight: 1.5 }}>
                        {meal.items}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 3, p: 2.5, borderRadius: '12px', bgcolor: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)' }}>
              <Typography variant="subtitle2" color="error" sx={{ fontWeight: 700, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                ❌ Critical Foods to Avoid
              </Typography>
              <Typography variant="body2" color="text.primary" sx={{ fontWeight: 550 }}>
                {report.diet.foods_to_avoid.join(', ')}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Tab 3: Alternative Medicine & Lifestyle */}
      {tab === 3 && (
        <Stack spacing={4}>
          <div>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>Evidence-Scored Adjunct Care</Typography>
            <Typography color="text.secondary">Adjunct alternative therapies and positive lifestyle changes paired with research confidence indices.</Typography>
          </div>

          <Grid container spacing={3}>
            {report.alternative_medicine.map((item) => (
              <Grid item xs={12} md={4} key={item.name}>
                <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, fontWeight: 550, minHeight: 40 }}>
                      {item.benefit}
                    </Typography>
                    <Box sx={{ mb: 2.5 }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>RESEARCH EVIDENCE</Typography>
                        <Typography variant="caption" color="primary.main" sx={{ fontWeight: 800 }}>{Math.round(item.evidence_score * 100)}%</Typography>
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

          <Typography variant="h6" sx={{ fontWeight: 700, mt: 2 }}>Lifestyle & Activity Guidance</Typography>
          <Grid container spacing={3}>
            {report.lifestyle_changes.map((item) => (
              <Grid item xs={12} md={4} key={item.name}>
                <Card variant="outlined" sx={{ height: '100%', borderColor: 'rgba(16, 185, 129, 0.15)' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CheckCircleIcon color="success" fontSize="small" />
                      {item.name}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, lineHeight: 1.5 }}>
                      {item.recommendation}
                    </Typography>
                    <Box sx={{ pt: 1, borderTop: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">EVIDENCE STRENGTH</Typography>
                        <Chip size="small" color="success" variant="outlined" label={`${Math.round(item.evidence_score * 100)}%`} sx={{ fontWeight: 700, height: 20 }} />
                      </Stack>
                    </Box>
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

