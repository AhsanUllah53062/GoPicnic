// app/(tabs)/index.tsx
import { GlobalStyles, TypographyStyles } from "@/constants/componentStyles";
import { Spacing } from "@/constants/styles";
import { useThemedStyles } from "@/hooks/useThemedStyles";
import { useEffect, useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import SectionHeader from "../../components/common/SectionHeader";
import PlaceCard from "../../components/home/PlaceCard";
import ProvinceDropdown from "../../components/home/ProvinceDropdown";
import { fetchPlaces, Place } from "../../services/places";

export default function Home() {
  const { colors } = useThemedStyles();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvince, setSelectedProvince] = useState("all");

  const styles = {
    container: {
      ...GlobalStyles.screenContainer,
      paddingHorizontal: Spacing.md,
      paddingTop: Spacing.xl,
    },
    header: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
    },
    logo: { width: 40, height: 40 },
    loadingContainer: {
      justifyContent: "center" as const,
      alignItems: "center" as const,
      ...GlobalStyles.screenContainer,
    },
    loadingText: {
      ...TypographyStyles.label,
      color: colors.text.primary,
    },
  };

  useEffect(() => {
    const loadPlaces = async () => {
      try {
        const data = await fetchPlaces();
        setPlaces(data);
      } catch (error) {
        console.error("Error fetching places:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPlaces();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading places...</Text>
      </View>
    );
  }

  const filteredPlaces =
    selectedProvince === "all"
      ? places
      : places.filter((p) => p.province === selectedProvince);

  const popularPlaces = filteredPlaces.slice(0, 2);
  const recommendedPlaces = filteredPlaces.slice(2);

  return (
    <View style={styles.container}>
      {/* Province Dropdown + Logo */}
      <View style={styles.header}>
        <ProvinceDropdown onProvinceChange={setSelectedProvince} />
        <Image source={require("../../assets/logo.png")} style={styles.logo} />
      </View>

      {/* Popular Places (✅ scrollable horizontally) */}
      <SectionHeader title="Popular Places" />
      <FlatList
        data={popularPlaces}
        horizontal
        renderItem={({ item }) => (
          <PlaceCard
            id={item.id}
            name={item.name}
            location={item.city}
            rating={5}
            temperature="25°C"
            image={{ uri: item.gallery[0] }}
            imageUrl={item.gallery[0]}
          />
        )}
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />

      {/* Recommended (vertical list) */}
      <SectionHeader title="Recommended for you" />
      <FlatList
        data={recommendedPlaces}
        renderItem={({ item }) => (
          <PlaceCard
            id={item.id}
            name={item.name}
            location={item.city}
            rating={5}
            temperature="25°C"
            image={{ uri: item.gallery[0] }}
            imageUrl={item.gallery[0]}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </View>
  );
}
