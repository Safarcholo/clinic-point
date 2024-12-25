export const WhatsAppConfig = {
  businessPhone: "+972547806590",
  templates: {
    appointmentReminder: (patientName, time) => 
      `Hello ${patientName}! This is a reminder about your appointment today at ${time}.`,
    confirmationRequest: (patientName, time) =>
      `Hello ${patientName}! Please confirm your appointment for ${time}.`,
    cancellation: (patientName) =>
      `Hello ${patientName}! We noticed you cancelled your appointment. Would you like to reschedule?`,
    generalMessage: (patientName) =>
      `Hello ${patientName}! This is a message from your clinic. How can we assist you today?`,
    scheduleRequest: (patientName) =>
      `Hello ${patientName}! Would you like to schedule your next appointment with us?`
  }
};

export const sendWhatsAppMessage = (phoneNumber, message, useWeb = false) => {
  try {
    if (!phoneNumber) {
      throw new Error('Phone number is required');
    }

    let cleanPhoneNumber = phoneNumber.toString().replace(/[^0-9]/g, '');
    
    if (!cleanPhoneNumber) {
      throw new Error('Invalid phone number');
    }
    
    if (cleanPhoneNumber.startsWith('0')) {
      cleanPhoneNumber = '972' + cleanPhoneNumber.substring(1);
    } else if (!cleanPhoneNumber.startsWith('972')) {
      cleanPhoneNumber = '972' + cleanPhoneNumber;
    }

    // Use the API URL format which tends to bring the app to foreground
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneNumber}${message ? `&text=${encodeURIComponent(message)}` : ''}`;

    // Check if we're in Electron
    if (window.require) {
      const { shell } = window.require('electron');
      shell.openExternal(whatsappUrl, { activate: true });
    } else {
      window.open(whatsappUrl, '_blank');
    }
  } catch (error) {
    console.error('WhatsApp error:', error);
    alert('Invalid phone number or unable to open WhatsApp');
  }
}; 