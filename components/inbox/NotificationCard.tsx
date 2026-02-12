// components/inbox/NotificationCard.tsx
import {
    approveJoinRequest,
    rejectJoinRequest,
} from "@/services/carpoolRequests";
import {
    deleteNotification,
    markNotificationAsRead,
    updateNotificationStatus,
} from "@/services/notifications";
import { Notification, NotificationType } from "@/types/inbox-types";
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  notification: Notification;
  onPress: () => void;
  onRefresh: () => void;
  isSelected?: boolean;
  onToggleSelect?: (id: string) => void;
  isMultiSelectMode?: boolean;
};

export default function NotificationCard({
  notification,
  onPress,
  onRefresh,
  isSelected = false,
  onToggleSelect,
  isMultiSelectMode = false,
}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [actingOnRequest, setActingOnRequest] = useState(false);
  const [localStatus, setLocalStatus] = useState<
    "pending" | "approved" | "rejected" | undefined
  >(notification.status);

  // Sync local status with notification status when notification changes
  useEffect(() => {
    setLocalStatus(notification.status);
  }, [notification.status]);

  const getIconAndColor = (
    type: NotificationType,
  ): { icon: keyof typeof MaterialIcons.glyphMap; color: string } => {
    switch (type) {
      case "trip":
        return { icon: "luggage", color: "#6366F1" };
      case "carpool":
        return { icon: "directions-car", color: "#10B981" };
      case "shopping":
        return { icon: "shopping-bag", color: "#F59E0B" };
      case "system":
        return { icon: "info", color: "#8B5CF6" };
      default:
        return { icon: "notifications", color: "#6B7280" };
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m ago`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      const days = Math.floor(hours / 24);
      return `${days}d ago`;
    }
  };

  const handleDelete = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Alert.alert("Delete Notification", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          await deleteNotification(notification.id);
          onRefresh();
        },
      },
    ]);
  };

  const handleApproveRequest = async () => {
    if (!notification.data?.requestId || !notification.data?.carpoolId) {
      Alert.alert("Error", "Invalid request data");
      return;
    }

    try {
      setActingOnRequest(true);

      await approveJoinRequest(
        notification.data.requestId,
        notification.data.carpoolId,
        "", // tripId - will be fetched from request if needed
      );
      // Update notification status in Firestore
      await updateNotificationStatus(notification.id, "approved");
      Alert.alert("Success", "Join request approved");
      onRefresh();
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to approve request");
      setActingOnRequest(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!notification.data?.requestId) {
      Alert.alert("Error", "Invalid request data");
      return;
    }

    Alert.alert(
      "Reject Request",
      "Are you sure you want to reject this request?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: async () => {
            try {
              setActingOnRequest(true);

              await rejectJoinRequest(notification.data.requestId);
              // Update notification status in Firestore
              await updateNotificationStatus(notification.id, "rejected");
              Alert.alert("Success", "Join request rejected");
              onRefresh();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to reject request");
              setActingOnRequest(false);
            }
          },
        },
      ],
    );
  };

  const handleExpand = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    // Mark as read when expanding
    if (!notification.read) {
      try {
        await markNotificationAsRead(notification.id);
        onRefresh();
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    }

    setExpanded(!expanded);
  };

  const { icon, color } = getIconAndColor(notification.type);

  return (
    <TouchableOpacity
      style={[
        styles.container,
        !notification.read && styles.containerUnread,
        isSelected && styles.containerSelected,
      ]}
      onPress={() => {
        if (isMultiSelectMode && onToggleSelect) {
          onToggleSelect(notification.id);
        } else if (notification.type === "carpool") {
          handleExpand();
        }
      }}
      onLongPress={() => {
        if (onToggleSelect) {
          onToggleSelect(notification.id);
        }
      }}
      activeOpacity={0.7}
    >
      {/* Selection Checkbox */}
      {isMultiSelectMode && (
        <View style={styles.checkboxContainer}>
          <View
            style={[styles.checkbox, isSelected && styles.checkboxSelected]}
          >
            {isSelected && (
              <MaterialIcons name="check" size={16} color="#fff" />
            )}
          </View>
        </View>
      )}

      {/* Icon */}
      <View style={[styles.iconContainer, { backgroundColor: `${color}20` }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={expanded ? undefined : 1}>
            {notification.title}
          </Text>
          {!notification.read && <View style={styles.unreadDot} />}
        </View>

        <Text style={styles.body} numberOfLines={expanded ? undefined : 2}>
          {notification.body}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.timestamp}>
            {formatTimestamp(notification.timestamp)}
          </Text>

          {expanded && notification.data && (
            <View style={styles.detailsContainer}>
              {Object.entries(notification.data).map(([key, value]) => (
                <View key={key} style={styles.detailRow}>
                  <Text style={styles.detailKey}>{key}:</Text>
                  <Text style={styles.detailValue}>{String(value)}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {expanded && (
          <View style={styles.actions}>
            {notification.type === "carpool" &&
              notification.data?.requestId &&
              notification.data?.isInitialRequest &&
              (!localStatus || localStatus === "pending") && (
                <>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.approveButton]}
                    onPress={handleApproveRequest}
                    disabled={actingOnRequest}
                  >
                    <MaterialIcons
                      name="check-circle"
                      size={16}
                      color="#10B981"
                    />
                    <Text
                      style={[
                        styles.actionButtonText,
                        styles.approveButtonText,
                      ]}
                    >
                      Approve
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, styles.rejectButton]}
                    onPress={handleRejectRequest}
                    disabled={actingOnRequest}
                  >
                    <MaterialIcons name="cancel" size={16} color="#EF4444" />
                    <Text
                      style={[styles.actionButtonText, styles.rejectButtonText]}
                    >
                      Reject
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            {localStatus === "approved" && notification.type === "carpool" && (
              <View style={styles.statusBadge}>
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
                <Text style={styles.statusBadgeText}>Approved</Text>
              </View>
            )}
            {localStatus === "rejected" && notification.type === "carpool" && (
              <View style={styles.statusBadge}>
                <MaterialIcons name="cancel" size={16} color="#EF4444" />
                <Text style={styles.statusBadgeText}>Rejected</Text>
              </View>
            )}
            {notification.actionUrl && notification.type !== "carpool" && (
              <TouchableOpacity style={styles.actionButton} onPress={onPress}>
                <MaterialIcons name="open-in-new" size={16} color="#6366F1" />
                <Text style={styles.actionButtonText}>View Details</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[styles.actionButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <MaterialIcons name="delete-outline" size={16} color="#EF4444" />
              <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Expand Indicator */}
      <TouchableOpacity onPress={handleExpand} style={styles.expandButton}>
        <MaterialIcons
          name={expanded ? "expand-less" : "expand-more"}
          size={24}
          color="#9CA3AF"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  containerUnread: {
    backgroundColor: "#F0F9FF",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#6366F1",
  },
  body: {
    fontSize: 14,
    color: "#6B7280",
    lineHeight: 20,
    marginBottom: 8,
  },
  footer: {
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  detailsContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    gap: 8,
  },
  detailKey: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6B7280",
    minWidth: 80,
  },
  detailValue: {
    flex: 1,
    fontSize: 13,
    color: "#111827",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#EEF2FF",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366F1",
  },
  approveButton: {
    backgroundColor: "#DBEAFE",
    flex: 1,
  },
  approveButtonText: {
    color: "#10B981",
  },
  rejectButton: {
    backgroundColor: "#FEE2E2",
    flex: 1,
  },
  rejectButtonText: {
    color: "#EF4444",
  },
  deleteButton: {
    backgroundColor: "#FEE2E2",
  },
  deleteButtonText: {
    color: "#EF4444",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F0FDF4",
    flex: 1,
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#10B981",
  },
  expandButton: {
    marginLeft: 8,
  },
  containerSelected: {
    backgroundColor: "#EEF2FF",
    borderLeftWidth: 4,
    borderLeftColor: "#6366F1",
  },
  checkboxContainer: {
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxSelected: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
});
