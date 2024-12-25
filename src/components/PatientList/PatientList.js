import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { 
  Box, Paper, Typography, Button, Dialog, 
  DialogTitle, DialogContent, DialogActions,
  TextField, IconButton, Tooltip,
  Alert
} from '@mui/material';
import { FaUserPlus, FaSearch, FaEdit, FaTrash, FaWhatsapp, FaUserTimes, FaFileImport, FaFileExport, FaFileCsv, FaAddressCard } from 'react-icons/fa';
import MessageDialog from './MessageDialog';
import { handleCSVImport, handleVCardImport, exportToCSV, exportAllVCards } from '../../utils/importExport';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CircularProgress } from '@mui/material';
import { useApp } from '../../context/AppContext';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';

const ITEMS_PER_LOAD = 20;

function PatientList({ clients, onAddClient, onUpdateClient, onDeleteClient, onPatientClick }) {
  const { addNotification } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  });
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [showDeleteAllDialog, setShowDeleteAllDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const fileInputRef = useRef(null);
  const [displayedClients, setDisplayedClients] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  // Memoize filtered clients
  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const searchLower = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(searchLower) ||
      client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  // Initialize displayed clients
  useEffect(() => {
    setDisplayedClients(filteredClients.slice(0, ITEMS_PER_LOAD));
    setHasMore(filteredClients.length > ITEMS_PER_LOAD);
  }, [filteredClients]);

  const loadMore = () => {
    const currentLength = displayedClients.length;
    const nextBatch = filteredClients.slice(
      currentLength,
      currentLength + ITEMS_PER_LOAD
    );
    setDisplayedClients(prev => [...prev, ...nextBatch]);
    setHasMore(currentLength + ITEMS_PER_LOAD < filteredClients.length);
  };

  // Memoize handlers
  const handleEdit = useCallback((patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      phone: patient.phone,
      email: patient.email,
      notes: patient.notes || ''
    });
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (editingPatient) {
      onUpdateClient({ ...editingPatient, ...formData });
      setEditingPatient(null);
    } else {
      onAddClient({
        ...formData,
        id: Date.now(),
        status: 'active'
      });
    }
    setFormData({ name: '', phone: '', email: '', notes: '' });
    setShowAddForm(false);
  }, [editingPatient, formData, onUpdateClient, onAddClient]);

  const handleWhatsApp = (client) => {
    setSelectedPatient(client);
    setShowMessageDialog(true);
  };

  const handleSendMessage = (message) => {
    if (selectedPatient?.phone) {
      const cleanPhoneNumber = selectedPatient.phone.replace(/[^0-9]/g, '');
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${cleanPhoneNumber}?text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const handleDeleteAllPatients = () => {
    onDeleteClient(null);
    setShowDeleteAllDialog(false);
  };

  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (file.name.endsWith('.csv')) {
      handleCSVImport(file, onAddClient);
    } else if (file.name.endsWith('.vcf')) {
      handleVCardImport(file, onAddClient);
    }

    // Reset file input
    event.target.value = '';
    setShowImportDialog(false);
  };

  const handleExportCSV = () => {
    exportToCSV(clients);
    setShowExportDialog(false);
  };

  const handleExportAllVCards = () => {
    exportAllVCards(clients);
    setShowExportDialog(false);
  };

  const normalizePhoneNumber = (phone) => {
    if (!phone) return '';
    // Remove all non-digit characters
    return phone.replace(/\D/g, '');
  };

  const handleRemoveDuplicates = () => {
    // Find duplicates based on normalized phone number or name
    const duplicates = {};
    
    // First pass: group by normalized phone or name
    clients.forEach(client => {
      const normalizedPhone = normalizePhoneNumber(client.phone);
      const key = normalizedPhone || client.name.toLowerCase();
      if (!duplicates[key]) {
        duplicates[key] = [];
      }
      duplicates[key].push(client);
    });

    // Find groups with duplicates
    const duplicateGroups = Object.values(duplicates).filter(group => group.length > 1);

    if (duplicateGroups.length === 0) {
      addNotification('No duplicate patients found', 'info');
      return;
    }

    // Show duplicates before confirming
    const duplicateDetails = duplicateGroups
      .map(group => `\n- ${group[0].name} (${group.length} entries)`)
      .join('');

    // Confirm with user
    const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);
    if (window.confirm(
      `Found ${totalDuplicates} duplicate patients:${duplicateDetails}\n\nRemove duplicates and keep the most recent entries?`
    )) {
      // Create new list with unique entries
      const newClientsList = clients.filter(client => {
        const normalizedPhone = normalizePhoneNumber(client.phone);
        const key = normalizedPhone || client.name.toLowerCase();
        const group = duplicates[key];
        
        // If this is a single entry, keep it
        if (group.length === 1) return true;
        
        // For duplicates, only keep the most recent one
        let mostRecent = group[0];
        group.forEach(duplicate => {
          if (new Date(duplicate.createdAt || 0) > new Date(mostRecent.createdAt || 0)) {
            mostRecent = duplicate;
          }
        });
        
        return client.id === mostRecent.id;
      });

      // Update the client list
      onUpdateClient(newClientsList);
      addNotification(`Removed ${totalDuplicates} duplicate patients`, 'success');
    }
  };

  const handleDelete = (clientId) => {
    const client = clients.find(c => c.id === clientId);
    if (window.confirm(`Are you sure you want to delete ${client.name}? This action cannot be undone.`)) {
      onDeleteClient(clientId);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Box>
          <Typography variant="h5">Patient Management</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Total Patients: {clients.length}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv,.vcf"
            style={{ display: 'none' }}
            onChange={handleFileImport}
          />
          <Button
            variant="outlined"
            startIcon={<FaFileImport />}
            onClick={() => setShowImportDialog(true)}
          >
            Import
          </Button>
          <Button
            variant="outlined"
            startIcon={<FaFileExport />}
            onClick={() => setShowExportDialog(true)}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<FaUserPlus />}
            onClick={() => setShowAddForm(true)}
          >
            Add New Patient
          </Button>
          <Button
            variant="outlined"
            color="warning"
            startIcon={<FaUserTimes />}
            onClick={handleRemoveDuplicates}
          >
            Remove Duplicates
          </Button>
          <Tooltip title="WhatsApp integration coming soon">
            <span>
              <IconButton 
                size="small"
                disabled
                sx={{ 
                  color: 'grey.400',
                  '&.Mui-disabled': {
                    color: 'grey.400'
                  }
                }}
              >
                <WhatsAppIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search patients by name or phone..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          InputProps={{
            startAdornment: <FaSearch style={{ marginRight: 8 }} />
          }}
        />
      </Paper>

      <Box id="scrollableDiv" sx={{ height: 'calc(100vh - 250px)', overflow: 'auto' }}>
        <InfiniteScroll
          dataLength={displayedClients.length}
          next={loadMore}
          hasMore={hasMore}
          loader={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <CircularProgress />
            </Box>
          }
          scrollableTarget="scrollableDiv"
          endMessage={
            <Typography 
              textAlign="center" 
              color="text.secondary" 
              sx={{ py: 2 }}
            >
              {displayedClients.length === 0 
                ? "No patients found" 
                : "All patients loaded"}
            </Typography>
          }
        >
          {displayedClients.map(client => (
            <Paper 
              key={client.id} 
              sx={{ 
                p: 2, 
                mb: 2,
                '&:hover': {
                  boxShadow: 2,
                  bgcolor: 'rgba(0, 0, 0, 0.02)'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography 
                    variant="h6"
                    sx={{ 
                      cursor: 'pointer',
                      '&:hover': {
                        color: 'primary.main',
                        textDecoration: 'underline'
                      }
                    }}
                    onClick={() => onPatientClick(client.name)}
                  >
                    {client.name}
                  </Typography>
                  <Typography color="textSecondary">{client.phone}</Typography>
                  <Typography color="textSecondary">{client.email}</Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Open WhatsApp Chat">
                    <IconButton 
                      color="success" 
                      onClick={() => handleWhatsApp(client)}
                    >
                      <FaWhatsapp />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(client)}>
                      <FaEdit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton 
                      color="error" 
                      onClick={() => handleDelete(client.id)}
                    >
                      <FaTrash />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          ))}
        </InfiniteScroll>
      </Box>

      <Dialog 
        open={showAddForm || Boolean(editingPatient)} 
        onClose={() => {
          setShowAddForm(false);
          setEditingPatient(null);
          setFormData({ name: '', phone: '', email: '', notes: '' });
        }}
      >
        <DialogTitle>
          {editingPatient ? 'Edit Patient' : 'Add New Patient'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
            <Button onClick={() => {
              setShowAddForm(false);
              setEditingPatient(null);
              setFormData({ name: '', phone: '', email: '', notes: '' });
            }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained">
              {editingPatient ? 'Save Changes' : 'Add Patient'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      {showMessageDialog && selectedPatient && (
        <MessageDialog
          open={showMessageDialog}
          onClose={() => setShowMessageDialog(false)}
          patient={selectedPatient}
          onSend={handleSendMessage}
        />
      )}

      <Dialog
        open={showDeleteAllDialog}
        onClose={() => setShowDeleteAllDialog(false)}
      >
        <DialogTitle sx={{ color: 'error.main' }}>
          Delete All Patients
        </DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action cannot be undone. All patient records will be permanently deleted.
          </Alert>
          <Typography sx={{ mt: 2 }}>
            Are you sure you want to delete all {clients.length} patients?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setShowDeleteAllDialog(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="contained" 
            color="error"
            onClick={handleDeleteAllPatients}
          >
            Delete All Patients
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showImportDialog}
        onClose={() => setShowImportDialog(false)}
      >
        <DialogTitle>Import Patients</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={() => {
                fileInputRef.current.accept = '.csv';
                fileInputRef.current.click();
              }}
            >
              Import CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaAddressCard />}
              onClick={() => {
                fileInputRef.current.accept = '.vcf';
                fileInputRef.current.click();
              }}
            >
              Import vCard
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowImportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={showExportDialog}
        onClose={() => setShowExportDialog(false)}
      >
        <DialogTitle>Export Patients</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FaFileCsv />}
              onClick={handleExportCSV}
            >
              Export as CSV
            </Button>
            <Button
              variant="outlined"
              startIcon={<FaAddressCard />}
              onClick={handleExportAllVCards}
            >
              Export all as vCards
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowExportDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default React.memo(PatientList); 