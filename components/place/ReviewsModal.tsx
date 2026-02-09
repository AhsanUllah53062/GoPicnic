import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { db } from "../../services/firebase";

type Review = {
  id: string;
  userName: string;
  comment: string;
  rating: number;
  createdAt?: any;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  placeId: string;
};

function timeAgo(timestamp: any): string {
  if (!timestamp?.seconds) return "";
  const now = new Date();
  const reviewDate = new Date(timestamp.seconds * 1000);
  const diffMs = now.getTime() - reviewDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 1) return "Today";
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export default function ReviewsModal({ visible, onClose, placeId }: Props) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!placeId) return;
      try {
        const q = query(
          collection(db, "places", placeId, "reviews"),
          orderBy("createdAt", "desc"),
        );
        const snap = await getDocs(q);
        const data: Review[] = snap.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Review, "id">),
        }));
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchReviews();
    }
  }, [placeId, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Customer Reviews</Text>

          {loading ? (
            <Text style={styles.loading}>Loading reviews...</Text>
          ) : reviews.length === 0 ? (
            <Text style={styles.noReviews}>No reviews yet.</Text>
          ) : (
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={styles.reviewCard}>
                  <View style={styles.headerRow}>
                    <Text style={styles.userName}>{item.userName}</Text>
                    <Text style={styles.verified}>Verified customer</Text>
                  </View>
                  <Text style={styles.rating}>⭐ {item.rating}</Text>
                  <Text style={styles.date}>{timeAgo(item.createdAt)}</Text>
                  <Text style={styles.comment}>{item.comment}</Text>
                </View>
              )}
            />
          )}

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  content: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    maxHeight: "75%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#000",
  },
  loading: { fontSize: 14, color: "#666", textAlign: "center" },
  noReviews: { fontSize: 14, color: "#666", textAlign: "center" },
  reviewCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  userName: { fontSize: 16, fontWeight: "600", color: "#000" },
  verified: {
    fontSize: 12,
    color: "#007AFF",
    backgroundColor: "#e6f0ff",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rating: { fontSize: 14, color: "#007AFF", marginTop: 4 },
  date: { fontSize: 12, color: "#999", marginBottom: 6 },
  comment: { fontSize: 14, color: "#444", lineHeight: 20 },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
