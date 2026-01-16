import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🚌 Addis Ababa Bus Guide</Text>
      <Text style={styles.subtitle}>Find bus routes in the city</Text>
      
      <Link href="/bus-list" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>View All Buses</Text>
        </TouchableOpacity>
      </Link>
      
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Features:</Text>
        <Text style={styles.infoText}>• 3 Bus routes (testing)</Text>
        <Text style={styles.infoText}>• Offline access</Text>
        <Text style={styles.infoText}>• Route details</Text>
        <Text style={styles.infoText}>• Fare information</Text>
      </View>
      
      <Text style={styles.note}>
        More buses will be added soon...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7F8C8D',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#E74C3C',
    padding: 15,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 5,
  },
  note: {
    fontSize: 12,
    color: '#95A5A6',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default HomeScreen;