import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ProfileMenuItem from "./ProfileMenuItem";

type Props = {
  visible: boolean;
  onClose: () => void;
  onLogout: () => void;
};

export default function SettingsModal({ visible, onClose, onLogout }: Props) {
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: onLogout,
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            // Implement account deletion
            Alert.alert(
              "Feature Coming Soon",
              "Account deletion will be available soon",
            );
          },
        },
      ],
    );
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings & More</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#111827" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="person-outline"
                title="Personal Information"
                subtitle="Name, Phone, Email, Address"
                onPress={() => {
                  onClose();
                  router.push("/profile/personal-info");
                }}
              />
              <ProfileMenuItem
                icon="folder-open"
                title="Saved Documents"
                subtitle="Park Passes, ID, License, Insurance"
                onPress={() => {
                  onClose();
                  router.push("/profile/documents");
                }}
              />
            </View>
          </View>

          {/* Security */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Security</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="lock-outline"
                title="Password & Security"
                subtitle="Change password, biometrics, 2FA"
                onPress={() => {
                  onClose();
                  router.push("/profile/security");
                }}
              />
            </View>
          </View>

          {/* Preferences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="tune"
                iconColor="#8B5CF6"
                iconBgColor="#F3E8FF"
                title="Trip Preferences"
                subtitle="Places, weather, people, carpool vibes"
                onPress={() => {
                  onClose();
                  router.push("/profile/preferences");
                }}
              />
            </View>
          </View>

          {/* Emergency */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Emergency</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="warning"
                iconColor="#EF4444"
                iconBgColor="#FEE2E2"
                title="Emergency Hub"
                subtitle="SOS, emergency contacts, first aid"
                onPress={() => {
                  onClose();
                  router.push("/profile/emergency");
                }}
              />
            </View>
          </View>

          {/* Support */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="help-outline"
                iconColor="#F59E0B"
                iconBgColor="#FEF3C7"
                title="Help & Support"
                subtitle="FAQs, Chat, Report an issue"
                onPress={() => {
                  onClose();
                  router.push("/profile/help");
                }}
              />
              <ProfileMenuItem
                icon="info-outline"
                title="About"
                subtitle="Version 1.0.0"
                onPress={() => {
                  Alert.alert(
                    "goPicnic",
                    "Version 1.0.0\nYour trip planning companion",
                    [{ text: "OK" }],
                  );
                }}
              />
            </View>
          </View>

          {/* Legal */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Legal</Text>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="shield-outline"
                title="Privacy Policy"
                onPress={() => {
                  Alert.alert(
                    "Coming Soon",
                    "Privacy policy will be available soon",
                  );
                }}
              />
              <ProfileMenuItem
                icon="description"
                title="Terms of Service"
                onPress={() => {
                  Alert.alert(
                    "Coming Soon",
                    "Terms of service will be available soon",
                  );
                }}
              />
            </View>
          </View>

          {/* Account Actions */}
          <View style={styles.section}>
            <View style={styles.menuCard}>
              <ProfileMenuItem
                icon="logout"
                iconColor="#6B7280"
                iconBgColor="#F3F4F6"
                title="Logout"
                showArrow={false}
                onPress={handleLogout}
              />
              <ProfileMenuItem
                icon="delete-outline"
                iconColor="#EF4444"
                iconBgColor="#FEE2E2"
                title="Delete Account"
                showArrow={false}
                onPress={handleDeleteAccount}
              />
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
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
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
    paddingHorizontal: 4,
  },
  menuCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
});
