import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  IconButton,
  Tooltip
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';

// Default templates that cannot be deleted
const defaultTemplates = [
  {
    id: 1,
    name: 'Appointment Reminder',
    template: 'Hi {name}, this is a reminder for your appointment tomorrow at {time}.',
    isDefault: true
  },
  {
    id: 2,
    name: 'Custom Message',
    template: '',
    isDefault: true
  }
];

function MessageDialog({ open, onClose, patient, onSend }) {
  const [templates, setTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem('whatsappTemplates');
    return savedTemplates ? JSON.parse(savedTemplates) : defaultTemplates;
  });
  const [selectedTemplate, setSelectedTemplate] = useState(templates[0]);
  const [message, setMessage] = useState('');
  const [showSaveTemplate, setShowSaveTemplate] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

  useEffect(() => {
    localStorage.setItem('whatsappTemplates', JSON.stringify(templates));
  }, [templates]);

  const handleTemplateChange = (event) => {
    const selected = templates.find(temp => temp.id === event.target.value);
    setSelectedTemplate(selected);
    if (selected.template) {
      const personalizedMessage = selected.template.replace('{name}', patient?.name || '');
      setMessage(personalizedMessage);
    } else {
      setMessage('');
    }
  };

  const handleSaveTemplate = () => {
    if (!newTemplateName.trim()) return;
    
    const newTemplate = {
      id: Date.now(),
      name: newTemplateName,
      template: message,
      isDefault: false
    };

    setTemplates(prev => [...prev, newTemplate]);
    setNewTemplateName('');
    setShowSaveTemplate(false);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      if (selectedTemplate.id === templateId) {
        setSelectedTemplate(templates[0]);
        setMessage(templates[0].template.replace('{name}', patient?.name || ''));
      }
    }
  };

  const handleSend = () => {
    onSend(message);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Send WhatsApp Message</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Sending to: {patient?.name} ({patient?.phone})
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl fullWidth>
              <InputLabel>Message Template</InputLabel>
              <Select
                value={selectedTemplate.id}
                onChange={handleTemplateChange}
                label="Message Template"
              >
                {templates.map(template => (
                  <MenuItem 
                    key={template.id} 
                    value={template.id}
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <span>{template.name}</span>
                    {!template.isDefault && (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template.id);
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    )}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Tooltip title="Save as new template">
              <IconButton 
                onClick={() => setShowSaveTemplate(true)}
                color="primary"
              >
                <SaveIcon />
              </IconButton>
            </Tooltip>
          </Box>

          {showSaveTemplate && (
            <TextField
              fullWidth
              label="Template Name"
              value={newTemplateName}
              onChange={(e) => setNewTemplateName(e.target.value)}
              placeholder="Enter template name"
              size="small"
              InputProps={{
                endAdornment: (
                  <Button 
                    onClick={handleSaveTemplate}
                    disabled={!newTemplateName.trim()}
                    size="small"
                  >
                    Save
                  </Button>
                )
              }}
            />
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            helperText="You can edit this message before sending"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          onClick={handleSend}
          variant="contained"
          disabled={!message.trim()}
        >
          Send
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default MessageDialog; 