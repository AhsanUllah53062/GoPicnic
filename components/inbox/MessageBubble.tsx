// components/inbox/MessageBubble.tsx
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Message } from "@/types/inbox-types";

type Props = {
  message: Message;
  isOwnMessage: boolean;
};

export default function MessageBubble({ message, isOwnMessage }: Props) {
  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const handleAttachmentPress = () => {
    if (message.attachmentUrl) {
      Linking.openURL(message.attachmentUrl);
    }
  };

  const renderContent = () => {
    switch (message.type) {
      case "image":
        return (
          <TouchableOpacity onPress={handleAttachmentPress}>
            <Image
              source={{ uri: message.attachmentUrl }}
              style={styles.image}
              resizeMode="cover"
            />
            {message.content !== "Sent an image" && (
              <Text style={[styles.text, isOwnMessage && styles.textOwn]}>
                {message.content}
              </Text>
            )}
          </TouchableOpacity>
        );

      case "document":
        return (
          <TouchableOpacity
            style={styles.documentContainer}
            onPress={handleAttachmentPress}
          >
            <MaterialIcons
              name="insert-drive-file"
              size={32}
              color={isOwnMessage ? "#fff" : "#6366F1"}
            />
            <View style={styles.documentInfo}>
              <Text
                style={[
                  styles.documentName,
                  isOwnMessage && styles.documentNameOwn,
                ]}
                numberOfLines={1}
              >
                {message.attachmentName || "Document"}
              </Text>
              <Text
                style={[
                  styles.documentAction,
                  isOwnMessage && styles.documentActionOwn,
                ]}
              >
                Tap to view
              </Text>
            </View>
          </TouchableOpacity>
        );

      default:
        return (
          <Text style={[styles.text, isOwnMessage && styles.textOwn]}>
            {message.content}
          </Text>
        );
    }
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.containerOwn : styles.containerOther,
      ]}
    >
      {!isOwnMessage && (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {message.senderName?.charAt(0).toUpperCase() || "?"}
          </Text>
        </View>
      )}

      <View
        style={[
          styles.bubble,
          isOwnMessage ? styles.bubbleOwn : styles.bubbleOther,
        ]}
      >
        {!isOwnMessage && (
          <Text style={styles.senderName}>{message.senderName}</Text>
        )}

        {renderContent()}

        <View style={styles.footer}>
          <Text
            style={[
              styles.timestamp,
              isOwnMessage && styles.timestampOwn,
            ]}
          >
            {formatTimestamp(message.timestamp)}
          </Text>

          {isOwnMessage && (
            <MaterialIcons
              name={message.read ? "done-all" : "done"}
              size={14}
              color={message.read ? "#10B981" : "#fff"}
              style={{ opacity: 0.8 }}
            />
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 8,
  },
  containerOwn: {
    justifyContent: "flex-end",
  },
  containerOther: {
    justifyContent: "flex-start",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
  },
  bubble: {
    maxWidth: "75%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleOwn: {
    backgroundColor: "#6366F1",
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  senderName: {
    fontSize: 12,
    fontWeight: "600",
    color: "#6366F1",
    marginBottom: 4,
  },
  text: {
    fontSize: 15,
    color: "#111827",
    lineHeight: 20,
  },
  textOwn: {
    color: "#fff",
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 12,
    marginBottom: 4,
  },
  documentContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 4,
  },
  documentInfo: {
    flex: 1,
  },
  documentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 2,
  },
  documentNameOwn: {
    color: "#fff",
  },
  documentAction: {
    fontSize: 12,
    color: "#6B7280",
  },
  documentActionOwn: {
    color: "#E0E7FF",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 11,
    color: "#9CA3AF",
  },
  timestampOwn: {
    color: "#E0E7FF",
  },
});
