import React from 'react';
import { FaUsers, FaCalendarAlt, FaChartLine, FaClock, FaCheckCircle } from 'react-icons/fa';
import './Dashboard.css';

function Dashboard({ clients, appointments }) {
  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate > today;
  }).slice(0, 5);

  const completedAppointments = appointments.filter(apt => apt.status === 'completed').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Your Clinic Dashboard</h1>
        <p className="current-time">
          <FaClock /> {new Date().toLocaleString()}
        </p>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <FaUsers className="stat-icon" />
          <div className="stat-info">
            <h3>Total Patients</h3>
            <p>{clients.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarAlt className="stat-icon" />
          <div className="stat-info">
            <h3>Today's Appointments</h3>
            <p>{todayAppointments.length}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div className="stat-info">
            <h3>Completed</h3>
            <p>{completedAppointments}</p>
          </div>
        </div>
        <div className="stat-card">
          <FaChartLine className="stat-icon" />
          <div className="stat-info">
            <h3>Monthly Revenue</h3>
            <p>${calculateMonthlyRevenue(clients)}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card today-appointments">
          <h2>Today's Schedule</h2>
          <div className="appointment-list">
            {todayAppointments.length > 0 ? (
              todayAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <p className="no-data">No appointments scheduled for today</p>
            )}
          </div>
        </div>

        <div className="dashboard-card upcoming-appointments">
          <h2>Upcoming Appointments</h2>
          <div className="appointment-list">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map(apt => (
                <AppointmentCard key={apt.id} appointment={apt} />
              ))
            ) : (
              <p className="no-data">No upcoming appointments</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppointmentCard({ appointment }) {
  return (
    <div className="appointment-card">
      <div className="time">
        {new Date(appointment.date).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit' 
        })}
      </div>
      <div className="details">
        <h4>{appointment.clientName}</h4>
        <p>{appointment.treatment}</p>
        {appointment.notes && <p className="notes">{appointment.notes}</p>}
      </div>
      <div className={`status status-${appointment.status}`}>
        {appointment.status}
      </div>
    </div>
  );
}

function calculateMonthlyRevenue(clients) {
  const currentMonth = new Date().getMonth();
  return clients.reduce((total, client) => {
    const monthlyTreatments = client.treatmentHistory.filter(
      treatment => new Date(treatment.date).getMonth() === currentMonth
    );
    return total + monthlyTreatments.reduce((sum, t) => sum + Number(t.cost), 0);
  }, 0).toLocaleString();
}

export default Dashboard; 