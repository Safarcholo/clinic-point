import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Chip,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tooltip
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PaidIcon from '@mui/icons-material/Paid';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { treatments } from '../../data/treatments';

function ConfirmDeleteDialog({ open, onClose, onConfirm }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Delete Treatment</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this treatment? This action cannot be undone.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TreatmentDialog({ open, onClose, onSave, editingTreatment = null }) {
  const [formData, setFormData] = useState(() => {
    if (editingTreatment) {
      const durationStr = editingTreatment.duration || '';
      const hours = durationStr.includes('hour') ? parseInt(durationStr) : 0;
      const minutes = durationStr.includes('minutes') ? parseInt(durationStr.match(/(\d+) minutes/)?.[1] || '0') : 0;
      
      return {
        ...editingTreatment,
        durationHours: hours,
        durationMinutes: minutes
      };
    }
    return {
      name: '',
      description: '',
      price: '',
      durationHours: 0,
      durationMinutes: 0,
      details: []
    };
  });

  const handleSubmit = () => {
    const hours = parseInt(formData.durationHours) || 0;
    const minutes = parseInt(formData.durationMinutes) || 0;
    let durationStr = '';
    
    if (hours > 0) {
      durationStr += `${hours} hour${hours > 1 ? 's' : ''}`;
    }
    if (minutes > 0) {
      if (durationStr) durationStr += ' ';
      durationStr += `${minutes} minutes`;
    }
    if (!durationStr) durationStr = '0 minutes';

    const treatmentData = {
      ...formData,
      duration: durationStr,
      durationHours: hours.toString(),
      durationMinutes: minutes.toString()
    };

    onSave(treatmentData);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            required
          />
          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            fullWidth
            required
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              label="Hours"
              type="text"
              value={formData.durationHours}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || /^\d+$/.test(value)) {
                  setFormData({ 
                    ...formData, 
                    durationHours: value
                  });
                }
              }}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Minutes"
              type="text"
              value={formData.durationMinutes}
              onChange={(e) => {
                const value = e.target.value;
                if (value === '' || (/^\d+$/.test(value) && parseInt(value) <= 59)) {
                  setFormData({ 
                    ...formData, 
                    durationMinutes: value
                  });
                }
              }}
              sx={{ flex: 1 }}
            />
          </Box>
          <TextField
            label="Details (one per line)"
            value={formData.details?.join('\n') || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              details: e.target.value.split('\n').filter(line => line.trim())
            })}
            fullWidth
            multiline
            rows={4}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.name || !formData.price}
        >
          {editingTreatment ? 'Update' : 'Add'} Treatment
        </Button>
      </DialogActions>
    </Dialog>
  );
}

function TreatmentCard({ treatment, onEdit, onDelete }) {
  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Typography variant="h6" component="h3">
          {treatment.name}
        </Typography>
        <Box>
          <Tooltip title="Edit">
            <IconButton 
              size="small" 
              onClick={() => onEdit(treatment)}
              sx={{ mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton 
              size="small" 
              color="error"
              onClick={() => onDelete(treatment)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Typography color="text.secondary" paragraph>
        {treatment.description}
      </Typography>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Chip
          icon={<AccessTimeIcon />}
          label={treatment.duration}
          size="small"
        />
        <Chip
          icon={<PaidIcon />}
          label={treatment.price}
          size="small"
        />
      </Box>

      {treatment.details?.length > 0 && (
        <Box>
          <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <InfoIcon fontSize="small" />
            Details
          </Typography>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {treatment.details.map((detail, index) => (
              <li key={index}>
                <Typography variant="body2" color="text.secondary">
                  {detail}
                </Typography>
              </li>
            ))}
          </ul>
        </Box>
      )}
    </Paper>
  );
}

function Treatments() {
  const [showDialog, setShowDialog] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  const [localTreatments, setLocalTreatments] = useState(treatments);
  const [deletingTreatment, setDeletingTreatment] = useState(null);

  const handleEdit = (treatment) => {
    setEditingTreatment({
      ...treatment,
      category: treatment.category
    });
    setShowDialog(true);
  };

  const handleAdd = () => {
    setEditingTreatment(null);
    setShowDialog(true);
  };

  const handleSave = (treatmentData) => {
    if (editingTreatment) {
      const updatedTreatments = localTreatments.map(category => ({
        ...category,
        items: category.items.map(item => 
          item.id === editingTreatment.id ? { ...item, ...treatmentData } : item
        )
      }));
      setLocalTreatments(updatedTreatments);
      localStorage.setItem('treatments', JSON.stringify(updatedTreatments));
    } else {
      const newTreatment = {
        ...treatmentData,
        id: Date.now().toString(),
      };
      
      const updatedTreatments = [...localTreatments];
      updatedTreatments[0].items.push(newTreatment);
      setLocalTreatments(updatedTreatments);
      localStorage.setItem('treatments', JSON.stringify(updatedTreatments));
    }
    
    window.dispatchEvent(new Event('storage'));
    
    setShowDialog(false);
    setEditingTreatment(null);
  };

  const handleDelete = (treatment) => {
    console.log('Deleting treatment:', treatment);
    setDeletingTreatment(treatment);
  };

  const confirmDelete = () => {
    console.log('Confirming delete for:', deletingTreatment);
    
    const updatedTreatments = localTreatments.map(category => ({
      ...category,
      items: category.items.filter(item => item.id !== deletingTreatment.id)
    })).filter(category => category.items.length > 0);
    
    setLocalTreatments(updatedTreatments);
    localStorage.setItem('treatments', JSON.stringify(updatedTreatments));
    
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('treatmentsUpdated'));
    
    setDeletingTreatment(null);
  };

  useEffect(() => {
    const savedTreatments = localStorage.getItem('treatments');
    if (savedTreatments) {
      setLocalTreatments(JSON.parse(savedTreatments));
    }
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" color="primary">
          Our Treatments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Treatment
        </Button>
      </Box>
      
      {localTreatments.map((category) => (
        <Box key={category.category} sx={{ mb: 6 }}>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              mt: 4, 
              mb: 3,
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 1
            }}
          >
            {category.category}
          </Typography>
          <Grid container spacing={3}>
            {category.items.map((treatment) => (
              <Grid item xs={12} md={6} lg={4} key={treatment.id}>
                <TreatmentCard 
                  treatment={treatment}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      ))}

      <ConfirmDeleteDialog
        open={Boolean(deletingTreatment)}
        onClose={() => setDeletingTreatment(null)}
        onConfirm={confirmDelete}
      />

      <TreatmentDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingTreatment(null);
        }}
        onSave={handleSave}
        editingTreatment={editingTreatment}
      />
    </Box>
  );
}

export default Treatments; 