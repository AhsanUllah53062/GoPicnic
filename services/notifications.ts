// services/notifications.ts
import { Notification, NotificationType } from "@/types/inbox-types";
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Get all notifications for a user
 */
export const getUserNotifications = async (
  userId: string,
): Promise<Notification[]> => {
  try {
    console.log(`🔍 Fetching notifications for user ${userId}`);

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
    );

    const snapshot = await getDocs(q);

    const notifications: Notification[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      notifications.push({
        id: doc.id,
        userId: data.userId,
        type: data.type as NotificationType,
        title: data.title,
        body: data.body,
        data: data.data || undefined,
        read: data.read || false,
        actionUrl: data.actionUrl || undefined,
        timestamp: data.timestamp?.toDate() || new Date(),
        status: data.status as "pending" | "approved" | "rejected" | undefined,
      });
    });

    console.log(`✅ Found ${notifications.length} notifications`);
    return notifications;
  } catch (error: any) {
    console.error("❌ Error fetching notifications:", error);
    throw new Error(`Failed to fetch notifications: ${error.message}`);
  }
};

/**
 * Create a notification
 */
export const createNotification = async (
  userId: string,
  type: NotificationType,
  title: string,
  body: string,
  data?: any,
  actionUrl?: string,
): Promise<string> => {
  try {
    console.log(`📬 Creating notification for user ${userId}`);

    const notificationsRef = collection(db, "notifications");

    const notificationData = {
      userId,
      type,
      title,
      body,
      data: data || null,
      read: false,
      actionUrl: actionUrl || null,
      timestamp: serverTimestamp(),
      status: type === "carpool" ? "pending" : undefined, // Set status to pending for carpool notifications
    };

    const docRef = await addDoc(notificationsRef, notificationData);

    console.log("✅ Notification created with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating notification:", error);
    throw new Error(`Failed to create notification: ${error.message}`);
  }
};

/**
 * Mark a notification as read
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<void> => {
  try {
    console.log(`✅ Marking notification ${notificationId} as read`);

    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, {
      read: true,
    });

    console.log("✅ Notification marked as read");
  } catch (error: any) {
    console.error("❌ Error marking notification as read:", error);
    throw new Error(`Failed to mark notification as read: ${error.message}`);
  }
};

/**
 * Mark all notifications as read for a user
 */
export const markAllNotificationsAsRead = async (
  userId: string,
): Promise<void> => {
  try {
    console.log(`✅ Marking all notifications as read for user ${userId}`);

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", userId),
      where("read", "==", false),
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.forEach((notificationDoc) => {
      batch.update(notificationDoc.ref, {
        read: true,
      });
    });

    await batch.commit();
    console.log("✅ All notifications marked as read");
  } catch (error: any) {
    console.error("❌ Error marking all notifications as read:", error);
    throw new Error(
      `Failed to mark all notifications as read: ${error.message}`,
    );
  }
};

/**
 * Delete a notification
 */
export const deleteNotification = async (
  notificationId: string,
): Promise<void> => {
  try {
    console.log(`🗑️ Deleting notification ${notificationId}`);

    const notificationRef = doc(db, "notifications", notificationId);
    await deleteDoc(notificationRef);

    console.log("✅ Notification deleted");
  } catch (error: any) {
    console.error("❌ Error deleting notification:", error);
    throw new Error(`Failed to delete notification: ${error.message}`);
  }
};

/**
 * Update notification status (for carpool requests)
 */
export const updateNotificationStatus = async (
  notificationId: string,
  status: "pending" | "approved" | "rejected",
): Promise<void> => {
  try {
    console.log(
      `📝 Updating notification ${notificationId} status to ${status}`,
    );

    const notificationRef = doc(db, "notifications", notificationId);
    await updateDoc(notificationRef, { status });

    console.log("✅ Notification status updated");
  } catch (error: any) {
    console.error("❌ Error updating notification status:", error);
    throw new Error(`Failed to update notification status: ${error.message}`);
  }
};

/**
 * Helper functions to create specific notification types
 */

export const notifyTripApproved = async (
  userId: string,
  tripName: string,
  tripId: string,
): Promise<void> => {
  await createNotification(
    userId,
    "trip",
    "Trip Approved! 🎉",
    `Your trip "${tripName}" has been approved and is ready to go.`,
    { tripName, tripId },
    `/trip/${tripId}`,
  );
};

export const notifyCarpoolRequest = async (
  userId: string,
  requesterName: string,
  carpoolId: string,
  tripId: string,
): Promise<void> => {
  await createNotification(
    userId,
    "carpool",
    "New Carpool Request",
    `${requesterName} wants to join your carpool.`,
    { requesterName, carpoolId, tripId },
    `/trip/${tripId}`,
  );
};

export const notifyOrderShipped = async (
  userId: string,
  orderId: string,
  trackingNumber: string,
): Promise<void> => {
  await createNotification(
    userId,
    "shopping",
    "Order Shipped! 📦",
    `Your order has been shipped. Tracking: ${trackingNumber}`,
    { orderId, trackingNumber },
    `/shop/orders`,
  );
};

export const notifyPriceAlert = async (
  userId: string,
  productName: string,
  oldPrice: number,
  newPrice: number,
  productId: string,
): Promise<void> => {
  await createNotification(
    userId,
    "shopping",
    "Price Drop Alert! 💰",
    `${productName} is now ${newPrice} PKR (was ${oldPrice} PKR)`,
    { productName, oldPrice, newPrice, productId },
    `/shop/product/${productId}`,
  );
};

export const notifySystemUpdate = async (
  userId: string,
  title: string,
  body: string,
): Promise<void> => {
  await createNotification(userId, "system", title, body);
};
