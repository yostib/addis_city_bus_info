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
import { Keyboard } from 'react-native';

const allStops = Array.from(
  new Set(busData.flatMap(bus => bus.route))
);

export default function RouteSearchScreen() {
  const router = useRouter();

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [validatedFrom, setValidatedFrom] = useState(null);


  const getValidDestinations = (fromStop) => {
    const destinations = new Set();

    busData.forEach(bus => {
      const idx = bus.route.indexOf(fromStop);
      if (idx !== -1) {
        bus.route.slice(idx + 1).forEach(stop => destinations.add(stop));
      }
    });

    return Array.from(destinations);
  };

  const searchRoutes = () => {
    if (!from || !to) {
      setResults([]);
      return;
    }

    const matches = busData.filter(bus => {
      const route = bus.route.map(s => s.toLowerCase());
      const f = route.indexOf(from.toLowerCase());
      const t = route.indexOf(to.toLowerCase());
      return f !== -1 && t !== -1 && f < t;
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
          keyboardShouldPersistTaps="always"
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

          <View style={styles.form}>
            {/* FROM */}
            <Text style={styles.label}>From</Text>
            <TextInput
              style={styles.input}
              placeholder="Starting location"
              value={from}
              onChangeText={(text) => {
                setFrom(text);
                setTo('');
                setResults([]);

                if (!text) {
                  setFromSuggestions([]);
                  return;
                }

                setFromSuggestions(
                  allStops
                    .filter(s =>
                      s.toLowerCase().includes(text.toLowerCase())
                    )
                    .slice(0, 6)
                );
              }}
            />

            {fromSuggestions.map((item, idx) => (
  <TouchableOpacity
    key={idx}
    style={styles.suggestionItem}
    onPress={() => {
      setFrom(item);             // sets the visible FROM input
      setValidatedFrom(item);    // ✅ store the validated FROM for TO suggestions
      setFromSuggestions([]);    // clear FROM suggestions
      setTo('');                 // clear TO input
      setToSuggestions([]);      // clear TO suggestions
      setResults([]);            // clear previous search results if any
    }}
  >
    <Text style={styles.suggestionText}>{item}</Text>
  </TouchableOpacity>
))}


            {/* TO */}
            <Text style={styles.label}>To</Text>
            <TextInput
              style={styles.input}
              placeholder="Destination"
              value={to}
              onChangeText={(text) => {
                setTo(text);
                setResults([]);

                if (!validatedFrom || !text) {
                  setToSuggestions([]);
                  return;
                }

                setToSuggestions(
                  getValidDestinations(validatedFrom)

                    .filter(s =>
                      s.toLowerCase().includes(text.toLowerCase())
                    )
                    .slice(0, 6)
                );
              }}
            />

            {toSuggestions.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionItem}
                onPress={() => {
                  setTo(item);
                  setToSuggestions([]);
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}



            <TouchableOpacity style={styles.searchButton} onPress={() => {Keyboard.dismiss(); searchRoutes();}}>
              <Text style={styles.searchText}>Search Routes</Text>
            </TouchableOpacity>



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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  customHeader: {
    backgroundColor: '#1E8449',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  backText: {
    color: 'white',
    fontWeight: '600',
  },
  headerTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  form: {
    padding: 16,
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    fontWeight: '500',
    color: '#334155',
  },
  input: {
    backgroundColor: '#E5E7EB',
    padding: 12,
    borderRadius: 10,
  },
  suggestionItem: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  suggestionText: {
    color: '#1F2937',
  },
  searchButton: {
    backgroundColor: '#22C55E',
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: 'center',
  },
  searchText: {
    fontWeight: 'bold',
    color: '#052E16',
  },
  resultItem: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  resultTitle: {
    fontWeight: 'bold',
  },
  resultSubtitle: {
    marginTop: 4,
    color: '#475569',
  },
  noResult: {
    textAlign: 'center',
    marginTop: 20,
    color: '#64748B',
  },
});
