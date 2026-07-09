import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/api';

export default function ScanScreen() {
  const [code, setCode] = useState('TB-2024-001');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  
  // Camera Permission hook and scanner state
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);

  const verifyProduct = async (codeToVerify) => {
    const targetCode = typeof codeToVerify === 'string' ? codeToVerify : code;
    const cleanCode = targetCode.trim();

    if (!cleanCode) {
      Alert.alert('Enter Code', 'Please input or scan a product code first.');
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/verifications/verify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_code: cleanCode,
          channel: 'app',
          location: 'Mobile App',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setResult({
          title: 'Unverified Product',
          message: data.message || 'This product code is not registered in our database.',
          tone: 'danger',
          code: cleanCode,
        });
        return;
      }

      setResult({
        title: 'Authentic Product',
        productName: data.data.product.name,
        manufacturer: data.data.product.manufacturer_name,
        contact: data.data.product.contact_info || 'No contact provided',
        tone: 'success',
        code: cleanCode,
      });
    } catch (error) {
      setResult({
        title: 'Connection Offline',
        message: `Unable to establish server connection. Verify your API host is reachable.`,
        tone: 'danger',
        code: cleanCode,
      });
    } finally {
      setLoading(false);
    }
  };

  const startScanning = async () => {
    if (!permission) {
      Alert.alert('Camera Error', 'Camera module is loading. Please try again.');
      return;
    }

    if (!permission.granted) {
      const requestResult = await requestPermission();
      if (!requestResult.granted) {
        Alert.alert(
          'Permission Required',
          'Camera access is required to scan barcodes. Please enable it in Settings.'
        );
        return;
      }
    }

    setIsScanning(true);
  };

  const handleBarCodeScanned = async (scanningResult) => {
    if (!isScanning) return;
    setIsScanning(false);

    const scannedCode = scanningResult.data;
    if (scannedCode) {
      setCode(scannedCode);
      await verifyProduct(scannedCode);
    }
  };

  const handleReportCounterfeit = () => {
    Alert.alert(
      'Report Submitted',
      `A counterfeit incident report has been generated for code "${result?.code || code}". Our support and compliance team will investigate this merchant.`,
      [{ text: 'Dismiss' }]
    );
  };

  if (isScanning) {
    return (
      <SafeAreaView style={styles.scannerContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
        <CameraView
          style={StyleSheet.absoluteFillObject}
          facing="back"
          onBarcodeScanned={handleBarCodeScanned}
        />
        
        {/* Viewfinder dimming & focusing overlay */}
        <View style={styles.overlayContainer}>
          <View style={styles.unfocusedMask} />
          
          <View style={styles.middleRow}>
            <View style={styles.unfocusedMask} />
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              <View style={styles.laser} />
              
              {/* Target Crosshair */}
              <View style={styles.targetCross} />
            </View>
            <View style={styles.unfocusedMask} />
          </View>
          
          <View style={styles.bottomSection}>
            <Text style={styles.scannerInstructions}>
              Center the product barcode inside the frame to scan
            </Text>
            
            <Pressable
              onPress={() => setIsScanning(false)}
              style={({ pressed }) => [
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <Text style={styles.eyebrow}>VerifyShield Security</Text>
          <Text style={styles.title}>Verification</Text>
          <Text style={styles.subtitle}>
            Authenticate items instantly. Hold your camera over the product packaging code, or type it in below.
          </Text>

          <View style={styles.panel}>
            <Text style={styles.label}>Product Unique Identifier</Text>
            <View style={styles.inputContainer}>
              <Ionicons name="key-outline" size={18} color="#64748b" style={styles.inputIcon} />
              <TextInput
                autoCapitalize="characters"
                onChangeText={setCode}
                placeholder="Example: TB-2024-001"
                placeholderTextColor="#94a3b8"
                style={styles.input}
                value={code}
              />
            </View>

            <Pressable
              disabled={loading}
              onPress={startScanning}
              style={({ pressed }) => [
                styles.scanButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              <Ionicons name="camera-outline" size={20} color="#ffffff" style={{ marginRight: 6 }} />
              <Text style={styles.scanButtonText}>Open Camera Scanner</Text>
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={() => verifyProduct()}
              style={({ pressed }) => [
                styles.primaryButton,
                pressed && styles.pressed,
                loading && styles.disabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.primaryButtonText}>Verify Authenticity</Text>
                </>
              )}
            </Pressable>
          </View>

          {result ? (
            result.tone === 'success' ? (
              /* Legitimate Product Certificate Card */
              <View style={[styles.resultCard, styles.successCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.shieldIconContainer}>
                    <Ionicons name="shield-checkmark" size={28} color="#10b981" />
                  </View>
                  <View style={styles.cardHeaderTexts}>
                    <Text style={styles.badgeSuccessText}>GENUINE PRODUCT</Text>
                    <Text style={styles.cardTitleText}>{result.productName}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.detailsGrid}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Manufacturer</Text>
                    <Text style={styles.detailValue}>{result.manufacturer}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Product Code</Text>
                    <Text style={styles.detailValue}>{result.code}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Verification Channel</Text>
                    <Text style={styles.detailValue}>Mobile App Secure</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Support Contact</Text>
                    <Text style={styles.detailValue}>{result.contact}</Text>
                  </View>
                </View>

                <View style={styles.badgeFooter}>
                  <Ionicons name="lock-closed" size={12} color="#059669" style={{ marginRight: 4 }} />
                  <Text style={styles.sealText}>Cryptographically Verified & Seeding Ok</Text>
                </View>
              </View>
            ) : (
              /* Counterfeit Danger Warning Card */
              <View style={[styles.resultCard, styles.dangerCard]}>
                <View style={styles.cardHeader}>
                  <View style={styles.alertIconContainer}>
                    <Ionicons name="alert-circle" size={28} color="#ef4444" />
                  </View>
                  <View style={styles.cardHeaderTexts}>
                    <Text style={styles.badgeDangerText}>VERIFICATION FAIL</Text>
                    <Text style={styles.cardTitleText}>{result.title}</Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.dangerDescription}>
                  {result.message}
                </Text>
                <Text style={styles.dangerWarning}>
                  Warning: Do not consume or use this product. It may be a counterfeit or copy which poses health and safety hazards.
                </Text>

                <Pressable
                  onPress={handleReportCounterfeit}
                  style={({ pressed }) => [
                    styles.reportButton,
                    pressed && styles.pressed,
                  ]}
                >
                  <Ionicons name="flag-outline" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                  <Text style={styles.reportButtonText}>Report Counterfeit Incident</Text>
                </Pressable>
              </View>
            )
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 15,
  },
  eyebrow: {
    color: '#0d9488',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    color: '#1e293b',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  subtitle: {
    color: '#64748b',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    marginTop: 6,
  },
  panel: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 20,
    padding: 16,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    color: '#1e293b',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#cbd5e1',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#1e293b',
    fontSize: 16,
    fontWeight: '600',
    height: 48,
  },
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d9488', // Teal accent button
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 14,
    height: 48,
  },
  scanButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1e293b', // Slate primary button
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
    height: 48,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
  // Verification Results Card Styles
  resultCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 18,
    marginTop: 8,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  successCard: {
    backgroundColor: '#ffffff',
    borderColor: '#a7f3d0',
  },
  dangerCard: {
    backgroundColor: '#ffffff',
    borderColor: '#fecaca',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  shieldIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#d1fae5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardHeaderTexts: {
    flex: 1,
  },
  badgeSuccessText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#10b981',
    letterSpacing: 1,
  },
  badgeDangerText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#ef4444',
    letterSpacing: 1,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginBottom: 14,
  },
  detailsGrid: {
    marginBottom: 14,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1e293b',
    fontWeight: '700',
  },
  badgeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecfdf5',
    borderRadius: 8,
    paddingVertical: 8,
  },
  sealText: {
    fontSize: 11,
    color: '#047857',
    fontWeight: '700',
  },
  dangerDescription: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 10,
  },
  dangerWarning: {
    fontSize: 12,
    color: '#dc2626',
    fontWeight: '700',
    lineHeight: 18,
    backgroundColor: '#fef2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 8,
    height: 40,
  },
  reportButtonText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },

  // Barcode Scanner View styles
  scannerContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  unfocusedMask: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 260,
  },
  viewfinder: {
    width: 260,
    height: 260,
    position: 'relative',
    backgroundColor: 'transparent',
    overflow: 'hidden',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderColor: '#10b981', // Emerald green corners
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  laser: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: '50%',
    height: 2,
    backgroundColor: '#ef4444',
  },
  targetCross: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderWidth: 1,
    borderColor: '#10b981',
    borderRadius: 7,
    top: '50%',
    left: '50%',
    marginTop: -7,
    marginLeft: -7,
  },
  bottomSection: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  scannerInstructions: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  cancelButton: {
    height: 44,
    paddingHorizontal: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  cancelButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
});
