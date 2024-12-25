import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip,
  Divider
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  WhatsApp as WhatsAppIcon,
  Add as AddIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { formatDateTime } from '../../utils/dateFormat';
import { sendWhatsAppMessage, WhatsAppConfig } from '../../utils/whatsapp';
import { useApp } from '../../context/AppContext';

function AddWaitingPatientDialog({ open, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    clientName: '',
    phone: '',
    treatment: '',
    notes: ''
  });

  const handleSubmit = () => {
    onAdd({
      ...formData,
      id: Date.now(),
      addedAt: new Date().toISOString(),
      status: 'waiting'
    });
    onClose();
    setFormData({ clientName: '', phone: '', treatment: '', notes: '' });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add to Waiting List</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={formData.clientName}
            onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Treatment"
            value={formData.treatment}
            onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
            fullWidth
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
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.clientName || !formData.phone}
        >
          Add to List
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function WaitingListPage({ waitingList = [], onRemove }) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const { addToWaitingList } = useApp();

  const handleWhatsApp = (patient) => {
    if (!patient.phone) {
      console.error('No phone number available');
      return;
    }
    const message = WhatsAppConfig.templates.generalMessage(patient.clientName);
    sendWhatsAppMessage(patient.phone, message, true);
  };

  const handleAddManually = (newPatient) => {
    addToWaitingList(newPatient);
  };

  const handleDelete = (patient) => {
    if (window.confirm(`Remove ${patient.clientName} from waiting list?`)) {
      onRemove(patient.id);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Waiting List
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setShowAddDialog(true)}
        >
          Add to Waiting List
        </Button>
      </Box>
      
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ClockIcon color="primary" />
          Current Waiting List
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {waitingList.length === 0 ? (
          <Typography color="textSecondary" align="center">
            No patients in waiting list
          </Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {waitingList.map((patient) => (
              <Paper
                key={patient.id}
                elevation={1}
                sx={{
                  p: 2,
                  borderLeft: 3,
                  borderColor: 'primary.main'
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                      {patient.clientName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {patient.treatment}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Added: {formatDateTime(patient.addedAt)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Send WhatsApp">
                      <IconButton 
                        size="small"
                        color="success"
                        onClick={() => handleWhatsApp(patient)}
                      >
                        <WhatsAppIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Remove from List">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(patient)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Paper>

      <AddWaitingPatientDialog
        open={showAddDialog}
        onClose={() => setShowAddDialog(false)}
        onAdd={handleAddManually}
      />
    </Box>
  );
}

export default WaitingListPage; 