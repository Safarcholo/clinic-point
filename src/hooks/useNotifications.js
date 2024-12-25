import { useState, useEffect } from 'react';

export function useNotifications(appointments) {
  useEffect(() => {
    const checkUpcomingAppointments = () => {
      const now = new Date();
      appointments.forEach(apt => {
        const aptTime = new Date(apt.date);
        const timeDiff = aptTime - now;
        
        // Notify 15 minutes before appointment
        if (timeDiff > 0 && timeDiff <= 15 * 60 * 1000) {
          new Notification(`Upcoming Appointment`, {
            body: `${apt.clientName} - ${apt.treatment} in 15 minutes`
          });
        }
      });
    };

    const timer = setInterval(checkUpcomingAppointments, 60000);
    return () => clearInterval(timer);
  }, [appointments]);
} 