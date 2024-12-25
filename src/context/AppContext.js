import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  saveToLocalStorage, 
  loadFromLocalStorage, 
  STORAGE_KEYS,
  createBackup,
  restoreFromBackup 
} from '../utils/storage';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Initialize with empty arrays instead of sample data
  const [clients, setClients] = useState(() => 
    loadFromLocalStorage(STORAGE_KEYS.CLIENTS) || []
  );

  const [appointments, setAppointments] = useState(() => 
    loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS) || []
  );

  const [waitingList, setWaitingList] = useState(() => 
    loadFromLocalStorage(STORAGE_KEYS.WAITING_LIST) || []
  );

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  // Save to localStorage whenever data changes
  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.CLIENTS, clients);
  }, [clients]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, appointments);
  }, [appointments]);

  useEffect(() => {
    saveToLocalStorage(STORAGE_KEYS.WAITING_LIST, waitingList);
  }, [waitingList]);

  const addNotification = (message, type = 'success', duration = 3000) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);
  };

  const updateAppointment = (appointmentId, updates) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointmentId ? { ...apt, ...updates } : apt
    ));
  };

  const deleteAppointment = (appointmentId) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  const updateClient = (clientId, updates) => {
    setClients(prev => prev.map(client => 
      client.id === clientId ? { ...client, ...updates } : client
    ));
    // Update related appointments
    setAppointments(prev => prev.map(apt => 
      apt.clientId === clientId 
        ? { ...apt, clientName: updates.name }
        : apt
    ));
  };

  const addToWaitingList = (patient) => {
    // If it's a manual entry, use the data as is
    const waitingPatient = patient.id ? patient : {
      id: Date.now(),
      clientName: patient.clientName,
      treatment: patient.treatment,
      addedAt: new Date().toISOString(),
      notes: patient.notes || '',
      status: 'waiting',
      phone: patient.phone || ''
    };
    
    setWaitingList(prev => [...prev, waitingPatient]);
    addNotification(`${patient.clientName} added to waiting list`, 'success');
  };

  // Add backup functions to context
  const createDataBackup = () => {
    const success = createBackup();
    if (success) {
      addNotification('Backup created successfully', 'success');
    } else {
      addNotification('Failed to create backup', 'error');
    }
  };

  const restoreData = async (file) => {
    try {
      const backup = await restoreFromBackup(file);
      setClients(backup.clients);
      setAppointments(backup.appointments);
      setWaitingList(backup.waitingList);
      addNotification('Data restored successfully', 'success');
    } catch (error) {
      addNotification('Failed to restore data', 'error');
    }
  };

  const handleDeleteAppointment = (appointmentId) => {
    setAppointments(prevAppointments => {
      const updatedAppointments = prevAppointments.filter(apt => apt.id !== appointmentId);
      saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, updatedAppointments);
      return updatedAppointments;
    });
  };

  const value = {
    clients,
    setClients,
    appointments,
    setAppointments,
    waitingList,
    setWaitingList,
    notifications,
    addNotification,
    loading,
    setLoading,
    updateAppointment,
    deleteAppointment,
    updateClient,
    addToWaitingList,
    createBackup: createDataBackup,
    restoreFromBackup: restoreData,
    handleDeleteAppointment
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext); 