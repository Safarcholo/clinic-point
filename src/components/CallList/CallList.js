import React from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Tooltip,
  Divider
} from '@mui/material';
import { Phone, WhatsApp } from '@mui/icons-material';
import { isSameDay } from 'date-fns';
import { sendWhatsAppMessage, WhatsAppConfig } from '../../utils/whatsapp';

function CallList({ appointments, waitingList, clients, referenceDate, onPatientClick }) {
  // Combine and sort all patients for today
  const todaysCalls = [...appointments, ...waitingList]
    .filter(apt => {
      const aptDate = new Date(apt.date);
      return isSameDay(aptDate, referenceDate);
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const getClientPhone = (clientName) => {
    const client = clients.find(c => c.name === clientName);
    return client?.phone || '';
  };

  const handleCall = (clientName) => {
    const phoneNumber = getClientPhone(clientName);
    if (phoneNumber) {
      window.location.href = `tel:${phoneNumber}`;
    }
  };

  const handleNameClick = (clientName) => {
    const phoneNumber = getClientPhone(clientName);
    if (phoneNumber) {
      sendWhatsAppMessage(phoneNumber, '', false); // Direct WhatsApp
    }
  };

  const handleWhatsApp = (patient) => {
    const phoneNumber = getClientPhone(patient.clientName);
    if (phoneNumber) {
      const message = WhatsAppConfig.templates.generalMessage(patient.clientName);
      sendWhatsAppMessage(phoneNumber, message, true); // Web WhatsApp with message
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Today's Calls List
        </Typography>

        <List>
          {todaysCalls.length > 0 ? (
            todaysCalls.map((patient, index) => (
              <React.Fragment key={patient.id}>
                {index > 0 && <Divider />}
                <ListItem
                  sx={{
                    py: 2,
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.02)'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography 
                      variant="subtitle1" 
                      onClick={() => handleNameClick(patient.clientName)}
                      sx={{ 
                        cursor: 'pointer',
                        '&:hover': {
                          color: 'primary.main',
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      {patient.clientName}
                    </Typography>
                    <Tooltip title="Send WhatsApp">
                      <IconButton 
                        size="small"
                        color="success"
                        onClick={() => handleWhatsApp(patient)}
                      >
                        <WhatsApp />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Call">
                      <IconButton 
                        color="primary"
                        onClick={() => handleCall(patient.clientName)}
                      >
                        <Phone />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="WhatsApp">
                      <IconButton 
                        color="success"
                        onClick={() => handleWhatsApp(patient)}
                      >
                        <WhatsApp />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              </React.Fragment>
            ))
          ) : (
            <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
              No patients scheduled for today
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}

export default CallList; 