import {
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc
} from "firebase/firestore";
import { db } from "./firebase";

export type TrustBadge = "email" | "phone" | "id" | "license";

export type GearItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  condition: "excellent" | "good" | "fair";
};

export type EmergencyContact = {
  id: string;
  name: string;
  relationship: string;
  phone: string;
};

export type UserPreferences = {
  places: {
    terrain: string[];
    maxDistance: number;
    amenities: string[];
  };
  weather: {
    idealTemp: { min: number; max: number };
    rainAlerts: boolean;
  };
  people: {
    maxGroupSize: number;
    friendsOnlyCarpooling: boolean;
  };
  carpoolVibes: string[];
};

export type UserProfile = {
  userId: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  photoURL?: string;
  bio?: string;
  joinedDate: Date;
  trustBadges: TrustBadge[];

  // Stats
  stats: {
    tripsCompleted: number;
    carpoolMiles: number;
    seatsOffered: number;
    driverRating: number;
  };

  // Collections
  favoritePlaces: string[]; // Place IDs
  friends: string[]; // User IDs
  gearInventory: GearItem[];
  emergencyContacts: EmergencyContact[];

  // Preferences
  preferences: UserPreferences;

  // Documents (URLs)
  documents: {
    parkPasses?: string[];
    idCard?: string;
    license?: string;
    insurance?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
};

/**
 * Get user profile
 */
export const getUserProfile = async (
  userId: string,
): Promise<UserProfile | null> => {
  try {
    console.log("🔍 Fetching user profile:", userId);

    const profileRef = doc(db, "userProfiles", userId);
    const profileSnap = await getDoc(profileRef);

    if (profileSnap.exists()) {
      const data = profileSnap.data();
      return {
        ...data,
        joinedDate: data.joinedDate?.toDate() || new Date(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as UserProfile;
    }

    console.log("⚠️ Profile not found");
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching profile:", error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
};

/**
 * Create or update user profile
 */
export const saveUserProfile = async (
  profile: Partial<UserProfile> & { userId: string },
): Promise<void> => {
  try {
    console.log("💾 Saving user profile:", profile.userId);

    const profileRef = doc(db, "userProfiles", profile.userId);
    const existingProfile = await getDoc(profileRef);

    if (existingProfile.exists()) {
      // Update existing
      await updateDoc(profileRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      console.log("✅ Profile updated");
    } else {
      // Create new
      await setDoc(profileRef, {
        ...profile,
        joinedDate: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      console.log("✅ Profile created");
    }
  } catch (error: any) {
    console.error("❌ Error saving profile:", error);
    throw new Error(`Failed to save profile: ${error.message}`);
  }
};

/**
 * Update specific profile fields
 */
export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfile>,
): Promise<void> => {
  try {
    console.log("📝 Updating profile fields:", userId);

    const profileRef = doc(db, "userProfiles", userId);
    await updateDoc(profileRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Profile fields updated");
  } catch (error: any) {
    console.error("❌ Error updating profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};
