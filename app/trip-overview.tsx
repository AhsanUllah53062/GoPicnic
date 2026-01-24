import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function TripOverview() {
  const router = useRouter();
  const { from, to, start, end } = useLocalSearchParams<{
    from: string;
    to: string;
    start: string;
    end: string;
  }>();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trip Overview</Text>

      <View style={styles.card}>
        <Text style={styles.label}>From:</Text>
        <Text style={styles.value}>{from}</Text>

        <Text style={styles.label}>To:</Text>
        <Text style={styles.value}>{to}</Text>

        <Text style={styles.label}>Dates:</Text>
        <Text style={styles.value}>{start} → {end}</Text>
      </View>

      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => router.push('/itinerary-builder')}
      >
        <Text style={styles.primaryBtnText}>Generate Itinerary</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  card: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8,
    padding: 16, marginBottom: 30,
  },
  label: { fontSize: 14, color: '#666', marginTop: 8 },
  value: { fontSize: 16, fontWeight: '500', color: '#000' },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
