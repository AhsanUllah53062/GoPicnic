// services/carpoolDiscovery.ts
import {
  collection,
  collectionGroup,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { Carpool } from "./carpool";
import { db } from "./firebase";

/**
 * Get all available carpools across all trips
 * This uses Firestore's collectionGroup query to fetch from all "carpools" subcollections
 */
export const getAllAvailableCarpools = async (): Promise<Carpool[]> => {
  try {
    console.log("🔍 Fetching all available carpools...");

    // Query all "carpools" subcollections across all trips
    const carpoolsQuery = query(
      collectionGroup(db, "carpools"),
      where("status", "==", "active"),
      orderBy("departureDate", "asc"),
    );

    const snapshot = await getDocs(carpoolsQuery);

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

    console.log(`✅ Found ${carpools.length} available carpools`);
    return carpools;
  } catch (error: any) {
    console.error("❌ Error fetching available carpools:", error);
    throw new Error(`Failed to fetch available carpools: ${error.message}`);
  }
};

/**
 * Get carpools filtered by location
 */
export const getCarpoolsByLocation = async (
  location: string,
): Promise<Carpool[]> => {
  try {
    console.log(`🔍 Fetching carpools for location: ${location}`);

    const carpoolsQuery = query(
      collectionGroup(db, "carpools"),
      where("status", "==", "active"),
      where("meetingPoint", "==", location),
      orderBy("departureDate", "asc"),
    );

    const snapshot = await getDocs(carpoolsQuery);

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

    console.log(`✅ Found ${carpools.length} carpools for ${location}`);
    return carpools;
  } catch (error: any) {
    console.error("❌ Error fetching carpools by location:", error);
    throw new Error(`Failed to fetch carpools by location: ${error.message}`);
  }
};

/**
 * Get carpools within a price range
 */
export const getCarpoolsByPriceRange = async (
  minPrice: number,
  maxPrice: number,
): Promise<Carpool[]> => {
  try {
    console.log(`🔍 Fetching carpools between ${minPrice} and ${maxPrice}`);

    const carpoolsQuery = query(
      collectionGroup(db, "carpools"),
      where("status", "==", "active"),
      where("chargePerPerson", ">=", minPrice),
      where("chargePerPerson", "<=", maxPrice),
      orderBy("chargePerPerson", "asc"),
    );

    const snapshot = await getDocs(carpoolsQuery);

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

    console.log(`✅ Found ${carpools.length} carpools in price range`);
    return carpools;
  } catch (error: any) {
    console.error("❌ Error fetching carpools by price:", error);
    throw new Error(`Failed to fetch carpools by price: ${error.message}`);
  }
};
