import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useLocalSearchParams } from "expo-router";
import {
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    BorderRadius,
    GlobalStyles,
    Shadows,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";

export default function TripDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useThemedStyles();

  // 🔹 Mock trip data (later replace with DB fetch)
  const mockTrips: Record<string, any> = {
    "1": {
      title: "Trip to Faisal Masjid",
      dates: "Oct 6–11",
      places: [
        { name: "Faisal Masjid", image: require("../../assets/faisal.jpg") },
        { name: "Daman-e-Koh", image: require("../../assets/hanna.jpg") },
        { name: "Lok Virsa Museum", image: require("../../assets/sea.jpg") },
      ],
      expenses: "PKR 12,000",
      notes: "Family trip with sightseeing and photography.",
    },
    "2": {
      title: "Trip to Badshahi Masjid",
      dates: "Jan 1, 2023",
      places: [
        {
          name: "Badshahi Masjid",
          image: require("../../assets/faisal_inside.jpg"),
        },
        {
          name: "Lahore Fort",
          image: require("../../assets/faisal_night.jpg"),
        },
        { name: "Food Street", image: require("../../assets/faisal.jpg") },
      ],
      expenses: "PKR 8,500",
      notes: "Explored Lahore’s heritage and food culture.",
    },
    "3": {
      title: "Trip to Minar Pakistan",
      dates: "Dec 11, 2023",
      places: [
        { name: "Minar-e-Pakistan", image: require("../../assets/sea.jpg") },
        { name: "Iqbal Park", image: require("../../assets/hanna.jpg") },
      ],
      expenses: "PKR 5,000",
      notes: "Short trip with friends.",
    },
  };

  const trip = mockTrips[id ?? ""] || null;

  if (!trip) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Trip not found</Text>
      </View>
    );
  }

  const styles = {
    container: {
      ...GlobalStyles.screenContainer,
      backgroundColor: colors.neutral[50],
      padding: Spacing.md,
    },
    title: { ...TypographyStyles.h2, marginBottom: Spacing.xs },
    subtitle: {
      ...TypographyStyles.body,
      color: colors.text.secondary,
      marginBottom: Spacing.lg,
    },
    sectionHeading: {
      ...TypographyStyles.h4,
      marginTop: Spacing.lg,
      marginBottom: Spacing.md,
    },
    placeCard: {
      flexDirection: "row" as const,
      alignItems: "center" as const,
      backgroundColor: colors.neutral.white,
      borderRadius: BorderRadius.md,
      marginBottom: Spacing.md,
      padding: Spacing.sm,
      ...Shadows.sm,
    },
    placeImage: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.md,
      marginRight: Spacing.md,
    },
    placeName: { ...TypographyStyles.body, color: colors.text.primary },
    detailText: {
      ...TypographyStyles.body,
      color: colors.text.secondary,
      marginBottom: Spacing.md,
    },
    backBtn: {
      marginTop: Spacing.xl,
      backgroundColor: colors.primary,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.md,
      alignItems: "center" as const,
    },
    backText: { color: colors.neutral.white, ...TypographyStyles.label },
  };

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
