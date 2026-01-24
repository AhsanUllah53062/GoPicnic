import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import TripDetailsTabs from '../components/tabs/TripDetailsTabs';
import { useTrip } from '../src/context/TripContext';

export default function TripDetails() {
  const router = useRouter();
  const { from, to, start, end, budget, toImage } = useLocalSearchParams<{
    from: string;
    to: string;
    start: string;
    end: string;
    budget: string;
    toImage?: string;
  }>();

  const { setTripMeta, setBudget } = useTrip();

  // Generate days between start and end dates
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  const days: Date[] = [];
  if (startDate && endDate) {
    let current = new Date(startDate);
    while (current <= endDate) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
  }

  // ✅ Initialize trip meta + budget in context
  useEffect(() => {
    setTripMeta({
      tripName: `Trip from ${from} → ${to}`,
      tripDates: `${start}${end ? ` - ${end}` : ''}`,
    });

    if (budget) {
      const parsedBudget = parseFloat(budget);
      if (!isNaN(parsedBudget)) {
        setBudget({ total: parsedBudget, spent: 0 });
      }
    }
  }, [from, to, start, end, budget]);

  return (
    <View style={styles.container}>
      {/* Header with background image */}
      <ImageBackground
        source={
          toImage
            ? { uri: toImage }
            : require('../assets/faisal.jpg') // ✅ neutral fallback
        }
        style={styles.headerImage}
      >
        <View style={styles.overlay} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" onPress={() => router.back()} />
          <MaterialIcons name="share" size={24} color="#fff" />
        </View>

        {/* Title + Dates */}
        <View style={styles.headerContent}>
          <Text style={styles.tripTitle}>
            Trip from {from} → {to}
          </Text>
          {start || end ? (
            <Text style={styles.tripDates}>
              {startDate ? startDate.toDateString() : ''} {endDate ? `- ${endDate.toDateString()}` : ''}
            </Text>
          ) : null}
          {budget ? (
            <Text style={styles.tripBudget}>Budget: PKR {budget}</Text>
          ) : null}
        </View>
      </ImageBackground>

      {/* Tabs Navigator */}
      <View style={styles.content}>
        <TripDetailsTabs days={days} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { width: '100%', height: 280, justifyContent: 'flex-end' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
  },
  topBar: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 2,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    zIndex: 2,
  },
  tripTitle: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  tripDates: { fontSize: 14, color: '#ddd', marginTop: 4 },
  tripBudget: { fontSize: 14, color: '#fff', marginTop: 4, fontWeight: '600' },
  content: { flex: 1, backgroundColor: '#fff' },
});
