import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';

interface LoadingSpinnerProps {
  message?: string;
  size?: number;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = "Loading...", 
  size = 40, 
  fullScreen = false 
}) => {
  const containerStyle = fullScreen ? {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    backdropFilter: 'blur(2px)'
  } : {};

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 3,
        ...containerStyle
      }}
    >
      <CircularProgress
        size={size}
        thickness={4}
        sx={{
          color: '#4E2A84',
          '& .MuiCircularProgress-circle': {
            stroke: 'url(#gradient)',
          }
        }}
      />
      <svg width="0" height="0">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7B5AA6" />
            <stop offset="50%" stopColor="#4E2A84" />
            <stop offset="100%" stopColor="#342056" />
          </linearGradient>
        </defs>
      </svg>
      {message && (
        <Typography
          variant="body1"
          sx={{
            color: '#4E2A84',
            fontWeight: 500,
            textAlign: 'center',
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%, 100%': { opacity: 0.8 },
              '50%': { opacity: 1 },
            },
          }}
        >
          {message}
        </Typography>
      )}
    </Box>
  );
};

export default LoadingSpinner;