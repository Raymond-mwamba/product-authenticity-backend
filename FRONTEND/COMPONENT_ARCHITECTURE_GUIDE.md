# Component Architecture & Code Guide

## Overview

The React Native app uses a **component-based architecture** where:
- **Screens** are full-page components (5 screens)
- **Components** are reusable UI building blocks (4 components)
- **Hooks** contain reusable logic (2 custom hooks)
- **Redux** manages global state
- **Services** handle API communication

---

## Component Hierarchy

```
App.js (Redux Provider)
  └─ RootNavigator
     ├─ HomeStack
     │  ├─ HomeScreen
     │  └─ ResultScreen
     │
     ├─ ScanStack
     │  ├─ ScanScreen
     │  └─ ResultScreen
     │
     ├─ ManualStack
     │  ├─ ManualEntryScreen
     │  └─ ResultScreen
     │
     └─ HistoryStack
        └─ HistoryScreen
```

---

## Screen Components Detailed

### 1. HomeScreen (`src/screens/HomeScreen.js`)

**Purpose:** Dashboard with recent verifications

**Code Structure:**
```javascript
import React, { useEffect } from 'react';
import { View, ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Redux imports
import { fetchVerifications } from '../redux/verificationSlice';

// Component imports
import { PrimaryButton, SecondaryButton } from '../components/Button';
import VerificationResultCard from '../components/VerificationResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

export default function HomeScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  // Get data from Redux
  const { verifications, loading } = useSelector(
    state => state.verification
  );

  // Load data on mount
  useEffect(() => {
    dispatch(fetchVerifications());
  }, [dispatch]);

  // Show 3 most recent
  const recentVerifications = verifications.slice(0, 3);

  if (loading) return <LoadingSpinner />;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Product Verification</Text>
      </View>

      {/* Recent Verifications */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Verifications</Text>
        <FlatList
          data={recentVerifications}
          renderItem={({ item }) => (
            <VerificationResultCard verification={item} />
          )}
          keyExtractor={(item) => item.id.toString()}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Scan Barcode"
          onPress={() => navigation.navigate('ScanTab')}
        />
        <SecondaryButton
          title="Enter Code Manually"
          onPress={() => navigation.navigate('ManualTab')}
        />
        <SecondaryButton
          title="View Full History"
          onPress={() => navigation.navigate('HistoryTab')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: { padding: 16, backgroundColor: '#1E88E5' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white' },
  section: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12 },
  buttonContainer: { padding: 16, gap: 12 },
});
```

**Key Points:**
- Uses Redux selector to get verification history
- Displays only 3 most recent verifications
- Navigation buttons to other screens
- Pull-to-refresh via ScrollView

**Customization Ideas:**
- Add search/filter
- Show statistics (total verifications, % authentic)
- Add product images
- Sort by date or authenticity status

---

### 2. ScanScreen (`src/screens/ScanScreen.js`)

**Purpose:** Real-time barcode scanning

**Code Structure:**
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';

// Services
import { verificationService } from '../services/verificationService';

// Hooks
import { useCameraPermission } from '../hooks/useCameraPermission';
import { useProductVerification } from '../hooks/useProductVerification';

// Components
import LoadingSpinner from '../components/LoadingSpinner';
import { PrimaryButton } from '../components/Button';

// Theme
import { COLORS } from '../constants/theme';

export default function ScanScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { hasPermission, loading: permLoading } = useCameraPermission();
  const { verifyProduct, verifying } = useProductVerification();

  const [scanned, setScanned] = useState(false);

  // Handle barcode detected
  const handleBarCodeScanned = async ({ data }) => {
    setScanned(true);
    
    try {
      // Verify product
      await verifyProduct(data, 'app');
      
      // Navigate to result screen
      navigation.navigate('ResultStack', { screen: 'Result' });
    } catch (error) {
      console.error('Verification failed:', error);
      setScanned(false);
    }
  };

  if (permLoading) return <LoadingSpinner />;
  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission denied</Text>
      </View>
    );
  }

  if (verifying) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: [
            'qr',
            'pdf417',
            'aztec',
            'ean13',
            'ean8',
            'upca',
            'upce',
            'datamatrix',
            'codabar',
            'code39',
            'code93',
            'code128',
            'code39mod43',
            'ean14',
            'gs1databarexpanded',
            'gs1databarexpandedcomposite',
            'gs1databarlimited',
            'gs1databarlimitedcomposite',
            'gs1databaromnidirectional',
            'gs1databaromnicomposite',
            'gs1databarstacked',
            'gs1databarstackedcomposite',
            'gs1databarstackedomnidirectional',
            'gs1databarstackedomnicomposite',
            'interleaved2of5',
            'itf14',
            'msi',
            'rss14',
            'rss14limited',
            'rss14expanded',
            'telepen',
            'upcean',
          ],
        }}
      />
      
      {/* Focus box overlay */}
      <View style={styles.focusBox} />
      
      {/* Scan Again button */}
      {scanned && (
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Scan Again"
            onPress={() => setScanned(false)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  camera: { flex: 1 },
  focusBox: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 250,
    height: 250,
    marginLeft: -125,
    marginTop: -125,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 8,
  },
  buttonContainer: { position: 'absolute', bottom: 20, left: 20, right: 20 },
});
```

**Key Points:**
- Uses Expo Camera for live barcode scanning
- Supports 20+ barcode formats
- Shows focus overlay box
- Auto-navigates to result on successful scan
- Can tap to scan again

**Customization Ideas:**
- Add torch/flash toggle
- Change focus box shape/color
- Add zoom controls
- Show scanning animation

---

### 3. ManualEntryScreen (`src/screens/ManualEntryScreen.js`)

**Purpose:** Manual code entry for users without barcodes

**Code Structure:**
```javascript
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// Components
import { PrimaryButton, SecondaryButton } from '../components/Button';
import BarcodeInput from '../components/BarcodeInput';
import LoadingSpinner from '../components/LoadingSpinner';

// Hooks
import { useProductVerification } from '../hooks/useProductVerification';

// Theme
import { COLORS, SIZES } from '../constants/theme';

export default function ManualEntryScreen() {
  const navigation = useNavigation();
  const { verifyProduct, verifying } = useProductVerification();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // Validate input
  const validateCode = (input) => {
    if (input.length < 3) return 'Code must be at least 3 characters';
    if (input.length > 20) return 'Code must be less than 20 characters';
    if (!/^[A-Za-z0-9-]*$/.test(input)) return 'Only letters, numbers and dashes allowed';
    return '';
  };

  // Handle submit
  const handleSubmit = async () => {
    const validationError = validateCode(code);
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setError('');
      await verifyProduct(code, 'app');
      navigation.navigate('ResultStack', { screen: 'Result' });
    } catch (err) {
      setError(err.message || 'Verification failed');
    }
  };

  if (verifying) return <LoadingSpinner />;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter Product Code</Text>
        <Text style={styles.subtitle}>
          Type the product code (e.g., TB-2024-001)
        </Text>

        {/* Input Field */}
        <TextInput
          style={styles.input}
          placeholder="Product Code"
          value={code}
          onChangeText={(text) => {
            setCode(text);
            setError(''); // Clear error on new input
          }}
          placeholderTextColor="#999"
          editable={!verifying}
        />

        {/* Error Message */}
        {error && <Text style={styles.error}>{error}</Text>}

        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Verify Product"
            onPress={handleSubmit}
            disabled={!code || verifying}
          />
          <SecondaryButton
            title="Cancel"
            onPress={() => navigation.goBack()}
            disabled={verifying}
          />
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>Format Examples:</Text>
          <Text style={styles.infoText}>• TB-2024-001</Text>
          <Text style={styles.infoText}>• TC-2024-002</Text>
          <Text style={styles.infoText}>• TD-2024-003</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  content: { flex: 1, padding: SIZES.lg, justifyContent: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#666', marginBottom: 24 },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  error: { color: COLORS.danger, fontSize: 12, marginBottom: 12 },
  buttonContainer: { gap: SIZES.md, marginBottom: 24 },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: SIZES.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  infoTitle: { fontWeight: '600', marginBottom: 8 },
  infoText: { color: '#555', marginBottom: 4, fontSize: 12 },
});
```

**Key Points:**
- Input validation with feedback
- Real-time error messages
- Formatted placeholder text
- Clear input state management
- Disabled state during verification

**Customization Ideas:**
- Add barcode format examples
- Add voice input option
- Add QR code paste from clipboard
- Remember recent codes

---

### 4. ResultScreen (`src/screens/ResultScreen.js`)

**Purpose:** Display verification result

**Code Structure:**
```javascript
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

// Components
import { PrimaryButton, SecondaryButton } from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';

// Redux
import { resetProduct } from '../redux/productSlice';

// Theme
import { COLORS, SIZES } from '../constants/theme';

export default function ResultScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  
  const { currentProduct, isAuthentic, verificationTime, loading, error } = 
    useSelector(state => state.product);

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>❌ Verification Failed</Text>
          <Text style={styles.errorMessage}>{error}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <PrimaryButton
            title="Try Again"
            onPress={() => {
              dispatch(resetProduct());
              navigation.goBack();
            }}
          />
        </View>
      </View>
    );
  }

  if (!currentProduct) {
    return (
      <View style={styles.container}>
        <Text style={styles.noData}>No verification data</Text>
      </View>
    );
  }

  const statusColor = isAuthentic ? COLORS.success : COLORS.danger;
  const statusText = isAuthentic ? 'AUTHENTIC' : 'COUNTERFEIT';
  const statusIcon = isAuthentic ? '✓' : '✕';

  return (
    <ScrollView style={styles.container}>
      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
        <Text style={styles.statusIcon}>{statusIcon}</Text>
        <Text style={styles.statusText}>{statusText}</Text>
      </View>

      {/* Product Details */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Product Details</Text>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Product Name:</Text>
          <Text style={styles.value}>{currentProduct.name}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Manufacturer:</Text>
          <Text style={styles.value}>{currentProduct.manufacturer_name}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.label}>Unique Code:</Text>
          <Text style={styles.value}>{currentProduct.unique_code}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Verification Time:</Text>
          <Text style={styles.value}>
            {new Date(verificationTime).toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          title="Scan Another Product"
          onPress={() => {
            dispatch(resetProduct());
            navigation.navigate('ScanTab');
          }}
        />
        <SecondaryButton
          title="Back to Home"
          onPress={() => {
            dispatch(resetProduct());
            navigation.navigate('HomeTab');
          }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  statusBadge: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  statusIcon: { fontSize: 60, color: 'white', fontWeight: 'bold' },
  statusText: { fontSize: 28, fontWeight: 'bold', color: 'white', marginTop: 10 },
  card: { backgroundColor: 'white', margin: 16, padding: 16, borderRadius: 8 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },
  detailRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  label: { fontWeight: '600', color: '#555' },
  value: { color: '#333', flex: 1, textAlign: 'right', marginLeft: 10 },
  buttonContainer: { padding: 16, gap: 12 },
  errorBox: { margin: 16, padding: 16, backgroundColor: '#FFEBEE', borderRadius: 8 },
  errorText: { fontSize: 18, fontWeight: 'bold', color: COLORS.danger },
  errorMessage: { color: COLORS.danger, marginTop: 8 },
  noData: { textAlign: 'center', marginTop: 40, fontSize: 16, color: '#999' },
});
```

**Key Points:**
- Dynamic color based on authenticity
- Displays product information
- Shows verification timestamp
- Navigation to scan again or home
- Error state handling

**Customization Ideas:**
- Add share functionality
- Add product image
- Add recommendation (e.g., "Where to buy authentic")
- Add related products suggestion

---

### 5. HistoryScreen (`src/screens/HistoryScreen.js`)

**Purpose:** View all verification history

**Code Structure:**
```javascript
import React, { useEffect, useState } from 'react';
import { View, FlatList, TextInput, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

// Components
import VerificationResultCard from '../components/VerificationResultCard';
import LoadingSpinner from '../components/LoadingSpinner';

// Redux
import { fetchVerifications } from '../redux/verificationSlice';

// Theme
import { COLORS, SIZES } from '../constants/theme';

export default function HistoryScreen() {
  const dispatch = useDispatch();
  const { verifications, loading } = useSelector(state => state.verification);
  const [filtered, setFiltered] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchVerifications());
  }, [dispatch]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFiltered(verifications);
    } else {
      const query = searchQuery.toLowerCase();
      setFiltered(
        verifications.filter(item =>
          item.product.name.toLowerCase().includes(query) ||
          item.product.unique_code.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, verifications]);

  if (loading && verifications.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search product or code..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#999"
      />

      {/* Verifications List */}
      <FlatList
        data={filtered}
        renderItem={({ item }) => (
          <VerificationResultCard verification={item} />
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {searchQuery ? 'No results found' : 'No verifications yet'}
          </Text>
        }
        onEndReached={() => {
          // Pagination logic here if needed
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  searchInput: {
    margin: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: 'white',
  },
  listContent: { paddingHorizontal: 12, paddingVertical: 8 },
  emptyText: { textAlign: 'center', marginTop: 40, color: '#999' },
});
```

**Key Points:**
- Displays all verifications
- Real-time search filtering
- Pull-to-refresh capability
- Empty state handling
- Infinite scroll ready

**Customization Ideas:**
- Add filter by authenticity status
- Add date range filtering
- Add sorting options
- Add export/share history

---

## Reusable Components Deep Dive

### Button Component (`src/components/Button.js`)

```javascript
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

// Primary Button (Blue, Full Width)
export function PrimaryButton({ title, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.primaryButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text style={styles.primaryText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

// Secondary Button (Outlined, Gray)
export function SecondaryButton({ title, onPress, disabled, loading, style }) {
  return (
    <TouchableOpacity
      style={[
        styles.secondaryButton,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={COLORS.primary} />
      ) : (
        <Text style={styles.secondaryText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  secondaryText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  disabled: {
    opacity: 0.5,
  },
});
```

**Usage:**
```javascript
<PrimaryButton 
  title="Verify" 
  onPress={handleVerify}
  loading={isVerifying}
  disabled={!code}
/>

<SecondaryButton 
  title="Cancel" 
  onPress={handleCancel}
/>
```

---

### VerificationResultCard Component

```javascript
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';

export default function VerificationResultCard({ verification, onPress }) {
  const isAuthentic = verification.verification_result === 'authentic';
  const borderColor = isAuthentic ? COLORS.success : COLORS.danger;
  const statusColor = isAuthentic ? COLORS.success : COLORS.danger;

  return (
    <TouchableOpacity 
      style={[styles.card, { borderLeftColor: borderColor }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.productName}>
          {verification.product.name}
        </Text>
        <Text style={styles.status}>
          {isAuthentic ? 'AUTHENTIC' : 'COUNTERFEIT'}
        </Text>
      </View>

      <Text style={styles.manufacturer}>
        {verification.product.manufacturer_name}
      </Text>

      <View style={styles.footer}>
        <Text style={styles.timestamp}>
          {new Date(verification.verification_time).toLocaleString()}
        </Text>
        <Text style={styles.channel}>{verification.channel}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: SIZES.md,
    marginVertical: 8,
    marginHorizontal: 12,
    borderLeftWidth: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
  },
  status: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  manufacturer: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  channel: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});
```

---

## Redux State Flow

### Update State from Component

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { verifyProductSuccess } from '../redux/productSlice';

function MyComponent() {
  const dispatch = useDispatch();

  const handleVerify = async () => {
    try {
      const result = await apiCall();
      
      // Update Redux
      dispatch(verifyProductSuccess({
        currentProduct: result.product,
        isAuthentic: result.verification_result === 'authentic',
        verificationTime: result.verification_time
      }));
    } catch (error) {
      // Handle error
    }
  };

  return <Button onPress={handleVerify} />;
}
```

---

## Summary

This component architecture provides:
- ✅ **Separation of Concerns** - Screens, components, services
- ✅ **Reusability** - Shared components across screens
- ✅ **State Management** - Redux for global state
- ✅ **Type Safety** - PropTypes or TypeScript ready
- ✅ **Testing** - Easy to unit test components
- ✅ **Maintainability** - Clear file organization
- ✅ **Scalability** - Easy to add new screens and features
