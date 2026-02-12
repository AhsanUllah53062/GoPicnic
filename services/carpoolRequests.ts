// services/carpoolRequests.ts
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
} from "firebase/firestore";
import { db } from "./firebase";
import { createNotification } from "./notifications";

export type JoinRequestStatus = "pending" | "approved" | "rejected";

export type JoinRequest = {
  id?: string;
  carpoolId: string;
  tripId: string;
  requesterId: string;
  requesterName: string;
  requesterAvatar?: string;
  driverId: string;
  message?: string;
  status: JoinRequestStatus;
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Create a join request for a carpool
 */
export const createJoinRequest = async (
  request: Omit<JoinRequest, "id" | "createdAt" | "updatedAt">,
): Promise<string> => {
  try {
    console.log("📨 Creating join request:", request);

    const requestsRef = collection(db, "carpoolRequests");

    // Check if user already has a pending request for this carpool
    const existingQuery = query(
      requestsRef,
      where("carpoolId", "==", request.carpoolId),
      where("requesterId", "==", request.requesterId),
      where("status", "==", "pending"),
    );

    const existingSnapshot = await getDocs(existingQuery);

    if (!existingSnapshot.empty) {
      throw new Error("You already have a pending request for this carpool");
    }

    const data = {
      carpoolId: request.carpoolId,
      tripId: request.tripId,
      requesterId: request.requesterId,
      requesterName: request.requesterName,
      requesterAvatar: request.requesterAvatar || null,
      driverId: request.driverId,
      message: request.message || null,
      status: "pending" as JoinRequestStatus,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(requestsRef, data);

    console.log("✅ Join request created with ID:", docRef.id);

    // Create notification for driver
    try {
      await createNotification(
        request.driverId,
        "carpool",
        "New Carpool Request",
        `${request.requesterName} wants to join your carpool`,
        {
          carpoolId: request.carpoolId,
          requestId: docRef.id,
          requesterId: request.requesterId,
          requesterName: request.requesterName,
          isInitialRequest: true, // Flag to show approve/reject buttons
        },
        `/carpool-requests/${docRef.id}`,
      );
      console.log("✅ Notification created for driver");
    } catch (notificationError) {
      console.error(
        "⚠️ Warning: Notification creation failed:",
        notificationError,
      );
      // Don't throw - join request was still created successfully
    }

    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating join request:", error);
    throw new Error(error.message || "Failed to create join request");
  }
};

/**
 * Get all join requests for a carpool (for drivers)
 */
export const getCarpoolJoinRequests = async (
  carpoolId: string,
): Promise<JoinRequest[]> => {
  try {
    console.log(`🔍 Fetching join requests for carpool ${carpoolId}`);

    const requestsRef = collection(db, "carpoolRequests");
    const q = query(
      requestsRef,
      where("carpoolId", "==", carpoolId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const requests: JoinRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        carpoolId: data.carpoolId,
        tripId: data.tripId,
        requesterId: data.requesterId,
        requesterName: data.requesterName,
        requesterAvatar: data.requesterAvatar || undefined,
        driverId: data.driverId,
        message: data.message || undefined,
        status: data.status,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log(`✅ Found ${requests.length} join requests`);
    return requests;
  } catch (error: any) {
    console.error("❌ Error fetching join requests:", error);
    throw new Error(`Failed to fetch join requests: ${error.message}`);
  }
};

/**
 * Get all join requests sent by a user
 */
export const getUserJoinRequests = async (
  userId: string,
): Promise<JoinRequest[]> => {
  try {
    console.log(`🔍 Fetching join requests for user ${userId}`);

    const requestsRef = collection(db, "carpoolRequests");
    const q = query(
      requestsRef,
      where("requesterId", "==", userId),
      orderBy("createdAt", "desc"),
    );

    const snapshot = await getDocs(q);

    const requests: JoinRequest[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      requests.push({
        id: doc.id,
        carpoolId: data.carpoolId,
        tripId: data.tripId,
        requesterId: data.requesterId,
        requesterName: data.requesterName,
        requesterAvatar: data.requesterAvatar || undefined,
        driverId: data.driverId,
        message: data.message || undefined,
        status: data.status,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log(`✅ Found ${requests.length} join requests`);
    return requests;
  } catch (error: any) {
    console.error("❌ Error fetching user join requests:", error);
    throw new Error(`Failed to fetch user join requests: ${error.message}`);
  }
};

/**
 * Approve a join request
 */
export const approveJoinRequest = async (
  requestId: string,
  carpoolId: string,
  tripId: string,
): Promise<void> => {
  try {
    console.log(`✅ Approving join request ${requestId}`);

    // Get request details to notify requester
    const requestRef = doc(db, "carpoolRequests", requestId);
    const requestSnap = await getDocs(
      query(
        collection(db, "carpoolRequests"),
        where("__name__", "==", requestId),
      ),
    );

    let requesterName = "User";
    let requesterId = "";
    if (!requestSnap.empty) {
      const requestData = requestSnap.docs[0].data();
      requesterName = requestData.requesterName;
      requesterId = requestData.requesterId;
    }

    // Update request status
    await updateDoc(requestRef, {
      status: "approved",
      updatedAt: serverTimestamp(),
    });

    // Send notification to requester
    try {
      if (requesterId) {
        await createNotification(
          requesterId,
          "carpool",
          "Request Approved!",
          "Your carpool request has been approved",
          {
            carpoolId,
            requestId,
          },
          `/carpool/${carpoolId}`,
        );
        console.log("✅ Approval notification sent to requester");
      }
    } catch (notificationError) {
      console.error(
        "⚠️ Warning: Approval notification failed:",
        notificationError,
      );
    }

    // TODO: Add user to carpool participants
    // const carpoolRef = doc(db, "trips", tripId, "carpools", carpoolId);
    // await updateDoc(carpoolRef, {
    //   participants: arrayUnion(requesterId),
    //   availableSeats: increment(-1),
    //   updatedAt: serverTimestamp(),
    // });

    console.log("✅ Join request approved");
  } catch (error: any) {
    console.error("❌ Error approving join request:", error);
    throw new Error(`Failed to approve join request: ${error.message}`);
  }
};

/**
 * Reject a join request
 */
export const rejectJoinRequest = async (requestId: string): Promise<void> => {
  try {
    console.log(`❌ Rejecting join request ${requestId}`);

    // Get request details to notify requester
    const requestSnap = await getDocs(
      query(
        collection(db, "carpoolRequests"),
        where("__name__", "==", requestId),
      ),
    );

    let requesterName = "User";
    let requesterId = "";
    let carpoolId = "";
    if (!requestSnap.empty) {
      const requestData = requestSnap.docs[0].data();
      requesterName = requestData.requesterName;
      requesterId = requestData.requesterId;
      carpoolId = requestData.carpoolId;
    }

    const requestRef = doc(db, "carpoolRequests", requestId);
    await updateDoc(requestRef, {
      status: "rejected",
      updatedAt: serverTimestamp(),
    });

    // Send notification to requester
    try {
      if (requesterId) {
        await createNotification(
          requesterId,
          "carpool",
          "Request Declined",
          "Your carpool request was declined",
          {
            carpoolId,
            requestId,
          },
        );
        console.log("✅ Rejection notification sent to requester");
      }
    } catch (notificationError) {
      console.error(
        "⚠️ Warning: Rejection notification failed:",
        notificationError,
      );
    }

    console.log("✅ Join request rejected");
  } catch (error: any) {
    console.error("❌ Error rejecting join request:", error);
    throw new Error(`Failed to reject join request: ${error.message}`);
  }
};

/**
 * Cancel a join request (by requester)
 */
export const cancelJoinRequest = async (requestId: string): Promise<void> => {
  try {
    console.log(`🗑️ Canceling join request ${requestId}`);

    const requestRef = doc(db, "carpoolRequests", requestId);
    await deleteDoc(requestRef);

    console.log("✅ Join request canceled");
  } catch (error: any) {
    console.error("❌ Error canceling join request:", error);
    throw new Error(`Failed to cancel join request: ${error.message}`);
  }
};
