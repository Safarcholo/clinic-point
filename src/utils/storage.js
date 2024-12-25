const STORAGE_KEYS = {
  CLIENTS: 'clinic_clients',
  APPOINTMENTS: 'clinic_appointments',
  WAITING_LIST: 'clinic_waiting_list',
  LAST_BACKUP: 'clinic_last_backup'
};

export const saveToLocalStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const loadFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return null;
  }
};

export const createBackup = () => {
  try {
    const backup = {
      clients: loadFromLocalStorage(STORAGE_KEYS.CLIENTS),
      appointments: loadFromLocalStorage(STORAGE_KEYS.APPOINTMENTS),
      waitingList: loadFromLocalStorage(STORAGE_KEYS.WAITING_LIST),
      timestamp: new Date().toISOString()
    };

    // Create backup file
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `clinic-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Save backup timestamp
    saveToLocalStorage(STORAGE_KEYS.LAST_BACKUP, backup.timestamp);
    return true;
  } catch (error) {
    console.error('Error creating backup:', error);
    return false;
  }
};

export const restoreFromBackup = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target.result);
        
        if (backup.clients) saveToLocalStorage(STORAGE_KEYS.CLIENTS, backup.clients);
        if (backup.appointments) saveToLocalStorage(STORAGE_KEYS.APPOINTMENTS, backup.appointments);
        if (backup.waitingList) saveToLocalStorage(STORAGE_KEYS.WAITING_LIST, backup.waitingList);
        
        resolve(backup);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export { STORAGE_KEYS }; 