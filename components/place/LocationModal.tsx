import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { db } from "../../services/firebase";

type Props = {
  visible: boolean;
  onClose: () => void;
  placeId: string; // ✅ pass placeId instead of plain text
};

export default function LocationModal({ visible, onClose, placeId }: Props) {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!placeId) return;
      try {
        const ref = doc(db, "places", placeId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          if (data.latitude && data.longitude) {
            setCoords({ lat: data.latitude, lon: data.longitude });
          }
        }
      } catch (err) {
        console.error("Error fetching coordinates:", err);
      } finally {
        setLoading(false);
      }
    };
    if (visible) fetchCoords();
  }, [placeId, visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.content}>
          <Text style={styles.title}>Location</Text>

          {loading ? (
            <ActivityIndicator size="large" color="#000" />
          ) : coords ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: coords.lat,
                longitude: coords.lon,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{ latitude: coords.lat, longitude: coords.lon }}
                title="Place Location"
              />
            </MapView>
          ) : (
            <Text style={styles.error}>No coordinates available</Text>
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
    width: "90%",
    maxHeight: "80%",
  },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#000" },
  map: { width: "100%", height: 300, borderRadius: 12 },
  error: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginVertical: 20,
  },
  closeBtn: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
