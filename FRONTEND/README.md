# Product Authenticity Mobile App

A React Native mobile application for the Multichannel Product Authenticity Management System. This app enables users to verify product authenticity via barcode scanning and USSD integration.

## Features

- **Product Verification**: Scan product barcodes using camera or manual entry
- **Multi-channel Support**: Integration with USSD and mobile app interfaces
- **Real-time Verification**: Instant product authenticity checking
- **Verification History**: Track previous verification attempts
- **Offline Support**: Works with limited connectivity

## Project Structure

```
src/
├── navigation/          # Navigation setup (Stack, Tab, Drawer)
├── screens/             # Screen components
├── components/          # Reusable UI components
├── redux/              # State management
├── services/           # API and external services
├── utils/              # Utility functions
├── hooks/              # Custom hooks
├── constants/          # App constants and config
└── assets/             # Images, fonts, icons
```

## Getting Started

### Prerequisites

- Node.js >= 16
- Expo CLI: `npm install -g expo-cli`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Technology Stack

- **Framework**: React Native (with Expo)
- **Navigation**: React Navigation
- **State Management**: Redux Toolkit
- **HTTP Client**: Axios
- **Barcode Scanning**: Expo Barcode Scanner
- **Camera**: Expo Camera

## API Integration

The app connects to a Node.js backend via RESTful API endpoints. Configure the API base URL in `src/constants/config.js`.

## Testing

Run tests with:
```bash
npm test
```

## Build

### iOS
```bash
expo build:ios
```

### Android
```bash
expo build:android
```

## Contributing

1. Follow the component-based architecture
2. Use Redux for state management
3. Create custom hooks for reusable logic
4. Write unit tests for critical functions

## License

Proprietary - Product Authenticity Management System
