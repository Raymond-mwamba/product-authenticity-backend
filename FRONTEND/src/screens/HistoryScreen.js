import React, { useState, useCallback } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { API_BASE_URL } from '../services/api';

export default function HistoryScreen() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, authentic, counterfeit

  const fetchHistory = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const response = await fetch(`${API_BASE_URL}/verifications`);
      if (response.ok) {
        const json = await response.json();
        if (json.status === 'success' && Array.isArray(json.data)) {
          setVerifications(json.data);
        }
      }
    } catch (error) {
      console.error('Fetch history error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHistory();
    }, [fetchHistory])
  );

  const getFilteredData = () => {
    return verifications.filter((item) => {
      // 1. Search Query filter (matches product code, name, or manufacturer name)
      const q = searchQuery.toLowerCase().trim();
      const codeMatches = item.unique_code?.toLowerCase().includes(q);
      const nameMatches = item.name?.toLowerCase().includes(q);
      const mfrMatches = item.manufacturer_name?.toLowerCase().includes(q);
      
      const matchesSearch = !q || codeMatches || nameMatches || mfrMatches;

      // 2. Tab Filter
      if (filterType === 'authentic') {
        return matchesSearch && item.verification_result === 'authentic';
      } else if (filterType === 'counterfeit') {
        return matchesSearch && item.verification_result === 'counterfeit';
      }
      return matchesSearch;
    });
  };

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } catch (_) {
      return isoString;
    }
  };

  const renderItem = ({ item }) => {
    const isAuthentic = item.verification_result === 'authentic';
    const isUSSD = item.channel?.toLowerCase() === 'ussd';

    return (
      <View style={[styles.historyCard, isAuthentic ? styles.cardSuccessBorder : styles.cardDangerBorder]}>
        <View style={styles.cardHeader}>
          <Text style={styles.productCode}>{item.unique_code}</Text>
          <View style={[styles.badge, isAuthentic ? styles.badgeSuccess : styles.badgeDanger]}>
            <Ionicons
              name={isAuthentic ? 'shield-checkmark' : 'alert-circle'}
              size={12}
              color={isAuthentic ? '#059669' : '#dc2626'}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.badgeText, isAuthentic ? styles.textSuccess : styles.textDanger]}>
              {isAuthentic ? 'Authentic' : 'Counterfeit'}
            </Text>
          </View>
        </View>

        <Text style={styles.productName}>{item.name || 'Unknown Product'}</Text>
        <Text style={styles.manufacturerName}>
          Mfr: {item.manufacturer_name || 'Unspecified Manufacturer'}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.metaRow}>
            <Ionicons name={isUSSD ? 'radio-outline' : 'phone-portrait-outline'} size={14} color="#64748b" style={{ marginRight: 4 }} />
            <Text style={styles.metaText}>
              Channel: <Text style={styles.metaValue}>{item.channel?.toUpperCase() || 'APP'}</Text>
            </Text>
          </View>
          
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={14} color="#64748b" style={{ marginRight: 4 }} />
            <Text style={styles.metaText}>
              Loc: <Text style={styles.metaValue}>{item.location || 'N/A'}</Text>
            </Text>
          </View>
        </View>
        <Text style={styles.timeText}>{formatDate(item.verification_time)}</Text>
      </View>
    );
  };

  const filteredData = getFilteredData();
  const authenticCount = verifications.filter(v => v.verification_result === 'authentic').length;
  const counterfeitCount = verifications.filter(v => v.verification_result === 'counterfeit').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8fafc" />
      
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Audit Registry</Text>
        <Text style={styles.title}>History Log</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="#64748b" style={{ marginRight: 8 }} />
          <TextInput
            onChangeText={setSearchQuery}
            placeholder="Search code, product, manufacturer..."
            placeholderTextColor="#94a3b8"
            style={styles.searchInput}
            value={searchQuery}
            clearButtonMode="while-editing"
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          onPress={() => setFilterType('all')}
          style={[styles.tabButton, filterType === 'all' && styles.tabButtonActive]}
        >
          <Ionicons name="grid-outline" size={13} color={filterType === 'all' ? '#ffffff' : '#64748b'} style={{ marginRight: 4 }} />
          <Text style={[styles.tabButtonText, filterType === 'all' && styles.tabButtonTextActive]}>
            All ({verifications.length})
          </Text>
        </Pressable>
        
        <Pressable
          onPress={() => setFilterType('authentic')}
          style={[styles.tabButton, filterType === 'authentic' && styles.tabButtonActive]}
        >
          <Ionicons name="shield-checkmark-outline" size={13} color={filterType === 'authentic' ? '#ffffff' : '#059669'} style={{ marginRight: 4 }} />
          <Text style={[styles.tabButtonText, filterType === 'authentic' && styles.tabButtonTextActive, { color: filterType === 'authentic' ? '#ffffff' : '#059669' }]}>
            Legit ({authenticCount})
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setFilterType('counterfeit')}
          style={[styles.tabButton, filterType === 'counterfeit' && styles.tabButtonActive]}
        >
          <Ionicons name="alert-circle-outline" size={13} color={filterType === 'counterfeit' ? '#ffffff' : '#dc2626'} style={{ marginRight: 4 }} />
          <Text style={[styles.tabButtonText, filterType === 'counterfeit' && styles.tabButtonTextActive, { color: filterType === 'counterfeit' ? '#ffffff' : '#dc2626' }]}>
            Fakes ({counterfeitCount})
          </Text>
        </Pressable>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={filteredData}
          keyExtractor={(item) => String(item.id)}
          onRefresh={() => fetchHistory(true)}
          refreshing={refreshing}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="folder-open-outline" size={48} color="#94a3b8" style={{ marginBottom: 12 }} />
              <Text style={styles.emptyText}>No records found matching query.</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '600',
    height: 44,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 6,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 24,
    borderColor: '#e2e8f0',
    borderWidth: 1,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 4,
    elevation: 1,
  },
  tabButtonActive: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  tabButtonText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '700',
  },
  tabButtonTextActive: {
    color: '#ffffff',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  historyCard: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#1e293b',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  cardSuccessBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  cardDangerBorder: {
    borderLeftWidth: 4,
    borderLeftColor: '#ef4444',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  productCode: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1e293b',
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
  },
  badgeDanger: {
    backgroundColor: '#fee2e2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  textSuccess: {
    color: '#059669',
  },
  textDanger: {
    color: '#dc2626',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  manufacturerName: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopColor: '#f1f5f9',
    borderTopWidth: 1,
    paddingTop: 10,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 11,
    color: '#64748b',
  },
  metaValue: {
    fontWeight: '700',
    color: '#334155',
  },
  timeText: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 8,
    textAlign: 'right',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
});
