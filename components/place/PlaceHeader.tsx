import { MaterialIcons } from "@expo/vector-icons";
import {
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
  name?: string;
  city?: string;
  province?: string;
  imageUrl?: string;
  onBack: () => void;
};

export default function PlaceHeader({
  name,
  city,
  province,
  imageUrl,
  onBack,
}: Props) {
  return (
    <ImageBackground
      source={{ uri: imageUrl }}
      style={styles.headerImage}
      imageStyle={styles.headerImageStyle}
    >
      <TouchableOpacity style={styles.backBtn} onPress={onBack}>
        <MaterialIcons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <View style={styles.overlay}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.subInfo}>
          {city}, {province}
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  headerImage: { width: "100%", height: 260, justifyContent: "flex-end" },
  headerImageStyle: { borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
  backBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 6,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#fff" },
  subInfo: { fontSize: 14, color: "#eee", marginTop: 4 },
});
