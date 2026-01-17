import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import busData from '../src/data/busData';

export default function RouteSearchScreen() {
  const router = useRouter();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);

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
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>← Back</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Find a Bus Route</Text>

            <View style={{ width: 60 }} />
          </View>

          {/* Form */}
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

            <TouchableOpacity
              style={styles.searchButton}
              onPress={searchRoutes}
            >
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

            {results.length === 0 && from && to && (
              <Text style={styles.noResult}>No matching routes found</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC', // match app background
  },

  scrollContent: {
    paddingBottom: 40,
  },

  customHeader: {
    backgroundColor: '#1E8449',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
  },

  backText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  form: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  label: {
    color: '#334155',
    marginBottom: 6,
    marginTop: 16,
    fontWeight: '500',
  },

  input: {
    backgroundColor: '#E5E7EB',
    color: '#111827',
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

  resultsContainer: {
    marginTop: 20,
  },

  resultItem: {
    backgroundColor: 'white',
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
  },

  resultTitle: {
    fontWeight: 'bold',
    color: '#111827',
  },

  resultSubtitle: {
    color: '#475569',
    marginTop: 4,
  },

  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748B',
  },
});
