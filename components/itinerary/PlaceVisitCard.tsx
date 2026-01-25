import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { PlaceVisit } from "../../services/itinerary";

type Props = {
  place: PlaceVisit;
  onDelete: () => void;
};

export default function PlaceVisitCard({ place, onDelete }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeName}>{place.placeName}</Text>
        {place.placeAddress && (
          <Text style={styles.address}>{place.placeAddress}</Text>
        )}
        {place.startTime && place.endTime && (
          <Text style={styles.time}>
            {place.startTime} - {place.endTime}
          </Text>
        )}
        {place.notes && <Text style={styles.notes}>{place.notes}</Text>}
      </View>
      <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
        <MaterialIcons name="delete-outline" size={20} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  content: {
    flex: 1,
  },
  placeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  address: {
    fontSize: 13,
    color: "#666",
    marginTop: 4,
  },
  time: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
  },
  notes: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
    fontStyle: "italic",
  },
  deleteBtn: {
    padding: 8,
  },
});
