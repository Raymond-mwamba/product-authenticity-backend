import React, { useState, useEffect, useRef } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/api';

export default function USSDScreen() {
  const [phoneNumber, setPhoneNumber] = useState('+254712345678');
  const [dialedCode, setDialedCode] = useState('*384#');
  
  // USSD Session states
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [ussdResponse, setUssdResponse] = useState('');
  const [ussdStatus, setUssdStatus] = useState('CON'); // 'CON' or 'END'
  const [menuInput, setMenuInput] = useState('');
  const [accumulatedInputs, setAccumulatedInputs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorText, setErrorText] = useState('');

  // Refs for focusing inputs
  const inputRef = useRef(null);

  // Focus simulation input when USSD dialog opens
  useEffect(() => {
    if (sessionActive && ussdStatus === 'CON') {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [sessionActive, ussdStatus]);

  // Handle dialpad press
  const handleKeyPress = (key) => {
    if (key === '⌫') {
      setDialedCode(prev => prev.slice(0, -1));
    } else if (key === 'Clear') {
      setDialedCode('');
    } else {
      if (dialedCode.length < 20) {
        setDialedCode(prev => prev + key);
      }
    }
  };

  // Start USSD Session
  const initiateUSSD = async () => {
    if (!dialedCode) return;
    
    setLoading(true);
    setErrorText('');
    setMenuInput('');
    setAccumulatedInputs([]);
    
    const newSessionId = `ussd_sim_${Date.now()}`;
    setSessionId(newSessionId);

    try {
      const response = await fetch(`${API_BASE_URL}/ussd/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: newSessionId,
          serviceCode: dialedCode,
          phoneNumber: phoneNumber,
          text: '',
        }),
      });

      const rawText = await response.text();
      handleResponse(rawText);
      setSessionActive(true);
    } catch (err) {
      console.error(err);
      setErrorText(`Connection to USSD gateway failed. Make sure your backend API is online.`);
    } finally {
      setLoading(false);
    }
  };

  // Submit Menu Response
  const submitResponse = async () => {
    if (loading) return;
    
    setLoading(true);
    setErrorText('');

    const nextInputs = [...accumulatedInputs, menuInput.trim()];
    const joinedText = nextInputs.join('*');

    try {
      const response = await fetch(`${API_BASE_URL}/ussd/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          serviceCode: dialedCode,
          phoneNumber: phoneNumber,
          text: joinedText,
        }),
      });

      const rawText = await response.text();
      handleResponse(rawText);
      setAccumulatedInputs(nextInputs);
      setMenuInput('');
    } catch (err) {
      console.error(err);
      setErrorText('Session transmission failure. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  // Parse CON / END from backend response
  const handleResponse = (text) => {
    const trimmed = text.trim();
    if (trimmed.startsWith('CON ')) {
      setUssdStatus('CON');
      setUssdResponse(trimmed.replace(/^CON\s+/, ''));
    } else if (trimmed.startsWith('CON\n')) {
      setUssdStatus('CON');
      setUssdResponse(trimmed.replace(/^CON\n/, ''));
    } else if (trimmed.startsWith('END ')) {
      setUssdStatus('END');
      setUssdResponse(trimmed.replace(/^END\s+/, ''));
    } else if (trimmed.startsWith('END\n')) {
      setUssdStatus('END');
      setUssdResponse(trimmed.replace(/^END\n/, ''));
    } else {
      setUssdStatus('END');
      setUssdResponse(trimmed);
    }
  };

  const closeSession = () => {
    setSessionActive(false);
    setSessionId('');
    setAccumulatedInputs([]);
    setMenuInput('');
    setErrorText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>USSD Integration</Text>
          <Text style={styles.title}>Carrier Sim</Text>
        </View>

        {/* Phone Config Panel */}
        <View style={styles.configContainer}>
          <Ionicons name="call-outline" size={16} color="#64748b" style={{ marginRight: 6 }} />
          <Text style={styles.configLabel}>Device Number:</Text>
          <TextInput
            style={styles.configInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            placeholder="+2547XXXXXXXX"
            placeholderTextColor="#94a3b8"
          />
        </View>

        {/* Simulated Phone Shell */}
        <View style={styles.phoneShell}>
          {/* Phone Ear Speaker & Sensor */}
          <View style={styles.phoneTopHeader}>
            <View style={styles.phoneSpeaker} />
            <View style={styles.phoneCameraLens} />
          </View>

          {/* Screen Display */}
          <View style={styles.screenDisplay}>
            <View style={styles.simulatedStatusBar}>
              <Text style={styles.statusBarTime}>09:41</Text>
              <Text style={styles.statusBarCarrier}>VerifyShield Sim</Text>
              <View style={styles.statusBarIcons}>
                <Ionicons name="wifi" size={10} color="#334155" style={{ marginRight: 4 }} />
                <Ionicons name="battery-full" size={14} color="#334155" />
              </View>
            </View>

            <View style={styles.dialerDisplayContainer}>
              <Text numberOfLines={1} style={styles.dialerDisplayText}>
                {dialedCode || ' '}
              </Text>
            </View>

            <View style={styles.helperHintContainer}>
              <Text style={styles.helperHintText}>
                Dial <Text style={{ fontWeight: '800' }}>*384#</Text> to open authentication menu
              </Text>
            </View>
          </View>

          {/* Dialer Keypad */}
          <View style={styles.keypad}>
            {[
              ['1', '2', '3'],
              ['4', '5', '6'],
              ['7', '8', '9'],
              ['*', '0', '#'],
            ].map((row, idx) => (
              <View key={idx} style={styles.keypadRow}>
                {row.map((key) => (
                  <Pressable
                    key={key}
                    onPress={() => handleKeyPress(key)}
                    style={({ pressed }) => [
                      styles.keypadButton,
                      pressed && styles.keypadButtonPressed
                    ]}
                  >
                    <Text style={styles.keypadButtonText}>{key}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
            
            {/* Utility keys row */}
            <View style={styles.keypadRow}>
              <Pressable
                onPress={() => handleKeyPress('Clear')}
                style={({ pressed }) => [
                  styles.keypadButton,
                  styles.keypadUtilityButton,
                  pressed && styles.keypadButtonPressed
                ]}
              >
                <Text style={styles.keypadUtilityText}>C</Text>
              </Pressable>
              
              <Pressable
                onPress={() => handleKeyPress('0')}
                style={({ pressed }) => [
                  styles.keypadButton,
                  pressed && styles.keypadButtonPressed
                ]}
              >
                <Text style={styles.keypadButtonText}>0</Text>
              </Pressable>

              <Pressable
                onPress={() => handleKeyPress('⌫')}
                style={({ pressed }) => [
                  styles.keypadButton,
                  styles.keypadUtilityButton,
                  pressed && styles.keypadButtonPressed
                ]}
              >
                <Ionicons name="backspace-outline" size={20} color="#cbd5e1" />
              </Pressable>
            </View>

            {/* Dial Action Button */}
            <View style={styles.dialRow}>
              <Pressable
                disabled={loading || !dialedCode}
                onPress={initiateUSSD}
                style={({ pressed }) => [
                  styles.dialButton,
                  (!dialedCode || loading) && styles.disabled,
                  pressed && styles.dialButtonPressed
                ]}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <>
                    <Ionicons name="call" size={16} color="#ffffff" style={{ marginRight: 6 }} />
                    <Text style={styles.dialButtonText}>SEND CALL</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>

          {/* Bottom gesture line */}
          <View style={styles.homeIndicator} />
        </View>

        {/* Modern Native-styled USSD Alert Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={sessionActive}
          onRequestClose={closeSession}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.ussdDialog}>
              <View style={styles.ussdDialogHeader}>
                <Ionicons name="radio-outline" size={18} color="#0d9488" style={{ marginRight: 6 }} />
                <Text style={styles.ussdDialogTitle}>Carrier Service</Text>
              </View>
              
              <View style={styles.ussdMessageContainer}>
                {errorText ? (
                  <View style={styles.errorContainer}>
                    <Ionicons name="warning" size={20} color="#ef4444" style={{ marginRight: 6 }} />
                    <Text style={styles.ussdErrorText}>{errorText}</Text>
                  </View>
                ) : (
                  <Text style={styles.ussdMessageText}>{ussdResponse}</Text>
                )}
              </View>

              {ussdStatus === 'CON' && !errorText && (
                <View style={styles.dialogInputWrapper}>
                  <TextInput
                    ref={inputRef}
                    style={styles.ussdInput}
                    value={menuInput}
                    onChangeText={setMenuInput}
                    onSubmitEditing={submitResponse}
                    blurOnSubmit={false}
                    placeholder="Type menu number or product code..."
                    placeholderTextColor="#94a3b8"
                  />
                </View>
              )}

              <View style={styles.ussdActions}>
                {ussdStatus === 'CON' && !errorText ? (
                  <>
                    <Pressable
                      onPress={closeSession}
                      style={({ pressed }) => [
                        styles.ussdButton,
                        styles.ussdCancelButton,
                        pressed && styles.pressed
                      ]}
                    >
                      <Text style={styles.ussdCancelText}>Cancel</Text>
                    </Pressable>
                    <View style={styles.buttonSeparator} />
                    <Pressable
                      disabled={loading}
                      onPress={submitResponse}
                      style={({ pressed }) => [
                        styles.ussdButton,
                        styles.ussdSendButton,
                        pressed && styles.pressed
                      ]}
                    >
                      {loading ? (
                        <ActivityIndicator size="small" color="#10b981" />
                      ) : (
                        <Text style={styles.ussdSendText}>Send</Text>
                      )}
                    </Pressable>
                  </>
                ) : (
                  <Pressable
                    onPress={closeSession}
                    style={({ pressed }) => [
                      styles.ussdSingleButton,
                      pressed && styles.pressed
                    ]}
                  >
                    <Text style={styles.ussdSingleButtonText}>Dismiss</Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 10,
  },
  header: {
    marginTop: Platform.OS === 'android' ? 10 : 0,
    marginBottom: 15,
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
  configContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  configLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
    marginRight: 6,
  },
  configInput: {
    flex: 1,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '700',
    padding: 0,
  },
  phoneShell: {
    flex: 1,
    backgroundColor: '#0f172a', // Slate-900 premium phone chassis
    borderRadius: 36,
    borderColor: '#1e293b',
    borderWidth: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 8,
  },
  phoneTopHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 14,
    marginBottom: 6,
    position: 'relative',
  },
  phoneSpeaker: {
    width: 50,
    height: 5,
    backgroundColor: '#1e293b',
    borderRadius: 3,
  },
  phoneCameraLens: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#1e293b',
    position: 'absolute',
    right: '25%',
  },
  screenDisplay: {
    height: 110,
    backgroundColor: '#f1f5f9', // Light slate display screen
    borderRadius: 14,
    padding: 8,
    justifyContent: 'space-between',
  },
  simulatedStatusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: '#cbd5e1',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  statusBarTime: {
    fontSize: 10,
    fontWeight: '700',
    color: '#475569',
  },
  statusBarCarrier: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0d9488',
  },
  statusBarIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialerDisplayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  dialerDisplayText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: 1.5,
  },
  helperHintContainer: {
    alignItems: 'center',
  },
  helperHintText: {
    fontSize: 9,
    color: '#64748b',
    textAlign: 'center',
    fontWeight: '600',
  },
  keypad: {
    flex: 1,
    justifyContent: 'center',
    marginTop: 8,
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  keypadButton: {
    flex: 1,
    aspectRatio: 1.7,
    backgroundColor: '#1e293b', // Slate keycaps
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
    elevation: 1,
  },
  keypadButtonPressed: {
    backgroundColor: '#334155',
    transform: [{ scale: 0.95 }],
  },
  keypadButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
  },
  keypadUtilityButton: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
  },
  keypadUtilityText: {
    fontSize: 16,
    color: '#cbd5e1',
    fontWeight: '700',
  },
  dialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dialButton: {
    flexDirection: 'row',
    width: '94%',
    backgroundColor: '#10b981', // Emerald green dial
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    elevation: 2,
  },
  dialButtonPressed: {
    backgroundColor: '#059669',
    transform: [{ scale: 0.98 }],
  },
  dialButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  homeIndicator: {
    width: 100,
    height: 4,
    backgroundColor: '#1e293b',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  // Modern Native style USSD Alerts
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  ussdDialog: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    width: '85%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    overflow: 'hidden',
  },
  ussdDialogHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingVertical: 12,
  },
  ussdDialogTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ussdMessageContainer: {
    padding: 16,
    minHeight: 80,
    justifyContent: 'center',
  },
  ussdMessageText: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '600',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    textAlign: 'left',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ussdErrorText: {
    flex: 1,
    fontSize: 13,
    color: '#ef4444',
    lineHeight: 18,
    fontWeight: '600',
  },
  dialogInputWrapper: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  ussdInput: {
    backgroundColor: '#f8fafc',
    borderColor: '#cbd5e1',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 14,
    color: '#1e293b',
    fontWeight: '600',
    paddingHorizontal: 10,
    height: 38,
  },
  ussdActions: {
    flexDirection: 'row',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    height: 48,
  },
  buttonSeparator: {
    width: 1,
    backgroundColor: '#f1f5f9',
  },
  ussdButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ussdCancelText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '700',
  },
  ussdSendText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
  },
  ussdSingleButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
  },
  ussdSingleButtonText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
  },
});
