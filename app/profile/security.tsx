import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SecurityPage() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = () => {
    Alert.alert(
      "Coming Soon",
      "Change password feature will be available soon",
    );
  };

  return (
    <View style={securityStyles.container}>
      <View style={securityStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={securityStyles.headerTitle}>Password & Security</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={securityStyles.content}>
        <View style={securityStyles.section}>
          <Text style={securityStyles.sectionTitle}>Password</Text>
          <TouchableOpacity
            style={securityStyles.menuItem}
            onPress={handleChangePassword}
          >
            <MaterialIcons name="lock-outline" size={22} color="#6366F1" />
            <Text style={securityStyles.menuItemText}>Change Password</Text>
            <MaterialIcons name="chevron-right" size={24} color="#D1D5DB" />
          </TouchableOpacity>
        </View>

        <View style={securityStyles.section}>
          <Text style={securityStyles.sectionTitle}>
            Biometric Authentication
          </Text>
          <View style={securityStyles.menuItem}>
            <MaterialIcons name="fingerprint" size={22} color="#8B5CF6" />
            <Text style={securityStyles.menuItemText}>Face ID / Touch ID</Text>
            <Switch
              value={biometricEnabled}
              onValueChange={setBiometricEnabled}
              trackColor={{ true: "#6366F1" }}
            />
          </View>
        </View>

        <View style={securityStyles.section}>
          <Text style={securityStyles.sectionTitle}>
            Two-Factor Authentication
          </Text>
          <View style={securityStyles.menuItem}>
            <MaterialIcons name="security" size={22} color="#10B981" />
            <Text style={securityStyles.menuItemText}>Enable 2FA</Text>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ true: "#6366F1" }}
            />
          </View>
          <Text style={securityStyles.helperText}>
            Add an extra layer of security to your account
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const securityStyles = StyleSheet.create({
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
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: "500", color: "#111827" },
  helperText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginTop: 8,
    paddingHorizontal: 4,
  },
});
