import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function CarpoolPlaceCard({
  carpool,
  onPress,
}: {
  carpool: {
    id: string;
    driverName: string;
    contactNumber: string;
    seats: number;
    departure: string;
    meetingPoint: string;
    carModel: string;
    charge: number;
    note?: string;
    tripName?: string; // new field for trip name
  };
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Trip name header */}
      <View style={styles.headerRow}>
        <MaterialIcons name="map" size={22} color="#000" />
        <Text style={styles.tripName}>{carpool.tripName || 'Unnamed Trip'}</Text>
      </View>

      {/* Meeting point */}
      <View style={styles.meetingRow}>
        <MaterialIcons name="place" size={20} color="#007AFF" />
        <Text style={styles.meetingText}>{carpool.meetingPoint}</Text>
      </View>

      {/* Two-column details */}
      <View style={styles.detailsGrid}>
        <View style={styles.detailCol}>
          <View style={styles.detailRow}>
            <MaterialIcons name="person" size={18} color="#555" />
            <Text style={styles.detail}>Driver: {carpool.driverName}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="phone" size={18} color="#555" />
            <Text style={styles.detail}>{carpool.contactNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="event-seat" size={18} color="#555" />
            <Text style={styles.detail}>Seats: {carpool.seats}</Text>
          </View>
        </View>

        <View style={styles.detailCol}>
          <View style={styles.detailRow}>
            <MaterialIcons name="calendar-today" size={18} color="#555" />
            <Text style={styles.detail}>{carpool.departure}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="directions-car" size={18} color="#555" />
            <Text style={styles.detail}>{carpool.carModel}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialIcons name="attach-money" size={18} color="#555" />
            <Text style={styles.detail}>PKR {carpool.charge}</Text>
          </View>
        </View>
      </View>

      {/* Note */}
      {carpool.note ? (
        <View style={styles.noteRow}>
          <MaterialIcons name="note" size={18} color="#555" />
          <Text style={styles.noteText}>{carpool.note}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 8,
  },
  meetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  meetingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 6,
  },
  detailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailCol: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: '#444',
    marginLeft: 6,
  },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  noteText: {
    fontSize: 14,
    color: '#555',
    marginLeft: 6,
    fontStyle: 'italic',
  },
});
