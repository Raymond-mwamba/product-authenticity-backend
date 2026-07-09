# React Native App - Running & Testing Guide

## 🚀 Getting Started

### Prerequisites
```bash
# Check Node.js
node -v        # v18+ recommended
npm -v         # v9+ recommended

# Install Expo CLI
npm install -g expo-cli

# Check installation
expo --version
```

---

## 📦 Installation Steps

### Step 1: Navigate to Frontend Directory
```bash
cd r:\3rd\ YEAR\ SEMESTER\ 2\FINAL\ YEAR\ PROJECT\ 2\FRONTEND
```

### Step 2: Install Dependencies
```bash
npm install
```

This installs all packages from `package.json`:
- React Native 0.74
- Expo 51
- Redux Toolkit
- React Navigation
- Axios
- Camera & Barcode Scanner
- And more...

**Expected Output:**
```
added 200+ packages in 2m
```

### Step 3: Verify Installation
```bash
npm list react-native
npm list expo
npm list @reduxjs/toolkit
```

Should show installed versions without errors.

---

## 💻 Running the App

### Option 1: Development Mode (Easiest)
```bash
npm start
```

**Output:**
```
Starting Expo development server...
Logs for your project will appear below. Press Ctrl+C to stop.

› Press a│ to open Android
› Press i│ to open iOS simulator
› Press w│ to open web
› Press r│ to reload
› Press m│ to toggle menu

Expo Go URL: exp://192.168.1.100:19000
```

### Option 2: Test on Android Emulator
```bash
# Requires Android Studio
npm run android
# Or press 'a' when in development mode
```

### Option 3: Test on iOS Simulator (Mac only)
```bash
npm run ios
# Or press 'i' when in development mode
```

### Option 4: Test on Web Browser
```bash
npm run web
# Or press 'w' when in development mode
```

---

## 📱 Testing on Physical Device

### Using Expo Go (Recommended)

**Step 1: Install Expo Go**
- Download from Apple App Store or Google Play Store
- Search for "Expo Go"

**Step 2: Connect to Same Network**
- Your phone and computer must be on the same WiFi

**Step 3: Scan QR Code**
```bash
npm start
# Scan QR code displayed in terminal with Expo Go app
```

**Step 4: App Opens**
- App loads in Expo Go
- Can test all features in real-time

**Step 5: Hot Reload**
- Save a file in your editor
- Changes appear instantly on device

---

## 🧪 Testing Flows

### Test 1: Barcode Scanning
```
1. npm start
2. Scan QR code with Expo Go
3. App opens on HomeScreen
4. Tap "Scan Barcode"
5. Point camera at barcode
6. Scan any barcode (UPC, Code128, etc.)
7. Should show verification result
```

**Expected Result:**
- ✅ Camera opens
- ✅ Barcode detected automatically
- ✅ Screen shows "AUTHENTIC" or "COUNTERFEIT"
- ✅ Product details displayed

### Test 2: Manual Entry
```
1. npm start
2. Scan QR code with Expo Go
3. App opens on HomeScreen
4. Tap "Enter Code Manually"
5. Type: TB-2024-001
6. Tap "Verify Product"
7. Should show result
```

**Expected Result:**
- ✅ Can type product code
- ✅ Input validation works
- ✅ Result shows with product details

### Test 3: History Viewing
```
1. npm start
2. Scan QR code with Expo Go
3. Tap "History" tab
4. Should see all verifications
5. Can search by product name
```

**Expected Result:**
- ✅ History list shows all items
- ✅ Can search and filter
- ✅ Each item shows status (green/red dot)

### Test 4: State Persistence
```
1. npm start
2. Perform a verification
3. Note the result
4. Reload app (press 'r' in terminal)
5. History tab should still show previous verifications
```

**Expected Result:**
- ✅ Redux state persisted
- ✅ History survives reload
- ✅ Can view previous verifications

### Test 5: Error Handling
```
1. npm start
2. Manual entry: Type "INVALID123"
3. Tap verify
4. Should show error message
```

**Expected Result:**
- ✅ Error message displays
- ✅ Can retry without app crashing
- ✅ Error state clears on new input

---

## 🔌 API Integration Testing

### Verify Backend is Running
```bash
# In new terminal
curl http://localhost:5000/health

# Expected response:
# {"status":"ok"}
```

### Test API Endpoint Directly
```bash
curl -X POST http://localhost:5000/api/verifications/verify \
  -H "Content-Type: application/json" \
  -d '{
    "unique_code": "TB-2024-001",
    "channel": "app"
  }'

# Expected response:
# {
#   "status": "success",
#   "data": {
#     "verification_result": "authentic",
#     "product": {...}
#   }
# }
```

### Monitor API Calls in Expo Go
1. Open Expo Go app
2. Tap your app while running
3. Shake device → "Show Developer Menu"
4. Tap "Open React Native Debugger"
5. Check Network tab for API calls

---

## 🐛 Debugging

### Console Logs
```bash
# Logs appear in terminal where you ran: npm start
npm start

# Example logs:
[INFO] Verification API called
[INFO] Response: {"status":"success"}
[ERROR] Network error: ECONNREFUSED
```

### React Native Debugger
```bash
# Install globally
npm install -g react-native-debugger

# In app developer menu, select "Debug Remote JS"
# Debugger window opens with console
```

### Redux DevTools
```javascript
// In src/redux/store.js (already configured)
const store = configureStore({
  reducer: { ... },
  devTools: true // Shows Redux state
});
```

View Redux state in debugger:
- Open React Native Debugger
- Check Redux tab
- See all state changes in real-time

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to localhost:5000"

**Cause:** Backend not running or wrong URL

**Solution:**
```bash
# Check backend running
curl http://localhost:5000/health

# If error, start backend:
cd BACKEND
npm run dev

# If still not working, check API_BASE_URL:
# File: FRONTEND/src/constants/config.js
# Should be: http://localhost:5000/api
```

### Issue: "Camera permission denied"

**Cause:** Camera permission not granted

**Solution:**
```bash
# In app, when prompted → Allow camera access
# Or: Go to phone Settings → App Permissions → Camera → Allow
```

### Issue: "Cannot find module 'expo'"

**Cause:** Dependencies not installed

**Solution:**
```bash
# Clear and reinstall
rm -r node_modules
npm install
```

### Issue: "Barcode not scanning"

**Cause:** Camera not focused or barcode too close

**Solution:**
```javascript
// Try different barcode format
// Hold barcode 10-20 cm from camera
// Keep camera steady
// Ensure good lighting
```

### Issue: "Hot reload not working"

**Cause:** Auto-reload disabled

**Solution:**
```bash
# In terminal: Press 'r' to reload
# Or save file with Ctrl+S
# Or go to phone dev menu → Enable Live Reload
```

### Issue: "App crashes on verification"

**Cause:** Unhandled error in API call

**Solution:**
```javascript
// Check console logs
// Run backend and verify it responds:
curl http://localhost:5000/api/products

// Check that database has sample data:
npm run seed  // In BACKEND folder
```

---

## 📊 Testing Checklist

- [ ] npm install completed without errors
- [ ] npm start runs successfully
- [ ] QR code displays in terminal
- [ ] Expo Go scans QR code
- [ ] App opens on phone/emulator
- [ ] Camera permission prompt appears
- [ ] HomeScreen displays with recent verifications
- [ ] "Scan Barcode" button works
- [ ] Camera opens and focuses
- [ ] Manual entry accepts input
- [ ] Search in history works
- [ ] Navigation between tabs works
- [ ] Redux state shows in debugger
- [ ] API calls appear in network tab
- [ ] No console errors
- [ ] App survives reload
- [ ] Error handling works (try invalid code)

---

## 📱 Test Data

Use these product codes to test:

| Code | Expected | Status |
|------|----------|--------|
| TB-2024-001 | Whiskey | Authentic |
| TB-2024-002 | Vodka | Authentic |
| TB-2024-003 | Rum | Authentic |
| FAKE-001 | Not in DB | Error |
| SHORT | Invalid | Error |

---

## ⚡ Performance Testing

### Measure App Load Time
```bash
# Note time when npm start shows app ready
# Then scan QR code
# Time how long until app loads
# Should be < 5 seconds
```

### Test Verification Speed
```bash
# Manual entry with timer
# Type code → Tap verify
# Result should appear in < 2 seconds
# (Depends on network speed)
```

### Test History Load Time
```bash
# Tap History tab
# List of 10-50 items should load quickly
# Scroll should be smooth
```

---

## 📸 Screenshots & Recordings

### Take Screenshot in Expo Go
```bash
# Android: Press volume up + volume down
# iOS: Press home + power button
```

### Record Video in Emulator
```bash
# Android Studio emulator: Menu → Extended Controls → Recording
```

---

## 🚢 Preparing for Production

### Before Deployment

1. **Build Standalone App**
```bash
expo build:android -t apk
# or
expo build:ios -t archive
```

2. **Check Performance**
- Test on low-end phone
- Test on slow network (throttle in dev tools)
- Monitor memory usage

3. **Security**
- Hide API keys from frontend code
- Use environment variables
- Validate all inputs
- Use HTTPS in production

4. **Testing**
- Run full test suite
- Test on different devices
- Test different Android/iOS versions
- Test offline scenarios

---

## 📝 Logging Best Practices

### Add Debug Logs
```javascript
// Before API call
console.log('🔍 Verifying product:', code);

// After success
console.log('✅ Product verified:', result);

// On error
console.error('❌ Verification failed:', error);
```

### Disable Logs in Production
```javascript
if (__DEV__) {
  console.log('Debug: ', data);
}
```

---

## 🤝 Common Development Tasks

### Modify Button Color
```javascript
// File: src/constants/theme.js
const COLORS = {
  primary: '#FF5722', // Change to desired color
  success: '#4CAF50',
  danger: '#F44336',
};
```

### Add New Screen
```bash
# 1. Create file: src/screens/NewScreen.js
# 2. Add navigation in src/navigation/RootNavigator.js
# 3. Add navigation action in other screens
```

### Update API Endpoint
```javascript
// File: src/constants/config.js
export const ENDPOINTS = {
  NEW_ENDPOINT: '/new/path',
};

// Then use in service:
const response = await apiClient.get(ENDPOINTS.NEW_ENDPOINT);
```

### Modify Theme
```javascript
// File: src/constants/theme.js
export const SIZES = {
  xs: 4,    // Small gap
  sm: 8,    // Small padding
  md: 16,   // Medium padding
  lg: 24,   // Large padding
  xl: 32,   // Extra large
};
```

---

## 🎓 Learning Resources

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation Guide](https://reactnavigation.org/docs/getting-started)
- [Redux Toolkit Tutorial](https://redux-toolkit.js.org/tutorials/basic-tutorial)
- [Axios Documentation](https://axios-http.com/docs/intro)

---

## 📞 Quick Command Reference

```bash
# Start development
npm start

# Install dependencies
npm install

# Run tests
npm test

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on web
npm run web

# Lint code
npm run lint

# Format code
npm run format

# Build for production
expo build:android
expo build:ios
```

---

## 🎯 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start development: `npm start`
3. ✅ Test barcode scanning
4. ✅ Test manual entry
5. ✅ Review code in src/screens
6. ✅ Modify theme colors
7. ✅ Deploy to production

**The app is ready to use and deploy!**
