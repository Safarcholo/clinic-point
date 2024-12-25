const fs = require('fs');
const path = require('path');

// Copy electron.prod.js and preload.prod.js to build directory
const files = ['electron.prod.js', 'preload.prod.js'];
const sourceDir = path.join(__dirname, '../public');
const targetDir = path.join(__dirname, '../build');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir);
}

files.forEach(file => {
  fs.copyFileSync(
    path.join(sourceDir, file),
    path.join(targetDir, file)
  );
});

console.log('Electron files copied to build directory'); 