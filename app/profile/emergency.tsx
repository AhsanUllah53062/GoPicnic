import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    Linking,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { getUserProfile } from "../../services/profile";
import { useUser } from "../../src/context/UserContext";

export default function EmergencyPage() {
  const router = useRouter();
  const { user } = useUser();
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    if (!user) return;
    try {
      const profile = await getUserProfile(user.id);
      if (profile) {
        setContacts(profile.emergencyContacts);
      }
    } catch (error) {
      console.error("Error loading contacts:", error);
    }
  };

  const handleSOS = () => {
    Alert.alert("SOS Alert", "Send emergency location to your contacts?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send SOS",
        style: "destructive",
        onPress: () =>
          Alert.alert("SOS Sent", "Emergency alert sent to all contacts"),
      },
    ]);
  };

  const callEmergency = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <View style={emergencyStyles.container}>
      <View style={emergencyStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={emergencyStyles.headerTitle}>Emergency Hub</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={emergencyStyles.content}>
        {/* SOS Button */}
        <TouchableOpacity style={emergencyStyles.sosButton} onPress={handleSOS}>
          <MaterialIcons name="warning" size={32} color="#fff" />
          <Text style={emergencyStyles.sosText}>SOS - Send Location</Text>
        </TouchableOpacity>

        {/* Quick Dial */}
        <View style={emergencyStyles.section}>
          <Text style={emergencyStyles.sectionTitle}>Quick Dial</Text>
          <TouchableOpacity
            style={emergencyStyles.quickDial}
            onPress={() => callEmergency("1122")}
          >
            <MaterialIcons name="local-hospital" size={24} color="#EF4444" />
            <View style={emergencyStyles.quickDialContent}>
              <Text style={emergencyStyles.quickDialTitle}>
                Emergency Services
              </Text>
              <Text style={emergencyStyles.quickDialNumber}>1122</Text>
            </View>
            <MaterialIcons name="phone" size={24} color="#10B981" />
          </TouchableOpacity>

          <TouchableOpacity
            style={emergencyStyles.quickDial}
            onPress={() => callEmergency("15")}
          >
            <MaterialIcons name="local-police" size={24} color="#3B82F6" />
            <View style={emergencyStyles.quickDialContent}>
              <Text style={emergencyStyles.quickDialTitle}>Police</Text>
              <Text style={emergencyStyles.quickDialNumber}>15</Text>
            </View>
            <MaterialIcons name="phone" size={24} color="#10B981" />
          </TouchableOpacity>
        </View>

        {/* Emergency Contacts */}
        <View style={emergencyStyles.section}>
          <View style={emergencyStyles.sectionHeader}>
            <Text style={emergencyStyles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Coming Soon",
                  "Add emergency contacts feature coming soon",
                )
              }
            >
              <MaterialIcons name="add" size={24} color="#6366F1" />
            </TouchableOpacity>
          </View>

          {contacts.length === 0 ? (
            <View style={emergencyStyles.emptyState}>
              <Text style={emergencyStyles.emptyText}>
                No emergency contacts added
              </Text>
            </View>
          ) : (
            contacts.map((contact) => (
              <TouchableOpacity
                key={contact.id}
                style={emergencyStyles.contactCard}
                onPress={() => callEmergency(contact.phone)}
              >
                <View style={emergencyStyles.contactAvatar}>
                  <MaterialIcons name="person" size={24} color="#6366F1" />
                </View>
                <View style={emergencyStyles.contactInfo}>
                  <Text style={emergencyStyles.contactName}>
                    {contact.name}
                  </Text>
                  <Text style={emergencyStyles.contactRelation}>
                    {contact.relationship}
                  </Text>
                </View>
                <MaterialIcons name="phone" size={20} color="#10B981" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* First Aid Guide */}
        <View style={emergencyStyles.section}>
          <Text style={emergencyStyles.sectionTitle}>
            First Aid Quick Guide
          </Text>
          <TouchableOpacity
            style={emergencyStyles.guideCard}
            onPress={() =>
              Alert.alert("Coming Soon", "First aid guide coming soon")
            }
          >
            <MaterialIcons name="medical-services" size={24} color="#EF4444" />
            <Text style={emergencyStyles.guideText}>
              Offline First Aid Guide
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const emergencyStyles = StyleSheet.create({
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
  content: { flex: 1, padding: 16 },
  sosButton: {
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    borderRadius: 16,
    gap: 12,
    marginBottom: 24,
  },
  sosText: { fontSize: 18, fontWeight: "700", color: "#fff" },
  section: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
  },
  quickDial: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  quickDialContent: { flex: 1 },
  quickDialTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  quickDialNumber: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  emptyState: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  emptyText: { fontSize: 14, color: "#9CA3AF" },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    gap: 12,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 15, fontWeight: "600", color: "#111827" },
  contactRelation: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  guideCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  guideText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#111827" },
});
