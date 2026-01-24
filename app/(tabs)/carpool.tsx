import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; // 👈 import router
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Carpool = {
  id: string;
  tripName: string;
  date: string;
  origin: string;
  destination: string;
  driver: string;
  availableSeats: number;
  notes?: string;
};

export default function CarpoolTab() {
  const [sortBy, setSortBy] = useState<'date' | 'seats'>('date');
  const router = useRouter(); // 👈 initialize router

  const mockCarpools: Carpool[] = [
    {
      id: '1',
      tripName: 'Islamabad to Lahore',
      date: '2025-12-25',
      origin: 'Islamabad',
      destination: 'Lahore',
      driver: 'Ali Khan',
      availableSeats: 3,
      notes: 'Leaving early morning, no smoking.',
    },
    {
      id: '2',
      tripName: 'Quetta to Karachi',
      date: '2025-12-28',
      origin: 'Quetta',
      destination: 'Karachi',
      driver: 'Sara Ahmed',
      availableSeats: 2,
      notes: 'Comfortable SUV, snacks included.',
    },
    {
      id: '3',
      tripName: 'Peshawar to Murree',
      date: '2025-12-24',
      origin: 'Peshawar',
      destination: 'Murree',
      driver: 'Bilal Hussain',
      availableSeats: 4,
      notes: 'Music on, friendly vibes.',
    },
  ];

  const sortedCarpools = [...mockCarpools].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    return b.availableSeats - a.availableSeats;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Join a Trip</Text>

      {/* Sort Options */}
      <View style={styles.sortRow}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === 'date' && styles.sortActive]}
          onPress={() => setSortBy('date')}
        >
          <Text style={styles.sortText}>Date</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortBtn, sortBy === 'seats' && styles.sortActive]}
          onPress={() => setSortBy('seats')}
        >
          <Text style={styles.sortText}>Seats</Text>
        </TouchableOpacity>
      </View>

      {/* Carpool List */}
      <FlatList
        data={sortedCarpools}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            {/* Row 1 */}
            <View style={styles.row}>
              <Text style={styles.tripName}>{item.tripName}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>

            {/* Row 2 */}
            <View style={styles.row}>
              <Text style={styles.detail}>
                {item.origin} → {item.destination}
              </Text>
              <Text style={styles.detail}>Seats: {item.availableSeats}</Text>
            </View>

            {/* Row 3 */}
            <View style={styles.row}>
              <Text style={styles.detail}>Driver: {item.driver}</Text>
              {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
            </View>

            {/* Buttons */}
            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.joinBtn}>
                <MaterialIcons name="check-circle" size={18} color="#fff" />
                <Text style={styles.btnText}>Join</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() =>
                  router.push({
                    pathname: '/chat/[username]',
                    params: { username: item.driver }, // 👈 pass driver name
                  })
                }
              >
                <MaterialIcons name="chat" size={18} color="#fff" />
                <Text style={styles.btnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 16 },
  heading: { fontSize: 22, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  sortRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  sortLabel: { fontSize: 14, marginRight: 8 },
  sortBtn: {
    backgroundColor: '#eee',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  sortActive: { backgroundColor: '#007AFF' },
  sortText: { fontSize: 13, fontWeight: '600', color: '#000' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  tripName: { fontSize: 16, fontWeight: '600', color: '#333' },
  date: { fontSize: 13, color: '#666' },
  detail: { fontSize: 13, color: '#444' },
  notes: { fontSize: 12, color: '#888', flex: 1, textAlign: 'right' },
  btnRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  joinBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#28a745',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  chatBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  btnText: { color: '#fff', fontSize: 13, fontWeight: '600', marginLeft: 4 },
});
