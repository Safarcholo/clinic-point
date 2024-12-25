import React, { useState } from 'react';

function TreatmentHistory({ client, onUpdate }) {
  const [newTreatment, setNewTreatment] = useState({
    date: '',
    treatment: '',
    notes: '',
    cost: '',
    nextFollowUp: ''
  });

  const addTreatment = () => {
    const updatedHistory = [...client.treatmentHistory, { ...newTreatment, id: Date.now() }];
    const totalSpent = updatedHistory.reduce((sum, treatment) => sum + Number(treatment.cost), 0);
    
    onUpdate(client.id, {
      treatmentHistory: updatedHistory,
      totalSpent
    });

    setNewTreatment({
      date: '',
      treatment: '',
      notes: '',
      cost: '',
      nextFollowUp: ''
    });
  };

  return (
    <div className="treatment-history">
      <h3>Treatment History</h3>
      
      <div className="add-treatment">
        <h4>Add New Treatment</h4>
        <div className="treatment-form">
          <input
            type="date"
            value={newTreatment.date}
            onChange={(e) => setNewTreatment({...newTreatment, date: e.target.value})}
          />
          <select
            value={newTreatment.treatment}
            onChange={(e) => setNewTreatment({...newTreatment, treatment: e.target.value})}
          >
            <option value="">Select Treatment</option>
            <option value="botox">Botox</option>
            <option value="hyaluronic">Hyaluronic Acid</option>
          </select>
          <input
            type="number"
            placeholder="Cost"
            value={newTreatment.cost}
            onChange={(e) => setNewTreatment({...newTreatment, cost: e.target.value})}
          />
          <textarea
            placeholder="Treatment Notes"
            value={newTreatment.notes}
            onChange={(e) => setNewTreatment({...newTreatment, notes: e.target.value})}
          />
          <input
            type="date"
            placeholder="Next Follow-up"
            value={newTreatment.nextFollowUp}
            onChange={(e) => setNewTreatment({...newTreatment, nextFollowUp: e.target.value})}
          />
          <button onClick={addTreatment}>Add Treatment</button>
        </div>
      </div>

      <div className="history-list">
        {client.treatmentHistory.map(treatment => (
          <div key={treatment.id} className="treatment-card">
            <div className="treatment-header">
              <h4>{treatment.treatment}</h4>
              <span className="treatment-date">{treatment.date}</span>
            </div>
            <p className="treatment-notes">{treatment.notes}</p>
            <div className="treatment-footer">
              <span className="treatment-cost">${treatment.cost}</span>
              {treatment.nextFollowUp && (
                <span className="follow-up">Next: {treatment.nextFollowUp}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TreatmentHistory; 