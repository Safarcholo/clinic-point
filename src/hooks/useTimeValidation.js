import { useState, useCallback } from 'react';

export function useTimeValidation() {
  const [error, setError] = useState('');

  const validateWorkingHours = useCallback((date) => {
    const day = date.getDay();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const time = hours + minutes / 60;

    // Saturday is closed
    if (day === 6) {
      setError('Clinic is closed on Saturdays');
      return false;
    }

    // Sunday to Thursday: 17:00 - 21:00
    if ([0, 1, 2, 3, 4].includes(day)) {
      if (time < 17 || time >= 21) {
        setError('Working hours on Sunday-Thursday are 17:00-21:00');
        return false;
      }
    }
    // Friday: 9:00 - 19:00
    else if (day === 5) {
      if (time < 9 || time >= 19) {
        setError('Working hours on Friday are 9:00-19:00');
        return false;
      }
    }

    setError('');
    return true;
  }, []);

  const validateTimeSlot = useCallback((date, appointments, duration) => {
    if (!validateWorkingHours(date)) {
      return false;
    }

    const endTime = new Date(date.getTime() + duration * 60000);
    const conflictingAppointment = appointments.find(apt => {
      if (apt.status === 'cancelled') return false;
      
      const aptStart = new Date(apt.date);
      const aptEnd = new Date(aptStart.getTime() + 
        (TREATMENT_DURATIONS[apt.treatment] * 60000));

      return (date < aptEnd && endTime > aptStart);
    });

    if (conflictingAppointment) {
      setError('This time slot overlaps with another appointment');
      return false;
    }

    return true;
  }, [validateWorkingHours]);

  return { error, validateWorkingHours, validateTimeSlot };
} 