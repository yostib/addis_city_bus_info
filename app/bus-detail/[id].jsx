import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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
      <View style={styles.customHeader}>
        <TouchableOpacity
          style={[styles.navButton, styles.backBtn]}
          onPress={() => router.back()}
        >
          <Text style={styles.navButtonText}>← {t.back}</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{bus.number}</Text>
          <Text style={styles.headerSubtitle}>{bus.name}</Text>
        </View>

        <TouchableOpacity
          style={[styles.navButton, styles.homeBtn]}
          onPress={() => router.push("/")}
        >
          <Text style={styles.navButtonText}>{t.home}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={toggleSaveRoute}
        style={[
          styles.actionButton,
          savedRoutes.includes(bus.id)
            ? styles.removeButton
            : styles.saveButton,
        ]}
      >
        <Text style={styles.actionButtonText}>
          {savedRoutes.includes(bus.id) ? t.removeSaved : t.saveRoute}
        </Text>
      </TouchableOpacity>

      <View style={styles.headerCard}>
        <View style={styles.busNumberLarge}>
          <Text style={styles.busNumberText}>{bus.number}</Text>
        </View>
        <View style={styles.routeInfo}>
          <Text style={styles.routeName}>{bus.name}</Text>
          <Text style={styles.routeSubtitle}>
            {bus.start} → {bus.end}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.routeDetails}</Text>
        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.startIcon]}>
            <Text style={styles.stepText}>S</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{t.startingPoint}</Text>
            <Text style={styles.stepLocation}>{bus.start}</Text>
          </View>
        </View>

        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.viaIcon]}>
            <Text style={styles.stepText}>V</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{t.via}</Text>
            <Text style={styles.stepLocation}>{bus.through}</Text>
          </View>
        </View>

        <View style={styles.routeStep}>
          <View style={[styles.stepIcon, styles.endIcon]}>
            <Text style={styles.stepText}>E</Text>
          </View>
          <View style={styles.stepInfo}>
            <Text style={styles.stepTitle}>{t.destination}</Text>
            <Text style={styles.stepLocation}>{bus.end}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.tripInfo}</Text>
        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t.fare}</Text>
            <Text style={styles.infoValue}>{bus.fare}</Text>
          </View>
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>{t.distance}</Text>
            <Text style={styles.infoValue}>{bus.distance}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t.fullRouteStops}</Text>
        {bus.route.map((stop, index) => (
          <View key={index} style={styles.stopItem}>
            <View style={styles.stopNumber}>
              <Text style={styles.stopNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stopName}>{stop}</Text>
          </View>
        ))}
      </View>

      <View style={styles.noteBox}>
        <Text style={styles.noteText}>{t.offlineNote}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F6F8",
  },
  customHeader: {
    backgroundColor: "#1E8449",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 44,
    paddingBottom: 14,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    color: "#D5E8D4",
    fontSize: 12,
  },
  navButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 14,
    minWidth: 80,
    alignItems: "center",
  },
  backBtn: {
    backgroundColor: "#145A32",
  },
  homeBtn: {
    backgroundColor: "#196F3D",
  },
  navButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 14,
  },
  actionButton: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    padding: 14,
    borderRadius: 14,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: "#1E8449",
  },
  removeButton: {
    backgroundColor: "#C0392B",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
  headerCard: {
    backgroundColor: "#1E8449",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 5,
  },
  busNumberLarge: {
    backgroundColor: "#E74C3C",
    width: 70,
    height: 70,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 18,
  },
  busNumberText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  routeSubtitle: {
    fontSize: 13,
    color: "#D5E8D4",
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 10,
    padding: 20,
    borderRadius: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E3748",
    marginBottom: 16,
  },
  routeStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  startIcon: {
    backgroundColor: "#27AE60",
  },
  viaIcon: {
    backgroundColor: "#3498DB",
  },
  endIcon: {
    backgroundColor: "#E74C3C",
  },
  stepText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 12,
    color: "#7B8A99",
    marginBottom: 4,
  },
  stepLocation: {
    fontSize: 16,
    color: "#243447",
    fontWeight: "600",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  infoBox: {
    flex: 1,
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    backgroundColor: "#F4F7FB",
    marginHorizontal: 5,
  },
  infoLabel: {
    color: "#7B8A99",
    marginBottom: 8,
    fontSize: 13,
  },
  infoValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D3557",
  },
  stopItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E9EEF3",
  },
  stopNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#DDE3EA",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  stopNumberText: {
    color: "#2C3E50",
    fontWeight: "700",
  },
  stopName: {
    fontSize: 15,
    color: "#2C3E50",
  },
  noteBox: {
    backgroundColor: "#E8F5FE",
    marginHorizontal: 16,
    marginTop: 10,
    padding: 16,
    borderRadius: 14,
  },
  noteText: {
    color: "#1D4F91",
    lineHeight: 22,
    textAlign: "center",
  },
  errorText: {
    fontSize: 20,
    color: "#E74C3C",
    textAlign: "center",
    marginTop: 50,
    fontWeight: "700",
  },
  errorSubtext: {
    marginTop: 10,
    color: "#7B8A99",
    textAlign: "center",
  },
});
