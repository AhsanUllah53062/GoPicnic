import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    GearItem,
    getUserProfile,
    updateUserProfile,
} from "../../services/profile";
import { useUser } from "../../src/context/UserContext";

const GEAR_CATEGORIES = [
  "Camping",
  "Cooking",
  "Sports",
  "Electronics",
  "Safety",
  "Other",
];
const GEAR_CONDITIONS = ["excellent", "good", "fair"] as const;

export default function GearInventoryPage() {
  const router = useRouter();
  const { user } = useUser();

  const [loading, setLoading] = useState(true);
  const [gearItems, setGearItems] = useState<GearItem[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Camping");
  const [quantity, setQuantity] = useState("1");
  const [condition, setCondition] = useState<"excellent" | "good" | "fair">(
    "good",
  );

  useEffect(() => {
    loadGear();
  }, []);

  const loadGear = async () => {
    if (!user) return;

    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        setGearItems(profile.gearInventory);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to load gear");
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!user) return;

    if (!itemName.trim()) {
      Alert.alert("Validation Error", "Item name is required");
      return;
    }

    const newItem: GearItem = {
      id: Date.now().toString(),
      name: itemName.trim(),
      category,
      quantity: parseInt(quantity) || 1,
      condition,
    };

    const updatedGear = [...gearItems, newItem];

    try {
      await updateUserProfile(user.id, {
        gearInventory: updatedGear,
      });

      setGearItems(updatedGear);
      setShowAddModal(false);
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add item");
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!user) return;

    const updatedGear = gearItems.filter((item) => item.id !== itemId);

    try {
      await updateUserProfile(user.id, {
        gearInventory: updatedGear,
      });

      setGearItems(updatedGear);
    } catch (error) {
      Alert.alert("Error", "Failed to delete item");
    }
  };

  const resetForm = () => {
    setItemName("");
    setCategory("Camping");
    setQuantity("1");
    setCondition("good");
  };

  const getConditionColor = (cond: string) => {
    switch (cond) {
      case "excellent":
        return "#10B981";
      case "good":
        return "#F59E0B";
      case "fair":
        return "#EF4444";
      default:
        return "#6B7280";
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>The Picnic Trunk</Text>
        <TouchableOpacity onPress={() => setShowAddModal(true)}>
          <MaterialIcons name="add" size={24} color="#6366F1" />
        </TouchableOpacity>
      </View>

      {gearItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <MaterialIcons name="backpack" size={48} color="#9CA3AF" />
          </View>
          <Text style={styles.emptyTitle}>No gear yet</Text>
          <Text style={styles.emptySubtitle}>
            Start adding your picnic gear to keep track
          </Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddModal(true)}
          >
            <MaterialIcons name="add" size={20} color="#fff" />
            <Text style={styles.addButtonText}>Add First Item</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={gearItems}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.gearCard}>
              <View style={styles.gearContent}>
                <View style={styles.gearHeader}>
                  <Text style={styles.gearName}>{item.name}</Text>
                  <TouchableOpacity
                    onPress={() => {
                      Alert.alert("Delete Item", `Remove ${item.name}?`, [
                        { text: "Cancel", style: "cancel" },
                        {
                          text: "Delete",
                          style: "destructive",
                          onPress: () => handleDeleteItem(item.id),
                        },
                      ]);
                    }}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={20}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.gearDetails}>
                  <View style={styles.gearTag}>
                    <MaterialIcons name="category" size={14} color="#6B7280" />
                    <Text style={styles.gearTagText}>{item.category}</Text>
                  </View>

                  <View style={styles.gearTag}>
                    <MaterialIcons name="inventory" size={14} color="#6B7280" />
                    <Text style={styles.gearTagText}>Qty: {item.quantity}</Text>
                  </View>

                  <View
                    style={[
                      styles.gearTag,
                      {
                        backgroundColor:
                          getConditionColor(item.condition) + "20",
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.conditionDot,
                        { backgroundColor: getConditionColor(item.condition) },
                      ]}
                    />
                    <Text
                      style={[
                        styles.gearTagText,
                        { color: getConditionColor(item.condition) },
                      ]}
                    >
                      {item.condition}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}

      {/* Add Item Modal */}
      <Modal visible={showAddModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Gear Item</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
              >
                <MaterialIcons name="close" size={24} color="#111827" />
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Item Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Camping Tent"
                  placeholderTextColor="#9CA3AF"
                  value={itemName}
                  onChangeText={setItemName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <View style={styles.categoryGrid}>
                  {GEAR_CATEGORIES.map((cat) => (
                    <TouchableOpacity
                      key={cat}
                      style={[
                        styles.categoryChip,
                        category === cat && styles.categoryChipSelected,
                      ]}
                      onPress={() => setCategory(cat)}
                    >
                      <Text
                        style={[
                          styles.categoryChipText,
                          category === cat && styles.categoryChipTextSelected,
                        ]}
                      >
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.row}>
                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Quantity</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="1"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={quantity}
                    onChangeText={setQuantity}
                  />
                </View>

                <View style={[styles.inputGroup, styles.flex1]}>
                  <Text style={styles.label}>Condition</Text>
                  <View style={styles.conditionButtons}>
                    {GEAR_CONDITIONS.map((cond) => (
                      <TouchableOpacity
                        key={cond}
                        style={[
                          styles.conditionButton,
                          condition === cond && styles.conditionButtonSelected,
                          { borderColor: getConditionColor(cond) },
                        ]}
                        onPress={() => setCondition(cond)}
                      >
                        <Text
                          style={[
                            styles.conditionButtonText,
                            condition === cond && {
                              color: getConditionColor(cond),
                            },
                          ]}
                        >
                          {cond}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleAddItem}
              >
                <Text style={styles.submitButtonText}>Add Item</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6366F1",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  addButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  listContent: {
    padding: 16,
  },
  gearCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  gearContent: {
    flex: 1,
  },
  gearHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  gearName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
  },
  gearDetails: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  gearTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  gearTagText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#6B7280",
  },
  conditionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  modalBody: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: "#111827",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
  },
  categoryChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#6B7280",
  },
  categoryChipTextSelected: {
    color: "#6366F1",
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  flex1: {
    flex: 1,
  },
  conditionButtons: {
    gap: 8,
  },
  conditionButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  conditionButtonSelected: {
    backgroundColor: "#F9FAFB",
  },
  conditionButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "capitalize",
  },
  submitButton: {
    backgroundColor: "#6366F1",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
