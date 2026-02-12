// components/inbox/NotificationsView.tsx
import {
    deleteNotification,
    getUserNotifications,
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "@/services/notifications";
import { useUser } from "@/src/context/UserContext";
import { Notification, NotificationType } from "@/types/inbox-types";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import NotificationCard from "./NotificationCard";

export default function NotificationsView() {
  const router = useRouter();
  const { user } = useUser();

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<
    Notification[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState<
    NotificationType | "all"
  >("all");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedNotifications, setSelectedNotifications] = useState<
    Set<string>
  >(new Set());

  useEffect(() => {
    if (user) {
      loadNotifications();
    }
  }, [user]);

  useEffect(() => {
    // Filter notifications by category
    if (selectedCategory === "all") {
      setFilteredNotifications(notifications);
    } else {
      const filtered = notifications.filter((n) => n.type === selectedCategory);
      setFilteredNotifications(filtered);
    }
  }, [selectedCategory, notifications]);

  const loadNotifications = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const notifs = await getUserNotifications(user.id);
      setNotifications(notifs);
      setFilteredNotifications(notifs);
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
      loadNotifications();
    }

    // Navigate if there's an action URL
    if (notification.actionUrl) {
      router.push(notification.actionUrl as any);
    }
  };

  const handleMarkAllRead = async () => {
    if (!user) return;
    await markAllNotificationsAsRead(user.id);
    loadNotifications();
  };

  const toggleNotificationSelect = (id: string) => {
    const newSelected = new Set(selectedNotifications);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedNotifications(newSelected);
  };

  const deleteSelectedNotifications = async () => {
    try {
      await Promise.all(
        Array.from(selectedNotifications).map((id) => deleteNotification(id)),
      );
      setSelectedNotifications(new Set());
      setMultiSelectMode(false);
      await loadNotifications();
    } catch (error) {
      console.error("Error deleting notifications:", error);
    }
  };

  const exitMultiSelectMode = () => {
    setMultiSelectMode(false);
    setSelectedNotifications(new Set());
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  const renderCategoryButton = (
    category: NotificationType | "all",
    label: string,
    icon: keyof typeof MaterialIcons.glyphMap,
  ) => {
    const isActive = selectedCategory === category;
    const count =
      category === "all"
        ? notifications.length
        : notifications.filter((n) => n.type === category).length;

    return (
      <TouchableOpacity
        style={[styles.categoryButton, isActive && styles.categoryButtonActive]}
        onPress={() => setSelectedCategory(category)}
        activeOpacity={0.7}
      >
        <MaterialIcons
          name={icon}
          size={18}
          color={isActive ? "#fff" : "#6366F1"}
        />
        <Text
          style={[styles.categoryText, isActive && styles.categoryTextActive]}
        >
          {label}
        </Text>
        {count > 0 && (
          <View
            style={[
              styles.categoryCount,
              isActive && styles.categoryCountActive,
            ]}
          >
            <Text
              style={[
                styles.categoryCountText,
                isActive && styles.categoryCountTextActive,
              ]}
            >
              {count}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIconContainer}>
        <MaterialIcons name="notifications-none" size={64} color="#D1D5DB" />
      </View>
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptySubtitle}>
        You're all caught up! Check back later for updates.
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Multi-Select Toolbar */}
      {multiSelectMode && (
        <View style={styles.multiSelectToolbar}>
          <TouchableOpacity
            onPress={exitMultiSelectMode}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.selectedCountText}>
            {selectedNotifications.size} selected
          </Text>
          <TouchableOpacity
            onPress={deleteSelectedNotifications}
            disabled={selectedNotifications.size === 0}
            style={[
              styles.deleteMultiButton,
              selectedNotifications.size === 0 &&
                styles.deleteMultiButtonDisabled,
            ]}
          >
            <MaterialIcons name="delete" size={20} color="#fff" />
            <Text style={styles.deleteMultiButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Category Filters */}
      <View style={styles.categoriesContainer}>
        <View style={styles.categories}>
          {renderCategoryButton("all", "All", "inbox")}
          {renderCategoryButton("trip", "Trips", "luggage")}
          {renderCategoryButton("carpool", "Carpool", "directions-car")}
          {renderCategoryButton("shopping", "Shopping", "shopping-bag")}
          {renderCategoryButton("system", "System", "settings")}
        </View>
      </View>

      {/* Mark All Read Button */}
      {!multiSelectMode && unreadCount > 0 && (
        <View style={styles.actionBar}>
          <Text style={styles.unreadText}>{unreadCount} unread</Text>
          <TouchableOpacity onPress={handleMarkAllRead}>
            <Text style={styles.markAllReadText}>Mark all as read</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationCard
            notification={item}
            onPress={() => handleNotificationPress(item)}
            onRefresh={loadNotifications}
            isSelected={selectedNotifications.has(item.id)}
            onToggleSelect={
              multiSelectMode
                ? toggleNotificationSelect
                : () => setMultiSelectMode(true)
            }
            isMultiSelectMode={multiSelectMode}
          />
        )}
        contentContainerStyle={
          filteredNotifications.length === 0 && styles.emptyList
        }
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#6366F1"]}
            tintColor="#6366F1"
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categories: {
    flexDirection: "row",
    paddingHorizontal: 12,
    gap: 8,
  },
  categoryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    borderWidth: 1,
    borderColor: "#E0E7FF",
  },
  categoryButtonActive: {
    backgroundColor: "#6366F1",
    borderColor: "#6366F1",
  },
  categoryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6366F1",
  },
  categoryTextActive: {
    color: "#fff",
  },
  categoryCount: {
    backgroundColor: "#fff",
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  categoryCountActive: {
    backgroundColor: "#818CF8",
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366F1",
  },
  categoryCountTextActive: {
    color: "#fff",
  },
  actionBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FEF3C7",
    borderBottomWidth: 1,
    borderBottomColor: "#FDE68A",
  },
  unreadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
  },
  markAllReadText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
  },
  multiSelectToolbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#EEF2FF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6366F1",
  },
  selectedCountText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    flex: 1,
    textAlign: "center",
  },
  deleteMultiButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#EF4444",
    borderRadius: 8,
  },
  deleteMultiButtonDisabled: {
    opacity: 0.5,
  },
  deleteMultiButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
