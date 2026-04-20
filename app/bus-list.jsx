import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import {
    AnimatedCard,
    FadeInView,
    LoadingSpinner,
} from "../components/AnimatedCard";
import { AppColors } from "../constants/theme";
import sampleBusData from "../src/data/busData";
import { strings } from "../src/i18n/strings";

export default function BusListScreen() {
  const [searchText, setSearchText] = useState("");
  const [buses] = useState(sampleBusData);
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [lang, setLang] = useState("en");
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const t = strings[lang].busList;

  // Filter buses based on search
  const filteredBuses = buses.filter(
    (bus) =>
      bus.number.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.name.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.start.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.end.toLowerCase().includes(searchText.toLowerCase()) ||
      bus.through.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Load saved routes and language on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [storedLang, saved] = await Promise.all([
          AsyncStorage.getItem("lang"),
          AsyncStorage.getItem("savedRoutes"),
        ]);

        if (storedLang) setLang(storedLang);
        if (saved) {
          setSavedRoutes(JSON.parse(saved));
        }
      } catch (e) {
        console.log("Failed to load data", e);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleSavedRoute = async (busId) => {
    let updatedSaved;
    if (savedRoutes.includes(busId)) {
      // Remove from saved
      updatedSaved = savedRoutes.filter((id) => id !== busId);
    } else {
      // Add to saved
      updatedSaved = [...savedRoutes, busId];
    }

    setSavedRoutes(updatedSaved);

    try {
      await AsyncStorage.setItem("savedRoutes", JSON.stringify(updatedSaved));
    } catch (e) {
      console.log("Failed to save routes", e);
    }
  };

  const renderBusItem = ({ item }) => (
    <TouchableOpacity
      style={styles.busCard}
      activeOpacity={0.85}
      onPress={() => router.push(`/bus-detail/${item.id}`)}
    >
      <View style={styles.busHeader}>
        <View style={styles.busNumber}>
          <Text style={styles.busNumberText}>{item.number}</Text>
        </View>

        <View style={styles.busInfo}>
          <Text style={styles.busName}>{item.name}</Text>
          <Text style={styles.busRoute}>
            {item.start} → {item.end}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => toggleSavedRoute(item.id)}
          style={styles.starButton}
        >
          <Text style={{ fontSize: 24 }}>
            {savedRoutes.includes(item.id) ? "⭐" : "☆"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.busDetails}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Via: </Text>
          {item.through}
        </Text>

        <View style={styles.busFooter}>
          <Text style={styles.fare}>{item.fare}</Text>
          <Text style={styles.distance}>{item.distance}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner size={50} color={AppColors.primary} />
        <Text style={styles.loadingText}>
          {t.loading || "Loading buses..."}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={AppColors.gradients.primary}
        style={styles.customHeader}
      >
        <FadeInView delay={0}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title}</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </FadeInView>
      </LinearGradient>

      {/* Enhanced Search Bar */}
      <FadeInView delay={200} style={styles.searchContainer}>
        <AnimatedCard style={styles.searchCard} shadowLevel="medium">
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color={AppColors.textSecondary} />
            <TextInput
              style={styles.searchInput}
              placeholder={t.searchPlaceholder}
              placeholderTextColor={AppColors.textLight}
              value={searchText}
              onChangeText={setSearchText}
            />
            {searchText.length > 0 && (
              <TouchableOpacity onPress={() => setSearchText("")}>
                <Ionicons
                  name="close-circle"
                  size={20}
                  color={AppColors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </AnimatedCard>
      </FadeInView>

      {/* Results Count */}
      <FadeInView delay={300} style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {filteredBuses.length} of {buses.length} buses
        </Text>
        <Text style={styles.tapHint}>{t.tapHint}</Text>
      </FadeInView>

      <FlatList
        data={filteredBuses}
        renderItem={({ item, index }) => (
          <FadeInView delay={400 + index * 100} style={styles.busItemContainer}>
            <AnimatedCard
              style={styles.busCard}
              onPress={() => router.push(`/bus-detail/${item.id}`)}
              shadowLevel="light"
            >
              <View style={styles.busHeader}>
                <LinearGradient
                  colors={AppColors.gradients.primary}
                  style={styles.busNumber}
                >
                  <Text style={styles.busNumberText}>{item.number}</Text>
                </LinearGradient>

                <View style={styles.busInfo}>
                  <Text style={styles.busName}>{item.name}</Text>
                  <Text style={styles.busRoute}>
                    <Ionicons
                      name="location"
                      size={14}
                      color={AppColors.textSecondary}
                    />{" "}
                    {item.start} → {item.end}
                  </Text>
                </View>

                <AnimatedCard
                  style={styles.starButton}
                  onPress={() => toggleSavedRoute(item.id)}
                  gradientColors={
                    savedRoutes.includes(item.id)
                      ? AppColors.gradients.accent
                      : ["#F1F5F9", "#E2E8F0"]
                  }
                >
                  <Ionicons
                    name={
                      savedRoutes.includes(item.id) ? "heart" : "heart-outline"
                    }
                    size={24}
                    color={
                      savedRoutes.includes(item.id)
                        ? "white"
                        : AppColors.textSecondary
                    }
                  />
                </AnimatedCard>
              </View>

              <View style={styles.busDetails}>
                <Text style={styles.detailText}>
                  <Text style={styles.detailLabel}>{t.via}: </Text>
                  {item.through}
                </Text>

                <View style={styles.busFooter}>
                  <Text style={styles.fare}>{item.fare}</Text>
                  <Text style={styles.distance}>{item.distance}</Text>
                </View>
              </View>
            </AnimatedCard>
          </FadeInView>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <FadeInView delay={400} style={styles.emptyContainer}>
            <Ionicons
              name="bus-outline"
              size={64}
              color={AppColors.textLight}
            />
            <Text style={styles.emptyText}>{t.emptyText}</Text>
            <Text style={styles.emptySubtext}>{t.emptySubtext}</Text>
          </FadeInView>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: AppColors.textSecondary,
  },

  // Enhanced Header
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  homeButton: {
    padding: 8,
  },

  // Enhanced Search
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchCard: {
    borderRadius: 25,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: AppColors.textPrimary,
    marginLeft: 12,
    marginRight: 8,
  },

  // Results
  resultsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  resultsText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    fontWeight: "500",
  },
  tapHint: {
    fontSize: 12,
    color: AppColors.textLight,
    marginTop: 2,
  },

  // Bus Items
  busItemContainer: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  busCard: {
    borderRadius: 16,
    backgroundColor: AppColors.surface,
  },
  busHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  busNumber: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  busNumberText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  busRoute: {
    fontSize: 14,
    color: AppColors.textSecondary,
    flexDirection: "row",
    alignItems: "center",
  },
  starButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },

  // Bus Details
  busDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  detailText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: "600",
    color: AppColors.textPrimary,
  },
  busFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fare: {
    fontSize: 16,
    fontWeight: "bold",
    color: AppColors.primary,
  },
  distance: {
    fontSize: 14,
    color: AppColors.textLight,
  },

  // List
  list: {
    paddingBottom: 20,
  },

  // Empty State
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
