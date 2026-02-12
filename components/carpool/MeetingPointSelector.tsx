//components/carpool/MeetingPointSelector.tsx
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  onSelect: (location: string, address?: string) => void;
};

const GOOGLE_PLACES_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY || "";

type PlacePrediction = {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
};

// Common meeting points (can be customized)
const COMMON_MEETING_POINTS = [
  "Main City Square",
  "Central Bus Station",
  "Shopping Mall Entrance",
  "University Main Gate",
  "Airport Terminal",
  "Train Station",
];

export default function MeetingPointSelector({
  visible,
  onClose,
  onSelect,
}: Props) {
  const [searchQuery, setSearchQuery] = useState("");
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPlaces = async (query: string) => {
    if (!query.trim()) {
      setPredictions([]);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
          query,
        )}&key=${GOOGLE_PLACES_API_KEY}&components=country:pk`,
      );

      const data = await response.json();

      if (data.status === "OK") {
        setPredictions(data.predictions || []);
      } else {
        setPredictions([]);
      }
    } catch (error) {
      console.error("Error searching places:", error);
      setPredictions([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlace = (prediction: PlacePrediction) => {
    onSelect(
      prediction.structured_formatting.main_text,
      prediction.structured_formatting.secondary_text,
    );
    setSearchQuery("");
    setPredictions([]);
    onClose();
  };

  const handleSelectCommon = (location: string) => {
    onSelect(location);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    setPredictions([]);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="arrow-back" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Select Meeting Point</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={22} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a location..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              searchPlaces(text);
            }}
            autoFocus
          />
          {loading && <ActivityIndicator size="small" color="#6366F1" />}
          {searchQuery.length > 0 && !loading && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setPredictions([]);
              }}
            >
              <MaterialIcons name="cancel" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Results */}
        {searchQuery.length === 0 ? (
          // Show common meeting points
          <View style={styles.content}>
            <Text style={styles.sectionTitle}>Common Meeting Points</Text>
            <FlatList
              data={COMMON_MEETING_POINTS}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.locationItem}
                  onPress={() => handleSelectCommon(item)}
                >
                  <View style={styles.locationIcon}>
                    <MaterialIcons name="place" size={20} color="#6366F1" />
                  </View>
                  <Text style={styles.locationName}>{item}</Text>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    color="#D1D5DB"
                  />
                </TouchableOpacity>
              )}
            />
          </View>
        ) : (
          // Show search results
          <FlatList
            data={predictions}
            keyExtractor={(item) => item.place_id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.predictionItem}
                onPress={() => handleSelectPlace(item)}
              >
                <View style={styles.predictionIcon}>
                  <MaterialIcons name="location-on" size={20} color="#6366F1" />
                </View>
                <View style={styles.predictionContent}>
                  <Text style={styles.predictionMain}>
                    {item.structured_formatting.main_text}
                  </Text>
                  <Text style={styles.predictionSecondary}>
                    {item.structured_formatting.secondary_text}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              !loading && searchQuery.length > 0 ? (
                <View style={styles.emptyContainer}>
                  <MaterialIcons name="search-off" size={48} color="#D1D5DB" />
                  <Text style={styles.emptyText}>No locations found</Text>
                  <Text style={styles.emptySubtext}>
                    Try searching for a landmark or address
                  </Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    margin: 16,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#111827",
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  locationName: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    fontWeight: "500",
  },
  predictionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    gap: 12,
  },
  predictionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  predictionContent: {
    flex: 1,
  },
  predictionMain: {
    fontSize: 15,
    fontWeight: "500",
    color: "#111827",
    marginBottom: 2,
  },
  predictionSecondary: {
    fontSize: 13,
    color: "#6B7280",
  },
  emptyContainer: {
    padding: 60,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B7280",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
});
