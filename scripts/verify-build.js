const fs = require('fs');
const path = require('path');

function verifyBuild() {
  const buildPath = path.join(__dirname, '../build');
  const requiredFiles = ['index.html', 'static/js', 'static/css'];
  
  console.log('Verifying build...');

  // Check if build directory exists
  if (!fs.existsSync(buildPath)) {
    throw new Error('Build directory not found!');
  }

  // Check for required files
  requiredFiles.forEach(file => {
    const filePath = path.join(buildPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file/directory not found: ${file}`);
    }
  });

  console.log('Build verification successful!');
}

verifyBuild(); 