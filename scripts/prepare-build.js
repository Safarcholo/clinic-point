const fs = require('fs-extra');
const path = require('path');

async function prepareBuild() {
  const buildDir = path.join(__dirname, '../build');
  const publicDir = path.join(__dirname, '../public');

  try {
    // Clean and ensure build directory exists
    await fs.emptyDir(buildDir);

    // Copy electron files
    await fs.copy(
      path.join(publicDir, 'electron.prod.js'),
      path.join(buildDir, 'electron.prod.js')
    );

    // Copy icon
    await fs.copy(
      path.join(publicDir, 'Medicalwp-Medical-Syringe-blue.ico'),
      path.join(buildDir, 'Medicalwp-Medical-Syringe-blue.ico')
    );

    // Copy package.json
    await fs.copy(
      path.join(__dirname, '../package.json'),
      path.join(buildDir, 'package.json')
    );

    console.log('Build preparation complete');
    
    // Log directory contents for verification
    const files = await fs.readdir(buildDir);
    console.log('Files in build directory:', files);
    
  } catch (error) {
    console.error('Error during build preparation:', error);
    process.exit(1);
  }
}

prepareBuild(); 