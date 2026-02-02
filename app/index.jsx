import { Link } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { Animated, Pressable } from 'react-native';
import { useState } from 'react';
import { strings } from '../src/i18n/strings';







export default function HomeScreen() {

const [lang, setLang] = useState('en');
const t = strings[lang];

  return (

    
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
  <View style={{ width: 60 }} />

  <Text style={styles.title}>{t.homeTitle}</Text>
  



  

  <TouchableOpacity
    onPress={() => setLang(lang === 'en' ? 'am' : 'en')}
    style={styles.langToggle}
  >
    <Text style={styles.langText}>
      {lang === 'en' ? 'EN | አማ' : 'አማ | EN'}
    </Text>

    

  </TouchableOpacity>
</View>


     


      {/* Quick Actions - SIMPLIFIED */}
      <View style={styles.actionsContainer}>
        
        <Link href="/bus-list" asChild>
          <TouchableOpacity style={styles.cardButton}>
            <View style={[styles.accent, { backgroundColor: '#1E8449' }]} />
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>🚌 {t.browseBuses}</Text>

              <Text style={styles.cardSubtext}>View all 112 bus routes</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/bus-list" asChild>
          <TouchableOpacity style={styles.cardButton}>
            <View style={[styles.accent, { backgroundColor: '#F1C40F' }]} />
            <View style={styles.cardContent}>
              
              <Text style={styles.cardTitle}>🔍 {t.searchRoute}</Text>
              <Text style={styles.cardSubtext}>Find a specific bus</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/route-search" asChild>
          <TouchableOpacity style={styles.cardButton}>
            <View style={[styles.accent, { backgroundColor: '#C0392B' }]} />
            <View style={styles.cardContent}>
              
              <Text style={styles.cardTitle}>🔍 {t.searchRoute}</Text>
              <Text style={styles.cardSubtext}>Your frequent buses</Text>
            </View>
          </TouchableOpacity>
        </Link>

          
        <Link href="/saved-routes" asChild>
          <TouchableOpacity style={styles.cardButton}>
            <View style={[styles.accent, { backgroundColor: '#C0392B' }]} />
            <View style={styles.cardContent}>
              
              <Text style={styles.cardTitle}>⭐ {t.savedRoutes}</Text>
              <Text style={styles.cardSubtext}>Your frequent buses</Text>
            </View>
          </TouchableOpacity>
        </Link>

        <Link href="/where-to-go" asChild>
          <TouchableOpacity style={styles.cardButton}>
            <View style={[styles.accent, { backgroundColor: '#C0392B' }]} />
            <View style={styles.cardContent}>
              
              <Text style={styles.cardTitle}>📍 {t.whereTo}</Text>
              <Text style={styles.cardSubtext}>where do you want to go?</Text>
            </View>
          </TouchableOpacity>
        </Link>

      </View>

      {/* App Features */}
      <View style={styles.featuresContainer}>
  <Text style={styles.sectionTitle}>{t.featuresTitle}</Text>

  {features.map((item, index) => (
    <View key={index} style={styles.featureItem}>
      <View style={[styles.featureIcon, { backgroundColor: item.color }]}>
        <Text style={styles.featureIconText}>{item.icon}</Text>
      </View>

      <View style={styles.featureText}>
        <Text style={styles.featureTitle}>
          {t.features[index].title}
        </Text>
        <Text style={styles.featureDescription}>
          {t.features[index].description}
        </Text>
      </View>
    </View>
  ))}
</View>


      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>112</Text>
          <Text style={styles.statLabel}>Bus Routes</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>100%</Text>
          <Text style={styles.statLabel}>Offline</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>24/7</Text>
          <Text style={styles.statLabel}>Access</Text>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Made for Addis Ababa residents • Updated regularly
        </Text>
        <Text style={styles.versionText}>Version 1.0 • All data offline</Text>
      </View>

    </ScrollView>
  );
}

/* Feature Data */
const features = [
  { icon: '🚌', color: '#1E8449' },
  { icon: '🔍', color: '#F1C40F' },
  { icon: '📱', color: '#27AE60' },
  { icon: '💵', color: '#C0392B' },
];


/* Styles */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFBEA',
  },

  /* Header */
  header: {
    backgroundColor: '#1E8449',
    paddingTop: 55,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 26,
    borderBottomRightRadius: 26,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#E9F7EF',
    textAlign: 'center',
    marginTop: 6,
  },

  /* Action Buttons */
  actionsContainer: {
    padding: 20,
    paddingTop: 18,
  },
  cardButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    marginBottom: 16,
    elevation: 4,
    overflow: 'hidden',
  },
  accent: {
    width: 8,
  },
  cardContent: {
    padding: 18,
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 13,
    color: '#7F8C8D',
  },

  /* Features */
  featuresContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 18,
    marginBottom: 20,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E8449',
    marginBottom: 20,
    textAlign: 'center',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIconText: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
  },
  featureDescription: {
    fontSize: 13,
    color: '#7F8C8D',
  },

  /* Stats */
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#C0392B',
    marginHorizontal: 20,
    borderRadius: 18,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F1C40F',
  },
  statLabel: {
    fontSize: 12,
    color: '#FDEBD0',
  },

  /* Footer */
  footer: {
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    fontSize: 14,
    color: '#7F8C8D',
    textAlign: 'center',
  },
  versionText: {
    fontSize: 12,
    color: '#95A5A6',
    fontStyle: 'italic',
    marginTop: 4,
  },
  langToggle: {
  backgroundColor: 'rgba(255,255,255,0.25)',
  paddingHorizontal: 4,
  paddingVertical: 10,
  borderRadius: 20,
},

langText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 14,
  langToggle: {
  backgroundColor: 'rgba(255,255,255,0.25)',
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},

langText: {
  color: 'white',
  fontWeight: '700',
  fontSize: 14,
  lineHeight: 16,
},

},

});
