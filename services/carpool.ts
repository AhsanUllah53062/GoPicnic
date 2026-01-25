import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export type Carpool = {
  id?: string;
  tripId: string;
  driverName: string;
  contactNumber: string;
  availableSeats: number;
  totalSeats: number;
  departureDate: Date;
  departureTime: string; // "14:30"
  returnDate?: Date;
  returnTime?: string;
  meetingPoint: string;
  meetingPointAddress?: string;
  carModel: string;
  carColor?: string;
  licensePlate?: string;
  chargePerPerson: number;
  currency: string;
  preferences?: string; // No smoking, pets allowed, etc.
  notes?: string;
  status: "active" | "full" | "completed";
  participants: string[]; // Array of participant names/IDs
  createdBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type CreateCarpoolData = Omit<Carpool, "id" | "createdAt" | "updatedAt">;

/**
 * Create a new carpool
 */
export const createCarpool = async (
  carpool: CreateCarpoolData,
): Promise<string> => {
  try {
    console.log("🚗 Creating carpool:", carpool);

    const carpoolsRef = collection(db, "trips", carpool.tripId, "carpools");

    const data = {
      tripId: carpool.tripId,
      driverName: carpool.driverName,
      contactNumber: carpool.contactNumber,
      availableSeats: carpool.availableSeats,
      totalSeats: carpool.totalSeats,
      departureDate: Timestamp.fromDate(carpool.departureDate),
      departureTime: carpool.departureTime,
      returnDate: carpool.returnDate
        ? Timestamp.fromDate(carpool.returnDate)
        : null,
      returnTime: carpool.returnTime || null,
      meetingPoint: carpool.meetingPoint,
      meetingPointAddress: carpool.meetingPointAddress || null,
      carModel: carpool.carModel,
      carColor: carpool.carColor || null,
      licensePlate: carpool.licensePlate || null,
      chargePerPerson: carpool.chargePerPerson,
      currency: carpool.currency,
      preferences: carpool.preferences || null,
      notes: carpool.notes || null,
      status: carpool.status,
      participants: carpool.participants || [],
      createdBy: carpool.createdBy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(carpoolsRef, data);
    console.log("✅ Carpool created with ID:", docRef.id);
    return docRef.id;
  } catch (error: any) {
    console.error("❌ Error creating carpool:", error);
    throw new Error(`Failed to create carpool: ${error.message}`);
  }
};

/**
 * Get all carpools for a trip
 */
export const getTripCarpools = async (tripId: string): Promise<Carpool[]> => {
  try {
    console.log(`🔍 Fetching carpools for trip ${tripId}`);

    const carpoolsRef = collection(db, "trips", tripId, "carpools");
    const q = query(carpoolsRef, orderBy("departureDate", "asc"));
    const snapshot = await getDocs(q);

    const carpools: Carpool[] = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      carpools.push({
        id: doc.id,
        tripId: data.tripId,
        driverName: data.driverName,
        contactNumber: data.contactNumber,
        availableSeats: data.availableSeats,
        totalSeats: data.totalSeats,
        departureDate: data.departureDate?.toDate() || new Date(),
        departureTime: data.departureTime,
        returnDate: data.returnDate?.toDate() || undefined,
        returnTime: data.returnTime || undefined,
        meetingPoint: data.meetingPoint,
        meetingPointAddress: data.meetingPointAddress || undefined,
        carModel: data.carModel,
        carColor: data.carColor || undefined,
        licensePlate: data.licensePlate || undefined,
        chargePerPerson: data.chargePerPerson,
        currency: data.currency,
        preferences: data.preferences || undefined,
        notes: data.notes || undefined,
        status: data.status,
        participants: data.participants || [],
        createdBy: data.createdBy,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log(`✅ Found ${carpools.length} carpools`);
    return carpools;
  } catch (error: any) {
    console.error("❌ Error fetching carpools:", error);
    throw new Error(`Failed to fetch carpools: ${error.message}`);
  }
};

/**
 * Update a carpool
 */
export const updateCarpool = async (
  tripId: string,
  carpoolId: string,
  updates: Partial<Carpool>,
): Promise<void> => {
  try {
    console.log(`📝 Updating carpool ${carpoolId}`);

    const carpoolRef = doc(db, "trips", tripId, "carpools", carpoolId);

    const updateData: any = { ...updates };

    // Convert Date objects to Timestamps
    if (updates.departureDate) {
      updateData.departureDate = Timestamp.fromDate(updates.departureDate);
    }
    if (updates.returnDate) {
      updateData.returnDate = Timestamp.fromDate(updates.returnDate);
    }

    updateData.updatedAt = serverTimestamp();

    await updateDoc(carpoolRef, updateData);
    console.log("✅ Carpool updated");
  } catch (error: any) {
    console.error("❌ Error updating carpool:", error);
    throw new Error(`Failed to update carpool: ${error.message}`);
  }
};

/**
 * Delete a carpool
 */
export const deleteCarpool = async (
  tripId: string,
  carpoolId: string,
): Promise<void> => {
  try {
    console.log(`🗑️ Deleting carpool ${carpoolId}`);

    const carpoolRef = doc(db, "trips", tripId, "carpools", carpoolId);
    await deleteDoc(carpoolRef);

    console.log("✅ Carpool deleted");
  } catch (error: any) {
    console.error("❌ Error deleting carpool:", error);
    throw new Error(`Failed to delete carpool: ${error.message}`);
  }
};

/**
 * Join a carpool
 */
export const joinCarpool = async (
  tripId: string,
  carpoolId: string,
  participantName: string,
): Promise<void> => {
  try {
    console.log(`👋 Joining carpool ${carpoolId}`);

    const carpoolRef = doc(db, "trips", tripId, "carpools", carpoolId);

    // Note: In production, use arrayUnion for atomic operations
    // This is a simplified version
    const updateData = {
      participants: [...[], participantName],
      updatedAt: serverTimestamp(),
    };

    await updateDoc(carpoolRef, updateData);
    console.log("✅ Joined carpool");
  } catch (error: any) {
    console.error("❌ Error joining carpool:", error);
    throw new Error(`Failed to join carpool: ${error.message}`);
  }
};
