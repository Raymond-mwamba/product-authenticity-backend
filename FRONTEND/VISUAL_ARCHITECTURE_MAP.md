# React Native App - Visual Architecture Map

**Print this for your wall!**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     REACT NATIVE APP                        │
│                  (33 files, 3000+ lines)                    │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              USER INTERFACE (Screens)                │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────────┐   │  │
│  │  │  Home  │ │ Scan   │ │ Manual │ │  Result    │   │  │
│  │  │Screen  │ │Screen  │ │Screen  │ │  Screen    │   │  │
│  │  └────────┘ └────────┘ └────────┘ └────────────┘   │  │
│  │  ┌──────────────────────────────────────────────┐   │  │
│  │  │       HistoryScreen (List all)               │   │  │
│  │  └──────────────────────────────────────────────┘   │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │ uses                                  │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │         REUSABLE COMPONENTS (4 components)          │  │
│  │  ┌─────────┐ ┌──────────┐ ┌──────┐ ┌────────────┐  │  │
│  │  │ Button  │ │BarCode   │ │Card  │ │  Spinner   │  │  │
│  │  │         │ │Input     │ │      │ │            │  │  │
│  │  └─────────┘ └──────────┘ └──────┘ └────────────┘  │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │ manages                               │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │      REDUX STATE MANAGEMENT (Global Store)          │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ verification { items[], loading, error }      │ │  │
│  │  │ product { current, isAuth, time, loading }    │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │ calls                                 │
│  ┌──────────────────▼───────────────────────────────────┐  │
│  │       API SERVICES (HTTP Communication)             │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ verificationService()                         │ │  │
│  │  │ - verifyProduct()                             │ │  │
│  │  │ - getVerifications()                          │ │  │
│  │  │ - searchProducts()                            │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  │  ┌────────────────────────────────────────────────┐ │  │
│  │  │ apiClient (Axios with interceptors)           │ │  │
│  │  │ - Request interceptor                         │ │  │
│  │  │ - Response interceptor                        │ │  │
│  │  │ - Error handler                               │ │  │
│  │  └────────────────────────────────────────────────┘ │  │
│  └──────────────────┬───────────────────────────────────┘  │
│                     │ HTTP requests                         │
│                     │ (REST API)                            │
├─────────────────────▼───────────────────────────────────────┤
│                                                               │
│                   BACKEND API (Node.js)                      │
│              (12 endpoints, 3-tier architecture)             │
│                                                               │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│                  DATABASE (MySQL)                            │
│            (manufacturers, products, verifications)          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagram

```
USER ACTION
    │
    ├─ Scan Barcode → ScanScreen
    ├─ Manual Entry → ManualEntryScreen  
    └─ View History → HistoryScreen
        │
        ▼
    useProductVerification Hook
    (or Redux selector)
        │
        ▼
    verificationService.verifyProduct()
    or
    verificationService.getVerifications()
        │
        ▼
    apiClient.post/get()
    (HTTP request to backend)
        │
        ▼
    BACKEND API
    (http://localhost:5000/api)
        │
        ▼
    MYSQL DATABASE
    (Execute query)
        │
        ▼
    Response with data
    { product, isAuthentic, time }
        │
        ▼
    apiClient interceptor
    (Parse response)
        │
        ▼
    Redux dispatch()
    (Update global state)
        │
        ▼
    Component selector
    (Connect to state)
        │
        ▼
    UI Re-renders
    (Show result to user)
```

---

## 📁 File Tree

```
FRONTEND
├── src/
│   ├── screens/                          ← USER INTERFACE
│   │   ├── HomeScreen.js                 (dashboard)
│   │   ├── ScanScreen.js                 (camera)
│   │   ├── ManualEntryScreen.js          (input)
│   │   ├── ResultScreen.js               (result)
│   │   └── HistoryScreen.js              (list)
│   │
│   ├── components/                       ← REUSABLE UI
│   │   ├── Button.js                     (Primary/Secondary)
│   │   ├── BarcodeInput.js               (input+button)
│   │   ├── VerificationResultCard.js     (card)
│   │   └── LoadingSpinner.js             (spinner)
│   │
│   ├── redux/                            ← STATE
│   │   ├── store.js                      (configure store)
│   │   ├── verificationSlice.js          (history state)
│   │   └── productSlice.js               (product state)
│   │
│   ├── services/                         ← API
│   │   ├── apiClient.js                  (axios setup)
│   │   └── verificationService.js        (API functions)
│   │
│   ├── hooks/                            ← LOGIC
│   │   ├── useCameraPermission.js        (camera)
│   │   └── useProductVerification.js     (verify)
│   │
│   ├── constants/                        ← CONFIG
│   │   ├── config.js                     (API URL)
│   │   ├── theme.js                      (colors)
│   │   └── screenNames.js                (names)
│   │
│   ├── utils/                            ← HELPERS
│   │   ├── helpers.js                    (functions)
│   │   └── hoc.js                        (HOCs)
│   │
│   ├── navigation/                       ← ROUTING
│   │   └── RootNavigator.js              (tabs+stacks)
│   │
│   └── App.js                            ← ENTRY
│
├── Documentation/                        ← GUIDES (6 files)
│   ├── REACT_NATIVE_GUIDE.md             (2000+ lines)
│   ├── COMPONENT_ARCHITECTURE_GUIDE.md   (1500+ lines)
│   ├── RUNNING_AND_TESTING_GUIDE.md      (1200+ lines)
│   ├── DOCUMENTATION_INDEX.md            (index)
│   ├── QUICK_REFERENCE_CARD.md           (quick lookup)
│   └── COMPREHENSIVE_SUMMARY.md          (summary)
│
├── Configuration/
│   ├── App.js                            (main entry)
│   ├── app.json                          (expo config)
│   ├── package.json                      (dependencies)
│   └── babel.config.js                   (transpiler)
│
└── Assets/
    ├── images/
    └── icons/
```

---

## 🔄 Navigation Structure

```
TabNavigator (Bottom Tabs)
├──────────────────────────────────────┐
│                                      │
▼                                      ▼
HomeTab                         HistoryTab
│                                 │
└─ StackNavigator                └─ StackNavigator
   │                               │
   ├─ HomeScreen                   └─ HistoryScreen
   │  └─ [Actions]
   │     ├─ ResultScreen
   │     ├─ ScanScreen
   │     └─ ManualScreen
   │
   └─ ScanTab / ManualTab
      └─ StackNavigator
         ├─ ScanScreen / ManualScreen
         └─ ResultScreen

Behavior:
- Swipe between tabs
- Stack navigation within tab
- Back button works correctly
- Deep linking ready
```

---

## 🎯 Redux Flow Diagram

```
┌─────────────────────────────────────┐
│         Component (Screen)          │
│  Shows: currentProduct, isAuthentic │
└─────────┬───────────────────────────┘
          │
          │ useDispatch()
          │ dispatch(action)
          ▼
┌─────────────────────────────────────┐
│      Redux Middleware/Thunks        │
│   useProductVerification Hook       │
│  - Call verifyProduct()             │
│  - Handle errors                    │
│  - Dispatch result actions          │
└─────────┬───────────────────────────┘
          │
          │ dispatch()
          ▼
┌─────────────────────────────────────┐
│        Product Slice Reducer        │
│  productSlice.verifyProductSuccess()│
│  productSlice.verifyProductFailure()│
│  productSlice.resetProduct()        │
└─────────┬───────────────────────────┘
          │
          │ state update
          ▼
┌─────────────────────────────────────┐
│         Redux Store                 │
│ state = {                           │
│   product: {                        │
│     currentProduct,                 │
│     isAuthentic,                    │
│     verificationTime,               │
│     loading,                        │
│     error                           │
│   },                                │
│   verification: { ... }             │
│ }                                   │
└─────────┬───────────────────────────┘
          │
          │ useSelector()
          ▼
┌─────────────────────────────────────┐
│         Component (Screen)          │
│      Re-renders with new data       │
│         Shows result to user        │
└─────────────────────────────────────┘
```

---

## 🔌 API Request Flow

```
Component
  │
  ├─ userTaps("Verify")
  │
  ▼
useProductVerification Hook
  │
  ├─ dispatch(verifyProductStart())
  │ [Sets loading: true]
  │
  ├─ await verificationService.verifyProduct(code)
  │
  ▼
verificationService.js
  │
  ├─ apiClient.post(
  │   '/verifications/verify',
  │   { unique_code, channel }
  │ )
  │
  ▼
apiClient.js (Axios)
  │
  ├─ request interceptor
  │ [Add headers, log request]
  │
  ├─ HTTP POST to backend
  │ [Network request]
  │
  ▼
BACKEND API
  │
  ├─ Verify product
  ├─ Query database
  ├─ Return response
  │
  ▼
apiClient.js (Response)
  │
  ├─ response interceptor
  │ [Parse JSON, check status]
  │
  ├─ if error → catch block
  │   dispatch(verifyProductFailure(error))
  │
  ├─ if success → return data
  │   dispatch(verifyProductSuccess(data))
  │
  ▼
Component
  │
  ├─ Redux state updated
  ├─ Component re-renders
  ├─ Shows result to user
  │
  ▼
USER SEES RESULT
```

---

## 🎨 Theme System Map

```
src/constants/theme.js
    │
    ├─ COLORS
    │  ├─ primary:        '#1E88E5' → Buttons, Links
    │  ├─ success:        '#43A047' → Authentic status
    │  ├─ danger:         '#E53935' → Counterfeit status
    │  ├─ warning:        '#FB8C00' → Uncertain status
    │  ├─ background:     '#F5F5F5' → Screen BG
    │  ├─ surface:        '#FFFFFF' → Cards, modals
    │  ├─ text:           '#212121' → Main text
    │  ├─ textSecondary:  '#757575' → Secondary text
    │  └─ border:         '#E0E0E0' → Borders
    │
    ├─ SIZES (Padding/Margins)
    │  ├─ xs:  8px   → Small gaps
    │  ├─ sm:  12px  → Small padding
    │  ├─ md:  16px  → Medium padding
    │  ├─ lg:  24px  → Large padding
    │  └─ xl:  32px  → Extra large
    │
    ├─ SPACING
    │  ├─ container: 16px  → Screen padding
    │  ├─ section:   24px  → Section spacing
    │  └─ element:   8px   → Element gap
    │
    └─ Used in:
       ├─ All screens (COLORS.primary)
       ├─ All components (SIZES)
       └─ All styles (SPACING)
```

---

## 🧪 Testing Flow Map

```
npm start
  │
  ├─ Expo bundler starts
  ├─ QR code displayed
  │
  ▼
Scan QR (Expo Go or Emulator)
  │
  ├─ App builds
  ├─ App starts on device
  │
  ▼
TEST 1: Barcode Scanning
  ├─ Tap "Scan Barcode"
  ├─ Camera opens
  ├─ Point at barcode
  ├─ Barcode detected auto
  └─ ResultScreen shows

TEST 2: Manual Entry
  ├─ Tap "Enter Code Manually"
  ├─ Type code
  ├─ Tap verify
  └─ ResultScreen shows

TEST 3: History
  ├─ Tap History tab
  ├─ All verifications show
  ├─ Tap item for details
  └─ Card expands

TEST 4: Navigate
  ├─ Tap tabs
  ├─ Swipe between screens
  ├─ Back button works
  └─ State persists

PASS ALL TESTS
  │
  ├─ App ready for use
  ├─ Ready for deployment
  │
  ▼
DEPLOY
```

---

## 📚 Documentation Map

```
WHERE TO START
    │
    ├─ "I want overview"
    │  └─ COMPREHENSIVE_SUMMARY.md
    │
    ├─ "I want full details"
    │  └─ REACT_NATIVE_GUIDE.md
    │
    ├─ "I want to code"
    │  └─ COMPONENT_ARCHITECTURE_GUIDE.md
    │
    ├─ "I want to setup & test"
    │  └─ RUNNING_AND_TESTING_GUIDE.md
    │
    ├─ "I want quick lookup"
    │  └─ QUICK_REFERENCE_CARD.md
    │
    └─ "I want guide index"
       └─ DOCUMENTATION_INDEX.md
```

---

## 🚀 Deployment Path

```
LOCAL DEVELOPMENT
    │
    ├─ npm install
    ├─ npm start
    ├─ Test on device
    ├─ Make changes
    └─ Repeat until satisfied
        │
        ▼
CODE REVIEW
    │
    ├─ Review components
    ├─ Check error handling
    ├─ Verify state management
    └─ Performance check
        │
        ▼
BUILD FOR PRODUCTION
    │
    ├─ expo build:android → APK
    │  or
    └─ expo build:ios → IPA
        │
        ▼
APP STORE SUBMISSION
    │
    ├─ Google Play Store (Android)
    │
    └─ Apple App Store (iOS)
        │
        ▼
LIVE IN APP STORES
    │
    ├─ Monitor feedback
    ├─ Track crashes
    ├─ User analytics
    └─ Plan updates
```

---

## 💡 Key Concepts

```
COMPONENTS
  └─ Screens (full page)
  └─ Components (reusable parts)
  └─ Props (input data)
  └─ State (internal data)

REDUX
  └─ Actions (what happened)
  └─ Reducers (update state)
  └─ Store (single source of truth)
  └─ Dispatch (trigger action)
  └─ Selector (get data from store)

HOOKS
  └─ useState (local state)
  └─ useEffect (side effects)
  └─ useDispatch (dispatch actions)
  └─ useSelector (get store data)
  └─ useNavigation (navigate)
  └─ Custom hooks (reuse logic)

API
  └─ HTTP requests (fetch data)
  └─ Services (organized requests)
  └─ Interceptors (modify requests/responses)
  └─ Error handling (user feedback)
```

---

**Keep this map handy for reference! Print it out! 🖨️**
