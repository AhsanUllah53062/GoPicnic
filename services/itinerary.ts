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

// Types
export type Todo = {
  id: string;
  text: string;
  done: boolean;
  createdAt: Date;
};

export type PlaceVisit = {
  id: string;
  placeId: string;
  placeName: string;
  placeAddress?: string;
  startTime?: string; // "14:30"
  endTime?: string; // "16:00"
  duration?: number; // minutes
  expense?: number;
  expenseCategory?: string;
  notes?: string;
  createdAt: Date;
};

export type DayPlan = {
  id?: string;
  tripId: string;
  dayIndex: number;
  date: Date;
  notes: string[];
  todos: Todo[];
  places: PlaceVisit[];
  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Get or create a day plan for a specific trip day
 */
export const getDayPlan = async (
  tripId: string,
  dayIndex: number,
): Promise<DayPlan | null> => {
  try {
    console.log(`🔍 Fetching day plan for trip ${tripId}, day ${dayIndex}`);

    const dayPlansRef = collection(db, "trips", tripId, "dayPlans");
    const q = query(dayPlansRef, orderBy("dayIndex"));
    const snapshot = await getDocs(q);

    let dayPlan: DayPlan | null = null;

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.dayIndex === dayIndex) {
        dayPlan = {
          id: doc.id,
          tripId,
          dayIndex: data.dayIndex,
          date: data.date?.toDate() || new Date(),
          notes: data.notes || [],
          todos: (data.todos || []).map((t: any) => ({
            ...t,
            createdAt: t.createdAt?.toDate() || new Date(),
          })),
          places: (data.places || []).map((p: any) => ({
            ...p,
            createdAt: p.createdAt?.toDate() || new Date(),
          })),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        };
      }
    });

    if (dayPlan) {
      console.log(`✅ Day plan found for day ${dayIndex}`);
    } else {
      console.log(`⚠️ No day plan found for day ${dayIndex}`);
    }

    return dayPlan;
  } catch (error: any) {
    console.error("❌ Error fetching day plan:", error);
    throw new Error(`Failed to fetch day plan: ${error.message}`);
  }
};

/**
 * Create or update a day plan
 */
export const saveDayPlan = async (dayPlan: DayPlan): Promise<string> => {
  try {
    console.log(
      `💾 Saving day plan for trip ${dayPlan.tripId}, day ${dayPlan.dayIndex}`,
    );

    const dayPlansRef = collection(db, "trips", dayPlan.tripId, "dayPlans");

    const data = {
      tripId: dayPlan.tripId,
      dayIndex: dayPlan.dayIndex,
      date: Timestamp.fromDate(dayPlan.date),
      notes: dayPlan.notes,
      todos: dayPlan.todos.map((t) => ({
        id: t.id,
        text: t.text,
        done: t.done,
        createdAt: Timestamp.fromDate(t.createdAt),
      })),
      places: dayPlan.places.map((p) => ({
        id: p.id,
        placeId: p.placeId,
        placeName: p.placeName,
        placeAddress: p.placeAddress || null,
        startTime: p.startTime || null,
        endTime: p.endTime || null,
        duration: p.duration || null,
        expense: p.expense || null,
        expenseCategory: p.expenseCategory || null,
        notes: p.notes || null,
        createdAt: Timestamp.fromDate(p.createdAt),
      })),
      updatedAt: serverTimestamp(),
    };

    if (dayPlan.id) {
      // Update existing
      const docRef = doc(db, "trips", dayPlan.tripId, "dayPlans", dayPlan.id);
      await updateDoc(docRef, data);
      console.log(`✅ Day plan updated: ${dayPlan.id}`);
      return dayPlan.id;
    } else {
      // Create new
      const newData = { ...data, createdAt: serverTimestamp() };
      const docRef = await addDoc(dayPlansRef, newData);
      console.log(`✅ Day plan created: ${docRef.id}`);
      return docRef.id;
    }
  } catch (error: any) {
    console.error("❌ Error saving day plan:", error);
    throw new Error(`Failed to save day plan: ${error.message}`);
  }
};

/**
 * Get all day plans for a trip
 */
export const getAllDayPlans = async (tripId: string): Promise<DayPlan[]> => {
  try {
    console.log(`🔍 Fetching all day plans for trip ${tripId}`);

    const dayPlansRef = collection(db, "trips", tripId, "dayPlans");
    const q = query(dayPlansRef, orderBy("dayIndex"));
    const snapshot = await getDocs(q);

    const dayPlans: DayPlan[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      dayPlans.push({
        id: doc.id,
        tripId,
        dayIndex: data.dayIndex,
        date: data.date?.toDate() || new Date(),
        notes: data.notes || [],
        todos: (data.todos || []).map((t: any) => ({
          ...t,
          createdAt: t.createdAt?.toDate() || new Date(),
        })),
        places: (data.places || []).map((p: any) => ({
          ...p,
          createdAt: p.createdAt?.toDate() || new Date(),
        })),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      });
    });

    console.log(`✅ Found ${dayPlans.length} day plans`);
    return dayPlans;
  } catch (error: any) {
    console.error("❌ Error fetching all day plans:", error);
    throw new Error(`Failed to fetch day plans: ${error.message}`);
  }
};

/**
 * Delete a day plan
 */
export const deleteDayPlan = async (
  tripId: string,
  dayPlanId: string,
): Promise<void> => {
  try {
    console.log(`🗑️ Deleting day plan ${dayPlanId}`);
    const docRef = doc(db, "trips", tripId, "dayPlans", dayPlanId);
    await deleteDoc(docRef);
    console.log(`✅ Day plan deleted`);
  } catch (error: any) {
    console.error("❌ Error deleting day plan:", error);
    throw new Error(`Failed to delete day plan: ${error.message}`);
  }
};
