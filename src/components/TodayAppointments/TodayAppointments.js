import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button,
  Chip,
  Stack,
  IconButton,
  Tooltip
} from '@mui/material';
import { formatTime } from '../../utils/dateFormat';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RestoreIcon from '@mui/icons-material/Restore';
import EditPatientModal from './EditPatientModal';
import InfoIcon from '@mui/icons-material/Info';
import { WhatsApp as WhatsAppIcon, Delete as DeleteIcon } from '@mui/icons-material';

function TodayAppointments({ 
  appointments, 
  clients, 
  onCheckIn, 
  onCancel, 
  onRestore, 
  onUpdatePatient, 
  onDeleteAppointment,
  referenceDate = new Date(),
  onPatientClick 
}) {
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const todaysAppointments = useMemo(() => {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.toDateString() === referenceDate.toDateString();
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [appointments, referenceDate]);

  const handleSaveEdit = (updatedPatient) => {
    onUpdatePatient(updatedPatient);
    setShowEditDialog(false);
    setSelectedAppointment(null);
  };

  const handleRestore = (appointment) => {
    onRestore(appointment);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'checked-in':
        return 'success';
      case 'cancelled':
        return 'error';
      case 'scheduled':
        return 'primary';
      default:
        return 'default';
    }
  };

  const getClientPhone = (clientName) => {
    const client = clients.find(c => c.name.trim() === clientName.trim());
    if (!client) {
      return '';
    }
    return client.phone;
  };

  const handleWhatsApp = (appointment) => {
    try {
      const phoneNumber = getClientPhone(appointment.clientName);
      
      if (!phoneNumber) {
        return;
      }

      const time = formatTime(new Date(appointment.date));
      let message = '';

      switch (appointment.status) {
        case 'scheduled':
          message = `Hi ${appointment.clientName}, this is a reminder for your appointment today at ${time}.`;
          break;
        case 'cancelled':
          message = `Hi ${appointment.clientName}, your appointment has been cancelled.`;
          break;
        default:
          message = `Hi ${appointment.clientName}, thank you for choosing our clinic.`;
      }

      const cleanPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error in handleWhatsApp:', error);
    }
  };

  const handleDelete = (appointment, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      if (onDeleteAppointment) {
        onDeleteAppointment(appointment.id);
      }
    }
  };

  const renderAppointment = (apt) => {
    try {
      const startTime = new Date(apt.date);
      const endTime = apt.endTime ? new Date(apt.endTime) : null;

      if (isNaN(startTime.getTime())) {
        console.error('Invalid start time:', apt.date);
        return null;
      }

      return (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          position: 'relative',
          backgroundColor: 'white',
          borderRadius: 2,
          p: 2,
        }}>
          {/* Time Badge */}
          <Box sx={{
            position: 'absolute',
            left: -10,
            top: '50%',
            transform: 'translateY(-50%)',
            backgroundColor: 'primary.main',
            color: 'white',
            py: 1,
            px: 2,
            borderRadius: '0 20px 20px 0',
            boxShadow: 2,
          }}>
            <Typography sx={{ fontWeight: 700 }}>
              {formatTime(startTime)}
            </Typography>
            {endTime && !isNaN(endTime.getTime()) && (
              <Typography variant="caption" sx={{ opacity: 0.9 }}>
                {formatTime(endTime)}
              </Typography>
            )}
          </Box>

          {/* Add Delete Button */}
          <IconButton
            size="small"
            onClick={(e) => handleDelete(apt, e)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'error.main',
              '&:hover': {
                bgcolor: 'error.light',
                color: 'white'
              }
            }}
          >
            <DeleteIcon fontSize="small" />
          </IconButton>

          {/* Content */}
          <Box sx={{ ml: 8 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700,
                  color: 'black',
                  cursor: 'pointer',
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
                onClick={() => onPatientClick(apt.clientName)}
              >
                {apt.clientName}
              </Typography>
              <Tooltip title="Send WhatsApp">
                <IconButton 
                  size="small"
                  color="success"
                  onClick={() => handleWhatsApp(apt)}
                >
                  <WhatsAppIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="View Details">
                <IconButton
                  size="small"
                  onClick={() => onPatientClick(apt.clientName)}
                >
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 1,
              ml: 2
            }}>
              <Chip
                label={apt.treatment}
                size="small"
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600
                }}
              />
              <Chip 
                label={apt.status}
                color={getStatusColor(apt.status)}
                size="small"
              />
            </Box>

            {apt.notes && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  bgcolor: 'grey.50',
                  p: 1,
                  borderRadius: 1,
                  borderLeft: '3px solid',
                  borderColor: 'primary.main',
                  mt: 1
                }}
              >
                {apt.notes}
              </Typography>
            )}

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1, 
              mt: 2,
              justifyContent: 'flex-end'
            }}>
              {apt.status === 'scheduled' && (
                <>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<CheckCircleIcon />}
                    onClick={() => onCheckIn(apt)}
                    size="small"
                  >
                    Check In
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    startIcon={<CancelIcon />}
                    onClick={() => onCancel(apt)}
                    size="small"
                  >
                    Cancel
                  </Button>
                </>
              )}
              {(apt.status === 'cancelled' || apt.status === 'checked-in') && (
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<RestoreIcon />}
                  onClick={() => handleRestore(apt)}
                  size="small"
                >
                  Restore
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      );
    } catch (error) {
      console.error('Error rendering appointment:', error);
      return null;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          Today's Appointments
        </Typography>

        {todaysAppointments.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No appointments scheduled for today
          </Typography>
        ) : (
          <Stack spacing={3}>
            {todaysAppointments.map((apt) => {
              const renderedAppointment = renderAppointment(apt);
              if (!renderedAppointment) return null;

              return (
                <Paper
                  key={apt.id}
                  sx={{
                    p: 0,
                    bgcolor: 'white',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateX(5px)',
                      boxShadow: 3
                    },
                    borderRadius: 2,
                    position: 'relative',
                    overflow: 'hidden',
                    border: `1px solid ${apt.status === 'cancelled' ? 'error.main' : 
                            apt.status === 'checked-in' ? 'success.main' : 
                            'primary.main'}`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '4px',
                      backgroundColor: apt.status === 'cancelled' ? 'error.main' : 
                                     apt.status === 'checked-in' ? 'success.main' : 
                                     'primary.main'
                    }
                  }}
                >
                  {renderedAppointment}
                </Paper>
              );
            })}
          </Stack>
        )}
      </Paper>

      {showEditDialog && selectedAppointment && (
        <EditPatientModal
          open={showEditDialog}
          patient={selectedAppointment}
          clients={clients}
          onSave={handleSaveEdit}
          onClose={() => {
            setShowEditDialog(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </Box>
  );
}

export default TodayAppointments; 