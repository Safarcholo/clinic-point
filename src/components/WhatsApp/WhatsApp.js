import React from 'react';
import { Box, Paper, Button, Typography } from '@mui/material';
import { WhatsApp as WhatsAppIcon } from '@mui/icons-material';

function WhatsApp() {
  const openWhatsAppWeb = () => {
    window.open('https://web.whatsapp.com', '_blank');
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', p: 3 }}>
      <Paper 
        elevation={3} 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3
        }}
      >
        <WhatsAppIcon sx={{ fontSize: 60, color: '#25D366' }} />
        <Typography variant="h5" gutterBottom>
          Open WhatsApp Web
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Click the button below to open WhatsApp Web in a new tab
        </Typography>
        <Button
          variant="contained"
          startIcon={<WhatsAppIcon />}
          onClick={openWhatsAppWeb}
          sx={{ 
            bgcolor: '#25D366',
            '&:hover': {
              bgcolor: '#128C7E'
            }
          }}
        >
          Launch WhatsApp Web
        </Button>
      </Paper>
    </Box>
  );
}

export default WhatsApp; 