// types/inbox.ts

export type MessageType = "text" | "image" | "document";

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  type: MessageType;
  attachmentUrl?: string;
  attachmentName?: string;
  timestamp: Date;
  read: boolean;
  readBy: string[];
};

export type Conversation = {
  id: string;
  participantIds: string[];
  participantNames: string[];
  participantAvatars: { [userId: string]: string };
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  muted: boolean;
  archived: boolean;
  typing?: string[]; // Array of user IDs currently typing

  // Trip/Carpool context (optional)
  tripId?: string;
  tripName?: string;
  carpoolId?: string;
};

export type NotificationType = "trip" | "shopping" | "system" | "carpool";

export type Notification = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any; // Additional context data
  read: boolean;
  actionUrl?: string; // Deep link to navigate to
  timestamp: Date;
  expanded?: boolean; // For UI state
  status?: "pending" | "approved" | "rejected"; // For request notifications
};

export type TypingIndicator = {
  conversationId: string;
  userId: string;
  userName: string;
  timestamp: Date;
};
