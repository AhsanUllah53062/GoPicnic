import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    searchTouristAttractions,
    TouristAttraction,
} from "../../services/googlePlaces";
import { PlaceVisit } from "../../services/itinerary";

type Props = {
  visible: boolean;
  cityName: string;
  onClose: () => void;
  onAddPlace: (place: PlaceVisit) => void;
};

export default function AddPlaceModal({
  visible,
  cityName,
  onClose,
  onAddPlace,
}: Props) {
  const [step, setStep] = useState<"search" | "details">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [attractions, setAttractions] = useState<TouristAttraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAttraction, setSelectedAttraction] =
    useState<TouristAttraction | null>(null);

  // Place details
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [expense, setExpense] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");
  const [notes, setNotes] = useState("");

  const handleSearch = async () => {
    if (!searchQuery.trim() && attractions.length === 0) {
      // Load default attractions
      setLoading(true);
      try {
        const results = await searchTouristAttractions(cityName);
        setAttractions(results);
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    } else if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await searchTouristAttractions(cityName, searchQuery);
        setAttractions(results);
      } catch (error: any) {
        Alert.alert("Error", error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSelectAttraction = (attraction: TouristAttraction) => {
    console.log(`📍 Selected attraction: ${attraction.name}`);
    setSelectedAttraction(attraction);
    setStep("details");
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (): number => {
    const diff = endTime.getTime() - startTime.getTime();
    return Math.max(0, Math.round(diff / 60000)); // minutes
  };

  const handleAddPlace = () => {
    if (!selectedAttraction) return;

    const newPlace: PlaceVisit = {
      id: Date.now().toString(),
      placeId: selectedAttraction.place_id,
      placeName: selectedAttraction.name,
      placeAddress: selectedAttraction.formatted_address,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      duration: calculateDuration(),
      expense: expense ? parseFloat(expense) : undefined,
      expenseCategory: expenseCategory || undefined,
      notes: notes || undefined,
      createdAt: new Date(),
    };

    console.log(`✅ Adding place:`, newPlace);
    onAddPlace(newPlace);
    handleClose();
  };

  const handleClose = () => {
    setStep("search");
    setSearchQuery("");
    setAttractions([]);
    setSelectedAttraction(null);
    setExpense("");
    setExpenseCategory("");
    setNotes("");
    onClose();
  };

  // Auto-search on modal open
  useState(() => {
    if (visible && attractions.length === 0) {
      handleSearch();
    }
  });

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {step === "search" ? `Places in ${cityName}` : "Add Details"}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {step === "search" ? (
          // Search Step
          <>
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <MaterialIcons name="search" size={22} color="#8E8E93" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search attractions..."
                placeholderTextColor="#C7C7CC"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <MaterialIcons name="cancel" size={20} color="#C7C7CC" />
                </TouchableOpacity>
              )}
            </View>

            {/* Results */}
            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={styles.loadingText}>Searching attractions...</Text>
              </View>
            ) : (
              <FlatList
                data={attractions}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.attractionItem}
                    onPress={() => handleSelectAttraction(item)}
                  >
                    <View style={styles.attractionIcon}>
                      <MaterialIcons name="place" size={24} color="#007AFF" />
                    </View>
                    <View style={styles.attractionContent}>
                      <Text style={styles.attractionName}>{item.name}</Text>
                      <Text style={styles.attractionAddress} numberOfLines={1}>
                        {item.formatted_address}
                      </Text>
                      {item.rating && (
                        <View style={styles.ratingRow}>
                          <MaterialIcons
                            name="star"
                            size={16}
                            color="#FFD700"
                          />
                          <Text style={styles.ratingText}>
                            {item.rating} ({item.user_ratings_total || 0})
                          </Text>
                        </View>
                      )}
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color="#C7C7CC"
                    />
                  </TouchableOpacity>
                )}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <MaterialIcons
                      name="search-off"
                      size={48}
                      color="#C7C7CC"
                    />
                    <Text style={styles.emptyText}>No attractions found</Text>
                    <Text style={styles.emptySubtext}>
                      Try searching for specific places
                    </Text>
                  </View>
                }
              />
            )}
          </>
        ) : (
          // Details Step
          <ScrollView style={styles.detailsContainer}>
            {selectedAttraction && (
              <>
                {/* Selected Place Info */}
                <View style={styles.selectedPlaceCard}>
                  <MaterialIcons name="place" size={32} color="#007AFF" />
                  <View style={styles.selectedPlaceContent}>
                    <Text style={styles.selectedPlaceName}>
                      {selectedAttraction.name}
                    </Text>
                    <Text style={styles.selectedPlaceAddress} numberOfLines={2}>
                      {selectedAttraction.formatted_address}
                    </Text>
                  </View>
                </View>

                {/* Time Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Visit Time</Text>
                  <View style={styles.timeRow}>
                    <TouchableOpacity
                      style={styles.timeInput}
                      onPress={() => setShowStartPicker(true)}
                    >
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color="#007AFF"
                      />
                      <Text style={styles.timeText}>
                        {formatTime(startTime)}
                      </Text>
                    </TouchableOpacity>

                    <Text style={styles.timeSeparator}>to</Text>

                    <TouchableOpacity
                      style={styles.timeInput}
                      onPress={() => setShowEndPicker(true)}
                    >
                      <MaterialIcons
                        name="access-time"
                        size={20}
                        color="#007AFF"
                      />
                      <Text style={styles.timeText}>{formatTime(endTime)}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.durationText}>
                    Duration: {calculateDuration()} minutes
                  </Text>
                </View>

                {/* Time Pickers */}
                {showStartPicker && (
                  <DateTimePicker
                    value={startTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                      setShowStartPicker(Platform.OS === "ios");
                      if (date) setStartTime(date);
                    }}
                  />
                )}
                {showEndPicker && (
                  <DateTimePicker
                    value={endTime}
                    mode="time"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    onChange={(event, date) => {
                      setShowEndPicker(Platform.OS === "ios");
                      if (date) setEndTime(date);
                    }}
                  />
                )}

                {/* Expense */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Expense (Optional)</Text>
                  <View style={styles.expenseRow}>
                    <TextInput
                      style={styles.expenseInput}
                      placeholder="Amount"
                      placeholderTextColor="#C7C7CC"
                      keyboardType="numeric"
                      value={expense}
                      onChangeText={setExpense}
                    />
                    <TextInput
                      style={styles.categoryInput}
                      placeholder="Category"
                      placeholderTextColor="#C7C7CC"
                      value={expenseCategory}
                      onChangeText={setExpenseCategory}
                    />
                  </View>
                </View>

                {/* Notes */}
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Notes (Optional)</Text>
                  <TextInput
                    style={styles.notesInput}
                    placeholder="Add any notes about this visit..."
                    placeholderTextColor="#C7C7CC"
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                {/* Add Button */}
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={handleAddPlace}
                >
                  <Text style={styles.addButtonText}>Add to Itinerary</Text>
                  <MaterialIcons name="check" size={20} color="#fff" />
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        )}
      </KeyboardAvoidingView>
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
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 10,
    margin: 16,
    paddingHorizontal: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: "#000",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#8E8E93",
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    gap: 12,
  },
  attractionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
  },
  attractionContent: {
    flex: 1,
  },
  attractionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  attractionAddress: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  ratingText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#8E8E93",
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#C7C7CC",
    marginTop: 8,
  },
  detailsContainer: {
    flex: 1,
    padding: 20,
  },
  selectedPlaceCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    gap: 12,
  },
  selectedPlaceContent: {
    flex: 1,
  },
  selectedPlaceName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
    marginBottom: 4,
  },
  selectedPlaceAddress: {
    fontSize: 14,
    color: "#666",
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
  },
  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  timeInput: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  timeSeparator: {
    fontSize: 16,
    color: "#8E8E93",
  },
  durationText: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 8,
  },
  expenseRow: {
    flexDirection: "row",
    gap: 12,
  },
  expenseInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  categoryInput: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
  },
  notesInput: {
    backgroundColor: "#F2F2F7",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#000",
    minHeight: 80,
    textAlignVertical: "top",
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    gap: 8,
  },
  addButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
});
