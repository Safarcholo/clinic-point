import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import Calendar from './components/Calendar/Calendar';
import QuickAppointment from './components/QuickAppointment/QuickAppointment';
import PatientList from './components/PatientList/PatientList';
import { useApp } from './context/AppContext';
import TodayAppointments from './components/TodayAppointments/TodayAppointments';
import ErrorBoundary from './components/common/ErrorBoundary';
import CallList from './components/CallList/CallList';
import WhatsApp from './components/WhatsApp/WhatsApp';
import LoginPage from './components/Login/LoginPage';
import Treatments from './components/Treatments/Treatments';
import WaitingListPage from './components/WaitingList/WaitingListPage';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { initializeTreatments } from './data/treatments';

function MainContent({ view, onPatientClick }) {
  const { 
    clients, 
    setClients, 
    appointments, 
    setAppointments,
    waitingList,
    setWaitingList,
    handleDeleteAppointment
  } = useApp();
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const handleAddAppointment = (newAppointment) => {
    setAppointments(prev => {
      // Check if this appointment already exists (for updates)
      const exists = prev.some(apt => apt.id === newAppointment.id);
      
      if (exists) {
        // Update existing appointment
        return prev.map(apt => 
          apt.id === newAppointment.id ? newAppointment : apt
        );
      } else {
        // Add new appointment
        return [...prev, newAppointment];
      }
    });
    setShowQuickAdd(false);
  };

  const handleStartTreatment = (patient) => {
    setWaitingList(prev => prev.filter(p => p.id !== patient.id));
  };

  const handleCheckIn = (appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: 'checked-in' }
        : apt
    ));
  };

  const handleCancel = (appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: 'cancelled' }
        : apt
    ));
  };

  const handleRestore = (appointment) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === appointment.id 
        ? { ...apt, status: 'scheduled' }
        : apt
    ));
  };

  const handleUpdatePatient = (updatedPatient) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === updatedPatient.id 
        ? { ...apt, 
            clientName: updatedPatient.clientName,
            phone: updatedPatient.phone,
            email: updatedPatient.email,
            notes: updatedPatient.notes
          }
        : apt
    ));
  };

  const handleWhatsApp = (patient) => {
    const phoneNumber = clients.find(c => c.name === patient.clientName)?.phone;
    if (phoneNumber) {
      const message = `Hello ${patient.clientName}`;
      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleRemoveFromWaitingList = (patientId) => {
    setWaitingList(prev => prev.filter(p => p.id !== patientId));
  };

  const renderContent = () => {
    switch (view) {
      case 'schedule':
        return (
          <div className="w-full">
            <Calendar
              appointments={appointments}
              clients={clients}
              onAddAppointment={handleAddAppointment}
              onDeleteAppointment={handleDeleteAppointment}
              defaultDate={new Date(2023, 11, 4)}
              onPatientClick={onPatientClick}
            />
          </div>
        );
      case 'today':
        return (
          <TodayAppointments
            appointments={appointments}
            clients={clients}
            onCheckIn={handleCheckIn}
            onCancel={handleCancel}
            onRestore={handleRestore}
            onUpdatePatient={handleUpdatePatient}
            onDeleteAppointment={handleDeleteAppointment}
            referenceDate={new Date()}
            onPatientClick={onPatientClick}
          />
        );
      case 'patients':
        return (
          <PatientList
            clients={clients}
            onAddClient={(client) => setClients(prev => [...prev, client])}
            onUpdateClient={setClients}
            onDeleteClient={(clientId) => {
              if (clientId === null) {
                setClients([]);
              } else {
                setClients(prev => prev.filter(c => c.id !== clientId));
              }
            }}
            onPatientClick={onPatientClick}
          />
        );
      case 'calls':
        return (
          <CallList
            appointments={appointments}
            waitingList={waitingList}
            clients={clients}
            referenceDate={new Date(2023, 11, 4)}
            onPatientClick={onPatientClick}
          />
        );
      case 'whatsapp':
        return (
          <WhatsApp
            clients={clients}
            appointments={appointments}
          />
        );
      case 'treatments':
        return <Treatments />;
      case 'waiting':
        return (
          <WaitingListPage
            waitingList={waitingList}
            onStartTreatment={handleStartTreatment}
            onRemove={handleRemoveFromWaitingList}
            onWhatsApp={handleWhatsApp}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full">
      {renderContent()}
      {showQuickAdd && (
        <QuickAppointment
          clients={clients}
          onSave={handleAddAppointment}
          onClose={() => setShowQuickAdd(false)}
        />
      )}
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  useEffect(() => {
    initializeTreatments();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AppProvider>
        <ErrorBoundary>
          {!isAuthenticated ? (
            <LoginPage onLogin={handleLogin} />
          ) : (
            <Layout
              user={user}
              onLogout={handleLogout}
            >
              <MainContent />
            </Layout>
          )}
        </ErrorBoundary>
      </AppProvider>
    </LocalizationProvider>
  );
}

export default App;
