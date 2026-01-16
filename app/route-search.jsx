import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';

import busData from '../src/data/busData';

export default function RouteSearchScreen() {
  const router = useRouter();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);

  // Search function using route data
  const searchRoutes = () => {
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
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
{results.map(bus => (
  <TouchableOpacity
    key={bus.id}
    onPress={() => router.push(`/bus-detail/${bus.id}`)}
    style={styles.resultItem}
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
      {results.length === 0 && from && to && (
  <Text style={styles.noResult}>No matching routes found</Text>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', // dark mode
    paddingTop: 50,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 10,
  },
  backText: {
    color: '#93C5FD',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  },
  form: {
    paddingHorizontal: 16,
  },
  label: {
    color: '#CBD5E1',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1E293B',
    color: 'white',
    padding: 12,
    borderRadius: 10,
  },
  searchButton: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 12,
    marginTop: 30,
    alignItems: 'center',
  },
  searchText: {
    color: '#052E16',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
