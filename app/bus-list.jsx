import React, { useState ,useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  TextInput
} from 'react-native';
import { Link, useRouter } from 'expo-router'; // ✅ Added useRouter
import AsyncStorage from '@react-native-async-storage/async-storage';

import sampleBusData from '../src/data/busData';

const [savedRoutes, setSavedRoutes] = useState([]);


export default function BusListScreen() {
  const [searchText, setSearchText] = useState('');
  const [buses] = useState(sampleBusData);
  const router = useRouter(); // ✅ This creates the router object
  const [savedRoutes, setSavedRoutes] = useState([]);

  // Filter buses based on search
  const filteredBuses = buses.filter(bus => 
    bus.number.toLowerCase().includes(searchText.toLowerCase()) ||
    bus.name.toLowerCase().includes(searchText.toLowerCase()) ||
    bus.start.toLowerCase().includes(searchText.toLowerCase()) ||
    bus.end.toLowerCase().includes(searchText.toLowerCase()) ||
    bus.through.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
  const loadSavedRoutes = async () => {
    try {
      const saved = await AsyncStorage.getItem('savedRoutes');
      if (saved) {
        setSavedRoutes(JSON.parse(saved));
      }
    } catch (e) {
      console.log('Failed to load saved routes', e);
    }
  };
  loadSavedRoutes();
}, []);

const toggleSavedRoute = async (busId) => {
  let updatedSaved;
  if (savedRoutes.includes(busId)) {
    // Remove from saved
    updatedSaved = savedRoutes.filter(id => id !== busId);
  } else {
    // Add to saved
    updatedSaved = [...savedRoutes, busId];
  }

  setSavedRoutes(updatedSaved);

  try {
    await AsyncStorage.setItem('savedRoutes', JSON.stringify(updatedSaved));
  } catch (e) {
    console.log('Failed to save routes', e);
  }
};



  const renderBusItem = ({ item }) => (
    <Link href={`/bus-detail/${item.id}`} asChild>
      <TouchableOpacity style={styles.busCard}>
        <View style={styles.busHeader}>
          <View style={styles.busNumber}>
            <Text style={styles.busNumberText}>{item.number}</Text>
          </View>
          
          <View style={styles.busInfo}>
            <Text style={styles.busName}>{item.name}</Text>
            <Text style={styles.busRoute}>
              {item.start} → {item.end}
            </Text>
      
            <TouchableOpacity onPress={() => toggleSavedRoute(item.id)} style={styles.starButton}>
    <Text style={{ fontSize: 24 }}>
      {savedRoutes.includes(item.id) ? '⭐' : '☆'}
    </Text>
  </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.busDetails}>
          <Text style={styles.detailText}>
            <Text style={styles.detailLabel}>Via: </Text>
            {item.through}
          </Text>
          
          <View style={styles.busFooter}>
            <Text style={styles.fare}>{item.fare}</Text>
            <Text style={styles.distance}>{item.distance}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.customHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}> 
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.customHeaderTitle}>City Buses</Text>
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/')}> 
          <Text style={styles.homeButtonText}>Home</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search bus number or route..."
          placeholderTextColor="#95A5A6"
          value={searchText}
          onChangeText={setSearchText}
        />
        {searchText.length > 0 && (
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={() => setSearchText('')}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredBuses.length} of {buses.length} buses
        </Text>
        <Text style={styles.tapHint}>Tap any bus for details</Text>
      </View>
      
      <FlatList
        data={filteredBuses}
        renderItem={renderBusItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>🚌 No buses found</Text>
            <Text style={styles.emptySubtext}>
              Try searching with a different bus number or location
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  // Custom Header
  customHeader: {
    backgroundColor: '#1E8449', // ✅ Matching your green theme
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  customHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  homeButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  homeButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
  },
  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#F8F9F9',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    color: '#2C3E50',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  clearButton: {
    marginLeft: 10,
    backgroundColor: '#ECF0F1',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#7F8C8D',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Results
  resultsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  resultsText: {
    fontSize: 14,
    color: '#7F8C8D',
  },
  tapHint: {
    fontSize: 12,
    color: '#3498DB',
    fontStyle: 'italic',
  },
  list: {
    padding: 15,
    paddingTop: 0,
  },
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
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  busNumber: {
    backgroundColor: '#C0392B', // ✅ Matching your red theme
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  busNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 3,
  },
  busRoute: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  busDetails: {
    paddingLeft: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  busFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  distance: {
    fontSize: 14,
    color: '#3498DB',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#95A5A6',
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#BDC3C7',
    textAlign: 'center',
  },
  starButton: {
  position: 'absolute',
  top: 10,
  right: 10,
},

});