import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Button,
  Chip,
  Alert,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EmailIcon from '@mui/icons-material/Email';
import { AppStateContext } from '../App.jsx';
import { getCases, getCaseDetails } from '../services/api.js';

export default function PatientRecords() {
  const { currentUser, setCaseResult } = useContext(AppStateContext);
  const [cases, setCases] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    async function loadCases() {
      try {
        const data = await getCases();
        setCases(data);
      } catch (err) {
        setError('Failed to retrieve consultation records.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCases();
  }, []);

  const handleViewCase = async (caseId, isDoctor) => {
    try {
      const details = await getCaseDetails(caseId);
      
      // Inject details into app state context
      setCaseResult({
        general: details.general_prediction,
        diabetes: details.diabetes_prediction,
        input: { ...details.labs, symptoms: details.symptoms },
      });

      if (isDoctor) {
        // If doctor, direct to diagnosis results page
        navigate('/results');
      } else {
        // If patient, direct straight to recommendations report
        navigate('/diabetes-report');
      }
    } catch (err) {
      console.error('Failed to retrieve case details:', err);
    }
  };

  const filteredCases = cases.filter(
    (c) =>
      c.patient_email.toLowerCase().includes(search.toLowerCase()) ||
      c.symptoms.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress color="primary" />
      </Box>
    );
  }

  const isDoctor = currentUser?.role === 'doctor';

  return (
    <Stack spacing={4}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 850, mb: 1 }}>
          {isDoctor ? 'Patient Diagnostic Records' : 'My Healthcare Consultations'}
        </Typography>
        <Typography color="text.secondary">
          {isDoctor
            ? 'Track past symptom assessments, lab parameters, and generated AI diagnostic reports.'
            : 'Access diet plans and medication guidelines prepared by your medical providers.'}
        </Typography>
      </div>

      {error && (
        <Alert severity="error" variant="filled" sx={{ borderRadius: '10px' }}>
          {error}
        </Alert>
      )}

      {isDoctor && (
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search by patient email or symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ maxWidth: 500 }}
        />
      )}

      {filteredCases.length === 0 ? (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center' }}>
          <CardContent>
            <HistoryIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No records found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 450, mx: 'auto' }}>
              {isDoctor
                ? 'No client case records match your query. Complete an intake form to create a new case.'
                : 'There are no care records stored for your account yet. Please contact your medical provider.'}
            </Typography>
          </CardContent>
        </Card>
      ) : isDoctor ? (
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '16px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 700 }}>Date Created</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Patient Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Symptoms Brief</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Diabetes Screen</TableCell>
                <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.map((c) => {
                const hasDiabetesReport = !!c.diabetes_prediction;
                return (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontWeight: 550 }}>{formatDate(c.created_at)}</TableCell>
                    <TableCell>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <EmailIcon fontSize="small" color="action" />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.patient_email}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.symptoms}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={hasDiabetesReport ? 'Triggered' : 'Negative'}
                        color={hasDiabetesReport ? 'warning' : 'success'}
                        size="small"
                        sx={{ fontWeight: 700 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        variant="outlined"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleViewCase(c.id, true)}
                      >
                        View Report
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3}>
          {filteredCases.map((c) => {
            const hasDiabetesReport = !!c.diabetes_prediction;
            return (
              <Grid item xs={12} md={6} key={c.id}>
                <Card variant="outlined" sx={{ height: '100%', borderColor: 'primary.main', borderLeft: '5px solid', borderLeftColor: 'primary.main' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                          <CalendarTodayIcon fontSize="small" />
                          <Typography variant="caption" sx={{ fontWeight: 700 }}>
                            {formatDate(c.created_at)}
                          </Typography>
                        </Stack>
                        <Chip
                          label="Recommendations Ready"
                          color="success"
                          size="small"
                          sx={{ fontWeight: 700 }}
                        />
                      </Stack>

                      <Box>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                          Recorded Symptoms
                        </Typography>
                        <Typography variant="body2" color="text.primary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40 }}>
                          {c.symptoms}
                        </Typography>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        endIcon={<ArrowForwardIcon />}
                        onClick={() => handleViewCase(c.id, false)}
                        sx={{ py: 1.2, borderRadius: '8px' }}
                      >
                        View Medication & Diet Recommendations
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
}
