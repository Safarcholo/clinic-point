import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid,
  IconButton,
  Chip
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateCalendar } from '@mui/x-date-pickers';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { format } from 'date-fns';
import './Calendar.css';
import { 
  ArrowBackIos as ArrowBackIcon, 
  ArrowForwardIos as ArrowForwardIcon, 
  CalendarToday as CalendarIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';
import { getAllTreatments } from '../../data/treatments';
import SearchableSelect from '../common/SearchableSelect';
import { formatTime } from '../../utils/dateFormat';

function AppointmentModal({ 
  open, 
  selectedDate, 
  clients, 
  onSave, 
  onClose, 
  editingAppointment = null
}) {
  const initialDate = selectedDate && !isNaN(new Date(selectedDate).getTime())
    ? new Date(selectedDate)
    : new Date();

  // Initialize form data with proper date handling
  const [formData, setFormData] = useState({
    startTime: editingAppointment?.date ? new Date(editingAppointment.date) : initialDate,
    endTime: editingAppointment?.endTime ? new Date(editingAppointment.endTime) : initialDate,
    treatment: editingAppointment?.treatment || '',
    notes: editingAppointment?.notes || ''
  });

  // Initialize with the editing appointment's client name
  const [inputValue, setInputValue] = useState(editingAppointment?.clientName || '');
  const [selectedClient, setSelectedClient] = useState(editingAppointment ? 
    clients.find(c => c.name === editingAppointment.clientName) : 
    null);

  // Add state for suggested end time
  const [suggestedEndTime, setSuggestedEndTime] = useState(null);

  // Add treatments state
  const [treatments, setTreatments] = useState(getAllTreatments());

  // Update treatments when they change in localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'treatments') {
        setTreatments(getAllTreatments());
      }
    };

    // Also listen for our custom event
    const handleCustomEvent = () => {
      setTreatments(getAllTreatments());
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('treatmentsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('treatmentsUpdated', handleCustomEvent);
    };
  }, []);

  const isWithinWorkingHours = (date) => {
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = hours + minutes / 60;

    // Sunday to Thursday (0-4): 17:00 - 21:00
    if ([0, 1, 2, 3, 4].includes(day)) {
      return time >= 17 && time < 21;
    }
    // Friday (5): 9:00 - 19:00
    if (day === 5) {
      return time >= 9 && time < 19;
    }
    // Saturday (6): Closed
    return false;
  };

  // Function to calculate end time based on treatment duration
  const calculateEndTime = (startTime, treatmentName) => {
    const treatment = getAllTreatments().find(t => t.name === treatmentName);
    if (!treatment) return new Date(startTime);

    const getDurationInMinutes = (durationStr) => {
      if (durationStr.includes('hour')) {
        return 60 * parseInt(durationStr);
      }
      return parseInt(durationStr);
    };

    const durationMinutes = getDurationInMinutes(treatment.duration);
    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + durationMinutes);
    return endTime;
  };

  const handleSubmit = () => {
    if (!selectedClient || !formData.treatment) return;
    if (!isWithinWorkingHours(formData.startTime)) {
      alert('Please select a time within working hours');
      return;
    }

    try {
      // Ensure we're creating valid Date objects
      const startTime = new Date(formData.startTime);
      const endTime = new Date(formData.endTime);

      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        throw new Error('Invalid date values');
      }

      const appointmentData = {
        id: editingAppointment?.id || Date.now(),
        date: startTime.toISOString(),
        endTime: endTime.toISOString(),
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        treatment: formData.treatment,
        notes: formData.notes,
        status: editingAppointment?.status || 'scheduled'
      };

      onSave(appointmentData);
      onClose();
    } catch (err) {
      console.error('Error saving appointment:', err);
      alert('Error saving appointment. Please check the time values.');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingAppointment ? 'Edit Appointment' : 'Add New Appointment'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <SearchableSelect
            label="Patient"
            options={clients}
            value={selectedClient}
            onChange={(client) => {
              setSelectedClient(client);
              if (client) {
                setFormData({
                  ...formData,
                  clientName: client.name,
                  phone: client.phone,
                  email: client.email
                });
                setInputValue(client.name);
              }
            }}
            getOptionLabel={(client) => `${client.name} (${client.phone})`}
            required
            placeholder="Search by name or phone..."
            initialSearchTerm={editingAppointment?.clientName || ''}
          />

          <FormControl fullWidth>
            <InputLabel>Treatment</InputLabel>
            <Select
              value={formData.treatment}
              onChange={(e) => {
                const newTreatment = e.target.value;
                const suggestedEnd = calculateEndTime(formData.startTime, newTreatment);
                setSuggestedEndTime(suggestedEnd);
                
                setFormData({
                  ...formData, 
                  treatment: newTreatment,
                  endTime: suggestedEnd
                });
              }}
              label="Treatment"
            >
              {treatments.map((treatment) => (
                <MenuItem key={treatment.id} value={treatment.name}>
                  <Box>
                    <Typography>{treatment.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {treatment.duration} - {treatment.price}
                    </Typography>
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TimePicker
            label="Start Time"
            value={formData.startTime}
            onChange={(newTime) => {
              if (!newTime) return;
              
              const updatedStartTime = new Date(formData.startTime);
              updatedStartTime.setHours(newTime.getHours());
              updatedStartTime.setMinutes(newTime.getMinutes());
              
              // Recalculate end time based on current treatment
              const suggestedEnd = formData.treatment ? 
                calculateEndTime(updatedStartTime, formData.treatment) : 
                updatedStartTime;
              
              setSuggestedEndTime(suggestedEnd);
              
              setFormData(prev => ({
                ...prev,
                startTime: updatedStartTime,
                endTime: suggestedEnd
              }));
            }}
            ampm={false}
            format="HH:mm"
          />

          <Box>
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(newTime) => {
                if (!newTime) return;
                
                const updatedEndTime = new Date(formData.endTime);
                updatedEndTime.setHours(newTime.getHours());
                updatedEndTime.setMinutes(newTime.getMinutes());
                
                setFormData(prev => ({
                  ...prev,
                  endTime: updatedEndTime
                }));
              }}
              ampm={false}
              format="HH:mm"
            />
            {suggestedEndTime && (
              <Typography 
                variant="caption" 
                color="text.secondary"
                sx={{ display: 'block', mt: 1 }}
              >
                Suggested end time based on treatment: {formatTime(suggestedEndTime)}
              </Typography>
            )}
          </Box>

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={formData.notes || ''}
            onChange={(e) => {
              setFormData(prev => ({
                ...prev,
                notes: e.target.value
              }));
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!inputValue || !formData.treatment}
        >
          {editingAppointment ? 'Update Appointment' : 'Add Appointment'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function Calendar({ appointments = [], clients = [], onAddAppointment, onDeleteAppointment, defaultDate, onPatientClick }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedDateForAppointment, setSelectedDateForAppointment] = useState(null);
  const [editingAppointment, setEditingAppointment] = useState(null);

  // Add month names array
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Get current year and a range of years
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  const handlePreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(selectedDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handleNewAppointment = () => {
    setSelectedDateForAppointment(null);  // No pre-selected date
    setShowNewAppointmentModal(true);
  };

  const handleAddAppointment = (newAppointment) => {
    onAddAppointment(newAppointment);
    setShowNewAppointmentModal(false);
  };

  const getAppointmentColor = (status) => {
    switch (status) {
      case 'checked-in': return 'success.main';
      case 'cancelled': return 'error.main';
      case 'scheduled': return 'primary.main';
      default: return 'grey.500';
    }
  };

  const formatAppointmentDisplay = (appointment) => {
    try {
      const startTime = new Date(appointment.date);
      const endTime = new Date(appointment.endTime);
      
      if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
        console.error('Invalid date in appointment:', appointment);
        return '';
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
            <Typography variant="caption" sx={{ opacity: 0.9 }}>
              {formatTime(endTime)}
            </Typography>
          </Box>

          {/* Delete Button */}
          <IconButton
            size="small"
            onClick={(e) => handleDelete(appointment, e)}
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
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                color: 'black',
                mb: 1
              }}
            >
              {appointment.clientName}
            </Typography>

            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              mb: 1,
              ml: 2
            }}>
              <Chip
                label={appointment.treatment}
                size="small"
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'white',
                  fontWeight: 600
                }}
              />
            </Box>

            {appointment.notes && (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary',
                  bgcolor: 'grey.50',
                  p: 1,
                  borderRadius: 1,
                  borderLeft: '3px solid',
                  borderColor: 'primary.main'
                }}
              >
                {appointment.notes}
              </Typography>
            )}
          </Box>
        </Box>
      );
    } catch (error) {
      console.error('Error formatting appointment:', error);
      return '';
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const getDayAppointments = (date) => {
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate.getFullYear() === date.getFullYear() &&
               aptDate.getMonth() === date.getMonth() &&
               aptDate.getDate() === date.getDate() &&
               apt.status !== 'cancelled';
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedDateForAppointment(new Date(appointment.date));
    setEditingAppointment(appointment);
    setShowNewAppointmentModal(true);
  };

  const handleDelete = (appointment, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      if (onDeleteAppointment) {
        onDeleteAppointment(appointment.id);
      }
    }
  };

  const dayAppointments = getDayAppointments(selectedDate);

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', p: 3 }}>
      <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <Button
            variant="contained"
            onClick={handleNewAppointment}
          >
            + New Appointment
          </Button>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              {/* Custom Calendar Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                mb: 2,
                px: 1
              }}>
                <IconButton onClick={handlePreviousMonth}>
                  <ArrowBackIcon />
                </IconButton>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FormControl size="small">
                    <Select
                      value={selectedDate.getMonth()}
                      onChange={(e) => {
                        const newDate = new Date(selectedDate);
                        newDate.setMonth(e.target.value);
                        setSelectedDate(newDate);
                      }}
                    >
                      {months.map((month, index) => (
                        <MenuItem key={month} value={index}>{month}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small">
                    <Select
                      value={selectedDate.getFullYear()}
                      onChange={(e) => {
                        const newDate = new Date(selectedDate);
                        newDate.setFullYear(e.target.value);
                        setSelectedDate(newDate);
                      }}
                    >
                      {years.map(year => (
                        <MenuItem key={year} value={year}>{year}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>

                <IconButton onClick={handleNextMonth}>
                  <ArrowForwardIcon />
                </IconButton>
              </Box>

              {/* Today Button */}
              <Button
                fullWidth
                variant="outlined"
                startIcon={<CalendarIcon />}
                onClick={() => setSelectedDate(new Date())}
                sx={{ mb: 2 }}
              >
                Today
              </Button>

              <DateCalendar
                value={selectedDate}
                onChange={handleDateSelect}
                componentsProps={{
                  day: {
                    onDoubleClick: (event) => {
                      const clickedDate = new Date(selectedDate);
                      const dayNumber = parseInt(event.target.textContent);
                      clickedDate.setDate(dayNumber);
                      clickedDate.setHours(17);
                      clickedDate.setMinutes(0);
                      setSelectedDateForAppointment(clickedDate);
                      setShowNewAppointmentModal(true);
                    }
                  }
                }}
                sx={{
                  width: '100%',
                  '& .MuiPickersCalendarHeader-root': {
                    display: 'none'
                  },
                  '& .MuiPickersDay-root': {
                    cursor: 'pointer'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2,
                  height: '100%',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <Typography variant="h6" gutterBottom>
                  {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
                </Typography>
                <Box sx={{ 
                  flexGrow: 1,
                  overflowY: 'auto',
                  mt: 2
                }}>
                  {dayAppointments.length > 0 ? (
                    dayAppointments.map(appointment => (
                      <Paper
                        key={appointment.id}
                        sx={{
                          p: 0,
                          mb: 3,
                          bgcolor: 'white',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          '&:hover': {
                            transform: 'translateX(5px)',
                            boxShadow: 3
                          },
                          borderRadius: 2,
                          position: 'relative',
                          overflow: 'hidden',
                          border: `1px solid ${getAppointmentColor(appointment.status)}`,
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            left: 0,
                            top: 0,
                            bottom: 0,
                            width: '4px',
                            backgroundColor: getAppointmentColor(appointment.status)
                          }
                        }}
                        onClick={() => handleAppointmentClick(appointment)}
                      >
                        {formatAppointmentDisplay(appointment)}
                      </Paper>
                    ))
                  ) : (
                    <Typography 
                      variant="body1" 
                      color="textSecondary" 
                      sx={{ textAlign: 'center', mt: 4 }}
                    >
                      No appointments for this date
                    </Typography>
                  )}
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </LocalizationProvider>

        {showNewAppointmentModal && (
          <AppointmentModal
            open={showNewAppointmentModal}
            selectedDate={selectedDateForAppointment || selectedDate}
            clients={clients}
            onSave={handleAddAppointment}
            onClose={() => {
              setShowNewAppointmentModal(false);
              setSelectedDateForAppointment(null);
              setEditingAppointment(null);
            }}
            editingAppointment={editingAppointment}
          />
        )}
      </Paper>
    </Box>
  );
}

export default Calendar; 