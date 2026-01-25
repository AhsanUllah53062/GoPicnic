import { MaterialIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import LocationSearchModal from "../components/LocationSearchModal";
import { createTrip } from "../services/trips";
import { useUser } from "../src/context/UserContext";

export default function StartPlanning() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { to, toImage, placeId } = useLocalSearchParams<{
    to?: string;
    toImage?: string;
    placeId?: string;
  }>();

  const isAnchored = !!to;

  // Form states
  const [fromLocation, setFromLocation] = useState<string | null>(null);
  const [fromPlaceId, setFromPlaceId] = useState<string | null>(null);
  const [toLocation, setToLocation] = useState<string | null>(to || null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [budget, setBudget] = useState<string>("");

  // UI states
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showFromModal, setShowFromModal] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validate dates when either changes
  useEffect(() => {
    if (startDate && endDate && startDate > endDate) {
      // Swap dates if start is after end
      setStartDate(endDate);
      setEndDate(startDate);
    }
  }, [startDate, endDate]);

  const handleFromLocationSelect = (location: string, placeId?: string) => {
    setFromLocation(location);
    setFromPlaceId(placeId || null);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(Platform.OS === "ios");
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(Platform.OS === "ios");
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const validateForm = (): boolean => {
    console.log("🔍 Validating form...");
    console.log("User:", user ? `${user.name} (${user.id})` : "null");
    console.log("From:", fromLocation || "Not selected");
    console.log("To:", toLocation || "Not selected");
    console.log("Start Date:", startDate || "Not selected");
    console.log("End Date:", endDate || "Not selected");
    console.log("Budget:", budget || "Not entered");

    if (!user) {
      console.log("❌ Validation failed: No user logged in");
      Alert.alert("Authentication Required", "Please log in to create a trip");
      return false;
    }

    if (!fromLocation || !toLocation) {
      console.log("❌ Validation failed: Missing locations");
      Alert.alert("Missing Information", "Please select both locations");
      return false;
    }

    if (!startDate || !endDate) {
      console.log("❌ Validation failed: Missing dates");
      Alert.alert("Missing Information", "Please select start and end dates");
      return false;
    }

    if (!budget.trim() || parseFloat(budget) <= 0) {
      console.log("❌ Validation failed: Invalid budget");
      Alert.alert("Invalid Budget", "Please enter a valid budget amount");
      return false;
    }

    console.log("✅ Form validation passed");
    return true;
  };

  const handleContinue = async () => {
    console.log("🎯 Start Planning button clicked");
    console.log("📋 Current user:", user);

    if (!validateForm()) {
      console.log("❌ Form validation failed");
      return;
    }

    // Type guard: ensure dates and locations are not null after validation
    if (!user || !fromLocation || !toLocation || !startDate || !endDate) {
      Alert.alert("Error", "Missing required information");
      return;
    }

    setLoading(true);
    console.log("⏳ Creating trip...");

    try {
      const tripData = {
        userId: user.id,
        fromLocation: fromLocation,
        toLocation: toLocation,
        startDate: startDate,
        endDate: endDate,
        budget: parseFloat(budget),
        currency: "PKR",
        placeId: placeId || undefined,
        placeName: to || undefined,
        placeImage: toImage || undefined,
        status: "planning" as const,
      };

      console.log("📦 Trip data to be saved:", {
        ...tripData,
        placeId: tripData.placeId || "Not provided",
        placeName: tripData.placeName || "Not provided",
        placeImage: tripData.placeImage || "Not provided",
      });

      const tripId = await createTrip(tripData);

      console.log("✅ Trip created successfully with ID:", tripId);

      // Navigate to itinerary builder page
      console.log("🔀 Navigating to itinerary-builder with trip ID:", tripId);

      router.push({
        pathname: "/itinerary-builder",
        params: {
          tripId: tripId,
          from: fromLocation,
          to: toLocation,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          budget: budget,
        },
      });
    } catch (error: any) {
      console.error("❌ Error creating trip:", error);
      console.error("❌ Error details:", {
        name: error.name,
        message: error.message,
        code: error.code,
        stack: error.stack,
      });

      Alert.alert(
        "Error Creating Trip",
        error.message || "Failed to create trip. Please try again.",
        [{ text: "OK" }],
      );
    } finally {
      setLoading(false);
      console.log("✅ Loading state reset");
    }
  };

  if (userLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.headerSection}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialIcons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>

          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              {isAnchored ? `Trip to ${to}` : "Plan a New Trip"}
            </Text>
            <Text style={styles.headerSubtitle}>
              Build your perfect itinerary
            </Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* From Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>From</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => setShowFromModal(true)}
              disabled={loading}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="flight-takeoff"
                  size={22}
                  color="#007AFF"
                />
              </View>
              <Text
                style={[
                  styles.inputText,
                  !fromLocation && styles.placeholderText,
                ]}
              >
                {fromLocation || "Select starting location"}
              </Text>
              <MaterialIcons name="chevron-right" size={24} color="#C7C7CC" />
            </TouchableOpacity>
          </View>

          {/* To Location */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>To</Text>
            <View style={[styles.inputRow, isAnchored && styles.disabledInput]}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="flight-land"
                  size={22}
                  color={isAnchored ? "#C7C7CC" : "#007AFF"}
                />
              </View>
              <Text
                style={[
                  styles.inputText,
                  isAnchored && styles.disabledText,
                  !toLocation && styles.placeholderText,
                ]}
              >
                {toLocation || "Select destination"}
              </Text>
              {isAnchored && (
                <View style={styles.lockedBadge}>
                  <MaterialIcons name="lock" size={14} color="#666" />
                </View>
              )}
            </View>
          </View>

          {/* Date Range */}
          <View style={styles.dateRow}>
            {/* Start Date */}
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>Start Date</Text>
              <TouchableOpacity
                style={styles.inputRow}
                onPress={() => setShowStartPicker(true)}
                disabled={loading}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="event" size={22} color="#007AFF" />
                </View>
                <Text
                  style={[
                    styles.inputText,
                    !startDate && styles.placeholderText,
                  ]}
                >
                  {startDate
                    ? startDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Select"}
                </Text>
              </TouchableOpacity>
            </View>

            {/* End Date */}
            <View style={[styles.inputGroup, styles.halfWidth]}>
              <Text style={styles.inputLabel}>End Date</Text>
              <TouchableOpacity
                style={styles.inputRow}
                onPress={() => setShowEndPicker(true)}
                disabled={loading}
              >
                <View style={styles.iconContainer}>
                  <MaterialIcons name="event" size={22} color="#007AFF" />
                </View>
                <Text
                  style={[styles.inputText, !endDate && styles.placeholderText]}
                >
                  {endDate
                    ? endDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })
                    : "Select"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Date Pickers */}
          {showStartPicker && (
            <DateTimePicker
              value={startDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleStartDateChange}
              minimumDate={new Date()}
            />
          )}
          {showEndPicker && (
            <DateTimePicker
              value={endDate || startDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleEndDateChange}
              minimumDate={startDate || new Date()}
            />
          )}

          {/* Budget */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Budget (PKR)</Text>
            <View style={styles.inputRow}>
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name="account-balance-wallet"
                  size={22}
                  color="#007AFF"
                />
              </View>
              <TextInput
                style={styles.budgetInput}
                placeholder="Enter your budget"
                placeholderTextColor="#C7C7CC"
                keyboardType="numeric"
                value={budget}
                onChangeText={setBudget}
                editable={!loading}
              />
              <Text style={styles.currencyBadge}>PKR</Text>
            </View>
          </View>

          {/* Trip Summary */}
          {fromLocation && toLocation && startDate && endDate && (
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Trip Summary</Text>
              <View style={styles.summaryRow}>
                <MaterialIcons name="route" size={18} color="#666" />
                <Text style={styles.summaryText}>
                  {fromLocation} → {toLocation}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <MaterialIcons name="calendar-today" size={18} color="#666" />
                <Text style={styles.summaryText}>
                  {Math.ceil(
                    (endDate.getTime() - startDate.getTime()) /
                      (1000 * 60 * 60 * 24),
                  )}{" "}
                  days
                </Text>
              </View>
              {budget && (
                <View style={styles.summaryRow}>
                  <MaterialIcons name="payments" size={18} color="#666" />
                  <Text style={styles.summaryText}>
                    PKR {parseFloat(budget).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[styles.primaryBtn, loading && styles.primaryBtnDisabled]}
          onPress={handleContinue}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.primaryBtnText}>Start Planning</Text>
              <MaterialIcons name="arrow-forward" size={20} color="#fff" />
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Location Search Modal */}
      <LocationSearchModal
        visible={showFromModal}
        onClose={() => setShowFromModal(false)}
        onSelect={handleFromLocationSelect}
        title="Select Starting Location"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  headerSection: {
    backgroundColor: "#fff",
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    marginBottom: 16,
  },
  headerTextContainer: {
    gap: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    marginTop: 4,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginBottom: 8,
    letterSpacing: -0.2,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledInput: {
    backgroundColor: "#F8F9FA",
    borderColor: "#E5E5EA",
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#C7C7CC",
    fontWeight: "400",
  },
  disabledText: {
    color: "#8E8E93",
  },
  lockedBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  budgetInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    fontWeight: "500",
  },
  currencyBadge: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
  },
  summaryCard: {
    backgroundColor: "#F0F8FF",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#D6EDFF",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 12,
  },
  summaryText: {
    fontSize: 15,
    color: "#333",
    flex: 1,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: Platform.OS === "ios" ? 34 : 16,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  primaryBtn: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryBtnDisabled: {
    backgroundColor: "#C7C7CC",
    shadowOpacity: 0,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: -0.2,
  },
});
