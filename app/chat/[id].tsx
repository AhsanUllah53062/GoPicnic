// app/chat/[id].tsx
import MessageBubble from "@/components/inbox/MessageBubble";
import TripInfoBar from "@/components/inbox/TripInfoBar";
import {
  markMessagesAsRead,
  sendMessage,
  subscribeToMessages,
  updateTypingIndicator,
} from "@/services/messages";
import { useUser } from "@/src/context/UserContext";
import { Message } from "@/types/inbox-types";
import { MaterialIcons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ChatScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showTripInfo, setShowTripInfo] = useState(true);

  const flatListRef = useRef<FlatList>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!id || !user) return;

    setLoading(true);

    // Subscribe to real-time messages
    const unsubscribe = subscribeToMessages(id, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);

      // Mark messages as read
      markMessagesAsRead(id, user.id);
    });

    return () => {
      unsubscribe();
      // Clear typing indicator on unmount
      if (user) {
        updateTypingIndicator(id, user.id, false);
      }
    };
  }, [id, user]);

  useEffect(() => {
    // Scroll to bottom when messages change
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || sending) return;

    const messageContent = inputText.trim();
    setInputText("");
    setSending(true);

    try {
      await sendMessage(id, user.id, user.name, messageContent, "text");

      // Clear typing indicator
      await updateTypingIndicator(id, user.id, false);

      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      console.error("Error sending message:", error);
      setInputText(messageContent); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);

    if (!user) return;

    // Update typing indicator
    updateTypingIndicator(id, user.id, text.length > 0);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to clear typing indicator
    typingTimeoutRef.current = setTimeout(() => {
      updateTypingIndicator(id, user.id, false);
    }, 3000);
  };

  const handleImagePick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0] && user) {
        // TODO: Upload image to Firebase Storage
        // const imageUrl = await uploadImage(result.assets[0].uri);

        setSending(true);
        await sendMessage(
          id,
          user.id,
          user.name,
          "Sent an image",
          "image",
          result.assets[0].uri, // Temporary - replace with uploaded URL
        );
        setSending(false);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleDocumentPick = async () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const result = await DocumentPicker.getDocumentAsync({
        type: "*/*",
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0] && user) {
        // TODO: Upload document to Firebase Storage
        // const documentUrl = await uploadDocument(result.assets[0].uri);

        setSending(true);
        await sendMessage(
          id,
          user.id,
          user.name,
          "Sent a document",
          "document",
          result.assets[0].uri, // Temporary - replace with uploaded URL
          result.assets[0].name,
        );
        setSending(false);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()}>
        <MaterialIcons name="arrow-back" size={24} color="#111827" />
      </TouchableOpacity>
      <View style={styles.headerInfo}>
        <Text style={styles.headerTitle}>Chat</Text>
        <Text style={styles.headerSubtitle}>{messages.length} messages</Text>
      </View>
      <TouchableOpacity>
        <MaterialIcons name="more-vert" size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading messages...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {renderHeader()}

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* Trip Info Bar (collapsible) */}
        {showTripInfo && (
          <TripInfoBar
            tripId="trip-123"
            tripName="Weekend Getaway to Murree"
            onClose={() => setShowTripInfo(false)}
          />
        )}

        {/* Messages List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <MessageBubble
              message={item}
              isOwnMessage={item.senderId === user?.id}
            />
          )}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        {/* Input Bar */}
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleImagePick}
          >
            <MaterialIcons name="image" size={24} color="#6366F1" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.attachButton}
            onPress={handleDocumentPick}
          >
            <MaterialIcons name="attach-file" size={24} color="#6366F1" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor="#9CA3AF"
            value={inputText}
            onChangeText={handleInputChange}
            multiline
            maxLength={1000}
          />

          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || sending) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <MaterialIcons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    gap: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  content: {
    flex: 1,
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
  messagesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    flex: 1,
    maxHeight: 100,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    fontSize: 15,
    color: "#111827",
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  sendButtonDisabled: {
    backgroundColor: "#D1D5DB",
  },
});
