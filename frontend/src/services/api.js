import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('health_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser(payload) {
  const { data } = await api.post('/auth/register', payload);
  localStorage.setItem('health_token', data.access_token);
  return data;
}

export async function loginUser(payload) {
  const { data } = await api.post('/auth/login', payload);
  localStorage.setItem('health_token', data.access_token);
  return data;
}

export async function predictGeneral(payload) {
  const { data } = await api.post('/predict/general', payload);
  return data;
}

export async function predictDiabetes(payload) {
  const { data } = await api.post('/predict/diabetes', payload);
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get('/auth/me');
  return data;
}

export async function saveCase(payload) {
  const { data } = await api.post('/cases', payload);
  return data;
}

export async function getCases(patientEmail = '') {
  const url = patientEmail ? `/cases?patient_email=${encodeURIComponent(patientEmail)}` : '/cases';
  const { data } = await api.get(url);
  return data;
}

export async function getCaseDetails(caseId) {
  const { data } = await api.get(`/cases/${caseId}`);
  return data;
}

export async function getPatients() {
  const { data } = await api.get('/patients');
  return data;
}

export default api;
