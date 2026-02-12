// components/inbox/TripInfoBar.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  tripId: string;
  tripName: string;
  onClose: () => void;
};

export default function TripInfoBar({ tripId, tripName, onClose }: Props) {
  const router = useRouter();

  const handleViewTrip = () => {
    router.push(`/trip/${tripId}` as any);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="directions-car" size={20} color="#6366F1" />
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Trip Carpool</Text>
        <Text style={styles.tripName} numberOfLines={1}>
          {tripName}
        </Text>
      </View>

      <TouchableOpacity style={styles.viewButton} onPress={handleViewTrip}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onClose}>
        <MaterialIcons name="close" size={20} color="#6B7280" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#EEF2FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E7FF",
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  tripName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#6366F1",
  },
  viewButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
});
