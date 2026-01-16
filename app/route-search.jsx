import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Keyboard,
  KeyboardAvoidingView,
  Platform, 
} from 'react-native';
//import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import busData from '../src/data/busData';

export default function RouteSearchScreen() {
  const router = useRouter();

  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);

  // Search function using route data
  const searchRoutes = () => {
  Keyboard.dismiss();

  if (!from || !to) {
    setResults([]);
    return;
  }

  const matches = busData.filter(bus => {
    const route = bus.route.map(stop => stop.toLowerCase());

    const fromIndex = route.indexOf(from.toLowerCase());
    const toIndex = route.indexOf(to.toLowerCase());

    return fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex;
  });

  setResults(matches);
};

  return (
    <KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === 'ios' ? 'padding' : undefined}
>
  <ScrollView
    style={styles.container}
    keyboardShouldPersistTaps="handled"
  >
      {/* Header */}
     <View style={styles.customHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Find a Bus Route</Text>
      </View>

      {/* Inputs */}
      <View style={styles.form}>
        <Text style={styles.label}>From</Text>
        <TextInput
          style={styles.input}
          placeholder="Starting location"
          placeholderTextColor="#888"
          value={from}
          onChangeText={setFrom}
        />

        <Text style={styles.label}>To</Text>
        <TextInput
          style={styles.input}
          placeholder="Destination"
          placeholderTextColor="#888"
          value={to}
          onChangeText={setTo}
        />

        <TouchableOpacity style={styles.searchButton} onPress={searchRoutes}>
          <Text style={styles.searchText}>Search Routes</Text>
        </TouchableOpacity>
        {/* Results */}

        <View style={styles.resultsContainer}>
  {results.map(bus => (
    <TouchableOpacity
      key={bus.id}
      style={styles.resultItem}
      onPress={() => router.push(`/bus-detail/${bus.id}`)}
    >
      <Text style={styles.resultTitle}>
        {bus.number} — {bus.name}
      </Text>
      <Text style={styles.resultSubtitle}>
        {bus.start} → {bus.end}
      </Text>
    </TouchableOpacity>
  ))}
</View>

      </View>
      {results.length === 0 && from && to && (
  <Text style={styles.noResult}>No matching routes found</Text>
)}
    </ScrollView>
</KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // dark mode
    paddingTop: 50,
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
  backButton: {
  marginRight: 10,
},

  backText: {
  color: '#FFFFFF', // White back button text
  fontSize: 16,
  fontWeight: '600',
},
  title: {
  color: '#FFFFFF', // White text
  fontSize: 22,
  fontWeight: 'bold',
  flex: 1, // So title takes remaining space
  textAlign: 'center', // Optional: center text
},
  form: {
  paddingHorizontal: 16,
  paddingBottom: 40,
},
  label: {
  color: '#7F8C8D',
  marginBottom: 6,
  marginTop: 16,
},
  input: {
  backgroundColor: '#FFFFFF',
  color: '#2C3E50',
  padding: 14,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: '#ECF0F1',
},
  searchButton: {
  backgroundColor: '#1E8449',
  padding: 16,
  borderRadius: 14,
  marginTop: 30,
  alignItems: 'center',
},
  searchText: {
  color: '#052E16',
  fontWeight: 'bold',
  fontSize: 16,
},
  resultItem: {
  backgroundColor: '#FFFFFF',
  padding: 16,
  borderRadius: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#ECF0F1',
},


  resultTitle: {
  color: '#2C3E50',
  fontSize: 16,
  fontWeight: 'bold',
},

  resultSubtitle: {
  color: '#7F8C8D',
  marginTop: 4,
},

  noResult: {
  color: '#E74C3C',
  textAlign: 'center',
  marginTop: 30,
  fontSize: 14,
},
  resultsContainer: {
  marginTop: 30,
},

resultItem: {
  backgroundColor: '#020617', // darker than page
  padding: 16,
  borderRadius: 14,
  marginBottom: 14,
  borderWidth: 1,
  borderColor: '#334155',
},

resultTitle: {
  color: '#F8FAFC',
  fontSize: 16,
  fontWeight: 'bold',
},

resultSubtitle: {
  color: '#94A3B8',
  marginTop: 6,
  fontSize: 13,
},
noResult: {
  color: '#F87171',
  textAlign: 'center',
  marginTop: 30,
  fontSize: 14,
},


});
