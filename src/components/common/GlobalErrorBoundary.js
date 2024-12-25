import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Box, Typography, Button } from '@mui/material';
import { logError } from '../../utils/errorTracking';

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        textAlign: 'center'
      }}
    >
      <Typography variant="h4" color="error" gutterBottom>
        Something went wrong
      </Typography>
      <Typography color="text.secondary" paragraph>
        {error.message}
      </Typography>
      <Button
        variant="contained"
        onClick={resetErrorBoundary}
        sx={{ mt: 2 }}
      >
        Try again
      </Button>
    </Box>
  );
}

export function GlobalErrorBoundary({ children }) {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error) => logError(error)}
    >
      {children}
    </ErrorBoundary>
  );
} 