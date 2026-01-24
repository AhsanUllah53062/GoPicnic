import { useRouter } from 'expo-router';
import { Image, ImageSourcePropType, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type PlaceCardProps = {
  id: string;
  name: string;
  location: string;
  rating: number;
  temperature: string;
  image: ImageSourcePropType;   // local require for thumbnails
  imageUrl?: string;            // ✅ string for background in planning
  onStartPlanning?: () => void; // ✅ optional callback
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
    // Navigate to place details
    router.push({
      pathname: '/place/[id]',
      params: { id },
    });
  };

  return (
    <View style={styles.card}>
      <Pressable onPress={handlePress}>
        <Image source={image} style={styles.image} />
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.details}>
          {location} • {temperature}
        </Text>
        <Text style={styles.rating}>⭐ {rating}</Text>
      </Pressable>

      {/* Start Planning Button */}
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
    width: '100%',
    height: 100,
    borderRadius: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
  },
  details: {
    fontSize: 12,
    color: '#666',
  },
  rating: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  planBtn: {
    marginTop: 6,
    backgroundColor: '#007AFF',
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  planBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});
