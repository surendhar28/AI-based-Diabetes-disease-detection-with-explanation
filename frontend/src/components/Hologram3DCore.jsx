import React from 'react';
import { Box, Paper, Stack, Typography, Chip } from '@mui/material';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import SpeedIcon from '@mui/icons-material/Speed';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import ShieldIcon from '@mui/icons-material/Shield';

export default function Hologram3DCore({ mode }) {
  const isLight = mode === 'light';

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: 360, sm: 420, md: 480 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        perspective: '1200px',
      }}
    >
      {/* Outer 3D Rotating Orbit Ring 1 */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 260, sm: 320, md: 380 },
          height: { xs: 260, sm: 320, md: 380 },
          borderRadius: '50%',
          border: '2px dashed',
          borderColor: isLight ? 'rgba(15, 118, 110, 0.25)' : 'rgba(20, 184, 166, 0.4)',
          animation: 'spin3D 18s linear infinite',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(65deg) rotateY(15deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Outer 3D Rotating Orbit Ring 2 */}
      <Box
        sx={{
          position: 'absolute',
          width: { xs: 220, sm: 280, md: 330 },
          height: { xs: 220, sm: 280, md: 330 },
          borderRadius: '50%',
          border: '2px dotted',
          borderColor: isLight ? 'rgba(109, 40, 217, 0.3)' : 'rgba(167, 139, 250, 0.5)',
          animation: 'spin3DReverse 22s linear infinite',
          transformStyle: 'preserve-3d',
          transform: 'rotateX(-55deg) rotateY(35deg)',
          pointerEvents: 'none',
        }}
      />

      {/* Central 3D Agentic Glass Core */}
      <Paper
        elevation={0}
        sx={{
          width: { xs: 200, sm: 240, md: 270 },
          height: { xs: 200, sm: 240, md: 270 },
          borderRadius: '50%',
          background: isLight
            ? 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(240,253,250,0.9) 100%)'
            : 'radial-gradient(circle, rgba(20, 184, 166, 0.25) 0%, rgba(15, 23, 30, 0.95) 80%)',
          border: '2px solid',
          borderColor: isLight ? 'rgba(15, 118, 110, 0.3)' : 'rgba(20, 184, 166, 0.5)',
          boxShadow: isLight
            ? '0 0 50px rgba(15, 118, 110, 0.25), inset 0 0 30px rgba(15, 118, 110, 0.15)'
            : '0 0 60px rgba(20, 184, 166, 0.35), inset 0 0 40px rgba(20, 184, 166, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 3,
          textAlign: 'center',
          position: 'relative',
          zIndex: 5,
          transformStyle: 'preserve-3d',
          animation: 'float3D 5s ease-in-out infinite',
        }}
      >
        <Box
          sx={{
            bgcolor: isLight ? 'rgba(15, 118, 110, 0.12)' : 'rgba(20, 184, 166, 0.2)',
            color: 'primary.main',
            p: 1.75,
            borderRadius: '50%',
            mb: 1.5,
            boxShadow: '0 0 20px rgba(20, 184, 166, 0.4)',
          }}
        >
          <MedicalServicesIcon sx={{ fontSize: 42 }} />
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: 1.2 }}>
          Multi-Agent Core
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, mt: 0.5 }}>
          XGBoost + Gemini 2.5 AI
        </Typography>

        <Chip
          icon={<AutoAwesomeIcon sx={{ fontSize: '14px !important' }} />}
          label="4 Agents Active"
          color="primary"
          size="small"
          sx={{ mt: 1.5, fontWeight: 750, fontSize: '0.75rem' }}
        />
      </Paper>

      {/* Floating 3D Badge 1: 97.1% ML */}
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          top: '12%',
          left: '5%',
          px: 2,
          py: 1.25,
          borderRadius: '16px',
          bgcolor: isLight ? '#ffffff' : '#0f171e',
          border: '1px solid',
          borderColor: isLight ? 'rgba(15, 118, 110, 0.3)' : 'rgba(20, 184, 166, 0.4)',
          transform: 'translateZ(40px)',
          animation: 'float3D 6s ease-in-out infinite 0.5s',
          zIndex: 10,
          boxShadow: isLight ? '0 10px 25px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <SpeedIcon color="primary" fontSize="small" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 850, lineHeight: 1 }}>97.1% Accuracy</Typography>
            <Typography variant="caption" color="text.secondary">XGBoost ML Pipeline</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Floating 3D Badge 2: 200k+ Pharma */}
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          bottom: '14%',
          right: '5%',
          px: 2,
          py: 1.25,
          borderRadius: '16px',
          bgcolor: isLight ? '#ffffff' : '#0f171e',
          border: '1px solid',
          borderColor: 'rgba(245, 158, 11, 0.4)',
          transform: 'translateZ(50px)',
          animation: 'float3D 6.5s ease-in-out infinite 1s',
          zIndex: 10,
          boxShadow: isLight ? '0 10px 25px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <LocalPharmacyIcon sx={{ color: '#f59e0b' }} fontSize="small" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 850, lineHeight: 1 }}>200,000+ Brands</Typography>
            <Typography variant="caption" color="text.secondary">Indian Medicines DB</Typography>
          </Box>
        </Stack>
      </Paper>

      {/* Floating 3D Badge 3: Patient Privacy */}
      <Paper
        elevation={6}
        sx={{
          position: 'absolute',
          bottom: '10%',
          left: '8%',
          px: 2,
          py: 1.25,
          borderRadius: '16px',
          bgcolor: isLight ? '#ffffff' : '#0f171e',
          border: '1px solid',
          borderColor: 'rgba(16, 185, 129, 0.4)',
          transform: 'translateZ(30px)',
          animation: 'float3D 5.5s ease-in-out infinite 1.5s',
          zIndex: 10,
          boxShadow: isLight ? '0 10px 25px rgba(0,0,0,0.1)' : '0 10px 30px rgba(0,0,0,0.5)',
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center">
          <ShieldIcon sx={{ color: '#10b981' }} fontSize="small" />
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 850, lineHeight: 1 }}>Privacy Masking</Typography>
            <Typography variant="caption" color="text.secondary">RBAC Security</Typography>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
}
