import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box
} from '@mui/material';
import SearchableSelect from '../common/SearchableSelect';

function EditPatientModal({ open, patient, clients, onSave, onClose }) {
  const [formData, setFormData] = useState({
    clientName: patient?.clientName || '',
    phone: patient?.phone || '',
    email: patient?.email || '',
    notes: patient?.notes || ''
  });

  // Find the matching client from the clients list
  const selectedClient = clients?.find(c => c.name === patient?.clientName);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...patient, ...formData });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Patient Information</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <SearchableSelect
              label="Patient"
              options={clients || []}
              value={selectedClient}
              onChange={(client) => {
                if (client) {
                  setFormData({
                    ...formData,
                    clientName: client.name,
                    phone: client.phone,
                    email: client.email
                  });
                }
              }}
              getOptionLabel={(client) => `${client.name} (${client.phone})`}
              required
              placeholder="Search by name or phone..."
            />
            <TextField
              label="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save Changes</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default EditPatientModal; 