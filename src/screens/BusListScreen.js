import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity 
} from 'react-native';
import { Link } from 'expo-router';
import busData from '../data/busData';

const BusListScreen = () => {
  const [buses] = useState(busData);

  const renderBusItem = ({ item }) => (
    <Link href={`/bus-detail/${item.id}`} asChild>
      <TouchableOpacity style={styles.busCard}>
        
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
    </Link>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>City Buses</Text>
        <Text style={styles.count}>{buses.length} buses available</Text>
      </View>
      
      <FlatList
        data={buses}
        renderItem={renderBusItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#2C3E50',
    padding: 20,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  count: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 5,
  },
  list: {
    padding: 15,
  },
  busCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  busHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  busNumber: {
    backgroundColor: '#E74C3C',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  busNumberText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  busInfo: {
    flex: 1,
  },
  busName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 3,
  },
  busRoute: {
    fontSize: 13,
    color: '#7F8C8D',
  },
  busDetails: {
    paddingLeft: 5,
  },
  detailText: {
    fontSize: 14,
    color: '#34495E',
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: 'bold',
    color: '#2C3E50',
  },
  busFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#ECF0F1',
  },
  fare: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#27AE60',
  },
  distance: {
    fontSize: 14,
    color: '#3498DB',
  },
});

export default BusListScreen;