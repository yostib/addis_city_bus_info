import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView 
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import busData from '../data/busData';

const BusDetailScreen = () => {
  const { id } = useLocalSearchParams();
  
  // Find the bus by id
  const bus = busData.find(b => b.id === id);
  
  if (!bus) {
    return (
      <View style={styles.container}>
        <Text>Bus not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.busNumberLarge}>
          <Text style={styles.busNumberText}>{bus.number}</Text>
        </View>
        
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{bus.name}</Text>
          <Text style={styles.routeSubtitle}>
            {bus.start} → {bus.end}
          </Text>
        </View>
      </View>

      {/* Route Details */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Route Details</Text>
        
        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.startIcon]}>
            <Text style={styles.stepText}>S</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Starting Point</Text>
            <Text style={styles.stepLocation}>{bus.start}</Text>
          </View>
        </View>
        
        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.viaIcon]}>
            <Text style={styles.stepText}>V</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Via</Text>
            <Text style={styles.stepLocation}>{bus.through}</Text>
          </View>
        </View>
        
        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.endIcon]}>
            <Text style={styles.stepText}>E</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>Destination</Text>
            <Text style={styles.stepLocation}>{bus.end}</Text>
          </View>
        </View>
      </View>

      {/* Fare & Distance */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Information</Text>
        
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Fare</Text>
            <Text style={styles.infoValue}>{bus.fare}</Text>
          </View>
          
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Distance</Text>
            <Text style={styles.infoValue}>{bus.distance}</Text>
          </View>
        </View>
      </View>

      {/* Full Route */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Route Stops</Text>
        {bus.route.map((stop, index) => (
          <View key={index} style={styles.stopItem}>
            <Text style={styles.stopNumber}>{index + 1}</Text>
            <Text style={styles.stopName}>{stop}</Text>
          </View>
        ))}
      </View>

      {/* Note */}
      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          ℹ️ This app works offline. All data is stored on your device.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  busNumberLarge: {
    backgroundColor: '#E74C3C',
    width: 70,
    height: 70,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  busNumberText: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  routeSubtitle: {
    fontSize: 14,
    color: '#BDC3C7',
  },
  section: {
    backgroundColor: 'white',
    margin: 15,
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 15,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  startIcon: {
    backgroundColor: '#27AE60',
  },
  viaIcon: {
    backgroundColor: '#3498DB',
  },
  endIcon: {
    backgroundColor: '#E74C3C',
  },
  stepText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    color: '#7F8C8D',
    marginBottom: 3,
  },
  stepLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2C3E50',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoBox: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#F8F9F9',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  infoLabel: {
    fontSize: 14,
    color: '#7F8C8D',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  stopItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ECF0F1',
  },
  stopNumber: {
    backgroundColor: '#BDC3C7',
    width: 25,
    height: 25,
    borderRadius: 12.5,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  stopName: {
    fontSize: 16,
    color: '#34495E',
  },
  noteBox: {
    backgroundColor: '#EBF5FB',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
  },
  noteText: {
    fontSize: 14,
    color: '#3498DB',
    textAlign: 'center',
  },
});

export default BusDetailScreen;