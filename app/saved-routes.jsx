import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import busData from '../src/data/busData';

export default function SavedRoutesScreen() {
  const router = useRouter();
  const [savedRoutes, setSavedRoutes] = useState([]);

  useEffect(() => {
    const loadSavedRoutes = async () => {
      const saved = await AsyncStorage.getItem('savedRoutes');
      if (saved) setSavedRoutes(JSON.parse(saved));
    };
    loadSavedRoutes();
  }, []);
  

  const renderBusItem = ({ item }) => {
    const bus = busData.find(b => b.id === item);
    if (!bus) return null;

    return (
      <TouchableOpacity 
        style={styles.busCard}
        onPress={() => router.push(`/bus-detail/${bus.id}`)}
      >
        <View style={styles.busHeader}>
          <View style={styles.busNumber}>
            <Text style={styles.busNumberText}>{bus.number}</Text>
          </View>
          <View style={styles.busInfo}>
            <Text style={styles.busName}>{bus.name}</Text>
            <Text style={styles.busRoute}>{bus.start} → {bus.end}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>Saved Routes</Text>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => router.push('/')}
        >
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {savedRoutes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No saved routes yet</Text>
          <Text style={styles.emptySubtext}>Tap the ⭐ on any bus to save it</Text>
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

  customHeader: {
  backgroundColor: '#1E8449',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
  paddingTop: Platform.OS === 'ios' ? 50 : 20, // adjusts for status bar
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

  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emptyText: { fontSize: 18, fontWeight: '600', color: '#95A5A6', marginBottom: 10 },
  emptySubtext: { fontSize: 14, color: '#BDC3C7', textAlign: 'center' },
});
