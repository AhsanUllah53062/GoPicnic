// services/messages.ts
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
  Timestamp,
} from "firebase/firestore";
import { Conversation, Message } from "@/types/inbox-types";
import { db } from "./firebase";

/**
 * Get all conversations for a user
 */
export const getUserConversations = async (
  userId: string,
): Promise<Conversation[]> => {
  try {
    console.log(`🔍 Fetching conversations for user ${userId}`);

    const conversationsRef = collection(db, "conversations");
    const q = query(
      conversationsRef,
      where("participantIds", "array-contains", userId),
      orderBy("lastMessageTime", "desc"),
    );

    const snapshot = await getDocs(q);

    const conversations: Conversation[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      conversations.push({
        id: doc.id,
        participantIds: data.participantIds || [],
        participantNames: data.participantNames || [],
        participantAvatars: data.participantAvatars || {},
        lastMessage: data.lastMessage || "",
        lastMessageTime: data.lastMessageTime?.toDate() || new Date(),
        unreadCount: data.unreadCount?.[userId] || 0,
        muted: data.mutedBy?.includes(userId) || false,
        archived: data.archivedBy?.includes(userId) || false,
        typing: data.typing || [],
        tripId: data.tripId,
        tripName: data.tripName,
        carpoolId: data.carpoolId,
      });
    });

    console.log(`✅ Found ${conversations.length} conversations`);
    return conversations;
  } catch (error: any) {
    console.error("❌ Error fetching conversations:", error);
    throw new Error(`Failed to fetch conversations: ${error.message}`);
  }
};

/**
 * Get messages for a conversation
 */
export const getConversationMessages = async (
  conversationId: string,
  limitCount: number = 50,
): Promise<Message[]> => {
  try {
    console.log(`🔍 Fetching messages for conversation ${conversationId}`);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages",
    );
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(limitCount));

    const snapshot = await getDocs(q);

    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        content: data.content,
        type: data.type,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        timestamp: data.timestamp?.toDate() || new Date(),
        read: data.read || false,
        readBy: data.readBy || [],
      });
    });

    console.log(`✅ Found ${messages.length} messages`);
    return messages.reverse(); // Return in chronological order
  } catch (error: any) {
    console.error("❌ Error fetching messages:", error);
    throw new Error(`Failed to fetch messages: ${error.message}`);
  }
};

/**
 * Subscribe to real-time messages
 */
export const subscribeToMessages = (
  conversationId: string,
  onUpdate: (messages: Message[]) => void,
) => {
  const messagesRef = collection(
    db,
    "conversations",
    conversationId,
    "messages",
  );
  const q = query(messagesRef, orderBy("timestamp", "asc"));

  return onSnapshot(q, (snapshot) => {
    const messages: Message[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        conversationId,
        senderId: data.senderId,
        senderName: data.senderName,
        senderAvatar: data.senderAvatar,
        content: data.content,
        type: data.type,
        attachmentUrl: data.attachmentUrl,
        attachmentName: data.attachmentName,
        timestamp: data.timestamp?.toDate() || new Date(),
        read: data.read || false,
        readBy: data.readBy || [],
      });
    });
    onUpdate(messages);
  });
};

/**
 * Send a message
 */
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderName: string,
  content: string,
  type: "text" | "image" | "document" = "text",
  attachmentUrl?: string,
  attachmentName?: string,
): Promise<string> => {
  try {
    console.log(`📤 Sending message to conversation ${conversationId}`);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages",
    );

    const messageData = {
      senderId,
      senderName,
      content,
      type,
      attachmentUrl: attachmentUrl || null,
      attachmentName: attachmentName || null,
      timestamp: serverTimestamp(),
      read: false,
      readBy: [senderId], // Sender has read their own message
    };

    const docRef = await addDoc(messagesRef, messageData);

    // Update conversation's last message
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      lastMessage: type === "text" ? content : `Sent a ${type}`,
      lastMessageTime: serverTimestamp(),
    });

    console.log("✅ Message sent with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error sending message:", error);
    throw new Error(`Failed to send message: ${error.message}`);
  }
};

/**
 * Mark messages as read
 */
export const markMessagesAsRead = async (
  conversationId: string,
  userId: string,
): Promise<void> => {
  try {
    console.log(`✅ Marking messages as read in conversation ${conversationId}`);

    const messagesRef = collection(
      db,
      "conversations",
      conversationId,
      "messages",
    );
    const q = query(messagesRef, where("read", "==", false));

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((messageDoc) => {
      const data = messageDoc.data();
      if (data.senderId !== userId) {
        batch.update(messageDoc.ref, {
          read: true,
          readBy: arrayUnion(userId),
        });
      }
    });

    // Reset unread count for this user
    const conversationRef = doc(db, "conversations", conversationId);
    batch.update(conversationRef, {
      [`unreadCount.${userId}`]: 0,
    });

    await batch.commit();
    console.log("✅ Messages marked as read");
  } catch (error: any) {
    console.error("❌ Error marking messages as read:", error);
    throw new Error(`Failed to mark messages as read: ${error.message}`);
  }
};

/**
 * Update typing indicator
 */
export const updateTypingIndicator = async (
  conversationId: string,
  userId: string,
  isTyping: boolean,
): Promise<void> => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    const conversationDoc = await getDoc(conversationRef);

    if (!conversationDoc.exists()) return;

    const currentTyping = conversationDoc.data().typing || [];

    let newTyping: string[];
    if (isTyping) {
      newTyping = currentTyping.includes(userId)
        ? currentTyping
        : [...currentTyping, userId];
    } else {
      newTyping = currentTyping.filter((id: string) => id !== userId);
    }

    await updateDoc(conversationRef, {
      typing: newTyping,
    });
  } catch (error) {
    console.error("Error updating typing indicator:", error);
  }
};

/**
 * Mute/unmute conversation
 */
export const muteConversation = async (
  conversationId: string,
  mute: boolean,
): Promise<void> => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    // Implementation depends on your data structure
    await updateDoc(conversationRef, {
      muted: mute,
    });
  } catch (error: any) {
    console.error("❌ Error muting conversation:", error);
    throw new Error(`Failed to mute conversation: ${error.message}`);
  }
};

/**
 * Archive/unarchive conversation
 */
export const archiveConversation = async (
  conversationId: string,
  archive: boolean,
): Promise<void> => {
  try {
    const conversationRef = doc(db, "conversations", conversationId);
    await updateDoc(conversationRef, {
      archived: archive,
    });
  } catch (error: any) {
    console.error("❌ Error archiving conversation:", error);
    throw new Error(`Failed to archive conversation: ${error.message}`);
  }
};

/**
 * Search conversations
 */
export const searchConversations = (
  conversations: Conversation[],
  query: string,
): Conversation[] => {
  const lowerQuery = query.toLowerCase();
  return conversations.filter(
    (c) =>
      c.participantNames.some((name) =>
        name.toLowerCase().includes(lowerQuery),
      ) ||
      c.lastMessage.toLowerCase().includes(lowerQuery) ||
      c.tripName?.toLowerCase().includes(lowerQuery),
  );
};

/**
 * Create a new conversation
 */
export const createConversation = async (
  participantIds: string[],
  participantNames: string[],
  participantAvatars: { [userId: string]: string },
  tripId?: string,
  tripName?: string,
  carpoolId?: string,
): Promise<string> => {
  try {
    console.log("🆕 Creating new conversation");

    const conversationsRef = collection(db, "conversations");

    const conversationData = {
      participantIds,
      participantNames,
      participantAvatars,
      lastMessage: "",
      lastMessageTime: serverTimestamp(),
      unreadCount: {},
      mutedBy: [],
      archivedBy: [],
      typing: [],
      tripId: tripId || null,
      tripName: tripName || null,
      carpoolId: carpoolId || null,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(conversationsRef, conversationData);

    console.log("✅ Conversation created with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating conversation:", error);
    throw new Error(`Failed to create conversation: ${error.message}`);
  }
};
