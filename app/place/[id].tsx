import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    BorderRadius,
    Colors,
    GlobalStyles,
    Spacing,
    TypographyStyles,
} from "../../constants/styles";
import { db } from "../../services/firebase";

import Gallery from "../../components/place/Gallery";
import LocationModal from "../../components/place/LocationModal";
import PlaceActions from "../../components/place/PlaceActions";
import PlaceHeader from "../../components/place/PlaceHeader";
import PlaceInfo from "../../components/place/PlaceInfo";
import ReviewsModal from "../../components/place/ReviewsModal";
import WeatherPage from "../../components/place/weather";

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [place, setPlace] = useState<any>(null);

  const [showMap, setShowMap] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const [showWeather, setShowWeather] = useState(false);

  useEffect(() => {
    const fetchPlace = async () => {
      if (!id) return;
      const ref = doc(db, "places", id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPlace({ id: snap.id, ...snap.data() });
      }
    };
    fetchPlace();
  }, [id]);

  if (!place) return <Text style={{ padding: 20 }}>Place not found</Text>;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <PlaceHeader
        name={place.name}
        city={place.city}
        province={place.province}
        imageUrl={place.gallery?.[0]}
        onBack={() =>
          router.canGoBack() ? router.back() : router.replace("/(tabs)")
        }
      />

      {/* Action Buttons */}
      <PlaceActions
        temperature={place.temperature}
        rating={place.rating}
        onTemp={() => setShowWeather(true)}
        onMap={() => setShowMap(true)}
        onReviews={() => setShowReviews(true)}
      />

      {/* Info Section */}
      <PlaceInfo
        description={place.description}
        tags={place.tags}
        activities={place.activities}
      />

      {/* Gallery */}
      {place.gallery && place.gallery.length > 0 && (
        <View style={styles.gallerySection}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <Gallery
            images={place.gallery.map((url: string) => ({ uri: url }))}
          />
        </View>
      )}

      {/* Start Planning Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push({
              pathname: "/trip-details/start-planning",
              params: {
                to: place.name ?? "",
                toImage: place.gallery?.[0] ?? "",
              },
            })
          }
        >
          <Text style={styles.primaryBtnText}>Start Planning</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <LocationModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        placeId={place.id}
      />

      <ReviewsModal
        visible={showReviews}
        onClose={() => setShowReviews(false)}
        placeId={place.id}
      />

      <Modal
        visible={showWeather}
        animationType="slide"
        onRequestClose={() => setShowWeather(false)}
      >
        <WeatherPage
          lat={place.latitude?.toString() ?? ""}
          lon={place.longitude?.toString() ?? ""}
          name={place.name ?? ""}
          onClose={() => setShowWeather(false)}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...GlobalStyles.screenContainer,
    backgroundColor: Colors.neutral.white,
  },
  sectionTitle: {
    ...TypographyStyles.h3,
    marginBottom: Spacing.md,
    color: Colors.text.primary,
    paddingHorizontal: Spacing.md,
  },
  gallerySection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  buttonContainer: { marginBottom: Spacing.xl, paddingHorizontal: Spacing.md },
  primaryBtn: {
    backgroundColor: Colors.text.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    shadowColor: Colors.shadow,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryBtnText: { color: Colors.neutral.white, ...TypographyStyles.label },
});
