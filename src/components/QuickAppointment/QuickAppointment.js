import React, { useState, useMemo, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Typography
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useDebounce } from '../../hooks/useDebounce';
import { getAllTreatments } from '../../data/treatments';

const MAX_SUGGESTIONS = 50; // Limit number of suggestions

function QuickAppointment({ clients, onSave, onClose }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedTreatment, setSelectedTreatment] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [notes, setNotes] = useState('');
  
  const debouncedInput = useDebounce(inputValue, 300);

  // Memoize filtered suggestions
  const filteredSuggestions = useMemo(() => {
    if (!debouncedInput) return [];
    
    const searchLower = debouncedInput.toLowerCase();
    return clients
      .filter(client => 
        client.name.toLowerCase().includes(searchLower) ||
        client.phone.includes(debouncedInput)
      )
      .slice(0, MAX_SUGGESTIONS);
  }, [clients, debouncedInput]);

  // Add state for treatments
  const [treatments, setTreatments] = useState(() => {
    // Try to get treatments from localStorage first
    const savedTreatments = localStorage.getItem('treatments');
    if (savedTreatments) {
      const parsedTreatments = JSON.parse(savedTreatments);
      // Flatten the treatments array
      return parsedTreatments.reduce((acc, category) => [...acc, ...category.items], []);
    }
    // Fall back to default treatments if none in localStorage
    return getAllTreatments();
  });

  // Add effect to update treatments when localStorage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedTreatments = localStorage.getItem('treatments');
      if (savedTreatments) {
        const parsedTreatments = JSON.parse(savedTreatments);
        setTreatments(parsedTreatments.reduce((acc, category) => [...acc, ...category.items], []));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSubmit = () => {
    const appointmentDate = new Date(selectedDate);
    appointmentDate.setHours(selectedTime.getHours());
    appointmentDate.setMinutes(selectedTime.getMinutes());

    const appointment = {
      id: Date.now(),
      clientName: selectedClient?.name || inputValue,
      treatment: selectedTreatment,
      date: appointmentDate.toISOString(),
      notes: notes,
      status: 'scheduled'
    };

    onSave(appointment);
  };

  return (
    <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quick Appointment</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Autocomplete
            freeSolo
            options={filteredSuggestions}
            getOptionLabel={(option) => {
              if (typeof option === 'string') return option;
              return `${option.name} (${option.phone})`;
            }}
            value={selectedClient}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
              setInputValue(newValue ? newValue.name : '');
            }}
            inputValue={inputValue}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Patient Name"
                required
                helperText={
                  filteredSuggestions.length === MAX_SUGGESTIONS 
                    ? `Showing first ${MAX_SUGGESTIONS} matches` 
                    : undefined
                }
              />
            )}
            renderOption={(props, option) => (
              <li {...props}>
                <Box>
                  <Typography>{option.name}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.phone}
                  </Typography>
                </Box>
              </li>
            )}
            filterOptions={(x) => x} // Disable built-in filtering
            loading={debouncedInput !== inputValue}
          />

          <FormControl fullWidth>
            <InputLabel>Treatment</InputLabel>
            <Select
              value={selectedTreatment}
              onChange={(e) => setSelectedTreatment(e.target.value)}
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

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Date"
              value={selectedDate}
              onChange={(newDate) => setSelectedDate(newDate)}
              renderInput={(params) => <TextField {...params} fullWidth />}
              minDate={new Date()}
            />
            <TimePicker
              label="Time"
              value={selectedTime}
              onChange={(newTime) => setSelectedTime(newTime)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>

          <TextField
            label="Notes"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!inputValue || !selectedTreatment}
        >
          Save Appointment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default QuickAppointment; 