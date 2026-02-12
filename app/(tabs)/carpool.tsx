// app/(tabs)/carpool.tsx
import CarpoolDetailsModal from "@/components/carpool/CarpoolDetailsModal";
import CarpoolDiscoveryCard from "@/components/carpool/CarpoolDiscoveryCard";
import { Carpool } from "@/services/carpool";
import { getAllAvailableCarpools } from "@/services/carpoolDiscovery";
import { createConversation } from "@/services/messages";
import { useUser } from "@/src/context/UserContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Platform,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type FilterType = "soonest" | "cheapest" | "seats";

export default function CarpoolDiscoveryScreen() {
  const router = useRouter();
  const { user } = useUser();

  const [carpools, setCarpools] = useState<Carpool[]>([]);
  const [filteredCarpools, setFilteredCarpools] = useState<Carpool[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>("soonest");
  const [selectedCarpool, setSelectedCarpool] = useState<Carpool | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    loadCarpools();
  }, []);

  useEffect(() => {
    applySorting(activeFilter);
  }, [carpools, activeFilter]);

  const loadCarpools = async () => {
    try {
      setLoading(true);
      // Fetch all available carpools using Firestore collectionGroup query
      const allCarpools = await getAllAvailableCarpools();
      console.log(`📱 Raw carpools received in screen: ${allCarpools.length}`);

      // Filter out full carpools and past trips if needed
      const availableCarpools = allCarpools.filter((carpool) => {
        const now = new Date();
        // departureDate is already a Date object from carpoolDiscovery.ts
        const departureDate =
          carpool.departureDate instanceof Date
            ? carpool.departureDate
            : new Date(carpool.departureDate);

        // DEBUG: Show the actual dates
        console.log(
          `🚗 ${carpool.driverName}: ` +
            `departureDate=${departureDate.toISOString().split("T")[0]} ` +
            `today=${now.toISOString().split("T")[0]} ` +
            `isAvailable=${departureDate > now}`,
        );

        // TODO: Remove this line after fixing test data
        // For now, accept all active carpools (remove date filter)
        return true; // ⚠️ TEMPORARILY ACCEPTING ALL - FIX TEST DATA BELOW
      });

      console.log(
        `✅ Filtered carpools available: ${availableCarpools.length}`,
      );
      setCarpools(availableCarpools);
    } catch (error) {
      console.error("Error loading carpools:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCarpools();
    setRefreshing(false);
  };

  const applySorting = (filter: FilterType) => {
    let sorted = [...carpools];
    console.log(`🔄 Applying ${filter} filter to ${sorted.length} carpools`);

    switch (filter) {
      case "soonest":
        sorted.sort((a, b) => {
          return a.departureDate.getTime() - b.departureDate.getTime();
        });
        break;

      case "cheapest":
        sorted.sort((a, b) => a.chargePerPerson - b.chargePerPerson);
        break;

      case "seats":
        sorted.sort((a, b) => b.availableSeats - a.availableSeats);
        break;
    }

    console.log(`📋 Sorted result: ${sorted.length} carpools for display`);
    setFilteredCarpools(sorted);
  };

  const handleFilterPress = (filter: FilterType) => {
    setActiveFilter(filter);
  };

  const handleCarpoolPress = (carpool: Carpool) => {
    setSelectedCarpool(carpool);
    setShowDetailsModal(true);
  };

  const handleJoinCarpool = (carpool: Carpool) => {
    setSelectedCarpool(carpool);
    setShowDetailsModal(true);
  };

  const handleChatPress = async (carpool: Carpool) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in to chat");
      return;
    }

    try {
      // Create or find conversation with driver
      const conversationId = await createConversation(
        [user.id, carpool.createdBy], // Both current user and driver
        [user.displayName || "User", carpool.driverName],
        {
          [user.id]: user.photoURL || "",
          [carpool.createdBy]: carpool.driverAvatar || "",
        },
        undefined, // tripId
        undefined, // tripName
        carpool.id, // carpoolId
      );

      // Navigate to chat with conversation ID
      router.push(`/chat/${conversationId}`);
    } catch (error: any) {
      console.error("Error initiating chat:", error);
      Alert.alert("Error", "Failed to start conversation");
    }
  };

  const renderFilterPill = (
    filter: FilterType,
    label: string,
    icon: keyof typeof MaterialIcons.glyphMap,
  ) => {
    const isActive = activeFilter === filter;
    return (
      <TouchableOpacity
        style={[styles.filterPill, isActive && styles.filterPillActive]}
        onPress={() => handleFilterPress(filter)}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={icon}
          size={16}
          color={isActive ? "#fff" : "#6366F1"}
        />
        <Text
          style={[
            styles.filterPillText,
            isActive && styles.filterPillTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="directions-car" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No Carpools Available</Text>
      <Text style={styles.emptySubtitle}>
        Be the first to create a carpool for your trip!
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push("/trip-details/start-planning")}
      >
        <MaterialIcons name="add" size={20} color="#fff" />
        <Text style={styles.createButtonText}>Create Trip</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Finding carpools...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Discover Carpools</Text>
          <Text style={styles.headerSubtitle}>
            {filteredCarpools.length} ride
            {filteredCarpools.length !== 1 ? "s" : ""} available
          </Text>
        </View>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.push("/(tabs)/profile")}
        >
          <MaterialIcons name="person" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      {carpools.length > 0 && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Sort by:</Text>
          <View style={styles.filterPills}>
            {renderFilterPill("soonest", "Soonest", "schedule")}
            {renderFilterPill("cheapest", "Cheapest", "payments")}
            {renderFilterPill("seats", "Seats", "event-seat")}
          </View>
        </View>
      )}

      {/* Carpool List */}
      <FlatList
        data={filteredCarpools}
        keyExtractor={(item) => item.id || ""}
        renderItem={({ item }) => (
          <CarpoolDiscoveryCard
            carpool={item}
            onPress={() => handleCarpoolPress(item)}
            onJoin={() => handleJoinCarpool(item)}
            onChat={() => handleChatPress(item)}
            isOwner={item.createdBy === user?.id}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      />

      {/* Details Modal */}
      {selectedCarpool && (
        <CarpoolDetailsModal
          visible={showDetailsModal}
          carpool={selectedCarpool}
          currentUserId={user?.id || ""}
          currentUserName={user?.name || ""}
          onClose={() => setShowDetailsModal(false)}
          onJoinSuccess={async () => {
            setShowDetailsModal(false);
            await loadCarpools();
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  filterPills: {
    flexDirection: "row",
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    gap: 6,
  },
  filterPillActive: {
    backgroundColor: "#6366F1",
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366F1",
  },
  filterPillTextActive: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  createButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
});
