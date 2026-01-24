import { ScrollView, StyleSheet } from 'react-native';
import { useTrip } from '../../src/context/TripContext';
import DayCard from '../DayCard';

type ItineraryTabProps = {
  days: Date[];
};

export default function ItineraryTab({ days }: ItineraryTabProps) {
  const { itinerary } = useTrip();

  return (
    <ScrollView style={styles.container}>
      {days.map((day, i) => (
        <DayCard
          key={i}
          dayIndex={i}
          date={day}
          dateLabel={`Day ${i + 1} - ${day.toDateString()}`}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
});
