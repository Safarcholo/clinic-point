import React, { useRef, useState } from 'react';
import { FaFileUpload } from 'react-icons/fa';
import Papa from 'papaparse';

function CSVImport({ onImport }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setError('');

    if (file) {
      console.log('File selected:', file.name);

      Papa.parse(file, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('Raw CSV data:', results.data);

          const patients = results.data
            .slice(1)
            .filter(row => {
              return row.length >= 2 && row[0].trim() && row[1].trim();
            })
            .map(row => ({
              id: Date.now() + Math.random(),
              name: row[0].trim(),
              phone: row[1].trim(),
              email: '',
              dateOfBirth: '',
              notes: '',
              createdAt: new Date().toISOString(),
              status: 'active',
              treatmentHistory: []
            }));

          console.log('Processed patients:', patients);

          if (patients.length === 0) {
            setError('No valid patients found in the CSV file. Please check the format.');
            return;
          }

          onImport(patients);
          
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          setError(`Error parsing CSV file: ${error.message}`);
        }
      });
    }
  };

  return (
    <div className="csv-import">
      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="csv-upload" 
          className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FaFileUpload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV file with patient contacts</p>
            {error && (
              <p className="text-red-500 text-xs mt-2">{error}</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            id="csv-upload"
            type="file"
            accept=".csv"
            className="hidden"
            onChange={handleFileUpload}
          />
        </label>
      </div>
      
      <div className="mt-4">
        <h4 className="text-sm font-semibold mb-2">Expected CSV Format:</h4>
        <p className="text-xs text-gray-500 mb-2">
          Simple two-column format (name, phone):
        </p>
        <pre className="text-xs bg-gray-50 p-2 rounded">
          Name,Phone{'\n'}
          John Doe,+1234567890{'\n'}
          Jane Smith,+0987654321
        </pre>
      </div>
    </div>
  );
}

export default CSVImport; 