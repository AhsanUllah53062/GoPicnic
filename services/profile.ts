// services/profile.ts
import type { UserPreferences } from "@/types";
import {
    collection,
    doc,
    getDoc,
    serverTimestamp,
    setDoc,
    updateDoc,
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

  stats: {
    tripsCompleted: number;
    carpoolMiles: number;
    seatsOffered: number;
    driverRating: number;
  };

  favoritePlaces: string[];
  friends: string[];
  gearInventory: GearItem[];
  emergencyContacts: EmergencyContact[];

  // Preferences stored inline on the profile doc (fast reads)
  preferences?: UserPreferences;

  documents: {
    parkPasses?: string[];
    idCard?: string;
    license?: string;
    insurance?: string;
  };

  createdAt?: Date;
  updatedAt?: Date;
};

// ─── Profile CRUD ──────────────────────────────────────────────────────────────

/**
 * Get user profile with default values for missing fields
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
        userId: data.userId || userId,
        displayName: data.displayName || "",
        email: data.email || "",
        phone: data.phone,
        address: data.address,
        photoURL: data.photoURL,
        bio: data.bio,
        joinedDate: data.joinedDate?.toDate() || new Date(),
        trustBadges: data.trustBadges || ["email"],
        stats: {
          tripsCompleted: data.stats?.tripsCompleted || 0,
          carpoolMiles: data.stats?.carpoolMiles || 0,
          seatsOffered: data.stats?.seatsOffered || 0,
          driverRating: data.stats?.driverRating || 0,
        },
        favoritePlaces: data.favoritePlaces || [],
        friends: data.friends || [],
        gearInventory: data.gearInventory || [],
        emergencyContacts: data.emergencyContacts || [],
        preferences: data.preferences,
        documents: data.documents || {},
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
      await updateDoc(profileRef, {
        ...profile,
        updatedAt: serverTimestamp(),
      });
      console.log("✅ Profile updated");
    } else {
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
    await setDoc(
      profileRef,
      {
        ...updates,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    console.log("✅ Profile fields updated");
  } catch (error: any) {
    console.error("❌ Error updating profile:", error);
    throw new Error(`Failed to update profile: ${error.message}`);
  }
};

// ─── Preferences Subcollection ─────────────────────────────────────────────────
//
//  Path: users/{userId}/preferences/{userId}
//  One document per user — the doc ID equals the userId for easy reads.

/**
 * Fetch user preferences from Firestore subcollection.
 * Returns null if the document does not yet exist.
 */
export const getUserPreferences = async (
  userId: string,
): Promise<UserPreferences | null> => {
  try {
    console.log("🔍 Fetching preferences for user:", userId);

    const prefsRef = doc(
      collection(db, "users", userId, "preferences"),
      userId,
    );
    const prefsSnap = await getDoc(prefsRef);

    if (prefsSnap.exists()) {
      console.log("✅ Preferences found");
      return prefsSnap.data() as UserPreferences;
    }

    console.log("⚠️ No preferences document — user will see defaults");
    return null;
  } catch (error: any) {
    console.error("❌ Error fetching preferences:", error);
    throw new Error(`Failed to fetch preferences: ${error.message}`);
  }
};

/**
 * Persist user preferences to Firestore subcollection.
 * Uses setDoc (merge: true) so it creates or overwrites cleanly.
 */
export const saveUserPreferences = async (
  userId: string,
  preferences: UserPreferences,
): Promise<void> => {
  try {
    console.log("💾 Saving preferences for user:", userId);

    // Write to subcollection: users/{userId}/preferences/{userId}
    const prefsRef = doc(
      collection(db, "users", userId, "preferences"),
      userId,
    );
    await setDoc(
      prefsRef,
      {
        ...preferences,
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );

    // Also mirror a lightweight copy on the main profile doc so other
    // features can read them without an extra subcollection fetch.
    const profileRef = doc(db, "userProfiles", userId);
    const profileSnap = await getDoc(profileRef);
    if (profileSnap.exists()) {
      await updateDoc(profileRef, {
        preferences,
        updatedAt: serverTimestamp(),
      });
    }

    console.log("✅ Preferences saved");
  } catch (error: any) {
    console.error("❌ Error saving preferences:", error);
    throw new Error(`Failed to save preferences: ${error.message}`);
  }
};
