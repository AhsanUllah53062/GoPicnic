import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type PlaceCardProps = {
  id: string;
  name: string;
  location: string;
  rating?: number;
  temperature?: string;
  image?: any; // can be require() or { uri }
  imageUrl?: string; // Firestore gallery URL
  onStartPlanning?: () => void;
};

export default function PlaceCard({
  id,
  name,
  location,
  rating,
  temperature,
  image,
  imageUrl,
  onStartPlanning,
}: PlaceCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/place/[id]",
      params: { id },
    });
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handlePress}>
        <Image
          source={image ? image : { uri: imageUrl }}
          style={styles.image}
        />
        <Text style={styles.name}>{name}</Text>
        {location && (
          <Text style={styles.details}>
            {location} {temperature ? `• ${temperature}` : ""}
          </Text>
        )}
        {rating !== undefined && <Text style={styles.rating}>⭐ {rating}</Text>}
      </Pressable>

      {onStartPlanning && (
        <TouchableOpacity style={styles.planBtn} onPress={onStartPlanning}>
          <Text style={styles.planBtnText}>Start Planning</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 15,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    backgroundColor: "#eee", // fallback background
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 6,
    color: "#000",
  },
  details: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  rating: {
    fontSize: 12,
    color: "#333",
    marginTop: 2,
  },
  planBtn: {
    marginTop: 8,
    backgroundColor: "#000",
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: "center",
  },
  planBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "600",
  },
});
