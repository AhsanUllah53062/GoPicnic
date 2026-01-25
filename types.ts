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
