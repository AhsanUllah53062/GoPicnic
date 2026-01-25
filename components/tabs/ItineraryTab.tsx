import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Trip } from "../../services/trips";
import DayCard from "../DayCard";

type ItineraryTabProps = {
  tripId: string;
  trip: Trip;
  days: Date[];
};

export default function ItineraryTab({
  tripId,
  trip,
  days,
}: ItineraryTabProps) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {days.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No days in this trip</Text>
        </View>
      ) : (
        days.map((day, index) => (
          <DayCard
            key={index}
            tripId={tripId}
            cityName={trip.toLocation}
            dayIndex={index}
            date={day}
            dateLabel={`Day ${index + 1} - ${day.toLocaleDateString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
            })}`}
          />
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 16,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#8E8E93",
  },
});
