import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    AnimatedCard,
    FadeInView,
    SlideInView,
} from "../components/AnimatedCard";
import { AppColors } from "../constants/theme";
import busData from "../src/data/busData";
import { strings } from "../src/i18n/strings";

export default function SavedRoutesScreen() {
  const router = useRouter();
  const [savedRoutes, setSavedRoutes] = useState([]);
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(true); // ← ADDED loading state

  // Load language and saved routes
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load language
        const savedLang = await AsyncStorage.getItem("lang");
        if (savedLang) setLang(savedLang);

        // Load saved routes
        const saved = await AsyncStorage.getItem("savedRoutes");
        if (saved) setSavedRoutes(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false); // ← Set loading to false when done
      }
    };
    loadData();
  }, []);

  // Safely get translations with fallback
  const getTranslation = () => {
    const langObj = strings[lang];
    if (!langObj) return strings["en"].savedRoutesScreen;

    return langObj.savedRoutesScreen || strings["en"].savedRoutesScreen;
  };

  const t = getTranslation();

  // Remove a route from saved routes
  const removeSavedRoute = async (id) => {
    const updated = savedRoutes.filter((rid) => rid !== id);
    setSavedRoutes(updated);
    await AsyncStorage.setItem("savedRoutes", JSON.stringify(updated));
  };

  // Render each saved bus item
  const renderBusItem = ({ item, index }) => {
    const bus = busData.find((b) => b.id === item);
    if (!bus) return null;

    return (
      <SlideInView
        key={bus.id}
        direction={index % 2 === 0 ? "left" : "right"}
        delay={200 + index * 100}
        style={styles.busItemContainer}
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
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation();
                removeSavedRoute(bus.id);
              }}
            >
              <Ionicons name="close-circle" size={24} color="white" />
            </TouchableOpacity>
          </LinearGradient>
        </AnimatedCard>
      </SlideInView>
    );
  };

  // Show loading indicator
  if (loading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      {/* Enhanced Header */}
      <LinearGradient
        colors={AppColors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.customHeader}
      >
        <FadeInView delay={0}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.title || "Saved Routes"}</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </FadeInView>
      </LinearGradient>

      {savedRoutes.length === 0 ? (
        <FadeInView delay={200} style={styles.emptyContainer}>
          <Ionicons
            name="bookmark-outline"
            size={64}
            color={AppColors.textLight}
          />
          <Text style={styles.emptyText}>
            {t.emptyTitle || "No saved routes yet"}
          </Text>
          <Text style={styles.emptySubtext}>
            {t.emptySubtitle || "Tap the heart on any bus to save it"}
          </Text>
        </FadeInView>
      ) : (
        <FlatList
          data={savedRoutes}
          renderItem={renderBusItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: AppColors.background },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: AppColors.background,
  },

  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  backButton: { padding: 8 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    flex: 1,
    textAlign: "center",
  },
  homeButton: { padding: 8 },

  listContent: {
    padding: 16,
    paddingBottom: 20,
  },

  busItemContainer: {
    marginBottom: 12,
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
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
  },

  busNumberText: { color: "white", fontSize: 18, fontWeight: "bold" },
  busInfo: { flex: 1, gap: 4 },
  busName: { fontSize: 15, fontWeight: "600", color: "white" },
  routeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  busRoute: { color: "rgba(255,255,255,0.9)", fontSize: 13 },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginTop: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: AppColors.textSecondary,
    marginTop: 4,
    textAlign: "center",
  },
});
