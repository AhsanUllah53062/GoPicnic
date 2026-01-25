import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "./firebase";

export type Trip = {
  id?: string;
  userId: string;
  fromLocation: string;
  toLocation: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  currency: string;
  placeId?: string;
  placeName?: string;
  placeImage?: string;
  status: "planning" | "active" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateTripData = Omit<Trip, "id" | "createdAt" | "updatedAt">;

/**
 * Create a new trip in Firestore
 */
export const createTrip = async (tripData: CreateTripData): Promise<string> => {
  try {
    console.log("🚀 Creating trip with data:", tripData);

    const tripsRef = collection(db, "trips");

    // Remove undefined fields to prevent Firestore errors
    const cleanedData: any = {
      userId: tripData.userId,
      fromLocation: tripData.fromLocation,
      toLocation: tripData.toLocation,
      startDate: Timestamp.fromDate(tripData.startDate),
      endDate: Timestamp.fromDate(tripData.endDate),
      budget: tripData.budget,
      currency: tripData.currency,
      status: tripData.status,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    // Only add optional fields if they have values
    if (tripData.placeId) {
      cleanedData.placeId = tripData.placeId;
    }
    if (tripData.placeName) {
      cleanedData.placeName = tripData.placeName;
    }
    if (tripData.placeImage) {
      cleanedData.placeImage = tripData.placeImage;
    }

    console.log("📝 Cleaned data for Firestore:", cleanedData);

    const docRef = await addDoc(tripsRef, cleanedData);

    console.log("✅ Trip created successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating trip:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);

    if (error.code === "permission-denied") {
      throw new Error(
        "Permission denied. Please check Firestore security rules.",
      );
    } else if (error.code === "unauthenticated") {
      throw new Error("You must be logged in to create a trip.");
    } else {
      throw new Error(`Failed to create trip: ${error.message}`);
    }
  }
};

/**
 * Get a single trip by ID
 */
export const getTrip = async (tripId: string): Promise<Trip | null> => {
  try {
    console.log("🔍 Fetching trip with ID:", tripId);

    const tripRef = doc(db, "trips", tripId);
    const tripSnap = await getDoc(tripRef);

    if (tripSnap.exists()) {
      const data = tripSnap.data();
      console.log("✅ Trip found:", data);

      return {
        id: tripSnap.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Trip;
    }

    console.log("⚠️ Trip not found with ID:", tripId);
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching trip:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw new Error(`Failed to fetch trip: ${error.message}`);
  }
};

/**
 * Get all trips for a specific user
 */
export const getUserTrips = async (userId: string): Promise<Trip[]> => {
  try {
    console.log("🔍 Fetching trips for user:", userId);

    const tripsRef = collection(db, "trips");
    const q = query(tripsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const trips: Trip[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      trips.push({
        id: doc.id,
        ...data,
        startDate: data.startDate?.toDate(),
        endDate: data.endDate?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Trip);
    });

    console.log(`✅ Found ${trips.length} trips for user ${userId}`);
    return trips;
  } catch (error: any) {
    console.error("❌ Error fetching user trips:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw new Error(`Failed to fetch trips: ${error.message}`);
  }
};

/**
 * Update an existing trip
 */
export const updateTrip = async (
  tripId: string,
  updates: Partial<Trip>,
): Promise<void> => {
  try {
    console.log("📝 Updating trip:", tripId, "with data:", updates);

    const tripRef = doc(db, "trips", tripId);

    const updateData: any = {};

    // Only add defined fields
    Object.keys(updates).forEach((key) => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        updateData[key] = value;
      }
    });

    // Convert Date objects to Timestamps
    if (updates.startDate) {
      updateData.startDate = Timestamp.fromDate(updates.startDate);
    }
    if (updates.endDate) {
      updateData.endDate = Timestamp.fromDate(updates.endDate);
    }

    updateData.updatedAt = serverTimestamp();

    await updateDoc(tripRef, updateData);
    console.log("✅ Trip updated successfully");
  } catch (error: any) {
    console.error("❌ Error updating trip:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw new Error(`Failed to update trip: ${error.message}`);
  }
};

/**
 * Delete a trip (marks as completed)
 */
export const deleteTrip = async (tripId: string): Promise<void> => {
  try {
    console.log("🗑️ Deleting trip:", tripId);

    const tripRef = doc(db, "trips", tripId);
    await updateDoc(tripRef, {
      status: "completed",
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Trip marked as completed");
  } catch (error: any) {
    console.error("❌ Error deleting trip:", error);
    console.error("❌ Error code:", error.code);
    console.error("❌ Error message:", error.message);
    throw new Error(`Failed to delete trip: ${error.message}`);
  }
};
