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
import PersonIcon from '@mui/icons-material/Person';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import { AppStateContext } from '../App.jsx';
import { getCases, getCaseDetails } from '../services/api.js';
import { downloadReportAsFile, triggerPrintReport } from '../utils/reportExporter.js';
import TiltCard3D from '../components/TiltCard3D.jsx';

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
        input: { ...details.labs, symptoms: details.symptoms, patient_name: details.patient_name, patient_email: details.patient_email },
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

  const handleDownloadCase = async (caseId) => {
    try {
      const details = await getCaseDetails(caseId);
      const formattedResult = {
        general: details.general_prediction,
        diabetes: details.diabetes_prediction,
        input: { ...details.labs, symptoms: details.symptoms, patient_name: details.patient_name, patient_email: details.patient_email },
      };
      downloadReportAsFile(formattedResult, currentUser);
    } catch (err) {
      console.error('Failed to export case report:', err);
    }
  };

  const filteredCases = cases.filter(
    (c) =>
      (c.patient_name && c.patient_name.toLowerCase().includes(search.toLowerCase())) ||
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
    <Stack spacing={4} sx={{ perspective: '1200px' }}>
      <div>
        <Typography variant="h4" sx={{ fontWeight: 850, mb: 1 }}>
          {isDoctor ? 'Patient Diagnostic Records' : 'My Healthcare Consultations'}
        </Typography>
        <Typography color="text.secondary">
          {isDoctor
            ? 'Track patient names, symptom assessments, lab parameters, and download generated AI diagnostic reports.'
            : 'Access and download personalized diet plans and medication guidelines prepared by your medical providers.'}
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
          placeholder="Search by patient name, email, or symptoms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />,
          }}
          sx={{ maxWidth: 500 }}
        />
      )}

      {filteredCases.length === 0 ? (
        <Card variant="outlined" sx={{ py: 6, textAlign: 'center', borderRadius: '20px' }}>
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
        <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: '20px', overflow: 'hidden' }}>
          <Table>
            <TableHead sx={{ bgcolor: (theme) => theme.palette.mode === 'light' ? '#f9fafb' : 'rgba(255,255,255,0.02)' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 800 }}>Date Created</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Patient Identity</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Symptoms Brief</TableCell>
                <TableCell sx={{ fontWeight: 800 }}>Diabetes Screen</TableCell>
                <TableCell sx={{ fontWeight: 800 }} align="right">Actions &amp; Downloads</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredCases.map((c) => {
                const hasDiabetesReport = !!c.diabetes_prediction;
                return (
                  <TableRow key={c.id} hover>
                    <TableCell sx={{ fontWeight: 600 }}>{formatDate(c.created_at)}</TableCell>
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <PersonIcon fontSize="small" color="primary" />
                          <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                            {c.patient_name || 'Patient'}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing= {0.75}>
                          <EmailIcon style={{ fontSize: 14 }} color="action" />
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                            {c.patient_email}
                          </Typography>
                        </Stack>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 260, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {c.symptoms}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={hasDiabetesReport ? 'Triggered' : 'Negative'}
                        color={hasDiabetesReport ? 'warning' : 'success'}
                        size="small"
                        sx={{ fontWeight: 800 }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          size="small"
                          variant="outlined"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleDownloadCase(c.id)}
                          sx={{ borderRadius: '8px', fontWeight: 700 }}
                        >
                          Download
                        </Button>
                        <Button
                          size="small"
                          variant="contained"
                          color="primary"
                          endIcon={<ArrowForwardIcon />}
                          onClick={() => handleViewCase(c.id, true)}
                          sx={{ borderRadius: '8px', fontWeight: 700 }}
                        >
                          View UI
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Grid container spacing={3.5}>
          {filteredCases.map((c) => {
            return (
              <Grid item xs={12} md={6} key={c.id}>
                <TiltCard3D color="#14b8a6">
                  <Card variant="outlined" sx={{ height: '100%', borderRadius: '20px', borderColor: 'primary.main', borderLeft: '6px solid', borderLeftColor: 'primary.main' }}>
                    <CardContent sx={{ p: 3.5, transformStyle: 'preserve-3d' }}>
                      <Stack spacing={2.5}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ transform: 'translateZ(20px)' }}>
                          <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                            <CalendarTodayIcon fontSize="small" />
                            <Typography variant="caption" sx={{ fontWeight: 700 }}>
                              {formatDate(c.created_at)}
                            </Typography>
                          </Stack>
                          <Chip
                            label="Care Plan Ready"
                            color="success"
                            size="small"
                            sx={{ fontWeight: 800 }}
                          />
                        </Stack>

                        <Box sx={{ transform: 'translateZ(15px)' }}>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 800, textTransform: 'uppercase', display: 'block', mb: 0.5 }}>
                            Patient Name &amp; Symptoms
                          </Typography>
                          <Typography variant="subtitle2" sx={{ fontWeight: 850, color: 'primary.main', mb: 0.5 }}>
                            {c.patient_name || 'Patient'} ({c.patient_email})
                          </Typography>
                          <Typography variant="body2" color="text.primary" sx={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', minHeight: 40, fontWeight: 500 }}>
                            {c.symptoms}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1.5} sx={{ transform: 'translateZ(25px)' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            endIcon={<ArrowForwardIcon />}
                            onClick={() => handleViewCase(c.id, false)}
                            sx={{ py: 1.4, borderRadius: '10px', fontWeight: 800 }}
                          >
                            View Recommendations
                          </Button>
                          <Button
                            variant="outlined"
                            color="primary"
                            startIcon={<DownloadIcon />}
                            onClick={() => handleDownloadCase(c.id)}
                            sx={{ py: 1.4, borderRadius: '10px', fontWeight: 800, px: 3 }}
                          >
                            Download
                          </Button>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </TiltCard3D>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Stack>
  );
}
