import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

export type Place = {
  id: string;
  name: string;
  city: string;
  province: string;
  description: string;
  gallery: string[];
  latitude: number;
  longitude: number;
  activities: string[];
  tags: string[];
  type: string;
  createdAt?: any;
  updatedAt?: any;
};

export async function fetchPlaces(): Promise<Place[]> {
  const q = query(collection(db, "places"), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Place[];
}
