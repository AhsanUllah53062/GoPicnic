// app/(tabs)/inbox.tsx
import MessagesView from "@/components/inbox/MessagesView";
import NotificationsView from "@/components/inbox/NotificationsView";
import { TypographyStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import React, { useState } from "react";
import {
  Platform,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TabType = "messages" | "notifications";

export default function InboxScreen() {
  const { colors } = useThemedStyles();
  const [activeTab, setActiveTab] = useState<TabType>("messages");

  const styles = {
    container: {
      flex: 1,
      backgroundColor: colors.neutral[50],
    },
    header: {
      paddingHorizontal: Spacing.md,
      paddingTop: Platform.OS === "ios" ? 0 : Spacing.md,
      paddingBottom: Spacing.md,
      backgroundColor: colors.neutral.white,
      borderBottomWidth: 1,
      borderBottomColor: colors.border.light,
    },
    headerTitle: {
      ...TypographyStyles.h1,
      color: colors.text.primary,
    },
    segmentedControl: {
      flexDirection: "row" as const,
      backgroundColor: colors.neutral.white,
      padding: Spacing.xs,
      margin: Spacing.md,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: colors.border.light,
    },
    segmentButton: {
      flex: 1,
      paddingVertical: Spacing.sm,
      alignItems: "center" as const,
      borderRadius: 8,
    },
    segmentButtonActive: {
      backgroundColor: colors.primary,
    },
    segmentText: {
      ...TypographyStyles.label,
      color: colors.text.secondary,
    },
    segmentTextActive: {
      color: colors.neutral.white,
    },
  };

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
