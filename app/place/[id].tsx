import { MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { places } from '../../data/places';

import Gallery from '../../components/Gallery';
import LocationModal from '../../components/LocationModal';
import ReviewsModal from '../../components/ReviewsModal';
import TemperatureModal from '../../components/TemperatureModal';

export default function PlaceDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const place = places.find((p) => p.id === id);

  const [showTemp, setShowTemp] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showReviews, setShowReviews] = useState(false);

  if (!place) return <Text>Place not found</Text>;

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)'); // fallback to your tabs root/home
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Back Arrow Icon */}
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={handleGoBack}
      />

      {/* Header Image */}
      <Image source={place.image} style={styles.image} />

      {/* Title + Info */}
      <Text style={styles.title}>{place.name}</Text>
      <Text style={styles.subInfo}>{place.location}</Text>

      {/* Description */}
      <Text style={styles.description}>{place.description}</Text>

      {/* Gallery */}
      {place.gallery && place.gallery.length > 0 && <Gallery images={place.gallery} />}

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowTemp(true)}>
          <Text>🌡️ {place.temperature}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => setShowMap(true)}>
          <Text>📍 Location</Text>
        </TouchableOpacity>
        {place.reviews && place.reviews.length > 0 && (
          <TouchableOpacity style={styles.actionBtn} onPress={() => setShowReviews(true)}>
            <Text>⭐ {place.rating}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Start Planning Button */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={() =>
            router.push({
              pathname: '/start-planning',
              params: { to: place.name, toImage: place.imageUrl || '' }, // ✅ anchored planning
            })
          }
        >
          <Text style={styles.primaryBtnText}>Start Planning</Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      <TemperatureModal
        visible={showTemp}
        onClose={() => setShowTemp(false)}
        temperature={place.temperature}
      />
      <LocationModal
        visible={showMap}
        onClose={() => setShowMap(false)}
        location={place.location}
      />
      {place.reviews && (
        <ReviewsModal
          visible={showReviews}
          onClose={() => setShowReviews(false)}
          reviews={place.reviews}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  backIcon: { marginBottom: 16 },
  image: { width: '100%', height: 200, borderRadius: 8, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subInfo: { fontSize: 14, color: '#666', marginBottom: 12 },
  description: { fontSize: 16, lineHeight: 22, marginBottom: 20 },
  actions: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  actionBtn: { padding: 10, backgroundColor: '#f2f2f2', borderRadius: 8 },
  buttonContainer: { marginTop: 10 },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
