import { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';

export function useAppointments() {
  const { appointments, setAppointments, addNotification } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const todayAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate.toDateString() === selectedDate.toDateString();
    });
  }, [appointments, selectedDate]);

  const addAppointment = (newAppointment) => {
    setAppointments(prev => [...prev, { ...newAppointment, id: Date.now() }]);
    addNotification('Appointment scheduled successfully');
  };

  const updateAppointment = (id, updates) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt)
    );
    addNotification('Appointment updated successfully');
  };

  const deleteAppointment = (id) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
    addNotification('Appointment deleted successfully', 'info');
  };

  return {
    todayAppointments,
    selectedDate,
    setSelectedDate,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };
} 