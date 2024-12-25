export const generateFollowUpMessage = (appointment) => {
  const treatmentFollowUps = {
    'Botox Treatment': 14, // days
    'Dermal Fillers': 30,
    'Consultation': 7
  };

  const followUpDate = new Date(appointment.date);
  followUpDate.setDate(followUpDate.getDate() + treatmentFollowUps[appointment.treatment]);

  return {
    clientName: appointment.clientName,
    suggestedDate: followUpDate,
    message: `Hello ${appointment.clientName}! It's time for your follow-up appointment for ${appointment.treatment}.`
  };
}; 