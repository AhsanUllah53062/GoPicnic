import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getTripCarpools } from "../../services/carpool";
import { calculateTotalSpent, getTripExpenses } from "../../services/expenses";
import { getAllDayPlans } from "../../services/itinerary";
import { Trip } from "../../services/trips";
import { TripSummary, downloadTripSummary } from "../../services/tripSummary";
import StatCard from "../overview/StatCard";

type Props = {
  tripId: string;
  trip: Trip;
  days: Date[];
};

export default function OverviewTab({ tripId, trip, days }: Props) {
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [summary, setSummary] = useState<TripSummary | null>(null);

  useEffect(() => {
    loadSummary();
  }, [tripId]);

  const loadSummary = async () => {
    setLoading(true);
    try {
      console.log("📊 Loading trip summary...");

      const [expenses, carpools, dayPlans] = await Promise.all([
        getTripExpenses(tripId),
        getTripCarpools(tripId),
        getAllDayPlans(tripId),
      ]);

      const totalSpent = calculateTotalSpent(expenses);
      const placesVisited = dayPlans.reduce(
        (sum, day) => sum + day.places.length,
        0,
      );

      const tripSummary: TripSummary = {
        trip,
        expenses,
        carpools,
        dayPlans,
        statistics: {
          totalDays: days.length,
          totalExpenses: expenses.length,
          totalSpent,
          budgetRemaining: trip.budget - totalSpent,
          placesVisited,
          carpoolsOrganized: carpools.length,
        },
      };

      setSummary(tripSummary);
      console.log("✅ Summary loaded");
    } catch (error: any) {
      console.error("❌ Error loading summary:", error);
      Alert.alert("Error", "Failed to load trip summary");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!summary) return;

    setDownloading(true);
    try {
      await downloadTripSummary(summary);
      Alert.alert("Success", "Trip summary downloaded successfully!");
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to download trip summary");
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading overview...</Text>
      </View>
    );
  }

  if (!summary) {
    return (
      <View style={styles.errorContainer}>
        <MaterialIcons name="error-outline" size={48} color="#EF4444" />
        <Text style={styles.errorText}>Failed to load trip overview</Text>
      </View>
    );
  }

  const { statistics } = summary;
  const isOverBudget = statistics.budgetRemaining < 0;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Trip Header */}
        <View style={styles.headerCard}>
          <View style={styles.headerIcon}>
            <MaterialIcons name="luggage" size={32} color="#6366F1" />
          </View>
          <Text style={styles.headerTitle}>
            {trip.fromLocation} → {trip.toLocation}
          </Text>
          <Text style={styles.headerSubtitle}>
            {trip.startDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}{" "}
            -{" "}
            {trip.endDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </Text>
          <View style={styles.statusBadge}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor:
                    trip.status === "active" ? "#10B981" : "#6B7280",
                },
              ]}
            />
            <Text style={styles.statusText}>
              {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Statistics Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Statistics</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="event"
              label="Duration"
              value={`${statistics.totalDays} days`}
              color="#6366F1"
              bgColor="#EEF2FF"
            />
            <StatCard
              icon="place"
              label="Places"
              value={statistics.placesVisited}
              color="#8B5CF6"
              bgColor="#F3E8FF"
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="receipt-long"
              label="Expenses"
              value={statistics.totalExpenses}
              color="#EC4899"
              bgColor="#FCE7F3"
            />
            <StatCard
              icon="directions-car"
              label="Carpools"
              value={statistics.carpoolsOrganized}
              color="#14B8A6"
              bgColor="#CCFBF1"
            />
          </View>
        </View>

        {/* Budget Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Budget Summary</Text>
          <View style={styles.budgetCard}>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Total Budget</Text>
              <Text style={styles.budgetValue}>
                {trip.currency} {trip.budget.toLocaleString()}
              </Text>
            </View>
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabel}>Total Spent</Text>
              <Text style={[styles.budgetValue, { color: "#EF4444" }]}>
                {trip.currency} {statistics.totalSpent.toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.budgetRow}>
              <Text style={styles.budgetLabelBold}>
                {isOverBudget ? "Over Budget" : "Remaining"}
              </Text>
              <Text
                style={[
                  styles.budgetValueBold,
                  { color: isOverBudget ? "#EF4444" : "#10B981" },
                ]}
              >
                {trip.currency}{" "}
                {Math.abs(statistics.budgetRemaining).toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        {/* Itinerary Summary */}
        {summary.dayPlans.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary Highlights</Text>
            {summary.dayPlans.map((day, index) => (
              <View key={index} style={styles.dayCard}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayNumber}>
                    <Text style={styles.dayNumberText}>{day.dayIndex + 1}</Text>
                  </View>
                  <View style={styles.dayInfo}>
                    <Text style={styles.dayTitle}>Day {day.dayIndex + 1}</Text>
                    <Text style={styles.dayDate}>
                      {day.date.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </Text>
                  </View>
                </View>

                {day.places.length > 0 && (
                  <View style={styles.dayContent}>
                    <View style={styles.dayMetaRow}>
                      <MaterialIcons name="place" size={16} color="#6B7280" />
                      <Text style={styles.dayMeta}>
                        {day.places.length}{" "}
                        {day.places.length === 1 ? "place" : "places"}
                      </Text>
                    </View>
                    {day.todos.length > 0 && (
                      <View style={styles.dayMetaRow}>
                        <MaterialIcons
                          name="check-circle"
                          size={16}
                          color="#6B7280"
                        />
                        <Text style={styles.dayMeta}>
                          {day.todos.filter((t) => t.done).length}/
                          {day.todos.length} tasks done
                        </Text>
                      </View>
                    )}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Carpool Summary */}
        {summary.carpools.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Carpool Details</Text>
            {summary.carpools.map((carpool, index) => (
              <View key={index} style={styles.carpoolCard}>
                <View style={styles.carpoolHeader}>
                  <View style={styles.carpoolIcon}>
                    <MaterialIcons
                      name="directions-car"
                      size={20}
                      color="#14B8A6"
                    />
                  </View>
                  <View style={styles.carpoolInfo}>
                    <Text style={styles.carpoolDriver}>
                      {carpool.driverName}
                    </Text>
                    <Text style={styles.carpoolCar}>{carpool.carModel}</Text>
                  </View>
                </View>
                <View style={styles.carpoolDetails}>
                  <Text style={styles.carpoolDetail}>
                    {carpool.availableSeats}/{carpool.totalSeats} seats
                    available
                  </Text>
                  <Text style={styles.carpoolDetail}>
                    {carpool.currency} {carpool.chargePerPerson}/person
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Download Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={handleDownload}
          disabled={downloading}
        >
          {downloading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <MaterialIcons name="download" size={24} color="#fff" />
              <Text style={styles.downloadButtonText}>Download Trip Plan</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 40,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  headerCard: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 12,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  section: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  budgetCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  budgetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  budgetLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  budgetValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  budgetLabelBold: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "700",
  },
  budgetValueBold: {
    fontSize: 18,
    fontWeight: "700",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 8,
  },
  dayCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  dayNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  dayNumberText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6366F1",
  },
  dayInfo: {
    flex: 1,
  },
  dayTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  dayDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  dayContent: {
    flexDirection: "row",
    gap: 16,
    flexWrap: "wrap",
  },
  dayMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  dayMeta: {
    fontSize: 13,
    color: "#6B7280",
  },
  carpoolCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  carpoolHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  carpoolIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#CCFBF1",
    justifyContent: "center",
    alignItems: "center",
  },
  carpoolInfo: {
    flex: 1,
  },
  carpoolDriver: {
    fontSize: 15,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  carpoolCar: {
    fontSize: 13,
    color: "#6B7280",
  },
  carpoolDetails: {
    flexDirection: "row",
    gap: 16,
  },
  carpoolDetail: {
    fontSize: 13,
    color: "#374151",
  },
  bottomContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 4,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#10B981",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  downloadButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
