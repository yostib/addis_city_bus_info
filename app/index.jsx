import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "expo-router";
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
} from "../components/AnimatedCard";
import { AppColors } from "../constants/theme";
import { strings } from "../src/i18n/strings";

export default function HomeScreen() {
  const [lang, setLang] = useState("en");
  const t = strings[lang];

  useEffect(() => {
    const loadLanguage = async () => {
      const savedLang = await AsyncStorage.getItem("lang");
      if (savedLang) {
        setLang(savedLang);
      }
    };
    loadLanguage();
  }, []);

  const toggleLang = async () => {
    const newLang = lang === "en" ? "am" : "en";
    setLang(newLang);
    await AsyncStorage.setItem("lang", newLang);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header with Gradient */}
      <LinearGradient
        colors={AppColors.gradients.primary}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <FadeInView delay={0} style={styles.headerContent}>
          <View style={{ width: 60 }} />

          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{t.homeTitle}</Text>
              <Text style={styles.subtitle}>{t.homeSubtitle}</Text>
            </View>

            <TouchableOpacity
              style={styles.langToggle}
              onPress={toggleLang}
              activeOpacity={0.7}
            >
              <Text style={styles.langText}>
                {lang === "en" ? "EN | አማ" : "አማ | EN"}
              </Text>
            </TouchableOpacity>
          </View>
        </FadeInView>
      </LinearGradient>

      {/* Enhanced Quick Actions */}
      <View style={styles.actionsContainer}>
        <SlideInView direction="right" delay={200}>
          <Link href="/bus-guide" asChild>
            <AnimatedCard
              style={styles.cardButton}
              gradientColors={AppColors.gradients.primary}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons name="bus" size={24} color="white" />
                  <Text style={styles.cardTitle}>{t.browseBuses}</Text>
                </View>
                <Text style={styles.cardSubtext}>
                  {t.homeCardSubtextBusGuide}
                </Text>
              </View>
            </AnimatedCard>
          </Link>
        </SlideInView>

        <SlideInView direction="left" delay={400}>
          <Link href="/bus-list" asChild>
            <AnimatedCard
              style={styles.cardButton}
              gradientColors={AppColors.gradients.accent}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons name="search" size={24} color="white" />
                  <Text style={styles.cardTitle}>{t.searchByBusNumber}</Text>
                </View>
                <Text style={styles.cardSubtext}>
                  {t.homeCardSubtextSearchNumber}
                </Text>
              </View>
            </AnimatedCard>
          </Link>
        </SlideInView>

        <SlideInView direction="right" delay={600}>
          <Link href="/route-search" asChild>
            <AnimatedCard
              style={styles.cardButton}
              gradientColors={AppColors.gradients.secondary}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons name="map" size={24} color="white" />
                  <Text style={styles.cardTitle}>{t.searchRoute}</Text>
                </View>
                <Text style={styles.cardSubtext}>
                  {t.homeCardSubtextSearchRoute}
                </Text>
              </View>
            </AnimatedCard>
          </Link>
        </SlideInView>

        <SlideInView direction="left" delay={800}>
          <Link href="/saved-routes" asChild>
            <AnimatedCard
              style={styles.cardButton}
              gradientColors={["#5B2C6F", "#7C3AED"]}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons name="heart" size={24} color="white" />
                  <Text style={styles.cardTitle}>{t.savedRoutes}</Text>
                </View>
                <Text style={styles.cardSubtext}>
                  {t.homeCardSubtextSavedRoutes}
                </Text>
              </View>
            </AnimatedCard>
          </Link>
        </SlideInView>

        <SlideInView direction="right" delay={1000}>
          <Link href="/where-to-go" asChild>
            <AnimatedCard
              style={styles.cardButton}
              gradientColors={["#059669", "#10B981"]}
              onPress={() => {}}
            >
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Ionicons name="location" size={24} color="white" />
                  <Text style={styles.cardTitle}>{t.whereTo}</Text>
                </View>
                <Text style={styles.cardSubtext}>
                  {t.homeCardSubtextWhereTo}
                </Text>
              </View>
            </AnimatedCard>
          </Link>
        </SlideInView>
      </View>

      {/* Enhanced Features Section */}
      <FadeInView delay={1200} style={styles.featuresContainer}>
        <LinearGradient
          colors={["#FFFFFF", "#F8FAFC"]}
          style={styles.featuresGradient}
        >
          <Text style={styles.sectionTitle}>{t.featuresTitle}</Text>

          {features.map((item, index) => (
            <SlideInView
              key={index}
              direction={index % 2 === 0 ? "left" : "right"}
              delay={1400 + index * 200}
              style={styles.featureItem}
            >
              <AnimatedCard
                style={styles.featureIconCard}
                gradientColors={[item.color, item.secondaryColor]}
                shadowLevel="light"
              >
                <Ionicons name={item.iconName} size={28} color="white" />
              </AnimatedCard>

              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>
                  {t.features[index].title}
                </Text>
                <Text style={styles.featureDescription}>
                  {t.features[index].description}
                </Text>
              </View>
            </SlideInView>
          ))}
        </LinearGradient>
      </FadeInView>

      {/* Enhanced Stats Section */}
      <FadeInView delay={2000} style={styles.statsContainer}>
        <LinearGradient
          colors={AppColors.gradients.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.statsGradient}
        >
          <SlideInView direction="up" delay={2200} style={styles.statItem}>
            <Text style={styles.statNumber}>112</Text>
            <Text style={styles.statLabel}>{t.stats.routes}</Text>
          </SlideInView>
          <SlideInView direction="up" delay={2400} style={styles.statItem}>
            <Text style={styles.statNumber}>100%</Text>
            <Text style={styles.statLabel}>{t.stats.offline}</Text>
          </SlideInView>
          <SlideInView direction="up" delay={2600} style={styles.statItem}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>{t.stats.access}</Text>
          </SlideInView>
        </LinearGradient>
      </FadeInView>

      {/* Enhanced Footer */}
      <FadeInView delay={2800} style={styles.footer}>
        <Text style={styles.footerText}>{t.footer.tagline}</Text>
        <Text style={styles.versionText}>{t.footer.version}</Text>
      </FadeInView>
    </ScrollView>
  );
}

/* Feature Data */
const features = [
  {
    iconName: "bus-outline",
    color: AppColors.primary,
    secondaryColor: AppColors.emerald,
  },
  {
    iconName: "search",
    color: AppColors.accent,
    secondaryColor: AppColors.amber,
  },
  {
    iconName: "phone-portrait-outline",
    color: AppColors.emerald,
    secondaryColor: AppColors.primary,
  },
  {
    iconName: "cash-outline",
    color: AppColors.secondary,
    secondaryColor: AppColors.crimson,
  },
];

/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.background,
  },

  /* Enhanced Header */
  header: {
    paddingTop: 55,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#E9F7EF",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.9,
  },

  /* Enhanced Action Buttons */
  actionsContainer: {
    padding: 20,
    paddingTop: 25,
  },
  cardButton: {
    marginBottom: 16,
    borderRadius: 20,
    overflow: "hidden",
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginLeft: 12,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  cardSubtext: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 20,
  },

  /* Enhanced Features */
  featuresContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    ...AppColors.shadows.medium,
  },
  featuresGradient: {
    padding: 20,
    borderRadius: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: AppColors.textPrimary,
    marginBottom: 25,
    textAlign: "center",
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  featureIconCard: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: AppColors.textPrimary,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 20,
  },

  /* Enhanced Stats */
  statsContainer: {
    marginHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    ...AppColors.shadows.heavy,
  },
  statsGradient: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 25,
    borderRadius: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#FDEBD0",
    marginTop: 4,
    textAlign: "center",
    opacity: 0.9,
  },

  /* Enhanced Footer */
  footer: {
    padding: 20,
    alignItems: "center",
    marginBottom: 30,
  },
  footerText: {
    fontSize: 15,
    color: AppColors.textSecondary,
    textAlign: "center",
    fontWeight: "500",
  },
  versionText: {
    fontSize: 13,
    color: AppColors.textLight,
    fontStyle: "italic",
    marginTop: 6,
  },

  /* Enhanced Language Toggle */
  langToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.6)",
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  langText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textAlign: "center",
  },
});
