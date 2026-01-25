import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Props = {
  temperature?: string;
  rating?: number;
  onTemp: () => void;
  onMap: () => void;
  onReviews: () => void;
};

export default function PlaceActions({
  temperature,
  rating,
  onTemp,
  onMap,
  onReviews,
}: Props) {
  return (
    <View style={styles.actions}>
      {/* Temperature Button */}
      <TouchableOpacity style={styles.actionBtn} onPress={onTemp}>
        <Text style={styles.actionText}>
          🌡️ {temperature ? temperature : "Temp"}
        </Text>
      </TouchableOpacity>

      {/* Location Button */}
      <TouchableOpacity style={styles.actionBtn} onPress={onMap}>
        <Text style={styles.actionText}>📍 Location</Text>
      </TouchableOpacity>

      {/* Reviews Button */}
      <TouchableOpacity style={styles.actionBtn} onPress={onReviews}>
        <Text style={styles.actionText}>
          ⭐ {rating !== undefined ? rating : "Reviews"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
    paddingHorizontal: 16,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 6,
    paddingVertical: 12,
    backgroundColor: "#000",
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: { fontSize: 14, color: "#fff", fontWeight: "600" },
});
