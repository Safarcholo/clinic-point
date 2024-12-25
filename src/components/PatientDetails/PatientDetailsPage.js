import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Grid
} from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { format } from 'date-fns';

function PatientDetailsPage({ patient, appointments, onClose }) {
  if (!patient) return null;

  // Filter appointments for this patient and sort by date
  const patientAppointments = appointments
    .filter(apt => apt.clientName === patient.name)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get last visit
  const lastVisit = patientAppointments.find(apt => apt.status === 'completed');

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton onClick={onClose}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">Patient Details</Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Personal Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Personal Information
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="h6">{patient.name}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                <Typography variant="body1">{patient.phone}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1">{patient.email || 'Not provided'}</Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">Status</Typography>
                <Chip 
                  label={patient.status} 
                  color={patient.status === 'active' ? 'success' : 'default'}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Visit Summary */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom color="primary">
              Visit Summary
            </Typography>
            <Box sx={{ display: 'grid', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Visits
                </Typography>
                <Typography variant="h6">
                  {patientAppointments.filter(apt => apt.status === 'completed').length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Last Visit
                </Typography>
                <Typography variant="body1">
                  {lastVisit ? format(new Date(lastVisit.date), 'PPP') : 'No visits yet'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Next Appointment
                </Typography>
                <Typography variant="body1">
                  {patientAppointments.find(apt => 
                    apt.status === 'scheduled' && new Date(apt.date) > new Date()
                  )?.date
                    ? format(new Date(patientAppointments.find(apt => 
                        apt.status === 'scheduled' && new Date(apt.date) > new Date()
                      ).date), 'PPP p')
                    : 'No upcoming appointments'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Treatment History */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom color="primary">
              Treatment History
            </Typography>
            <Box sx={{ mt: 2 }}>
              {patientAppointments.length > 0 ? (
                patientAppointments.map((apt) => (
                  <Paper
                    key={apt.id}
                    sx={{
                      p: 2,
                      mb: 2,
                      borderLeft: 4,
                      borderColor: apt.status === 'completed' ? 'success.main' : 
                                 apt.status === 'cancelled' ? 'error.main' : 
                                 'primary.main'
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="subtitle1" fontWeight="medium">
                        {apt.treatment}
                      </Typography>
                      <Chip 
                        label={apt.status}
                        size="small"
                        color={
                          apt.status === 'completed' ? 'success' :
                          apt.status === 'cancelled' ? 'error' :
                          'primary'
                        }
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Date: {format(new Date(apt.date), 'PPP p')}
                    </Typography>
                    {apt.notes && (
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          mt: 1,
                          p: 1,
                          bgcolor: 'grey.50',
                          borderRadius: 1
                        }}
                      >
                        Notes: {apt.notes}
                      </Typography>
                    )}
                  </Paper>
                ))
              ) : (
                <Typography color="text.secondary" align="center">
                  No treatment history available
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default PatientDetailsPage; 