// types.ts
import { ImageSourcePropType } from "react-native";

export type Place = {
  id: string;
  name: string;
  location: string;
  temperature: string;
  rating: number;
  image: ImageSourcePropType; // local require
  imageUrl?: string; // for background images
  description: string;
  gallery?: (number | { uri: string })[];
  reviews?: string[];
};

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

// ─── Preferences Types ───────────────────────────────────────────────────────

export type TerrainType =
  | "mountains"
  | "beach"
  | "forest"
  | "urban"
  | "desert"
  | "countryside";

export type AmenityType =
  | "parking"
  | "restrooms"
  | "picnic-area"
  | "playground"
  | "restaurant"
  | "shops";

export type CarpoolVibeType =
  | "no-smoking"
  | "music-lover"
  | "quiet-ride"
  | "chatty"
  | "pets-ok"
  | "ac-preference";

export type UserPreferences = {
  places: {
    terrain: TerrainType[];
    maxDistance: number;
    amenities: AmenityType[];
  };
  weather: {
    idealTemp: { min: number; max: number };
    rainAlerts: boolean;
  };
  people: {
    maxGroupSize: number;
    friendsOnlyCarpooling: boolean;
  };
  carpoolVibes: CarpoolVibeType[];
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  places: {
    terrain: [],
    maxDistance: 100,
    amenities: [],
  },
  weather: {
    idealTemp: { min: 15, max: 30 },
    rainAlerts: false,
  },
  people: {
    maxGroupSize: 10,
    friendsOnlyCarpooling: false,
  },
  carpoolVibes: [],
};
