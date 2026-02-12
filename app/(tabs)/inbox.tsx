// app/(tabs)/inbox.tsx
import MessagesView from "@/components/inbox/MessagesView";
import NotificationsView from "@/components/inbox/NotificationsView";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "messages" | "notifications";

export default function InboxScreen() {
  const [activeTab, setActiveTab] = useState<TabType>("messages");

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inbox</Text>
      </View>

      {/* Segmented Control */}
      <View style={styles.segmentedControl}>
        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === "messages" && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab("messages")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "messages" && styles.segmentTextActive,
            ]}
          >
            Messages
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            activeTab === "notifications" && styles.segmentButtonActive,
          ]}
          onPress={() => setActiveTab("notifications")}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.segmentText,
              activeTab === "notifications" && styles.segmentTextActive,
            ]}
          >
            Notifications
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      {activeTab === "messages" ? <MessagesView /> : <NotificationsView />}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 0 : 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#111827",
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 4,
    margin: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 8,
  },
  segmentButtonActive: {
    backgroundColor: "#6366F1",
  },
  segmentText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6B7280",
  },
  segmentTextActive: {
    color: "#fff",
  },
});
