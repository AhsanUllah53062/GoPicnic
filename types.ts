import { ImageSourcePropType } from 'react-native';

export type Place = {
  id: string;
  name: string;
  location: string;
  temperature: string;
  rating: number;
  image: ImageSourcePropType; // local require
  imageUrl?: string;          // ✅ new string for background
  description: string;
  gallery?: (number | { uri: string })[];
  reviews?: string[];
};
