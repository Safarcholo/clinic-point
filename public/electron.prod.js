const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'Clinic Point',
    icon: path.join(__dirname, 'Medicalwp-Medical-Syringe-blue.ico'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: false
    }
  });

  // Load the app
  const startUrl = `file://${path.join(app.getAppPath(), 'build/index.html')}`;
  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // For debugging
  mainWindow.webContents.openDevTools();

  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
    console.error('Start URL was:', startUrl);
    console.error('App path:', app.getAppPath());
    console.error('Current directory:', __dirname);
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle IPC messages
ipcMain.on('toMain', (event, data) => {
  // Handle messages from renderer process
}); 