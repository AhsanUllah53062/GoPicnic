import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TripDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  // 🔹 Mock trip data (later replace with DB fetch)
  const mockTrips: Record<string, any> = {
    '1': {
      title: 'Trip to Faisal Masjid',
      dates: 'Oct 6–11',
      places: [
        { name: 'Faisal Masjid', image: require('../../assets/faisal.jpg') },
        { name: 'Daman-e-Koh', image: require('../../assets/hanna.jpg') },
        { name: 'Lok Virsa Museum', image: require('../../assets/sea.jpg') },
      ],
      expenses: 'PKR 12,000',
      notes: 'Family trip with sightseeing and photography.',
    },
    '2': {
      title: 'Trip to Badshahi Masjid',
      dates: 'Jan 1, 2023',
      places: [
        { name: 'Badshahi Masjid', image: require('../../assets/faisal_inside.jpg') },
        { name: 'Lahore Fort', image: require('../../assets/faisal_night.jpg') },
        { name: 'Food Street', image: require('../../assets/faisal.jpg') },
      ],
      expenses: 'PKR 8,500',
      notes: 'Explored Lahore’s heritage and food culture.',
    },
    '3': {
      title: 'Trip to Minar Pakistan',
      dates: 'Dec 11, 2023',
      places: [
        { name: 'Minar-e-Pakistan', image: require('../../assets/sea.jpg') },
        { name: 'Iqbal Park', image: require('../../assets/hanna.jpg') },
      ],
      expenses: 'PKR 5,000',
      notes: 'Short trip with friends.',
    },
  };

  const trip = mockTrips[id ?? ''] || null;

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trip not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{trip.title}</Text>
      <Text style={styles.subtitle}>{trip.dates}</Text>

      {/* Places */}
      <Text style={styles.sectionHeading}>Places</Text>
      {trip.places.map((place: any, index: number) => (
        <View key={index} style={styles.placeCard}>
          <Image source={place.image} style={styles.placeImage} />
          <Text style={styles.placeName}>{place.name}</Text>
        </View>
      ))}

      {/* Expenses */}
      <Text style={styles.sectionHeading}>Expenses</Text>
      <Text style={styles.detailText}>{trip.expenses}</Text>

      {/* Notes */}
      <Text style={styles.sectionHeading}>Notes</Text>
      <Text style={styles.detailText}>{trip.notes}</Text>

      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => history.back()}>
        <Text style={styles.backText}>← Back to Profile</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f7fa', padding: 20 },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 6 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 20 },
  sectionHeading: { fontSize: 18, fontWeight: '600', marginTop: 20, marginBottom: 10 },
  placeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  placeImage: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  placeName: { fontSize: 15, fontWeight: '500', color: '#000' },
  detailText: { fontSize: 14, color: '#444', marginBottom: 10 },
  backBtn: {
    marginTop: 30,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  backText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
