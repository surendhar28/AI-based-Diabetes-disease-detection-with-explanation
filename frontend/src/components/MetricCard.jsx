import React from 'react';
import { Box, Card, CardContent, Stack, Typography } from '@mui/material';

export default function MetricCard({ label, value, helper, icon, activeColor = 'primary' }) {
  return (
    <Card 
      variant="outlined" 
      sx={{ 
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': {
          transform: 'translateY(-6px)',
          borderColor: `${activeColor}.main`,
          boxShadow: (theme) => theme.palette.mode === 'light' 
            ? `0 10px 25px rgba(0, 0, 0, 0.05)` 
            : `0 12px 30px rgba(0, 0, 0, 0.4)`,
          '& .metric-icon-bg': {
            transform: 'scale(1.1) rotate(5deg)',
          }
        }
      }}
    >
      <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2} sx={{ mb: 2 }}>
          <div>
            <Typography 
              color="text.secondary" 
              variant="caption" 
              sx={{ 
                textTransform: 'uppercase', 
                fontWeight: 700, 
                letterSpacing: '0.08em',
                display: 'block',
                mb: 0.5
              }}
            >
              {label}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              {value}
            </Typography>
          </div>
          <Box
            className="metric-icon-bg"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 44,
              height: 44,
              borderRadius: '12px',
              bgcolor: (theme) => theme.palette.mode === 'light'
                ? `rgba(15, 118, 110, 0.08)`
                : `rgba(20, 184, 166, 0.1)`,
              color: `${activeColor}.main`,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {icon}
          </Box>
        </Stack>
        {helper && (
          <Typography 
            color="text.secondary" 
            variant="body2" 
            sx={{ 
              mt: 'auto', 
              fontSize: '0.825rem',
              lineHeight: 1.4
            }}
          >
            {helper}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

