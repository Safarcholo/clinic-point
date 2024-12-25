import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid
} from '@mui/material';

function Analytics({ appointments, clients }) {
  const stats = React.useMemo(() => {
    return {
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(apt => apt.status === 'completed').length,
      cancelledAppointments: appointments.filter(apt => apt.status === 'cancelled').length,
      activeClients: new Set(appointments.map(apt => apt.clientName)).size,
      popularTreatments: appointments.reduce((acc, apt) => {
        acc[apt.treatment] = (acc[apt.treatment] || 0) + 1;
        return acc;
      }, {})
    };
  }, [appointments]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Analytics</Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Total Appointments</Typography>
            <Typography variant="h4">{stats.totalAppointments}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Completed</Typography>
            <Typography variant="h4">{stats.completedAppointments}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Cancelled</Typography>
            <Typography variant="h4">{stats.cancelledAppointments}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1">Active Clients</Typography>
            <Typography variant="h4">{stats.activeClients}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>Popular Treatments</Typography>
            {Object.entries(stats.popularTreatments)
              .sort(([,a], [,b]) => b - a)
              .map(([treatment, count]) => (
                <Box key={treatment} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>{treatment}</Typography>
                  <Typography>{count} appointments</Typography>
                </Box>
              ))
            }
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Analytics; 