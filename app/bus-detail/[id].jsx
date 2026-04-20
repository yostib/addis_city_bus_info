import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    AnimatedCard,
    FadeInView,
    SlideInView,
} from "../../components/AnimatedCard";
import { AppColors } from "../../constants/theme";
import busData from "../../src/data/busData";
import { strings } from "../../src/i18n/strings";

export default function BusDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [lang, setLang] = useState("en");
  const [savedRoutes, setSavedRoutes] = useState([]);

  const t = strings[lang]?.busDetail || strings.en.busDetail;
  const bus = busData.find((b) => b.id === id);

  useEffect(() => {
    AsyncStorage.getItem("lang").then((savedLang) => {
      if (savedLang) setLang(savedLang);
    });

    const loadSavedRoutes = async () => {
      const saved = await AsyncStorage.getItem("savedRoutes");
      if (saved) setSavedRoutes(JSON.parse(saved));
    };

    loadSavedRoutes();
  }, []);

  const toggleSaveRoute = async () => {
    if (!bus) return;

    const updatedRoutes = savedRoutes.includes(bus.id)
      ? savedRoutes.filter((rid) => rid !== bus.id)
      : [...savedRoutes, bus.id];

    setSavedRoutes(updatedRoutes);
    await AsyncStorage.setItem("savedRoutes", JSON.stringify(updatedRoutes));
  };

  if (!bus) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{t.busNotFound}</Text>
        <Text style={styles.errorSubtext}>
          {t.busId} {id}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Enhanced Header with Gradient */}
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
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>{bus.number}</Text>
            <Text style={styles.headerSubtitle}>{bus.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push("/")}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </FadeInView>
      </LinearGradient>

      {/* Save/Remove Button */}
      <FadeInView delay={200} style={styles.actionButtonContainer}>
        <AnimatedCard
          style={[
            styles.actionButton,
            savedRoutes.includes(bus.id)
              ? styles.removeButton
              : styles.saveButton,
          ]}
          onPress={toggleSaveRoute}
          gradientColors={
            savedRoutes.includes(bus.id)
              ? AppColors.gradients.secondary
              : AppColors.gradients.primary
          }
        >
          <Ionicons
            name={savedRoutes.includes(bus.id) ? "heart" : "heart-outline"}
            size={20}
            color="white"
            style={{ marginRight: 8 }}
          />
          <Text style={styles.actionButtonText}>
            {savedRoutes.includes(bus.id) ? t.removeSaved : t.saveRoute}
          </Text>
        </AnimatedCard>
      </FadeInView>

      {/* Main Bus Card */}
      <SlideInView
        delay={300}
        direction="up"
        style={styles.headerCardContainer}
      >
        <AnimatedCard style={styles.headerCard} shadowLevel="medium">
          <LinearGradient
            colors={AppColors.gradients.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.headerCardGradient}
          >
            <View style={styles.busNumberLarge}>
              <Text style={styles.busNumberText}>{bus.number}</Text>
            </View>
            <View style={styles.routeInfo}>
              <Text style={styles.routeName}>{bus.name}</Text>
              <Text style={styles.routeSubtitle}>
                {bus.start} → {bus.end}
              </Text>
            </View>
          </LinearGradient>
        </AnimatedCard>
      </SlideInView>

      {/* Route Details Section */}
      <FadeInView delay={400} style={styles.section}>
        <Text style={styles.sectionTitle}>{t.routeDetails}</Text>

        <SlideInView
          direction="right"
          delay={450}
          style={styles.routeStepContainer}
        >
          <AnimatedCard style={styles.routeStep} shadowLevel="light">
            <View style={[styles.stepIcon, styles.startIcon]}>
              <Ionicons name="play-circle" size={20} color="white" />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{t.startingPoint}</Text>
              <Text style={styles.stepLocation}>{bus.start}</Text>
            </View>
          </AnimatedCard>
        </SlideInView>

        <SlideInView
          direction="left"
          delay={500}
          style={styles.routeStepContainer}
        >
          <AnimatedCard style={styles.routeStep} shadowLevel="light">
            <View style={[styles.stepIcon, styles.viaIcon]}>
              <Ionicons name="pin" size={20} color="white" />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{t.via}</Text>
              <Text style={styles.stepLocation}>{bus.through}</Text>
            </View>
          </AnimatedCard>
        </SlideInView>

        <SlideInView
          direction="right"
          delay={550}
          style={styles.routeStepContainer}
        >
          <AnimatedCard style={styles.routeStep} shadowLevel="light">
            <View style={[styles.stepIcon, styles.endIcon]}>
              <Ionicons name="stop-circle" size={20} color="white" />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepTitle}>{t.destination}</Text>
              <Text style={styles.stepLocation}>{bus.end}</Text>
            </View>
          </AnimatedCard>
        </SlideInView>
      </FadeInView>

      {/* Trip Info Section */}
      <FadeInView delay={600} style={styles.section}>
        <Text style={styles.sectionTitle}>{t.tripInfo}</Text>
        <View style={styles.infoRowContainer}>
          <SlideInView
            direction="left"
            delay={650}
            style={styles.infoBoxContainer}
          >
            <AnimatedCard style={styles.infoBox} shadowLevel="light">
              <LinearGradient
                colors={AppColors.gradients.accent}
                style={styles.infoBoxGradient}
              >
                <Text style={styles.infoLabel}>{t.fare}</Text>
                <Text style={styles.infoValue}>{bus.fare}</Text>
              </LinearGradient>
            </AnimatedCard>
          </SlideInView>

          <SlideInView
            direction="right"
            delay={700}
            style={styles.infoBoxContainer}
          >
            <AnimatedCard style={styles.infoBox} shadowLevel="light">
              <LinearGradient
                colors={AppColors.gradients.secondary}
                style={styles.infoBoxGradient}
              >
                <Text style={styles.infoLabel}>{t.distance}</Text>
                <Text style={styles.infoValue}>{bus.distance}</Text>
              </LinearGradient>
            </AnimatedCard>
          </SlideInView>
        </View>
      </FadeInView>

      {/* Full Route Stops */}
      <FadeInView delay={750} style={styles.section}>
        <Text style={styles.sectionTitle}>{t.fullRouteStops}</Text>
        {bus.route.map((stop, index) => (
          <SlideInView
            key={index}
            direction={index % 2 === 0 ? "left" : "right"}
            delay={800 + index * 50}
            style={styles.stopItemContainer}
          >
            <AnimatedCard style={styles.stopItem} shadowLevel="light">
              <View style={styles.stopNumber}>
                <Text style={styles.stopNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stopName}>{stop}</Text>
            </AnimatedCard>
          </SlideInView>
        ))}
      </FadeInView>

      {/* Note Box */}
      <FadeInView delay={900} style={styles.section}>
        <AnimatedCard style={styles.noteBox} shadowLevel="medium">
          <LinearGradient
            colors={AppColors.gradients.primary}
            style={styles.noteBoxGradient}
          >
            <Ionicons
              name="information-circle"
              size={20}
              color="white"
              style={{ marginRight: 12 }}
            />
            <Text style={styles.noteText}>{t.offlineNote}</Text>
          </LinearGradient>
        </AnimatedCard>
      </FadeInView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  /* Enhanced Header */
  customHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  homeButton: {
    padding: 8,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 13,
    marginTop: 2,
  },

  /* Action Button Container */
  actionButtonContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  actionButton: {
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  saveButton: {},
  removeButton: {},
  actionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },

  /* Main Bus Card */
  headerCardContainer: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerCard: {
    borderRadius: 20,
    overflow: "hidden",
  },
  headerCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  busNumberLarge: {
    width: 70,
    height: 70,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  busNumberText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  routeSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
  },

  /* Sections */
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 16,
  },

  /* Route Steps */
  routeStepContainer: {
    marginBottom: 12,
  },
  routeStep: {
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  stepIcon: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  startIcon: {
    backgroundColor: AppColors.primary,
  },
  viaIcon: {
    backgroundColor: AppColors.accent,
  },
  endIcon: {
    backgroundColor: AppColors.secondary,
  },
  stepText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: AppColors.textSecondary,
    marginBottom: 4,
  },
  stepLocation: {
    fontSize: 15,
    fontWeight: "bold",
    color: AppColors.textPrimary,
  },

  /* Info Row */
  infoRowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  infoBoxContainer: {
    flex: 1,
  },
  infoBox: {
    borderRadius: 16,
    overflow: "hidden",
  },
  infoBoxGradient: {
    padding: 16,
    alignItems: "center",
  },
  infoLabel: {
    fontSize: 12,
    color: "white",
    opacity: 0.9,
    marginBottom: 8,
  },
  infoValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },

  /* Stop Items */
  stopItemContainer: {
    marginBottom: 10,
  },
  stopItem: {
    borderRadius: 16,
    backgroundColor: AppColors.surface,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  stopItemContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  stopNumber: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: AppColors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  stopNumberText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  stopName: {
    fontSize: 15,
    fontWeight: "500",
    color: AppColors.textPrimary,
    flex: 1,
  },

  /* Note Box */
  noteBox: {
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    overflow: "hidden",
  },
  noteBoxGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  noteText: {
    fontSize: 14,
    color: "white",
    flex: 1,
    fontWeight: "500",
  },

  /* Error State */
  errorText: {
    fontSize: 18,
    fontWeight: "bold",
    color: AppColors.error,
    textAlign: "center",
    marginTop: 40,
  },
  errorSubtext: {
    fontSize: 14,
    color: AppColors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
});
