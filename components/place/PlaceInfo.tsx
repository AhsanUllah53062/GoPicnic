import { StyleSheet, Text, View } from "react-native";

type Props = {
  description?: string;
  tags?: string[];
  activities?: string[];
};

export default function PlaceInfo({ description, tags, activities }: Props) {
  return (
    <View style={styles.container}>
      {/* Description */}
      {description && (
        <>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{description}</Text>
        </>
      )}

      {/* Tags */}
      {tags && tags.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Tags</Text>
          <View style={styles.tagsContainer}>
            {tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Activities */}
      {activities && activities.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Activities</Text>
          <View style={styles.activitiesContainer}>
            {activities.map((act) => (
              <View key={act} style={styles.activity}>
                <Text style={styles.activityText}>{act}</Text>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
    color: "#000",
  },
  description: { fontSize: 15, lineHeight: 22, color: "#444" },
  tagsContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 10 },
  tag: {
    backgroundColor: "#f2f2f2",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: { fontSize: 13, color: "#333" },
  activitiesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },
  activity: {
    backgroundColor: "#000",
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  activityText: { fontSize: 13, color: "#fff" },
});
