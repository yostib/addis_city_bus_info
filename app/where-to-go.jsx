import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
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

import {
    AnimatedCard,
    FadeInView,
    SlideInView,
} from "../components/AnimatedCard";
import { AppColors } from "../constants/theme";
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
      {/* Enhanced Header */}
      <LinearGradient
        colors={AppColors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <FadeInView delay={0}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={styles.homeButton}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </FadeInView>
      </LinearGradient>

      {/* Search Form */}
      <ScrollView style={styles.scrollView}>
        <FadeInView delay={200} style={styles.form}>
          <Text style={styles.label}>{t.destinationLabel}</Text>

          <AnimatedCard style={styles.inputCard} shadowLevel="medium">
            <View style={styles.inputContainer}>
              <Ionicons
                name="location"
                size={20}
                color={AppColors.textSecondary}
              />
              <TextInput
                style={styles.input}
                placeholder={t.destinationPlaceholder}
                placeholderTextColor={AppColors.textLight}
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
              {destination.length > 0 && (
                <TouchableOpacity onPress={() => setDestination("")}>
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color={AppColors.textSecondary}
                  />
                </TouchableOpacity>
              )}
            </View>
          </AnimatedCard>

          {suggestions.map((item, index) => (
            <SlideInView
              key={index}
              direction="down"
              delay={300 + index * 50}
              style={styles.suggestionContainer}
            >
              <TouchableOpacity
                style={styles.suggestion}
                onPress={() => {
                  setDestination(item);
                  setSuggestions([]);
                }}
              >
                <Ionicons
                  name="pin"
                  size={16}
                  color={AppColors.primary}
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.suggestionText}>{item}</Text>
              </TouchableOpacity>
            </SlideInView>
          ))}

          <SlideInView
            delay={400}
            direction="up"
            style={styles.buttonContainer}
          >
            <AnimatedCard
              style={styles.searchButton}
              gradientColors={AppColors.gradients.primary}
              onPress={() => {
                Keyboard.dismiss();
                searchBuses();
              }}
            >
              <Ionicons
                name="search"
                size={20}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.searchText}>{t.showBuses}</Text>
            </AnimatedCard>
          </SlideInView>
        </FadeInView>

        {/* Results */}
        <FadeInView delay={500} style={styles.resultsContainer}>
          {results.length > 0 && (
            <Text style={styles.resultsTitle}>
              {results.length} {t.busesFound}
            </Text>
          )}

          {results.map((bus, index) => (
            <SlideInView
              key={bus.id}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={600 + index * 100}
              style={styles.busCardContainer}
            >
              <AnimatedCard
                style={styles.busCard}
                onPress={() => router.push(`/bus-detail/${bus.id}`)}
                shadowLevel="light"
              >
                <LinearGradient
                  colors={AppColors.gradients.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.busCardGradient}
                >
                  <View style={styles.busNumberBadge}>
                    <Text style={styles.busNumberBadgeText}>{bus.number}</Text>
                  </View>
                  <View style={styles.busCardContent}>
                    <Text style={styles.busCardTitle}>{bus.name}</Text>
                    <View style={styles.routeRow}>
                      <Ionicons
                        name="location"
                        size={14}
                        color="rgba(255,255,255,0.8)"
                      />
                      <Text style={styles.busCardSubtitle}>
                        {bus.start} → {bus.end}
                      </Text>
                    </View>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="white"
                    style={{ opacity: 0.7 }}
                  />
                </LinearGradient>
              </AnimatedCard>
            </SlideInView>
          ))}

          {results.length === 0 && destination.length > 0 && (
            <FadeInView delay={600} style={styles.noResultsContainer}>
              <Ionicons
                name="bus-outline"
                size={64}
                color={AppColors.textLight}
              />
              <Text style={styles.noResults}>{t.noResults}</Text>
            </FadeInView>
          )}
        </FadeInView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: AppColors.background },
  scrollView: { flex: 1 },

  /* Header */
  header: {
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  homeButton: {
    padding: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    flex: 1,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },

  /* Search Form */
  form: {
    padding: 20,
  },
  label: {
    fontWeight: "600",
    marginBottom: 12,
    color: AppColors.textPrimary,
    fontSize: 14,
  },
  inputCard: {
    borderRadius: 16,
    marginBottom: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    marginLeft: 12,
    marginRight: 8,
  },

  /* Suggestions */
  suggestionContainer: {
    marginBottom: 8,
  },
  suggestion: {
    backgroundColor: AppColors.surface,
    padding: 12,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    ...AppColors.shadows.light,
  },
  suggestionText: {
    fontSize: 14,
    color: AppColors.textPrimary,
    fontWeight: "500",
  },

  /* Search Button */
  buttonContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  searchButton: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  searchText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* Results */
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },
  busCardContainer: {
    marginBottom: 12,
  },
  busCard: {
    borderRadius: 16,
    overflow: "hidden",
  },
  busCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  busNumberBadge: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  busNumberBadgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  busCardContent: {
    flex: 1,
  },
  busCardTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  busCardSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "500",
  },

  /* No Results */
  noResultsContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  noResults: {
    marginTop: 16,
    color: AppColors.textSecondary,
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
});
