import Papa from 'papaparse';

export const parseVCard = (text) => {
  const lines = text.split('\n');
  const patient = {};
  
  lines.forEach(line => {
    if (line.startsWith('FN:')) patient.name = line.substring(3);
    if (line.startsWith('TEL;')) patient.phone = line.split(':')[1];
    if (line.startsWith('EMAIL:')) patient.email = line.substring(6);
    if (line.startsWith('NOTE:')) patient.notes = line.substring(5);
  });

  return patient;
};

export const handleCSVImport = (file, onAddClient) => {
  Papa.parse(file, {
    header: true,
    complete: (results) => {
      const validPatients = results.data
        .filter(patient => patient.name && patient.phone)
        .map(patient => ({
          id: Date.now() + Math.random(),
          name: patient.name,
          phone: patient.phone,
          email: patient.email || '',
          notes: patient.notes || '',
          status: 'active'
        }));

      validPatients.forEach(patient => {
        onAddClient(patient);
      });
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
    }
  });
};

export const handleVCardImport = (file, onAddClient) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;
    const vcards = text.split('BEGIN:VCARD');
    
    vcards.forEach(vcard => {
      if (!vcard.trim()) return;
      
      const patient = parseVCard(vcard);
      if (patient.name && patient.phone) {
        onAddClient({
          id: Date.now() + Math.random(),
          ...patient,
          status: 'active'
        });
      }
    });
  };
  reader.readAsText(file);
};

export const exportToCSV = (clients) => {
  const csv = Papa.unparse(clients.map(client => ({
    name: client.name,
    phone: client.phone,
    email: client.email || '',
    notes: client.notes || ''
  })));

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'patients.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportAllVCards = (clients) => {
  const allVCards = clients.map(client => {
    return [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${client.name}`,
      `TEL;TYPE=CELL:${client.phone}`,
      `EMAIL:${client.email || ''}`,
      `NOTE:${client.notes || ''}`,
      'END:VCARD'
    ].join('\n');
  }).join('\n');

  const blob = new Blob([allVCards], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'patients.vcf');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}; 