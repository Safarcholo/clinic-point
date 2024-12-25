import React from 'react';
import './Banner.css';
import { FaUsers, FaCalendarAlt, FaChartLine, FaCheckCircle } from 'react-icons/fa';

function Banner({ stats }) {
  return (
    <div className="banner">
      {Object.entries(stats).map(([key, value]) => (
        <div key={key} className="banner-stat">
          <div className="banner-stat-icon">
            {getIconForStat(key)}
          </div>
          <div className="banner-stat-content">
            <h3>{formatStatLabel(key)}</h3>
            <p>{formatStatValue(key, value)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function getIconForStat(key) {
  switch (key) {
    case 'totalPatients':
    case 'activePatients':
    case 'vipPatients':
      return <FaUsers />;
    case 'todayAppointments':
      return <FaCalendarAlt />;
    case 'monthlyRevenue':
      return <FaChartLine />;
    case 'completedAppointments':
    case 'newThisMonth':
      return <FaCheckCircle />;
    default:
      return null;
  }
}

function formatStatLabel(key) {
  const labels = {
    totalPatients: 'Total Patients',
    activePatients: 'Active Patients',
    todayAppointments: "Today's Appointments",
    monthlyRevenue: 'Monthly Revenue',
    completedAppointments: 'Completed',
    newThisMonth: 'New This Month',
    vipPatients: 'VIP Patients'
  };
  return labels[key] || key;
}

function formatStatValue(key, value) {
  if (key === 'monthlyRevenue') {
    return `$${value}`;
  }
  return value;
}

export default Banner; 