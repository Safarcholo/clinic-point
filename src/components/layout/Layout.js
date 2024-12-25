import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Notification } from '../common/Notification';
import { useApp } from '../../context/AppContext';
import { 
  CalendarIcon, 
  UserGroupIcon, 
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ClockIcon,
  QueueListIcon
} from '@heroicons/react/24/outline';
import { LocalHospital as HospitalIcon, Vaccines as SyringeIcon } from '@mui/icons-material';
import QuickAppointment from '../QuickAppointment/QuickAppointment';
import PatientDetailsModal from '../PatientDetails/PatientDetailsModal';
import { format } from 'date-fns';
import { WbSunny as SunIcon, Cloud as CloudIcon } from '@mui/icons-material';
import { 
  Box, 
  Typography, 
  Menu, 
  MenuItem, 
  ListItemIcon, 
  ListItemText
} from '@mui/material';
import { 
  Backup as BackupIcon,
  Restore as RestoreIcon 
} from '@mui/icons-material';

export function Layout({ children, user, onLogout, onAddAppointment }) {
  const { notifications, addNotification, clients, appointments, createBackup, restoreFromBackup } = useApp();
  const [selectedView, setSelectedView] = useState('schedule');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState({ temp: '--', condition: 'sunny' });
  const [anchorEl, setAnchorEl] = useState(null);
  const fileInputRef = useRef(null);

  const navigationItems = [
    { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
    { id: 'today', label: "Today's Appointments", icon: ClockIcon },
    { id: 'patients', label: 'Patients', icon: UserGroupIcon },
    { id: 'treatments', label: 'Treatments', icon: SyringeIcon },
    { id: 'waiting', label: 'Waiting List', icon: QueueListIcon },
  ];

  const handlePatientClick = (clientName) => {
    console.log('Layout: handlePatientClick called with:', clientName);
    const patient = clients.find(c => c.name.trim() === clientName.trim());
    
    if (patient) {
      setSelectedPatient(patient);
      setShowPatientDetails(true);
    } else {
      console.error('Patient not found in clients list');
      addNotification('Patient not found in the system', 'error');
    }
  };

  const handleViewChange = (viewId) => {
    setSelectedView(viewId);
  };

  const handleAddAppointment = (newAppointment) => {
    onAddAppointment(newAppointment);
    setShowQuickAdd(false);
    addNotification('Appointment added successfully');
  };

  const handleSettingsClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Create a modified version of children with the necessary props
  const enhancedChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        view: selectedView,
        onPatientClick: handlePatientClick,
        clients,
        appointments
      });
    }
    return child;
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Tel%20Aviv&units=metric&appid=f6e3864abb67de3f9b00c619b1c98acb`
        );
        const data = await response.json();
        
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main.toLowerCase()
        });
      } catch (error) {
        console.error('Error fetching weather:', error);
      }
    };

    fetchWeather();
    // Update weather every 30 minutes
    const weatherInterval = setInterval(fetchWeather, 1800000);

    return () => clearInterval(weatherInterval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside
          initial={{ x: -250 }}
          animate={{ x: 0 }}
          className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-30"
        >
          {/* Logo */}
          <div className="p-6 border-b flex items-center gap-3">
            <HospitalIcon 
              className="text-primary-600"
              sx={{ fontSize: 28 }}
            />
            <h1 className="text-xl font-bold text-primary-600">
              Clinic Point
            </h1>
          </div>

          {/* Clock */}
          <div className="px-4 py-3">
            {/* Remove the Clock component from here */}
          </div>

          {/* Navigation */}
          <nav className="p-4">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleViewChange(item.id)}
                className={`w-full text-left px-4 py-2 rounded-lg mb-1 flex items-center ${
                  selectedView === item.id 
                    ? 'bg-primary-50 text-primary-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          {/* User section */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={handleSettingsClick}
              >
                <Cog6ToothIcon className="w-5 h-5" />
              </button>
              <button 
                className="p-2 text-gray-500 hover:text-gray-700"
                onClick={onLogout}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
              </button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => {
                  createBackup();
                  handleClose();
                }}>
                  <ListItemIcon>
                    <BackupIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Backup Data</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => {
                  fileInputRef.current?.click();
                  handleClose();
                }}>
                  <ListItemIcon>
                    <RestoreIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>Restore Data</ListItemText>
                </MenuItem>
              </Menu>

              <input
                type="file"
                accept=".json"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    restoreFromBackup(e.target.files[0]);
                  }
                }}
              />
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="flex-1 ml-64 min-h-screen">
          {/* Header */}
          <header className="flex justify-between items-center h-16 px-6 bg-white border-b">
            <div className="flex items-center gap-4">
              {/* Left side empty now */}
            </div>
            <div className="flex items-center gap-4">
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2  // Increased gap between clock and weather
              }}>
                {/* Clock */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'flex-end'  // Align to the right
                }}>
                  <Typography 
                    variant="h5" 
                    color="primary.main" 
                    sx={{ 
                      fontWeight: 'bold',
                      letterSpacing: '-0.5px'
                    }}
                  >
                    {format(currentTime, 'HH:mm')}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color="text.secondary"
                  >
                    {format(currentTime, 'EEEE, MMMM d')}
                  </Typography>
                </Box>

                {/* Weather */}
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  bgcolor: 'primary.50',
                  p: 1,
                  borderRadius: 1,
                }}>
                  {weather.condition === 'sunny' || weather.condition === 'clear' ? (
                    <SunIcon sx={{ 
                      color: 'warning.main',
                      fontSize: 24
                    }} />
                  ) : (
                    <CloudIcon sx={{ 
                      color: 'primary.main',
                      fontSize: 24
                    }} />
                  )}
                  <Typography 
                    variant="body1" 
                    sx={{ fontWeight: 'medium' }}
                  >
                    {weather.temp}°C
                  </Typography>
                </Box>
              </Box>
              <button className="relative p-2 hover:bg-gray-100 rounded-full">
                <BellIcon className="h-6 w-6" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>
            </div>
          </header>

          {/* Notifications */}
          <div className="fixed top-4 right-4 z-50">
            {notifications.map(notification => (
              <Notification
                key={notification.id}
                message={notification.message}
                type={notification.type}
                onClose={() => {}}
              />
            ))}
          </div>

          {/* Page content */}
          <motion.div 
            className="p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {enhancedChildren}
          </motion.div>

          {/* Add QuickAppointment dialog */}
          {showQuickAdd && (
            <QuickAppointment
              clients={clients}
              onSave={handleAddAppointment}
              onClose={() => setShowQuickAdd(false)}
            />
          )}
        </main>
      </div>

      {/* Modal rendered at root level */}
      {showPatientDetails && selectedPatient && (
        <PatientDetailsModal
          open={showPatientDetails}
          onClose={() => {
            setShowPatientDetails(false);
            setSelectedPatient(null);
          }}
          patient={selectedPatient}
          appointments={appointments}
        />
      )}
    </div>
  );
} 