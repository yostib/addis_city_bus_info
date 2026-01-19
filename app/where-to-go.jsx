import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import busData from '../src/data/busData';
import { Keyboard } from 'react-native';


const allStops = Array.from(
  new Set(busData.flatMap(bus => bus.route))
);


export default function WhereToGoScreen() {
  const router = useRouter();
  const [destination, setDestination] = useState('');


  //Auto suggestions state for destination input
  const [suggestions, setSuggestions] = useState([]);

  //Find routes going to the destination
  const [results, setResults] = useState([]);

  // Search buses that go to the specified destination
  const searchBuses = () => {
  if (!destination) return;

  const matches = busData.filter(bus =>
    bus.route.some(
      stop => stop.toLowerCase() === destination.toLowerCase()
    )
  );

  setResults(matches);
};




  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.customHeader}>
  <TouchableOpacity onPress={() => router.back()}>
    <Text style={styles.headerButtonText}>← Back</Text>
  </TouchableOpacity>

  <Text style={styles.headerTitle}>Where do you want to go?</Text>

  <View style={{ width: 60 }} />
</View>


      <View style={styles.form}>
        <Text style={styles.label}>Destination</Text>
        <TextInput
  style={styles.input}
  placeholder="Type destination (e.g. Merkato)"
  value={destination}
  onChangeText={(text) => {
    setDestination(text);

    if (!text) {
      setSuggestions([]);
      return;
    }

    const matches = allStops.filter(stop =>
      stop.toLowerCase().includes(text.toLowerCase())
    );

    setSuggestions(matches.slice(0, 6));
  }}
/>

{suggestions.map((item, index) => (
  <TouchableOpacity
    key={index}
    style={styles.suggestionItem}
    onPress={() => {
      setDestination(item);
      setSuggestions([]);
    }}
  >
    <Text style={styles.suggestionText}>{item}</Text>
  </TouchableOpacity>
))}
<TouchableOpacity
  style={styles.searchButton}
  onPress={() => {
    Keyboard.dismiss();
    searchBuses();
  }}
>
  <Text style={styles.searchButtonText}>Show Buses</Text>
</TouchableOpacity>



<View style={styles.resultsContainer}>
  {results.map(bus => (
    <TouchableOpacity
      key={bus.id}
      style={styles.busCard}
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
  ))}
</View>




      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  customHeader: {
  backgroundColor: '#1E8449',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 15,
  paddingTop: 50,
  paddingBottom: 15,
},
headerTitle: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},
headerButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: '600',
},
searchButton: {
  backgroundColor: '#27AE60',
  paddingVertical: 14,
  borderRadius: 12,
  marginTop: 20,
  alignItems: 'center',
},

searchButtonText: {
  color: 'white',
  fontSize: 16,
  fontWeight: 'bold',
},

  backText: {
    color: 'white',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  label: {
    marginBottom: 6,
    color: '#334155',
  },
  input: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 10,
  },
  suggestionItem: {
  padding: 12,
  backgroundColor: 'white',
  borderBottomWidth: 1,
  borderBottomColor: '#E5E7EB',
},
suggestionText: {
  color: '#1F2937',
},
resultsContainer: {
  marginTop: 20,
},

busCard: {
  backgroundColor: 'white',
  borderRadius: 12,
  padding: 14,
  marginBottom: 12,
  elevation: 3,
},

busHeader: {
  flexDirection: 'row',
  alignItems: 'center',
},

busNumber: {
  backgroundColor: '#E74C3C',
  width: 48,
  height: 48,
  borderRadius: 12,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 14,
},

busNumberText: {
  color: 'white',
  fontWeight: 'bold',
  fontSize: 18,
},

busInfo: {
  flex: 1,
},

busName: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1F2937',
},

busRoute: {
  color: '#64748B',
  marginTop: 4,
},


});
