import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useTrip } from '../../src/context/TripContext';

export default function NotificationDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { notifications } = useTrip();

  const notification = notifications.find((n) => n.id === id);

  if (!notification) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Notification not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Notification</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>{notification.title || 'Notification'}</Text>
        <Text style={styles.sender}>From: {notification.sender}</Text>
        <Text style={styles.message}>{notification.message}</Text>
        <Text style={styles.date}>{notification.timestamp}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', flex: 1 },
  error: { fontSize: 16, color: 'red', textAlign: 'center', marginTop: 40 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  sender: { fontSize: 14, fontWeight: '600', marginBottom: 6 },
  message: { fontSize: 14, color: '#444', marginBottom: 6 },
  date: { fontSize: 12, color: '#666' },
});
