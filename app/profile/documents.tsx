import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DocumentsPage() {
  const router = useRouter();

  return (
    <View style={documentsStyles.container}>
      <View style={documentsStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={documentsStyles.headerTitle}>Saved Documents</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={documentsStyles.content}>
        <View style={documentsStyles.emptyContainer}>
          <View style={documentsStyles.emptyIcon}>
            <MaterialIcons name="folder-open" size={48} color="#3B82F6" />
          </View>
          <Text style={documentsStyles.emptyTitle}>No documents saved</Text>
          <Text style={documentsStyles.emptyText}>
            Store important documents like park passes, ID, license, and
            insurance information here
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const documentsStyles = StyleSheet.create({
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
  content: { flex: 1 },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: 60,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 20,
  },
});
