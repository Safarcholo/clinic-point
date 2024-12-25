export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const isWithinWorkingHours = (date) => {
  const hours = date.getHours();
  const day = date.getDay();
  
  // Sunday-Thursday: 16:00-21:00
  if ([0,1,2,3,4].includes(day)) {
    return hours >= 16 && hours < 21;
  }
  
  // Friday: 9:00-19:00
  if (day === 5) {
    return hours >= 9 && hours < 19;
  }
  
  // Saturday: Closed
  return false;
}; 