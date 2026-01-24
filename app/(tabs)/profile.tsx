import { MaterialIcons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileTab() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'plans' | 'favorites'>('plans');

  // 🔹 Mock Trip Plans
  const mockTrips = [
    {
      id: '1',
      title: 'Trip to Faisal Masjid',
      dates: 'Oct 6–11',
      places: 3,
      image: require('../../assets/faisal.jpg'),
    },
    {
      id: '2',
      title: 'Trip to Badshahi Masjid',
      dates: 'Jan 1, 2023',
      places: 3,
      image: require('../../assets/hanna.jpg'),
    },
  ];

  // 🔹 Mock Favorites
  const mockFavorites = [
    {
      id: 'f1',
      name: 'Shalimar Gardens',
      location: 'Lahore',
      image: require('../../assets/sea.jpg'),
    },
    {
      id: 'f2',
      name: 'Mazar-e-Quaid',
      location: 'Karachi',
      image: require('../../assets/mohenjodaro.jpg'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.editIcon} onPress={() => router.push('/profile/edit')}>
          <MaterialIcons name="edit" size={22} color="#000" />
        </TouchableOpacity>
        <Image source={require('../../assets/logo.png')} style={styles.avatar} />
        <Text style={styles.name}>Ahsan Khan</Text>
        <Text style={styles.username}>@ahsan53062</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mockTrips.length}</Text>
          <Text style={styles.statLabel}>Trips</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {mockTrips.reduce((sum, t) => sum + t.places, 0)}
          </Text>
          <Text style={styles.statLabel}>Places</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{mockFavorites.length}</Text>
          <Text style={styles.statLabel}>Favorites</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'plans' && styles.tabActive]}
          onPress={() => setActiveTab('plans')}
        >
          <Text style={styles.tabText}>Trip Plans</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, activeTab === 'favorites' && styles.tabActive]}
          onPress={() => setActiveTab('favorites')}
        >
          <Text style={styles.tabText}>Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === 'plans' ? (
        mockTrips.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ fontSize: 16, color: '#666' }}>No trips yet. Start planning!</Text>
          </View>
        ) : (
          <FlatList
            data={mockTrips}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingBottom: 40 }}
            renderItem={({ item }) => (
              <Link href={{ pathname: '/trip/[id]', params: { id: item.id } }} asChild>
                <TouchableOpacity style={styles.tripCard}>
                  <Image source={item.image} style={styles.tripImage} />
                  <View style={styles.tripInfo}>
                    <Text style={styles.tripTitle}>{item.title}</Text>
                    <Text style={styles.tripDates}>{item.dates}</Text>
                    <Text style={styles.tripPlaces}>{item.places} places</Text>
                  </View>
                </TouchableOpacity>
              </Link>
            )}
          />
        )
      ) : mockFavorites.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Text style={{ fontSize: 16, color: '#666' }}>No favorites yet.</Text>
        </View>
      ) : (
        <FlatList
          data={mockFavorites}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.tripCard}>
              <Image source={item.image} style={styles.tripImage} />
              <View style={styles.tripInfo}>
                <Text style={styles.tripTitle}>{item.name}</Text>
                <Text style={styles.tripDates}>{item.location}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: { alignItems: 'center', marginBottom: 20, position: 'relative' },
  editIcon: { position: 'absolute', top: 0, right: 0, padding: 6 },
  avatar: { width: 100, height: 100, borderRadius: 50, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: '700', color: '#000' },
  username: { fontSize: 14, color: '#666', marginTop: 2 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '600', color: '#000' },
  statLabel: { fontSize: 12, color: '#666' },
  tabRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tabBtn: { paddingHorizontal: 20, paddingVertical: 6, borderRadius: 20 },
  tabActive: { backgroundColor: '#007AFF' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#000' },
  tripCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  tripImage: { width: 100, height: 100 },
  tripInfo: { flex: 1, padding: 12, justifyContent: 'center' },
  tripTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
  tripDates: { fontSize: 13, color: '#666' },
  tripPlaces: { fontSize: 12, color: '#999', marginTop: 4 },
});
