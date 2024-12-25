import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Divider,
  Chip,
  IconButton,
  Paper,
  Grid,
  Tooltip
} from '@mui/material';
import { Close as CloseIcon, WhatsApp as WhatsAppIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { sendWhatsAppMessage, WhatsAppConfig } from '../../utils/whatsapp';

function PatientDetailsModal({ open, onClose, patient, appointments }) {
  if (!patient) return null;

  // Filter appointments for this patient and sort by date
  const patientAppointments = appointments
    .filter(apt => apt.clientName === patient.name)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // Get last visit
  const lastVisit = patientAppointments.find(apt => apt.status === 'completed');

  const handleWhatsApp = () => {
    const message = WhatsAppConfig.templates.generalMessage(patient.name);
    sendWhatsAppMessage(patient.phone, message);
  };

  const handleNameClick = () => {
    sendWhatsAppMessage(patient.phone, '', false); // Just open chat, no message
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle sx={{ m: 0, p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">Patient Details</Typography>
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {/* Patient Information */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Personal Information
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography 
                        variant="h6" 
                        onClick={handleNameClick}
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': {
                            color: 'primary.main',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {patient.name}
                      </Typography>
                      <Tooltip title="Send WhatsApp">
                        <IconButton 
                          size="small"
                          color="success"
                          onClick={handleWhatsApp}
                        >
                          <WhatsAppIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
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
                      size="small"
                    />
                  </Box>
                </Box>
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom color="primary">
                  Visit Summary
                </Typography>
                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Total Visits
                    </Typography>
                    <Typography variant="body1">
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
          </Grid>

          <Divider sx={{ my: 3 }} />

          {/* Treatment History */}
          <Typography variant="h6" gutterBottom color="primary">
            Treatment History
          </Typography>
          <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default PatientDetailsModal; 