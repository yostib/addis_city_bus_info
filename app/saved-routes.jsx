import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Platform,
  ActivityIndicator  // ← ADDED for loading state
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import busData from '../src/data/busData';
import { strings } from '../src/i18n/strings';

export default function SavedRoutesScreen() {
  const router = useRouter();
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [lang, setLang] = useState('en');
  const [loading, setLoading] = useState(true);  // ← ADDED loading state

  // Load language and saved routes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load language
        const savedLang = await AsyncStorage.getItem('lang');
        if (savedLang) setLang(savedLang);
        
        // Load saved routes
        const saved = await AsyncStorage.getItem('savedRoutes');
        if (saved) setSavedRoutes(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);  // ← Set loading to false when done
      }
    };
    loadData();
  }, []);
  
  // Safely get translations with fallback
  const getTranslation = () => {
    const langObj = strings[lang];
    if (!langObj) return strings['en'].savedRoutesScreen;
    
    return langObj.savedRoutesScreen || strings['en'].savedRoutesScreen;
  };
  
  const t = getTranslation();

  // Remove a route from saved routes
  const removeSavedRoute = async (id) => {
    const updated = savedRoutes.filter(rid => rid !== id);
    setSavedRoutes(updated);
    await AsyncStorage.setItem('savedRoutes', JSON.stringify(updated));
  };

  // Render each saved bus item
  const renderBusItem = ({ item }) => {
    const bus = busData.find(b => b.id === item);
    if (!bus) return null;

    return (
      <View style={styles.busCard}>
        {/* Tap area → go to details */}
        <TouchableOpacity
          style={styles.busMain}
          onPress={() => router.push(`/bus-detail/${bus.id}`)}
        >
          <View style={styles.busHeader}>
            <View style={styles.busNumber}>
              <Text style={styles.busNumberText}>{bus.number}</Text>
            </View>
            <View style={styles.busInfo}>
              <Text style={styles.busName}>{bus.name}</Text>
              <Text style={styles.busRoute}>
                {bus.start} → {bus.end}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Remove button - using translation */}
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => removeSavedRoute(bus.id)}
        >
          <Text style={styles.removeText}>{t.remove || 'Remove'}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Show loading indicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E8449" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← {t.back || 'Back'}</Text>
        </TouchableOpacity>
        
        <Text style={styles.customHeaderTitle}>{t.title || 'Saved'}</Text>
        
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>{t.home || 'Home'}</Text>
        </TouchableOpacity>
      </View>

      {savedRoutes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{t.emptyTitle || 'No saved routes yet'}</Text>
          <Text style={styles.emptySubtext}>{t.emptySubtitle || 'Tap the ⭐ on any bus to save it'}</Text>
        </View>
      ) : (
        <FlatList
          data={savedRoutes}
          renderItem={renderBusItem}
          keyExtractor={(item) => item}
          contentContainerStyle={{ padding: 15 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  customHeader: {
    backgroundColor: '#1E8449',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingBottom: 15,
  },
  
  backButton: { padding: 8 },
  backButtonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  customHeaderTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFF' },
  
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  homeButtonText: { color: '#FFF', fontSize: 14, fontWeight: '600' },

  busCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  
  busHeader: { flexDirection: 'row', alignItems: 'center' },
  
  busNumber: {
    backgroundColor: '#C0392B',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  
  busNumberText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  busInfo: { flex: 1 },
  busName: { fontSize: 16, fontWeight: '600', color: '#2C3E50', marginBottom: 3 },
  busRoute: { fontSize: 13, color: '#7F8C8D' },

  busMain: {
    flex: 1,
  },

  emptyContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 40 
  },
  
  emptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#95A5A6', 
    marginBottom: 10,
    textAlign: 'center',  // ← ADDED for better text rendering
  },
  
  emptySubtext: { 
    fontSize: 14, 
    color: '#BDC3C7', 
    textAlign: 'center' 
  },

  removeButton: {
    marginTop: 10,
    alignSelf: 'flex-end',
    backgroundColor: '#FEE2E2',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  removeText: {
    color: '#B91C1C',
    fontWeight: '600',
    fontSize: 14,
  },
});