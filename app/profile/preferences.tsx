import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const CARPOOL_VIBES = [
  { id: "no-smoking", label: "No Smoking", icon: "smoke-free" },
  { id: "music-lover", label: "Music Lover", icon: "music-note" },
  { id: "quiet-ride", label: "Quiet Ride", icon: "volume-off" },
  { id: "chatty", label: "Chatty", icon: "chat" },
  { id: "pets-ok", label: "Pets OK", icon: "pets" },
  { id: "ac-preference", label: "AC Preferred", icon: "ac-unit" },
];

export default function PreferencesPage() {
  const router = useRouter();
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);

  const toggleVibe = (id: string) => {
    setSelectedVibes((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    Alert.alert("Success", "Preferences saved successfully");
    router.back();
  };

  return (
    <View style={prefStyles.container}>
      <View style={prefStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={prefStyles.headerTitle}>Preferences</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={prefStyles.saveText}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={prefStyles.content}>
        {/* Place Preferences */}
        <View style={prefStyles.section}>
          <Text style={prefStyles.sectionTitle}>Place Preferences</Text>
          <View style={prefStyles.card}>
            <TouchableOpacity
              style={prefStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Terrain preferences coming soon")
              }
            >
              <MaterialIcons name="terrain" size={22} color="#6366F1" />
              <Text style={prefStyles.itemText}>Preferred Terrain</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>

            <TouchableOpacity
              style={prefStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Distance preferences coming soon")
              }
            >
              <MaterialIcons name="straighten" size={22} color="#8B5CF6" />
              <Text style={prefStyles.itemText}>Max Distance</Text>
              <Text style={prefStyles.itemValue}>100 km</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={prefStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Amenities preferences coming soon")
              }
            >
              <MaterialIcons name="local-parking" size={22} color="#EC4899" />
              <Text style={prefStyles.itemText}>Park Amenities</Text>
              <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Weather Preferences */}
        <View style={prefStyles.section}>
          <Text style={prefStyles.sectionTitle}>Weather Preferences</Text>
          <View style={prefStyles.card}>
            <TouchableOpacity
              style={prefStyles.item}
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Temperature preferences coming soon",
                )
              }
            >
              <MaterialIcons name="thermostat" size={22} color="#F59E0B" />
              <Text style={prefStyles.itemText}>Ideal Temperature</Text>
              <Text style={prefStyles.itemValue}>15-30°C</Text>
            </TouchableOpacity>

            <View style={prefStyles.item}>
              <MaterialIcons name="umbrella" size={22} color="#3B82F6" />
              <Text style={prefStyles.itemText}>Rain Alerts</Text>
              <Text style={prefStyles.itemValue}>Enabled</Text>
            </View>
          </View>
        </View>

        {/* People Preferences */}
        <View style={prefStyles.section}>
          <Text style={prefStyles.sectionTitle}>People Preferences</Text>
          <View style={prefStyles.card}>
            <TouchableOpacity
              style={prefStyles.item}
              onPress={() =>
                Alert.alert("Coming Soon", "Group size preferences coming soon")
              }
            >
              <MaterialIcons name="group" size={22} color="#14B8A6" />
              <Text style={prefStyles.itemText}>Max Group Size</Text>
              <Text style={prefStyles.itemValue}>10 people</Text>
            </TouchableOpacity>

            <View style={prefStyles.item}>
              <MaterialIcons name="shield" size={22} color="#10B981" />
              <Text style={prefStyles.itemText}>Friends-Only Carpooling</Text>
              <Text style={prefStyles.itemValue}>Off</Text>
            </View>
          </View>
        </View>

        {/* Carpool Vibe Tags */}
        <View style={prefStyles.section}>
          <Text style={prefStyles.sectionTitle}>Carpool Vibe Tags</Text>
          <View style={prefStyles.card}>
            <View style={prefStyles.vibesGrid}>
              {CARPOOL_VIBES.map((vibe) => (
                <TouchableOpacity
                  key={vibe.id}
                  style={[
                    prefStyles.vibeChip,
                    selectedVibes.includes(vibe.id) &&
                      prefStyles.vibeChipSelected,
                  ]}
                  onPress={() => toggleVibe(vibe.id)}
                >
                  <MaterialIcons
                    name={vibe.icon as any}
                    size={18}
                    color={
                      selectedVibes.includes(vibe.id) ? "#6366F1" : "#6B7280"
                    }
                  />
                  <Text
                    style={[
                      prefStyles.vibeText,
                      selectedVibes.includes(vibe.id) &&
                        prefStyles.vibeTextSelected,
                    ]}
                  >
                    {vibe.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const prefStyles = StyleSheet.create({
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
  saveText: { fontSize: 16, fontWeight: "600", color: "#6366F1" },
  content: { flex: 1 },
  section: { marginTop: 24, paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#111827" },
  itemValue: { fontSize: 14, color: "#6B7280" },
  vibesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 8,
  },
  vibeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  vibeChipSelected: {
    backgroundColor: "#EEF2FF",
    borderColor: "#6366F1",
  },
  vibeText: { fontSize: 13, fontWeight: "500", color: "#6B7280" },
  vibeTextSelected: { color: "#6366F1" },
});
