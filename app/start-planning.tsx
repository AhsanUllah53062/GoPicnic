import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import LocationSearchModal from '../components/LocationSearchModal';

export default function StartPlanning() {
  const router = useRouter();
  const { to, toImage } = useLocalSearchParams<{ to?: string; toImage?: string }>();

  const isAnchored = !!to;

  const [fromLocation, setFromLocation] = useState<string | null>(null);
  const [toLocation, setToLocation] = useState<string | null>(to || null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  const [showFromModal, setShowFromModal] = useState(false);
  const [showToModal, setShowToModal] = useState(false);

  const [budget, setBudget] = useState<string>('');

  // background image state
  const [bgUri, setBgUri] = useState<string | undefined>(toImage);

  useEffect(() => {
    if (isAnchored && toImage) {
      setBgUri(toImage);
    }
  }, [isAnchored, toImage]);

  const handleContinue = () => {
    if (!fromLocation || !toLocation) {
      alert('Please select both locations');
      return;
    }
    if (!budget.trim()) {
      alert('Please enter a budget amount');
      return;
    }
    router.push({
      pathname: '/trip-details',
      params: {
        from: fromLocation,
        to: toLocation,
        start: startDate ? startDate.toDateString() : '',
        end: endDate ? endDate.toDateString() : '',
        budget: budget,
        toImage: bgUri || '', // ✅ pass background forward
      },
    });
  };

  return (
    <View style={styles.container}>
      {/* Hero background */}
      <ImageBackground
        source={
          bgUri
            ? { uri: bgUri }
            : require('../assets/faisal.jpg') // ✅ neutral background for free planning
        }
        style={styles.hero}
        imageStyle={styles.heroImage}
      >
        <Text style={styles.heroTitle}>
          {isAnchored ? `Plan your trip to ${to}` : 'Start a new trip'}
        </Text>
      </ImageBackground>

      {/* Back Arrow */}
      <MaterialIcons
        name="arrow-back"
        size={24}
        color="black"
        style={styles.backIcon}
        onPress={() => router.back()}
      />

      <Text style={styles.header}>Plan a new trip</Text>
      <Text style={styles.subHeader}>
        Build an itinerary and map out your upcoming travel plans.
      </Text>

      {/* From Where */}
      <TouchableOpacity style={styles.inputRow} onPress={() => setShowFromModal(true)}>
        <Text style={styles.label}>{fromLocation || 'From where?'}</Text>
        <MaterialIcons name="location-on" size={24} color="black" />
      </TouchableOpacity>

      {/* Where To */}
      <TouchableOpacity
        style={styles.inputRow}
        onPress={() => {
          if (!isAnchored) setShowToModal(true);
        }}
        disabled={isAnchored}
      >
        <Text style={[styles.label, isAnchored && styles.disabledLabel]}>
          {toLocation || 'Where to?'}
        </Text>
        <MaterialIcons name="location-on" size={24} color="black" />
      </TouchableOpacity>

      {/* Start Date */}
      <TouchableOpacity style={styles.inputRow} onPress={() => setShowStartPicker(true)}>
        <Text style={styles.label}>
          {startDate ? startDate.toDateString() : 'Start Date'}
        </Text>
        <MaterialIcons name="calendar-today" size={24} color="black" />
      </TouchableOpacity>
      {showStartPicker && (
        <DateTimePicker
          value={startDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowStartPicker(false);
            if (date) setStartDate(date);
          }}
        />
      )}

      {/* End Date */}
      <TouchableOpacity style={styles.inputRow} onPress={() => setShowEndPicker(true)}>
        <Text style={styles.label}>
          {endDate ? endDate.toDateString() : 'End Date'}
        </Text>
        <MaterialIcons name="calendar-today" size={24} color="black" />
      </TouchableOpacity>
      {showEndPicker && (
        <DateTimePicker
          value={endDate || new Date()}
          mode="date"
          display="default"
          onChange={(event, date) => {
            setShowEndPicker(false);
            if (date) setEndDate(date);
          }}
        />
      )}

      {/* Budget Input */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.textInput}
          placeholder="Enter Budget Amount"
          keyboardType="numeric"
          value={budget}
          onChangeText={setBudget}
        />
        <MaterialIcons name="attach-money" size={24} color="black" />
      </View>

      {/* Start Planning Button */}
      <TouchableOpacity style={styles.primaryBtn} onPress={handleContinue}>
        <Text style={styles.primaryBtnText}>Start Planning</Text>
      </TouchableOpacity>

      {/* Location Modals */}
      <LocationSearchModal
        visible={showFromModal}
        onClose={() => setShowFromModal(false)}
        onSelect={(loc) => setFromLocation(loc)}
      />
      <LocationSearchModal
        visible={showToModal}
        onClose={() => setShowToModal(false)}
        onSelect={(loc) => {
          setToLocation(loc);
          // ✅ update background dynamically for free planning
          if (!isAnchored) {
            // Example: map location to image URL if available
            // setBgUri(destinationImages[loc] || undefined);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  hero: { height: 180, justifyContent: 'flex-end', padding: 16 },
  heroImage: { resizeMode: 'cover' },
  heroTitle: { fontSize: 20, fontWeight: '700', color: '#fff' },
  backIcon: { marginBottom: 20 },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  subHeader: { fontSize: 14, color: '#666', marginBottom: 20 },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 14,
    marginBottom: 16,
  },
  label: { fontSize: 16, color: '#000', flex: 1 },
  disabledLabel: { color: '#888' },
  textInput: { fontSize: 16, color: '#000', flex: 1 },
  primaryBtn: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
