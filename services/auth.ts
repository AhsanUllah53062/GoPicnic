import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

// Keys for AsyncStorage
const STORAGE_KEYS = {
  USER_DATA: "goPicnic_user_data",
  USER_ID: "goPicnic_user_id",
  USER_EMAIL: "goPicnic_user_email",
};

export type StoredUserData = {
  id: string;
  email: string;
  displayName: string;
  photoURL: string | null;
};

/**
 * Save user data to AsyncStorage after successful login
 */
export async function saveUserToStorage(userData: StoredUserData) {
  try {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.USER_DATA, JSON.stringify(userData)],
      [STORAGE_KEYS.USER_ID, userData.id],
      [STORAGE_KEYS.USER_EMAIL, userData.email],
    ]);
    console.log("✅ User saved to AsyncStorage");
  } catch (error) {
    console.error("❌ Error saving user to AsyncStorage:", error);
  }
}

/**
 * Retrieve saved user data from AsyncStorage
 */
export async function getStoredUser(): Promise<StoredUserData | null> {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    if (userData) {
      console.log("✅ User retrieved from AsyncStorage");
      return JSON.parse(userData);
    }
    return null;
  } catch (error) {
    console.error("❌ Error retrieving user from AsyncStorage:", error);
    return null;
  }
}

/**
 * Clear user data from AsyncStorage on logout
 */
export async function clearUserFromStorage() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.USER_EMAIL,
    ]);
    console.log("✅ User cleared from AsyncStorage");
  } catch (error) {
    console.error("❌ Error clearing user from AsyncStorage:", error);
  }
}

export async function registerUser(
  email: string,
  password: string,
  username: string,
  city: string,
  gender: string,
  phone: string,
  dob: string,
) {
  const userCredential: UserCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    username,
    city,
    gender,
    phone,
    dob,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    profileImage: "",
    favoritePlaces: [],
    preferences: [],
  });

  // Save user to AsyncStorage
  await saveUserToStorage({
    id: user.uid,
    email: user.email || "",
    displayName: username || user.displayName || "User",
    photoURL: user.photoURL || null,
  });

  return user;
}

export async function loginUser(email: string, password: string) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password,
  );
  const user = userCredential.user;

  // Save user to AsyncStorage
  await saveUserToStorage({
    id: user.uid,
    email: user.email || "",
    displayName: user.displayName || "User",
    photoURL: user.photoURL || null,
  });

  return userCredential;
}

export async function resetPassword(email: string) {
  return await sendPasswordResetEmail(auth, email);
}

export async function logoutUser() {
  // Clear AsyncStorage before signing out
  await clearUserFromStorage();
  return await signOut(auth);
}
