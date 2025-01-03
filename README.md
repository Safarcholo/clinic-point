# Clinic Point

A comprehensive medical clinic management desktop application built with React and Electron, designed to streamline clinic operations and patient management.

## 🚀 Features

### 📊 Dashboard & Management
- **Interactive Dashboard**
  - Real-time clinic overview
  - Key performance metrics
  - Activity monitoring

- **Patient Management**
  - Detailed patient records
  - Treatment history tracking
  - Quick appointment scheduling
  - Comprehensive patient lists
  - CSV data import capabilities

### 📅 Scheduling & Appointments
- **Advanced Calendar System**
  - FullCalendar integration
  - Day and time grid views
  - Drag-and-drop scheduling
  - Quick appointment creation

- **Appointment Management**
  - Today's appointments view
  - Waiting list management
  - Call list tracking
  - WhatsApp integration for communications

### 👥 CRM & Patient Care
- **Customer Relationship Management**
  - Patient interaction tracking
  - Treatment planning
  - Follow-up management
  - Communication history

### 🏥 Clinical Operations
- **Treatment Management**
  - Treatment plans
  - Procedure tracking
  - Medical history records
  - Progress monitoring

## 🎯 Project Structure

```
src/
├── components/
│   ├── Banner/           # Application banner and notifications
│   ├── Calendar/         # Calendar and scheduling components
│   ├── CallList/         # Patient call tracking
│   ├── common/           # Shared UI components
│   ├── CRM/             # Customer relationship management
│   ├── CSVImport/        # Data import functionality
│   ├── Dashboard/        # Main dashboard views
│   ├── layout/          # Application layout components
│   ├── Login/           # Authentication components
│   ├── PatientDetails/  # Patient information display
│   ├── PatientList/     # Patient directory
│   ├── QuickAppointment/# Fast appointment creation
│   ├── TodayAppointments/# Current day schedule
│   ├── Treatments/      # Medical procedures management
│   ├── WaitingList/     # Queue management
│   └── WhatsApp/        # WhatsApp integration
├── pages/               # Main application pages
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── contexts/           # React contexts
└── electron/           # Electron configuration
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Desktop Framework**: Electron
- **UI Libraries**: 
  - Material-UI (MUI)
  - Tailwind CSS
  - HeadlessUI
- **Calendar & Date Management**: 
  - FullCalendar
  - Date-fns
  - MUI Date Pickers
- **Data Management**: 
  - Axios for API requests
  - Papa Parse for CSV processing
- **Performance Optimization**: 
  - React Window for virtualization
  - React Virtualized Auto Sizer
  - Error Boundary implementation

## 📋 Coding Best Practices

### Component Organization
- **Modular Structure**: Each component is organized in its own directory
- **Single Responsibility**: Components are focused on specific functionality
- **Reusable Components**: Common elements are extracted into the `common` directory
- **Separation of Concerns**: Business logic is separated from UI components

### Code Quality
- **Small, Focused Files**: Components are broken down into manageable sizes
- **Clear Naming**: Descriptive names for components and functions
- **Consistent Structure**: Standard organization across all components
- **Performance Optimization**: Implemented virtualization for large lists

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repository-url]
   cd clinic-point
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Development Mode**
   ```bash
   # Run in development mode with hot reload
   npm run electron-dev
   ```

4. **Building the Application**
   ```bash
   # Build for Windows
   npm run build:win

   # Build portable version
   npm run build:win-portable
   ```

## 📦 Build Output

The built application will be available in the `dist` directory with the following characteristics:
- Application Name: Clinic Point
- File Format: NSIS installer (Windows)
- Architecture: 64-bit
- Custom application icon included

## 🔧 Available Scripts

- `npm start` - Start React development server
- `npm run electron-dev` - Start development with Electron
- `npm run build` - Build React application
- `npm run build:win` - Build Windows installer
- `npm run build:win-portable` - Build portable Windows executable
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App

## 🔒 Security

- ASAR packaging enabled for code protection
- Selective file unpacking for critical resources
- Proper electron-builder configuration for secure distribution

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software. All rights reserved.

## 💡 Support

For support, please contact the development team or raise an issue in the project repository.

---

Built with ❤️ using React and Electron#   c l i n i c - p o i n t  
 