import React from 'react';

function Analytics({ clients }) {
  const totalClients = clients.length;
  const activeClients = clients.filter(c => c.status === 'active').length;
  const totalRevenue = clients.reduce((sum, client) => sum + client.totalSpent, 0);
  
  const treatmentStats = clients.reduce((stats, client) => {
    client.treatmentHistory.forEach(treatment => {
      stats[treatment.treatment] = (stats[treatment.treatment] || 0) + 1;
    });
    return stats;
  }, {});

  return (
    <div className="analytics">
      <h2>Clinic Analytics</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Clients</h3>
          <p>{totalClients}</p>
        </div>
        
        <div className="stat-card">
          <h3>Active Clients</h3>
          <p>{activeClients}</p>
        </div>
        
        <div className="stat-card">
          <h3>Total Revenue</h3>
          <p>${totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <div className="treatment-stats">
        <h3>Treatment Statistics</h3>
        {Object.entries(treatmentStats).map(([treatment, count]) => (
          <div key={treatment} className="treatment-stat">
            <span>{treatment}</span>
            <span>{count} treatments</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Analytics; 