export const generateVCard = (patient) => {
  const vcard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${patient.name}`,
    `TEL;TYPE=CELL:${patient.phone}`,
    `EMAIL:${patient.email || ''}`,
    `NOTE:${patient.notes || ''}`,
    'END:VCARD'
  ].join('\n');

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${patient.name}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}; 