import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// Same sample data as in bus-list.jsx
const busData = [
  {
    id: '1',
    number: '1',
    name: 'Megenagna - Kara',
    start: 'Megenagna',
    through: 'Gurd Shola',
    end: 'Kara',
    distance: '7.7 Km',
    fare: '1.4 Birr',
    route: ['Megenagna', 'Gurd Shola', 'Kara']
  },
  {
    id: '2',
    number: '2',
    name: 'Autobus Tera - Kality',
    start: 'Autobus Tera',
    through: 'Mekanisa',
    end: 'Kality',
    distance: '9.2 Km',
    fare: '1.6 Birr',
    route: ['Autobus Tera', 'Mekanisa', 'Kality']
  },
  {
    id: '3',
    number: '3',
    name: 'Megenagna - Kara',
    start: 'Megenagna',
    through: 'Jemo',
    end: 'Kara',
    distance: '8.1 Km',
    fare: '1.5 Birr',
    route: ['Megenagna', 'Jemo', 'Kara']
  },
  {
    id: '4',
    number: '4',
    name: 'Merkato - Bole',
    start: 'Merkato',
    through: 'Piazza',
    end: 'Bole',
    distance: '8.5 Km',
    fare: '1.7 Birr',
    route: ['Merkato', 'Piazza', 'Mexico', 'Bole']
  }
];

export default function BusDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const bus = busData.find(b => b.id === id);

  if (!bus) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Bus not found</Text>
        <Text style={styles.errorSubtext}>Bus ID: {id}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Custom Header */}
      <View style={styles.customHeader}>
  <TouchableOpacity
    style={[styles.navButton, styles.backBtn]}
    onPress={() => router.back()}
  >
    <Text style={styles.navButtonText}>← Back</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.navButton, styles.centerBtn]}
    onPress={() => router.push('/bus-list')}
  >
    <Text style={styles.navButtonText}>City Buses</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.navButton, styles.homeBtn]}
    onPress={() => router.push('/')}
  >
    <Text style={styles.navButtonText}>Home</Text>
  </TouchableOpacity>
</View>


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

      {/* Trip Info */}
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

      {/* Stops */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Full Route Stops</Text>
        {bus.route.map((stop, index) => (
          <View key={index} style={styles.stopItem}>
            <Text style={styles.stopNumber}>{index + 1}</Text>
            <Text style={styles.stopName}>{stop}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>
          ℹ️ This app works offline. All data is stored on your device.
        </Text>
      </View>

    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
  backgroundColor: '#2C3E50', // Change this to:
  backgroundColor: '#1E8449', // Your green color
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
  errorText: {
    fontSize: 20,
    color: '#E74C3C',
    textAlign: 'center',
    marginTop: 50,
    fontWeight: 'bold',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
    marginTop: 10,
  },
  customHeader: {
  backgroundColor: '#1E8449',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 10,
  paddingTop: 45,
  paddingBottom: 12,
},

navButton: {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  minWidth: 90,
  alignItems: 'center',
},

backBtn: {
  backgroundColor: '#145A32',
},

centerBtn: {
  backgroundColor: '#F1C40F', // Ethiopian yellow
},

homeBtn: {
  backgroundColor: '#922B21',
},

navButtonText: {
  color: '#FFF',
  fontWeight: '600',
  fontSize: 14,
},

});