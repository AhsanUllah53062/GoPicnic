import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function FriendsPage() {
  const router = useRouter();

  return (
    <View style={friendsStyles.container}>
      <View style={friendsStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={friendsStyles.headerTitle}>Friends & Connections</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={friendsStyles.emptyContainer}>
        <View style={friendsStyles.emptyIcon}>
          <MaterialIcons name="group" size={48} color="#14B8A6" />
        </View>
        <Text style={friendsStyles.emptyTitle}>No connections yet</Text>
        <Text style={friendsStyles.emptyText}>
          Connect with friends to plan trips together
        </Text>
      </View>
    </View>
  );
}

const friendsStyles = StyleSheet.create({
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
    backgroundColor: "#CCFBF1",
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
