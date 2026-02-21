import { ButtonStyles, TypographyStyles } from "@/constants/componentStyles";
import { BorderRadius, Colors, Spacing } from "@/constants/styles";
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
    marginRight: Spacing.lg,
  },
  image: {
    width: "100%",
    height: 100,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.neutral.gray100,
  },
  name: {
    ...TypographyStyles.label,
    marginTop: Spacing.sm,
    color: Colors.text.primary,
  },
  details: {
    ...TypographyStyles.caption,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  rating: {
    ...TypographyStyles.caption,
    color: Colors.text.primary,
    marginTop: Spacing.xs,
  },
  planBtn: {
    marginTop: Spacing.md,
    ...ButtonStyles.primary,
    paddingVertical: Spacing.sm,
  },
  planBtnText: {
    ...TypographyStyles.label,
    color: Colors.neutral.white,
  },
});
