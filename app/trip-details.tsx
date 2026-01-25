import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TripDetailsTabs from "../components/tabs/TripDetailsTabs";
import { getTrip, Trip } from "../services/trips";
import { useUser } from "../src/context/UserContext";

export default function TripDetails() {
  const router = useRouter();
  const { user } = useUser();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<Date[]>([]);

  useEffect(() => {
    loadTrip();
  }, [tripId]);

  const loadTrip = async () => {
    if (!tripId) {
      Alert.alert("Error", "Trip ID not found");
      router.back();
      return;
    }

    setLoading(true);
    try {
      console.log(`🔍 Loading trip: ${tripId}`);
      const tripData = await getTrip(tripId);

      if (!tripData) {
        Alert.alert("Error", "Trip not found");
        router.back();
        return;
      }

      setTrip(tripData);

      // Generate days array
      const generatedDays: Date[] = [];
      let current = new Date(tripData.startDate);
      const end = new Date(tripData.endDate);

      while (current <= end) {
        generatedDays.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      setDays(generatedDays);
      console.log(`✅ Trip loaded with ${generatedDays.length} days`);
    } catch (error: any) {
      console.error("❌ Error loading trip:", error);
      Alert.alert("Error", "Failed to load trip details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading trip...</Text>
      </View>
    );
  }

  if (!trip) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#FF3B30" />
        <Text style={styles.errorText}>Trip not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with background image */}
      <ImageBackground
        source={
          trip.placeImage
            ? { uri: trip.placeImage }
            : require("../assets/faisal.jpg")
        }
        style={styles.headerImage}
      >
        <View style={styles.overlay} />

        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="share" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Title + Dates */}
        <View style={styles.headerContent}>
          <Text style={styles.tripTitle}>
            {trip.fromLocation} → {trip.toLocation}
          </Text>
          <Text style={styles.tripDates}>
            {trip.startDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {trip.endDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <Text style={styles.tripBudget}>
            Budget: {trip.currency} {trip.budget.toLocaleString()}
          </Text>
        </View>
      </ImageBackground>

      {/* Tabs Navigator */}
      <View style={styles.content}>
        <TripDetailsTabs
          tripId={tripId}
          trip={trip}
          days={days}
          userId={user?.id || ""}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#FF3B30",
  },
  headerImage: {
    width: "100%",
    height: 280,
    justifyContent: "flex-end",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  topBar: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 2,
  },
  headerContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    zIndex: 2,
  },
  tripTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  tripDates: {
    fontSize: 15,
    color: "#E5E5EA",
    marginBottom: 4,
  },
  tripBudget: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
