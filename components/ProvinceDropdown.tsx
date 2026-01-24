import { Picker } from '@react-native-picker/picker';
import { State } from 'country-state-city';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ProvinceOption = {
  label: string;
  value: string;
};

export default function ProvinceDropdown() {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string | undefined>();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      // Ask for location permission
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current coordinates
      let location = await Location.getCurrentPositionAsync({});

      // Reverse geocode to get country code
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const countryCode = reverseGeocode[0].isoCountryCode ?? undefined;
        if (countryCode) {
          const states = State.getStatesOfCountry(countryCode);
          setProvinces(
            states.map((p) => ({
              label: p.name ?? 'Unknown',
              value: p.isoCode ?? 'N/A',
            }))
          );
        }
      }
    })();
  }, []);

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Province</Text>
      <Picker
        selectedValue={selectedProvince}
        onValueChange={(value) => setSelectedProvince(value)}
        style={styles.picker}
      >
        {provinces.map((opt) => (
          <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  picker: {
    backgroundColor: '#f2f2f2',
    borderRadius: 6,
  },
});
