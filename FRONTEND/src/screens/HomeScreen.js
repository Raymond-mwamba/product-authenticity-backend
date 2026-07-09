import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/api';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState('Checking connection...');
  const [isConnected, setIsConnected] = useState(false);
  const [stats, setStats] = useState({
    total_verifications: 0,
    authentic_count: 0,
    counterfeit_count: 0,
    authentic_percentage: 0,
  });

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Check Connection
      const healthRes = await fetch(API_BASE_URL.replace('/api', '/health'));
      const healthData = await healthRes.json();
      
      if (healthData.status === 'ok') {
        setHealth('Active Connection');
        setIsConnected(true);
        
        // 2. Fetch stats
        const statsRes = await fetch(`${API_BASE_URL}/verifications/stats/overview`);
        if (statsRes.ok) {
          const statsJson = await statsRes.json();
          if (statsJson.status === 'success' && statsJson.data) {
            setStats({
              total_verifications: statsJson.data.total_verifications || 0,
              authentic_count: statsJson.data.authentic_count || 0,
              counterfeit_count: statsJson.data.counterfeit_count || 0,
              authentic_percentage: statsJson.data.authentic_percentage || 0,
            });
          }
        }
      } else {
        setHealth('Gateway Unhealthy');
        setIsConnected(false);
      }
    } catch (error) {
      setHealth('Server Offline');
      setIsConnected(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [fetchDashboardData])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.eyebrow}>VerifyShield System</Text>
          <Text style={styles.title}>Dashboard</Text>
        </View>

        {/* Connection Status Panel */}
        <View style={styles.statusPanel}>
          <View style={styles.statusInfo}>
            <View style={[styles.statusIconBg, isConnected ? styles.bgSuccessLight : styles.bgDangerLight]}>
              <Ionicons
                name={isConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
                size={22}
                color={isConnected ? '#10b981' : '#ef4444'}
              />
            </View>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusTitle}>Backend API Endpoint</Text>
              <Text style={styles.apiUrl} numberOfLines={1}>{API_BASE_URL}</Text>
              <Text style={[styles.statusText, isConnected ? styles.textSuccess : styles.textDanger]}>
                {health}
              </Text>
            </View>
          </View>

          <Pressable
            disabled={loading}
            onPress={fetchDashboardData}
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.pressed,
              loading && styles.disabled,
            ]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#10b981" />
            ) : (
              <>
                <Ionicons name="refresh-outline" size={16} color="#10b981" style={styles.btnIcon} />
                <Text style={styles.secondaryButtonText}>Sync Status</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* Visual Progress Dashboard Card */}
        <View style={styles.ratingCard}>
          <View style={styles.progressCircle}>
            <Text style={styles.progressValue}>{stats.authentic_percentage}%</Text>
            <Text style={styles.progressLabel}>Rate</Text>
          </View>
          <View style={styles.ratingInfo}>
            <Text style={styles.ratingTitle}>Authenticity Rating</Text>
            <Text style={styles.ratingDesc}>
              {stats.total_verifications > 0
                ? `${stats.authentic_count} of ${stats.total_verifications} scanned items have been verified as legitimate.`
                : 'No scans have been performed yet. Start scanning to verify products.'}
            </Text>
            {stats.counterfeit_count > 0 && (
              <View style={styles.alertNotice}>
                <Ionicons name="shield-alert" size={14} color="#ef4444" style={{ marginRight: 4 }} />
                <Text style={styles.alertNoticeText}>{stats.counterfeit_count} suspected fakes intercepted.</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Grid */}
        <Text style={styles.sectionTitle}>Verification Metrics</Text>
        
        <View style={styles.gridRow}>
          {/* Card 1: Total Verifications */}
          <View style={styles.card}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="barcode-outline" size={20} color="#3b82f6" />
            </View>
            <Text style={styles.cardValue}>{stats.total_verifications}</Text>
            <Text style={styles.cardLabel}>Total Scans</Text>
          </View>

          {/* Card 2: Authentic Percentage */}
          <View style={styles.card}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#ecfdf5' }]}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#10b981" />
            </View>
            <Text style={[styles.cardValue, { color: '#10b981' }]}>{stats.authentic_percentage}%</Text>
            <Text style={styles.cardLabel}>Authentic Rate</Text>
          </View>
        </View>

        <View style={styles.gridRow}>
          {/* Card 3: Authentic Count */}
          <View style={[styles.card, styles.successCard]}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#d1fae5' }]}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#059669" />
            </View>
            <Text style={[styles.cardValue, { color: '#047857' }]}>{stats.authentic_count}</Text>
            <Text style={[styles.cardLabel, { color: '#065f46' }]}>Authentic Products</Text>
          </View>

          {/* Card 4: Counterfeit Count */}
          <View style={[styles.card, styles.dangerCard]}>
            <View style={[styles.cardIconContainer, { backgroundColor: '#fee2e2' }]}>
              <Ionicons name="alert-circle-outline" size={20} color="#dc2626" />
            </View>
            <Text style={[styles.cardValue, { color: '#b91c1c' }]}>{stats.counterfeit_count}</Text>
            <Text style={[styles.cardLabel, { color: '#991b1b' }]}>Counterfeits Found</Text>
          </View>
        </View>

        {/* Action Panel */}
        <View style={styles.actionPanel}>
          <Text style={styles.actionTitle}>Secure Scanner</Text>
          <Text style={styles.actionDescription}>
            Scan the unique database-registered barcode/QR code on packaging to instantly check for authenticity.
          </Text>
          <Pressable
            onPress={() => navigation.navigate('Scan')}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="camera" size={18} color="#10b981" style={{ marginRight: 8 }} />
            <Text style={styles.primaryButtonText}>Scan Product Code</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc', // Modern Slate-50 background
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 15,
    marginBottom: 20,
  },
  eyebrow: {
    color: '#0d9488', // Modern teal
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  title: {
    color: '#1e293b', // Slate-800
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  statusPanel: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0', // Slate-200
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  statusIconBg: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  bgSuccessLight: {
    backgroundColor: '#ecfdf5',
  },
  bgDangerLight: {
    backgroundColor: '#fef2f2',
  },
  statusTextContainer: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },
  apiUrl: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 1,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 4,
  },
  textSuccess: {
    color: '#10b981',
  },
  textDanger: {
    color: '#ef4444',
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#10b981',
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    height: 38,
  },
  btnIcon: {
    marginRight: 4,
  },
  secondaryButtonText: {
    color: '#10b981',
    fontSize: 13,
    fontWeight: '700',
  },
  ratingCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  progressCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 6,
    borderColor: '#10b981',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    marginRight: 16,
  },
  progressValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#10b981',
  },
  progressLabel: {
    fontSize: 9,
    color: '#047857',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  ratingInfo: {
    flex: 1,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 4,
  },
  ratingDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  alertNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  alertNoticeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  successCard: {
    backgroundColor: '#ecfdf5',
    borderColor: '#a7f3d0',
  },
  dangerCard: {
    backgroundColor: '#fef2f2',
    borderColor: '#fecaca',
  },
  cardLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    textTransform: 'uppercase',
  },
  cardValue: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1e293b',
    marginBottom: 2,
  },
  actionPanel: {
    backgroundColor: '#10b981', // Emerald theme action banner
    borderRadius: 18,
    padding: 20,
    marginTop: 12,
    alignItems: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 6,
  },
  actionDescription: {
    fontSize: 13,
    color: '#d1fae5',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 20,
    height: 44,
    width: '100%',
  },
  primaryButtonText: {
    color: '#10b981',
    fontSize: 14,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.6,
  },
});
