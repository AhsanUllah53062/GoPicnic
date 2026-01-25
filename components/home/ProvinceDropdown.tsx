import { Picker } from "@react-native-picker/picker";
import { State } from "country-state-city";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

type ProvinceOption = {
  label: string;
  value: string;
};

type ProvinceDropdownProps = {
  onProvinceChange: (province: string) => void;
};

export default function ProvinceDropdown({
  onProvinceChange,
}: ProvinceDropdownProps) {
  const [provinces, setProvinces] = useState<ProvinceOption[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseGeocode = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode.length > 0) {
        const countryCode = reverseGeocode[0].isoCountryCode ?? undefined;
        if (countryCode) {
          const states = State.getStatesOfCountry(countryCode);
          const provinceOptions = [
            { label: "All Provinces", value: "all" },
            ...states.map((p) => ({
              label: p.name ?? "Unknown",
              value: p.name ?? "Unknown",
            })),
          ];
          setProvinces(provinceOptions);
        }
      }
    })();
  }, []);

  const handleChange = (value: string) => {
    setSelectedProvince(value);
    onProvinceChange(value);
  };

  if (errorMsg) {
    return <Text style={styles.error}>{errorMsg}</Text>;
  }

  return (
    <View style={styles.container}>
      {/* ✅ Show selected province name */}
      <Text style={styles.selectedText}>
        {selectedProvince === "all"
          ? "Showing All Provinces"
          : `Selected: ${selectedProvince}`}
      </Text>

      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={selectedProvince}
          onValueChange={handleChange}
          style={styles.picker}
        >
          {provinces.map((opt) => (
            <Picker.Item key={opt.value} label={opt.label} value={opt.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 8 },
  selectedText: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#000",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: "#fff",
  },
  picker: { height: 44, color: "#000" },
  error: { color: "red", fontSize: 14 },
});
