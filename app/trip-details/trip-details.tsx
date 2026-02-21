import { useThemedStyles } from "@/hooks/useThemedStyles";
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
import TripDetailsTabs from "../../components/tabs/TripDetailsTabs";
import {
    GlobalStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";
import { getTrip, Trip } from "../../services/trips";
import { useUser } from "../../src/context/UserContext";

export default function TripDetails() {
  const router = useRouter();
  const { user } = useUser();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { colors } = useThemedStyles();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState<Date[]>([]);

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
    loadingContainer: {
      ...GlobalStyles.screenContainer,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.neutral.white,
    },
    loadingText: {
      marginTop: Spacing.md,
      ...TypographyStyles.body,
      color: colors.text.secondary,
    },
    errorContainer: {
      ...GlobalStyles.screenContainer,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      backgroundColor: colors.neutral.white,
      padding: Spacing.xl,
    },
    errorText: {
      marginTop: Spacing.md,
      ...TypographyStyles.h4,
      color: colors.error,
    },
    headerImage: {
      width: "100%" as const,
      height: 280,
      justifyContent: "flex-end" as const,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0,0,0,0.55)",
    },
    topBar: {
      position: "absolute" as const,
      top: 40,
      left: Spacing.md,
      right: Spacing.md,
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      zIndex: 2,
    },
    headerContent: {
      paddingHorizontal: Spacing.md,
      paddingBottom: Spacing.md,
      zIndex: 2,
    },
    tripTitle: {
      ...TypographyStyles.h1,
      color: colors.neutral.white,
      marginBottom: Spacing.xs,
    },
    tripDates: {
      ...TypographyStyles.body,
      color: colors.neutral[200],
      marginBottom: Spacing.xs,
    },
    tripBudget: {
      ...TypographyStyles.label,
      color: colors.neutral.white,
    },
    content: {
      flex: 1,
      backgroundColor: colors.neutral.white,
    },
  };

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
            : require("../../assets/faisal.jpg")
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
