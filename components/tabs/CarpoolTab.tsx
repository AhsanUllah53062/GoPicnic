import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Carpool,
  createCarpool,
  CreateCarpoolData,
  deleteCarpool,
  getTripCarpools,
  updateCarpool,
} from "../../services/carpool";
import { Trip } from "../../services/trips";
import CarpoolCard from "../carpool/CarpoolCard";
import CarpoolEditorModal from "../carpool/CarpoolEditorModal";

type Props = {
  tripId: string;
  trip: Trip;
  userId: string;
};

export default function CarpoolTab({ tripId, trip, userId }: Props) {
  const [carpools, setCarpools] = useState<Carpool[]>([]);
  const [loading, setLoading] = useState(true);
  const [showEditorModal, setShowEditorModal] = useState(false);
  const [editingCarpool, setEditingCarpool] = useState<Carpool | null>(null);
  const [hasDecided, setHasDecided] = useState(false);
  const [wantsCarpool, setWantsCarpool] = useState(false);

  useEffect(() => {
    loadCarpools();
  }, [tripId]);

  const loadCarpools = async () => {
    setLoading(true);
    try {
      console.log("📥 Loading carpools for trip:", tripId);
      const carpoolsList = await getTripCarpools(tripId);
      setCarpools(carpoolsList);

      // If carpools exist, user has decided
      if (carpoolsList.length > 0) {
        setHasDecided(true);
        setWantsCarpool(true);
      }

      console.log(`✅ Loaded ${carpoolsList.length} carpools`);
    } catch (error: any) {
      console.error("❌ Error loading carpools:", error);
      Alert.alert("Error", "Failed to load carpools");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCarpool = async (carpoolData: CreateCarpoolData) => {
    try {
      console.log("➕ Creating new carpool");
      await createCarpool(carpoolData);
      setShowEditorModal(false);
      await loadCarpools();
      Alert.alert("Success", "Carpool created successfully");
    } catch (error: any) {
      console.error("❌ Error creating carpool:", error);
      Alert.alert("Error", "Failed to create carpool");
    }
  };

  const handleUpdateCarpool = async (carpoolData: CreateCarpoolData) => {
    if (!editingCarpool?.id) return;

    try {
      console.log("✏️ Updating carpool");
      await updateCarpool(tripId, editingCarpool.id, carpoolData);
      setEditingCarpool(null);
      setShowEditorModal(false);
      await loadCarpools();
      Alert.alert("Success", "Carpool updated successfully");
    } catch (error: any) {
      console.error("❌ Error updating carpool:", error);
      Alert.alert("Error", "Failed to update carpool");
    }
  };

  const handleDeleteCarpool = async (carpoolId: string) => {
    try {
      console.log("🗑️ Deleting carpool:", carpoolId);
      await deleteCarpool(tripId, carpoolId);
      await loadCarpools();
    } catch (error: any) {
      console.error("❌ Error deleting carpool:", error);
      Alert.alert("Error", "Failed to delete carpool");
    }
  };

  const handleDecision = (wants: boolean) => {
    setHasDecided(true);
    setWantsCarpool(wants);
    if (wants) {
      setShowEditorModal(true);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading carpools...</Text>
      </View>
    );
  }

  // Decision Screen
  if (!hasDecided) {
    return (
      <View style={styles.decisionContainer}>
        <View style={styles.decisionCard}>
          <View style={styles.decisionIcon}>
            <MaterialIcons name="directions-car" size={48} color="#6366F1" />
          </View>

          <Text style={styles.decisionTitle}>Carpool for your trip?</Text>
          <Text style={styles.decisionSubtitle}>
            Share rides with other travelers to save costs and reduce your
            carbon footprint
          </Text>

          <View style={styles.benefitsContainer}>
            <View style={styles.benefitRow}>
              <MaterialIcons name="savings" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Save money on fuel</Text>
            </View>
            <View style={styles.benefitRow}>
              <MaterialIcons name="eco" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Reduce carbon emissions</Text>
            </View>
            <View style={styles.benefitRow}>
              <MaterialIcons name="group" size={20} color="#10B981" />
              <Text style={styles.benefitText}>Meet fellow travelers</Text>
            </View>
          </View>

          <View style={styles.decisionButtons}>
            <TouchableOpacity
              style={styles.decisionButtonPrimary}
              onPress={() => handleDecision(true)}
            >
              <MaterialIcons name="check" size={20} color="#fff" />
              <Text style={styles.decisionButtonTextPrimary}>
                Yes, Create Carpool
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.decisionButtonSecondary}
              onPress={() => handleDecision(false)}
            >
              <Text style={styles.decisionButtonTextSecondary}>
                No, Maybe Later
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // No Carpool Selected
  if (!wantsCarpool) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <MaterialIcons
            name="directions-car-filled"
            size={48}
            color="#D1D5DB"
          />
        </View>
        <Text style={styles.emptyTitle}>No carpool planned</Text>
        <Text style={styles.emptySubtitle}>
          You chose not to organize a carpool for this trip
        </Text>
        <TouchableOpacity
          style={styles.changeDecisionButton}
          onPress={() => {
            setHasDecided(false);
            setWantsCarpool(false);
          }}
        >
          <Text style={styles.changeDecisionText}>Change Decision</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Carpools List
  return (
    <View style={styles.container}>
      {/* Header Stats */}
      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{carpools.length}</Text>
          <Text style={styles.statLabel}>
            {carpools.length === 1 ? "Carpool" : "Carpools"}
          </Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {carpools.reduce((sum, c) => sum + c.availableSeats, 0)}
          </Text>
          <Text style={styles.statLabel}>Seats Available</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>
            {carpools.filter((c) => c.status === "active").length}
          </Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>

      {/* Carpools List */}
      {carpools.length === 0 ? (
        <View style={styles.emptyListContainer}>
          <View style={styles.emptyListIcon}>
            <MaterialIcons name="directions-car" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyListTitle}>No carpools yet</Text>
          <Text style={styles.emptyListSubtitle}>
            Create your first carpool to get started
          </Text>
        </View>
      ) : (
        <FlatList
          data={carpools}
          keyExtractor={(item) => item.id!}
          renderItem={({ item }) => (
            <CarpoolCard
              carpool={item}
              onEdit={() => {
                setEditingCarpool(item);
                setShowEditorModal(true);
              }}
              onDelete={() => handleDeleteCarpool(item.id!)}
            />
          )}
          contentContainerStyle={styles.carpoolsList}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Floating Add Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditingCarpool(null);
          setShowEditorModal(true);
        }}
      >
        <MaterialIcons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* Carpool Editor Modal */}
      <CarpoolEditorModal
        visible={showEditorModal}
        tripId={tripId}
        userId={userId}
        carpool={editingCarpool}
        onClose={() => {
          setShowEditorModal(false);
          setEditingCarpool(null);
        }}
        onSave={editingCarpool ? handleUpdateCarpool : handleCreateCarpool}
      />
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
  decisionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 20,
  },
  decisionCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    maxWidth: 400,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  decisionIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  decisionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    textAlign: "center",
  },
  decisionSubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 32,
  },
  benefitsContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  benefitText: {
    fontSize: 15,
    color: "#374151",
    fontWeight: "500",
  },
  decisionButtons: {
    width: "100%",
    gap: 12,
  },
  decisionButtonPrimary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6366F1",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  decisionButtonTextPrimary: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  decisionButtonSecondary: {
    paddingVertical: 16,
    alignItems: "center",
  },
  decisionButtonTextSecondary: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    padding: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  changeDecisionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#6366F1",
    borderRadius: 10,
  },
  changeDecisionText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  statsCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E7EB",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyListIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyListTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptyListSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
  },
  carpoolsList: {
    padding: 16,
    paddingBottom: 100,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6366F1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
