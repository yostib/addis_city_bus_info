import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
  SafeAreaView,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

import { strings } from '../src/i18n/strings';

import busData from '../src/data/busData';
//import styles from '../styles/routeSearchStyles'; // or wherever your styles are

export default function RouteSearchScreen() {
  const router = useRouter();

  const [lang, setLang] = useState('en');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [results, setResults] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [validatedFrom, setValidatedFrom] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState([]);

  // 🔤 Load language
  useEffect(() => {
    AsyncStorage.getItem('lang').then(stored => {
      if (stored) setLang(stored);
    });
  }, []);

  const t = strings[lang].routeSearch;

  const allStops = Array.from(
    new Set(busData.flatMap(bus => bus.route))
  );

  const getValidDestinations = (fromStop) => {
    const destinations = new Set();

    busData.forEach(bus => {
      const idx = bus.route.indexOf(fromStop);
      if (idx !== -1) {
        bus.route.slice(idx + 1).forEach(stop =>
          destinations.add(stop)
        );
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

  useEffect(() => {
    AsyncStorage.getItem('savedRoutes').then(saved => {
      if (saved) setSavedRoutes(JSON.parse(saved));
    });
  }, []);

  const isSaved = id => savedRoutes.includes(id);

  const toggleSave = async id => {
    const updated = isSaved(id)
      ? savedRoutes.filter(r => r !== id)
      : [...savedRoutes, id];

    setSavedRoutes(updated);
    await AsyncStorage.setItem('savedRoutes', JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Header */}
          <View style={styles.customHeader}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.backText}>← {t.back}</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>{t.title}</Text>

            <View style={{ width: 50 }} />
          </View>

          <View style={styles.form}>
            {/* FROM */}
            <Text style={styles.label}>{t.from}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.fromPlaceholder}
              value={from}
              onChangeText={text => {
                setFrom(text);
                setValidatedFrom(null);
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
                  setFrom(item);
                  setValidatedFrom(item);
                  setFromSuggestions([]);
                  setTo('');
                  setToSuggestions([]);
                  setResults([]);
                }}
              >
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            ))}

            {/* TO */}
            <Text style={styles.label}>{t.to}</Text>
            <TextInput
              style={styles.input}
              placeholder={t.toPlaceholder}
              value={to}
              onChangeText={text => {
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

            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => {
                Keyboard.dismiss();
                searchRoutes();
              }}
            >
              <Text style={styles.searchText}>{t.search}</Text>
            </TouchableOpacity>

            {results.map(bus => (
              <TouchableOpacity
                key={bus.id}
                style={styles.busCard}
                onPress={() =>
                  router.push(`/bus-detail/${bus.id}`)
                }
              >
                <View style={styles.busHeader}>
                  <View style={styles.busNumber}>
                    <Text style={styles.busNumberText}>
                      {bus.number}
                    </Text>
                  </View>

                  <View style={styles.busInfo}>
                    <Text style={styles.busName}>{bus.name}</Text>
                    <Text style={styles.busRoute}>
                      {bus.start} → {bus.end}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleSave(bus.id)}
                  >
                    <Text style={{ fontSize: 22 }}>
                      {isSaved(bus.id) ? '⭐' : '☆'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}

            {results.length === 0 && from && to && (
              <Text style={styles.noResult}>
                {t.noResults}
              </Text>
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
starButton: {
  marginLeft: 10,
  padding: 6,
},

starText: {
  fontSize: 20,
},
});
