import React, { useState, useEffect } from 'react';

function ClientDetails({ client, mode = 'edit', onSave, onUpdate, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    dateOfBirth: '',
    address: '',
    notes: '',
    allergies: '',
    medicalHistory: '',
    preferredTreatments: []
  });

  useEffect(() => {
    if (client && mode === 'edit') {
      setFormData(client);
    }
  }, [client, mode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (mode === 'new') {
      onSave(formData);
    } else {
      onUpdate(client.id, formData);
    }
  };

  return (
    <div className="client-details">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({...formData, phone: e.target.value})}
            required
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Date of Birth</label>
          <input
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Medical History</label>
          <textarea
            value={formData.medicalHistory}
            onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Allergies</label>
          <textarea
            value={formData.allergies}
            onChange={(e) => setFormData({...formData, allergies: e.target.value})}
          />
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="save-btn">
            {mode === 'new' ? 'Create Client' : 'Update Client'}
          </button>
          <button type="button" className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClientDetails; 