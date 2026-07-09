# React Native App - Quick Reference Card

**Print this page for quick reference while developing!**

---

## 🎯 Core Concepts at a Glance

### User Journey
```
User Opens App
    ↓
HomeScreen (shows recent verifications)
    ↓
Choose: Scan | Manual | History
    ↓
If Scan: Camera opens → Detect barcode → Submit
If Manual: Type code → Submit
If History: View all verifications
    ↓
ResultScreen (show authentic/counterfeit)
    ↓
Back to Home or History
```

---

## 📁 File Organization

```
/src
├── /screens (5 files)              # Full-page components
│   ├── HomeScreen.js              # Dashboard
│   ├── ScanScreen.js              # Barcode camera
│   ├── ManualEntryScreen.js       # Text input
│   ├── ResultScreen.js            # Show result
│   └── HistoryScreen.js           # List all
│
├── /components (4 files)           # Reusable UI
│   ├── Button.js                  # Primary/Secondary
│   ├── BarcodeInput.js            # Input field
│   ├── VerificationResultCard.js  # Card display
│   └── LoadingSpinner.js          # Loading indicator
│
├── /redux (3 files)               # State management
│   ├── store.js                   # Redux store
│   ├── verificationSlice.js       # History state
│   └── productSlice.js            # Current product state
│
├── /services (2 files)            # API calls
│   ├── apiClient.js               # Axios setup
│   └── verificationService.js     # API functions
│
├── /hooks (2 files)               # Custom logic
│   ├── useCameraPermission.js     # Camera permission
│   └── useProductVerification.js  # Verification logic
│
├── /constants (3 files)           # Configuration
│   ├── config.js                  # API URLs
│   ├── theme.js                   # Colors/sizes
│   └── screenNames.js             # Screen names
│
├── /utils (2 files)               # Helpers
│   ├── helpers.js                 # Utility functions
│   └── hoc.js                     # Higher-order components
│
├── /navigation (1 file)
│   └── RootNavigator.js           # Tab + Stack nav
│
└── App.js                         # Main entry point
```

---

## 🎨 Theme Colors

```javascript
// src/constants/theme.js
primary: '#1E88E5'          // Blue - Primary actions
success: '#43A047'          // Green - Authentic
danger: '#E53935'           // Red - Counterfeit
warning: '#FB8C00'          // Orange - Uncertain
background: '#F5F5F5'       // Light gray bg
surface: '#FFFFFF'          // White cards
text: '#212121'             // Dark text
textSecondary: '#757575'    // Gray text
border: '#E0E0E0'           // Light gray border
```

---

## 📱 Navigation Structure

```
RootNavigator (TabNavigator)
├─ HomeTab (StackNavigator)
│  ├─ HomeScreen
│  └─ ResultScreen
│
├─ ScanTab (StackNavigator)
│  ├─ ScanScreen
│  └─ ResultScreen
│
├─ ManualTab (StackNavigator)
│  ├─ ManualEntryScreen
│  └─ ResultScreen
│
└─ HistoryTab (StackNavigator)
   └─ HistoryScreen
```

---

## 🔄 Data Flow

```
Component
  ↓
useProductVerification hook
  ↓
verificationService.verifyProduct()
  ↓
apiClient.post('/verifications/verify')
  ↓
Backend API
  ↓
Database
  ↓
Response back with: { product, isAuthentic, time }
  ↓
Redux dispatch(verifyProductSuccess(data))
  ↓
Component re-renders with new data
```

---

## 🧠 Redux State Structure

```javascript
{
  verification: {
    verifications: [      // Array of all verifications
      { id, product, verification_result, time, channel },
      ...
    ],
    loading: false,       // API loading state
    error: null          // Error message if failed
  },
  product: {
    currentProduct: {     // Currently verified product
      id, name, unique_code, manufacturer_name
    },
    isAuthentic: true,    // Boolean result
    verificationTime: "2024-06-06T10:30:45Z",
    loading: false,       // API loading
    error: null          // Error message
  }
}
```

---

## 🔗 Redux Actions

### Verification Slice
```javascript
fetchVerificationsStart()
fetchVerificationsSuccess(verifications)
fetchVerificationsFailure(error)
addVerification(verification)
clearAllVerifications()
```

### Product Slice
```javascript
verifyProductStart()
verifyProductSuccess({ currentProduct, isAuthentic, verificationTime })
verifyProductFailure(error)
resetProduct()
```

---

## 📡 API Endpoints

```javascript
// Base URL
http://localhost:5000/api

// Endpoints used by frontend
POST   /verifications/verify       // Verify product
GET    /verifications              // Get all verifications
GET    /verifications/:id          // Get one verification
GET    /products/search            // Search products
GET    /verifications/stats/overview // Get statistics
```

---

## ⚙️ Component Props

### PrimaryButton
```javascript
<PrimaryButton
  title="Verify"           // Button text
  onPress={() => {}}       // Tap handler
  disabled={false}         // Disable state
  loading={false}          // Show spinner
  style={{}}               // Additional styles
/>
```

### VerificationResultCard
```javascript
<VerificationResultCard
  verification={{
    id: 1,
    product: { name, manufacturer_name, unique_code },
    verification_result: "authentic",
    verification_time: "ISO timestamp",
    channel: "app"
  }}
  onPress={() => {}}       // Tap handler (optional)
/>
```

### LoadingSpinner
```javascript
<LoadingSpinner
  size="large"             // 'small' or 'large'
  color="#1E88E5"         // Color hex
/>
```

---

## 🪝 Custom Hooks Usage

### useCameraPermission
```javascript
const { hasPermission, loading } = useCameraPermission();

if (!hasPermission) return <Text>Permission denied</Text>;
if (loading) return <LoadingSpinner />;
```

### useProductVerification
```javascript
const { verifyProduct, verifying } = useProductVerification();

await verifyProduct(code, 'app');
// Updates Redux store automatically
```

---

## 🔧 Common Code Patterns

### Get Redux State
```javascript
const product = useSelector(state => state.product.currentProduct);
const verifications = useSelector(state => state.verification.verifications);
```

### Dispatch Redux Action
```javascript
const dispatch = useDispatch();
dispatch(verifyProductSuccess(data));
dispatch(resetProduct());
```

### Navigate Between Screens
```javascript
const navigation = useNavigation();
navigation.navigate('ScanTab');
navigation.navigate('ResultStack', { screen: 'Result' });
navigation.goBack();
```

### Make API Call
```javascript
const result = await verificationService.verifyProduct('TB-2024-001');
const products = await verificationService.searchProducts('whiskey');
```

---

## 🚀 Running Commands

```bash
# Install dependencies
npm install

# Start development (choose platform)
npm start

# Start on Android
npm run android

# Start on iOS
npm run ios

# Start on web
npm run web

# Run tests
npm test

# Lint code
npm run lint

# Build for production
expo build:android
expo build:ios
```

---

## 🐛 Quick Debugging

### Check Console Logs
```bash
npm start
# Logs appear in terminal
```

### View Redux State
```
npm start → Open React Native Debugger → Redux tab
```

### Test API Directly
```bash
curl -X POST http://localhost:5000/api/verifications/verify \
  -H "Content-Type: application/json" \
  -d '{"unique_code":"TB-2024-001","channel":"app"}'
```

### Check Network Calls
```
Expo Go → Developer Menu → "Debug Remote JS" → Network tab
```

---

## ⚠️ Common Errors & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| Cannot connect to localhost:5000 | Backend not running | `cd BACKEND && npm run dev` |
| Camera permission denied | Permission not granted | Allow in phone settings |
| Barcode not detected | Camera not focused | Hold 10-20cm away, good light |
| Cannot find module 'expo' | Dependencies missing | `npm install` |
| App crashes on verify | Backend error | Check backend logs, test API |
| Hot reload not working | Auto-reload disabled | Press 'r' in terminal |

---

## 📝 File Naming Conventions

```
Screens:           NameScreen.js
Components:        NameComponent.js (or just Name.js)
Hooks:            use[Name]Hook.js (or useNameHook.js)
Services:         nameService.js
Constants:        name.js
Redux:            nameSlice.js
Utils:            helpers.js, hoc.js
```

---

## 🎯 Development Workflow

```
1. Make code change
   ↓
2. Save file (Ctrl+S)
   ↓
3. Hot reload (auto or press 'r')
   ↓
4. Check app on phone/emulator
   ↓
5. Check console for errors
   ↓
6. If error: Fix code → goto 1
   ↓
7. If working: Move to next feature
```

---

## 📊 Performance Tips

- Use FlatList for long lists (not ScrollView)
- Memoize expensive computations
- Use Redux for shared state (not prop drilling)
- Keep components small and focused
- Use const instead of let for performance
- Remove unused imports
- Profile app with React Native Debugger

---

## 🔒 Security Checklist

- [ ] No API keys in frontend code
- [ ] Use environment variables for sensitive data
- [ ] Validate all user inputs
- [ ] Sanitize data before display
- [ ] Use HTTPS in production
- [ ] Don't store sensitive data in AsyncStorage
- [ ] Update dependencies regularly

---

## 📚 Documentation Map

| Need | Document | Section |
|------|----------|---------|
| Overview | REACT_NATIVE_GUIDE.md | Overview |
| Setup | RUNNING_AND_TESTING_GUIDE.md | Installation |
| Code examples | COMPONENT_ARCHITECTURE_GUIDE.md | Screens |
| Troubleshooting | RUNNING_AND_TESTING_GUIDE.md | Troubleshooting |
| Testing | RUNNING_AND_TESTING_GUIDE.md | Testing Flows |
| Deployment | RUNNING_AND_TESTING_GUIDE.md | Production |

---

## 💡 Pro Tips

✅ Always check backend is running before testing
✅ Use sample data (TB-2024-001) for testing
✅ Keep Redux DevTools open while developing
✅ Test on real device, not just simulator
✅ Read console logs before asking for help
✅ Use Expo Go app for quick testing
✅ Keep components under 300 lines
✅ Use meaningful variable names
✅ Comment complex logic
✅ Test error scenarios, not just happy path

---

## 🚀 Deployment Checklist

- [ ] All tests passing
- [ ] No console errors
- [ ] API endpoints verified
- [ ] Environment variables configured
- [ ] App version bumped
- [ ] Build tested on real device
- [ ] Performance acceptable
- [ ] Error handling complete
- [ ] Documentation updated
- [ ] Ready for production

---

**Print this card and keep it on your desk while developing!**
