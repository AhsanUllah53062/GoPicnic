import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FavoritesPage() {
  const router = useRouter();

  return (
    <View style={favoritesStyles.container}>
      <View style={favoritesStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={favoritesStyles.headerTitle}>Favorite Places</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={favoritesStyles.emptyContainer}>
        <View style={favoritesStyles.emptyIcon}>
          <MaterialIcons name="favorite" size={48} color="#EC4899" />
        </View>
        <Text style={favoritesStyles.emptyTitle}>No favorites yet</Text>
        <Text style={favoritesStyles.emptyText}>
          Places you favorite will appear here
        </Text>
      </View>
    </View>
  );
}

const favoritesStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
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
  headerTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
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
    backgroundColor: "#FCE7F3",
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
  emptyText: { fontSize: 14, color: "#9CA3AF", textAlign: "center" },
});
