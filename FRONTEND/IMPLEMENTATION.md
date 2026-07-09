# React Native Frontend - Product Authenticity System

## Quick Start

### Installation
```bash
npm install
```

### Development
```bash
npm start
```

### Testing
```bash
npm test
```

## Project Structure

### `/src`
- **`navigation/`** - App navigation setup
- **`screens/`** - Screen components (Home, Scan, History, Result, ManualEntry)
- **`components/`** - Reusable UI components (Button, Card, Input, Spinner)
- **`redux/`** - Redux store, slices for state management
- **`services/`** - API client and service functions
- **`hooks/`** - Custom React hooks
- **`constants/`** - Theme, config, constants
- **`utils/`** - Helper functions and utilities

## Features

### ✅ Implemented (Objective 2)
- Component-based architecture
- Tab navigation (Home, History)
- Stack navigation (multiple screens)
- Barcode scanner integration (Expo)
- Manual product code entry
- Verification result display
- Verification history tracking
- Redux state management
- REST API integration setup
- Custom hooks for reusable logic
- Responsive UI with theme system

## API Integration

The app connects to a backend API running on `http://localhost:5000/api`.

### Expected API Endpoints
- `POST /api/verifications/verify` - Verify product
- `GET /api/verifications` - Get history
- `GET /api/products/:id` - Get product details

Configure the base URL in `src/constants/config.js`.

## Next Steps (Objective 3)

1. Build backend Node.js/Express server
2. Implement RESTful API endpoints
3. Create database integration layer
4. Deploy USSD gateway integration

## Building for Distribution

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

## Troubleshooting

### Camera Permission Error
- Ensure permissions are granted in app settings
- Check `expo-camera` plugin configuration

### API Connection Issues
- Verify backend server is running
- Check network configuration
- Update `API_BASE_URL` if needed

## Technologies

- React Native 0.74
- Expo 51
- Redux Toolkit
- React Navigation
- Axios
- Expo Barcode Scanner
- Expo Camera
