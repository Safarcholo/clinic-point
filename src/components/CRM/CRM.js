import React, { useState } from 'react';
import './CRM.css';
import ClientDetails from './ClientDetails';
import TreatmentHistory from './TreatmentHistory';
import Analytics from './Analytics';

function CRM({ clients, setClients }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');

  const addNewClient = (newClient) => {
    setClients([...clients, { 
      id: Date.now(),
      ...newClient,
      treatmentHistory: [],
      nextAppointment: null,
      totalSpent: 0,
      notes: '',
      status: 'active'
    }]);
  };

  const updateClient = (id, updatedData) => {
    setClients(clients.map(client => 
      client.id === id ? { ...client, ...updatedData } : client
    ));
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone?.includes(searchTerm);
    
    switch(filterBy) {
      case 'active':
        return matchesSearch && client.status === 'active';
      case 'inactive':
        return matchesSearch && client.status === 'inactive';
      case 'vip':
        return matchesSearch && client.totalSpent > 5000;
      default:
        return matchesSearch;
    }
  });

  return (
    <div className="crm-container">
      <div className="crm-sidebar">
        <div className="crm-search">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select 
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
          >
            <option value="all">All Clients</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="vip">VIP</option>
          </select>
        </div>

        <button className="add-client-btn" onClick={() => setSelectedClient('new')}>
          Add New Client
        </button>

        <div className="clients-list">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              className={`client-card ${selectedClient?.id === client.id ? 'selected' : ''}`}
              onClick={() => setSelectedClient(client)}
            >
              <h3>{client.name}</h3>
              <p>{client.phone}</p>
              <div className="client-tags">
                {client.status === 'vip' && <span className="tag vip">VIP</span>}
                {client.nextAppointment && <span className="tag upcoming">Upcoming</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="crm-main">
        {selectedClient === 'new' ? (
          <ClientDetails
            mode="new"
            onSave={addNewClient}
            onCancel={() => setSelectedClient(null)}
          />
        ) : selectedClient ? (
          <>
            <ClientDetails
              client={selectedClient}
              onUpdate={updateClient}
              onCancel={() => setSelectedClient(null)}
            />
            <TreatmentHistory client={selectedClient} onUpdate={updateClient} />
          </>
        ) : (
          <Analytics clients={clients} />
        )}
      </div>
    </div>
  );
}

export default CRM; 