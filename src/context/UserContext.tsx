// src/context/UserContext.tsx
import { onAuthStateChanged, signOut } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { clearUserFromStorage } from "../../services/auth";
import { auth } from "../../services/firebase";
import {
  getUserPreferences,
  saveUserPreferences,
} from "../../services/profile";
import { DEFAULT_PREFERENCES, UserPreferences } from "../../types";

export type User = {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  dob?: string;
  avatar?: string;
  photoURL?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (u: User | null) => void;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthVerified: boolean;

  // ── Preferences ──────────────────────────────────────────────────────────
  userPreferences: UserPreferences | null;
  preferencesLoading: boolean;
  setUserPreferences: (prefs: UserPreferences) => Promise<void>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  const [userPreferences, setUserPreferencesState] =
    useState<UserPreferences | null>(null);
  const [preferencesLoading, setPreferencesLoading] = useState(false);

  // ── Auth listener ──────────────────────────────────────────────────────────
  useEffect(() => {
    let isMounted = true;
    let timeoutId: ReturnType<typeof setTimeout>;

    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn("⚠️ Firebase auth check timeout - no persisted session");
        setIsAuthVerified(false);
        setLoading(false);
      }
    }, 5000);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!isMounted) return;
      clearTimeout(timeoutId);

      if (firebaseUser) {
        console.log("🔐 Firebase user found:", firebaseUser.email);

        const userData: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || "User",
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || undefined,
          photoURL: firebaseUser.photoURL || undefined,
        };

        setUser(userData);
        setIsAuthVerified(true);
        setLoading(false);

        // Load preferences in background (non-blocking)
        loadPreferences(firebaseUser.uid);
      } else {
        console.log("❌ No Firebase user found");
        setUser(null);
        setIsAuthVerified(false);
        setLoading(false);
        setUserPreferencesState(null);
      }
    });

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      unsubscribe();
    };
  }, []);

  // ── Helpers ────────────────────────────────────────────────────────────────

  const loadPreferences = async (userId: string) => {
    try {
      setPreferencesLoading(true);
      const prefs = await getUserPreferences(userId);
      // Fall back to defaults so the UI never renders null
      setUserPreferencesState(prefs ?? DEFAULT_PREFERENCES);
    } catch (error) {
      console.error("❌ Failed to load preferences:", error);
      // Still set defaults so the screen is usable offline / on error
      setUserPreferencesState(DEFAULT_PREFERENCES);
    } finally {
      setPreferencesLoading(false);
    }
  };

  /**
   * Persist preferences to Firestore and update local context state.
   * Throws on Firestore failure so the UI can show an error.
   */
  const setUserPreferences = async (prefs: UserPreferences) => {
    if (!user) throw new Error("Cannot save preferences — no logged-in user");

    // Optimistic update first so the UI feels instant
    setUserPreferencesState(prefs);

    // Then persist to Firestore
    await saveUserPreferences(user.id, prefs);
  };

  // ── Logout ─────────────────────────────────────────────────────────────────

  const logout = async () => {
    try {
      console.log("🔓 Logging out user...");
      await clearUserFromStorage();
      await signOut(auth);
      setUser(null);
      setIsAuthVerified(false);
      setUserPreferencesState(null);
      setLoading(false);
      console.log("✅ User logged out successfully");
    } catch (error) {
      console.error("❌ Error during logout:", error);
      throw error;
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        isAuthVerified,
        userPreferences,
        preferencesLoading,
        setUserPreferences,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
};
