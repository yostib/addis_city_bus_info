import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { strings } from '../src/i18n/strings';
import { useEffect, useState } from 'react';


export default function BusGuideScreen() {
  const router = useRouter();

  const [lang, setLang] = useState('en');
  const t = strings[lang].busGuide;

  

//const [lang, setLang] = useState('en');

useEffect(() => {
  AsyncStorage.getItem('lang').then(stored => {
    if (stored) setLang(stored);
  });
}, []);




  


  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.sideBtn}>
          <Text style={styles.headerBtn}>← {t.back}</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t.title}</Text>

        {/* spacer for center alignment */}
        <View style={styles.sideBtn} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Section
          icon="🚌"
          title={t.howToRide}
          text={
            t.howToRideText
          }
        />

        <Section
          icon="⏰"
          title={t.peakHours}
          text={
            t.peakHoursText
          }
        />

        <Section
          icon="⭐"
          title={t.savingRoutes}
          text={
            t.savingRoutesText
          }
        />

        <Section
          icon="🛡️"
          title={t.safetyTips}
          text={
            t.safetyTipsText
          }
        />
      </ScrollView>
    </View>
  );
}

function Section({ icon, title, text }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionIcon}>{icon}</Text>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <Text style={styles.sectionText}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F4F7',
  },

  /* Header */
  header: {
    height: 100,
    paddingTop: 45,
    paddingHorizontal: 20,
    backgroundColor: "#1E8449",
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  headerBtn: {
    color: '#FFFFFF',
    fontSize: 15,
  },
  sideBtn: {
    width: 80,
  },

  /* Content */
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Sections */
  section: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  sectionText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 22,
  },
});
