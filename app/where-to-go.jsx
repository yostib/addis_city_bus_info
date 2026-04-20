import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Keyboard,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import busData from "../src/data/busData";
import { strings } from "../src/i18n/strings";

const allStops = Array.from(new Set(busData.flatMap((bus) => bus.route)));

export default function WhereToGoScreen() {
  const router = useRouter();

  // 🌍 language (simple + safe)
  const [lang, setLang] = useState("en");

  useEffect(() => {
    AsyncStorage.getItem("lang").then((storedLang) => {
      if (storedLang) setLang(storedLang);
    });
  }, []);

  const t = strings[lang]?.findDestination || strings["en"].findDestination; // ← CHANGED to findDestination

  const [destination, setDestination] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  const searchBuses = () => {
    if (!destination) return;

    const matches = busData.filter((bus) =>
      bus.route.some(
        (stop) => stop.toLowerCase() === destination.toLowerCase(),
      ),
    );

    setResults(matches);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.headerButton}>← {t.back}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t.title}</Text>

        <View style={{ width: 60 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>{t.destinationLabel}</Text>

        <TextInput
          style={styles.input}
          placeholder={t.destinationPlaceholder}
          value={destination}
          onChangeText={(text) => {
            setDestination(text);

            if (!text) {
              setSuggestions([]);
              return;
            }

            const matches = allStops.filter((stop) =>
              stop.toLowerCase().includes(text.toLowerCase()),
            );

            setSuggestions(matches.slice(0, 6));
          }}
        />

        {suggestions.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.suggestion}
            onPress={() => {
              setDestination(item);
              setSuggestions([]);
            }}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.searchButton}
          onPress={() => {
            Keyboard.dismiss();
            searchBuses();
          }}
        >
          <Text style={styles.searchText}>{t.showBuses}</Text>
        </TouchableOpacity>

        <ScrollView>
          {results.map((bus) => (
            <TouchableOpacity
              key={bus.id}
              style={styles.busCard}
              onPress={() => router.push(`/bus-detail/${bus.id}`)}
            >
              <Text style={styles.busCardTitle}>
                {bus.number} — {bus.name}
              </Text>
              <Text style={styles.busCardSubtitle}>
                {bus.start} → {bus.end}
              </Text>
            </TouchableOpacity>
          ))}

          {results.length === 0 && destination.length > 0 && (
            <Text style={styles.noResults}>{t.noResults}</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  header: {
    backgroundColor: "#1E8449",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  headerButton: { color: "#fff", fontSize: 16 },
  form: { padding: 16 },
  label: { fontWeight: "600", marginBottom: 6 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  suggestion: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  searchButton: {
    backgroundColor: "#1E8449",
    padding: 14,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: "center",
  },
  searchText: { color: "#fff", fontWeight: "bold" },
  busCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  busCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  busCardSubtitle: {
    color: "#4B5563",
  },
  noResults: {
    marginTop: 18,
    color: "#475569",
    fontSize: 15,
    textAlign: "center",
  },
});
