import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Chip,
  Tooltip,
  Divider
} from '@mui/material';
import {
  AccessTime as ClockIcon,
  Person as PersonIcon,
  WhatsApp as WhatsAppIcon,
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

function WaitingList({ waitingList = [], onStartTreatment, onRemove, onWhatsApp }) {
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2,
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <ClockIcon color="primary" />
        Waiting List
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {waitingList.length === 0 ? (
        <Typography color="text.secondary" align="center">
          No patients waiting
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
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <ClockIcon fontSize="small" />
                    Added at: {format(new Date(patient.addedAt), 'HH:mm')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Send WhatsApp">
                    <IconButton 
                      size="small" 
                      color="primary"
                      onClick={() => onWhatsApp(patient)}
                    >
                      <WhatsAppIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Start Treatment">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<CheckIcon />}
                      onClick={() => onStartTreatment(patient)}
                    >
                      Start
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default WaitingList; 