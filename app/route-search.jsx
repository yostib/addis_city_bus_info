import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

import {
    AnimatedCard,
    FadeInView,
    SlideInView,
} from "../components/AnimatedCard";
import { AppColors } from "../constants/theme";
import busData from "../src/data/busData";
import { strings } from "../src/i18n/strings";

export default function RouteSearchScreen() {
  const router = useRouter();

  const [lang, setLang] = useState("en");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [results, setResults] = useState([]);
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [validatedFrom, setValidatedFrom] = useState(null);
  const [savedRoutes, setSavedRoutes] = useState([]);

  // 🔤 Load language
  useEffect(() => {
    AsyncStorage.getItem("lang").then((stored) => {
      if (stored) setLang(stored);
    });
  }, []);

  const t = strings[lang].routeSearch;

  const allStops = Array.from(new Set(busData.flatMap((bus) => bus.route)));

  const getValidDestinations = (fromStop) => {
    const destinations = new Set();

    busData.forEach((bus) => {
      const idx = bus.route.indexOf(fromStop);
      if (idx !== -1) {
        bus.route.slice(idx + 1).forEach((stop) => destinations.add(stop));
      }
    });

    return Array.from(destinations);
  };

  const searchRoutes = () => {
    if (!from || !to) {
      setResults([]);
      return;
    }

    const matches = busData.filter((bus) => {
      const route = bus.route.map((s) => s.toLowerCase());
      const f = route.indexOf(from.toLowerCase());
      const t = route.indexOf(to.toLowerCase());
      return f !== -1 && t !== -1 && f < t;
    });

    setResults(matches);
  };

  useEffect(() => {
    AsyncStorage.getItem("savedRoutes").then((saved) => {
      if (saved) setSavedRoutes(JSON.parse(saved));
    });
  }, []);

  const isSaved = (id) => savedRoutes.includes(id);

  const toggleSave = async (id) => {
    const updated = isSaved(id)
      ? savedRoutes.filter((r) => r !== id)
      : [...savedRoutes, id];

    setSavedRoutes(updated);
    await AsyncStorage.setItem("savedRoutes", JSON.stringify(updated));
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Enhanced Header */}
          <LinearGradient
            colors={AppColors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.customHeader}
          >
            <FadeInView delay={0}>
              <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{t.title}</Text>
              <TouchableOpacity onPress={() => router.push("/")}>
                <Ionicons name="home" size={24} color="white" />
              </TouchableOpacity>
            </FadeInView>
          </LinearGradient>

          <View style={styles.form}>
            {/* FROM */}
            <FadeInView delay={200}>
              <Text style={styles.label}>{t.from}</Text>
              <AnimatedCard style={styles.inputCard} shadowLevel="medium">
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={AppColors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t.fromPlaceholder}
                    placeholderTextColor={AppColors.textLight}
                    value={from}
                    onChangeText={(text) => {
                      setFrom(text);
                      setValidatedFrom(null);
                      setTo("");
                      setResults([]);

                      if (!text) {
                        setFromSuggestions([]);
                        return;
                      }

                      setFromSuggestions(
                        allStops
                          .filter((s) =>
                            s.toLowerCase().includes(text.toLowerCase()),
                          )
                          .slice(0, 6),
                      );
                    }}
                  />
                  {from.length > 0 && (
                    <TouchableOpacity onPress={() => setFrom("")}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={AppColors.textSecondary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </AnimatedCard>

              {fromSuggestions.map((item, idx) => (
                <SlideInView key={idx} direction="down" delay={250 + idx * 30}>
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      setFrom(item);
                      setValidatedFrom(item);
                      setFromSuggestions([]);
                      setTo("");
                      setToSuggestions([]);
                      setResults([]);
                    }}
                  >
                    <Ionicons name="pin" size={16} color={AppColors.primary} />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                </SlideInView>
              ))}
            </FadeInView>

            {/* TO */}
            <FadeInView delay={300}>
              <Text style={styles.label}>{t.to}</Text>
              <AnimatedCard style={styles.inputCard} shadowLevel="medium">
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="location"
                    size={20}
                    color={AppColors.textSecondary}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder={t.toPlaceholder}
                    placeholderTextColor={AppColors.textLight}
                    value={to}
                    editable={!!validatedFrom}
                    onChangeText={(text) => {
                      setTo(text);
                      setResults([]);

                      if (!validatedFrom || !text) {
                        setToSuggestions([]);
                        return;
                      }

                      setToSuggestions(
                        getValidDestinations(validatedFrom)
                          .filter((s) =>
                            s.toLowerCase().includes(text.toLowerCase()),
                          )
                          .slice(0, 6),
                      );
                    }}
                  />
                  {to.length > 0 && (
                    <TouchableOpacity onPress={() => setTo("")}>
                      <Ionicons
                        name="close-circle"
                        size={20}
                        color={AppColors.textSecondary}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </AnimatedCard>

              {toSuggestions.map((item, idx) => (
                <SlideInView key={idx} direction="down" delay={350 + idx * 30}>
                  <TouchableOpacity
                    style={styles.suggestionItem}
                    onPress={() => {
                      setTo(item);
                      setToSuggestions([]);
                    }}
                  >
                    <Ionicons name="pin" size={16} color={AppColors.accent} />
                    <Text style={styles.suggestionText}>{item}</Text>
                  </TouchableOpacity>
                </SlideInView>
              ))}
            </FadeInView>

            {/* Search Button */}
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
                  searchRoutes();
                }}
              >
                <Ionicons
                  name="search"
                  size={20}
                  color="white"
                  style={{ marginRight: 8 }}
                />
                <Text style={styles.searchText}>{t.search}</Text>
              </AnimatedCard>
            </SlideInView>

            {/* Results */}
            <FadeInView delay={500} style={styles.resultsContainer}>
              {results.length > 0 && (
                <Text style={styles.resultsTitle}>
                  {results.length} {t.routesFound}
                </Text>
              )}

              {results.map((bus, index) => (
                <SlideInView
                  key={bus.id}
                  direction={index % 2 === 0 ? "left" : "right"}
                  delay={600 + index * 100}
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
                      <View style={styles.busNumber}>
                        <Text style={styles.busNumberText}>{bus.number}</Text>
                      </View>

                      <View style={styles.busInfo}>
                        <Text style={styles.busName}>{bus.name}</Text>
                        <View style={styles.routeRow}>
                          <Ionicons
                            name="location"
                            size={14}
                            color="rgba(255,255,255,0.8)"
                          />
                          <Text style={styles.busRoute}>
                            {" "}
                            {bus.start} → {bus.end}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity onPress={() => toggleSave(bus.id)}>
                        <Ionicons
                          name={isSaved(bus.id) ? "heart" : "heart-outline"}
                          size={24}
                          color={isSaved(bus.id) ? "#FDC947" : "white"}
                        />
                      </TouchableOpacity>
                    </LinearGradient>
                  </AnimatedCard>
                </SlideInView>
              ))}

              {results.length === 0 && from && to && (
                <FadeInView delay={600} style={styles.noResultContainer}>
                  <Ionicons
                    name="bus-outline"
                    size={64}
                    color={AppColors.textLight}
                  />
                  <Text style={styles.noResult}>{t.noResults}</Text>
                </FadeInView>
              )}
            </FadeInView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.textLight,
    ...AppColors.shadows.medium,
  },
  backText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    flex: 1,
  },
  form: {
    padding: 16,
    paddingTop: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 8,
    marginTop: 12,
  },
  inputCard: {
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  suggestionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 4,
    backgroundColor: AppColors.surfaceSecondary,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: AppColors.primary,
    gap: 10,
  },
  suggestionText: {
    fontSize: 14,
    color: AppColors.textPrimary,
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  searchButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    ...AppColors.shadows.medium,
  },
  searchText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultsContainer: {
    gap: 12,
  },
  resultsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  busCard: {
    borderRadius: 12,
    overflow: "hidden",
    ...AppColors.shadows.light,
  },
  busCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 14,
    gap: 12,
  },
  busNumber: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },
  busNumberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  busInfo: {
    flex: 1,
    gap: 4,
  },
  busName: {
    fontSize: 15,
    fontWeight: "600",
    color: "white",
  },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  busRoute: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },
  noResultContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  noResult: {
    fontSize: 16,
    color: AppColors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
