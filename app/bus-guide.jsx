import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FadeInView } from '../components/AnimatedCard';
import { AppColors } from '../constants/theme';
import { strings } from '../src/i18n/strings';


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
    <SafeAreaView style={styles.container}>
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
          <Text style={styles.headerTitle}>{t.title}</Text>
          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => router.push('/')}
          >
            <Ionicons name="home" size={24} color="white" />
          </TouchableOpacity>
        </FadeInView>
      </LinearGradient>

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
    </SafeAreaView>
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
    backgroundColor: AppColors.background,
  },

  /* Enhanced Header */
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textAlign: 'center',
  },
  homeButton: {
    padding: 8,
  },

  /* Content */
  content: {
    padding: 20,
    paddingBottom: 40,
  },

  /* Sections */
  section: {
    backgroundColor: AppColors.surface,
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    ...AppColors.shadows.light,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sectionIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.textPrimary,
  },
  sectionText: {
    fontSize: 14,
    color: AppColors.textSecondary,
    lineHeight: 22,
  },
});
