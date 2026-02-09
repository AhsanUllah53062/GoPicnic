import { MaterialIcons } from "@expo/vector-icons";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Trip } from "../../services/trips";

type Props = {
  trip: Trip;
  onPress: () => void;
};

export default function TripCard({ trip, onPress }: Props) {
  const isUpcoming = new Date(trip.startDate) > new Date();

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <ImageBackground
        source={
          trip.placeImage
            ? { uri: trip.placeImage }
            : require("../../assets/faisal.jpg")
        }
        style={styles.image}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />

        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: isUpcoming ? "#EEF2FF" : "#F3F4F6" },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: isUpcoming ? "#6366F1" : "#6B7280" },
                ]}
              >
                {isUpcoming ? "Upcoming" : "Completed"}
              </Text>
            </View>
          </View>

          <View style={styles.info}>
            <Text style={styles.destination}>{trip.toLocation}</Text>
            <View style={styles.detailsRow}>
              <View style={styles.detail}>
                <MaterialIcons
                  name="calendar-today"
                  size={14}
                  color="#E5E7EB"
                />
                <Text style={styles.detailText}>
                  {trip.startDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </Text>
              </View>
              <View style={styles.detail}>
                <MaterialIcons name="payments" size={14} color="#E5E7EB" />
                <Text style={styles.detailText}>
                  {trip.currency} {trip.budget.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 280,
    height: 160,
    marginRight: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    gap: 8,
  },
  destination: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  detailsRow: {
    flexDirection: "row",
    gap: 16,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: "#E5E7EB",
    fontWeight: "500",
  },
});
