// components/inbox/ConversationCard.tsx
import { MaterialIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Conversation } from "@/types/inbox-types";
import { archiveConversation, muteConversation } from "@/services/messages";

type Props = {
  conversation: Conversation;
  currentUserId: string;
  onPress: () => void;
  onRefresh: () => void;
};

export default function ConversationCard({
  conversation,
  currentUserId,
  onPress,
  onRefresh,
}: Props) {
  // Get the other participant's name (for 1-on-1 chats)
  const otherParticipantName =
    conversation.participantNames.find(
      (name, index) => conversation.participantIds[index] !== currentUserId,
    ) || conversation.participantNames[0];

  // Get avatar
  const otherParticipantId = conversation.participantIds.find(
    (id) => id !== currentUserId,
  );
  const avatar = otherParticipantId
    ? conversation.participantAvatars[otherParticipantId]
    : undefined;

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60));
      return `${minutes}m`;
    } else if (hours < 24) {
      return `${Math.floor(hours)}h`;
    } else if (hours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  const handleMute = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      await muteConversation(conversation.id, !conversation.muted);
      
      Alert.alert(
        conversation.muted ? "Unmuted" : "Muted",
        conversation.muted
          ? "You will now receive notifications"
          : "You won't receive notifications from this chat",
      );
      
      onRefresh();
    } catch (error) {
      Alert.alert("Error", "Failed to update notification settings");
    }
  };

  const handleArchive = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      Alert.alert(
        "Archive Conversation",
        "This conversation will be moved to archived chats",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Archive",
            style: "destructive",
            onPress: async () => {
              await archiveConversation(conversation.id, true);
              onRefresh();
            },
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to archive conversation");
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      onLongPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        Alert.alert("Actions", "Choose an option", [
          {
            text: conversation.muted ? "Unmute" : "Mute",
            onPress: handleMute,
          },
          { text: "Archive", onPress: handleArchive },
          { text: "Cancel", style: "cancel" },
        ]);
      }}
      activeOpacity={0.7}
    >
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        {avatar ? (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherParticipantName.charAt(0).toUpperCase()}
            </Text>
          </View>
        ) : (
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {otherParticipantName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {conversation.unreadCount > 0 && (
          <View style={styles.unreadDot} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {otherParticipantName}
            </Text>
            {conversation.tripName && (
              <View style={styles.tripBadge}>
                <MaterialIcons name="directions-car" size={12} color="#6366F1" />
                <Text style={styles.tripBadgeText} numberOfLines={1}>
                  {conversation.tripName}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.timestamp}>
            {formatTimestamp(conversation.lastMessageTime)}
          </Text>
        </View>

        <View style={styles.messageContainer}>
          {conversation.typing && conversation.typing.length > 0 ? (
            <View style={styles.typingContainer}>
              <View style={styles.typingDot} />
              <View style={[styles.typingDot, styles.typingDot2]} />
              <View style={[styles.typingDot, styles.typingDot3]} />
              <Text style={styles.typingText}>typing...</Text>
            </View>
          ) : (
            <>
              <Text style={styles.lastMessage} numberOfLines={1}>
                {conversation.lastMessage}
              </Text>
              {conversation.muted && (
                <MaterialIcons
                  name="volume-off"
                  size={16}
                  color="#9CA3AF"
                  style={{ marginLeft: 8 }}
                />
              )}
            </>
          )}
        </View>
      </View>

      {/* Unread Badge */}
      {conversation.unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>
            {conversation.unreadCount > 99 ? "99+" : conversation.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  avatarContainer: {
    position: "relative",
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  unreadDot: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#EF4444",
    borderWidth: 2,
    borderColor: "#fff",
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  nameContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    maxWidth: "60%",
  },
  tripBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    maxWidth: "40%",
  },
  tripBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#6366F1",
  },
  timestamp: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  lastMessage: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
  },
  typingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#6366F1",
  },
  typingDot2: {
    opacity: 0.7,
  },
  typingDot3: {
    opacity: 0.4,
  },
  typingText: {
    fontSize: 14,
    color: "#6366F1",
    fontStyle: "italic",
    marginLeft: 4,
  },
  unreadBadge: {
    backgroundColor: "#6366F1",
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontWeight: "700",
    color: "#fff",
  },
});
